"""
SimSetApp — Live Telemetry Bridge (local companion)

Reads live telemetry from your sim and streams it to the SimSetApp
"Live Telemetry" dashboard over a local WebSocket (ws://localhost:3344).

The browser dashboard connects directly to this bridge — no cloud round-trip,
zero latency, and your data never leaves your machine.

---------------------------------------------------------------------------
QUICK START (no sim needed — mock data):
    pip install websockets
    python telemetry_bridge.py
    # then open SimSetApp → Live Telemetry → Connect

REAL SIM DATA:
    iRacing:   pip install irsdk
               python telemetry_bridge.py --sim iracing
    ACC:       (shared memory) see ACC section at the bottom of this file
               python telemetry_bridge.py --sim acc

OPTIONS:
    --port 3344        WebSocket port (must match the URL in the app)
    --sim mock|iracing|acc   Telemetry source (default: mock)
    --hz 20            Update frequency (frames per second)

The frame format is a flat JSON object with type:"telemetry" plus all fields.
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


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def now_iso():
    return datetime.utcnow().isoformat() + "Z"


def safe(v, default=None):
    return v if v is not None else default


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
            "type": "telemetry",
            "ts": time.time(),
            "sim": self.sim_name(),
            "connected": True,
            "session_type": "Race",
            "track": "Silverstone (Mock)",
            "car": "GT3 Demo Car",
            "lap": self.lap,
            "total_laps": self.total_laps,
            "position": self.position,
            "incidents": self.incidents,
            "current_lap_time": round(lap_time, 3),
            "last_lap_time": last_lap_time,
            "best_lap_time": round(self.best, 3),
            "lap_delta": lap_delta,
            "speed_kmh": round(speed, 1),
            "rpm": int(rpm),
            "max_rpm": 8000,
            "gear": gear,
            "throttle": round(throttle, 2),
            "brake": round(brake, 2),
            "steer": round(steer, 2),
            "fuel_litres": round(self.fuel, 1),
            "fuel_per_lap": 3.1,
            "tyres": tyres,
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
            "type": "telemetry",
            "ts": time.time(),
            "sim": self.sim_name(),
            "connected": True,
            "session_type": "Race",
            "track": self._g(ir, "TrackName", ""),
            "car": self._g(ir, "CarModel", ""),
            "lap": self._g(ir, "Lap", 1),
            "total_laps": self._g(ir, "SessionLapsRemain", 0) or 0,
            "position": self._g(ir, "PlayerCarPosition", 0) or 0,
            "incidents": self._g(ir, "PlayerCarMyIncidentCount", 0) or 0,
            "current_lap_time": round(self._g(ir, "LapCurrentTime", 0) or 0, 3),
            "last_lap_time": round(self._g(ir, "LapLastTime", 0), 3) if self._g(ir, "LapLastTime") else None,
            "best_lap_time": round(self._g(ir, "LapBestLapTime", 0), 3) if self._g(ir, "LapBestLapTime") else None,
            "lap_delta": None,
            "speed_kmh": round(speed_ms * 3.6, 1),
            "rpm": int(self._g(ir, "RPM", 0) or 0),
            "max_rpm": 8000,
            "gear": int(self._g(ir, "Gear", 0) or 0),
            "throttle": round(self._g(ir, "Throttle", 0) or 0, 2),
            "brake": round(self._g(ir, "Brake", 0) or 0, 2),
            "steer": round(self._g(ir, "SteeringWheelAngle", 0) or 0, 2),
            "fuel_litres": round(fuel, 1) if fuel is not None else None,
            "fuel_per_lap": None,
            "tyres": tyres,
        }


class ACCProvider:
    """ACC reads from shared memory. See README for the pyaccsharedmemory setup.
    This is a thin stub — fill in the mapping once pyaccsharedmemory is installed."""

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
        s = self.sm.read_graphics()  # adjust to your binding's API
        ph = self.sm.read_physics()
        tyres = {
            "fl": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[0], 1), "wear_pct": 0, "pressure_psi": 0},
            "fr": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[1], 1), "wear_pct": 0, "pressure_psi": 0},
            "rl": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[2], 1), "wear_pct": 0, "pressure_psi": 0},
            "rr": {"temp_c": round(getattr(ph, "tyreTemp", [0, 0, 0, 0])[3], 1), "wear_pct": 0, "pressure_psi": 0},
        }
        return {
            "type": "telemetry",
            "ts": time.time(),
            "sim": self.sim_name(),
            "connected": True,
            "session_type": "Race",
            "track": getattr(s, "track", ""),
            "car": getattr(s, "carModel", ""),
            "lap": getattr(s, "completedLaps", 0) + 1,
            "total_laps": getattr(s, "numberOfLaps", 0),
            "position": getattr(s, "position", 0),
            "incidents": 0,
            "current_lap_time": round(getattr(s, "currentTime", 0), 3),
            "last_lap_time": round(getattr(s, "lastTime", 0), 3) or None,
            "best_lap_time": round(getattr(s, "bestTime", 0), 3) or None,
            "lap_delta": None,
            "speed_kmh": round(getattr(ph, "speedKmh", 0), 1),
            "rpm": int(getattr(ph, "rpms", 0)),
            "max_rpm": 8000,
            "gear": int(getattr(ph, "gear", 0)),
            "throttle": round(getattr(ph, "gas", 0), 2),
            "brake": round(getattr(ph, "brake", 0), 2),
            "steer": round(getattr(ph, "steer", 0), 2),
            "fuel_litres": round(getattr(ph, "fuel", 0), 1),
            "fuel_per_lap": None,
            "tyres": tyres,
        }


PROVIDERS = {"mock": MockProvider, "iracing": iRacingProvider, "acc": ACCProvider}


# ---------------------------------------------------------------------------
# WebSocket server
# ---------------------------------------------------------------------------
async def handler(websocket, provider, hz):
    clients = set()
    clients.add(websocket)
    interval = 1.0 / hz
    try:
        async for _msg in websocket:
            pass  # ignore inbound; this is a broadcast server
    except Exception:
        pass


async def broadcast(websocket, provider, hz):
    interval = 1.0 / hz
    while True:
        frame = provider.read()
        if frame is not None:
            try:
                await websocket.send(json.dumps(frame))
            except Exception:
                break
        await asyncio.sleep(interval)


async def main():
    parser = argparse.ArgumentParser(description="SimSetApp Live Telemetry Bridge")
    parser.add_argument("--port", type=int, default=3344)
    parser.add_argument("--sim", choices=list(PROVIDERS.keys()), default="mock")
    parser.add_argument("--hz", type=int, default=20)
    args = parser.parse_args()

    provider = PROVIDERS[args.sim]()
    print("=" * 60)
    print(f" SimSetApp Telemetry Bridge")
    print(f" Source : {provider.sim_name()}")
    print(f" WebSocket : ws://localhost:{args.port}")
    print(f" Rate   : {args.hz} Hz")
    print("=" * 60)
    print("Open SimSetApp -> Live Telemetry -> Connect.\n")

    async def conn(ws):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] dashboard connected")
        await broadcast(ws, provider, args.hz)
        print(f"[{datetime.now().strftime('%H:%M:%S')}] dashboard disconnected")

    async with websockets.serve(conn, "localhost", args.port):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")
