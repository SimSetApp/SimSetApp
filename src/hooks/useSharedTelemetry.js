import { useState, useEffect, useRef } from "react";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";

const BC_CHANNEL = "simsetapp-telemetry";
const BROADCAST_WAIT = 2000; // wait this long for a broadcast before falling back

/**
 * Shared telemetry hook for the pop-out fullscreen dashboard.
 *
 * Listens to a BroadcastChannel for frames broadcast by the main
 * LiveTelemetry page. When frames arrive, it mirrors them — NO second
 * WebSocket is opened, so single-client bridges aren't evicted.
 *
 * If no broadcast arrives within 2s (main page closed, or user navigated
 * here directly), it falls back to its own useLiveTelemetry connection.
 */
export function useSharedTelemetry() {
  const [sharedData, setSharedData] = useState(null);
  const [lastBroadcast, setLastBroadcast] = useState(0);
  const [sharing, setSharing] = useState(false);
  // Don't auto-connect — we decide when to start the fallback
  const fallback = useLiveTelemetry(false);
  const fallbackStarted = useRef(false);

  useEffect(() => {
    let ch;
    try {
      ch = new BroadcastChannel(BC_CHANNEL);
    } catch {
      return;
    }
    ch.onmessage = (e) => {
      if (e.data?.type === "telemetry") {
        setSharedData(e.data);
        setLastBroadcast(Date.now());
        setSharing(true);
      }
    };
    return () => { try { ch.close(); } catch {} };
  }, []);

  // Wait briefly for a broadcast; if none arrives, start the fallback connection
  useEffect(() => {
    if (sharing || fallbackStarted.current) return;
    const id = setTimeout(() => {
      if (!fallbackStarted.current) {
        fallbackStarted.current = true;
        fallback.connect();
      }
    }, BROADCAST_WAIT);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharing]);

  // If broadcasts stop (main page closed), fall back to own connection
  useEffect(() => {
    if (!sharing) return;
    const id = setInterval(() => {
      if (Date.now() - lastBroadcast > 3000) {
        setSharing(false);
        setSharedData(null);
        if (!fallbackStarted.current) {
          fallbackStarted.current = true;
          fallback.connect();
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sharing, lastBroadcast, fallback]);

  if (sharing && sharedData) {
    return {
      url: fallback.url,
      saveUrl: fallback.saveUrl,
      status: "connected",
      data: sharedData,
      lastLap: null,
      detectedSim: sharedData?.sim || null,
      detected: false,
      connect: fallback.connect,
      disconnect: fallback.disconnect,
      demo: false,
      startDemo: fallback.startDemo,
    };
  }
  return fallback;
}