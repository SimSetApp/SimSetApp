import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import RaceGauge from "@/components/RaceGauge";
import { Fuel, Gauge, Flag, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Zap, Settings, Wrench, Trophy, Clock, Timer, ArrowLeft, TrendingUp } from "lucide-react";

const STORE_KEY = "pitboard-race-state-v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const pad = (n, w = 2) => String(n).padStart(w, "0");

const fmtRace = (ms) => {
  const total = Math.floor(ms / 100);
  const m = Math.floor(total / 600);
  const s = Math.floor((total % 600) / 10);
  const t = total % 10;
  return `${m}:${pad(s)}.${t}`;
};

const fmtLap = (ms) => {
  const totalMs = Math.max(0, Math.round(ms));
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms3 = totalMs % 1000;
  return `${m}:${pad(s)}.${pad(ms3, 3)}`;
};

const fmtDelta = (ms) => `+${(ms / 1000).toFixed(3)}`;

export default function PitBoard() {
  const navigate = useNavigate();
  const saved = loadState();
  const [running, setRunning] = useState(saved?.running ?? false);
  const [baseMs, setBaseMs] = useState(saved?.elapsedMs ?? 0);
  const [startedAt, setStartedAt] = useState(null);
  const [now, setNow] = useState(0);
  const [fuelPerLap, setFuelPerLap] = useState(saved?.fuelPerLap ?? 3.0);
  const [tankSize, setTankSize] = useState(saved?.tankSize ?? 100);
  const [currentFuel, setCurrentFuel] = useState(saved?.currentFuel ?? 100);
  const [totalLaps, setTotalLaps] = useState(saved?.totalLaps ?? 20);
  const [lapsCompleted, setLapsCompleted] = useState(saved?.lapsCompleted ?? 0);
  const [tyreCondition, setTyreCondition] = useState(saved?.tyreCondition ?? 100);
  const [tyreWearPerLap, setTyreWearPerLap] = useState(saved?.tyreWearPerLap ?? 3);
  const [laps, setLaps] = useState(saved?.laps ?? []);
  const [lastLapMs, setLastLapMs] = useState(saved?.lastLapMs ?? 0);
  const [justLapped, setJustLapped] = useState(false);
  const [pitLaneLoss, setPitLaneLoss] = useState(saved?.pitLaneLoss ?? 20);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) setStartedAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setNow(Date.now()), 100);
      return () => clearInterval(intervalRef.current);
    }
  }, [running]);

  const elapsedMs = running && startedAt ? baseMs + (Date.now() - startedAt) : baseMs;

  useEffect(() => {
    const data = {
      running, elapsedMs, fuelPerLap, tankSize, currentFuel, totalLaps,
      lapsCompleted, tyreCondition, tyreWearPerLap, laps, lastLapMs, pitLaneLoss,
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
  }, [running, elapsedMs, fuelPerLap, tankSize, currentFuel, totalLaps, lapsCompleted, tyreCondition, tyreWearPerLap, laps, lastLapMs, pitLaneLoss]);

  const toggleRun = () => {
    if (running) {
      setBaseMs(b => b + (Date.now() - startedAt));
      setStartedAt(null);
      setRunning(false);
    } else {
      setStartedAt(Date.now());
      setRunning(true);
    }
  };

  const completeLap = useCallback(() => {
    const cur = running && startedAt ? baseMs + (Date.now() - startedAt) : baseMs;
    const split = cur - lastLapMs;
    setLaps(l => [...l, split]);
    setLastLapMs(cur);
    setLapsCompleted(l => l + 1);
    setCurrentFuel(f => Math.max(0, +(f - fuelPerLap).toFixed(2)));
    setTyreCondition(t => Math.max(0, +(t - tyreWearPerLap).toFixed(1)));
    setJustLapped(true);
    setTimeout(() => setJustLapped(false), 350);
  }, [running, startedAt, baseMs, lastLapMs, fuelPerLap, tyreWearPerLap]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
      if (e.code === "Space") { e.preventDefault(); completeLap(); }
      else if (e.key === "p" || e.key === "P") { toggleRun(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeLap]);

  const lapsOfFuel = fuelPerLap > 0 ? currentFuel / fuelPerLap : 0;
  const lapsOfTyre = tyreWearPerLap > 0 ? tyreCondition / tyreWearPerLap : 0;
  const limitingFactor = Math.min(lapsOfFuel, lapsOfTyre);
  const lapsRemaining = Math.max(0, totalLaps - lapsCompleted);
  const limiter = lapsOfFuel < lapsOfTyre ? "fuel" : "tyres";
  const needPit = limitingFactor < lapsRemaining;
  const pitLap = Math.floor(lapsCompleted + Math.max(0, limitingFactor));
  const progressPct = totalLaps > 0 ? (lapsCompleted / totalLaps) * 100 : 0;
  const pitPct = totalLaps > 0 && pitLap <= totalLaps ? (pitLap / totalLaps) * 100 : null;

  const validLaps = laps.filter(l => l > 0);
  const lastLap = laps.length ? laps[laps.length - 1] : null;
  const bestLap = validLaps.length ? Math.min(...validLaps) : null;
  const isLastBest = lastLap != null && bestLap != null && lastLap === bestLap && lastLap > 0;

  let status;
  if (lapsRemaining <= 0) {
    status = { text: "FINISHED", tone: "done", icon: Trophy };
  } else if (limitingFactor >= lapsRemaining) {
    status = { text: "NO PIT — CAN FINISH", tone: "safe", icon: CheckCircle2 };
  } else if (limitingFactor < 1) {
    status = { text: "PIT THIS LAP", tone: "urgent", icon: AlertTriangle };
  } else if (limitingFactor < 2) {
    status = { text: "PIT NEXT LAP", tone: "urgent", icon: AlertTriangle };
  } else {
    status = { text: `PIT IN ${Math.floor(limitingFactor)} LAPS`, tone: "warn", icon: AlertTriangle };
  }

  const fuelNeededToFinish = Math.max(0, (lapsRemaining + 0.5) * fuelPerLap - currentFuel);
  const fuelToAdd = Math.min(tankSize - currentFuel, Math.ceil(fuelNeededToFinish * 10) / 10);
  const maxLapsPerTank = fuelPerLap > 0 ? tankSize / fuelPerLap : 0;
  const stopsNeeded = lapsRemaining <= lapsOfFuel ? 0 : Math.max(0, Math.ceil((lapsRemaining - lapsOfFuel) / Math.max(0.01, maxLapsPerTank)));

  const fuelPct = tankSize > 0 ? (currentFuel / tankSize) * 100 : 0;
  const fuelTone = lapsOfFuel > lapsRemaining + 1 ? "good" : lapsOfFuel > lapsRemaining ? "warn" : lapsOfFuel > 1 ? "warn" : "bad";
  const tyreTone = lapsOfTyre > lapsRemaining + 1 ? "good" : lapsOfTyre > lapsRemaining ? "warn" : lapsOfTyre > 1 ? "warn" : "bad";

  const reset = () => {
    setRunning(false);
    setStartedAt(null);
    setBaseMs(0);
    setLapsCompleted(0);
    setCurrentFuel(tankSize);
    setTyreCondition(100);
    setLaps([]);
    setLastLapMs(0);
  };

  const pitService = (refuel, newTyres) => {
    if (refuel) setCurrentFuel(tankSize);
    if (newTyres) setTyreCondition(100);
  };

  const toneText = { good: "text-green-400", warn: "text-amber-400", bad: "text-red-400", safe: "text-green-400", urgent: "text-red-400", done: "text-primary" };
  // Full-width sector banner: left accent + tinted background, no rounded corners
  const bannerAccent = { safe: "border-l-green-500", warn: "border-l-amber-500", urgent: "border-l-red-500", done: "border-l-primary" };
  const bannerBg = { safe: "bg-green-500/10", warn: "bg-amber-500/10", urgent: "bg-red-500/15", done: "bg-primary/10" };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Immersive accent glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.07), transparent 55%)" }} />
      {/* Urgent screen-edge red glow */}
      {status.tone === "urgent" && (
        <div className="fixed inset-0 pointer-events-none z-30 animate-pulse" style={{ boxShadow: "inset 0 0 140px rgba(239,68,68,0.28)" }} />
      )}

      {/* Floating back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-full border border-border/60 bg-card/70 backdrop-blur-md text-muted-foreground hover:text-foreground transition-colors"
        style={{ top: "calc(env(safe-area-inset-top) + 0.75rem)" }}
        aria-label="Back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="relative max-w-2xl mx-auto px-4 pt-16 pb-28">
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">Pit Board</h1>
          </div>
          <p className="text-sm text-muted-foreground">Tap <span className="font-semibold text-foreground">Complete Lap</span> each lap — lap time, fuel, tyres & pit window update automatically.</p>
        </div>

        {/* Race clock — digital, prominent */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">Race Time</div>
              <div className="text-5xl font-bold tabular-nums font-digi text-primary">{fmtRace(elapsedMs)}</div>
            </div>
            <div className="flex gap-2">
              <Button onClick={toggleRun} size="lg" className="h-12 w-12 rounded-full p-0">
                {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button onClick={reset} variant="outline" size="lg" className="h-12 w-12 rounded-full p-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Lap counter + last/best with delta */}
        <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 mb-3">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">Lap</div>
              <div className="text-5xl font-bold tabular-nums leading-none font-digi">
                {lapsCompleted}<span className="text-muted-foreground text-2xl"> / {totalLaps}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">To Go</div>
              <div className="text-5xl font-bold tabular-nums leading-none font-digi">{lapsRemaining}</div>
            </div>
          </div>

          {/* Race progress strip with pit-window marker */}
          <div className="relative h-2.5 rounded-full bg-muted/60 overflow-visible mb-4">
            <div className="absolute left-0 top-0 h-full rounded-full bg-primary/50 transition-all duration-300" style={{ width: `${progressPct}%` }} />
            {needPit && pitPct != null && (
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${pitPct}%` }} title={`Pit around lap ${pitLap}`}>
                <Flag className="w-3.5 h-3.5 text-amber-400" />
              </div>
            )}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${progressPct}%` }}>
              <div className="w-3 h-3 rounded-full bg-primary ring-2 ring-background" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Last Lap</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold tabular-nums font-digi">{lastLap != null ? fmtLap(lastLap) : "—:—.—"}</span>
                  {lastLap != null && bestLap != null && (
                    isLastBest
                      ? <span className="text-purple-400 text-[10px] font-bold tracking-widest">BEST</span>
                      : <span className="text-red-400 text-[11px] tabular-nums font-digi">{fmtDelta(lastLap - bestLap)}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Best Lap</div>
                <div className="text-lg font-bold tabular-nums font-digi text-primary">{bestLap != null ? fmtLap(bestLap) : "—:—.—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary action: Complete Lap */}
        <motion.button
          onClick={completeLap}
          whileTap={{ scale: 0.98 }}
          className={`w-full h-20 rounded-2xl bg-primary text-primary-foreground font-heading text-2xl font-bold tracking-wider transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mb-3 select-none ${justLapped ? "ring-4 ring-primary/40" : ""}`}
        >
          <Zap className="w-7 h-7" />
          COMPLETE LAP
        </motion.button>
        <p className="text-center text-[11px] text-muted-foreground mb-4">or press <span className="font-semibold text-foreground">Space</span></p>

        {/* Sector-style pit banner — full-width band */}
        <div className={`-mx-4 mb-3 ${status.tone === "urgent" ? "animate-pulse" : ""}`}>
          <div className={`px-5 py-5 border-l-4 ${bannerAccent[status.tone]} ${bannerBg[status.tone]}`}>
            <div className="flex items-center gap-3">
              <status.icon className={`w-9 h-9 shrink-0 ${toneText[status.tone]}`} />
              <div className="flex-1">
                <div className={`font-heading text-2xl font-bold tracking-wide ${toneText[status.tone]}`}>{status.text}</div>
                {status.tone !== "safe" && status.tone !== "done" && fuelToAdd > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Add <span className="font-bold text-foreground">{fuelToAdd.toFixed(1)} L</span> at pit to reach the finish.
                  </div>
                )}
                {status.tone === "urgent" && (
                  <div className="text-sm text-muted-foreground mt-1">Limited by {limiter}.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Circular fuel & tyre gauges */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <RaceGauge
            value={fuelPct}
            tone={fuelTone}
            icon={Fuel}
            centerValue={lapsOfFuel.toFixed(1)}
            unit="laps"
            label="Fuel"
            sublabel={`${currentFuel.toFixed(1)} / ${tankSize} L`}
            onMinus={() => setCurrentFuel(f => Math.max(0, +(f - 1).toFixed(2)))}
            onPlus={() => setCurrentFuel(f => Math.min(tankSize, +(f + 1).toFixed(2)))}
          />
          <RaceGauge
            value={tyreCondition}
            tone={tyreTone}
            icon={Gauge}
            centerValue={lapsOfTyre.toFixed(1)}
            unit="laps"
            label="Tyres"
            sublabel={`${Math.round(tyreCondition)}% life`}
            onMinus={() => setTyreCondition(t => Math.max(0, +(t - 5).toFixed(1)))}
            onPlus={() => setTyreCondition(t => Math.min(100, +(t + 5).toFixed(1)))}
          />
        </div>

        {/* Pit service buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button onClick={() => pitService(true, false)} className="h-11 rounded-xl border border-border/50 bg-secondary/60 text-xs font-heading font-semibold tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Fuel className="w-4 h-4" /> Fuel Only
          </button>
          <button onClick={() => pitService(false, true)} className="h-11 rounded-xl border border-border/50 bg-secondary/60 text-xs font-heading font-semibold tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Gauge className="w-4 h-4" /> Tyres Only
          </button>
          <button onClick={() => pitService(true, true)} className="h-11 rounded-xl border border-primary/40 bg-primary/10 text-xs font-heading font-semibold tracking-wide text-primary active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Wrench className="w-4 h-4" /> Full Service
          </button>
        </div>

        {/* Pit strategy */}
        <details className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 mb-4">
          <summary className="cursor-pointer font-heading text-sm font-bold tracking-wide flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" /> Pit Strategy
          </summary>
          <div className="mt-4 space-y-3">
            <SettingField label="Pit Lane Loss (s)" value={pitLaneLoss} onChange={setPitLaneLoss} step={0.5} />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-secondary/50 p-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Pit Lap</div>
                <div className="text-lg font-bold tabular-nums font-digi text-primary">{needPit ? pitLap : "—"}</div>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Add Fuel</div>
                <div className="text-lg font-bold tabular-nums font-digi">{fuelToAdd > 0 ? `${fuelToAdd.toFixed(1)}L` : "—"}</div>
              </div>
              <div className="rounded-lg bg-secondary/50 p-2">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Stops</div>
                <div className="text-lg font-bold tabular-nums font-digi">{stopsNeeded}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lapsRemaining <= 0
                ? "Race complete."
                : stopsNeeded === 0
                ? "No stop needed — you can reach the finish on current fuel and tyres."
                : stopsNeeded === 1
                ? `Plan 1 stop around lap ${pitLap}. Add ~${fuelToAdd.toFixed(1)} L. Pit loss ≈ ${pitLaneLoss.toFixed(1)}s.`
                : `Need ${stopsNeeded} stops — a full tank only covers ${maxLapsPerTank.toFixed(1)} laps. Split the remaining ${lapsRemaining} laps across your stops.`}
            </p>
          </div>
        </details>

        {/* Lap log */}
        {laps.length > 0 && (
          <details className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 mb-4" open>
            <summary className="cursor-pointer font-heading text-sm font-bold tracking-wide flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" /> Lap Log <span className="text-muted-foreground font-normal">({laps.length})</span>
            </summary>
            <div className="mt-3 space-y-1 max-h-56 overflow-y-auto">
              {laps.map((l, i) => {
                const isBest = bestLap != null && l === bestLap && l > 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm tabular-nums font-digi ${isBest ? "bg-primary/10 text-primary font-bold" : "bg-secondary/40"}`}
                  >
                    <span className="text-muted-foreground">L{pad(i + 1)}</span>
                    <span>{l > 0 ? fmtLap(l) : "—:—.—"}</span>
                    {isBest ? <span className="text-[10px] tracking-widest text-purple-400">BEST</span> : <span className="w-8" />}
                  </motion.div>
                );
              })}
            </div>
          </details>
        )}

        {/* Settings */}
        <details className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
          <summary className="cursor-pointer font-heading text-sm font-bold tracking-wide flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Race Settings
          </summary>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <SettingField label="Fuel / Lap (L)" value={fuelPerLap} onChange={setFuelPerLap} step={0.1} />
            <SettingField label="Tank Size (L)" value={tankSize} onChange={setTankSize} step={1} />
            <SettingField label="Current Fuel (L)" value={currentFuel} onChange={setCurrentFuel} step={0.5} />
            <SettingField label="Total Laps" value={totalLaps} onChange={setTotalLaps} step={1} />
            <SettingField label="Tyre Wear / Lap (%)" value={tyreWearPerLap} onChange={setTyreWearPerLap} step={0.5} />
            <SettingField label="Tyre Life (%)" value={tyreCondition} onChange={setTyreCondition} step={1} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">Set these before the race. Your race state & lap times are saved automatically — refreshing the page won't lose them.</p>
        </details>
      </div>
    </div>
  );
}

function SettingField({ label, value, onChange, step }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        className="w-full h-9 rounded-lg border border-border/50 bg-secondary/60 text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}