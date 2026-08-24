import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_URL = "ws://localhost:3344/ws";
const STORAGE_KEY = "simsetapp-telemetry-url";

/**
 * Client-side mock telemetry generator — mirrors the Python bridge's mock mode
 * so the dashboard works instantly with no install.
 */
const MOCK_WAYPOINTS = [ // Silverstone GP — GT3 corner-by-corner speed profile (km/h)
  [0.00, 250], [0.045, 258], [0.065, 228], [0.085, 252],
  [0.115, 252], [0.135, 78], [0.165, 88], [0.195, 172],
  [0.245, 260], [0.295, 260], [0.315, 102], [0.355, 122],
  [0.395, 200], [0.415, 218], [0.455, 268], [0.475, 248],
  [0.505, 272], [0.530, 238], [0.555, 224], [0.585, 250],
  [0.615, 262], [0.705, 286], [0.755, 286], [0.775, 148],
  [0.810, 170], [0.840, 122], [0.880, 205], [0.945, 282],
  [1.00, 250],
];
const MOCK_GEAR_MAX = [0, 90, 130, 175, 215, 250, 288];
const MOCK_AMBIENT = 25, MOCK_COLD_PRESSURE = 26, MOCK_TOTAL_LAPS = 18, MOCK_PIT_LAP = 9, MOCK_FUEL_START = 100, MOCK_FUEL_PER_LAP = 3.2, MOCK_LAP_LENGTH = 118;
const MOCK_TYRE_TARGET = { fl: 88, fr: 84, rl: 82, rr: 81 };
const MOCK_TYRE_WEAR = { fl: 1.15, fr: 1.0, rl: 0.95, rr: 1.05 };

function _mockSmooth(a, b, x) {
  const f = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return f * f * (3 - 2 * f);
}
function _mockTargetSpeed(phase) {
  for (let i = 0; i < MOCK_WAYPOINTS.length - 1; i++) {
    const [p0, s0] = MOCK_WAYPOINTS[i], [p1, s1] = MOCK_WAYPOINTS[i + 1];
    if (phase <= p1) return s0 + (s1 - s0) * _mockSmooth(p0, p1, phase);
  }
  return MOCK_WAYPOINTS[MOCK_WAYPOINTS.length - 1][1];
}

function makeMockState() {
  return {
    t: 0, lap: 1, lapStart: 0, speed: 80, gear: 2,
    throttle: 0, brake: 0, steer: 0, shiftTimer: 0, shiftDir: 0,
    fuel: MOCK_FUEL_START, best: null, lapDelta: null, position: 4, incidents: 0,
    cornerDir: 1, lastCorner: false, inPit: false, pitTimer: 0,
    lapTimes: [], raceElapsed: 0, aheadGap: -1.4, behindGap: 0.9, aheadTimer: 0, behindTimer: 0,
    tyres: {
      fl: { temp_c: MOCK_AMBIENT + 5, wear_pct: 0 },
      fr: { temp_c: MOCK_AMBIENT + 4, wear_pct: 0 },
      rl: { temp_c: MOCK_AMBIENT + 3, wear_pct: 0 },
      rr: { temp_c: MOCK_AMBIENT + 3, wear_pct: 0 },
    },
  };
}

function mockTick(s) {
  const dt = 0.05;
  s.t += dt;
  let lapTime = s.t - s.lapStart;
  const phase = (lapTime % MOCK_LAP_LENGTH) / MOCK_LAP_LENGTH;
  let lastLapTime = null;

  if (s.inPit) {
    s.pitTimer -= dt;
    s.speed = Math.max(0, s.speed - 40 * dt);
    s.throttle = 0;
    s.brake = s.speed > 5 ? 0.3 : 0;
    s.steer = 0;
    s.gear = s.speed > 1 ? 1 : 0;
    for (const k in s.tyres) s.tyres[k].temp_c += (MOCK_AMBIENT + 30 - s.tyres[k].temp_c) * 0.01;
    s.fuel = Math.min(MOCK_FUEL_START, s.fuel + 8 * dt);
    if (s.pitTimer <= 0) {
      s.inPit = false;
      for (const k in s.tyres) s.tyres[k].wear_pct = 0;
    }
  } else {
    const targetInstant = _mockTargetSpeed(phase);
    let tMinAhead = Infinity;
    for (let k = 1; k <= 2; k++) tMinAhead = Math.min(tMinAhead, _mockTargetSpeed((phase + k * 0.01) % 1));
    const target = Math.min(targetInstant, tMinAhead);
    const brakeDemand = Math.max(0, s.speed - tMinAhead);
    const diff = target - s.speed;
    if (brakeDemand > 5) s.speed -= Math.min(75 * (0.2 + 0.8 * s.brake) * dt, brakeDemand);
    else if (diff > 0) s.speed += Math.min(45 * (0.1 + 0.9 * s.throttle) * dt, diff);
    else if (diff < 0) s.speed -= Math.min(30 * (0.2 + 0.8 * s.brake) * dt, -diff);
    s.speed = Math.max(0, Math.min(300, s.speed));

    const cur = s.gear;
    const rpmNow = MOCK_GEAR_MAX[cur] ? (s.speed / MOCK_GEAR_MAX[cur]) * 8000 : 0;
    if (rpmNow > 7400 && cur < 6 && s.shiftTimer <= 0) { s.gear = cur + 1; s.shiftTimer = 0.18; s.shiftDir = 1; }
    else if (rpmNow < 5000 && cur > 1 && s.shiftTimer <= 0) { s.gear = cur - 1; s.shiftTimer = 0.16; s.shiftDir = -1; }

    const tNext = _mockTargetSpeed((phase + 0.02) % 1);
    const dtgt = tNext - target;
    let intentThr, intentBrk;
    if (brakeDemand > 5) { intentThr = 0; intentBrk = Math.min(1, brakeDemand / 50); }
    else if (dtgt > 1.5) { intentThr = 1; intentBrk = 0; }
    else if (target > 170) { intentThr = 1; intentBrk = 0; }
    else { intentThr = 0.35; intentBrk = 0; }
    if (s.shiftTimer > 0) s.shiftTimer -= dt;   // GT3 sequential box: no-lift upshifts, auto-blip downshifts
    const thrErr = intentThr - s.throttle;
    s.throttle += thrErr * (thrErr > 0 ? 0.2 : 0.4);
    const brkErr = intentBrk - s.brake;
    s.brake += brkErr * (brkErr > 0 ? 0.6 : 0.25);

    const corner = Math.max(0, (200 - target) / 130);
    const inCorner = corner > 0.15;
    if (inCorner && !s.lastCorner) s.cornerDir *= -1;
    s.lastCorner = inCorner;
    const targetSteer = inCorner ? s.cornerDir * corner : 0;
    s.steer += (targetSteer - s.steer) * 0.2;
    s.steer = Math.max(-1, Math.min(1, s.steer));

    const load = corner * 8;
    for (const k in s.tyres) {
      const tgt = MOCK_TYRE_TARGET[k] + load + (Math.random() * 0.6 - 0.3);
      s.tyres[k].temp_c += (tgt - s.tyres[k].temp_c) * 0.03;
      s.tyres[k].temp_c += Math.random() * 0.3 - 0.15;
    }
  }

  let rpm = Math.max(800, Math.min(8000, Math.round(MOCK_GEAR_MAX[s.gear] ? (s.speed / MOCK_GEAR_MAX[s.gear]) * 8000 : 0)));
  if (rpm >= 7800) rpm = Math.round(7800 - 100 - 100 * Math.sin(s.t * 30));

  if (lapTime >= MOCK_LAP_LENGTH) {
    const deg = (s.tyres.fl.wear_pct + s.tyres.fr.wear_pct + s.tyres.rl.wear_pct + s.tyres.rr.wear_pct) / 4 * 0.04;
    lastLapTime = +(MOCK_LAP_LENGTH + (Math.random() - 0.5) * 0.6 + deg).toFixed(3);
    s.lapTimes.push(lastLapTime);
    if (s.best == null || lastLapTime < s.best) s.best = lastLapTime;
    s.lapDelta = +(lastLapTime - s.best).toFixed(3);
    s.lapStart = s.t;
    s.lap += 1;
    s.fuel = Math.max(0, s.fuel - MOCK_FUEL_PER_LAP);
    for (const k in s.tyres) s.tyres[k].wear_pct = Math.min(100, s.tyres[k].wear_pct + MOCK_TYRE_WEAR[k]);
    if (s.lap === 6 && s.position > 1) s.position -= 1;
    if (s.lap === MOCK_PIT_LAP + 1) { s.inPit = true; s.pitTimer = 3.5; }
    if (s.lap > MOCK_TOTAL_LAPS) {
      s.lap = 1; s.fuel = MOCK_FUEL_START; s.best = null; s.position = 4;
      s.lapTimes = []; s.raceElapsed = 0;
      for (const k in s.tyres) { s.tyres[k].wear_pct = 0; s.tyres[k].temp_c = MOCK_AMBIENT + 5; }
    }
    lapTime = 0;
  }

  s.raceElapsed += dt;
  const avgLap = s.lapTimes.length ? +(s.lapTimes.reduce((a, b) => a + b, 0) / s.lapTimes.length).toFixed(3) : null;
  const lapsRemaining = Math.max(0, MOCK_TOTAL_LAPS - s.lap + 1);
  const fuelRequired = +(MOCK_FUEL_PER_LAP * lapsRemaining).toFixed(1);
  const timeRemaining = Math.max(0, MOCK_TOTAL_LAPS * MOCK_LAP_LENGTH - s.raceElapsed);
  const boost = +(0.8 + s.throttle * 0.6).toFixed(2);
  s.aheadTimer += dt; s.behindTimer += dt;
  s.aheadGap = -1.4 + Math.sin(s.aheadTimer * 0.15) * 0.6;
  s.behindGap = 0.9 + Math.sin(s.behindTimer * 0.11) * 0.5;

  const tyres = {};
  for (const k in s.tyres) {
    tyres[k] = {
      temp_c: +s.tyres[k].temp_c.toFixed(1),
      wear_pct: +s.tyres[k].wear_pct.toFixed(1),
      pressure_psi: +(MOCK_COLD_PRESSURE + (s.tyres[k].temp_c - MOCK_AMBIENT) * 0.06).toFixed(1),
    };
  }

  return {
    type: "telemetry",
    ts: Date.now() / 1000,
    sim: "Demo Sim",
    connected: true,
    session_type: "Race",
    track: "Silverstone GP",
    car: "Mercedes-AMG GT3",
    lap: s.lap,
    total_laps: MOCK_TOTAL_LAPS,
    position: s.position,
    incidents: s.incidents,
    current_lap_time: +lapTime.toFixed(3),
    last_lap_time: lastLapTime,
    best_lap_time: s.best != null ? +s.best.toFixed(3) : null,
    lap_delta: s.lapDelta,
    speed_kmh: +s.speed.toFixed(1),
    rpm,
    max_rpm: 8000,
    gear: s.gear,
    throttle: +s.throttle.toFixed(2),
    brake: +s.brake.toFixed(2),
    steer: +s.steer.toFixed(2),
    fuel_litres: +s.fuel.toFixed(1),
    fuel_per_lap: MOCK_FUEL_PER_LAP,
    fuel_required: fuelRequired,
    avg_lap_time: avgLap,
    time_remaining: +timeRemaining.toFixed(1),
    air_temp: 24.0,
    track_temp: 31.0,
    boost,
    brake_bias: 56.0,
    tc1: 5, tc2: 3, abs: 2, map: 3,
    car_ahead_gap: +s.aheadGap.toFixed(2),
    car_behind_gap: +s.behindGap.toFixed(2),
    tyres,
  };
}

/**
 * Manages a WebSocket connection to the local telemetry bridge,
 * plus a zero-setup demo mode that streams mock frames client-side.
 */
export function useLiveTelemetry() {
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_URL);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error | closed
  const [data, setData] = useState(null);
  const [lastLap, setLastLap] = useState(null);
  const [demo, setDemo] = useState(false);
  const [detectedSim, setDetectedSim] = useState(null);
  const [detected, setDetected] = useState(false);
  const wsRef = useRef(null);
  const lastDataAtRef = useRef(0);
  const prevLapRef = useRef(null);
  const reconnectRef = useRef(null);
  const manualDisconnectRef = useRef(false);
  const demoRef = useRef(null);
  const mockStateRef = useRef(null);

  const stopDemo = useCallback(() => {
    if (demoRef.current) { clearInterval(demoRef.current); demoRef.current = null; }
    setDemo(false);
  }, []);

  const startDemo = useCallback(() => {
    // stop any websocket / pending reconnect
    manualDisconnectRef.current = true;
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) { try { wsRef.current.close(); } catch {} }
    wsRef.current = null;
    if (demoRef.current) clearInterval(demoRef.current);

    mockStateRef.current = makeMockState();
    prevLapRef.current = null;
    setDemo(true);
    setStatus("connected");
    demoRef.current = setInterval(() => {
      if (!mockStateRef.current) return;
      const frame = mockTick(mockStateRef.current);
      setData(frame);
      if (frame.last_lap_time != null) setLastLap({ ...frame });
    }, 50);
  }, []);

  const connect = useCallback(
    (overrideUrl) => {
      stopDemo();
      const target = overrideUrl || url;
      manualDisconnectRef.current = false;
      setDetectedSim(null);
      setDetected(false);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
      setStatus("connecting");
      let ws;
      try {
        ws = new WebSocket(target);
      } catch {
        setStatus("error");
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => setStatus("searching");
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "telemetry") {
            setData(msg);
            setStatus("connected");
            lastDataAtRef.current = Date.now();
            const lap = msg.lap;
            if (prevLapRef.current != null && lap != null && lap > prevLapRef.current) {
              setLastLap(msg);
            }
            prevLapRef.current = lap;
          } else if (msg.type === "status") {
            // bridge is up — capture which sim (if any) it has detected
            setDetectedSim(msg.sim || null);
            setDetected(!!msg.detected);
            // grace window: only flip to "searching" if no telemetry for >3s,
            // so a single dropped frame doesn't blank the dashboard
            const sinceData = Date.now() - (lastDataAtRef.current || 0);
            if (sinceData > 3000) {
              setStatus("searching");
            }
          }
        } catch {}
      };
      ws.onerror = () => setStatus("error");
      ws.onclose = () => {
        if (manualDisconnectRef.current) {
          setStatus("idle");
          return;
        }
        setStatus("closed");
        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        reconnectRef.current = setTimeout(() => connect(target), 2000);
      };
    },
    [url, stopDemo]
  );

  const disconnect = useCallback(() => {
    manualDisconnectRef.current = true;
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }
    wsRef.current = null;
    stopDemo();
    setStatus("idle");
    setData(null);
    setDetectedSim(null);
    setDetected(false);
    prevLapRef.current = null;
    lastDataAtRef.current = 0;
  }, [stopDemo]);

  const saveUrl = useCallback((newUrl) => {
    localStorage.setItem(STORAGE_KEY, newUrl);
    setUrl(newUrl);
  }, []);

  useEffect(() => {
    return () => {
      manualDisconnectRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (demoRef.current) clearInterval(demoRef.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
    };
  }, []);

  return { url, saveUrl, status, data, lastLap, detectedSim, detected, connect, disconnect, demo, startDemo };
}