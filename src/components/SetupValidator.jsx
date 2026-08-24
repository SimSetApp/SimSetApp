import { AlertTriangle, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { validateSetup, setupSafetyScore } from "@/lib/setupValidation";

export default function SetupValidator({ sim, parameters, carClass }) {
  const warnings = validateSetup(sim, parameters, carClass);
  const score = setupSafetyScore(sim, parameters, carClass);
  const errors = warnings.filter(w => w.severity === "error");
  const warns = warnings.filter(w => w.severity === "warning");

  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
        <span className="text-xs text-green-400 font-medium">All parameters within safe ranges.</span>
      </div>
    );
  }

  const scoreColor = score >= 80 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = score >= 80 ? "bg-green-500/10" : score >= 50 ? "bg-amber-500/10" : "bg-red-500/10";

  return (
    <div className="space-y-2">
      {/* Score bar */}
      <div className={`flex items-center gap-3 rounded-lg border p-3 ${scoreBg} border-border`}>
        <Shield className={`w-5 h-5 ${scoreColor} shrink-0`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Setup Safety Score</span>
            <span className={`text-sm font-bold tabular-nums ${scoreColor}`}>{score}/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${score >= 80 ? "bg-green-500" : score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Warnings list */}
      <div className="space-y-1.5">
        {errors.map((w, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground">{w.message}</span>
          </div>
        ))}
        {warns.map((w, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground">{w.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}