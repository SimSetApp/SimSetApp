import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Wifi, WifiOff, Loader2, Gauge, Fuel, Cpu, Download, CheckCircle2, Activity, Play } from "lucide-react";
import { useLiveTelemetry } from "@/hooks/useLiveTelemetry";
import CopyChip from "@/components/live/CopyChip";
import TelemetryGauge from "@/components/live/TelemetryGauge";
import TyreGrid from "@/components/live/TyreGrid";
import InputBars from "@/components/live/InputBars";
import LapTiming from "@/components/live/LapTiming";
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
  const rpmColor =
    data?.rpm && data.max_rpm ? (data.rpm / data.max_rpm > 0.92 ? "hsl(0 84% 55%)" : data.rpm / data.max_rpm > 0.75 ? "hsl(38 80% 56%)" : "hsl(var(--primary))") : "hsl(var(--primary))";
  const fuelPct = data?.fuel_litres != null && data?.fuel_per_lap ? Math.min(100, (data.fuel_litres / Math.max(1, data.fuel_per_lap * 30)) * 100) : null;

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
          ) : (
            <div className="space-y-4">
              {/* One-click demo */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading text-sm font-semibold mb-0.5">Try it instantly — no setup</h4>
                    <p className="text-xs text-muted-foreground mb-3">Stream realistic demo telemetry right in your browser. Nothing to download or install.</p>
                    <Button onClick={startDemo} className="w-full font-heading text-xs tracking-wider">
                      <Play className="w-3.5 h-3.5 mr-1.5" /> Start demo dashboard
                    </Button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px bg-border flex-1" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or connect a real sim</span>
                <div className="h-px bg-border flex-1" />
              </div>

              {/* Bridge path */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <a href="/telemetry_bridge.py" download className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium font-heading tracking-wide hover:bg-primary/90 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download bridge script
                  </a>
                  <span className="text-xs text-muted-foreground">then run in a terminal:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <CopyChip text="pip install websockets" />
                  <CopyChip text="python telemetry_bridge.py" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mock mode works with no sim running. iRacing: add <code className="font-mono text-foreground">--sim iracing</code> (needs <code className="font-mono text-foreground">pip install irsdk</code>). The dashboard auto-connects as soon as the bridge is up.
                </p>
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
            </div>
          )}
        </div>

        {/* Dashboard */}
        {connected ? (
          <div className="space-y-4">
            {/* Session strip */}
            <div className="flex flex-wrap gap-2 text-xs">
              {data.car && <Badge variant="outline">{data.car}</Badge>}
              {data.track && <Badge variant="outline">{data.track}</Badge>}
              {data.session_type && <Badge variant="outline">{data.session_type}</Badge>}
            </div>

            {/* Lap timing */}
            <LapTiming
              lap={data.lap}
              totalLaps={data.total_laps}
              current={data.current_lap_time}
              last={data.last_lap_time}
              best={data.best_lap_time}
              delta={data.lap_delta}
              position={data.position}
              incidents={data.incidents}
            />

            {/* Gauges + gear */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-around flex-wrap gap-4">
                <TelemetryGauge value={data.speed_kmh} max={340} label="Speed" unit="km/h" color="hsl(var(--primary))" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Gear</span>
                  <span className="text-6xl font-bold tabular-nums font-digi text-primary leading-none">
                    {data.gear > 0 ? data.gear : "N"}
                  </span>
                </div>
                <TelemetryGauge value={data.rpm} max={data.max_rpm || 8000} label="RPM" unit="rpm" color={rpmColor} />
              </div>
            </div>

            {/* Inputs + tyres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-heading text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Inputs
                </h4>
                <InputBars throttle={data.throttle} brake={data.brake} steer={data.steer} />
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h4 className="font-heading text-sm font-semibold tracking-wide mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary" /> Tyres
                </h4>
                <TyreGrid tyres={data.tyres} />
              </div>
            </div>

            {/* Fuel */}
            {data.fuel_litres != null && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-heading text-sm font-semibold tracking-wide flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-primary" /> Fuel
                  </h4>
                  <span className="text-sm font-bold tabular-nums font-digi">
                    {data.fuel_litres.toFixed(1)} L
                    {data.fuel_per_lap != null && <span className="text-muted-foreground font-normal"> · {data.fuel_per_lap} L/lap</span>}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-[width] duration-200" style={{ width: `${fuelPct ?? 0}%` }} />
                </div>
                {data.fuel_per_lap != null && data.fuel_per_lap > 0 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ≈ {(data.fuel_litres / data.fuel_per_lap).toFixed(1)} laps of fuel remaining
                  </p>
                )}
              </div>
            )}

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
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <div className="w-14 h-14 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Radio className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-1">Live Telemetry</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              See speed, RPM, tyres, fuel and lap times in real time. Try it with one click — no setup needed.
            </p>
            <Button onClick={startDemo} className="font-heading text-xs tracking-wider">
              <Play className="w-3.5 h-3.5 mr-1.5" /> Start demo dashboard
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}