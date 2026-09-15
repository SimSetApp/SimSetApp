import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Radio, Maximize, Minimize, X, ArrowLeft, Play } from "lucide-react";
import { useSharedTelemetry } from "@/hooks/useSharedTelemetry";
import DDU3Dashboard from "@/components/live/DDU3Dashboard";

/**
 * Kiosk / pop-out dashboard page.
 * Auto-connects to the persisted bridge URL, renders the dashboard with its
 * variant gallery + customizer controls, and enters browser fullscreen on the
 * first user gesture (a browser requirement). No app chrome.
 */
export default function DashboardFullscreen() {
  const { url, status, data, detectedSim, detected, connect, demo, startDemo } = useSharedTelemetry();
  const [showPrompt, setShowPrompt] = useState(true);
  const [isFs, setIsFs] = useState(false);
  const fsDoneRef = useRef(false);
  const navigate = useNavigate();

  // Track browser fullscreen state so we can show an exit button
  useEffect(() => {
    const onChange = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  // Connection is handled by useSharedTelemetry — either mirrors the main
  // page's broadcast or falls back to its own connection. No double-connect here.

  // Enter browser fullscreen on the first user gesture (browsers require one)
  useEffect(() => {
    const enter = () => {
      if (fsDoneRef.current) return;
      fsDoneRef.current = true;
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }
      } catch { /* ignore */ }
      setShowPrompt(false);
      document.removeEventListener("click", enter);
      document.removeEventListener("keydown", enter);
    };
    document.addEventListener("click", enter, { once: true });
    document.addEventListener("keydown", enter, { once: true });
    return () => {
      document.removeEventListener("click", enter);
      document.removeEventListener("keydown", enter);
    };
  }, []);

  const connected = (status === "connected" || status === "stale") && data;

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* Minimal status strip */}
      <div className="flex items-center justify-between px-4 py-2 text-xs shrink-0 border-b border-white/5">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Radio className="w-3.5 h-3.5" />
          <span className="font-heading tracking-wide text-foreground/80">
            {data?.sim || (detected ? `${detectedSim || "Sim"} detected` : "Live Dashboard")}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          {status === "searching" && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
          <span className={connected ? "text-green-400" : "text-muted-foreground"}>
            {connected ? (status === "stale" ? "stale" : "Live") : status === "searching" ? "waiting" : status === "failed" ? "failed" : status}
          </span>
        </span>
      </div>

      {/* Dashboard or waiting state */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        {connected ? (
          <div className="w-full h-full max-w-[1600px]">
            <DDU3Dashboard data={data} demo={demo} inKiosk namespace="kiosk" stale={status === "stale"} />
          </div>
        ) : (
          <div className="text-center text-muted-foreground px-6">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              {status === "searching" || status === "connecting" || status === "closed" ? (
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              ) : (
                <Radio className="w-7 h-7 text-primary" />
              )}
            </div>
            <h2 className="font-heading text-lg font-semibold mb-1 text-foreground">
              {detected ? `${detectedSim || "Sim"} detected` : "Waiting for your sim"}
            </h2>
            <p className="text-sm max-w-sm mx-auto">
              {detected
                ? "Start a session to go live."
                : "The bridge connects automatically when your sim starts a session."}
            </p>
            <button
              onClick={() => startDemo()}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Try demo data
            </button>
          </div>
        )}
      </div>

      {/* Floating controls — always visible */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        <button
          onClick={() => {
            if (window.opener && !window.opener.closed) {
              window.opener.focus();
              window.close();
            } else {
              navigate("/live-telemetry");
            }
          }}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to app</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 backdrop-blur px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-white/20 transition-colors"
        >
          {isFs ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          <span>{isFs ? "Exit fullscreen" : "Fullscreen"}</span>
        </button>
      </div>

      {/* Auto-fullscreen prompt — dismissible, non-blocking */}
      {showPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-black/80 border border-white/15 backdrop-blur px-4 py-2 text-xs text-foreground shadow-lg">
          <Maximize className="w-3.5 h-3.5" />
          <span>Tap anywhere for fullscreen</span>
          <button
            onClick={(e) => { e.stopPropagation(); setShowPrompt(false); }}
            className="ml-1 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}