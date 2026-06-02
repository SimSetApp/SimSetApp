import { useState } from "react";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Gauge } from "lucide-react";

// Weather condition adjustments relative to dry/warm baseline
const WEATHER_ADJUSTMENTS = {
  dry_hot: {
    label: "Dry & Hot",
    icon: Sun,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    tyrePressureAdj: +0.5,   // higher temps = run slightly lower cold pressures
    wingAdj: 0,
    notes: "Tyres heat faster — reduce cold-start pressures by ~0.5 PSI. Monitor inner-edge wear. Hard compounds recommended for longer stints."
  },
  dry_mild: {
    label: "Dry & Mild",
    icon: Cloud,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    tyrePressureAdj: 0,
    wingAdj: 0,
    notes: "Baseline conditions. Use the track's nominal setup. Medium compound is the safe choice."
  },
  dry_cold: {
    label: "Dry & Cold",
    icon: Thermometer,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
    tyrePressureAdj: +1.0,  // cold air = tyres don't reach target hot pressure as easily
    wingAdj: 0,
    notes: "Add 0.5–1.0 PSI cold to hit target hot pressures. Soft compound helps heat generation. Allow extra warm-up laps before pushing."
  },
  wet_light: {
    label: "Light Rain",
    icon: CloudRain,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    border: "border-sky-400/30",
    tyrePressureAdj: +1.5,
    wingAdj: "+1–2 clicks",
    notes: "Switch to wet tyres. Increase wing by 1–2 positions for extra stability. Run higher cold pressures as wet tyres need heat to activate. Raise TC and ABS by 2–3 steps."
  },
  wet_heavy: {
    label: "Heavy Rain",
    icon: CloudRain,
    color: "text-indigo-400",
    bg: "bg-indigo-400/10",
    border: "border-indigo-400/30",
    tyrePressureAdj: +2.0,
    wingAdj: "+2–3 clicks",
    notes: "Maximum wet tyres. Significantly more wing for stability. Raise pressures 2+ PSI above dry baseline. Soften bump damping to improve aquaplaning resistance. Max TC and ABS."
  }
};

// Track baseline tyre pressures (dry/mild, GT3 PSI — adjust for class)
const TRACK_PRESSURE_BASELINES = {
  "Spa-Francorchamps":        { fl: 27.5, fr: 27.5, rl: 27.0, rr: 27.0 },
  "Monza":                    { fl: 27.0, fr: 27.0, rl: 26.5, rr: 26.5 },
  "Nürburgring GP":           { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Silverstone":              { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Bathurst":                 { fl: 27.5, fr: 27.5, rl: 27.0, rr: 27.0 },
  "Suzuka":                   { fl: 27.5, fr: 27.5, rl: 27.0, rr: 27.0 },
  "Brands Hatch GP":          { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Imola":                    { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Le Mans":                  { fl: 26.5, fr: 26.5, rl: 26.0, rr: 26.0 },
  "Circuit de Catalunya":     { fl: 27.5, fr: 27.3, rl: 27.0, rr: 26.8 },
  "Laguna Seca":              { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Red Bull Ring":            { fl: 27.3, fr: 27.3, rl: 26.8, rr: 26.8 },
  "Hungaroring":              { fl: 27.5, fr: 27.5, rl: 27.0, rr: 27.0 },
  "Nürburgring Nordschleife": { fl: 27.0, fr: 27.0, rl: 26.5, rr: 26.5 },
};

const TRACK_WING_BASELINES = {
  "Spa-Francorchamps":        "6–7",
  "Monza":                    "0–1",
  "Nürburgring GP":           "6–7",
  "Silverstone":              "5–6",
  "Bathurst":                 "8–9",
  "Suzuka":                   "6–7",
  "Brands Hatch GP":          "6–7",
  "Imola":                    "5–6",
  "Le Mans":                  "1–2 (GT: 5–6)",
  "Circuit de Catalunya":     "6–7",
  "Laguna Seca":              "5–6",
  "Red Bull Ring":            "5–6",
  "Hungaroring":              "8–9",
  "Nürburgring Nordschleife": "5–6",
};

function fmt(val) {
  return val.toFixed(1);
}

export default function TrackWeatherTips({ track }) {
  const [weather, setWeather] = useState("dry_mild");
  const condition = WEATHER_ADJUSTMENTS[weather];
  const Icon = condition.icon;
  const basePressures = TRACK_PRESSURE_BASELINES[track];
  const baseWing = TRACK_WING_BASELINES[track];

  if (!basePressures) return null;

  const adj = condition.tyrePressureAdj;
  const pressures = {
    fl: basePressures.fl + adj,
    fr: basePressures.fr + adj,
    rl: basePressures.rl + adj,
    rr: basePressures.rr + adj,
  };

  const isWet = weather === "wet_light" || weather === "wet_heavy";

  return (
    <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-primary shrink-0" />
        <h5 className="font-heading text-xs font-bold tracking-wider uppercase text-muted-foreground">
          Setup Tips by Weather
        </h5>
      </div>

      {/* Weather selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(WEATHER_ADJUSTMENTS).map(([key, val]) => {
          const WIcon = val.icon;
          const active = weather === key;
          return (
            <button
              key={key}
              onClick={() => setWeather(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                active ? `${val.bg} ${val.border} ${val.color}` : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              <WIcon className="w-3 h-3" />
              {val.label}
            </button>
          );
        })}
      </div>

      {/* Active condition panel */}
      <div className={`rounded-lg border ${condition.border} ${condition.bg} p-3 space-y-3`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${condition.color}`} />
          <span className={`text-xs font-semibold ${condition.color}`}>{condition.label}</span>
        </div>

        {/* Tyre pressures */}
        <div>
          <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
            <span>Suggested Cold Tyre Pressures</span>
            {isWet && <span className="text-xs text-muted-foreground">(Wet tyres)</span>}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "FL", val: pressures.fl },
              { label: "FR", val: pressures.fr },
              { label: "RL", val: pressures.rl },
              { label: "RR", val: pressures.rr },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center justify-between rounded-md bg-background/60 border border-border px-2.5 py-1.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-bold tabular-nums">{fmt(val)} PSI</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wing */}
        <div className="flex items-center justify-between rounded-md bg-background/60 border border-border px-2.5 py-1.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wind className="w-3 h-3" /> Wing
          </span>
          <span className="text-xs font-bold">
            {isWet ? `${baseWing} + ${condition.wingAdj}` : baseWing}
          </span>
        </div>

        {/* Notes */}
        <p className="text-xs text-muted-foreground leading-relaxed">{condition.notes}</p>
      </div>
    </div>
  );
}