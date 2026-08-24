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
    ACC:       shared memory — see the ACC section at the bottom of this file

OPTIONS:
    --port 3344              WebSocket port (must match the URL in the app)
    --sim auto|mock|iracing|acc   Force a source (default: auto)
    --hz 20                  Update frequency (frames per second)

Frames: a flat JSON object with type:"telemetry" plus all fields while a sim
is live, and type:"status" heartbeats (sim:null) while waiting for a sim.
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
    """Generates realistic telemetry so the dashboard works without a sim."""

    def __init__(self):
        self.t = 0.0
        self.lap = 1
        self.total_laps = 20
        self.lap_start = 0.0
        self.lap_length = 82.0
        self.best = 81.2
        self.fuel = 95.0
        self.tyre_wear = 0.0
        self.position = 3
        self.incidents = 0

    def sim_name(self):
        return "Mock Sim"

    def _speed(self, phase):
        if phase < 0.15 or 0.45 < phase < 0.55 or phase > 0.90:
            return 245 + 25 * math.sin(phase * 18)
        return 125 + 55 * abs(math.sin(phase * 8))

    def read(self):
        self.t += 0.05
        lap_time = self.t - self.lap_start
        phase = (lap_time % self.lap_length) / self.lap_length
        speed = self._speed(phase)
        rpm = 3200 + (speed / 280) * 4800
        gear = max(1, min(6, int(speed / 45)))
        throttle = 1.0 if (phase < 0.13 or 0.47 < phase < 0.53 or phase > 0.92) else 0.35
        brake = 0.85 if (0.13 < phase < 0.18 or 0.53 < phase < 0.58) else 0.0
        steer = 0.35 * math.sin(phase * 12)

        last_lap_time = None
        lap_delta = None
        if lap_time >= self.lap_length:
            last_lap_time = round(self.lap_length + random.uniform(-0.4, 0.4), 3)
            self.lap_start = self.t
            self.lap += 1
            self.fuel = max(0, self.fuel - 3.1)
            self.tyre_wear = min(100, self.tyre_wear + 2.4)
            lap_delta = round(last_lap_time - self.best, 3)
            if last_lap_time < self.best:
                self.best = last_lap_time
            lap_time = 0.0

        tw = round(self.tyre_wear, 1)
        tyres = {
            "fl": {"temp_c": round(84 + random.uniform(-3, 3), 1), "wear_pct": tw, "pressure_psi": 27.8},
            "fr": {"temp_c": round(86 + random.uniform(-3, 3), 1), "wear_pct": tw, "pressure_psi": 27.9},
            "rl": {"temp_c": round(80 + random.uniform(-3, 3), 1), "wear_pct": round(tw * 1.1, 1), "pressure_psi": 27.6},
            "rr": {"temp_c": round(81 + random.uniform(-3, 3), 1), "wear_pct": round(tw * 1.1, 1), "pressure_psi": 27.7},
        }
        return {
            "type": "telemetry", "ts": time.time(), "sim": self.sim_name(),
            "connected": True, "session_type": "Race", "track": "Silverstone (Mock)",
            "car": "GT3 Demo Car", "lap": self.lap, "total_laps": self.total_laps,
            "position": self.position, "incidents": self.incidents,
            "current_lap_time": round(lap_time, 3), "last_lap_time": last_lap_time,
            "best_lap_time": round(self.best, 3), "lap_delta": lap_delta,
            "speed_kmh": round(speed, 1), "rpm": int(rpm), "max_rpm": 8000,
            "gear": gear, "throttle": round(throttle, 2), "brake": round(brake, 2),
            "steer": round(steer, 2), "fuel_litres": round(self.fuel, 1),
            "fuel_per_lap": 3.1, "tyres": tyres,
        }


class iRacingProvider:
    """Reads iRacing telemetry via the irsdk library (pip install irsdk)."""

    def __init__(self):
        try:
            import irsdk
        except ImportError:
            raise SystemExit("iRacing provider needs: pip install irsdk")
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


class ACCProvider:
    """ACC reads from shared memory. See README for the pyaccsharedmemory setup."""

    def __init__(self):
        try:
            import acc_shared_memory as asm  # noqa
            self.sm = asm.AccessSharedMemory()
        except Exception:
            raise SystemExit(
                "ACC provider needs the ACC shared-memory bindings. "
                "See companion/README.md for setup."
            )

    def sim_name(self):
        return "Assetto Corsa Competizione"

    def read(self):
        s = self.sm.read_graphics()
        ph = self.sm.read_physics()
        tyres = {
            "fl": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[0], 1), "wear_pct": 0, "pressure_psi": 0},
            "fr": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[1], 1), "wear_pct": 0, "pressure_psi": 0},
            "rl": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[2], 1), "wear_pct": 0, "pressure_psi": 0},
            "rr": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[3], 1), "wear_pct": 0, "pressure_psi": 0},
        }
        return {
            "type": "telemetry", "ts": time.time(), "sim": self.sim_name(),
            "connected": True, "session_type": "Race", "track": getattr(s, "track", ""),
            "car": getattr(s, "carModel", ""), "lap": getattr(s, "completedLaps", 0) + 1,
            "total_laps": getattr(s, "numberOfLaps", 0), "position": getattr(s, "position", 0),
            "incidents": 0, "current_lap_time": round(getattr(s, "currentTime", 0), 3),
            "last_lap_time": round(getattr(s, "lastTime", 0), 3) or None,
            "best_lap_time": round(getattr(s, "bestTime", 0), 3) or None,
            "lap_delta": None, "speed_kmh": round(getattr(ph, "speedKmh", 0), 1),
            "rpm": int(getattr(ph, "rpms", 0)), "max_rpm": 8000,
            "gear": int(getattr(ph, "gear", 0)), "throttle": round(getattr(ph, "gas", 0), 2),
            "brake": round(getattr(ph, "brake", 0), 2), "steer": round(getattr(ph, "steer", 0), 2),
            "fuel_litres": round(getattr(ph, "fuel", 0), 1), "fuel_per_lap": None, "tyres": tyres,
        }


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
    cls = PROVIDERS.get(key)
    if not cls:
        return None
    try:
        return cls()
    except SystemExit:
        return None
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Shared state
# ---------------------------------------------------------------------------
clients = set()
state = {"provider": None, "sim": None, "manual": None, "warned_psutil": False, "warned_missing": set()}


def ts():
    return datetime.now().strftime("%H:%M:%S")


# ---------------------------------------------------------------------------
# Sim detection loop
# ---------------------------------------------------------------------------
async def detect_loop():
    while True:
        if state["manual"]:
            if state["provider"] is None:
                p = make_provider(state["manual"])
                if p:
                    state["provider"] = p
                    state["sim"] = p.sim_name()
                    print(f"[{ts()}] source: {state['sim']}")
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
                        p = make_provider(prov_key)
                        if p:
                            state["provider"] = p
                            state["sim"] = p.sim_name()
                            print(f"[{ts()}] detected {state['sim']}")
                        elif key not in state["warned_missing"]:
                            state["warned_missing"].add(key)
                            print(f"[{ts()}] detected {key} but its telemetry library isn't installed — see README")
                    elif not prov_key and state["sim"] != key:
                        state["sim"] = key
                        print(f"[{ts()}] detected {key} (provider coming soon)")
                else:
                    if state["provider"] is not None:
                        try:
                            ir = getattr(state["provider"], "irsdk", None)
                            if ir:
                                ir.shutdown()
                        except Exception:
                            pass
                        state["provider"] = None
                        state["sim"] = None
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
            except Exception:
                frame = None
        if frame is not None:
            msg = json.dumps(frame)
        else:
            now = time.time()
            if now - last_status >= 1.0:
                last_status = now
                msg = json.dumps({"type": "status", "bridge": True, "sim": state["sim"], "connected": False, "ts": now})
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