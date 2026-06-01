import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Wrench } from "lucide-react";

const COMPOUNDS = ["Dry - Hard", "Dry - Medium", "Dry - Soft", "Wet - Inter", "Wet - Full", "Racing Soft", "Racing Hard"];

const emptyStop = { lap: "", compound: "Dry - Medium", fuel_added: "", duration_secs: "", tyre_pressures: "", notes: "" };

export default function PitStrategyPanel({ stops, onChange }) {
  const [form, setForm] = useState({ ...emptyStop });

  const add = () => {
    if (!form.lap) return;
    onChange([...stops, { ...form, id: Date.now() }]);
    setForm({ ...emptyStop });
  };

  const remove = (idx) => onChange(stops.filter((_, i) => i !== idx));

  return (
    <div className="space-y-4">
      {stops.length > 0 && (
        <div className="space-y-2">
          {stops.map((stop, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-secondary p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-3 h-3 text-primary" />
                  </div>
                  <span className="font-heading text-xs font-semibold tracking-wide">Stop {idx + 1} — Lap {stop.lap}</span>
                </div>
                <button onClick={() => remove(idx)}>
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">{stop.compound}</Badge>
                {stop.fuel_added && <Badge variant="outline" className="text-xs">+{stop.fuel_added}L fuel</Badge>}
                {stop.duration_secs && <Badge variant="outline" className="text-xs">{stop.duration_secs}s stop</Badge>}
                {stop.tyre_pressures && <Badge variant="outline" className="text-xs">P: {stop.tyre_pressures}</Badge>}
              </div>
              {stop.notes && <p className="text-xs text-muted-foreground mt-1">{stop.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add stop form */}
      <div className="rounded-xl border border-border border-dashed p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Add Pit Stop</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Pit Lap *</label>
            <Input value={form.lap} onChange={e => setForm(f => ({ ...f, lap: e.target.value }))}
              placeholder="e.g. 24" className="bg-secondary mt-1 h-9" type="number" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Stop Duration (s)</label>
            <Input value={form.duration_secs} onChange={e => setForm(f => ({ ...f, duration_secs: e.target.value }))}
              placeholder="e.g. 28" className="bg-secondary mt-1 h-9" type="number" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Compound</label>
            <select value={form.compound} onChange={e => setForm(f => ({ ...f, compound: e.target.value }))}
              className="w-full bg-secondary border border-border rounded-lg px-3 h-9 text-sm text-foreground mt-1">
              {COMPOUNDS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Fuel Added (L)</label>
            <Input value={form.fuel_added} onChange={e => setForm(f => ({ ...f, fuel_added: e.target.value }))}
              placeholder="e.g. 55" className="bg-secondary mt-1 h-9" type="number" />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Tyre Pressures Set</label>
          <Input value={form.tyre_pressures} onChange={e => setForm(f => ({ ...f, tyre_pressures: e.target.value }))}
            placeholder="e.g. 27.0F / 26.5R" className="bg-secondary mt-1 h-9" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Notes</label>
          <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Any issues, driver feedback..." className="bg-secondary mt-1 h-9" />
        </div>
        <Button size="sm" onClick={add} disabled={!form.lap} className="w-full">
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Pit Stop
        </Button>
      </div>
    </div>
  );
}