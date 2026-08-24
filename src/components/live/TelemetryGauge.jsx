import React from "react";

/**
 * Circular 270° gauge using a conic-gradient.
 */
export default function TelemetryGauge({ value, min = 0, max = 100, label, unit, size = 150, color = "hsl(var(--primary))" }) {
  const v = value == null ? min : Math.max(min, Math.min(max, value));
  const pct = max > min ? (v - min) / (max - min) : 0;
  const deg = pct * 270;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 225deg, ${color} ${deg}deg, hsl(var(--muted)) ${deg}deg 270deg, transparent 270deg 360deg)`,
          }}
        />
        <div className="absolute inset-[12px] rounded-full bg-card flex flex-col items-center justify-center shadow-inner">
          <span className="text-3xl font-bold tabular-nums font-digi leading-none">
            {Number.isInteger(v) ? v : v.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{unit}</span>
        </div>
      </div>
      <span className="mt-1 text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}