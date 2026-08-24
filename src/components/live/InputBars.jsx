import React from "react";

function PedalBar({ label, value, color }) {
  const v = Math.max(0, Math.min(1, value || 0));
  return (
    <div>
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="tabular-nums">{Math.round(v * 100)}%</span>
      </div>
      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-[width] duration-75`} style={{ width: `${v * 100}%` }} />
      </div>
    </div>
  );
}

export default function InputBars({ throttle, brake, steer }) {
  const s = Math.max(-1, Math.min(1, steer || 0));
  const steerPct = Math.abs(s) * 50;
  const steerLeft = s < 0 ? 50 - steerPct : 50;
  return (
    <div className="space-y-2.5">
      <PedalBar label="Throttle" value={throttle} color="bg-green-500" />
      <PedalBar label="Brake" value={brake} color="bg-red-500" />
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Steer</span>
          <span className="tabular-nums">{s > 0 ? "R" : s < 0 ? "L" : "•"} {Math.round(Math.abs(s) * 100)}%</span>
        </div>
        <div className="relative h-3 rounded-full bg-secondary overflow-hidden">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border z-10" />
          <div
            className="absolute top-0 bottom-0 bg-blue-500 rounded-full"
            style={{ left: `${steerLeft}%`, width: `${steerPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}