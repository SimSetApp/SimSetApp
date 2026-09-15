import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useFlash } from "@/lib/flashContext";
import { fmt, fmtDuration } from "@/lib/formatTime";

export const SEM = {
  green: "#00ff66", yellow: "#ffe600", red: "#ff1a1a",
  blue: "#3b82f6", amber: "#ff9800", label: "#9a9a9a",
  text: "#ffffff", panel: "#0a0a0a", panelEdge: "#1a1a1a", dim: "#2a2a2a",
  border: "#262626", track: "#161616", warn: "#ff9800",
  absColor: "#4a9eff",
};

export const WIDGET_DEFS = [
  { type: "rpmGear", label: "RPM + Gear", w: 400, h: 280 },
  { type: "rpmBar", label: "RPM Bar", w: 960, h: 32 },
  { type: "shiftLights", label: "Shift Lights", w: 960, h: 36 },
  { type: "speed", label: "Speed", w: 300, h: 200 },
  { type: "tyres", label: "Tyres", w: 300, h: 260 },
  { type: "fuel", label: "Fuel / Strategy", w: 300, h: 180 },
  { type: "gear", label: "Gear", w: 300, h: 200 },
  { type: "delta", label: "Delta / Time", w: 320, h: 150 },
  { type: "laps", label: "Laps / Time", w: 320, h: 140 },
  { type: "cars", label: "Cars Ahead / Behind", w: 320, h: 220 },
  { type: "inputs", label: "Inputs", w: 300, h: 170 },
  { type: "status", label: "Status Bar", w: 960, h: 48 },
];

export const WIDGET_DEF_MAP = new Map(WIDGET_DEFS.map((d) => [d.type, d]));

/* ── Visual helpers (shared across all widgets) ── */

// Symmetric thermal gradient: blue=too cold (grip warning) → green=optimal → red=too hot.
// Both extremes read as problems, matching real racing displays.
const TEMP_STOPS = [
  [60, 220, 85, 52],   // deep blue — cold warning
  [75, 190, 75, 48],   // blue-teal — warming
  [85, 140, 75, 42],   // vivid green — optimal
  [95, 55, 90, 50],    // yellow — getting hot
  [105, 25, 90, 50],   // orange — hot
  [115, 0, 85, 48],    // controlled red — too hot
];
export function tempGradient(t, T) {
  if (t == null) return T ? T.label : "#6a6a6a";
  if (t <= TEMP_STOPS[0][0]) { const s = TEMP_STOPS[0]; return `hsl(${s[1]}, ${s[2]}%, ${s[3]}%)`; }
  if (t >= TEMP_STOPS[TEMP_STOPS.length - 1][0]) { const s = TEMP_STOPS[TEMP_STOPS.length - 1]; return `hsl(${s[1]}, ${s[2]}%, ${s[3]}%)`; }
  for (let i = 0; i < TEMP_STOPS.length - 1; i++) {
    if (t >= TEMP_STOPS[i][0] && t < TEMP_STOPS[i + 1][0]) {
      const f = (t - TEMP_STOPS[i][0]) / (TEMP_STOPS[i + 1][0] - TEMP_STOPS[i][0]);
      const h = TEMP_STOPS[i][1] + (TEMP_STOPS[i + 1][1] - TEMP_STOPS[i][1]) * f;
      const s = TEMP_STOPS[i][2] + (TEMP_STOPS[i + 1][2] - TEMP_STOPS[i][2]) * f;
      const l = TEMP_STOPS[i][3] + (TEMP_STOPS[i + 1][3] - TEMP_STOPS[i][3]) * f;
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  return "hsl(0, 100%, 50%)";
}

// Panel bevel: no-op — unified surface has no per-widget chrome.
// Kept as an export so existing callers don't break; returns "none".
export function panelBevel(_theme) {
  return "none";
}

// Inner bevel for sub-panels: stamped/recessed glass inset (tyre cells, sector cells, bar tracks)
export function innerBevel(T) {
  return `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${T.panelEdge}88, inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.25)`;
}

// Soft LED segment style: radial-gradient fill + layered glow (physical LED look)
function ledSeg(col, on) {
  if (!on) return { background: "rgba(0,0,0,0.6)", boxShadow: "inset 0 0 3px rgba(0,0,0,0.9), inset 0 1px 1px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)", opacity: 1 };
  return {
    background: `radial-gradient(circle, ${col} 0%, ${col} 65%, ${col}88 100%)`,
    boxShadow: `0 0 3px ${col}, 0 0 6px ${col}aa, 0 0 12px ${col}44, inset 0 0 2px rgba(255,255,255,0.7)`,
    opacity: 1,
  };
}

function wearColor(w, T) {
  if (w == null) return T.label;
  if (w < 25) return T.ledGreen;
  if (w < 50) return T.ledYellow;
  if (w < 75) return T.amber;
  return T.ledRed;
}

// Gear label: -1 = R, 0 = N, >0 = gear number
function gearLabel(g) {
  if (g < 0) return "R";
  if (g === 0) return "N";
  return g;
}

// Tiny trend chevron — unobtrusive direction indicator next to a value.
export function TrendArrow({ dir, color = "#8a8a8a", size = "0.65em" }) {
  if (!dir || dir === "flat") return null;
  return (
    <svg viewBox="0 0 10 10" style={{ width: size, height: size, display: "inline-block", marginLeft: "0.15em", color }} aria-hidden>
      {dir === "up" && <path d="M5 1 L9 8 L1 8 Z" fill="currentColor" />}
      {dir === "down" && <path d="M5 9 L1 2 L9 2 Z" fill="currentColor" />}
    </svg>
  );
}

function Row({ label, value, lcolor, vcolor }) {
  return (
    <div className="flex justify-between items-baseline" style={{ fontSize: "1em" }}>
      <span className="font-lcd" style={{ color: lcolor }}>{label}</span>
      <span className="font-lcd tabular-nums" style={{ color: vcolor }}>{value}</span>
    </div>
  );
}
function Bar({ label, value, color, T }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between" style={{ fontSize: "0.9em", color: T.label }}>
        <span className="font-lcd">{label}</span><span className="font-lcd tabular-nums">{Math.round(v * 100)}%</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "0.65em", background: T.track, boxShadow: innerBevel(T) }}>
        <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}aa)`, boxShadow: v > 0.05 ? `0 0 8px ${color}aa, 0 0 4px ${color}, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 1px rgba(0,0,0,0.2)` : "none" }} />
      </div>
    </div>
  );
}
function Title({ children, T }) {
  return <div className="font-digi" style={{ fontSize: "0.8em", color: T.label, letterSpacing: "0.14em" }}>{children}</div>;
}

/* ── Integrated RPM bar + gear + speed (GT3 Pro / Endurance) ── */
// Isolated LED bar — the only part of RpmGear that consumes flash, so the
// 5Hz toggle re-renders just these segments, not the entire large widget.
function RpmGearBar({ rpmPct, shift, segs, barH, w, T }) {
  const flash = useFlash();
  const flashOn = shift && flash;
  const gap = 2;
  const ledSize = Math.min(barH, (w - (segs - 1) * gap) / segs);
  return (
    <div className="w-full flex justify-between items-center" style={{ height: barH }}>
      {Array.from({ length: segs }).map((_, i) => {
        const frac = i / segs;
        const lit = rpmPct >= frac + 1 / segs * 0.5;
        const col = frac < 0.6 ? T.ledGreen : frac < 0.82 ? T.ledYellow : T.ledRed;
        const on = lit && (!shift || flashOn);
        return <div key={i} className="rounded-full" style={{ width: ledSize, height: ledSize, flexShrink: 0, ...ledSeg(col, on) }} />;
      })}
    </div>
  );
}
function ShiftPrompt({ T, fs }) {
  const flash = useFlash();
  return (
    <div className="font-digi font-bold tracking-widest leading-none" style={{ fontSize: fs, color: flash ? T.ledRed : T.dim }}>SHIFT</div>
  );
}
function RpmGear({ data, w, h, T, units }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const limiter = rpmPct >= 0.99;
  const segs = 26;
  const barH = Math.max(14, h * 0.09);
  const gearFs = Math.max(48, Math.min(h * 0.42, w * 0.38, 128));
  const speedFs = Math.max(16, h * 0.11);
  const rpmFs = Math.max(11, h * 0.07);
  const dispSpeed = units.speed === "mph" ? Math.round((data.speed_kmh || 0) * 0.621371) : Math.round(data.speed_kmh || 0);
  const gearColor = shift ? "#ffffff" : data.gear > 0 ? T.text : T.amber;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-2">
      <RpmGearBar rpmPct={rpmPct} shift={shift} segs={segs} barH={barH} w={w} T={T} />
      <div className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: rpmFs, color: limiter ? T.ledRed : shift ? T.ledYellow : T.label, letterSpacing: "0.05em" }}>
        {Math.round(data.rpm || 0)}{limiter && <span className="ml-1.5">LIMITER</span>}
      </div>
      {shift && <ShiftPrompt T={T} fs={Math.max(10, h * 0.055)} />}
      <div className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: gearFs, color: gearColor }}>
        {gearLabel(data.gear)}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: speedFs * 1.8, color: T.text }}>{dispSpeed}</span>
        <span className="font-digi" style={{ fontSize: speedFs, color: T.label, letterSpacing: "0.2em" }}>
          {units.speed === "mph" ? "MPH" : "KM/H"}
        </span>
      </div>
    </div>
  );
}

/* ── Slim standalone RPM bar (Formula Halo) ── */
// Isolated segments — only these consume flash, not the parent wrapper.
function RpmBarSegments({ rpmPct, shift, segs, w, T }) {
  const flash = useFlash();
  const flashOn = shift && flash;
  const gap = 1.5;
  const ledSize = Math.min(20, (w - (segs - 1) * gap) / segs);
  return (
    <div className="w-full h-full flex items-center justify-between px-1">
      {Array.from({ length: segs }).map((_, i) => {
        const frac = i / segs;
        const lit = rpmPct >= frac + 1 / segs * 0.5;
        const col = frac < 0.6 ? T.ledGreen : frac < 0.82 ? T.ledYellow : T.ledRed;
        const on = lit && (!shift || flashOn);
        return <div key={i} className="rounded-full" style={{ width: ledSize, height: ledSize, flexShrink: 0, ...ledSeg(col, on) }} />;
      })}
    </div>
  );
}
function RpmBar({ data, w, h, T }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const segs = 34;
  return <RpmBarSegments rpmPct={rpmPct} shift={shift} segs={segs} w={w} T={T} />;
}

function ShiftLights({ data, T, shape }) {
  const flash = useFlash();
  const maxRpm = data.max_rpm || 8000;
  const shiftRpm = 0.925 * maxRpm;
  const lit = Math.max(0, Math.min(15, Math.round(((data.rpm || 0) - 2000) / (shiftRpm - 2000) * 15)));
  const atRedline = (data.rpm || 0) >= shiftRpm;
  const flashOn = atRedline && flash;
  const segColor = (i) => (i < 5 ? T.ledGreen : i < 10 ? T.ledYellow : T.ledRed);
  const on = (i) => i < lit && (!atRedline || flashOn);
  return (
    <div className="w-full h-full flex items-center justify-between px-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="rounded-full aspect-square" style={{ ...ledSeg(segColor(i), on(i)), height: "100%" }} />
      ))}
    </div>
  );
}

function Speed({ data, w, h, T, units }) {
  const v = units.speed === "mph" ? Math.round((data.speed_kmh || 0) * 0.621371) : Math.round(data.speed_kmh || 0);
  const fs = Math.max(28, Math.min(h * 0.5, w * 0.28));
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="font-digi font-bold tabular-nums leading-none" style={{
        fontSize: fs, color: T.text,
      }}>{v}</div>
      <div className="font-digi" style={{ fontSize: Math.max(9, h * 0.07), color: T.label, letterSpacing: "0.25em" }}>
        {units.speed === "mph" ? "MPH" : "KM/H"}
      </div>
    </div>
  );
}

function Tyres({ data, w, h, T, units, caps, trends }) {
  const tyres = data.tyres || {};
  const press = (p) => {
    if (p == null) return "--";
    return units.pressure === "bar" ? (p * 0.0689476).toFixed(1) : p.toFixed(1);
  };
  const tempFs = Math.max(13, Math.min(h * 0.15, w * 0.11));
  const has3Point = caps?.tyre_3point;
  const hasBrake = caps?.brake_temps;
  const compound = data.tyre_compound;

  // 3-point thermal view (sim-native only): I/M/O strip + brake disc temp
  if (has3Point) {
    const renderCell = (k) => {
      const t = tyres[k.toLowerCase()] || {};
      const ti = t.temp_i, tm = t.temp_m, to = t.temp_o;
      const core = t.temp_c ?? (ti != null && tm != null && to != null ? ti * 0.25 + tm * 0.5 + to * 0.25 : null);
      const tc = tempGradient(core, T);
      const brake = t.brake_temp;
      const bc = brake != null ? (brake > 600 ? T.ledRed : brake > 400 ? T.ledYellow : T.ledGreen) : T.label;
      return (
        <div key={k} className="flex flex-col gap-0.5 justify-center" style={{
          background: "transparent",
        }}>
          <div className="flex justify-between items-baseline">
            <span className="font-digi" style={{ fontSize: Math.max(9, tempFs * 0.4), color: T.label, letterSpacing: "0.1em" }}>{k}</span>
            <span className="font-digi font-bold tabular-nums leading-none flex items-center" style={{ fontSize: tempFs * 0.72, color: tc }}>{core != null ? Math.round(core) : "--"}°<TrendArrow dir={trends?.[`tyres.${k.toLowerCase()}.temp_c`]} color={tc} /></span>
          </div>
          <div className="rounded overflow-hidden relative" style={{ height: Math.max(8, tempFs * 0.4), background: ti != null && tm != null && to != null ? `linear-gradient(90deg, ${tempGradient(ti, T)}, ${tempGradient(tm, T)}, ${tempGradient(to, T)})` : "rgba(255,255,255,0.08)", boxShadow: ti != null ? `0 0 6px ${tc}66, inset 0 0 3px rgba(255,255,255,0.25)` : "none" }}>
            <span className="absolute left-1 top-1/2 -translate-y-1/2 font-digi" style={{ fontSize: Math.max(8, tempFs * 0.3), color: "rgba(255,255,255,0.7)" }}>I</span>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 font-digi" style={{ fontSize: Math.max(8, tempFs * 0.3), color: "rgba(255,255,255,0.7)" }}>O</span>
          </div>
          <div className="flex justify-between font-lcd" style={{ fontSize: Math.max(8, tempFs * 0.32), color: T.label }}>
            {hasBrake && <span>BRK <span style={{ color: bc }} className="tabular-nums">{brake != null ? Math.round(brake) : "--"}°</span></span>}
            <span>PRS <span style={{ color: T.text }} className="tabular-nums">{press(t.pressure_psi)}</span></span>
          </div>
        </div>
      );
    };
    return (
      <div className="w-full h-full flex flex-col gap-1 p-1.5">
        <div className="flex gap-6 flex-1 min-h-0">{["FL", "FR"].map(renderCell)}</div>
        {compound && <div className="font-digi text-center" style={{ fontSize: Math.max(8, tempFs * 0.28), color: T.label, letterSpacing: "0.15em" }}>{compound}</div>}
        <div className="flex gap-6 flex-1 min-h-0">{["RL", "RR"].map(renderCell)}</div>
      </div>
    );
  }

  // Single core-temp view
  const showDetail = h > 150;
  const renderCell = (k) => {
    const t = tyres[k.toLowerCase()];
    const temp = t?.temp_c, pressVal = t?.pressure_psi, wear = t?.wear_pct;
    const tc = tempGradient(temp, T);
    return (
      <div key={k} className="flex flex-col justify-center" style={{
        background: "transparent",
      }}>
        <div className="font-digi" style={{ fontSize: Math.max(9, tempFs * 0.38), color: T.label, letterSpacing: "0.1em" }}>{k}</div>
        <div className="font-digi font-bold tabular-nums leading-none flex items-center" style={{ fontSize: tempFs, color: tc }}>{temp != null ? Math.round(temp) : "--"}°<TrendArrow dir={trends?.[`tyres.${k.toLowerCase()}.temp_c`]} color={tc} /></div>
        {showDetail && (
          <>
            <div className="font-lcd" style={{ fontSize: Math.max(8, tempFs * 0.36), color: T.label }}>PRS <span style={{ color: T.text }} className="tabular-nums">{press(pressVal)}</span></div>
            <div className="font-lcd" style={{ fontSize: Math.max(8, tempFs * 0.36), color: T.label }}>WR <span style={{ color: wearColor(wear, T) }} className="tabular-nums">{wear != null ? Math.round(wear) : "--"}%</span></div>
          </>
        )}
      </div>
    );
  };
  return (
    <div className="w-full h-full flex flex-col gap-1 p-1.5">
      <div className="flex gap-6 flex-1 min-h-0">{["FL", "FR"].map(renderCell)}</div>
      {compound && <div className="font-digi text-center" style={{ fontSize: Math.max(8, tempFs * 0.28), color: T.label, letterSpacing: "0.15em" }}>{compound}</div>}
      <div className="flex gap-6 flex-1 min-h-0">{["RL", "RR"].map(renderCell)}</div>
    </div>
  );
}

function Fuel({ data, w, h, T, trends }) {
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;
  const hasMax = data.fuel_max_litres != null;
  const maxFuel = data.fuel_max_litres || 100;
  const pct = hasMax ? Math.max(0, Math.min(100, ((data.fuel_litres || 0) / maxFuel) * 100)) : null;
  const fuelCol = lapsLeft != null
    ? (lapsLeft > 5 ? T.ledGreen : lapsLeft > 2 ? T.ledYellow : T.ledRed)
    : pct != null
      ? (pct > 30 ? T.ledGreen : pct > 12 ? T.ledYellow : T.ledRed)
      : T.label;
  return (
    <div className="w-full h-full p-2 flex gap-2">
      {pct != null && (
        <div className="rounded-full overflow-hidden relative shrink-0" style={{ width: "1.2em", background: T.track, boxShadow: innerBevel(T) }}>
          <div className="absolute bottom-0 w-full rounded-full" style={{ height: `${pct}%`, background: `linear-gradient(0deg, ${fuelCol}, ${fuelCol}aa)`, boxShadow: pct > 1 ? `0 0 8px ${fuelCol}aa, inset 0 1px 0 rgba(255,255,255,0.4)` : "none" }} />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-0.5 justify-center min-w-0">
        <div className="flex justify-between items-baseline">
          <Title T={T}>FUEL</Title>
          {pct != null && <span className="font-digi font-bold tabular-nums flex items-center" style={{ fontSize: "1.05em", color: fuelCol }}>{pct.toFixed(0)}%<TrendArrow dir={trends?.fuel_litres} color={fuelCol} /></span>}
        </div>
        <Row label="REMAINING" value={`${(data.fuel_litres ?? 0).toFixed(1)}L`} lcolor={T.label} vcolor={T.text} />
        <Row label="FUEL REQ" value={data.fuel_required != null ? `${data.fuel_required.toFixed(1)}L` : "--"} lcolor={T.label} vcolor={T.text} />
        <Row label="AVG LAP" value={fmt(data.avg_lap_time)} lcolor={T.label} vcolor={T.text} />
        <Row label="LAST LAP" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
        {lapsLeft != null && <Row label="LAPS LEFT" value={lapsLeft.toFixed(1)} lcolor={T.label} vcolor={fuelCol} />}
      </div>
    </div>
  );
}

function Gear({ data, w, h, T, shape }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  // Cap gear numeral so the Formula Wheel 448px slot doesn't render a 168px giant
  const gearFs = Math.max(56, Math.min(h * 0.52, w * 0.48, 168));
  // Contrasting shift alert: white flash stands out from red/yellow RPM segments
  const gearColor = shift ? "#ffffff" : data.gear > 0 ? T.text : T.amber;
  const rpmFs = Math.max(10, h * 0.06);
  const numeral = (
    <div className="flex flex-col items-center relative z-10">
      <span className="font-digi font-bold tabular-nums" style={{ fontSize: gearFs, lineHeight: 0.8, color: gearColor }}>
        {gearLabel(data.gear)}
      </span>
      <span className="font-digi tabular-nums" style={{ fontSize: rpmFs, color: shift ? T.ledRed : T.label, letterSpacing: "0.05em" }}>
        {Math.round(data.rpm || 0)}
      </span>
    </div>
  );

  if (shape === "ring") {
    // 270° arc: light only the top arc, leaving the bottom 90° dark
    const arcSegs = 30;
    const startAng = -135;
    const spanAng = 270;
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: arcSegs }).map((_, i) => {
            const frac = i / arcSegs;
            const ang = (startAng + frac * spanAng) * Math.PI / 180;
            const x1 = 50 + 44 * Math.cos(ang);
            const y1 = 50 + 44 * Math.sin(ang);
            const x2 = 50 + 48 * Math.cos(ang);
            const y2 = 50 + 48 * Math.sin(ang);
            const lit = rpmPct >= frac + 1 / arcSegs * 0.5;
            const col = frac < 0.6 ? T.ledGreen : frac < 0.82 ? T.ledYellow : T.ledRed;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={lit ? col : T.dim} strokeWidth="2.2" strokeLinecap="round" />
            );
          })}
          <circle cx="50" cy="50" r="41" fill="none" stroke={T.panelEdge} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="37" fill="none" stroke={T.panelEdge} strokeWidth="0.5" opacity="0.5" />
        </svg>
        {numeral}
      </div>
    );
  }
  if (shape === "arc" || shape === "dial") {
    const arcCol = shift ? T.shiftColor : T.accent;
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <circle cx="50" cy="50" r="44" fill="none" stroke={T.track} strokeWidth="6" />
          <circle cx="50" cy="50" r="44" fill="none" stroke={arcCol} strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 44 * rpmPct} ${2 * Math.PI * 44}`}
            strokeLinecap="round" transform="rotate(-90 50 50)" />
          <circle cx="50" cy="50" r="38" fill="none" stroke={T.panelEdge} strokeWidth="0.5" opacity="0.6" />
        </svg>
        {numeral}
      </div>
    );
  }
  return <div className="w-full h-full flex items-center justify-center">{numeral}</div>;
}

function Delta({ data, w, h, T, caps, trends }) {
  const delta = data.lap_delta;
  const tone = delta == null ? T.label : delta <= 0 ? T.ledGreen : T.ledRed;
  const deltaFs = Math.max(18, Math.min(h * 0.32, w * 0.16));
  const hasSectors = caps?.sectors;
  const [bestFlash, setBestFlash] = useState(false);
  const prevBestRef = useRef(data.best_lap_time);
  useEffect(() => {
    if (data.best_lap_time != null && prevBestRef.current != null && data.best_lap_time < prevBestRef.current) {
      setBestFlash(true);
      const id = setTimeout(() => setBestFlash(false), 3000);
      prevBestRef.current = data.best_lap_time;
      return () => clearTimeout(id);
    }
    prevBestRef.current = data.best_lap_time;
  }, [data.best_lap_time]);

  // Sector deltas (sim-native only): show delta vs best/PB, not absolute time
  if (hasSectors) {
    const sectors = data.sector_times || [];
    const best = data.best_sectors || [];
    const pb = data.personal_best_sectors || [];
    const BEST = T.bestSector || "#00e5ff";
    const secColor = (i) => {
      const s = sectors[i];
      if (s == null) return T.label;
      if (best[i] != null && s <= best[i]) return BEST;
      if (pb[i] != null && s <= pb[i]) return T.ledGreen;
      return T.ledRed;
    };
    const secDelta = (i) => {
      const s = sectors[i];
      if (s == null) return null;
      if (best[i] != null) return s - best[i];
      if (pb[i] != null) return s - pb[i];
      return null;
    };
    const isNewBest = (i) => sectors[i] != null && best[i] != null && sectors[i] <= best[i];
    const secFs = Math.max(11, Math.min(h * 0.12, w * 0.07));
    return (
      <div className="w-full h-full p-2 flex flex-col">
        <div className="grid grid-cols-3 gap-1 mb-1">
          {["S1", "S2", "S3"].map((lbl, i) => {
            const c = secColor(i);
            const d = secDelta(i);
            const nb = isNewBest(i);
            return (
              <div key={lbl} className="text-center py-0.5 relative" style={{ background: "transparent" }}>
                <div className="font-digi" style={{ fontSize: Math.max(8, secFs * 0.5), color: T.label, letterSpacing: "0.1em" }}>{lbl}</div>
                <div className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: secFs, color: c }}>
                  {sectors[i] != null ? fmt(sectors[i]) : "--"}
                </div>
                {d != null && <div className="font-digi tabular-nums" style={{ fontSize: Math.max(7, secFs * 0.55), color: c, opacity: 0.7 }}>{d > 0 ? "+" : ""}{d.toFixed(2)}</div>}
                {nb && <span className="absolute -top-1 -right-1 font-digi" style={{ fontSize: 8, color: BEST }}>★</span>}
              </div>
            );
          })}
        </div>
        <Row label="LAST" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
        <Row label="BEST" value={fmt(data.best_lap_time)} lcolor={T.label} vcolor={bestFlash ? T.ledGreen : T.text} />
        {bestFlash && <div className="font-digi font-bold text-center" style={{ color: T.ledGreen, fontSize: Math.max(9, deltaFs * 0.2) }}>BEST LAP!</div>}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-digi" style={{ fontSize: Math.max(8, deltaFs * 0.22), color: T.label, letterSpacing: "0.15em" }}>DELTA</div>
          <div className="font-digi font-bold tabular-nums leading-none flex items-center" style={{
            fontSize: deltaFs, color: tone,
            transition: "color 200ms ease",
          }}>
            {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
            <TrendArrow dir={trends?.lap_delta} color={tone} />
          </div>
        </div>
      </div>
    );
  }

  // Single lap delta
  return (
    <div className="w-full h-full p-2 flex flex-col">
      <Row label="LAST" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="BEST" value={fmt(data.best_lap_time)} lcolor={T.label} vcolor={bestFlash ? T.ledGreen : T.text} />
      {bestFlash && <div className="font-digi font-bold text-center" style={{ color: T.ledGreen, fontSize: Math.max(9, deltaFs * 0.2) }}>BEST LAP!</div>}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="font-digi" style={{ fontSize: Math.max(8, deltaFs * 0.22), color: T.label, letterSpacing: "0.15em" }}>DELTA</div>
        <div className="font-digi font-bold tabular-nums leading-none flex items-center" style={{
          fontSize: deltaFs, color: tone,
          transition: "color 200ms ease",
        }}>
          {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
          <TrendArrow dir={trends?.lap_delta} color={tone} />
        </div>
      </div>
    </div>
  );
}

function Laps({ data, color, w, h, T }) {
  const big = h > 180;
  const curFs = Math.max(14, Math.min(h * 0.28, w * 0.11));
  const hasTimeRem = data.time_remaining != null;
  const lapType = data.lap_type;
  const lapTypeMeta = lapType === "OUT" ? { label: "OUT LAP", col: T.label } : lapType === "IN" ? { label: "IN LAP", col: T.amber } : lapType === "FLYING" ? { label: "FLYING", col: T.ledGreen } : null;
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1 justify-center">
      {big ? (
        <>
          <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} lcolor={T.label} vcolor={T.text} />
          {lapTypeMeta && <div className="font-digi font-bold tracking-widest" style={{ fontSize: Math.max(8, curFs * 0.2), color: lapTypeMeta.col }}>{lapTypeMeta.label}</div>}
          {hasTimeRem && <Row label="TIME REM" value={fmtDuration(data.time_remaining)} lcolor={T.label} vcolor={T.text} />}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="font-digi" style={{ fontSize: Math.max(8, curFs * 0.3), color: T.label, letterSpacing: "0.15em" }}>CURRENT LAP</div>
            <div className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: curFs, color }}>{fmt(data.current_lap_time)}</div>
          </div>
        </>
      ) : (
        <>
          <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} lcolor={T.label} vcolor={T.text} />
          {lapTypeMeta && <div className="font-digi font-bold tracking-widest" style={{ fontSize: Math.max(8, curFs * 0.2), color: lapTypeMeta.col }}>{lapTypeMeta.label}</div>}
          {hasTimeRem && <Row label="TIME REM" value={fmtDuration(data.time_remaining)} lcolor={T.label} vcolor={T.text} />}
          <Row label="CURRENT" value={fmt(data.current_lap_time)} lcolor={T.label} vcolor={color} />
        </>
      )}
    </div>
  );
}

function Cars({ data, w, h, T }) {
  // Show sign: '-' = gaining (green), '+' = losing (red) — matches real racing dashes
  const gap = (g) => (g == null ? "--.--" : `${g > 0 ? "+" : ""}${g.toFixed(2)}`);
  const fs = Math.max(14, Math.min(h * 0.22, w * 0.11));
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 justify-center">
      {data.position != null && (
        <Row label="YOUR POS" value={`P${data.position}`} lcolor={T.label} vcolor={T.text} />
      )}
      <div>
        <Title T={T}>CAR AHEAD</Title>
        <div className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: fs, color: T.ledGreen,
        }}>{gap(data.car_ahead_gap)}</div>
      </div>
      <div>
        <Title T={T}>CAR BEHIND</Title>
        <div className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: fs, color: T.ledRed,
        }}>{gap(data.car_behind_gap)}</div>
      </div>
    </div>
  );
}

function DialInputs({ data, T }) {
  const Gauge = ({ label, value, color }) => {
    // Needle sweeps the same top semicircle as the fill arc so they track together
    const ang = (Math.PI * (1 - value) - Math.PI / 2);
    const x2 = 50 + 40 * Math.cos(ang + Math.PI / 2);
    const y2 = 50 - 40 * Math.sin(ang + Math.PI / 2);
    const circ = Math.PI * 45;
    return (
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={T.track} strokeWidth="6" />
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${circ * (value ?? 0)} ${circ}`} strokeLinecap="round" />
            <line x1="50" y1="50" x2={x2} y2={y2} stroke={T.text} strokeWidth="2" />
            <circle cx="50" cy="50" r="2.5" fill={T.text} />
          </svg>
        </div>
        <div className="font-lcd" style={{ fontSize: "0.7em", color: T.label }}>{label} <span className="tabular-nums">{Math.round((value ?? 0) * 100)}%</span></div>
      </div>
    );
  };
  return (
    <div className="w-full h-full p-1 flex flex-col gap-1">
      <div className="flex gap-1 flex-1">
        <Gauge label="THR" value={data.throttle ?? 0} color={T.ledGreen} />
        <Gauge label="BRK" value={data.brake ?? 0} color={T.ledRed} />
      </div>
      <div>
        <div className="flex justify-between" style={{ fontSize: "0.8em", color: T.label }}><span className="font-lcd">STR</span><span className="font-lcd tabular-nums">{(data.steer ?? 0).toFixed(2)}</span></div>
        <div className="relative rounded-full" style={{ height: "0.6em", background: T.track, boxShadow: innerBevel(T) }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: T.panelEdge }} />
          <div className="absolute top-1/2 -translate-y-1/2 rounded-sm" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, width: "8px", height: "1.2em", background: T.accent, boxShadow: `0 0 6px ${T.accent}, inset 0 1px 0 rgba(255,255,255,0.4)` }} />
        </div>
      </div>
    </div>
  );
}

function Inputs({ data, color, w, h, T, shape }) {
  if (shape === "dial") return <DialInputs data={data} T={T} />;
  const showSteer = h > 100;
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 justify-center">
      <Bar label="THR" value={data.throttle} color={T.ledGreen} T={T} />
      <Bar label="BRK" value={data.brake} color={T.ledRed} T={T} />
      {showSteer && (
        <div>
          <div className="flex justify-between" style={{ fontSize: "0.9em", color: T.label }}><span className="font-lcd">STR</span><span className="font-lcd tabular-nums">{(data.steer ?? 0).toFixed(2)}</span></div>
          <div className="relative rounded-full" style={{ height: "0.7em", background: T.track, boxShadow: innerBevel(T) }}>
            <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: T.panelEdge }} />
            <div className="absolute top-1/2 -translate-y-1/2 rounded-sm" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, width: "8px", height: "1.3em", background: color || T.accent, boxShadow: `0 0 6px ${color || T.accent}, inset 0 1px 0 rgba(255,255,255,0.4)` }} />
          </div>
        </div>
      )}
    </div>
  );
}

function Status({ data, color, w, h, T }) {
  const items = [
    { l: "POS", v: `P${data.position || 0}`, c: null, fl: 2.2, fs: "1.4em", primary: true },
    { l: "INC", v: `${data.incidents || 0}`, c: T.ledYellow, fl: 1.2, fs: "1.1em", warning: true },
    { l: "BB", v: data.brake_bias != null ? data.brake_bias.toFixed(1) : "--", c: T.ledRed, fl: 1.0, fs: "1.0em" },
    { l: "BST", v: data.boost != null ? data.boost.toFixed(1) : "--", c: null, fl: 0.8, fs: "0.85em", setting: true },
    { l: "TC1", v: data.tc1 != null ? data.tc1 : "--", c: color, fl: 0.7, fs: "0.8em", setting: true },
    { l: "TC2", v: data.tc2 != null ? data.tc2 : "--", c: null, fl: 0.7, fs: "0.8em", setting: true },
    { l: "ABS", v: data.abs != null ? data.abs : "--", c: T.absColor || T.blue, fl: 0.7, fs: "0.8em", setting: true },
    { l: "MAP", v: data.map != null ? data.map : "--", c: T.ledGreen, fl: 0.7, fs: "0.8em", setting: true },
  ];
  return (
    <div className="w-full h-full flex gap-1 p-1">
      {items.map((it) => (
        <div key={it.l} className="flex flex-col items-center justify-center" style={{
          flex: it.fl,
          background: "transparent",
          border: it.primary ? `1px solid ${T.accent}44` : "none",
        }}>
          <div className="font-digi" style={{ fontSize: "0.65em", color: T.label, letterSpacing: "0.08em" }}>{it.l}</div>
          <div className="font-digi font-bold tabular-nums" style={{ fontSize: it.fs, color: it.c || T.text }}>{it.v}</div>
        </div>
      ))}
    </div>
  );
}

export function renderWidget(type, ctx) {
  const { data, color, w, h, theme, shape, units, caps, trends } = ctx;
  const T = { ...SEM, ...(theme || {}) };
  const sh = shape || "led";
  const u = units || { speed: "kmh", pressure: "psi" };
  switch (type) {
    case "rpmGear": return <RpmGear data={data} w={w} h={h} T={T} units={u} />;
    case "rpmBar": return <RpmBar data={data} w={w} h={h} T={T} />;
    case "shiftLights": return <ShiftLights data={data} T={T} shape={sh} />;
    case "speed": return <Speed data={data} w={w} h={h} T={T} units={u} />;
    case "tyres": return <Tyres data={data} w={w} h={h} T={T} units={u} caps={caps} trends={trends} />;
    case "fuel": return <Fuel data={data} w={w} h={h} T={T} trends={trends} />;
    case "gear": return <Gear data={data} w={w} h={h} T={T} shape={sh} />;
    case "delta": return <Delta data={data} w={w} h={h} T={T} caps={caps} trends={trends} />;
    case "laps": return <Laps data={data} color={color} w={w} h={h} T={T} />;
    case "cars": return <Cars data={data} w={w} h={h} T={T} />;
    case "inputs": return <Inputs data={data} color={color} w={w} h={h} T={T} shape={sh} />;
    case "status": return <Status data={data} color={color} w={w} h={h} T={T} />;
    default: return null;
  }
}