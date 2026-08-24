import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SetupDiffTable from "./SetupDiffTable";
import { GitCompare, Loader2 } from "lucide-react";

export default function SetupComparison() {
  const [idA, setIdA] = useState("");
  const [idB, setIdB] = useState("");

  const { data: setups = [], isLoading } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
  });

  const setupA = useMemo(() => setups.find(s => s.id === idA), [setups, idA]);
  const setupB = useMemo(() => setups.find(s => s.id === idB), [setups, idB]);

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
      {setupA && setupB && <SetupDiffTable setupA={setupA} setupB={setupB} />}

      {(!setupA || !setupB) && setups.length >= 2 && (
        <p className="text-sm text-muted-foreground text-center py-4">Select two setups above to see the comparison.</p>
      )}
    </div>
  );
}