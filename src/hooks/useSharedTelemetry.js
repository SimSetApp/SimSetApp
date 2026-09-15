import { useState, useEffect, useRef } from "react";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";

const BC_CHANNEL = "simsetapp-telemetry";
const BROADCAST_WAIT = 2000; // wait this long for a broadcast before falling back
const STALE_MS = 3000; // no broadcast for this long = stale

/**
 * Shared telemetry hook for the pop-out fullscreen dashboard.
 *
 * Listens to a BroadcastChannel for frames broadcast by the main
 * LiveTelemetry page. When frames arrive, it mirrors them — NO second
 * WebSocket is opened, so single-client bridges aren't evicted.
 *
 * If no broadcast arrives within 2s (main page closed, or user navigated
 * here directly), it falls back to its own useLiveTelemetry connection.
 *
 * Stale detection uses refs (not state) for lastBroadcast and fallback so
 * the 1Hz interval isn't torn down and recreated on every 20fps frame.
 */
export function useSharedTelemetry() {
  const [sharedData, setSharedData] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [stale, setStale] = useState(false);
  // Don't auto-connect — we decide when to start the fallback
  const fallback = useLiveTelemetry(false);
  const fallbackStarted = useRef(false);
  const lastBroadcastRef = useRef(0);
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

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
        lastBroadcastRef.current = Date.now();
        setSharing(true);
        setStale(false);
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
        fallbackRef.current.connect();
      }
    }, BROADCAST_WAIT);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharing]);

  // Stale detection on the shared path — interval is stable (only depends on
  // `sharing`) so it fires reliably at 1Hz without being torn down every frame.
  // Uses refs for lastBroadcast and fallback to avoid identity churn.
  useEffect(() => {
    if (!sharing) return;
    const id = setInterval(() => {
      if (Date.now() - lastBroadcastRef.current > STALE_MS) {
        setStale(true);
        // If broadcasts stopped entirely, fall back to own connection
        if (!fallbackStarted.current) {
          fallbackStarted.current = true;
          fallbackRef.current.connect();
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [sharing]);

  if (sharing && sharedData) {
    return {
      url: fallback.url,
      saveUrl: fallback.saveUrl,
      status: stale ? "stale" : "connected",
      data: sharedData,
      lastLap: sharedData?.last_lap_time != null ? sharedData : null,
      detectedSim: sharedData?.sim || null,
      detected: false,
      connect: fallback.connect,
      disconnect: fallback.disconnect,
      demo: !!sharedData?.demo,
      startDemo: () => {
        // Stop sharing and switch to fallback's own demo so the button works
        setSharing(false);
        setSharedData(null);
        setStale(false);
        fallbackRef.current.startDemo();
      },
    };
  }
  return fallback;
}