import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Timer, Flag, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Zap, Settings } from "lucide-react";

export default function PitBoard() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds
  const [lapTime, setLapTime] = useState(""); // seconds as string
  const [fuelPerLap, setFuelPerLap] = useState(3.0);
  const [tankSize, setTankSize] = useState(100);
  const [currentFuel, setCurrentFuel] = useState(100);
  const [totalLaps, setTotalLaps] = useState(20);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [tyreCondition, setTyreCondition] = useState(100); // percentage
  const [tyreWearPerLap, setTyreWearPerLap] = useState(3); // percentage per lap
  const [pitWindow, setPitWindow] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [running]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const recordLap = () => {
    if (!lapTime) return;
    const lapSec = parseFloat(lapTime);
    setLapsCompleted(l => l + 1);
    setCurrentFuel(f => Math.max(0, f - fuelPerLap));
    setTyreCondition(t => Math.max(0, t - tyreWearPerLap));
    setLapTime("");
  };

  // Calculate pit window
  const lapsOfFuel = currentFuel / fuelPerLap;
  const lapsOfTyre = tyreCondition / tyreWearPerLap;
  const limitingFactor = Math.min(lapsOfFuel, lapsOfTyre);
  const lapsRemaining = totalLaps - lapsCompleted;
  const needPit = limitingFactor < lapsRemaining;
  const pitLap = Math.floor(lapsCompleted + limitingFactor);

  const fuelPct = (currentFuel / tankSize) * 100;
  const fuelColor = fuelPct > 50 ? "text-green-400" : fuelPct > 20 ? "text-amber-400" : "text-red-400";
  const tyreColor = tyreCondition > 50 ? "text-green-400" : tyreCondition > 25 ? "text-amber-400" : "text-red-400";

  const reset = () => {
    setRunning(false);
    setElapsed(0);
    setLapsCompleted(0);
    setCurrentFuel(tankSize);
    setTyreCondition(100);
    setLapTime("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Pit Board" />
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Flag className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">Pit Board Race Mode</h1>
          </div>
          <p className="text-sm text-muted-foreground">Glanceable race dashboard — track fuel, tyres, and pit windows in real time.</p>
        </div>

        {/* Timer */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-1">Race Time</div>
              <div className="text-5xl font-bold tabular-nums font-mono">{formatTime(elapsed)}</div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setRunning(!running)}
                size="lg"
                className="h-14 w-14 rounded-full p-0"
              >
                {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button onClick={reset} variant="outline" size="lg" className="h-14 w-14 rounded-full p-0">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Big stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Fuel */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className={`w-5 h-5 ${fuelColor}`} />
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Fuel</span>
            </div>
            <div className={`text-4xl font-bold tabular-nums ${fuelColor}`}>{currentFuel.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground mt-1">{lapsOfFuel.toFixed(1)} laps remaining</div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${fuelPct > 50 ? "bg-green-500" : fuelPct > 20 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, fuelPct)}%` }}
              />
            </div>
          </div>

          {/* Tyres */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className={`w-5 h-5 ${tyreColor}`} />
              <span className="text-xs text-muted-foreground font-medium tracking-widest uppercase">Tyres</span>
            </div>
            <div className={`text-4xl font-bold tabular-nums ${tyreColor}`}>{Math.round(tyreCondition)}%</div>
            <div className="text-xs text-muted-foreground mt-1">{lapsOfTyre.toFixed(1)} laps remaining</div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${tyreCondition > 50 ? "bg-green-500" : tyreCondition > 25 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${Math.min(100, tyreCondition)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lap counter */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-1">Lap</div>
              <div className="text-3xl font-bold tabular-nums">
                {lapsCompleted}<span className="text-muted-foreground text-xl"> / {totalLaps}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase mb-1">Remaining</div>
              <div className="text-3xl font-bold tabular-nums">{lapsRemaining}</div>
            </div>
          </div>
        </div>

        {/* Pit window alert */}
        {needPit && lapsRemaining > 0 && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <div className="font-heading text-base font-bold text-red-400">PIT WINDOW OPEN</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {lapsOfFuel < lapsOfTyre ? "Fuel" : "Tyres"} will run out around lap {pitLap}. Pit before then!
                </div>
              </div>
            </div>
          </div>
        )}

        {!needPit && lapsRemaining > 0 && lapsCompleted > 0 && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-4 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-sm text-green-400 font-medium">No pit needed — you can make it to the end.</span>
            </div>
          </div>
        )}

        {/* Lap input */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-4 h-4 text-primary" />
            <h3 className="font-heading text-sm font-bold tracking-wide">Record Lap</h3>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.001"
              value={lapTime}
              onChange={e => setLapTime(e.target.value)}
              onKeyDown={e => e.key === "Enter" && recordLap()}
              placeholder="Lap time (e.g. 92.345)"
              className="flex-1 h-12 rounded-lg border border-border bg-secondary text-lg font-mono px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={recordLap} disabled={!lapTime} size="lg" className="h-12 px-6 font-heading text-sm tracking-wider">
              <Zap className="w-4 h-4 mr-1" /> Log Lap
            </Button>
          </div>
        </div>

        {/* Settings */}
        <details className="rounded-2xl border border-border bg-card p-5">
          <summary className="cursor-pointer font-heading text-sm font-bold tracking-wide flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> Race Settings
          </summary>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <SettingField label="Fuel / Lap (L)" value={fuelPerLap} onChange={setFuelPerLap} step={0.1} />
            <SettingField label="Tank Size (L)" value={tankSize} onChange={setTankSize} step={1} />
            <SettingField label="Total Laps" value={totalLaps} onChange={setTotalLaps} step={1} />
            <SettingField label="Tyre Wear / Lap (%)" value={tyreWearPerLap} onChange={setTyreWearPerLap} step={0.5} />
          </div>
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