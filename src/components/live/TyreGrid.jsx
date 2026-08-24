import React from "react";

const POS = [
  { key: "fl", label: "FL" },
  { key: "fr", label: "FR" },
  { key: "rl", label: "RL" },
  { key: "rr", label: "RR" },
];

function tempColor(t) {
  if (t == null) return "text-muted-foreground";
  if (t < 70) return "text-sky-400";
  if (t < 80) return "text-green-400";
  if (t < 95) return "text-amber-400";
  return "text-red-400";
}

function wearColor(w) {
  if (w == null) return "bg-muted";
  if (w < 30) return "bg-green-500";
  if (w < 60) return "bg-amber-500";
  return "bg-red-500";
}

export default function TyreGrid({ tyres }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {POS.map((p) => {
        const t = tyres?.[p.key] || {};
        return (
          <div key={p.key} className="rounded-lg border border-border bg-secondary/40 p-2 text-center">
            <div className="text-[10px] text-muted-foreground font-semibold tracking-wider">{p.label}</div>
            <div className={`text-xl font-bold tabular-nums font-digi ${tempColor(t.temp_c)}`}>
              {t.temp_c != null ? `${Math.round(t.temp_c)}°` : "--"}
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${wearColor(t.wear_pct)}`}
                style={{ width: `${Math.min(100, t.wear_pct || 0)}%` }}
              />
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              {t.wear_pct != null ? `${Math.round(t.wear_pct)}%` : "--"}
            </div>
          </div>
        );
      })}
    </div>
  );
}