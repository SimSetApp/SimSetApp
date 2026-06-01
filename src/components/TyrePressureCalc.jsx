import { useState, useMemo } from "react";
import { SIM_TITLES, TYRE_PRESSURE_BASES, SIM_TYRE_CLASSES } from "../lib/simData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Circle } from "lucide-react";

// Derived per-sim inside the component — removed static const

const SIM_UNIT = {
  "Assetto Corsa Competizione": { unit: "PSI", key: "acc", decimals: 1 },
  "iRacing": { unit: "PSI", key: "iracing", decimals: 1 },
  "Assetto Corsa": { unit: "PSI", key: "ac", decimals: 1 },
  "Assetto Corsa Evo": { unit: "PSI", key: "ace", decimals: 1 },
  "Le Mans Ultimate": { unit: "kPa", key: "lmu_kpa", decimals: 0 },
  "Automobilista 2": { unit: "PSI", key: "ams2", decimals: 1 },
  "Gran Turismo 7": { unit: "kPa", key: "gt7_kpa", decimals: 0 }
};

function pressureColor(target, value) {
  const diff = Math.abs(value - target);
  if (diff < 0.5) return "text-green-400";
  if (diff < 1.5) return "text-yellow-400";
  return "text-red-400";
}

export default function TyrePressureCalc() {
  const [sim, setSim] = useState("Assetto Corsa Competizione");
  const [carClass, setCarClass] = useState("GT3");

  const carClasses = SIM_TYRE_CLASSES[sim] || Object.keys(TYRE_PRESSURE_BASES);

  const handleSimChange = (v) => {
    const classes = SIM_TYRE_CLASSES[v] || Object.keys(TYRE_PRESSURE_BASES);
    setSim(v);
    if (!classes.includes(carClass)) setCarClass(classes[0] || "GT3");
  };

  const [trackTemp, setTrackTemp] = useState(30);
  const [ambientTemp, setAmbientTemp] = useState(22);
  const [isWet, setIsWet] = useState(false);

  const results = useMemo(() => {
    const simInfo = SIM_UNIT[sim];
    const base = TYRE_PRESSURE_BASES[carClass];
    if (!simInfo || !base) return null;

    const hotTarget = base[simInfo.key];

    // Temperature delta factor
    const tempDelta = trackTemp - 25; // 25°C baseline
    const ambientDelta = ambientTemp - 20; // 20°C baseline

    // Cold pressure adjustment: ~0.06 PSI per degree (0.4 kPa per degree)
    const isPSI = simInfo.unit === "PSI";
    const tempFactor = isPSI ? 0.05 : 0.35;

    // Hot pressures rise ~3 PSI / 21 kPa above cold
    const hotRise = isPSI ? 3.2 : 22;
    const wetReduction = isWet ? (isPSI ? 1.5 : 10) : 0;

    const adjustedHot = hotTarget + (tempDelta * tempFactor * 0.4) - wetReduction;
    const coldStart = adjustedHot - hotRise - (ambientDelta * tempFactor);

    const fl = Math.round(coldStart * (isPSI ? 10 : 1)) / (isPSI ? 10 : 1);
    const fr = fl;
    const rl = Math.round((coldStart - (isPSI ? 0.4 : 3)) * (isPSI ? 10 : 1)) / (isPSI ? 10 : 1);
    const rr = rl;

    return {
      fl: fl.toFixed(simInfo.decimals),
      fr: fr.toFixed(simInfo.decimals),
      rl: rl.toFixed(simInfo.decimals),
      rr: rr.toFixed(simInfo.decimals),
      hotTarget: hotTarget.toFixed(simInfo.decimals),
      unit: simInfo.unit
    };
  }, [sim, carClass, trackTemp, ambientTemp, isWet]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sim</label>
          <Select value={sim} onValueChange={handleSimChange}>
            <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIM_TITLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Car Class</label>
          <Select value={carClass} onValueChange={setCarClass}>
            <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
            <SelectContent>
              {carClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" /> Track Temperature
            </label>
            <span className="text-sm font-semibold text-primary">{trackTemp}°C</span>
          </div>
          <Slider value={[trackTemp]} onValueChange={([v]) => setTrackTemp(v)} min={5} max={60} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>5°C (cold)</span><span>60°C (scorching)</span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Thermometer className="w-3.5 h-3.5 text-blue-400" /> Ambient Temperature
            </label>
            <span className="text-sm font-semibold">{ambientTemp}°C</span>
          </div>
          <Slider value={[ambientTemp]} onValueChange={([v]) => setAmbientTemp(v)} min={0} max={45} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0°C</span><span>45°C</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsWet(!isWet)}
          className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
            isWet ? "bg-blue-500/10 border-blue-500/40 text-blue-400" : "bg-secondary border-border text-muted-foreground"
          }`}
        >
          💧 Wet Conditions
        </button>
        {isWet && <span className="text-xs text-blue-400">Pressures reduced for wet tyres</span>}
      </div>

      {results && (
        <div className="rounded-2xl border border-border bg-secondary p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide">Recommended Cold Start Pressures</h3>
            <Badge variant="outline" className="text-xs">
              Hot target: {results.hotTarget} {results.unit}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Front Left", value: results.fl },
              { label: "Front Right", value: results.fr },
              { label: "Rear Left", value: results.rl },
              { label: "Rear Right", value: results.rr },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-card border border-border p-4 text-center">
                <Circle className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className={`text-xl font-bold font-display mt-1 ${pressureColor(parseFloat(results.hotTarget) - 3, parseFloat(value))}`}>
                  {value}
                </div>
                <div className="text-xs text-muted-foreground">{results.unit}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            These are cold start pressures. Check your hot pressures after 3–4 warm laps.
          </p>
        </div>
      )}
    </div>
  );
}