import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { GitCompare, Loader2 } from "lucide-react";

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

export default function SetupComparison() {
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");

  const { data: setups = [], isLoading } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
  });

  const setupA = useMemo(() => setups.find(s => s.id === idA), [setups, idA]);
  const setupB = useMemo(() => setups.find(s => s.id === idB), [setups, idB]);

  const diffRows = useMemo(() => {
    if (!setupA || !setupB) return [];
    const simA = SIM_SETUP_PARAMS[setupA.sim_title] || [];
    const simB = SIM_SETUP_PARAMS[setupB.sim_title] || [];

    // Build a merged param map
    const allParams = {};
    simA.forEach(g => g.params.forEach(p => { allParams[p.key] = p; }));
    simB.forEach(g => g.params.forEach(p => { allParams[p.key] = p; }));

    const rows = [];
    for (const [key, param] of Object.entries(allParams)) {
      const vA = setupA.parameters?.[key];
      const vB = setupB.parameters?.[key];
      const different = vA !== vB;
      rows.push({ key, param, vA, vB, different });
    }

    // Sort: different params first
    return rows.sort((a, b) => (b.different ? 1 : 0) - (a.different ? 1 : 0));
  }, [setupA, setupB]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (setups.length < 2) {
    return (
      <div className="text-center py-12">
        <GitCompare className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-40" />
        <p className="text-sm text-muted-foreground">Save at least 2 setups to compare them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Setup A (Base)</label>
          <Select value={idA} onValueChange={setIdA}>
            <SelectTrigger className="bg-secondary"><SelectValue placeholder="Choose a setup…" /></SelectTrigger>
            <SelectContent>
              {setups.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.title} — {s.car}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {setupA && <p className="text-xs text-muted-foreground">{setupA.sim_title}{setupA.track ? ` · ${setupA.track}` : ""}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Setup B (Compare)</label>
          <Select value={idB} onValueChange={setIdB}>
            <SelectTrigger className="bg-secondary"><SelectValue placeholder="Choose a setup…" /></SelectTrigger>
            <SelectContent>
              {setups.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.title} — {s.car}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {setupB && <p className="text-xs text-muted-foreground">{setupB.sim_title}{setupB.track ? ` · ${setupB.track}` : ""}</p>}
        </div>
      </div>

      {/* Diff table */}
      {setupA && setupB && (
        <div className="rounded-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-2 px-4 py-2 bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">Parameter</div>
            <div className="text-center">{setupA.title.slice(0, 16)}{setupA.title.length > 16 ? "…" : ""}</div>
            <div className="text-center">{setupB.title.slice(0, 16)}{setupB.title.length > 16 ? "…" : ""}</div>
            <div className="text-center">Delta</div>
          </div>

          {diffRows.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No matching parameters found between these setups.</div>
          )}

          <div className="divide-y divide-border">
            {diffRows.map(({ key, param, vA, vB, different }) => (
              <div
                key={key}
                className={`grid grid-cols-4 gap-2 px-4 py-2.5 text-xs transition-colors ${
                  different ? "bg-primary/3" : "hover:bg-muted/30"
                }`}
              >
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
                  {different ? (
                    <DeltaBadge a={vA} b={vB} unit={param.unit} />
                  ) : (
                    <span className="text-muted-foreground/40 text-xs">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {diffRows.length > 0 && (
            <div className="px-4 py-3 bg-secondary flex items-center gap-3 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-primary border-primary/30">
                {diffRows.filter(r => r.different).length} differences
              </Badge>
              <Badge variant="outline">
                {diffRows.filter(r => !r.different).length} matching
              </Badge>
            </div>
          )}
        </div>
      )}

      {(!setupA || !setupB) && setups.length >= 2 && (
        <p className="text-sm text-muted-foreground text-center py-4">Select two setups above to see the comparison.</p>
      )}
    </div>
  );
}