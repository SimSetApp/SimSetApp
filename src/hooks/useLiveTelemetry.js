import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_URL = "ws://localhost:3344/ws";
const STORAGE_KEY = "simsetapp-telemetry-url";
const STALE_MS = 5000;
const MAX_RECONNECT = 5;
const BC_CHANNEL = "simsetapp-telemetry";

/**
 * Client-side mock telemetry generator — mirrors the Python bridge's mock mode
 * so the dashboard works instantly with no install.
 *
 * Full scenario simulation: cycles through green → yellow flag → pit stop,
 * 3-point tyre temps, brake disc temps, sector times with best/PB comparison,
 * DRS activation, water/oil temp, and fuel burn down to a low-fuel alarm.
 * Boost is omitted (the mock car is naturally aspirated).
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
const MOCK_AMBIENT = 25, MOCK_COLD_PRESSURE = 26, MOCK_TOTAL_LAPS = 18, MOCK_PIT_LAP = 9, MOCK_FUEL_START = 100, MOCK_FUEL_PER_LAP = 3.2, MOCK_LAP_LENGTH = 118, MOCK_FUEL_MAX = 100;
const MOCK_TYRE_TARGET = { fl: 88, fr: 84, rl: 82, rr: 81 };
const MOCK_TYRE_WEAR = { fl: 1.15, fr: 1.0, rl: 0.95, rr: 1.05 };
const MOCK_YELLOW_LAP = 5;

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
      fl: { temp_c: MOCK_AMBIENT + 5, wear_pct: 0, brake_temp: 80 },
      fr: { temp_c: MOCK_AMBIENT + 4, wear_pct: 0, brake_temp: 80 },
      rl: { temp_c: MOCK_AMBIENT + 3, wear_pct: 0, brake_temp: 80 },
      rr: { temp_c: MOCK_AMBIENT + 3, wear_pct: 0, brake_temp: 80 },
    },
    // Sector tracking
    sectorTimes: [null, null, null],
    sectorStart: 0,
    currentSector: 0,
    bestSectors: [null, null, null],
    personalBestSectors: [null, null, null],
    // Scenario
    flagState: null,
    waterTemp: 90,
    oilTemp: 105,
    finished: false,
    finishedTimer: 0,
  };
}

function mockTick(s) {
  const dt = 0.05;
  s.t += dt;
  let lapTime = s.t - s.lapStart;
  const phase = (lapTime % MOCK_LAP_LENGTH) / MOCK_LAP_LENGTH;
  let lastLapTime = null;

  // Yellow flag: reduce target speed by 30% during the yellow lap
  const yellowActive = s.lap === MOCK_YELLOW_LAP;
  // Checkered flag during the finished phase before the demo restarts
  s.flagState = s.finished ? "checkered" : (yellowActive ? "yellow" : null);

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
    let target = Math.min(targetInstant, tMinAhead);
    if (yellowActive) target *= 0.7; // slow down under yellow
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
    if (s.shiftTimer > 0) s.shiftTimer -= dt;
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
      // Brake disc temp: heats under braking, cools on straights
      if (s.brake > 0.3) s.tyres[k].brake_temp += 15 * dt * s.brake;
      else s.tyres[k].brake_temp -= 3 * dt;
      s.tyres[k].brake_temp = Math.max(80, Math.min(700, s.tyres[k].brake_temp));
    }

    // Sector tracking: record when crossing sector boundaries
    const secBoundary = (s.currentSector + 1) / 3;
    if (phase >= secBoundary && s.currentSector < 2) {
      const secTime = s.t - s.sectorStart;
      s.sectorTimes[s.currentSector] = +secTime.toFixed(3);
      s.currentSector += 1;
      s.sectorStart = s.t;
    }
  }

  let rpm = MOCK_GEAR_MAX[s.gear] ? Math.max(800, Math.min(8000, Math.round((s.speed / MOCK_GEAR_MAX[s.gear]) * 8000))) : Math.round(800 + Math.sin(s.t * 8) * 150);
  if (rpm >= 7800) rpm = Math.round(7800 - 100 - 100 * Math.sin(s.t * 30));

  // DRS: active on straights (high speed, full throttle, not cornering, not pitting, green flag)
  const drs = !s.inPit && s.speed > 200 && s.throttle > 0.8 && !s.lastCorner;

  // Water/oil temp: gentle fluctuation
  s.waterTemp = 90 + Math.sin(s.t * 0.05) * 2;
  s.oilTemp = 105 + Math.sin(s.t * 0.04) * 3;

  if (lapTime >= MOCK_LAP_LENGTH) {
    // Record final sector
    const secTime = s.t - s.sectorStart;
    s.sectorTimes[2] = +secTime.toFixed(3);

    // Update best sectors
    for (let i = 0; i < 3; i++) {
      if (s.sectorTimes[i] != null) {
        if (s.bestSectors[i] == null || s.sectorTimes[i] < s.bestSectors[i]) s.bestSectors[i] = s.sectorTimes[i];
        if (s.personalBestSectors[i] == null || s.sectorTimes[i] < s.personalBestSectors[i]) s.personalBestSectors[i] = s.sectorTimes[i];
      }
    }

    const deg = (s.tyres.fl.wear_pct + s.tyres.fr.wear_pct + s.tyres.rl.wear_pct + s.tyres.rr.wear_pct) / 4 * 0.04;
    lastLapTime = +(MOCK_LAP_LENGTH + (Math.random() - 0.5) * 0.6 + deg).toFixed(3);
    s.lapTimes.push(lastLapTime);
    if (s.best == null || lastLapTime < s.best) s.best = lastLapTime;
    s.lapDelta = +(lastLapTime - s.best).toFixed(3);
    s.lapStart = s.t;
    s.sectorStart = s.t;
    s.currentSector = 0;
    s.sectorTimes = [null, null, null];
    s.lap += 1;
    s.fuel = Math.max(0, s.fuel - MOCK_FUEL_PER_LAP);
    for (const k in s.tyres) s.tyres[k].wear_pct = Math.min(100, s.tyres[k].wear_pct + MOCK_TYRE_WEAR[k]);
    if (s.lap === 6 && s.position > 1) s.position -= 1;
    if (s.lap === MOCK_PIT_LAP + 1) { s.inPit = true; s.pitTimer = 3.5; }
    if (s.lap > MOCK_TOTAL_LAPS && !s.finished) {
      s.finished = true;
      s.finishedTimer = 4;
    }
    lapTime = 0;
  }

  // Brief FINISHED state — checkered flag waves, car slows, then restart.
  // Runs every frame (not just on lap completion) so the timer counts down
  // in ~4 seconds instead of ~80 laps.
  if (s.finished) {
    s.finishedTimer -= dt;
    s.speed = Math.max(0, s.speed - 20 * dt);
    s.throttle = 0;
    s.brake = s.speed > 5 ? 0.2 : 0;
    if (s.finishedTimer <= 0) {
      s.finished = false;
      s.lap = 1; s.fuel = MOCK_FUEL_START; s.best = null; s.position = 4;
      s.lapTimes = []; s.raceElapsed = 0;
      s.bestSectors = [null, null, null]; s.personalBestSectors = [null, null, null];
      for (const k in s.tyres) { s.tyres[k].wear_pct = 0; s.tyres[k].temp_c = MOCK_AMBIENT + 5; s.tyres[k].brake_temp = 80; }
    }
  }

  s.raceElapsed += dt;
  const avgLap = s.lapTimes.length ? +(s.lapTimes.reduce((a, b) => a + b, 0) / s.lapTimes.length).toFixed(3) : null;
  const lapsRemaining = Math.max(0, MOCK_TOTAL_LAPS - s.lap + 1);
  const fuelRequired = +(MOCK_FUEL_PER_LAP * lapsRemaining).toFixed(1);
  const timeRemaining = Math.max(0, MOCK_TOTAL_LAPS * MOCK_LAP_LENGTH - s.raceElapsed);
  s.aheadTimer += dt; s.behindTimer += dt;
  s.aheadGap = -1.4 + Math.sin(s.aheadTimer * 0.15) * 0.6;
  s.behindGap = 0.9 + Math.sin(s.behindTimer * 0.11) * 0.5;

  const tyres = {};
  for (const k in s.tyres) {
    const core = +s.tyres[k].temp_c.toFixed(1);
    const load = Math.max(0, (200 - _mockTargetSpeed(phase)) / 130) * 8;
    // 3-point temps: inner hotter (camber), middle = core, outer cooler
    const spread = 5 + load * 0.3;
    tyres[k] = {
      temp_c: core,
      temp_i: +(core + spread).toFixed(1),
      temp_m: +core.toFixed(1),
      temp_o: +(core - spread).toFixed(1),
      wear_pct: +s.tyres[k].wear_pct.toFixed(1),
      pressure_psi: +(MOCK_COLD_PRESSURE + (s.tyres[k].temp_c - MOCK_AMBIENT) * 0.06).toFixed(1),
      brake_temp: +s.tyres[k].brake_temp.toFixed(1),
    };
  }

  return {
    type: "telemetry",
    ts: Date.now() / 1000,
    sim: "Demo Sim",
    demo: true,
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
    fuel_max_litres: MOCK_FUEL_MAX,
    fuel_per_lap: MOCK_FUEL_PER_LAP,
    fuel_required: fuelRequired,
    avg_lap_time: avgLap,
    time_remaining: +timeRemaining.toFixed(1),
    air_temp: 24.0,
    track_temp: 31.0,
    brake_bias: 56.0,
    tc1: 5, tc2: 3, abs: 2, map: 3,
    // Depth fields
    sector_times: s.sectorTimes,
    best_sectors: s.bestSectors,
    personal_best_sectors: s.personalBestSectors,
    flag_state: s.flagState,
    pit_limiter: s.inPit,
    drs,
    water_temp: +s.waterTemp.toFixed(1),
    oil_temp: +s.oilTemp.toFixed(1),
    car_ahead_gap: +s.aheadGap.toFixed(2),
    car_behind_gap: +s.behindGap.toFixed(2),
    tyres,
    capabilities: { tyre_3point: true, brake_temps: true, sectors: true, flags: true },
  };
}

/**
 * Manages a WebSocket connection to the local telemetry bridge,
 * plus a zero-setup demo mode that streams mock frames client-side.
 *
 * Reliability: stale-frame detection (>5s with no data = 'stale' status),
 * auto-connect runs once on mount (not on every URL state change), reconnect
 * reads the latest URL from a ref (not a stale closure), and a terminal
 * 'failed' state after MAX_RECONNECT attempts so the user isn't stuck in
 * an infinite spinner. Disconnect clears data/lastLap/prevLap to prevent
 * phantom lap logging and frozen displays.
 */
export function useLiveTelemetry(autoConnect = true) {
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_URL);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | stale | searching | error | closed | failed
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
  const urlRef = useRef(url);
  const statusRef = useRef(status);
  const reconnectAttemptsRef = useRef(0);
  const mountedRef = useRef(false);
  const bcRef = useRef(null);

  // Broadcast each frame so the pop-out fullscreen dashboard can mirror this
  // connection instead of opening a second WebSocket to the bridge.
  const broadcast = useCallback((frame) => {
    if (!bcRef.current) {
      try { bcRef.current = new BroadcastChannel(BC_CHANNEL); } catch { return; }
    }
    try { bcRef.current.postMessage(frame); } catch { /* ignore */ }
  }, []);

  useEffect(() => { urlRef.current = url; }, [url]);
  useEffect(() => { statusRef.current = status; }, [status]);

  const stopDemo = useCallback(() => {
    if (demoRef.current) { clearInterval(demoRef.current); demoRef.current = null; }
    setDemo(false);
  }, []);

  const startDemo = useCallback(() => {
    manualDisconnectRef.current = true;
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) { try { wsRef.current.close(); } catch {} }
    wsRef.current = null;
    if (demoRef.current) clearInterval(demoRef.current);

    mockStateRef.current = makeMockState();
    prevLapRef.current = null;
    reconnectAttemptsRef.current = 0;
    setDemo(true);
    setStatus("connected");
    demoRef.current = setInterval(() => {
      if (!mockStateRef.current) return;
      const frame = mockTick(mockStateRef.current);
      setData(frame);
      broadcast(frame);
      lastDataAtRef.current = Date.now();
      if (frame.last_lap_time != null) setLastLap({ ...frame });
    }, 50);
  }, []);

  const connect = useCallback(
    (overrideUrl) => {
      stopDemo();
      const target = overrideUrl || urlRef.current;
      manualDisconnectRef.current = false;
      setDetectedSim(null);
      setDetected(false);
      reconnectAttemptsRef.current = 0;
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
            broadcast(msg);
            setStatus("connected");
            reconnectAttemptsRef.current = 0;
            lastDataAtRef.current = Date.now();
            const lap = msg.lap;
            if (prevLapRef.current != null && lap != null && lap > prevLapRef.current) {
              setLastLap(msg);
            }
            prevLapRef.current = lap;
          } else if (msg.type === "status") {
            setDetectedSim(msg.sim || null);
            setDetected(!!msg.detected);
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
        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current > MAX_RECONNECT) {
          setStatus("failed");
          reconnectAttemptsRef.current = 0;
          return;
        }
        setStatus("closed");
        if (reconnectRef.current) clearTimeout(reconnectRef.current);
        reconnectRef.current = setTimeout(() => connect(urlRef.current), 2000);
      };
    },
    [stopDemo]
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
    setLastLap(null);
    setDetectedSim(null);
    setDetected(false);
    prevLapRef.current = null;
    lastDataAtRef.current = 0;
    reconnectAttemptsRef.current = 0;
  }, [stopDemo]);

  const saveUrl = useCallback((newUrl) => {
    localStorage.setItem(STORAGE_KEY, newUrl);
    setUrl(newUrl);
  }, []);

  // Auto-connect once on mount (not on every URL state change).
  // Skipped when autoConnect=false — used by useSharedTelemetry to avoid a
  // second WebSocket when the main page is already broadcasting.
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    if (autoConnect) connect(urlRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stale detection: if connected but no data for >5s, flip to 'stale'
  useEffect(() => {
    const id = setInterval(() => {
      if (statusRef.current === "connected" && lastDataAtRef.current && Date.now() - lastDataAtRef.current > STALE_MS) {
        setStatus("stale");
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      manualDisconnectRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (demoRef.current) clearInterval(demoRef.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
      if (bcRef.current) { try { bcRef.current.close(); } catch {} bcRef.current = null; }
    };
  }, []);

  return { url, saveUrl, status, data, lastLap, detectedSim, detected, connect, disconnect, demo, startDemo };
}