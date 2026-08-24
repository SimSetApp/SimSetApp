import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, TrendingUp, Clock, Gauge, Trash2, X, GitCompare, Activity } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { SIM_TITLES } from "../lib/simData";
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import StatCard from "../components/StatCard";

export default function Telemetry() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [parsing, setParsing] = useState(false);
  const [selectedSetupId, setSelectedSetupId] = useState("");
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: setups = [] } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
    enabled: !!isAuthenticated,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["session-logs"],
    queryFn: () => base44.entities.SessionLog.list("-created_date"),
    enabled: !!isAuthenticated,
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParsing(true);

    try {
      const text = await file.text();
      // Parse CSV — handle both comma and semicolon separated
      const lines = text.trim().split(/\r?\n/);
      const delimiter = lines[0].includes(";") ? ";" : ",";
      const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase());

      const rows = lines.slice(1).map(line => {
        const values = line.split(delimiter);
        const row = {};
        headers.forEach((h, i) => { row[h] = values[i]?.trim(); });
        return row;
      });

      // Try to identify lap times and relevant telemetry
      const lapTimeKey = headers.find(h => h.includes("lap") && h.includes("time")) || headers.find(h => h === "time") || headers.find(h => h.includes("lap"));
      const sectorKeys = headers.filter(h => h.includes("sector"));
      const tempKeys = headers.filter(h => h.includes("temp") || h.includes("pressure"));

      if (!lapTimeKey) {
        toast.error("Could not find lap time column in CSV. Expected columns like 'Lap Time', 'lap_time', etc.");
        setParsing(false);
        return;
      }

      const laps = rows.map((r, i) => ({
        lap: i + 1,
        time: parseFloat(r[lapTimeKey]) || null,
        sectors: sectorKeys.map(s => parseFloat(r[s]) || null).filter(v => v !== null),
        temps: tempKeys.map(t => ({ key: t, value: parseFloat(r[t]) || null })).filter(t => t.value !== null),
      })).filter(l => l.time !== null);

      if (laps.length === 0) {
        toast.error("No valid lap times found in the file.");
        setParsing(false);
        return;
      }

      setParsedData({
        laps,
        totalLaps: laps.length,
        bestLap: Math.min(...laps.map(l => l.time)),
        avgLap: laps.reduce((s, l) => s + l.time, 0) / laps.length,
        consistency: Math.sqrt(laps.reduce((s, l) => s + Math.pow(l.time - laps.reduce((s2, l2) => s2 + l2.time, 0) / laps.length, 2), 0) / laps.length),
        headers,
      });
      toast.success(`Parsed ${laps.length} laps from ${file.name}`);
    } catch (err) {
      toast.error("Failed to parse file: " + err.message);
    } finally {
      setParsing(false);
    }
  };

  // Correlation: compare lap times with session logs for the same setup
  const setupCorrelation = useMemo(() => {
    if (!selectedSetupId || sessions.length === 0) return null;
    const setupSessions = sessions.filter(s => s.setup_id === selectedSetupId);
    if (setupSessions.length === 0) return null;

    return setupSessions.map(s => ({
      date: s.date,
      sessionType: s.session_type,
      bestLap: s.best_lap_time,
      totalLaps: s.total_laps,
      fuelPerLap: s.fuel_per_lap_actual,
      tyreCompound: s.tyre_compound,
      trackTemp: s.track_temp,
      notes: s.notes,
    }));
  }, [selectedSetupId, sessions]);

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Activity className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-2">Sign in to use Telemetry</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload telemetry and correlate lap times with your setups.</p>
            <Button onClick={navigateToLogin} className="w-full font-heading text-xs tracking-wider">Sign In / Register</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Telemetry" />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">Telemetry Import & Analysis</h1>
          </div>
          <p className="text-sm text-muted-foreground">Upload MoTeC, Garage 61, or sim CSV exports. See lap consistency and correlate with your setups.</p>
        </div>

        {/* Upload zone */}
        <div className="rounded-2xl border-2 border-dashed border-border bg-card p-8 mb-6 text-center">
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
          {parsing ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Parsing telemetry…</p>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} className="flex flex-col items-center w-full">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">Upload Telemetry CSV</p>
              <p className="text-xs text-muted-foreground">Click to browse — supports .csv exports from MoTeC, Garage 61, or sim tools</p>
            </button>
          )}
        </div>

        {/* Parsed results */}
        {parsedData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{fileName}</span>
                <Badge variant="outline" className="text-xs">{parsedData.totalLaps} laps</Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setParsedData(null); setFileName(""); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats grid */}
            <motion.div
              variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              {[
                { icon: Gauge, label: "Best Lap", value: parsedData.bestLap.toFixed(3), unit: "s", tone: "text-primary" },
                { icon: Clock, label: "Average", value: parsedData.avgLap.toFixed(3), unit: "s" },
                { icon: TrendingUp, label: "Consistency", value: `±${parsedData.consistency.toFixed(3)}`, unit: "s", tone: parsedData.consistency < 0.5 ? "text-green-400" : parsedData.consistency < 1.0 ? "text-amber-400" : "text-red-400" },
                { icon: Activity, label: "Total Laps", value: parsedData.totalLaps, unit: "" },
              ].map((s, i) => (
                <motion.div key={i} variants={{ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }}>
                  <StatCard {...s} />
                </motion.div>
              ))}
            </motion.div>

            {/* Lap time chart */}
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5">
              <h3 className="font-heading text-sm font-bold tracking-wide mb-3">Lap Time Progression</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={parsedData.laps.map(l => ({ lap: l.lap, time: l.time }))} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="lapGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                    <XAxis dataKey="lap" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[(min) => min - 0.1, (max) => max + 0.1]} tickFormatter={(v) => v.toFixed(3)} width={48} />
                    <Tooltip content={<LapTooltip bestLap={parsedData.bestLap} />} />
                    <ReferenceLine y={parsedData.bestLap} stroke="hsl(var(--primary))" strokeDasharray="4 4" opacity={0.5} />
                    <Area type="monotone" dataKey="time" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#lapGrad)" dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Lap time</span>
                <span>•</span>
                <span>Dashed line = best lap</span>
              </div>
            </div>

            {/* Lap table */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-heading text-sm font-bold tracking-wide mb-3">Lap Breakdown</h3>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {parsedData.laps.map((lap, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-muted/30 text-sm">
                    <span className="text-muted-foreground tabular-nums">Lap {lap.lap}</span>
                    <span className={`font-digi tabular-nums ${lap.time === parsedData.bestLap ? "text-primary font-bold" : ""}`}>
                      {lap.time.toFixed(3)}s
                      {lap.time === parsedData.bestLap && <Badge variant="outline" className="ml-2 text-[10px] border-primary/40 text-primary">BEST</Badge>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Setup correlation */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GitCompare className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-sm font-bold tracking-wide">Setup vs Lap Time Correlation</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Select a setup to see how your session times correlate with it across different conditions.</p>

          <select
            value={selectedSetupId}
            onChange={e => setSelectedSetupId(e.target.value)}
            className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-4"
          >
            <option value="">Select a setup…</option>
            {setups.map(s => <option key={s.id} value={s.id}>{s.title} — {s.car}</option>)}
          </select>

          {selectedSetupId && !setupCorrelation && (
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">No session logs found for this setup. Record sessions from the garage to build correlation data.</p>
            </div>
          )}

          {setupCorrelation && setupCorrelation.length > 0 && (
            <div className="space-y-2">
              {setupCorrelation.map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{s.sessionType}</span>
                    <span className="text-xs text-muted-foreground">{s.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {s.bestLap && <Badge variant="outline" className="text-xs">Best: {s.bestLap}</Badge>}
                    {s.totalLaps && <Badge variant="outline" className="text-xs">{s.totalLaps} laps</Badge>}
                    {s.fuelPerLap && <Badge variant="outline" className="text-xs">Fuel: {s.fuelPerLap}L/lap</Badge>}
                    {s.tyreCompound && <Badge variant="outline" className="text-xs">{s.tyreCompound}</Badge>}
                    {s.trackTemp && <Badge variant="outline" className="text-xs">Track: {s.trackTemp}°C</Badge>}
                  </div>
                  {s.notes && <p className="text-xs text-muted-foreground mt-2 italic">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function LapTooltip({ active, payload, label, bestLap }) {
  if (!active || !payload?.length) return null;
  const t = payload[0].value;
  const delta = t - bestLap;
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 backdrop-blur-md px-3 py-2 text-xs shadow-xl">
      <div className="text-muted-foreground">Lap {label}</div>
      <div className="font-bold tabular-nums font-digi mt-0.5">{t.toFixed(3)}s</div>
      {delta > 0 ? (
        <div className="text-red-400 tabular-nums font-digi">+{delta.toFixed(3)}</div>
      ) : (
        <div className="text-purple-400 font-bold tracking-widest">BEST</div>
      )}
    </div>
  );
}