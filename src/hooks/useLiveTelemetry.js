import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_URL = "ws://localhost:3344/ws";
const STORAGE_KEY = "simsetapp-telemetry-url";

/**
 * Client-side mock telemetry generator — mirrors the Python bridge's mock mode
 * so the dashboard works instantly with no install.
 */
function makeMockState() {
  return { t: 0, lap: 1, totalLaps: 30, lapStart: 0, lapLength: 18, best: 17.4, fuel: 95, tyreWear: 0, position: 3, incidents: 0 };
}

function mockTick(s) {
  s.t += 0.05;
  const lapTime = s.t - s.lapStart;
  const phase = (lapTime % s.lapLength) / s.lapLength;
  const speed =
    phase < 0.15 || (phase > 0.45 && phase < 0.55) || phase > 0.9
      ? 245 + 25 * Math.sin(phase * 18)
      : 125 + 55 * Math.abs(Math.sin(phase * 8));
  const rpm = 3200 + (speed / 280) * 4800;
  const gear = Math.max(1, Math.min(6, Math.floor(speed / 45)));
  const throttle = phase < 0.13 || (phase > 0.47 && phase < 0.53) || phase > 0.92 ? 1.0 : 0.35;
  const brake = (phase > 0.13 && phase < 0.18) || (phase > 0.53 && phase < 0.58) ? 0.85 : 0.0;
  const steer = 0.35 * Math.sin(phase * 12);

  let lastLapTime = null;
  let lapDelta = null;
  if (lapTime >= s.lapLength) {
    lastLapTime = +(s.lapLength + (Math.random() - 0.5) * 0.8).toFixed(3);
    s.lapStart = s.t;
    s.lap += 1;
    s.fuel = Math.max(0, s.fuel - 3.1);
    s.tyreWear = Math.min(100, s.tyreWear + 2.4);
    lapDelta = +(lastLapTime - s.best).toFixed(3);
    if (lastLapTime < s.best) s.best = lastLapTime;
  }
  const tw = +s.tyreWear.toFixed(1);
  const j = () => +(Math.random() * 6 - 3).toFixed(1);
  const tyres = {
    fl: { temp_c: 84 + j(), wear_pct: tw, pressure_psi: 27.8 },
    fr: { temp_c: 86 + j(), wear_pct: tw, pressure_psi: 27.9 },
    rl: { temp_c: 80 + j(), wear_pct: +(tw * 1.1).toFixed(1), pressure_psi: 27.6 },
    rr: { temp_c: 81 + j(), wear_pct: +(tw * 1.1).toFixed(1), pressure_psi: 27.7 },
  };
  return {
    type: "telemetry",
    ts: Date.now() / 1000,
    sim: "Demo Sim",
    connected: true,
    session_type: "Race",
    track: "Silverstone (Demo)",
    car: "GT3 Demo Car",
    lap: s.lap,
    total_laps: s.totalLaps,
    position: s.position,
    incidents: s.incidents,
    current_lap_time: +lapTime.toFixed(3),
    last_lap_time: lastLapTime,
    best_lap_time: +s.best.toFixed(3),
    lap_delta: lapDelta,
    speed_kmh: +speed.toFixed(1),
    rpm: Math.round(rpm),
    max_rpm: 8000,
    gear,
    throttle: +throttle.toFixed(2),
    brake: +brake.toFixed(2),
    steer: +steer.toFixed(2),
    fuel_litres: +s.fuel.toFixed(1),
    fuel_per_lap: 3.1,
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