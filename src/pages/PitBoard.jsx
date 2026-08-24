import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Flag, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Zap, Settings, Plus, Minus, Wrench, Trophy, Clock, Timer } from "lucide-react";

const STORE_KEY = "pitboard-race-state-v2";

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const pad = (n, w = 2) => String(n).padStart(w, "0");

// mm:ss.t  — race clock
const fmtRace = (ms) => {
  const total = Math.floor(ms / 100);
  const m = Math.floor(total / 600);
  const s = Math.floor((total % 600) / 10);
  const t = total % 10;
  return `${m}:${pad(s)}.${t}`;
};

// m:ss.ttt — lap time
const fmtLap = (ms) => {
  const totalMs = Math.max(0, Math.round(ms));
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms3 = totalMs % 1000;
  return `${m}:${pad(s)}.${pad(ms3, 3)}`;
};

export default function PitBoard() {
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
  const intervalRef = useRef(null);

  // Resume timer if it was running
  useEffect(() => {
    if (running) setStartedAt(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setNow(Date.now()), 100);
      return () => clearInterval(intervalRef.current);
    }
  }, [running]);

  const elapsedMs = running && startedAt ? baseMs + (Date.now() - startedAt) : baseMs;

  // Persist
  useEffect(() => {
    const data = {
      running, elapsedMs, fuelPerLap, tankSize, currentFuel, totalLaps,
      lapsCompleted, tyreCondition, tyreWearPerLap, laps, lastLapMs,
    };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
  }, [running, elapsedMs, fuelPerLap, tankSize, currentFuel, totalLaps, lapsCompleted, tyreCondition, tyreWearPerLap, laps, lastLapMs]);

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
  }, [running, startedAt, baseMs, lastLapMs, fuelPerLap, tyreWearPerLap]);

  // Keyboard: space = lap, p = play/pause
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

  // Strategy calcs
  const lapsOfFuel = fuelPerLap > 0 ? currentFuel / fuelPerLap : 0;
  const lapsOfTyre = tyreWearPerLap > 0 ? tyreCondition / tyreWearPerLap : 0;
  const limitingFactor = Math.min(lapsOfFuel, lapsOfTyre);
  const lapsRemaining = Math.max(0, totalLaps - lapsCompleted);
  const limiter = lapsOfFuel < lapsOfTyre ? "fuel" : "tyres";

  const validLaps = laps.filter(l => l > 0);
  const lastLap = laps.length ? laps[laps.length - 1] : null;
  const bestLap = validLaps.length ? Math.min(...validLaps) : null;

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
  const toneBar = { good: "bg-green-500", warn: "bg-amber-500", bad: "bg-red-500" };
  const toneBg = { safe: "border-green-500/40 bg-green-500/10", warn: "border-amber-500/40 bg-amber-500/10", urgent: "border-red-500/50 bg-red-500/15", done: "border-primary/40 bg-primary/10" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Pit Board" />
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">Pit Board</h1>
          </div>
          <p className="text-sm text-muted-foreground">Tap <span className="font-semibold text-foreground">Complete Lap</span> each lap — lap time, fuel, tyres & pit window update automatically.</p>
        </div>

        {/* Timer + controls */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">Race Time</div>
              <div className="text-4xl font-bold tabular-nums font-mono">{fmtRace(elapsedMs)}</div>
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

        {/* Lap counter + last/best */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-3">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">Lap</div>
              <div className="text-5xl font-bold tabular-nums leading-none">
                {lapsCompleted}<span className="text-muted-foreground text-2xl"> / {totalLaps}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase mb-1">To Go</div>
              <div className="text-5xl font-bold tabular-nums leading-none">{lapsRemaining}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Last Lap</div>
                <div className="text-lg font-bold tabular-nums font-mono">{lastLap != null ? fmtLap(lastLap) : "—:—.—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Best Lap</div>
                <div className="text-lg font-bold tabular-nums font-mono text-primary">{bestLap != null ? fmtLap(bestLap) : "—:—.—"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary action: Complete Lap */}
        <button
          onClick={completeLap}
          className="w-full h-20 rounded-2xl bg-primary text-primary-foreground font-heading text-2xl font-bold tracking-wider active:scale-[0.99] transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-3 mb-3 select-none"
        >
          <Zap className="w-7 h-7" />
          COMPLETE LAP
        </button>
        <p className="text-center text-[11px] text-muted-foreground mb-4">or press <span className="font-semibold text-foreground">Space</span></p>

        {/* Pit status banner */}
        <div className={`rounded-2xl border p-5 mb-3 ${status.tone === "urgent" ? "animate-pulse" : ""} ${toneBg[status.tone]}`}>
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

        {/* Fuel & Tyres glance cards */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className={`w-5 h-5 ${toneText[fuelTone]}`} />
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Fuel</span>
            </div>
            <div className={`text-3xl font-bold tabular-nums ${toneText[fuelTone]}`}>{lapsOfFuel.toFixed(1)}</div>
            <div className="text-[11px] text-muted-foreground">laps of fuel</div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${toneBar[fuelTone]}`} style={{ width: `${Math.min(100, fuelPct)}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">{currentFuel.toFixed(1)} / {tankSize} L</div>
            <div className="flex gap-1.5 mt-2">
              <button onClick={() => setCurrentFuel(f => Math.max(0, +(f - 1).toFixed(2)))} className="flex-1 h-8 rounded-lg border border-border bg-secondary text-sm font-bold active:scale-95 transition-transform flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <button onClick={() => setCurrentFuel(f => Math.min(tankSize, +(f + 1).toFixed(2)))} className="flex-1 h-8 rounded-lg border border-border bg-secondary text-sm font-bold active:scale-95 transition-transform flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className={`w-5 h-5 ${toneText[tyreTone]}`} />
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Tyres</span>
            </div>
            <div className={`text-3xl font-bold tabular-nums ${toneText[tyreTone]}`}>{lapsOfTyre.toFixed(1)}</div>
            <div className="text-[11px] text-muted-foreground">laps of life</div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all ${toneBar[tyreTone]}`} style={{ width: `${Math.min(100, tyreCondition)}%` }} />
            </div>
            <div className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">{Math.round(tyreCondition)}% life</div>
            <div className="flex gap-1.5 mt-2">
              <button onClick={() => setTyreCondition(t => Math.max(0, +(t - 5).toFixed(1)))} className="flex-1 h-8 rounded-lg border border-border bg-secondary text-sm font-bold active:scale-95 transition-transform flex items-center justify-center"><Minus className="w-4 h-4" /></button>
              <button onClick={() => setTyreCondition(t => Math.min(100, +(t + 5).toFixed(1)))} className="flex-1 h-8 rounded-lg border border-border bg-secondary text-sm font-bold active:scale-95 transition-transform flex items-center justify-center"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Pit service buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button onClick={() => pitService(true, false)} className="h-11 rounded-xl border border-border bg-secondary text-xs font-heading font-semibold tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Fuel className="w-4 h-4" /> Fuel Only
          </button>
          <button onClick={() => pitService(false, true)} className="h-11 rounded-xl border border-border bg-secondary text-xs font-heading font-semibold tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Gauge className="w-4 h-4" /> Tyres Only
          </button>
          <button onClick={() => pitService(true, true)} className="h-11 rounded-xl border border-primary/40 bg-primary/10 text-xs font-heading font-semibold tracking-wide text-primary active:scale-95 transition-transform flex items-center justify-center gap-1.5">
            <Wrench className="w-4 h-4" /> Full Service
          </button>
        </div>

        {/* Lap log */}
        {laps.length > 0 && (
          <details className="rounded-2xl border border-border bg-card p-5 mb-4" open>
            <summary className="cursor-pointer font-heading text-sm font-bold tracking-wide flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" /> Lap Log <span className="text-muted-foreground font-normal">({laps.length})</span>
            </summary>
            <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
              {laps.map((l, i) => {
                const isBest = bestLap != null && l === bestLap && l > 0;
                return (
                  <div key={i} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm tabular-nums font-mono ${isBest ? "bg-primary/10 text-primary font-bold" : "bg-secondary/50"}`}>
                    <span className="text-muted-foreground">L{pad(i + 1)}</span>
                    <span>{l > 0 ? fmtLap(l) : "—:—.—"}</span>
                    {isBest && <span className="text-[10px] tracking-widest">BEST</span>}
                  </div>
                );
              })}
            </div>
          </details>
        )}

        {/* Settings (pre-race) */}
        <details className="rounded-2xl border border-border bg-card p-5">
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
      <Footer />
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
        className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}