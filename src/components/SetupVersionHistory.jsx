import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { GitBranch, Plus, ChevronDown, ChevronUp, Trash2, Loader2, RotateCcw, ArrowRight, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

function ParamDiff({ sim, versionA, versionB }) {
  const groups = SIM_SETUP_PARAMS[sim];
  if (!groups) return null;

  const diffs = [];
  groups.forEach(group => {
    group.params.forEach(p => {
      const aVal = versionA?.parameters?.[p.key];
      const bVal = versionB?.parameters?.[p.key];
      if (aVal !== undefined && bVal !== undefined && aVal !== bVal) {
        const delta = typeof aVal === "number" && typeof bVal === "number" ? bVal - aVal : null;
        diffs.push({ label: p.label, unit: p.unit, aVal, bVal, delta });
      }
    });
  });

  if (diffs.length === 0) {
    return <p className="text-xs text-muted-foreground py-3 text-center">No parameter changes between these versions.</p>;
  }

  return (
    <div className="space-y-1.5">
      {diffs.map(({ label, unit, aVal, bVal, delta }) => {
        const increased = delta > 0;
        const fmtVal = (v) => typeof v === "number" && v % 1 !== 0 ? v.toFixed(1) : v;
        return (
          <div key={label} className="flex items-center justify-between text-xs rounded-lg bg-muted/30 px-3 py-2">
            <span className="text-muted-foreground truncate mr-2">{label}</span>
            <div className="flex items-center gap-2 shrink-0 font-mono">
              <span className="text-muted-foreground">{fmtVal(aVal)}{unit}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className={delta !== null ? (increased ? "text-emerald-400" : "text-red-400") : "text-foreground"}>
                {fmtVal(bVal)}{unit}
              </span>
              {delta !== null && (
                <span className={`text-[10px] ${increased ? "text-emerald-400/70" : "text-red-400/70"}`}>
                  ({increased ? "+" : ""}{typeof delta === "number" && delta % 1 !== 0 ? delta.toFixed(1) : delta})
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VersionCard({ version, sim, isLatest, onDelete, onRestore, compareWith, onToggleCompare, isComparing }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(version.version_name);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.SetupVersion.update(version.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setup-versions", version.setup_id] });
      setEditing(false);
      toast.success("Version renamed");
    }
  });

  const paramCount = Object.keys(version.parameters || {}).length;
  const fmtDate = new Date(version.created_date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className={`rounded-xl border transition-all ${isComparing ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-primary">v{version.version_number}</span>
            </div>
            <div className="min-w-0">
              {editing ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="h-6 text-xs px-2 w-40"
                    autoFocus
                    onKeyDown={e => { if (e.key === "Enter") updateMutation.mutate({ version_name: editName }); if (e.key === "Escape") { setEditing(false); setEditName(version.version_name); } }}
                  />
                  <button onClick={() => updateMutation.mutate({ version_name: editName })} className="text-primary hover:opacity-70">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setEditing(false); setEditName(version.version_name); }} className="text-muted-foreground hover:opacity-70">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{version.version_name}</span>
                  {isLatest && <Badge className="text-[10px] h-4 px-1.5 bg-primary/20 text-primary border-0">Latest</Badge>}
                  <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-0.5">{fmtDate} · {paramCount} params</p>
              {version.notes && <p className="text-xs text-muted-foreground mt-1 italic">{version.notes}</p>}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleCompare(version)}
              className={`text-[10px] px-2 py-1 rounded-md border font-medium transition-all ${isComparing ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {isComparing ? "Comparing" : "Compare"}
            </button>
            {!isLatest && (
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Restore this version" onClick={() => onRestore(version)}>
                <RotateCcw className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-red-500 hover:bg-red-500/10" onClick={() => onDelete(version.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
            <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Comparison diff */}
        {compareWith && compareWith.id !== version.id && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Changes vs v{compareWith.version_number} ({compareWith.version_name})
            </p>
            <ParamDiff sim={sim} versionA={compareWith} versionB={version} />
          </div>
        )}

        {/* Expanded full params */}
        {expanded && !compareWith && (
          <div className="mt-3 pt-3 border-t border-border space-y-1.5">
            {SIM_SETUP_PARAMS[sim]?.map(group => {
              const vals = group.params.filter(p => version.parameters?.[p.key] !== undefined);
              if (!vals.length) return null;
              return (
                <div key={group.group}>
                  <p className="text-[10px] font-semibold text-primary mb-1">{group.group}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {vals.map(p => (
                      <div key={p.key} className="text-xs flex justify-between bg-muted/20 rounded px-2 py-1">
                        <span className="text-muted-foreground truncate mr-1">{p.label}</span>
                        <span className="font-mono shrink-0">
                          {typeof version.parameters[p.key] === "number" && version.parameters[p.key] % 1 !== 0
                            ? version.parameters[p.key].toFixed(1)
                            : version.parameters[p.key]}{p.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SetupVersionHistory({ setup }) {
  const queryClient = useQueryClient();
  const [versionName, setVersionName] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState(null);

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["setup-versions", setup?.id],
    queryFn: () => base44.entities.SetupVersion.filter({ setup_id: setup.id }, "-version_number"),
    enabled: !!setup?.id,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.SetupVersion.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setup-versions", setup.id] });
      setVersionName("");
      setVersionNotes("");
      setShowSaveForm(false);
      toast.success("Version saved!");
    },
    onError: () => toast.error("Failed to save version"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SetupVersion.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["setup-versions", setup.id] }),
  });

  const restoreMutation = useMutation({
    mutationFn: async (version) => {
      await base44.entities.SavedSetup.update(setup.id, { parameters: version.parameters });
      queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
    },
    onSuccess: () => toast.success("Setup restored to this version"),
    onError: () => toast.error("Failed to restore version"),
  });

  const handleSave = () => {
    if (!versionName.trim()) { toast.error("Give this version a name"); return; }
    const nextNum = versions.length > 0 ? Math.max(...versions.map(v => v.version_number || 0)) + 1 : 1;
    saveMutation.mutate({
      setup_id: setup.id,
      version_name: versionName.trim(),
      parameters: setup.parameters || {},
      notes: versionNotes.trim() || undefined,
      version_number: nextNum,
    });
  };

  const compareVersion = versions.find(v => v.id === compareVersionId);

  const toggleCompare = (version) => {
    setCompareVersionId(prev => prev === version.id ? null : version.id);
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            {versions.length === 0 ? "No versions saved yet." : `${versions.length} version${versions.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        <Button size="sm" className="font-heading text-xs tracking-wider" onClick={() => setShowSaveForm(!showSaveForm)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Save Version
        </Button>
      </div>

      {/* Save form */}
      {showSaveForm && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <p className="text-xs font-semibold text-primary">Snapshot current parameters</p>
          <Input
            placeholder='e.g. "Spa baseline", "High downforce", "After Pouhon fix"'
            value={versionName}
            onChange={e => setVersionName(e.target.value)}
            className="text-xs h-8"
            onKeyDown={e => e.key === "Enter" && handleSave()}
          />
          <Input
            placeholder="Optional notes..."
            value={versionNotes}
            onChange={e => setVersionNotes(e.target.value)}
            className="text-xs h-8"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="font-heading text-xs">
              {saveMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save Snapshot"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowSaveForm(false)} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {versions.length === 0 && (
        <div className="text-center py-10">
          <GitBranch className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium">No versions yet</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Save named snapshots of your setup as you tune — then compare any two versions to see what changed.
          </p>
        </div>
      )}

      {/* Compare hint */}
      {versions.length >= 2 && !compareVersion && (
        <p className="text-[10px] text-muted-foreground text-center">
          Select "Compare" on a version to see what changed relative to another.
        </p>
      )}

      {/* Version list */}
      <div className="space-y-2">
        {versions.map((version, index) => (
          <div key={version.id} className="group">
            <VersionCard
              version={version}
              sim={setup.sim_title}
              isLatest={index === 0}
              onDelete={(id) => deleteMutation.mutate(id)}
              onRestore={(v) => restoreMutation.mutate(v)}
              compareWith={compareVersion && compareVersion.id !== version.id ? compareVersion : null}
              onToggleCompare={toggleCompare}
              isComparing={compareVersionId === version.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}