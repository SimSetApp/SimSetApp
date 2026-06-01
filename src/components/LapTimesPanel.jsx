import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Trophy, Flag, AlertTriangle } from "lucide-react";

const LAP_NOTES = ["", "Out Lap", "In Lap", "Personal Best", "Traffic", "Incident", "SC / VSC", "Warm-Up"];

function parseLapTime(str) {
  // accepts m:ss.mmm or ss.mmm
  if (!str) return Infinity;
  const parts = str.split(":");
  if (parts.length === 2) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  return parseFloat(str);
}

function formatLapTime(secs) {
  if (!isFinite(secs)) return "–";
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(3).padStart(6, "0");
  return `${m}:${s}`;
}

export default function LapTimesPanel({ laps, onChange }) {
  const [newTime, setNewTime] = useState("");
  const [newNote, setNewNote] = useState("");

  const addLap = () => {
    if (!newTime.trim()) return;
    const updated = [...laps, { lap: laps.length + 1, time: newTime.trim(), note: newNote }];
    onChange(updated);
    setNewTime("");
    setNewNote("");
  };

  const removeLap = (idx) => onChange(laps.filter((_, i) => i !== idx));

  const validTimes = laps.filter(l => l.note !== "Out Lap" && l.note !== "In Lap").map(l => parseLapTime(l.time));
  const best = validTimes.length ? Math.min(...validTimes) : null;
  const avg = validTimes.length ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length : null;

  return (
    <div className="space-y-4">
      {/* Stats row */}
      {laps.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Best Lap", value: best ? formatLapTime(best) : "–", icon: Trophy, color: "text-amber-400" },
            { label: "Avg Lap", value: avg ? formatLapTime(avg) : "–", icon: Flag, color: "text-blue-400" },
            { label: "Total Laps", value: laps.length, icon: AlertTriangle, color: "text-primary" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl bg-secondary border border-border p-3 text-center">
              <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${color}`} />
              <div className={`text-sm font-bold font-display ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Lap list */}
      {laps.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-2">
            <span className="col-span-2">Lap</span>
            <span className="col-span-5">Time</span>
            <span className="col-span-4">Note</span>
            <span className="col-span-1"></span>
          </div>
          <div className="divide-y divide-border max-h-64 overflow-y-auto">
            {laps.map((lap, idx) => {
              const secs = parseLapTime(lap.time);
              const isBest = best && Math.abs(secs - best) < 0.001 && lap.note !== "Out Lap" && lap.note !== "In Lap";
              return (
                <div key={idx} className={`grid grid-cols-12 items-center px-3 py-2 text-sm ${isBest ? "bg-amber-400/5" : ""}`}>
                  <span className="col-span-2 text-muted-foreground font-mono">{lap.lap}</span>
                  <span className={`col-span-5 font-mono font-medium ${isBest ? "text-amber-400" : ""}`}>
                    {lap.time} {isBest && <Trophy className="inline w-3 h-3 ml-1" />}
                  </span>
                  <span className="col-span-4 text-xs text-muted-foreground">{lap.note || "–"}</span>
                  <button onClick={() => removeLap(idx)} className="col-span-1 flex justify-end">
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add lap */}
      <div className="flex gap-2">
        <Input
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
          placeholder="1:32.456"
          className="bg-secondary font-mono w-32 shrink-0"
          onKeyDown={e => e.key === "Enter" && addLap()}
        />
        <select
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          className="flex-1 bg-secondary border border-border rounded-lg px-3 text-sm text-foreground"
        >
          {LAP_NOTES.map(n => <option key={n} value={n}>{n || "No note"}</option>)}
        </select>
        <Button size="sm" onClick={addLap} disabled={!newTime.trim()}>
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Format: m:ss.mmm (e.g. 1:32.456) or ss.mmm</p>
    </div>
  );
}