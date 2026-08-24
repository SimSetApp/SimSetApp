import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_URL = "ws://localhost:3344";
const STORAGE_KEY = "simsetapp-telemetry-url";

/**
 * Manages a WebSocket connection to the local telemetry bridge.
 * Returns the latest telemetry frame, connection status, and lap-completion events.
 */
export function useLiveTelemetry() {
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_URL);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error | closed
  const [data, setData] = useState(null);
  const [lastLap, setLastLap] = useState(null);
  const wsRef = useRef(null);
  const prevLapRef = useRef(null);
  const reconnectRef = useRef(null);
  const manualDisconnectRef = useRef(false);

  const connect = useCallback(
    (overrideUrl) => {
      const target = overrideUrl || url;
      manualDisconnectRef.current = false;
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

      ws.onopen = () => setStatus("connected");
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type !== "telemetry") return;
          setData(msg);
          const lap = msg.lap;
          if (prevLapRef.current != null && lap != null && lap > prevLapRef.current) {
            setLastLap(msg);
          }
          prevLapRef.current = lap;
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
    [url]
  );

  const disconnect = useCallback(() => {
    manualDisconnectRef.current = true;
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
    }
    wsRef.current = null;
    setStatus("idle");
    setData(null);
    prevLapRef.current = null;
  }, []);

  const saveUrl = useCallback((newUrl) => {
    localStorage.setItem(STORAGE_KEY, newUrl);
    setUrl(newUrl);
  }, []);

  useEffect(() => {
    return () => {
      manualDisconnectRef.current = true;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        try { wsRef.current.close(); } catch {}
      }
    };
  }, []);

  return { url, saveUrl, status, data, lastLap, connect, disconnect };
}