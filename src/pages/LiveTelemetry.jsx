import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Wifi, WifiOff, Loader2, Cpu, CheckCircle2, Play } from "lucide-react";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import CopyChip from "@/components/live/CopyChip";
import DDU3Dashboard from "@/components/live/DDU3Dashboard";
import BridgeSteps from "@/components/live/BridgeSteps";
import { toast } from "sonner";

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

const STATUS_META = {
  idle: { label: "Not connected", tone: "text-muted-foreground", icon: WifiOff, dot: "bg-muted-foreground" },
  connecting: { label: "Connecting…", tone: "text-amber-400", icon: Loader2, dot: "bg-amber-400" },
  searching: { label: "Looking for sim…", tone: "text-amber-400", icon: Loader2, dot: "bg-amber-400" },
  connected: { label: "Live", tone: "text-green-400", icon: Wifi, dot: "bg-green-400" },
  error: { label: "Connection error", tone: "text-red-400", icon: WifiOff, dot: "bg-red-400" },
  closed: { label: "Reconnecting…", tone: "text-amber-400", icon: Loader2, dot: "bg-amber-400" },
};

export default function LiveTelemetry() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { url, saveUrl, status, data, lastLap, connect, disconnect, demo, startDemo } = useLiveTelemetry();
  const [urlInput, setUrlInput] = useState(url);
  const [autoLog, setAutoLog] = useState(false);
  const [logSetupId, setLogSetupId] = useState("");
  const sessionLogRef = useRef(null);
  const lapTimesRef = useRef([]);

  const { data: setups = [] } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
    enabled: !!isAuthenticated,
  });

  // Auto-log laps to SessionLog when enabled
  useEffect(() => {
    if (!autoLog || !logSetupId || !lastLap || !isAuthenticated) return;
    const lapTime = lastLap.last_lap_time;
    if (lapTime == null || isNaN(lapTime)) return;
    lapTimesRef.current = [...lapTimesRef.current, lapTime];
    const laps = lapTimesRef.current;
    const best = Math.min(...laps);
    const payload = {
      setup_id: logSetupId,
      session_type: "Race",
      date: new Date().toISOString().slice(0, 10),
      best_lap_time: fmt(best),
      total_laps: laps.length,
      fuel_per_lap_actual: lastLap.fuel_per_lap ?? null,
      tyre_compound: "",
      lap_times_json: JSON.stringify(laps),
      notes: `Auto-logged by Live Telemetry bridge (${lastLap.sim || "sim"}${lastLap.track ? ", " + lastLap.track : ""})`,
    };
    (async () => {
      try {
        if (sessionLogRef.current) {
          await base44.entities.SessionLog.update(sessionLogRef.current, payload);
        } else {
          const created = await base44.entities.SessionLog.create(payload);
          sessionLogRef.current = created.id;
          toast.success("Session logging started");
        }
        queryClient.invalidateQueries({ queryKey: ["session-logs"] });
      } catch {
        /* best-effort logging */
      }
    })();
  }, [lastLap, autoLog, logSetupId, isAuthenticated, queryClient]);

  // Reset session log when setup changes or auto-log toggled off
  useEffect(() => {
    sessionLogRef.current = null;
    lapTimesRef.current = [];
  }, [logSetupId, autoLog]);

  // Auto-connect to the bridge on first mount
  const autoConnectedRef = useRef(false);
  useEffect(() => {
    if (autoConnectedRef.current) return;
    autoConnectedRef.current = true;
    connect(url);
  }, [connect, url]);

  const st = STATUS_META[status] || STATUS_META.idle;
  const connected = status === "connected" && data;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Live Telemetry" />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-5 h-5 text-primary" />
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Live Telemetry</h1>
            </div>
            <p className="text-sm text-muted-foreground">Real-time dashboard streamed from the local bridge.</p>
          </div>
          {connected && (
            <Badge variant="outline" className="gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot} animate-pulse`} />
              {demo ? "Demo data" : data?.sim || "Live"}
            </Badge>
          )}
        </div>

        {/* Connection card */}
        <div className="rounded-xl border border-border bg-card p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-sm font-semibold tracking-wide">Connection</h3>
            <span className={`ml-auto flex items-center gap-1.5 text-xs font-medium ${st.tone}`}>
              <st.icon className={`w-3.5 h-3.5 ${status === "connecting" || status === "closed" ? "animate-spin" : ""}`} />
              {st.label}
            </span>
          </div>

          {connected ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {demo ? "Streaming demo data" : `Connected to ${data?.sim || "bridge"}`}
              </span>
              <Button variant="outline" onClick={disconnect} className="font-heading text-xs tracking-wider">
                <WifiOff className="w-3.5 h-3.5 mr-1.5" /> Disconnect
              </Button>
            </div>
          ) : status === "searching" ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Bridge connected — waiting for your sim to start…</span>
              <Button variant="outline" onClick={disconnect} className="font-heading text-xs tracking-wider">
                <WifiOff className="w-3.5 h-3.5 mr-1.5" /> Cancel
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* One-click connect */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-sm font-semibold mb-0.5">Connect to your sim</h4>
                    <p className="text-xs text-muted-foreground mb-3">Launch the bridge on your PC and tap connect — it auto-detects your sim. No URL or settings needed.</p>
                    <Button onClick={() => connect()} className="w-full font-heading text-xs tracking-wider">
                      <Wifi className="w-3.5 h-3.5 mr-1.5" /> Connect to bridge
                    </Button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px bg-border flex-1" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or try the demo</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <Button onClick={startDemo} variant="outline" className="w-full font-heading text-xs tracking-wider">
                <Play className="w-3.5 h-3.5 mr-1.5" /> Start demo dashboard
              </Button>

              {/* First-time install steps */}
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">First time? Install the bridge</summary>
                <div className="mt-3"><BridgeSteps /></div>
              </details>

              {/* Advanced URL */}
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground select-none">Advanced: bridge URL</summary>
                <div className="flex gap-2 mt-2">
                  <input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="ws://localhost:3344"
                    className="flex-1 h-9 rounded-lg border border-border bg-secondary text-sm px-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <Button onClick={() => { saveUrl(urlInput); connect(urlInput); }} className="font-heading text-xs tracking-wider">
                    <Wifi className="w-3.5 h-3.5 mr-1.5" /> Connect
                  </Button>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Dashboard */}
        {connected ? (
          <div className="space-y-4">
            <DDU3Dashboard data={data} demo={demo} />

            {/* Auto-log */}
            {isAuthenticated && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-heading text-sm font-semibold tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Auto-log laps
                  </h4>
                  <button
                    onClick={() => setAutoLog((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${autoLog ? "bg-primary" : "bg-muted"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${autoLog ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
                {autoLog && (
                  <select
                    value={logSetupId}
                    onChange={(e) => setLogSetupId(e.target.value)}
                    className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select a setup to log against…</option>
                    {setups.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} — {s.car}</option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  When on, each completed lap is written to your session history against the chosen setup.
                </p>
              </div>
            )}
          </div>
        ) : status === "searching" ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-amber-400/15 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-1">Waiting for your sim</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              The bridge is connected. Launch your sim and start a session — the dashboard lights up automatically.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Radio className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-1">Live Telemetry</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              See speed, RPM, tyres, fuel and lap times in real time. Connect your bridge or try the demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => connect()} className="font-heading text-xs tracking-wider">
                <Wifi className="w-3.5 h-3.5 mr-1.5" /> Connect to bridge
              </Button>
              <Button onClick={startDemo} variant="outline" className="font-heading text-xs tracking-wider">
                <Play className="w-3.5 h-3.5 mr-1.5" /> Start demo
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}