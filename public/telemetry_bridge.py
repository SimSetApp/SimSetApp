"""
SimSetApp — Live Telemetry Bridge (local companion)

Reads live telemetry from your sim and streams it to the SimSetApp
"Live Telemetry" dashboard over a local WebSocket (ws://localhost:3344).

The browser dashboard connects directly to this bridge — no cloud round-trip,
zero latency, and your data never leaves your machine.

-----------------------------------------------------------------------------
ONE-CLICK (auto-detect — no flags needed):
    pip install websockets psutil
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
    import websockets
except ImportError:
    raise SystemExit("Missing dependency. Install with:  pip install websockets")

DEFAULT_PORT = 3344


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


def safe(v, default=None):
    return v if v is not None else default


class MockProvider:
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


clients = set()
state = {"provider": None, "sim": None, "manual": None, "warned_psutil": False, "warned_missing": set()}


async def detect_loop():
    while True:
        if state["manual"]:
            if state["provider"] is None:
                p = make_provider(state["manual"])
                if p:
                    state["provider"] = p
                    state["sim"] = p.sim_name()
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] source: {state['sim']}")
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
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] detected {state['sim']}")
                        elif key not in state["warned_missing"]:
                            state["warned_missing"].add(key)
                            print(f"[{datetime.now().strftime('%H:%M:%S')}] detected {key} but its telemetry library isn't installed — see README")
                    elif not prov_key and state["sim"] != key:
                        state["sim"] = key
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] detected {key} (provider coming soon)")
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
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] sim closed — waiting…")
        await asyncio.sleep(2)


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
            for c in list(clients):
                try:
                    await c.send(msg)
                except Exception:
                    dead.append(c)
            for c in dead:
                clients.discard(c)
        await asyncio.sleep(interval)


def _pna_headers():
    return [
        ("Access-Control-Allow-Origin", "*"),
        ("Access-Control-Allow-Private-Network", "true"),
        ("Access-Control-Allow-Methods", "GET, OPTIONS"),
        ("Access-Control-Allow-Headers", "*"),
    ]


def _is_pna(headers):
    if not headers:
        return False
    try:
        return headers.get("Access-Control-Request-Private-Network", "").lower() == "true"
    except Exception:
        return False


def process_request(conn_or_path, request_or_headers):
    """Answer Chrome's Private Network Access (PNA) preflight.

    Chrome blocks public-origin (HTTPS) web pages from reaching local/private
    network services unless the service responds to the CORS preflight (an
    OPTIONS request carrying Access-Control-Request-Private-Network: true)
    with Access-Control-Allow-Private-Network: true.

    Without this, the Live Telemetry dashboard gets
    ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS.

    Uses connection.respond() — the documented stable API in websockets >= 14
    — with fallbacks for older versions.
    """
    # websockets >= 14: (connection, request) with request.method / request.headers
    if not isinstance(conn_or_path, str):
        connection = conn_or_path
        request = request_or_headers
        method = getattr(request, "method", "GET")
        headers = getattr(request, "headers", None)
        if method != "OPTIONS" and not _is_pna(headers):
            return None  # normal WebSocket upgrade — proceed with handshake

        print(f"[{datetime.now().strftime('%H:%M:%S')}] PNA preflight answered (200)")

        # Primary: connection.respond() — documented stable API (websockets 14+)
        try:
            from http import HTTPStatus
            from websockets.datastructures import Headers
            return connection.respond(HTTPStatus.OK, b"", Headers(_pna_headers()))
        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] respond() failed ({e}), trying fallback")
        # Fallback 1: construct Response directly
        try:
            from websockets.http11 import Response
            from websockets.datastructures import Headers
            return Response(200, "OK", Headers(_pna_headers()), b"")
        except ImportError:
            pass
        # Fallback 2: legacy tuple
        return (200, _pna_headers(), b"")

    # legacy websockets < 14: (path, request_headers)
    headers = request_or_headers
    if not _is_pna(headers):
        return None
    print(f"[{datetime.now().strftime('%H:%M:%S')}] PNA preflight answered (legacy 200)")
    return (200, _pna_headers(), b"")


async def handler(ws):
    clients.add(ws)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] dashboard connected")
    try:
        async for _msg in ws:
            pass
    except Exception:
        pass
    finally:
        clients.discard(ws)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] dashboard disconnected")


async def main():
    parser = argparse.ArgumentParser(description="SimSetApp Live Telemetry Bridge")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--sim", choices=["auto", "mock", "iracing", "acc"], default="auto")
    parser.add_argument("--hz", type=int, default=20)
    args = parser.parse_args()

    if args.sim != "auto":
        state["manual"] = args.sim

    print("=" * 60)
    print(" SimSetApp Telemetry Bridge")
    print(f" Mode   : {'auto-detect' if args.sim == 'auto' else args.sim}")
    print(f" WebSocket : ws://localhost:{args.port}")
    print(f" Rate   : {args.hz} Hz")
    print("=" * 60)
    print("Open SimSetApp -> Live Telemetry -> Connect.\n")

    async with websockets.serve(handler, "localhost", args.port, process_request=process_request):
        asyncio.create_task(detect_loop())
        await broadcast_loop(args.hz)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
