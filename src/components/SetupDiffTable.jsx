import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { SIM_SETUP_PARAMS } from "../lib/simData";

function DeltaBadge({ a, b, unit }) {
  if (a === undefined || b === undefined || a === b) return null;
  const numA = parseFloat(a), numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) return null;
  const delta = numB - numA;
  const pct = numA !== 0 ? ((delta / Math.abs(numA)) * 100).toFixed(1) : null;
  const positive = delta > 0;
  return (
    <span className={`text-xs font-mono font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>
      {positive ? "+" : ""}{delta.toFixed(Math.abs(delta) < 1 ? 2 : 1)}{unit}
      {pct !== null && <span className="opacity-60 ml-1">({positive ? "+" : ""}{pct}%)</span>}
    </span>
  );
}

export default function SetupDiffTable({ setupA, setupB }) {
  const diffRows = useMemo(() => {
    if (!setupA || !setupB) return [];
    const simA = SIM_SETUP_PARAMS[setupA.sim_title] || [];
    const simB = SIM_SETUP_PARAMS[setupB.sim_title] || [];
    const allParams = {};
    simA.forEach(g => g.params.forEach(p => { allParams[p.key] = p; }));
    simB.forEach(g => g.params.forEach(p => { allParams[p.key] = p; }));
    const rows = [];
    for (const [key, param] of Object.entries(allParams)) {
      const vA = setupA.parameters?.[key];
      const vB = setupB.parameters?.[key];
      rows.push({ key, param, vA, vB, different: vA !== vB });
    }
    return rows.sort((a, b) => (b.different ? 1 : 0) - (a.different ? 1 : 0));
  }, [setupA, setupB]);

  if (!setupA || !setupB) return null;

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="col-span-1">Parameter</div>
        <div className="text-center truncate">{(setupA.title || "").slice(0, 16)}{(setupA.title || "").length > 16 ? "…" : ""}</div>
        <div className="text-center truncate">{(setupB.title || "").slice(0, 16)}{(setupB.title || "").length > 16 ? "…" : ""}</div>
        <div className="text-center">Delta</div>
      </div>

      {diffRows.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">No matching parameters found between these setups.</div>
      )}

      <div className="divide-y divide-border">
        {diffRows.map(({ key, param, vA, vB, different }) => (
          <div key={key} className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-xs transition-colors ${different ? "bg-primary/3" : "hover:bg-muted/30"}`}>
            <div className="col-span-1 text-muted-foreground font-medium truncate">{param.label}</div>
            <div className="text-center font-mono">
              {vA !== undefined ? (
                <span className={different ? "text-foreground" : "text-muted-foreground"}>
                  {typeof vA === "number" ? vA.toFixed(param.step < 1 ? 1 : 0) : vA}{param.unit}
                </span>
              ) : <span className="text-muted-foreground/40">—</span>}
            </div>
            <div className="text-center font-mono">
              {vB !== undefined ? (
                <span className={different ? "text-foreground" : "text-muted-foreground"}>
                  {typeof vB === "number" ? vB.toFixed(param.step < 1 ? 1 : 0) : vB}{param.unit}
                </span>
              ) : <span className="text-muted-foreground/40">—</span>}
            </div>
            <div className="text-center">
              {different ? <DeltaBadge a={vA} b={vB} unit={param.unit} /> : <span className="text-muted-foreground/40 text-xs">—</span>}
            </div>
          </div>
        ))}
      </div>

      {diffRows.length > 0 && (
        <div className="px-4 py-3 bg-secondary flex items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-primary border-primary/30">{diffRows.filter(r => r.different).length} differences</Badge>
          <Badge variant="outline">{diffRows.filter(r => !r.different).length} matching</Badge>
        </div>
      )}
    </div>
  );
}