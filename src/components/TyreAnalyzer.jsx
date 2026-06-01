import { useState, useMemo } from "react";
import { Thermometer, AlertTriangle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const CORNERS = [
  { key: "fl", label: "Front Left" },
  { key: "fr", label: "Front Right" },
  { key: "rl", label: "Rear Left" },
  { key: "rr", label: "Rear Right" },
];

function tempColor(t) {
  if (!t || isNaN(t)) return "text-muted-foreground";
  if (t < 60) return "text-blue-400";
  if (t < 80) return "text-cyan-400";
  if (t <= 105) return "text-green-400";
  if (t <= 115) return "text-yellow-400";
  return "text-red-400";
}

function diagnoseTyre(inner, middle, outer, axis) {
  const issues = [];
  if (!inner || !middle || !outer || isNaN(inner) || isNaN(middle) || isNaN(outer)) return [];

  const innerN = parseFloat(inner), midN = parseFloat(middle), outerN = parseFloat(outer);
  const avg = (innerN + midN + outerN) / 3;
  const spread = Math.max(innerN, midN, outerN) - Math.min(innerN, midN, outerN);

  if (innerN - outerN > 15) {
    issues.push({ type: "camber", severity: "high", message: `Too much negative ${axis} camber — inner edge overloading. Reduce camber by 0.2–0.3°.` });
  } else if (innerN - outerN > 8) {
    issues.push({ type: "camber", severity: "medium", message: `Slightly high ${axis} negative camber — inner edge warmer than ideal. Consider reducing by 0.1–0.2°.` });
  } else if (outerN - innerN > 12) {
    issues.push({ type: "camber", severity: "high", message: `Not enough negative ${axis} camber — outer edge overloading. Add 0.2–0.3° negative camber.` });
  } else if (outerN - innerN > 6) {
    issues.push({ type: "camber", severity: "medium", message: `Slightly low ${axis} negative camber. Consider adding 0.1–0.2°.` });
  }

  if (midN - Math.min(innerN, outerN) > 12) {
    issues.push({ type: "pressure", severity: "high", message: `${axis} tyre pressure too HIGH — crown-shaped contact patch. Reduce by 0.5–1.0 PSI.` });
  } else if (midN - Math.min(innerN, outerN) > 6) {
    issues.push({ type: "pressure", severity: "medium", message: `${axis} pressure slightly high — centre runs hotter. Reduce by 0.2–0.5 PSI.` });
  }

  if (Math.min(innerN, outerN) - midN > 10) {
    issues.push({ type: "pressure", severity: "high", message: `${axis} tyre pressure too LOW — shoulders overloading. Increase by 0.5–1.0 PSI.` });
  } else if (Math.min(innerN, outerN) - midN > 5) {
    issues.push({ type: "pressure", severity: "medium", message: `${axis} pressure slightly low — edges running hotter than centre. Increase by 0.2–0.5 PSI.` });
  }

  if (avg > 115) {
    issues.push({ type: "overheating", severity: "critical", message: `${axis} OVERHEATING (${Math.round(avg)}°C avg). Increase pressure, soften ARB, or check driving style.` });
  } else if (avg > 105) {
    issues.push({ type: "overheating", severity: "high", message: `${axis} running hot (${Math.round(avg)}°C avg). Slightly above optimal window — monitor.` });
  } else if (avg < 65) {
    issues.push({ type: "cold", severity: "medium", message: `${axis} running cold (${Math.round(avg)}°C avg). Tyres not in window — reduce pressure or push harder on out-lap.` });
  }

  if (spread < 10 && avg >= 70 && avg <= 110) {
    issues.push({ type: "good", severity: "ok", message: `${axis} temps well distributed (${Math.round(avg)}°C avg, ±${Math.round(spread/2)}°C spread). Setup looks correct here.` });
  }

  return issues;
}

function CornerInput({ corner, data, onChange }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-3">{corner.label}</h4>
      <div className="grid grid-cols-3 gap-2">
        {["inner", "middle", "outer"].map(pos => (
          <div key={pos}>
            <label className="block text-xs text-muted-foreground mb-1 capitalize">{pos}</label>
            <Input
              type="number"
              placeholder="°C"
              value={data[`${corner.key}_${pos}`] || ""}
              onChange={e => onChange(`${corner.key}_${pos}`, e.target.value)}
              className="text-center bg-secondary text-sm h-8 px-2"
            />
          </div>
        ))}
      </div>
      {/* Mini temp display */}
      <div className="flex gap-1 mt-2 justify-center">
        {["inner", "middle", "outer"].map(pos => {
          const v = parseFloat(data[`${corner.key}_${pos}`]);
          return (
            <span key={pos} className={`text-xs font-mono font-semibold ${tempColor(v)}`}>
              {v ? `${v}°` : "—"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function TyreAnalyzer() {
  const [temps, setTemps] = useState({});

  const setTemp = (key, val) => setTemps(prev => ({ ...prev, [key]: val }));

  const allDiagnoses = useMemo(() => {
    const results = [];
    for (const corner of CORNERS) {
      const inner = temps[`${corner.key}_inner`];
      const middle = temps[`${corner.key}_middle`];
      const outer = temps[`${corner.key}_outer`];
      const axis = corner.label;
      const issues = diagnoseTyre(inner, middle, outer, axis);
      if (issues.length) results.push({ corner: corner.label, issues });
    }
    return results;
  }, [temps]);

  const hasAnyData = CORNERS.some(c => temps[`${c.key}_inner`] || temps[`${c.key}_middle`] || temps[`${c.key}_outer`]);

  const severityIcon = (s) => {
    if (s === "ok") return <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />;
    if (s === "critical") return <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />;
    if (s === "high") return <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />;
    return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <h3 className="font-heading text-sm font-semibold">Tyre Temperature Analyser</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter inside / middle / outside temperatures (°C) for each tyre to diagnose camber, pressure, and heat issues.
        </p>
      </div>

      {/* Optimal range guide */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { label: "Cold (<65°C)", color: "text-blue-400" },
          { label: "Cool (65–80°C)", color: "text-cyan-400" },
          { label: "Optimal (80–105°C)", color: "text-green-400" },
          { label: "Hot (105–115°C)", color: "text-yellow-400" },
          { label: "Over-temp (>115°C)", color: "text-red-400" },
        ].map(g => (
          <span key={g.label} className={`${g.color} font-medium`}>{g.label}</span>
        ))}
      </div>

      {/* Input grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CORNERS.map(corner => (
          <CornerInput key={corner.key} corner={corner} data={temps} onChange={setTemp} />
        ))}
      </div>

      {/* Diagnosis */}
      {hasAnyData && allDiagnoses.length > 0 && (
        <div className="rounded-2xl border border-border bg-secondary p-5">
          <h4 className="font-heading text-sm font-semibold mb-4 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" /> Diagnosis
          </h4>
          <div className="space-y-4">
            {allDiagnoses.map(({ corner, issues }) => (
              <div key={corner}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{corner}</p>
                <div className="space-y-2">
                  {issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {severityIcon(issue.severity)}
                      <p className="text-xs text-muted-foreground leading-relaxed">{issue.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasAnyData && allDiagnoses.length === 0 && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-400">All temperatures look good</p>
            <p className="text-xs text-muted-foreground">No significant issues detected in the data entered so far.</p>
          </div>
        </div>
      )}

      {!hasAnyData && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Enter tyre temperatures above to see your diagnosis.
        </p>
      )}
    </div>
  );
}