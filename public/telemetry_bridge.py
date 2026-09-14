"""
SimSetApp — Universal Live Telemetry Bridge (Phase 1: 8 sims)

Reads live telemetry from your sim and streams it to the SimSetApp
"Live Telemetry" dashboard over a local WebSocket (ws://<this-PC>:3344/ws).

The browser dashboard connects directly to this bridge — no cloud round-trip,
zero latency, and your data never leaves your machine. Works on PC and on a
mobile device on the same WiFi (enter the PC's LAN IP in the app).

SUPPORTED SIMS (Phase 1)
  Shared memory (PC only — run bridge as admin if the sim runs as admin):
    iRacing            — pip install irsdk            (+ irsdkEnableMem=1 in app.ini)
    ACC                — pip install pyaccsharedmemory (+ enable Shared Memory in Options)
    Assetto Corsa      — ctypes (no extra dep)         (+ admin rights must match)
    rFactor 2 / LMU    — pip install pyrfactor2sharedmemory (+ install the SM plugin)
    Automobilista 2    — ctypes (no extra dep)         (+ set Shared Memory = "Project CARS 2")
  UDP (PC + consoles — telemetry must be enabled in-game):
    F1 2023/2024       — port 20777 (enable UDP Telemetry in game)
    Forza FM/FH        — port 5300  (enable Data Out = "Dash" in game)
    Gran Turismo 7     — port 33740 (PS5) — pass --gt7-ps5-ip <your-PS5-IP>

Uses aiohttp (handles HTTP PNA preflight + WebSocket upgrades on one port).

ONE-CLICK (auto-detect — no flags needed):
    pip install aiohttp psutil
    python telemetry_bridge.py
    # launch your sim → the bridge detects it automatically and goes live

REAL SIM DATA (optional libraries, auto-detected when installed):
    pip install irsdk pyaccsharedmemory pyrfactor2sharedmemory
    # GT7 needs one of:  pip install salsa20   OR   pip install pycryptodome

OPTIONS:
    --port 3344              WebSocket port (must match the URL in the app)
    --sim auto|mock|iracing|acc|ac|rf2|lmu|ams2|f1|forza|gt7   Force a source
    --hz 20                  Update frequency (frames per second)
    --f1-port 20777          F1 UDP port (if you changed it in-game)
    --forza-port 5300        Forza Data Out port (if you changed it in-game)
    --gt7-port 33740         GT7 receive port (33740 is the GT7 default)
    --gt7-ps5-ip <ip>        PS5 IP for GT7 (sends heartbeat so GT7 starts streaming)

Frames: a flat JSON object with type:"telemetry" plus all fields while a sim
is live, and type:"status" heartbeats (sim, detected, reason) while waiting.
"""
import argparse
import asyncio
import json
import math
import random
import socket
import struct
import time
from datetime import datetime

try:
    from aiohttp import web, WSMsgType
except ImportError:
    raise SystemExit("Missing dependency. Install with:  pip install aiohttp")

DEFAULT_PORT = 3344


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _b(v, lo, hi):
    """Bounds-check a numeric value; return None if out of range or NaN."""
    if v is None:
        return None
    try:
        v = float(v)
    except (TypeError, ValueError):
        return None
    if v != v or v < lo or v > hi:  # NaN or out of bounds
        return None
    return v


def _tyres(temps=None, wears=None, pressures=None):
    """Build the unified tyres dict. FL, FR, RL, RR."""
    out = {}
    for i, k in enumerate(["fl", "fr", "rl", "rr"]):
        t = _b(temps[i] if temps else None, -20, 200)
        w = _b(wears[i] if wears else None, 0, 1.2)
        p = _b(pressures[i] if pressures else None, 0, 100)
        out[k] = {
            "temp_c": round(t, 1) if t is not None else None,
            "wear_pct": round(w * 100, 1) if w is not None else None,
            "pressure_psi": round(p, 1) if p is not None else None,
        }
    return out


def base_frame(sim):
    return {
        "type": "telemetry", "ts": time.time(), "sim": sim, "connected": True,
        "session_type": None, "track": None, "car": None,
        "lap": None, "total_laps": None, "position": None, "incidents": None,
        "current_lap_time": None, "last_lap_time": None, "best_lap_time": None,
        "lap_delta": None, "speed_kmh": None, "rpm": None, "max_rpm": None,
        "gear": None, "throttle": None, "brake": None, "steer": None,
        "fuel_litres": None, "fuel_per_lap": None, "fuel_required": None,
        "avg_lap_time": None, "time_remaining": None,
        "air_temp": None, "track_temp": None, "boost": None, "brake_bias": None,
        "tc1": None, "tc2": None, "abs": None, "map": None,
        "car_ahead_gap": None, "car_behind_gap": None, "tyres": None,
    }


# ---------------------------------------------------------------------------
# Windows shared-memory reader (used by AC and AMS2)
# ---------------------------------------------------------------------------
def open_shared_memory(name, struct_type):
    """Open a Windows memory-mapped file and return (struct, raw_bytes) or (None, None)."""
    try:
        kernel32 = ctypes.windll.kernel32
    except (AttributeError, OSError):
        return None, None  # not Windows
    FILE_MAP_READ = 0x0004
    try:
        h = kernel32.OpenFileMappingW(FILE_MAP_READ, False, name)
        if not h:
            return None, None
        size = ctypes.sizeof(struct_type)
        addr = kernel32.MapViewOfFile(h, FILE_MAP_READ, 0, 0, size)
        if not addr:
            kernel32.CloseHandle(h)
            return None, None
        obj = struct_type.from_address(addr)
        raw = ctypes.string_at(addr, size)
        obj._handle = h
        return obj, raw
    except Exception:
        return None, None


import ctypes  # noqa: E402


# ---------------------------------------------------------------------------
# MockProvider (existing — demo data)
# ---------------------------------------------------------------------------
class MockProvider:
    WAYPOINTS = [
        (0.00, 250), (0.045, 258), (0.065, 228), (0.085, 252),
        (0.115, 252), (0.135, 78), (0.165, 88), (0.195, 172),
        (0.245, 260), (0.295, 260), (0.315, 102), (0.355, 122),
        (0.395, 200), (0.415, 218), (0.455, 268), (0.475, 248),
        (0.505, 272), (0.530, 238), (0.555, 224), (0.585, 250),
        (0.615, 262), (0.705, 286), (0.755, 286), (0.775, 148),
        (0.810, 170), (0.840, 122), (0.880, 205), (0.945, 282),
        (1.00, 250),
    ]
    GEAR_MAX = [0, 90, 130, 175, 215, 250, 288]
    AMBIENT = 25.0
    COLD_PRESSURE = 26.0
    TOTAL_LAPS = 18
    PIT_LAP = 9
    FUEL_START = 100.0
    FUEL_PER_LAP = 3.2
    LAP_LENGTH = 118.0

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
        self.fuel = self.FUEL_START
        self.best = None
        self.lap_delta = None
        self.position = 4
        self.incidents = 0
        self._corner_dir = 1
        self._last_corner = False
        self._in_pit = False
        self._pit_timer = 0.0
        self.tyres = {k: {"temp_c": self.AMBIENT + 5, "wear_pct": 0.0} for k in ["fl", "fr", "rl", "rr"]}
        self._tyre_target = {"fl": 88, "fr": 84, "rl": 82, "rr": 81}
        self._tyre_wear_rate = {"fl": 1.15, "fr": 1.0, "rl": 0.95, "rr": 1.05}
        self._lap_times = []
        self._race_elapsed = 0.0
        self._ahead_timer = 0.0
        self._behind_timer = 0.0
        self.air_temp = 24.0
        self.track_temp = 31.0

    def sim_name(self):
        return "Mock Sim"

    def _target_speed(self, phase):
        wp = self.WAYPOINTS
        for i in range(len(wp) - 1):
            p0, s0 = wp[i]
            p1, s1 = wp[i + 1]
            if phase <= p1:
                f = (phase - p0) / (p1 - p0)
                f = f * f * (3 - 2 * f)
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
            if self._pit_timer <= 0:
                self._in_pit = False
                for k in self.tyres:
                    self.tyres[k]["wear_pct"] = 0.0
        else:
            target = self._target_speed(phase)
            tmin = min(self._target_speed((phase + k * 0.01) % 1.0) for k in range(1, 3))
            target = min(target, tmin)
            brake_demand = max(0.0, self.speed - tmin)
            diff = target - self.speed
            if brake_demand > 5:
                self.speed -= min(75.0 * (0.2 + 0.8 * self.brake) * dt, brake_demand)
            elif diff > 0:
                self.speed += min(45.0 * (0.1 + 0.9 * self.throttle) * dt, diff)
            else:
                self.speed -= min(30.0 * (0.2 + 0.8 * self.brake) * dt, -diff)
            self.speed = max(0, min(300, self.speed))
            cur = self.gear
            rpm_now = (self.speed / self.GEAR_MAX[cur]) * 8000 if self.GEAR_MAX[cur] else 0
            if rpm_now > 7400 and cur < 6 and self.shift_timer <= 0:
                self.gear = cur + 1
                self.shift_timer = 0.18
            elif rpm_now < 5000 and cur > 1 and self.shift_timer <= 0:
                self.gear = cur - 1
                self.shift_timer = 0.16
            t_next = self._target_speed((phase + 0.02) % 1.0)
            dtgt = t_next - target
            if brake_demand > 5:
                intent_thr, intent_brk = 0.0, min(1.0, brake_demand / 50.0)
            elif dtgt > 1.5 or target > 170:
                intent_thr, intent_brk = 1.0, 0.0
            else:
                intent_thr, intent_brk = 0.35, 0.0
            if self.shift_timer > 0:
                self.shift_timer -= dt
            self.throttle += (intent_thr - self.throttle) * (0.2 if intent_thr > self.throttle else 0.4)
            self.brake += (intent_brk - self.brake) * (0.6 if intent_brk > self.brake else 0.25)
            corner = max(0.0, (200 - target) / 130)
            in_corner = corner > 0.15
            if in_corner and not self._last_corner:
                self._corner_dir *= -1
            self._last_corner = in_corner
            ts = self._corner_dir * corner if in_corner else 0.0
            self.steer += (ts - self.steer) * 0.2
            self.steer = max(-1.0, min(1.0, self.steer))
            load = corner * 8
            for k, ty in self.tyres.items():
                tgt = self._tyre_target[k] + load + random.uniform(-0.3, 0.3)
                ty["temp_c"] += (tgt - ty["temp_c"]) * 0.03 + random.uniform(-0.15, 0.15)
        rpm = (self.speed / self.GEAR_MAX[self.gear]) * 8000 if self.GEAR_MAX[self.gear] else 0
        rpm = max(800, min(8000, int(rpm)))
        if rpm >= 7800:
            rpm = int(7800 - 100 - 100 * math.sin(self.t * 30))
        last_lap_time = None
        if lap_time >= self.LAP_LENGTH:
            deg = sum(t["wear_pct"] for t in self.tyres.values()) / 4 * 0.04
            last_lap_time = round(self.LAP_LENGTH + random.uniform(-0.25, 0.35) + deg, 3)
            self._lap_times.append(last_lap_time)
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
                self._lap_times = []
                self._race_elapsed = 0.0
                for k in self.tyres:
                    self.tyres[k]["wear_pct"] = 0.0
                    self.tyres[k]["temp_c"] = self.AMBIENT + 5
            lap_time = 0.0
        self._race_elapsed += dt
        avg_lap = round(sum(self._lap_times) / len(self._lap_times), 3) if self._lap_times else None
        laps_remaining = max(0, self.TOTAL_LAPS - self.lap + 1)
        self._ahead_timer += dt
        self._behind_timer += dt
        ahead = -1.4 + math.sin(self._ahead_timer * 0.15) * 0.6
        behind = 0.9 + math.sin(self._behind_timer * 0.11) * 0.5
        tyres = {k: {
            "temp_c": round(ty["temp_c"], 1),
            "wear_pct": round(ty["wear_pct"], 1),
            "pressure_psi": round(self.COLD_PRESSURE + (ty["temp_c"] - self.AMBIENT) * 0.06, 1),
        } for k, ty in self.tyres.items()}
        f = base_frame(self.sim_name())
        f.update({
            "session_type": "Race", "track": "Silverstone GP", "car": "Mercedes-AMG GT3",
            "lap": self.lap, "total_laps": self.TOTAL_LAPS, "position": self.position,
            "current_lap_time": round(lap_time, 3), "last_lap_time": last_lap_time,
            "best_lap_time": round(self.best, 3) if self.best else None,
            "lap_delta": self.lap_delta,
            "speed_kmh": round(self.speed, 1), "rpm": rpm, "max_rpm": 8000,
            "gear": self.gear, "throttle": round(self.throttle, 2),
            "brake": round(self.brake, 2), "steer": round(self.steer, 2),
            "fuel_litres": round(self.fuel, 1), "fuel_per_lap": self.FUEL_PER_LAP,
            "fuel_required": round(self.FUEL_PER_LAP * laps_remaining, 1),
            "avg_lap_time": avg_lap,
            "time_remaining": round(max(0.0, self.TOTAL_LAPS * self.LAP_LENGTH - self._race_elapsed), 1),
            "air_temp": round(self.air_temp, 1), "track_temp": round(self.track_temp, 1),
            "boost": round(0.8 + self.throttle * 0.6, 2), "brake_bias": 56.0,
            "tc1": 5, "tc2": 3, "abs": 2, "map": 3,
            "car_ahead_gap": round(ahead, 2), "car_behind_gap": round(behind, 2),
            "tyres": tyres,
        })
        return f

    def close(self):
        pass


# ---------------------------------------------------------------------------
# iRacingProvider (existing — irsdk)
# ---------------------------------------------------------------------------
class iRacingProvider:
    def __init__(self):
        import irsdk  # noqa
        self.irsdk = irsdk.IRSDK()
        self.connected = False

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
        tyres = {
            "fl": {"temp_c": round(_b(self._g(ir, "LFtempCM", 0), -20, 200), 1) or 0,
                   "wear_pct": round(_b((self._g(ir, "LFwear", 0) or 0) * 100, 0, 120), 1) or 0,
                   "pressure_psi": round(_b(self._g(ir, "LFpressure", 0), 0, 100), 1) or 0},
            "fr": {"temp_c": round(_b(self._g(ir, "RFtempCM", 0), -20, 200), 1) or 0,
                   "wear_pct": round(_b((self._g(ir, "RFwear", 0) or 0) * 100, 0, 120), 1) or 0,
                   "pressure_psi": round(_b(self._g(ir, "RFpressure", 0), 0, 100), 1) or 0},
            "rl": {"temp_c": round(_b(self._g(ir, "LRtempCM", 0), -20, 200), 1) or 0,
                   "wear_pct": round(_b((self._g(ir, "LRwear", 0) or 0) * 100, 0, 120), 1) or 0,
                   "pressure_psi": round(_b(self._g(ir, "LRpressure", 0), 0, 100), 1) or 0},
            "rr": {"temp_c": round(_b(self._g(ir, "RRtempCM", 0), -20, 200), 1) or 0,
                   "wear_pct": round(_b((self._g(ir, "RRwear", 0) or 0) * 100, 0, 120), 1) or 0,
                   "pressure_psi": round(_b(self._g(ir, "RRpressure", 0), 0, 100), 1) or 0},
        }
        f = base_frame(self.sim_name())
        f.update({
            "session_type": "Race", "track": self._g(ir, "TrackName", "") or "",
            "car": self._g(ir, "CarModel", "") or "",
            "lap": self._g(ir, "Lap", 1), "total_laps": self._g(ir, "SessionLapsRemain", 0) or 0,
            "position": self._g(ir, "PlayerCarPosition", 0) or 0,
            "incidents": self._g(ir, "PlayerCarMyIncidentCount", 0) or 0,
            "current_lap_time": round(self._g(ir, "LapCurrentTime", 0) or 0, 3),
            "last_lap_time": round(self._g(ir, "LapLastTime", 0), 3) if self._g(ir, "LapLastTime") else None,
            "best_lap_time": round(self._g(ir, "LapBestLapTime", 0), 3) if self._g(ir, "LapBestLapTime") else None,
            "speed_kmh": round(speed_ms * 3.6, 1), "rpm": int(self._g(ir, "RPM", 0) or 0),
            "max_rpm": 8000, "gear": int(self._g(ir, "Gear", 0) or 0),
            "throttle": round(self._g(ir, "Throttle", 0) or 0, 2),
            "brake": round(self._g(ir, "Brake", 0) or 0, 2),
            "steer": round(self._g(ir, "SteeringWheelAngle", 0) or 0, 2),
            "fuel_litres": round(fuel, 1) if fuel is not None else None,
            "tyres": tyres,
        })
        return f

    def close(self):
        try:
            self.irsdk.shutdown()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# ACCProvider (existing — pyaccsharedmemory)
# ---------------------------------------------------------------------------
class ACCProvider:
    def __init__(self):
        from pyaccsharedmemory import accSharedMemory  # noqa
        self.sm = accSharedMemory()

    def sim_name(self):
        return "Assetto Corsa Competizione"

    @staticmethod
    def _ms_to_s(ms):
        if not ms or ms <= 0 or ms > 3600000:
            return None
        return round(ms / 1000.0, 3)

    def read(self):
        sm = self.sm.read_shared_memory()
        if sm is None:
            return None
        ph = sm.Physics
        g = sm.Graphics
        st = sm.Static

        def w(wheels, idx):
            try:
                return float([wheels.front_left, wheels.front_right,
                              wheels.rear_left, wheels.rear_right][idx])
            except Exception:
                return 0

        temps = getattr(ph, "tyre_core_temp", None)
        pressures = getattr(ph, "wheel_pressure", None)
        tyres = _tyres(
            [w(temps, 0), w(temps, 1), w(temps, 2), w(temps, 3)] if temps else None,
            None,
            [w(pressures, 0), w(pressures, 1), w(pressures, 2), w(pressures, 3)] if pressures else None,
        )
        f = base_frame(self.sim_name())
        f.update({
            "session_type": str(getattr(g, "session_type", "Race")),
            "track": getattr(st, "track", "") or "",
            "car": getattr(st, "car_model", "") or "",
            "lap": getattr(g, "completed_lap", 0) + 1,
            "total_laps": getattr(g, "number_of_laps", 0),
            "position": getattr(g, "position", 0),
            "current_lap_time": self._ms_to_s(getattr(g, "current_time", 0)),
            "last_lap_time": self._ms_to_s(getattr(g, "last_time", 0)),
            "best_lap_time": self._ms_to_s(getattr(g, "best_time", 0)),
            "speed_kmh": round(getattr(ph, "speed_kmh", 0) or 0, 1),
            "rpm": int(getattr(ph, "rpm", 0) or 0),
            "max_rpm": int(getattr(st, "max_rpm", 8000) or 8000),
            "gear": int(getattr(ph, "gear", 0) or 0),
            "throttle": round(getattr(ph, "gas", 0) or 0, 2),
            "brake": round(getattr(ph, "brake", 0) or 0, 2),
            "steer": round(getattr(ph, "steer_angle", 0) or 0, 2),
            "fuel_litres": round(getattr(ph, "fuel", 0) or 0, 1),
            "fuel_per_lap": round(getattr(g, "fuel_per_lap", 0) or 0, 2) or None,
            "air_temp": round(getattr(ph, "air_temp", 0) or 0, 1) or None,
            "track_temp": round(getattr(ph, "road_temp", 0) or 0, 1) or None,
            "tc1": getattr(g, "tc_level", None),
            "abs": getattr(g, "abs_level", None),
            "map": getattr(g, "engine_map", None),
            "brake_bias": round(getattr(ph, "brake_bias", 0) or 0, 1) or None,
            "tyres": tyres,
        })
        return f

    def close(self):
        try:
            self.sm.close()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Assetto Corsa (original) — shared memory ctypes over Local\AC_MEMORY
# ---------------------------------------------------------------------------
class ACPhysics(ctypes.Structure):
    _fields_ = [
        ("packetId", ctypes.c_int),
        ("gas", ctypes.c_float),
        ("brake", ctypes.c_float),
        ("fuel", ctypes.c_float),
        ("gear", ctypes.c_int),
        ("rpms", ctypes.c_int),
        ("steerAngle", ctypes.c_float),
        ("speedKmh", ctypes.c_float),
        ("velocity", ctypes.c_float * 3),
        ("accG", ctypes.c_float * 3),
        ("suspension", ctypes.c_float * 4),
        ("wheelPressure", ctypes.c_float * 4),
        ("wheelAngularSpeed", ctypes.c_float * 4),
        ("wheelSlip", ctypes.c_float * 4),
        ("wheelLoad", ctypes.c_float * 4),
        ("wheels", ctypes.c_float * 4),  # tyre surface temp
        ("tyreWear", ctypes.c_float * 4),
        ("tyreDirtyLevel", ctypes.c_float * 4),
        ("tyreCoreTemperature", ctypes.c_float * 4),
        ("brakeTemp", ctypes.c_float * 4),
        ("brakeBias", ctypes.c_float),
        ("airTemp", ctypes.c_float),
        ("roadTemp", ctypes.c_float),
    ]


class AssettoCorsaProvider:
    def __init__(self):
        self.buf, self.raw = open_shared_memory("Local\\AC_MEMORY", ACPhysics)

    def sim_name(self):
        return "Assetto Corsa"

    def read(self):
        if not self.buf:
            return None
        p = self.buf
        # packetId must be a sane positive int to confirm the mapping is live
        if not (0 <= p.packetId < 10_000_000):
            return None
        tyres = _tyres(
            [p.tyreCoreTemperature[0], p.tyreCoreTemperature[1], p.tyreCoreTemperature[2], p.tyreCoreTemperature[3]],
            [p.tyreWear[0], p.tyreWear[1], p.tyreWear[2], p.tyreWear[3]],
            [p.wheelPressure[0], p.wheelPressure[1], p.wheelPressure[2], p.wheelPressure[3]],
        )
        f = base_frame(self.sim_name())
        f.update({
            "speed_kmh": round(_b(p.speedKmh, 0, 600), 1) if _b(p.speedKmh, 0, 600) is not None else 0,
            "rpm": int(_b(p.rpms, 0, 20000) or 0),
            "max_rpm": 8000,
            "gear": int(p.gear),
            "throttle": round(_b(p.gas, 0, 1.1) or 0, 2),
            "brake": round(_b(p.brake, 0, 1.1) or 0, 2),
            "steer": round(max(-1.0, min(1.0, p.steerAngle)), 2),
            "fuel_litres": round(_b(p.fuel, 0, 500) or 0, 1),
            "air_temp": round(_b(p.airTemp, -20, 60) or 0, 1) or None,
            "track_temp": round(_b(p.roadTemp, -20, 80) or 0, 1) or None,
            "tyres": tyres,
        })
        return f

    def close(self):
        pass


# ---------------------------------------------------------------------------
# rFactor 2 / Le Mans Ultimate — via pyrfactor2sharedmemory
# ---------------------------------------------------------------------------
class RFactorProvider:
    def __init__(self, name="rFactor 2"):
        from sharedMemoryAPI import SimInfoAPI, Cbytestring2Python  # noqa
        self.info = SimInfoAPI()
        self._b2s = Cbytestring2Python
        self._name = name

    def sim_name(self):
        return self._name

    def _g(self, obj, attr, default=None):
        try:
            v = getattr(obj, attr)
            return v if v is not None else default
        except Exception:
            return default

    def read(self):
        try:
            if not (self.info.isRF2running() and self.info.isSharedMemoryAvailable() and self.info.isTrackLoaded()):
                return None
        except Exception:
            return None
        scor = getattr(self.info, "Rf2Scor", None)
        tele = getattr(self.info, "Rf2Tele", None)
        if scor is None or tele is None:
            return None
        try:
            idx = getattr(scor.mScoringInfo, "mViewedVehicleIndex", 0) or 0
        except Exception:
            idx = 0
        try:
            vs = scor.mVehicles[idx]
        except Exception:
            return None
        try:
            vt = tele.mVehicles[idx]
        except Exception:
            vt = None
        track = ""
        try:
            track = self._b2s(scor.mScoringInfo.mTrackName) or ""
        except Exception:
            pass
        car = ""
        try:
            car = self._b2s(vs.mVehicleName) or ""
        except Exception:
            pass
        speed = self._g(vs, "mSpeed", None)
        rpm = self._g(vt, "mEngineRPM", None) if vt else None
        gear = self._g(vt, "mGear", None) if vt else None
        throttle = self._g(vt, "mThrottle", None) if vt else None
        brake = self._g(vt, "mBrake", None) if vt else None
        steer = self._g(vt, "mSteeringWheel", None) if vt else None
        fuel = self._g(vt, "mFuel", None) if vt else None
        best_lap = self._g(vs, "mBestLapTime", None)
        last_lap = self._g(vs, "mLastLapTime", None)
        cur_lap = self._g(vs, "mCurrentTime", None) or self._g(scor.mScoringInfo, "mCurrentET", None)
        position = self._g(vs, "mPosition", None)
        total_laps = self._g(scor.mScoringInfo, "mLapsInEvent", None)
        # rF2 throttle/brake are 0..255 in some versions — normalize defensively
        if throttle is not None and throttle > 1.5:
            throttle = throttle / 255.0
        if brake is not None and brake > 1.5:
            brake = brake / 255.0
        f = base_frame(self.sim_name())
        f.update({
            "track": track, "car": car,
            "speed_kmh": round(_b(speed, 0, 250) * 3.6, 1) if _b(speed, 0, 250) is not None else None,
            "rpm": int(_b(rpm, 0, 20000) or 0) if rpm is not None else None,
            "max_rpm": 18000,
            "gear": int(_b(gear, -1, 10) or 0) if gear is not None else None,
            "throttle": round(_b(throttle, 0, 1.1) or 0, 2) if throttle is not None else None,
            "brake": round(_b(brake, 0, 1.1) or 0, 2) if brake is not None else None,
            "steer": round(max(-1.0, min(1.0, steer or 0)), 2) if steer is not None else None,
            "fuel_litres": round(_b(fuel, 0, 500) or 0, 1) if fuel is not None else None,
            "best_lap_time": round(_b(best_lap, 0, 3600), 3) if best_lap else None,
            "last_lap_time": round(_b(last_lap, 0, 3600), 3) if last_lap else None,
            "current_lap_time": round(_b(cur_lap, 0, 3600), 3) if cur_lap else None,
            "position": int(_b(position, 0, 100) or 0) if position is not None else None,
            "total_laps": int(total_laps) if total_laps else None,
        })
        return f

    def close(self):
        try:
            self.info.close()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Automobilista 2 — shared memory ctypes over $pcars2$ (version 14)
# ---------------------------------------------------------------------------
class AMS2Participant(ctypes.Structure):
    _fields_ = [
        ("mIsActive", ctypes.c_bool),
        ("mName", ctypes.c_char * 64),
        ("mCurrentLapDistance", ctypes.c_float),
        ("mRacePosition", ctypes.c_uint),
        ("mLapsCompleted", ctypes.c_uint),
        ("mCurrentLap", ctypes.c_uint),
        ("mCurrentSector", ctypes.c_int),
    ]


class AMS2SharedMemory(ctypes.Structure):
    _fields_ = [
        ("mVersion", ctypes.c_uint),
        ("mBuildVersionNumber", ctypes.c_uint),
        ("mGameState", ctypes.c_uint),
        ("mSessionState", ctypes.c_uint),
        ("mRaceState", ctypes.c_uint),
        ("mViewedParticipantIndex", ctypes.c_int),
        ("mNumParticipants", ctypes.c_int),
        ("mParticipantInfo", AMS2Participant * 64),
        ("mUnfilteredThrottle", ctypes.c_float),
        ("mUnfilteredBrake", ctypes.c_float),
        ("mUnfilteredSteering", ctypes.c_float),
        ("mUnfilteredClutch", ctypes.c_float),
        ("mCarName", ctypes.c_char * 64),
        ("mCarClassName", ctypes.c_char * 64),
        ("mLapsInEvent", ctypes.c_uint),
        ("mTrackLocation", ctypes.c_char * 64),
        ("mTrackVariation", ctypes.c_char * 64),
        ("mTrackLength", ctypes.c_float),
        ("mNumSectors", ctypes.c_int),
        ("mLapInvalidated", ctypes.c_bool),
        ("mBestLapTime", ctypes.c_float),
        ("mLastLapTime", ctypes.c_float),
        ("mCurrentTime", ctypes.c_float),
        ("mSplitTimeAhead", ctypes.c_float),
        ("mSplitTimeBehind", ctypes.c_float),
        ("mSplitTime", ctypes.c_float),
        ("mEventTimeRemaining", ctypes.c_float),
        ("mPersonalFastestLapTime", ctypes.c_float),
        ("mWorldFastestLapTime", ctypes.c_float),
        ("mOnThisLapTime", ctypes.c_float),
        ("mCurrentSector1Time", ctypes.c_float),
        ("mCurrentSector2Time", ctypes.c_float),
        ("mCurrentSector3Time", ctypes.c_float),
        ("mFastestSector1Time", ctypes.c_float),
        ("mFastestSector2Time", ctypes.c_float),
        ("mFastestSector3Time", ctypes.c_float),
        ("mPersonalFastestSector1Time", ctypes.c_float),
        ("mPersonalFastestSector2Time", ctypes.c_float),
        ("mPersonalFastestSector3Time", ctypes.c_float),
        ("_unk1", ctypes.c_float),
        ("_unk2", ctypes.c_float),
        ("mOilPressureKPa", ctypes.c_float),
        ("mWaterTempCelsius", ctypes.c_float),
        ("mFuelPressureKPa", ctypes.c_float),
        ("mFuelLevel", ctypes.c_float),
        ("mFuelCapacity", ctypes.c_float),
        ("mSpeed", ctypes.c_float),
        ("mRpm", ctypes.c_float),
        ("mMaxRPM", ctypes.c_float),
        ("mBrake", ctypes.c_float),
        ("mThrottle", ctypes.c_float),
        ("mClutch", ctypes.c_float),
        ("mSteering", ctypes.c_float),
        ("mGear", ctypes.c_int),
        ("mNumGears", ctypes.c_int),
        ("mOdometerKM", ctypes.c_float),
        ("mTyreFlags", ctypes.c_uint * 4),
        ("mTerrain", ctypes.c_uint * 4),
        ("mTyreY", ctypes.c_float * 4),
        ("mTyreRPS", ctypes.c_float * 4),
        ("mTyreSlipSpeed", ctypes.c_float * 4),
        ("mTyreTemp", ctypes.c_float * 4),
        ("mTyreGrip", ctypes.c_float * 4),
        ("mTyreHeightAboveGround", ctypes.c_float * 4),
        ("mTyreLateralStiffness", ctypes.c_float * 4),
        ("mTyreWear", ctypes.c_float * 4),
        ("mBrakeDamage", ctypes.c_float * 4),
        ("mSuspensionDamage", ctypes.c_float * 4),
        ("mBrakeTempCelsius", ctypes.c_float * 4),
        ("mTyreTreadTemp", ctypes.c_float * 4),
    ]


class AMS2Provider:
    def __init__(self):
        self.buf, self.raw = open_shared_memory("$pcars2$", AMS2SharedMemory)
        self._shift = None  # calibrated byte shift for the post-sector block

    def sim_name(self):
        return "Automobilista 2"

    def _calibrate(self):
        """Find the byte shift that makes mSpeed/mRpm/mGear all sane at once."""
        if not self.raw:
            return 0
        base = AMS2SharedMemory.mSpeed.offset
        for k in range(-6, 7):
            off = base + k * 4
            if off < 0 or off + 32 > len(self.raw):
                continue
            try:
                speed = struct.unpack_from("<f", self.raw, off)[0]
                rpm = struct.unpack_from("<f", self.raw, off + 4)[0]
                gear = struct.unpack_from("<i", self.raw, off + 28)[0]
            except struct.error:
                continue
            if 0 <= speed <= 200 and 0 <= rpm <= 20000 and -1 <= gear <= 10:
                return k
        return 0

    def read(self):
        if not self.buf or not self.raw:
            return None
        if self.buf.mVersion < 9:
            return None
        if self._shift is None:
            self._shift = self._calibrate()
        p = self.buf
        shift = self._shift
        base = AMS2SharedMemory.mSpeed.offset + shift * 4
        try:
            speed = struct.unpack_from("<f", self.raw, base)[0]
            rpm = struct.unpack_from("<f", self.raw, base + 4)[0]
            max_rpm = struct.unpack_from("<f", self.raw, base + 8)[0]
            gear = struct.unpack_from("<i", self.raw, base + 28)[0]
        except struct.error:
            return None
        # tyres: best-effort at computed offset (may shift if a padding field exists)
        try:
            ttoff = base + 120
            tt = struct.unpack_from("<4f", self.raw, ttoff)
        except struct.error:
            tt = None
        try:
            twoff = base + 184
            tw = struct.unpack_from("<4f", self.raw, twoff)
        except struct.error:
            tw = None
        tyres = _tyres(list(tt) if tt else None, list(tw) if tw else None, None)
        car = ""
        try:
            car = p.mCarName.decode("utf-8", "ignore").rstrip("\x00 ")
        except Exception:
            pass
        track = ""
        try:
            track = p.mTrackLocation.decode("utf-8", "ignore").rstrip("\x00 ")
        except Exception:
            pass
        f = base_frame(self.sim_name())
        f.update({
            "track": track, "car": car,
            "lap": int(p.mParticipantInfo[p.mViewedParticipantIndex].mCurrentLap) if 0 <= p.mViewedParticipantIndex < 64 else None,
            "total_laps": int(p.mLapsInEvent) if p.mLapsInEvent else None,
            "position": int(p.mParticipantInfo[p.mViewedParticipantIndex].mRacePosition) if 0 <= p.mViewedParticipantIndex < 64 else None,
            "current_lap_time": round(_b(p.mCurrentTime, 0, 3600), 3) if _b(p.mCurrentTime, 0, 3600) is not None else None,
            "last_lap_time": round(_b(p.mLastLapTime, 0, 3600), 3) if _b(p.mLastLapTime, 0, 3600) is not None else None,
            "best_lap_time": round(_b(p.mBestLapTime, 0, 3600), 3) if _b(p.mBestLapTime, 0, 3600) is not None else None,
            "speed_kmh": round(_b(speed, 0, 250) * 3.6, 1) if _b(speed, 0, 250) is not None else None,
            "rpm": int(_b(rpm, 0, 20000) or 0) if _b(rpm, 0, 20000) is not None else None,
            "max_rpm": int(_b(max_rpm, 0, 20000) or 0) if _b(max_rpm, 0, 20000) is not None else None,
            "gear": int(_b(gear, -1, 10) or 0) if _b(gear, -1, 10) is not None else None,
            "throttle": round(_b(p.mUnfilteredThrottle, 0, 1.1) or 0, 2),
            "brake": round(_b(p.mUnfilteredBrake, 0, 1.1) or 0, 2),
            "steer": round(max(-1.0, min(1.0, p.mUnfilteredSteering)), 2),
            "fuel_litres": round(_b(p.mFuelLevel, 0, 1.2) * _b(p.mFuelCapacity, 0, 500), 1) if (_b(p.mFuelLevel, 0, 1.2) is not None and _b(p.mFuelCapacity, 0, 500)) else None,
            "time_remaining": round(_b(p.mEventTimeRemaining, 0, 86400), 1) if _b(p.mEventTimeRemaining, 0, 86400) is not None else None,
            "tyres": tyres,
        })
        return f

    def close(self):
        pass


# ---------------------------------------------------------------------------
# UDP provider base — async listener that buffers the latest parsed frame
# ---------------------------------------------------------------------------
class UDPProvider:
    def __init__(self, port):
        self.port = port
        self._frame = None
        self._frame_ts = 0.0
        self._sock = None
        self._task = None
        self._started = False

    async def start(self):
        if self._started:
            return
        try:
            self._sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self._sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            self._sock.setblocking(False)
            self._sock.bind(("0.0.0.0", self.port))
            self._task = asyncio.create_task(self._listen())
            self._started = True
        except OSError:
            self._sock = None
            print(f"[{ts()}] could not bind UDP port {self.port} — another app may hold it. "
                  f"Stop other dash tools or change the port with the matching flag.")

    async def _listen(self):
        loop = asyncio.get_event_loop()
        while True:
            try:
                data, _ = await loop.sock_recvfrom(self._sock, 4096)
                frame = self.parse(data)
                if frame:
                    self._frame = frame
                    self._frame_ts = time.time()
            except asyncio.CancelledError:
                break
            except Exception:
                pass

    def parse(self, data):  # override in subclass
        return None

    def has_fresh(self):
        return self._frame is not None and (time.time() - self._frame_ts) < 1.0

    def read(self):
        if self.has_fresh():
            return self._frame
        return None

    def close(self):
        if self._task:
            self._task.cancel()
        if self._sock:
            try:
                self._sock.close()
            except Exception:
                pass


# ---------------------------------------------------------------------------
# F1 2023/2024 — UDP binary packets on port 20777
# ---------------------------------------------------------------------------
F1_HEADER_FMT = "<HBBH"  # packetFormat, gameMajor, gameMinor, packetVersion (6 bytes)
# packetId is byte 6; playerCarIndex at byte 27 (header is 29 bytes in F1 23/24)


class F1UDPProvider(UDPProvider):
    def __init__(self, port=20777):
        super().__init__(port)
        self._hdr_size = None  # auto-detected (29 or 30)

    def sim_name(self):
        return "F1 24"

    def _detect_header_size(self, data):
        if self._hdr_size:
            return self._hdr_size
        idx = data[27] if len(data) > 27 else 0
        for hs in (29, 30):
            off = hs + idx * 60
            if off + 60 <= len(data):
                speed = struct.unpack_from("<H", data, off)[0]
                rpm = struct.unpack_from("<H", data, off + 16)[0]
                gear = struct.unpack_from("<b", data, off + 15)[0]
                if 0 <= speed <= 400 and 0 <= rpm <= 20000 and -1 <= gear <= 8:
                    self._hdr_size = hs
                    return hs
        self._hdr_size = 29
        return 29

    def parse(self, data):
        if len(data) < 7:
            return None
        try:
            packet_format, _, _, _ = struct.unpack_from(F1_HEADER_FMT, data, 0)
            packet_id = data[6]
        except struct.error:
            return None
        hs = self._detect_header_size(data)
        idx = data[27] if len(data) > 27 else 0
        frame = self._frame or base_frame("F1 24")
        frame["type"] = "telemetry"
        frame["ts"] = time.time()
        frame["sim"] = f"F1 {packet_format}"
        frame["connected"] = True
        frame["session_type"] = "Race"
        if packet_id == 5:  # CarTelemetry
            off = hs + idx * 60
            if off + 60 > len(data):
                return None
            speed = struct.unpack_from("<H", data, off)[0]
            throttle = struct.unpack_from("<f", data, off + 2)[0]
            steer = struct.unpack_from("<f", data, off + 6)[0]
            brake = struct.unpack_from("<f", data, off + 10)[0]
            gear = struct.unpack_from("<b", data, off + 15)[0]
            rpm = struct.unpack_from("<H", data, off + 16)[0]
            drs = data[off + 18]
            tyre_surf = struct.unpack_from("<4B", data, off + 30)
            tyre_press = struct.unpack_from("<4f", data, off + 40)
            frame.update({
                "speed_kmh": round(_b(speed, 0, 400), 1) if speed else 0,
                "throttle": round(_b(throttle, 0, 1.1) or 0, 2),
                "steer": round(max(-1.0, min(1.0, steer)), 2),
                "brake": round(_b(brake, 0, 1.1) or 0, 2),
                "gear": int(gear),
                "rpm": int(_b(rpm, 0, 20000) or 0),
                "max_rpm": 13000,
                "tyres": _tyres(list(tyre_surf), None, list(tyre_press)),
            })
            frame["boost"] = 1.0 if drs else 0.0
        elif packet_id == 2:  # LapData
            off = hs + idx * 96  # LapData is ~96 bytes in F1 24 (varies); first 8 bytes stable
            if off + 8 > len(data):
                return None
            last_lap = struct.unpack_from("<f", data, off)[0]
            cur_lap = struct.unpack_from("<f", data, off + 4)[0]
            frame["last_lap_time"] = round(_b(last_lap, 0, 3600), 3) if _b(last_lap, 0, 3600) is not None and last_lap > 0 else None
            frame["current_lap_time"] = round(_b(cur_lap, 0, 3600), 3) if _b(cur_lap, 0, 3600) is not None else None
        return frame if (frame.get("speed_kmh") is not None) else None


# ---------------------------------------------------------------------------
# Forza Motorsport / Horizon — UDP "Data Out" Dash on port 5300
# ---------------------------------------------------------------------------
_FORZA_FIELDS = [
    ("IsRaceOn", "i"), ("TimestampMS", "I"), ("EngineMaxRpm", "f"), ("EngineIdleRpm", "f"), ("CurrentEngineRpm", "f"),
    ("AccelerationX", "f"), ("AccelerationY", "f"), ("AccelerationZ", "f"),
    ("VelocityX", "f"), ("VelocityY", "f"), ("VelocityZ", "f"),
    ("AngularVelocityX", "f"), ("AngularVelocityY", "f"), ("AngularVelocityZ", "f"),
    ("Yaw", "f"), ("Pitch", "f"), ("Roll", "f"),
    ("NormSuspFL", "f"), ("NormSuspFR", "f"), ("NormSuspRL", "f"), ("NormSuspRR", "f"),
    ("TireSlipFL", "f"), ("TireSlipFR", "f"), ("TireSlipRL", "f"), ("TireSlipRR", "f"),
    ("WheelRotFL", "f"), ("WheelRotFR", "f"), ("WheelRotRL", "f"), ("WheelRotRR", "f"),
    ("RumbleFL", "i"), ("RumbleFR", "i"), ("RumbleRL", "i"), ("RumbleRR", "i"),
    ("PuddleFL", "f"), ("PuddleFR", "f"), ("PuddleRL", "f"), ("PuddleRR", "f"),
    ("SurfFL", "f"), ("SurfFR", "f"), ("SurfRL", "f"), ("SurfRR", "f"),
    ("SlipAngleFL", "f"), ("SlipAngleFR", "f"), ("SlipAngleRL", "f"), ("SlipAngleRR", "f"),
    ("CombSlipFL", "f"), ("CombSlipFR", "f"), ("CombSlipRL", "f"), ("CombSlipRR", "f"),
    ("SuspTravelFL", "f"), ("SuspTravelFR", "f"), ("SuspTravelRL", "f"), ("SuspTravelRR", "f"),
    ("CarOrdinal", "i"), ("CarClass", "i"), ("CarPerfIdx", "i"), ("Drivetrain", "i"), ("NumCyl", "i"),
    ("PositionX", "f"), ("PositionY", "f"), ("PositionZ", "f"),
    ("Speed", "f"), ("Power", "f"), ("Torque", "f"),
    ("TireTempFL", "f"), ("TireTempFR", "f"), ("TireTempRL", "f"), ("TireTempRR", "f"),
    ("Boost", "f"), ("Fuel", "f"), ("Distance", "f"),
    ("BestLap", "f"), ("LastLap", "f"), ("CurrentLap", "f"), ("CurrentRaceTime", "f"),
    ("LapNumber", "H"), ("RacePosition", "B"), ("Accel", "B"), ("Brake", "B"),
    ("Clutch", "B"), ("HandBrake", "B"), ("Gear", "B"),
    ("Steer", "b"), ("NormDriveLine", "b"), ("NormAIBrake", "b"),
    ("TireWearFL", "f"), ("TireWearFR", "f"), ("TireWearRL", "f"), ("TireWearRR", "f"),
    ("TrackOrdinal", "i"),
]
FORZA_DASH_FMT = "<" + "".join(t for _, t in _FORZA_FIELDS)
FORZA_DASH_SIZE = struct.calcsize(FORZA_DASH_FMT)
_FORZA_NAMES = [n for n, _ in _FORZA_FIELDS]


class ForzaUDPProvider(UDPProvider):
    def sim_name(self):
        return "Forza"

    def parse(self, data):
        if len(data) != FORZA_DASH_SIZE:
            return None  # not a Dash packet (could be Sled or wrong format)
        vals = struct.unpack(FORZA_DASH_FMT, data)
        d = dict(zip(_FORZA_NAMES, vals))
        if not d.get("IsRaceOn"):
            return None
        tyres = _tyres(
            [d["TireTempFL"], d["TireTempFR"], d["TireTempRL"], d["TireTempRR"]],
            [d["TireWearFL"], d["TireWearFR"], d["TireWearRL"], d["TireWearRR"]],
            None,
        )
        f = base_frame(self.sim_name())
        f.update({
            "speed_kmh": round(_b(d["Speed"], 0, 250) * 3.6, 1) if _b(d["Speed"], 0, 250) is not None else 0,
            "rpm": int(_b(d["CurrentEngineRpm"], 0, 20000) or 0),
            "max_rpm": int(_b(d["EngineMaxRpm"], 0, 20000) or 0) if _b(d["EngineMaxRpm"], 0, 20000) else None,
            "gear": int(d["Gear"]),
            "throttle": round(_b(d["Accel"], 0, 255) / 255.0, 2) if d.get("Accel") is not None else None,
            "brake": round(_b(d["Brake"], 0, 255) / 255.0, 2) if d.get("Brake") is not None else None,
            "steer": round(max(-1.0, min(1.0, _b(d["Steer"], -128, 127) / 127.0)), 2) if d.get("Steer") is not None else None,
            "boost": round(_b(d["Boost"], -1, 10), 2) if _b(d["Boost"], -1, 10) is not None else None,
            "lap": int(d["LapNumber"]) if d["LapNumber"] else None,
            "position": int(d["RacePosition"]) if d["RacePosition"] else None,
            "current_lap_time": round(_b(d["CurrentLap"], 0, 3600), 3) if _b(d["CurrentLap"], 0, 3600) is not None else None,
            "last_lap_time": round(_b(d["LastLap"], 0, 3600), 3) if _b(d["LastLap"], 0, 3600) is not None and d["LastLap"] > 0 else None,
            "best_lap_time": round(_b(d["BestLap"], 0, 3600), 3) if _b(d["BestLap"], 0, 3600) is not None and d["BestLap"] > 0 else None,
            "tyres": tyres,
        })
        return f


# ---------------------------------------------------------------------------
# Gran Turismo 7 — encrypted UDP on port 33740 (needs PS5 IP for heartbeat)
# ---------------------------------------------------------------------------
def _gt7_decrypt(data):
    KEY = b"Simulator Interface Packet GT7 ver 0.0"
    if len(data) < 0x44:
        return None
    oiv = data[0x40:0x44]
    iv1 = int.from_bytes(oiv, "little")
    iv2 = iv1 ^ 0xDEADBEAF
    iv = iv2.to_bytes(4, "little") + iv1.to_bytes(4, "little")
    try:
        from salsa20 import Salsa20_xor
        ddata = Salsa20_xor(data, bytes(iv), KEY[:32])
    except ImportError:
        try:
            from Crypto.Cipher import Salsa20
            ddata = Salsa20.new(key=KEY[:32], nonce=bytes(iv)).decrypt(data)
        except ImportError:
            return None
    try:
        if int.from_bytes(ddata[:4], "little") != 0x47375330:
            return None
    except Exception:
        return None
    return ddata


class GT7UDPProvider(UDPProvider):
    def __init__(self, port=33740, ps5_ip=None):
        super().__init__(port)
        self.ps5_ip = ps5_ip
        self._hb_task = None
        self._lap_start_day = None
        self._last_lap = None

    def sim_name(self):
        return "Gran Turismo 7"

    async def start(self):
        await super().start()
        if self.ps5_ip and self._sock:
            self._hb_task = asyncio.create_task(self._heartbeat())

    async def _heartbeat(self):
        while True:
            try:
                self._sock.sendto(b"A", (self.ps5_ip, 33739))
            except Exception:
                pass
            await asyncio.sleep(10)

    def parse(self, data):
        ddata = _gt7_decrypt(data)
        if not ddata or len(ddata) < 0x125:
            return None
        try:
            rpm = struct.unpack_from("<f", ddata, 0x3C)[0]
            fuel = struct.unpack_from("<f", ddata, 0x44)[0]
            speed_ms = struct.unpack_from("<f", ddata, 0x4C)[0]
            tyre_temps = struct.unpack_from("<4f", ddata, 0x60)
            lap_count = struct.unpack_from("<h", ddata, 0x74)[0]
            total_laps = struct.unpack_from("<h", ddata, 0x76)[0]
            best_lap_ms = struct.unpack_from("<i", ddata, 0x78)[0]
            last_lap_ms = struct.unpack_from("<i", ddata, 0x7C)[0]
            day_prog = struct.unpack_from("<i", ddata, 0x80)[0]
            race_pos = struct.unpack_from("<h", ddata, 0x84)[0]
            max_alert_rpm = struct.unpack_from("<h", ddata, 0x8A)[0]
            gear_byte = ddata[0x90]
            throttle_raw = ddata[0x91]
            brake_raw = ddata[0x92]
        except struct.error:
            return None
        # track current lap time via day-progression delta on lap change
        if lap_count != self._last_lap:
            self._last_lap = lap_count
            self._lap_start_day = day_prog
        cur_lap = (day_prog - self._lap_start_day) / 1000.0 if self._lap_start_day is not None else None
        f = base_frame(self.sim_name())
        f.update({
            "speed_kmh": round(_b(speed_ms, 0, 200) * 3.6, 1) if _b(speed_ms, 0, 200) is not None else 0,
            "rpm": int(_b(rpm, 0, 20000) or 0),
            "max_rpm": int(_b(max_alert_rpm, 0, 20000) or 0) if max_alert_rpm else None,
            "gear": int(gear_byte & 0x0F),
            "throttle": round(_b(throttle_raw, 0, 255) / 255.0, 2) if throttle_raw is not None else None,
            "brake": round(_b(brake_raw, 0, 255) / 255.0, 2) if brake_raw is not None else None,
            "fuel_litres": round(_b(fuel, 0, 500) or 0, 1) if _b(fuel, 0, 500) is not None else None,
            "lap": int(lap_count) if lap_count >= 0 else None,
            "total_laps": int(total_laps) if total_laps > 0 else None,
            "position": int(race_pos) if race_pos > 0 else None,
            "best_lap_time": round(best_lap_ms / 1000.0, 3) if best_lap_ms > 0 else None,
            "last_lap_time": round(last_lap_ms / 1000.0, 3) if last_lap_ms > 0 else None,
            "current_lap_time": round(_b(cur_lap, 0, 3600), 3) if _b(cur_lap, 0, 3600) is not None else None,
            "tyres": _tyres(list(tyre_temps), None, None),
        })
        return f

    def close(self):
        if self._hb_task:
            self._hb_task.cancel()
        super().close()


# ---------------------------------------------------------------------------
# Provider registry
# ---------------------------------------------------------------------------
PROVIDERS = {
    "mock": MockProvider,
    "iracing": iRacingProvider,
    "acc": ACCProvider,
    "ac": AssettoCorsaProvider,
    "rf2": lambda: RFactorProvider("rFactor 2"),
    "lmu": lambda: RFactorProvider("Le Mans Ultimate"),
    "ams2": AMS2Provider,
}

# process name → (provider_key, sim_display_name)
SIM_PROFILES = [
    ("iracing", ["iRacingSim64.exe", "iRacingSim64DX11.exe"], "iracing", "iRacing"),
    ("acc", ["acc.exe"], "acc", "Assetto Corsa Competizione"),
    ("ac", ["acs.exe"], "ac", "Assetto Corsa"),
    ("rf2", ["rFactor2.exe"], "rf2", "rFactor 2"),
    ("lmu", ["LMU.exe"], "lmu", "Le Mans Ultimate"),
    ("ams2", ["AMS2.exe"], "ams2", "Automobilista 2"),
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
    for key, procs, prov, display in SIM_PROFILES:
        for n in procs:
            if n.lower() in low:
                return key, prov, display
    return None


def make_provider(key):
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
    "udp_providers": [],  # (key, display, provider)
}

SETUP_HINTS = {
    "iracing": "iRacing: set irsdkEnableMem=1 in documents/app.ini, then restart the sim",
    "acc": "ACC: enable Shared Memory in Options, then start a session",
    "ac": "Assetto Corsa: run the bridge as admin if AC runs as admin",
    "rf2": "rFactor 2: install the rF2 Shared Memory plugin (pip install pyrfactor2sharedmemory)",
    "lmu": "Le Mans Ultimate: install the rF2 Shared Memory plugin (pip install pyrfactor2sharedmemory)",
    "ams2": "AMS2: set Shared Memory = 'Project CARS 2' in System settings",
}


def ts():
    return datetime.now().strftime("%H:%M:%S")


def _reset_provider_state():
    state["no_data_since"] = None
    state["hinted_no_data"] = False
    state["read_error_logged"] = False


# ---------------------------------------------------------------------------
# Detection loop — shared-memory process scan + UDP freshness check
# ---------------------------------------------------------------------------
async def detect_loop():
    while True:
        if state["manual"]:
            if state["provider"] is None:
                mkey = state["manual"]
                if mkey in ("f1", "forza", "gt7"):
                    # UDP sim — use the listener started in main()
                    for _k, _d, udp in state["udp_providers"]:
                        if _k == mkey:
                            state["provider"] = udp
                            state["sim"] = udp.sim_name()
                            _reset_provider_state()
                            print(f"[{ts()}] source: {state['sim']} (UDP — waiting for packets…)")
                            break
                else:
                    p, err = make_provider(mkey)
                    if p:
                        state["provider"] = p
                        state["sim"] = p.sim_name()
                        _reset_provider_state()
                        print(f"[{ts()}] source: {state['sim']}")
                    elif err and mkey not in state["warned_missing"]:
                        state["warned_missing"].add(mkey)
                        print(f"[{ts()}] {mkey}: {err}")
        else:
            # shared-memory detection
            if _psutil is None:
                if not state["warned_psutil"]:
                    state["warned_psutil"] = True
                    print("[hint] psutil not installed — auto-detect disabled. "
                          "Install with:  pip install psutil   (or use --sim <mock|iracing|acc|...>)")
            else:
                det = detect_sim()
                if det:
                    key, prov_key, display = det
                    if prov_key and state["provider"] is None:
                        p, err = make_provider(prov_key)
                        if p:
                            state["provider"] = p
                            state["sim"] = p.sim_name()
                            _reset_provider_state()
                            print(f"[{ts()}] detected {state['sim']}")
                            hint = SETUP_HINTS.get(key)
                            if hint:
                                print(f"[{ts()}] hint: {hint}")
                        elif key not in state["warned_missing"]:
                            state["warned_missing"].add(key)
                            print(f"[{ts()}] detected {display} but {err}")
                    elif not prov_key and state["sim"] != display:
                        state["sim"] = display
                        print(f"[{ts()}] detected {display} (provider coming soon)")
                else:
                    if state["provider"] is not None and not isinstance(state["provider"], UDPProvider):
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
            # UDP freshness: if no shared-memory provider is active, use a UDP provider that has data
            if state["provider"] is None:
                for _, display, udp in state["udp_providers"]:
                    if udp.has_fresh():
                        state["provider"] = udp
                        state["sim"] = udp.sim_name()
                        _reset_provider_state()
                        print(f"[{ts()}] detected {display} (UDP)")
                        break
            elif isinstance(state["provider"], UDPProvider) and not state["provider"].has_fresh():
                state["provider"] = None
                state["sim"] = None
                _reset_provider_state()
                print(f"[{ts()}] UDP stream stopped — waiting…")
        await asyncio.sleep(2)


# ---------------------------------------------------------------------------
# Broadcast loop
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
            if state["provider"] is not None:
                if state["no_data_since"] is None:
                    state["no_data_since"] = time.time()
                elif not state["hinted_no_data"] and (time.time() - state["no_data_since"]) > 10:
                    state["hinted_no_data"] = True
                    print(f"[{ts()}] hint: {state['sim']} is running but no telemetry yet. "
                          "For shared-memory sims, start a session; for UDP sims, enable telemetry in-game.")
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
    return web.Response(status=200, headers=_cors_headers())


async def handle_health(request):
    return web.json_response({"bridge": True, "sim": state["sim"]}, headers=_cors_headers())


async def handle_websocket(request):
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


def dashboard_html():
    return r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>SimSetApp Live Dashboard</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  html,body{height:100%;background:#060606;color:#e8e8e8;font-family:'Share Tech Mono',monospace;overflow-x:hidden}
  #dash{max-width:520px;margin:0 auto;padding:14px 14px 24px;display:flex;flex-direction:column;gap:12px}
  .top-bar{display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.08em;color:#888;border-bottom:1px solid #1a1a1a;padding-bottom:8px}
  #pos{color:#22c55e}
  .main-row{display:flex;align-items:center;justify-content:space-between;gap:16px}
  .gear{font-family:'Orbitron';font-weight:900;font-size:84px;line-height:1;color:#fff;text-shadow:0 0 18px rgba(255,255,255,.35);min-width:90px;text-align:center}
  .speed{font-family:'Orbitron';font-weight:700;text-align:right}
  #speed{font-size:64px;line-height:1;color:#fff;text-shadow:0 0 16px rgba(120,200,255,.4)}
  .speed small{font-size:14px;color:#888;font-family:'Share Tech Mono';font-weight:400;margin-left:4px}
  .rpm-wrap{display:flex;flex-direction:column;gap:6px}
  .leds{display:flex;gap:3px}
  .led{flex:1;height:14px;border-radius:3px;background:#1a1a1a;box-shadow:inset 0 1px 2px rgba(0,0,0,.6);transition:background .05s,box-shadow .05s}
  .led.on{background:var(--c);box-shadow:0 0 10px var(--c),inset 0 0 4px rgba(255,255,255,.4)}
  .led.flash{animation:flash .18s steps(2) infinite}
  @keyframes flash{50%{background:#1a1a1a;box-shadow:none}}
  .rpm-bar{height:10px;border-radius:5px;background:#111;overflow:hidden;border:1px solid #222}
  #rpm-fill{height:100%;width:0;background:linear-gradient(90deg,#22c55e,#eab308,#f59e0b,#ef4444);transition:width .05s}
  .rpm-num{display:flex;justify-content:space-between;font-size:13px;color:#aaa}
  #rpm{color:#fff;font-family:'Orbitron';font-weight:700}
  .inputs{display:flex;flex-direction:column;gap:7px}
  .bar{display:flex;align-items:center;gap:8px}
  .bar label{width:34px;font-size:11px;color:#888}
  .track{flex:1;height:14px;border-radius:7px;background:#111;overflow:hidden;border:1px solid #222}
  #thr,#brk{height:100%;width:0;transition:width .05s}
  #thr{background:linear-gradient(90deg,#16a34a,#4ade80)}
  #brk{background:linear-gradient(90deg,#b91c1c,#f87171)}
  .tyres{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .tyre{border:1px solid #222;border-radius:8px;padding:8px 10px;background:#0c0c0c}
  .tyre .pos{font-size:10px;color:#777;letter-spacing:.1em}
  .tyre .temp{font-family:'Orbitron';font-weight:700;font-size:22px;line-height:1.1}
  .tyre .wear{font-size:11px;color:#888;margin-top:2px}
  .bottom{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;text-align:center;font-size:11px;color:#777;border-top:1px solid #1a1a1a;padding-top:10px}
  .bottom span{display:block;font-family:'Orbitron';font-weight:700;font-size:16px;color:#fff;margin-top:2px}
  #delta.pos{color:#22c55e}#delta.neg{color:#ef4444}
  #waiting{position:fixed;inset:0;background:rgba(6,6,6,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;z-index:10}
  #waiting h2{font-family:'Orbitron';font-weight:700;font-size:22px;color:#ccc;margin:18px 0 8px}
  #waiting p{color:#777;font-size:14px;max-width:300px}
  .pulse{width:54px;height:54px;border-radius:50%;border:2px solid #22c55e;box-shadow:0 0 24px rgba(34,197,94,.5);animation:pulse 1.6s ease-in-out infinite}
  @keyframes pulse{0%,100%{transform:scale(.85);opacity:.5}50%{transform:scale(1.1);opacity:1}}
  .hidden{display:none!important}
</style>
</head>
<body>
<div id="dash">
  <div class="top-bar"><span id="sim">&mdash;</span><span id="track">&mdash;</span><span id="pos">P&mdash;</span></div>
  <div class="main-row">
    <div class="gear"><span id="gear">N</span></div>
    <div class="speed"><span id="speed">0</span><small>km/h</small></div>
  </div>
  <div class="rpm-wrap">
    <div class="leds" id="leds"></div>
    <div class="rpm-bar"><div id="rpm-fill"></div></div>
    <div class="rpm-num"><span>RPM</span><span><span id="rpm">0</span> / <span id="maxrpm">8000</span></span></div>
  </div>
  <div class="inputs">
    <div class="bar"><label>THR</label><div class="track"><div id="thr"></div></div></div>
    <div class="bar"><label>BRK</label><div class="track"><div id="brk"></div></div></div>
  </div>
  <div class="tyres" id="tyres"></div>
  <div class="bottom">
    <div>LAP<span id="lap">&mdash;</span></div>
    <div>LAST<span id="last">&mdash;</span></div>
    <div>BEST<span id="best">&mdash;</span></div>
    <div>DELTA<span id="delta">&mdash;</span></div>
    <div>FUEL<span id="fuel">&mdash;</span></div>
  </div>
</div>
<div id="waiting">
  <div class="pulse"></div>
  <h2>Waiting for your sim&hellip;</h2>
  <p>Launch your sim and start a session &mdash; the dashboard lights up automatically.</p>
</div>
<script>
const $=id=>document.getElementById(id);
const NLEDS=10;
let ws=null,waitingEl=$('waiting'),dashEl=$('dash');
function fmt(t){if(t==null||isNaN(t))return'--:--.---';const m=Math.floor(t/60),s=Math.floor(t%60),ms=Math.round((t%1)*1000);return m+':'+String(s).padStart(2,'0')+'.'+String(ms).padStart(3,'0');}
function tyreColor(t){if(t==null)return'#555';if(t<70)return'#3b82f6';if(t<82)return'#22c55e';if(t<92)return'#eab308';if(t<100)return'#f59e0b';return'#ef4444';}
function renderLeds(rpm,max){const r=max?rpm/max:0;let h='';for(let i=1;i<=NLEDS;i++){const on=r>=i/NLEDS;const c=i<=5?'#22c55e':i<=7?'#eab308':i<=9?'#f59e0b':'#ef4444';const flash=r>=0.95&&i>=10;h+='<div class="led '+(on?'on':'')+' '+(flash?'flash':'')+'" style="--c:'+c+'"></div>';}$('leds').innerHTML=h;}
function renderTyres(ty){const order=['fl','fr','rl','rr'];const labels=['FL','FR','RL','RR'];let h='';for(let i=0;i<4;i++){const k=order[i];const t=ty&&ty[k];const temp=t?t.temp_c:null;const wear=t?t.wear_pct:null;const col=tyreColor(temp);h+='<div class="tyre"><div class="pos">'+labels[i]+'</div><div class="temp" style="color:'+col+'">'+(temp!=null?Math.round(temp)+'°C':'--')+'</div><div class="wear">'+(wear!=null?'Wear '+Math.round(wear)+'%':'')+'</div></div>';}$('tyres').innerHTML=h;}
function render(d){
  $('sim').textContent=d.sim||'—';$('track').textContent=d.track||'—';$('pos').textContent=d.position?('P'+d.position):'P—';
  $('gear').textContent=d.gear!=null?(d.gear==0?'N':d.gear):'N';
  $('speed').textContent=d.speed_kmh!=null?Math.round(d.speed_kmh):'0';
  const max=d.max_rpm||8000;$('rpm').textContent=d.rpm||0;$('maxrpm').textContent=max;
  const r=max?(d.rpm||0)/max:0;$('rpm-fill').style.width=(Math.min(1,r)*100)+'%';renderLeds(d.rpm||0,max);
  $('thr').style.width=((d.throttle||0)*100)+'%';$('brk').style.width=((d.brake||0)*100)+'%';
  renderTyres(d.tyres);
  $('lap').textContent=(d.lap||'—')+'/'+(d.total_laps||'—');
  $('last').textContent=d.last_lap_time!=null?fmt(d.last_lap_time):'—';
  $('best').textContent=d.best_lap_time!=null?fmt(d.best_lap_time):'—';
  const dl=$('delta');dl.textContent=d.lap_delta!=null?(d.lap_delta>=0?'+':'')+d.lap_delta.toFixed(3):'—';dl.className=d.lap_delta!=null?(d.lap_delta<0?'pos':'neg'):'';
  $('fuel').textContent=d.fuel_litres!=null?Math.round(d.fuel_litres)+'L':'—';
  waitingEl.classList.add('hidden');dashEl.classList.remove('hidden');
}
function showWaiting(msg){$('waiting').querySelector('h2').textContent=msg||'Waiting for your sim…';waitingEl.classList.remove('hidden');dashEl.classList.add('hidden');}
function connect(){
  try{ws=new WebSocket('ws://'+location.host+'/ws');}catch(e){setTimeout(connect,2000);return;}
  ws.onmessage=e=>{let m;try{m=JSON.parse(e.data);}catch{return;}if(m.type==='telemetry')render(m);else if(m.type==='status'){if(m.detected)showWaiting((m.sim||'Sim')+' detected — start a session');else showWaiting();}};
  ws.onopen=()=>showWaiting('Connected — waiting for your sim…');
  ws.onclose=()=>{showWaiting('Reconnecting…');setTimeout(connect,2000);};
  ws.onerror=()=>{try{ws.close();}catch{}};
}
connect();
</script>
</body>
</html>"""


async def handle_root(request):
    return web.Response(text=dashboard_html(), content_type="text/html")


def build_app():
    app = web.Application()
    app.router.add_route("OPTIONS", "/", handle_preflight)
    app.router.add_route("OPTIONS", "/ws", handle_preflight)
    app.router.add_route("OPTIONS", "/health", handle_preflight)
    app.router.add_get("/health", handle_health)
    app.router.add_get("/ws", handle_websocket)
    app.router.add_get("/", handle_root)
    return app


def lan_ips():
    """Return a list of likely LAN IPv4 addresses for the banner."""
    ips = []
    try:
        host = socket.gethostname()
        for info in socket.getaddrinfo(host, None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    if _psutil:
        try:
            for _iface, addrs in _psutil.net_if_addrs().items():
                for a in addrs:
                    if a.family == socket.AF_INET:
                        ip = a.address
                        if not ip.startswith("127.") and ip not in ips:
                            ips.append(ip)
        except Exception:
            pass
    return ips or ["<your-PC-IP>"]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
async def main():
    parser = argparse.ArgumentParser(description="SimSetApp Universal Telemetry Bridge")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--sim", choices=["auto", "mock", "iracing", "acc", "ac", "rf2", "lmu", "ams2", "f1", "forza", "gt7"], default="auto")
    parser.add_argument("--hz", type=int, default=20)
    parser.add_argument("--f1-port", type=int, default=20777)
    parser.add_argument("--forza-port", type=int, default=5300)
    parser.add_argument("--gt7-port", type=int, default=33740)
    parser.add_argument("--gt7-ps5-ip", default=None, help="PS5 IP for GT7 heartbeat")
    args = parser.parse_args()

    if args.sim != "auto":
        state["manual"] = args.sim

    # Start UDP listeners (in auto mode, all three; in manual mode, only the chosen one)
    udp_specs = []
    if args.sim in ("auto", "f1"):
        udp_specs.append(("f1", "F1 24", F1UDPProvider(args.f1_port)))
    if args.sim in ("auto", "forza"):
        udp_specs.append(("forza", "Forza", ForzaUDPProvider(args.forza_port)))
    if args.sim in ("auto", "gt7"):
        udp_specs.append(("gt7", "Gran Turismo 7", GT7UDPProvider(args.gt7_port, args.gt7_ps5_ip)))
    for _key, _display, udp in udp_specs:
        await udp.start()
        state["udp_providers"].append((_key, _display, udp))

    print("=" * 64)
    print(" SimSetApp Universal Telemetry Bridge (aiohttp) — 8 sims")
    print(f" Mode       : {'auto-detect' if args.sim == 'auto' else args.sim}")
    print(f" WebSocket  : ws://<this-PC>:{args.port}/ws")
    print(f" Health     : http://localhost:{args.port}/health")
    print(f" Rate       : {args.hz} Hz")
    ips = lan_ips()
    print(" LAN IP(s)  : " + ", ".join(ips))
    print(" On a phone, connect to:  ws://" + ips[0] + f":{args.port}/ws")
    print("-" * 64)
    print(" Supported: iRacing, ACC, Assetto Corsa, rFactor 2, Le Mans Ultimate,")
    print(" Automobilista 2 (shared memory) + F1, Forza, Gran Turismo 7 (UDP)")
    print(" Open SimSetApp -> Live Telemetry -> Connect.\n")

    app = build_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", args.port)
    await site.start()
    print(f"[{ts()}] server listening on 0.0.0.0:{args.port}")

    asyncio.create_task(detect_loop())
    await broadcast_loop(args.hz)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopped.")