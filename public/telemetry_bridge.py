"""
SimSetApp — Live Telemetry Bridge (local companion)

Reads live telemetry from your sim and streams it to the SimSetApp
"Live Telemetry" dashboard over a local WebSocket (ws://localhost:3344).

The browser dashboard connects directly to this bridge — no cloud round-trip,
zero latency, and your data never leaves your machine.

Uses aiohttp which handles both HTTP (Chrome's PNA preflight) and WebSocket
upgrades on the same port natively — no fragile process_request hacks.

-----------------------------------------------------------------------------
ONE-CLICK (auto-detect — no flags needed):
    pip install aiohttp psutil
    python telemetry_bridge.py
    # launch your sim → the bridge detects it automatically and goes live

REAL SIM DATA (optional libraries, auto-detected when installed):
    iRacing:   pip install irsdk
    ACC:       pip install pyaccsharedmemory   (+ enable Shared Memory in ACC)

OPTIONS:
    --port 3344              WebSocket port (must match the URL in the app)
    --sim auto|mock|iracing|acc   Force a source (default: auto)
    --hz 20                  Update frequency (frames per second)

Frames: a flat JSON object with type:"telemetry" plus all fields while a sim
is live, and type:"status" heartbeats (sim, detected, reason) while waiting.
"""
import argparse
import asyncio
import json
import math
import random
import time
from datetime import datetime

try:
    from aiohttp import web, WSMsgType
except ImportError:
    raise SystemExit("Missing dependency. Install with:  pip install aiohttp")

DEFAULT_PORT = 3344


# ---------------------------------------------------------------------------
# Telemetry providers — each exposes .read() -> dict (or None) and .sim_name()
# ---------------------------------------------------------------------------
class MockProvider:
    """Realistic lap-by-lap GT3 telemetry so the dashboard works without a sim.

    Models a full race: warm-up, fluid gear shifts (RPM sawtooth with lift/blip),
    consistent tyre temps that build and stabilise, pressures that track
    temperature, gradual wear with lap-time degradation, a pit stop for fresh
    tyres/fuel, and a position change — then loops.
    """

    WAYPOINTS = [
        (0.00, 268), (0.09, 268), (0.13, 118), (0.18, 152),
        (0.24, 232), (0.28, 92), (0.33, 138), (0.40, 246),
        (0.50, 246), (0.54, 108), (0.60, 172), (0.66, 172),
        (0.70, 84), (0.76, 162), (0.82, 212), (0.88, 128),
        (0.95, 256), (1.00, 268),
    ]
    GEAR_MAX = [0, 92, 138, 184, 226, 262, 292]  # km/h at redline per gear
    AMBIENT = 25.0
    COLD_PRESSURE = 26.0
    TOTAL_LAPS = 18
    PIT_LAP = 9
    FUEL_START = 100.0
    FUEL_PER_LAP = 3.2
    LAP_LENGTH = 95.0  # seconds per lap

    def __init__(self):
        self.t = 0.0
        self.lap = 1
        self.lap_start = 0.0
        self.speed = 80.0
        self.gear = 2
        self.throttle = 0.0
        self.brake = 0.0
        self.steer = 0.0
        self.shift_timer = 0.0
        self.shift_dir = 0
        self.fuel = self.FUEL_START
        self.best = None
        self.lap_delta = None
        self.position = 4
        self.incidents = 0
        self._corner_dir = 1
        self._last_corner = False
        self._in_pit = False
        self._pit_timer = 0.0
        self.tyres = {
            "fl": {"temp_c": self.AMBIENT + 5, "wear_pct": 0.0},
            "fr": {"temp_c": self.AMBIENT + 4, "wear_pct": 0.0},
            "rl": {"temp_c": self.AMBIENT + 3, "wear_pct": 0.0},
            "rr": {"temp_c": self.AMBIENT + 3, "wear_pct": 0.0},
        }
        self._tyre_target = {"fl": 88, "fr": 84, "rl": 82, "rr": 81}
        self._tyre_wear_rate = {"fl": 1.15, "fr": 1.0, "rl": 0.95, "rr": 1.05}

    def sim_name(self):
        return "Mock Sim"

    def _target_speed(self, phase):
        wp = self.WAYPOINTS
        for i in range(len(wp) - 1):
            p0, s0 = wp[i]
            p1, s1 = wp[i + 1]
            if phase <= p1:
                f = (phase - p0) / (p1 - p0)
                f = f * f * (3 - 2 * f)  # smoothstep
                return s0 + (s1 - s0) * f
        return wp[-1][1]

    def read(self):
        dt = 0.05
        self.t += dt
        lap_time = self.t - self.lap_start
        phase = (lap_time % self.LAP_LENGTH) / self.LAP_LENGTH

        if self._in_pit:
            self._pit_timer -= dt
            self.speed = max(0.0, self.speed - 40 * dt)
            self.throttle = 0.0
            self.brake = 0.3 if self.speed > 5 else 0.0
            self.steer = 0.0
            self.gear = 1 if self.speed > 1 else 0
            for k in self.tyres:
                self.tyres[k]["temp_c"] += (self.AMBIENT + 30 - self.tyres[k]["temp_c"]) * 0.01
            self.fuel = min(self.FUEL_START, self.fuel + 8 * dt)
            if self._pit_timer <= 0:
                self._in_pit = False
                for k in self.tyres:
                    self.tyres[k]["wear_pct"] = 0.0
        else:
            target = self._target_speed(phase)
            diff = target - self.speed
            if diff > 0:
                self.speed += max(48 * dt, diff * 0.12)
            elif diff < 0:
                self.speed += min(-58 * dt, diff * 0.12)
            self.speed = max(0, min(300, self.speed))

            cur = self.gear
            rpm_now = (self.speed / self.GEAR_MAX[cur]) * 8000 if self.GEAR_MAX[cur] else 0
            if rpm_now > 7400 and cur < 6 and self.shift_timer <= 0:
                self.gear = cur + 1
                self.shift_timer = 0.18
                self.shift_dir = 1
            elif rpm_now < 3600 and cur > 1 and self.shift_timer <= 0:
                self.gear = cur - 1
                self.shift_timer = 0.16
                self.shift_dir = -1

            if self.shift_timer > 0:
                self.shift_timer -= dt
                self.throttle = 0.35 if self.shift_dir > 0 else 0.5
            elif diff > 2:
                self.throttle = 1.0 if target > 200 else 0.7
            elif diff > -2:
                self.throttle = 0.55 if target > 150 else 0.3
            else:
                self.throttle = 0.0

            self.brake = 0.0
            if diff < -2:
                self.brake = min(1.0, (-diff) / 90)
                self.throttle = 0.0

            corner = max(0.0, (200 - target) / 130)
            in_corner = corner > 0.15
            if in_corner and not self._last_corner:
                self._corner_dir *= -1
            self._last_corner = in_corner
            target_steer = self._corner_dir * corner if in_corner else 0.0
            self.steer += (target_steer - self.steer) * 0.2
            self.steer = max(-1.0, min(1.0, self.steer))

            load = corner * 8
            for k, ty in self.tyres.items():
                tgt = self._tyre_target[k] + load + random.uniform(-0.3, 0.3)
                ty["temp_c"] += (tgt - ty["temp_c"]) * 0.03
                ty["temp_c"] += random.uniform(-0.15, 0.15)

        rpm = (self.speed / self.GEAR_MAX[self.gear]) * 8000 if self.GEAR_MAX[self.gear] else 0
        rpm = max(800, min(8000, int(rpm)))

        last_lap_time = None
        if lap_time >= self.LAP_LENGTH:
            degradation = sum(t["wear_pct"] for t in self.tyres.values()) / 4 * 0.04
            last_lap_time = round(self.LAP_LENGTH + random.uniform(-0.25, 0.35) + degradation, 3)
            if self.best is None or last_lap_time < self.best:
                self.best = last_lap_time
            self.lap_delta = round(last_lap_time - self.best, 3)
            self.lap_start = self.t
            self.lap += 1
            self.fuel = max(0, self.fuel - self.FUEL_PER_LAP)
            for k in self.tyres:
                self.tyres[k]["wear_pct"] = min(100, self.tyres[k]["wear_pct"] + self._tyre_wear_rate[k])
            if self.lap == 6 and self.position > 1:
                self.position -= 1
            if self.lap == self.PIT_LAP + 1:
                self._in_pit = True
                self._pit_timer = 3.5
            if self.lap > self.TOTAL_LAPS:
                self.lap = 1
                self.fuel = self.FUEL_START
                self.best = None
                self.position = 4
                for k in self.tyres:
                    self.tyres[k]["wear_pct"] = 0.0
                    self.tyres[k]["temp_c"] = self.AMBIENT + 5
            lap_time = 0.0

        tyres = {}
        for k, ty in self.tyres.items():
            tyres[k] = {
                "temp_c": round(ty["temp_c"], 1),
                "wear_pct": round(ty["wear_pct"], 1),
                "pressure_psi": round(self.COLD_PRESSURE + (ty["temp_c"] - self.AMBIENT) * 0.06, 1),
            }

        return {
            "type": "telemetry", "ts": time.time(), "sim": self.sim_name(),
            "connected": True, "session_type": "Race", "track": "Silverstone GP (Mock)",
            "car": "GT3 Demo Car", "lap": self.lap, "total_laps": self.TOTAL_LAPS,
            "position": self.position, "incidents": self.incidents,
            "current_lap_time": round(lap_time, 3), "last_lap_time": last_lap_time,
            "best_lap_time": round(self.best, 3) if self.best else None,
            "lap_delta": self.lap_delta,
            "speed_kmh": round(self.speed, 1), "rpm": rpm, "max_rpm": 8000,
            "gear": self.gear, "throttle": round(self.throttle, 2),
            "brake": round(self.brake, 2), "steer": round(self.steer, 2),
            "fuel_litres": round(self.fuel, 1), "fuel_per_lap": self.FUEL_PER_LAP,
            "tyres": tyres,
        }

    def close(self):
        pass

    def close(self):
        pass


class iRacingProvider:
    """Reads iRacing telemetry via the irsdk library (pip install irsdk)."""

    def __init__(self):
        try:
            import irsdk
        except ImportError:
            raise  # make_provider reports "library not installed"
        self.irsdk = irsdk.IRSDK()
        self.connected = False
        self._fuel_start = None

    def sim_name(self):
        return "iRacing"

    def _ensure(self):
        if not self.irsdk.startup_and_check():
            self.connected = False
            return False
        self.connected = True
        return True

    def _g(self, ir, name, default=None):
        try:
            v = ir[name]
            return v if v is not None else default
        except Exception:
            return default

    def read(self):
        if not self._ensure():
            return None
        ir = self.irsdk
        speed_ms = self._g(ir, "Speed", 0) or 0
        fuel = self._g(ir, "FuelLevel")
        if self._fuel_start is None and fuel is not None:
            self._fuel_start = fuel
        tyres = {
            "fl": {"temp_c": round(self._g(ir, "LFtempCM", 0), 1), "wear_pct": round((self._g(ir, "LFwear", 0) or 0) * 100, 1), "pressure_psi": round(self._g(ir, "LFpressure", 0), 1)},
            "fr": {"temp_c": round(self._g(ir, "RFtempCM", 0), 1), "wear_pct": round((self._g(ir, "RFwear", 0) or 0) * 100, 1), "pressure_psi": round(self._g(ir, "RFpressure", 0), 1)},
            "rl": {"temp_c": round(self._g(ir, "LRtempCM", 0), 1), "wear_pct": round((self._g(ir, "LRwear", 0) or 0) * 100, 1), "pressure_psi": round(self._g(ir, "LRpressure", 0), 1)},
            "rr": {"temp_c": round(self._g(ir, "RRtempCM", 0), 1), "wear_pct": round((self._g(ir, "RRwear", 0) or 0) * 100, 1), "pressure_psi": round(self._g(ir, "RRpressure", 0), 1)},
        }
        return {
            "type": "telemetry", "ts": time.time(), "sim": self.sim_name(),
            "connected": True, "session_type": "Race", "track": self._g(ir, "TrackName", ""),
            "car": self._g(ir, "CarModel", ""), "lap": self._g(ir, "Lap", 1),
            "total_laps": self._g(ir, "SessionLapsRemain", 0) or 0,
            "position": self._g(ir, "PlayerCarPosition", 0) or 0,
            "incidents": self._g(ir, "PlayerCarMyIncidentCount", 0) or 0,
            "current_lap_time": round(self._g(ir, "LapCurrentTime", 0) or 0, 3),
            "last_lap_time": round(self._g(ir, "LapLastTime", 0), 3) if self._g(ir, "LapLastTime") else None,
            "best_lap_time": round(self._g(ir, "LapBestLapTime", 0), 3) if self._g(ir, "LapBestLapTime") else None,
            "lap_delta": None, "speed_kmh": round(speed_ms * 3.6, 1),
            "rpm": int(self._g(ir, "RPM", 0) or 0), "max_rpm": 8000,
            "gear": int(self._g(ir, "Gear", 0) or 0), "throttle": round(self._g(ir, "Throttle", 0) or 0, 2),
            "brake": round(self._g(ir, "Brake", 0) or 0, 2), "steer": round(self._g(ir, "SteeringWheelAngle", 0) or 0, 2),
            "fuel_litres": round(fuel, 1) if fuel is not None else None,
            "fuel_per_lap": None, "tyres": tyres,
        }

    def close(self):
        try:
            self.irsdk.shutdown()
        except Exception:
            pass


class ACCProvider:
    """ACC reads from shared memory via pyaccsharedmemory (pip install pyaccsharedmemory).

    ACC's shared memory is only populated inside a live session (practice,
    qualifying, race). On the main menu — or if Shared Memory is disabled in
    ACC Options — read_shared_memory() returns None and the bridge sends
    'detected, no_session' status frames so the dashboard can tell the user
    exactly what to do instead of a generic 'waiting for your sim'.
    """

    def __init__(self):
        try:
            from pyaccsharedmemory import accSharedMemory
        except ImportError:
            raise  # make_provider reports "library not installed"
        self.sm = accSharedMemory()

    def sim_name(self):
        return "Assetto Corsa Competizione"

    @staticmethod
    def _ms_to_s(ms):
        # ACC uses 0 (and occasionally huge sentinels) for "no time yet".
        if not ms or ms <= 0 or ms > 3600000:  # > 1 hour is not a real lap time
            return None
        return round(ms / 1000.0, 3)

    def read(self):
        sm = self.sm.read_shared_memory()
        if sm is None:
            return None  # ACC not in a live session — bridge sends status frames
        ph = sm.Physics
        g = sm.Graphics
        st = sm.Static

        def w(wheels, idx):
            try:
                return round(float([wheels.front_left, wheels.front_right,
                                    wheels.rear_left, wheels.rear_right][idx]), 1)
            except Exception:
                return 0

        temps = getattr(ph, "tyre_core_temp", None)
        pressures = getattr(ph, "wheel_pressure", None)
        tyres = {
            "fl": {"temp_c": w(temps, 0), "wear_pct": 0, "pressure_psi": w(pressures, 0)},
            "fr": {"temp_c": w(temps, 1), "wear_pct": 0, "pressure_psi": w(pressures, 1)},
            "rl": {"temp_c": w(temps, 2), "wear_pct": 0, "pressure_psi": w(pressures, 2)},
            "rr": {"temp_c": w(temps, 3), "wear_pct": 0, "pressure_psi": w(pressures, 3)},
        }
        return {
            "type": "telemetry", "ts": time.time(), "sim": self.sim_name(),
            "connected": True, "session_type": str(getattr(g, "session_type", "Race")),
            "track": getattr(st, "track", "") or "",
            "car": getattr(st, "car_model", "") or "",
            "lap": getattr(g, "completed_lap", 0) + 1,
            "total_laps": getattr(g, "number_of_laps", 0),
            "position": getattr(g, "position", 0),
            "incidents": 0,
            "current_lap_time": self._ms_to_s(getattr(g, "current_time", 0)),
            "last_lap_time": self._ms_to_s(getattr(g, "last_time", 0)),
            "best_lap_time": self._ms_to_s(getattr(g, "best_time", 0)),
            "lap_delta": None,
            "speed_kmh": round(getattr(ph, "speed_kmh", 0) or 0, 1),
            "rpm": int(getattr(ph, "rpm", 0) or 0),
            "max_rpm": int(getattr(st, "max_rpm", 8000) or 8000),
            "gear": int(getattr(ph, "gear", 0) or 0),
            "throttle": round(getattr(ph, "gas", 0) or 0, 2),
            "brake": round(getattr(ph, "brake", 0) or 0, 2),
            "steer": round(getattr(ph, "steer_angle", 0) or 0, 2),
            "fuel_litres": round(getattr(ph, "fuel", 0) or 0, 1),
            "fuel_per_lap": round(getattr(g, "fuel_per_lap", 0) or 0, 2) or None,
            "tyres": tyres,
        }

    def close(self):
        try:
            self.sm.close()
        except Exception:
            pass


PROVIDERS = {"mock": MockProvider, "iracing": iRacingProvider, "acc": ACCProvider}


# ---------------------------------------------------------------------------
# Sim auto-detection (psutil)
# ---------------------------------------------------------------------------
SIM_PROFILES = [
    ("iracing", ["iRacingSim64.exe", "iRacingSim64DX11.exe"], "iracing"),
    ("acc", ["acc.exe"], "acc"),
    ("ams2", ["AMS2.exe"], None),
    ("lmu", ["LMU.exe"], None),
    ("rf2", ["rFactor2.exe"], None),
]

_psutil = None
try:
    import psutil as _psutil  # noqa
except ImportError:
    _psutil = None


def detect_sim():
    if _psutil is None:
        return None
    try:
        names = {p.info["name"] for p in _psutil.process_iter(["name"]) if p.info.get("name")}
    except Exception:
        return None
    low = {n.lower() for n in names}
    for key, procs, prov in SIM_PROFILES:
        for n in procs:
            if n.lower() in low:
                return key, prov
    return None


def make_provider(key):
    """Construct a provider. Returns (provider, error_string).

    ImportError  -> error = "library not installed (...)"  (user can fix with pip)
    other errors -> error = "init failed: ..."            (printed verbatim, not
                  misreported as a missing library)
    """
    cls = PROVIDERS.get(key)
    if not cls:
        return None, None
    try:
        return cls(), None
    except ImportError as e:
        return None, f"library not installed ({e})"
    except Exception as e:
        return None, f"init failed: {e!r}"


# ---------------------------------------------------------------------------
# Shared state
# ---------------------------------------------------------------------------
clients = set()
state = {
    "provider": None, "sim": None, "manual": None,
    "warned_psutil": False, "warned_missing": set(),
    "no_data_since": None, "hinted_no_data": False, "read_error_logged": False,
}


def ts():
    return datetime.now().strftime("%H:%M:%S")


def _reset_provider_state():
    state["no_data_since"] = None
    state["hinted_no_data"] = False
    state["read_error_logged"] = False


# ---------------------------------------------------------------------------
# Sim detection loop
# ---------------------------------------------------------------------------
async def detect_loop():
    while True:
        if state["manual"]:
            if state["provider"] is None:
                p, err = make_provider(state["manual"])
                if p:
                    state["provider"] = p
                    state["sim"] = p.sim_name()
                    _reset_provider_state()
                    print(f"[{ts()}] source: {state['sim']}")
                elif err and state["manual"] not in state["warned_missing"]:
                    state["warned_missing"].add(state["manual"])
                    print(f"[{ts()}] {state['manual']}: {err}")
        else:
            if _psutil is None:
                if not state["warned_psutil"]:
                    state["warned_psutil"] = True
                    print("[hint] psutil not installed — auto-detect disabled. "
                          "Install with:  pip install psutil   (or use --sim <mock|iracing|acc>)")
            else:
                det = detect_sim()
                if det:
                    key, prov_key = det
                    if prov_key and state["provider"] is None:
                        p, err = make_provider(prov_key)
                        if p:
                            state["provider"] = p
                            state["sim"] = p.sim_name()
                            _reset_provider_state()
                            print(f"[{ts()}] detected {state['sim']}")
                        elif key not in state["warned_missing"]:
                            state["warned_missing"].add(key)
                            print(f"[{ts()}] detected {key} but {err}")
                    elif not prov_key and state["sim"] != key:
                        state["sim"] = key
                        print(f"[{ts()}] detected {key} (provider coming soon)")
                else:
                    if state["provider"] is not None:
                        try:
                            close = getattr(state["provider"], "close", None)
                            if close:
                                close()
                        except Exception:
                            pass
                        state["provider"] = None
                        state["sim"] = None
                        _reset_provider_state()
                        print(f"[{ts()}] sim closed — waiting…")
        await asyncio.sleep(2)


# ---------------------------------------------------------------------------
# Broadcast loop — sends telemetry or status frames to all connected clients
# ---------------------------------------------------------------------------
async def broadcast_loop(hz):
    interval = 1.0 / hz
    last_status = 0.0
    while True:
        frame = None
        if state["provider"]:
            try:
                frame = state["provider"].read()
            except Exception as e:
                if not state["read_error_logged"]:
                    state["read_error_logged"] = True
                    print(f"[{ts()}] read error from {state['sim']}: {e!r}")
                frame = None
        if frame is not None:
            state["no_data_since"] = None
            state["hinted_no_data"] = False
            state["read_error_logged"] = False
            msg = json.dumps(frame)
        else:
            # Provider present but no live session yet — track how long, and
            # after 10s print a one-time hint (ACC Shared Memory / start a session).
            if state["provider"] is not None:
                if state["no_data_since"] is None:
                    state["no_data_since"] = time.time()
                elif not state["hinted_no_data"] and (time.time() - state["no_data_since"]) > 10:
                    state["hinted_no_data"] = True
                    print(f"[{ts()}] hint: {state['sim']} is running but no telemetry yet. "
                          "For ACC, enable Shared Memory in Options → Assetto Corsa Competizione "
                          "and start a session — telemetry only streams inside practice/qualify/race.")
            now = time.time()
            if now - last_status >= 1.0:
                last_status = now
                detected = bool(state["sim"])
                reason = "no_session" if detected else None
                msg = json.dumps({
                    "type": "status", "bridge": True, "sim": state["sim"],
                    "detected": detected, "reason": reason,
                    "connected": False, "ts": now,
                })
            else:
                msg = None
        if msg and clients:
            dead = []
            for ws in list(clients):
                try:
                    await ws.send_str(msg)
                except Exception:
                    dead.append(ws)
            for ws in dead:
                clients.discard(ws)
        await asyncio.sleep(interval)


# ---------------------------------------------------------------------------
# aiohttp handlers
# ---------------------------------------------------------------------------
def _cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Private-Network": "true",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    }


async def handle_preflight(request):
    """Answer Chrome's PNA preflight (OPTIONS) — a normal HTTP request, not a hack."""
    print(f"[{ts()}] PNA preflight answered (200)")
    return web.Response(status=200, headers=_cors_headers())


async def handle_health(request):
    """Simple health check — visit localhost:3344/health in a browser."""
    return web.json_response({"bridge": True, "sim": state["sim"]}, headers=_cors_headers())


async def handle_websocket(request):
    """WebSocket upgrade — adds the client to the broadcast set."""
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    clients.add(ws)
    print(f"[{ts()}] dashboard connected ({len(clients)} client{'s' if len(clients) != 1 else ''})")
    try:
        async for msg in ws:
            if msg.type == WSMsgType.ERROR:
                break
    except Exception:
        pass
    finally:
        clients.discard(ws)
        print(f"[{ts()}] dashboard disconnected ({len(clients)} client{'s' if len(clients) != 1 else ''})")
    return ws


async def handle_root(request):
    """Root path — if it's a WebSocket upgrade, handle it; otherwise show health."""
    if request.headers.get("Upgrade", "").lower() == "websocket":
        return await handle_websocket(request)
    return await handle_health(request)


def build_app():
    app = web.Application()
    # PNA preflight — must be matched before the root handler
    app.router.add_route("OPTIONS", "/", handle_preflight)
    app.router.add_route("OPTIONS", "/ws", handle_preflight)
    app.router.add_route("OPTIONS", "/health", handle_preflight)
    # Health check
    app.router.add_get("/health", handle_health)
    # WebSocket endpoint
    app.router.add_get("/ws", handle_websocket)
    # Root — handles both WebSocket upgrades and health checks
    app.router.add_get("/", handle_root)
    return app


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
async def main():
    parser = argparse.ArgumentParser(description="SimSetApp Live Telemetry Bridge")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--sim", choices=["auto", "mock", "iracing", "acc"], default="auto")
    parser.add_argument("--hz", type=int, default=20)
    args = parser.parse_args()

    if args.sim != "auto":
        state["manual"] = args.sim

    print("=" * 60)
    print(" SimSetApp Telemetry Bridge (aiohttp)")
    print(f" Mode       : {'auto-detect' if args.sim == 'auto' else args.sim}")
    print(f" WebSocket  : ws://localhost:{args.port}/ws")
    print(f" Health     : http://localhost:{args.port}/health")
    print(f" Rate       : {args.hz} Hz")
    print("=" * 60)
    print("Open SimSetApp -> Live Telemetry -> Connect.\n")

    app = build_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "localhost", args.port)
    await site.start()
    print(f"[{ts()}] server listening on localhost:{args.port}")

    asyncio.create_task(detect_loop())
    await broadcast_loop(args.hz)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
