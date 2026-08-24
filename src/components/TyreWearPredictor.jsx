import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Circle, AlertTriangle, TrendingDown, Clock, Gauge } from "lucide-react";
import { predictTyreWear, estimateStintTimeLoss } from "@/lib/tyreWearModel";
import { SIM_TITLES, CAR_LISTS, SIM_TYRE_CLASSES } from "@/lib/simData";

const COMPOUNDS = [
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "wet", label: "Wet" },
];

const STYLES = [
  { value: "smooth", label: "Smooth" },
  { value: "balanced", label: "Balanced" },
  { value: "aggressive", label: "Aggressive" },
];

export default function TyreWearPredictor() {
  const [sim, setSim] = useState(SIM_TITLES[0]);
  const [carClass, setCarClass] = useState("GT3");
  const [compound, setCompound] = useState("medium");
  const [trackTemp, setTrackTemp] = useState(28);
  const [ambientTemp, setAmbientTemp] = useState(22);
  const [camberFront, setCamberFront] = useState(-3.5);
  const [camberRear, setCamberRear] = useState(-2.5);
  const [stintLaps, setStintLaps] = useState(20);
  const [drivingStyle, setDrivingStyle] = useState("balanced");
  const [pressureFL, setPressureFL] = useState(27.5);
  const [pressureFR, setPressureFR] = useState(27.5);
  const [pressureRL, setPressureRL] = useState(27.0);
  const [pressureRR, setPressureRR] = useState(27.0);

  const { data: latestSession } = useQuery({
    queryKey: ["latest-session-tyre"],
    queryFn: async () => { const r = await base44.entities.SessionLog.list("-created_date", 1); return r?.[0] || null; },
  });

  const applyLatest = () => {
    if (!latestSession) return;
    if (latestSession.track_temp > 0) setTrackTemp(latestSession.track_temp);
    if (latestSession.air_temp > 0) setAmbientTemp(latestSession.air_temp);
    if (latestSession.total_laps > 0) setStintLaps(latestSession.total_laps);
  };

  const result = useMemo(() => {
    return predictTyreWear({
      compound,
      trackTempC: trackTemp,
      ambientTempC: ambientTemp,
      pressures: { fl: pressureFL, fr: pressureFR, rl: pressureRL, rr: pressureRR },
      camberFront,
      camberRear,
      stintLengthLaps: stintLaps,
      drivingStyle,
      carClass,
    });
  }, [compound, trackTemp, ambientTemp, pressureFL, pressureFR, pressureRL, pressureRR, camberFront, camberRear, stintLaps, drivingStyle, carClass]);

  const totalLoss = useMemo(() => estimateStintTimeLoss(result.degradationPerLap, stintLaps), [result, stintLaps]);

  const riskColors = {
    low: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", label: "Low Risk" },
    medium: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", label: "Medium Risk" },
    high: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", label: "High Risk" },
  };
  const risk = riskColors[result.riskLevel];

  const classes = SIM_TYRE_CLASSES[sim] || ["GT3"];

  return (
    <div className="space-y-5">
      {latestSession && (latestSession.track_temp > 0 || latestSession.total_laps > 0) && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
          <span className="text-xs text-muted-foreground">Use real conditions from your latest session{latestSession.session_type ? ` (${latestSession.session_type})` : ""}.</span>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary hover:bg-primary/10" onClick={applyLatest}>Apply</Button>
        </div>
      )}
      {/* Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Field label="Sim">
          <select value={sim} onChange={e => { setSim(e.target.value); setCarClass(SIM_TYRE_CLASSES[e.target.value]?.[0] || "GT3"); }} className="input-base">
            {SIM_TITLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Car Class">
          <select value={carClass} onChange={e => setCarClass(e.target.value)} className="input-base">
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Compound">
          <select value={compound} onChange={e => setCompound(e.target.value)} className="input-base">
            {COMPOUNDS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Track Temp (°C)">
          <input type="number" value={trackTemp} onChange={e => setTrackTemp(+e.target.value)} className="input-base" />
        </Field>
        <Field label="Ambient (°C)">
          <input type="number" value={ambientTemp} onChange={e => setAmbientTemp(+e.target.value)} className="input-base" />
        </Field>
        <Field label="Driving Style">
          <select value={drivingStyle} onChange={e => setDrivingStyle(e.target.value)} className="input-base">
            {STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Camber F (°)">
          <input type="number" step="0.1" value={camberFront} onChange={e => setCamberFront(+e.target.value)} className="input-base" />
        </Field>
        <Field label="Camber R (°)">
          <input type="number" step="0.1" value={camberRear} onChange={e => setCamberRear(+e.target.value)} className="input-base" />
        </Field>
        <Field label="Stint (laps)">
          <input type="number" value={stintLaps} onChange={e => setStintLaps(+e.target.value)} className="input-base" />
        </Field>
      </div>

      {/* Pressures */}
      <div className="grid grid-cols-4 gap-2">
        <Field label="P-FL (PSI)"><input type="number" step="0.1" value={pressureFL} onChange={e => setPressureFL(+e.target.value)} className="input-base" /></Field>
        <Field label="P-FR (PSI)"><input type="number" step="0.1" value={pressureFR} onChange={e => setPressureFR(+e.target.value)} className="input-base" /></Field>
        <Field label="P-RL (PSI)"><input type="number" step="0.1" value={pressureRL} onChange={e => setPressureRL(+e.target.value)} className="input-base" /></Field>
        <Field label="P-RR (PSI)"><input type="number" step="0.1" value={pressureRR} onChange={e => setPressureRR(+e.target.value)} className="input-base" /></Field>
      </div>

      {/* Results */}
      <div className={`rounded-xl border p-4 ${risk.bg} ${risk.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${risk.text}`} />
            <span className={`font-heading text-sm font-bold ${risk.text}`}>{risk.label}</span>
          </div>
          <span className="text-xs text-muted-foreground">Tyre Wear Prediction</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat icon={TrendingDown} label="Deg/Lap" value={`+${result.degradationPerLap.toFixed(3)}s`} sub="pace loss per lap" />
          <Stat icon={Clock} label="Cliff Lap" value={`~${result.cliffLap}`} sub="accelerated wear" />
          <Stat icon={Gauge} label="Est. Life" value={`~${result.stintLife} laps`} sub="before dead" />
          <Stat icon={Circle} label="Stint Loss" value={`+${totalLoss.toFixed(1)}s`} sub="total over stint" />
        </div>

        {/* Wear curve visualization */}
        <div className="mt-4">
          <div className="text-xs text-muted-foreground mb-2">Degradation curve over {stintLaps} laps:</div>
          <div className="relative h-16 rounded-lg bg-secondary/50 border border-border overflow-hidden">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                points={Array.from({ length: stintLaps }, (_, i) => {
                  const lap = i + 1;
                  const cliffLap = result.cliffLap;
                  let y;
                  if (lap <= cliffLap) {
                    y = 38 - (result.degradationPerLap * lap * 200);
                  } else {
                    y = 38 - (result.degradationPerLap * lap * 200) * (1 + (lap - cliffLap) * 0.15);
                  }
                  return `${(i / (stintLaps - 1)) * 100},${Math.max(2, y)}`;
                }).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className={risk.text}
              />
              <line x1={(result.cliffLap / stintLaps) * 100} y1="0" x2={(result.cliffLap / stintLaps) * 100} y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className={risk.text} opacity="0.5" />
            </svg>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 space-y-1.5">
          {result.notes.map((note, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${risk.text} bg-current`} />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          height: 2.25rem;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--secondary));
          padding: 0 0.5rem;
          font-size: 0.75rem;
          color: hsl(var(--foreground));
          outline: none;
        }
        .input-base:focus { border-color: hsl(var(--primary)); }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-lg bg-card/50 border border-border p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}