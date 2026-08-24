import React from "react";
import { Timer, TrendingUp, Flag, Trophy } from "lucide-react";

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export default function LapTiming({ lap, totalLaps, current, last, best, delta, position, incidents }) {
  const deltaTone = delta == null ? "text-muted-foreground" : delta <= 0 ? "text-green-400" : "text-red-400";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Lap</div>
          <div className="text-4xl font-bold tabular-nums font-digi leading-none">
            {lap ?? 0}<span className="text-muted-foreground text-xl"> / {totalLaps || "—"}</span>
          </div>
        </div>
        {position != null && position > 0 && (
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Pos</div>
            <div className="text-2xl font-bold tabular-nums font-digi leading-none">P{position}</div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Current</div>
            <div className="text-base font-bold tabular-nums font-digi">{fmt(current)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Last</div>
            <div className="text-base font-bold tabular-nums font-digi">{fmt(last)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Best</div>
            <div className="text-base font-bold tabular-nums font-digi text-primary">{fmt(best)}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Delta</div>
            <div className={`text-base font-bold tabular-nums font-digi ${deltaTone}`}>
              {delta == null ? "--.---" : `${delta <= 0 ? "" : "+"}${delta.toFixed(3)}`}
            </div>
          </div>
        </div>
      </div>
      {incidents > 0 && (
        <div className="mt-3 text-xs text-red-400">⚠ {incidents} incident point{incidents > 1 ? "s" : ""}</div>
      )}
    </div>
  );
}