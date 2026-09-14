import { motion } from "framer-motion";

export const SEM = {
  green: "#00ff66", yellow: "#ffe600", red: "#ff1a1a",
  blue: "#3b82f6", amber: "#ff9800", label: "#9a9a9a",
  text: "#ffffff", panel: "#0a0a0a", panelEdge: "#1a1a1a", dim: "#2a2a2a",
  border: "#262626", track: "#161616", warn: "#ff9800",
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

/* ── Visual helpers (shared across all widgets) ── */

// Smooth thermal gradient: continuous HSL interpolation across semantic stops
// cold=blue → optimal=green → warm=yellow → hot=red → critical=deep red
const TEMP_STOPS = [
  [30, 217, 91, 60],
  [70, 180, 85, 52],
  [86, 150, 100, 50],
  [96, 54, 100, 52],
  [108, 0, 100, 55],
  [130, 0, 100, 42],
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

// Layered bloom: tight inner glow + mid halo + far scatter
export function bloom(color, intense = false) {
  return "none";
}

// Panel bevel: top inner highlight + border + bottom inner shadow (recessed glass)
export function panelBevel(theme) {
  return `inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 0 0 1px ${theme.panelEdge}55, inset 0 -1px 3px rgba(0,0,0,0.5), inset 0 2px 5px rgba(0,0,0,0.35)`;
}

// Inner bevel for sub-panels: stamped/recessed glass inset (tyre cells, sector cells, bar tracks)
export function innerBevel(T) {
  return `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${T.panelEdge}88, inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.25)`;
}

// Soft LED segment style: radial-gradient fill + layered glow (physical LED look)
function ledSeg(col, on) {
  if (!on) return { background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(0,0,0,0.3)", opacity: 0.35 };
  return {
    background: `radial-gradient(circle, ${col} 0%, ${col} 65%, ${col}88 100%)`,
    boxShadow: `0 0 3px ${col}, 0 0 6px ${col}aa, 0 0 12px ${col}44, inset 0 0 2px rgba(255,255,255,0.7)`,
    opacity: 1,
  };
}

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}
function wearColor(w, T) {
  if (w == null) return T.label;
  if (w < 40) return T.ledGreen;
  if (w < 70) return T.ledYellow;
  if (w < 90) return T.amber;
  return T.ledRed;
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
function RpmGear({ data, w, h, T, units }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const flashOn = shift && (Math.floor(Date.now() / 100) % 2 === 0);
  const segs = 26;
  const barH = Math.max(16, h * 0.11);
  const gearFs = Math.max(44, Math.min(h * 0.42, w * 0.4));
  const speedFs = Math.max(13, h * 0.1);
  const dispSpeed = units.speed === "mph" ? Math.round((data.speed_kmh || 0) * 0.621371) : Math.round(data.speed_kmh || 0);
  const gearColor = data.gear > 0 ? T.text : T.amber;
  const gearGlow = shift ? bloom(T.shiftColor, true) : bloom(gearColor);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-2">
      <div className="w-full flex gap-0.5" style={{ height: barH }}>
        {Array.from({ length: segs }).map((_, i) => {
          const frac = i / segs;
          const lit = rpmPct >= frac + 1 / segs * 0.5;
          const col = frac < 0.6 ? T.ledGreen : frac < 0.85 ? T.ledYellow : T.ledRed;
          const on = lit && (!shift || flashOn);
          return <div key={i} className="flex-1 rounded-sm" style={ledSeg(col, on)} />;
        })}
      </div>
      <motion.div
        key={data.gear}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="font-digi font-bold tabular-nums leading-none"
        style={{ fontSize: gearFs, color: gearColor, textShadow: gearGlow }}
      >
        {data.gear > 0 ? data.gear : "N"}
      </motion.div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: speedFs * 1.5, color: T.text, textShadow: bloom(T.text),
        }}>{dispSpeed}</span>
        <span className="font-digi" style={{ fontSize: speedFs, color: T.label, letterSpacing: "0.2em" }}>
          {units.speed === "mph" ? "MPH" : "KM/H"}
        </span>
      </div>
    </div>
  );
}

/* ── Slim standalone RPM bar (Formula Halo) ── */
function RpmBar({ data, w, h, T }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const flashOn = shift && (Math.floor(Date.now() / 100) % 2 === 0);
  const segs = 34;
  return (
    <div className="w-full h-full flex items-center gap-0.5 px-1">
      {Array.from({ length: segs }).map((_, i) => {
        const frac = i / segs;
        const lit = rpmPct >= frac + 1 / segs * 0.5;
        const col = frac < 0.6 ? T.ledGreen : frac < 0.85 ? T.ledYellow : T.ledRed;
        const on = lit && (!shift || flashOn);
        return <div key={i} className="flex-1 rounded-full" style={{ ...ledSeg(col, on), height: "78%" }} />;
      })}
    </div>
  );
}

function ShiftLights({ data, T, shape }) {
  const maxRpm = data.max_rpm || 8000;
  const shiftRpm = 0.925 * maxRpm;
  const lit = Math.max(0, Math.min(15, Math.round(((data.rpm || 0) - 2000) / (shiftRpm - 2000) * 15)));
  const atRedline = (data.rpm || 0) >= shiftRpm;
  const flashOn = atRedline && (Math.floor(Date.now() / 100) % 2 === 0);
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
        fontSize: fs, color: T.text, textShadow: bloom(T.text),
      }}>{v}</div>
      <div className="font-digi" style={{ fontSize: Math.max(9, h * 0.07), color: T.label, letterSpacing: "0.25em" }}>
        {units.speed === "mph" ? "MPH" : "KM/H"}
      </div>
    </div>
  );
}

function Tyres({ data, w, h, T, units, caps }) {
  const tyres = data.tyres || {};
  const press = (p) => {
    if (p == null) return "--";
    return units.pressure === "bar" ? (p * 0.0689476).toFixed(1) : p.toFixed(1);
  };
  const tempFs = Math.max(13, Math.min(h * 0.15, w * 0.11));
  const has3Point = caps?.tyre_3point;
  const hasBrake = caps?.brake_temps;

  // 3-point thermal view (sim-native only): I/M/O strip + brake disc temp
  if (has3Point) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-1 p-1.5">
        {["FL", "FR", "RL", "RR"].map((k) => {
          const t = tyres[k.toLowerCase()] || {};
          const ti = t.temp_i, tm = t.temp_m, to = t.temp_o;
          const core = t.temp_c ?? (ti != null && tm != null && to != null ? (ti + tm + to) / 3 : null);
          const tc = tempGradient(core, T);
          const brake = t.brake_temp;
          const bc = brake != null ? (brake > 600 ? T.ledRed : brake > 400 ? T.ledYellow : T.ledGreen) : T.label;
          return (
            <div key={k} className="rounded border p-1 flex flex-col gap-0.5 justify-center" style={{
              borderColor: T.panelEdge,
              background: `linear-gradient(135deg, ${tc}18, transparent)`,
              boxShadow: innerBevel(T),
            }}>
              <div className="flex justify-between items-baseline">
                <span className="font-digi" style={{ fontSize: Math.max(8, tempFs * 0.4), color: T.label, letterSpacing: "0.1em" }}>{k}</span>
                <span className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: tempFs * 0.72, color: tc, textShadow: bloom(tc) }}>{core != null ? Math.round(core) : "--"}°</span>
              </div>
              {/* 3-point thermal strip: smooth gradient Inner → Middle → Outer */}
              <div className="flex gap-0.5 rounded overflow-hidden" style={{ height: Math.max(6, tempFs * 0.4) }}>
                {[ti, tm, to].map((v, idx) => {
                  const c = tempGradient(v, T);
                  return (
                    <div key={idx} className="flex-1 rounded-sm" style={{
                      background: v != null ? `linear-gradient(90deg, ${c}, ${c}aa)` : "rgba(255,255,255,0.08)",
                      boxShadow: v != null ? `0 0 6px ${c}88, inset 0 0 3px rgba(255,255,255,0.3)` : "none",
                    }} />
                  );
                })}
              </div>
              <div className="flex justify-between font-lcd" style={{ fontSize: Math.max(6, tempFs * 0.32), color: T.label }}>
                {hasBrake && <span>BRK <span style={{ color: bc }} className="tabular-nums">{brake != null ? Math.round(brake) : "--"}°</span></span>}
                <span>PRS <span style={{ color: T.text }} className="tabular-nums">{press(t.pressure_psi)}</span></span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Single core-temp view
  const showDetail = h > 150;
  return (
    <div className="w-full h-full grid grid-cols-2 gap-1 p-1.5">
      {["FL", "FR", "RL", "RR"].map((k) => {
        const t = tyres[k.toLowerCase()];
        const temp = t?.temp_c, pressVal = t?.pressure_psi, wear = t?.wear_pct;
        const tc = tempGradient(temp, T);
        return (
          <div key={k} className="rounded border p-1 flex flex-col justify-center" style={{
            borderColor: T.panelEdge,
            background: `linear-gradient(135deg, ${tc}18, transparent)`,
            boxShadow: innerBevel(T),
          }}>
            <div className="font-digi" style={{ fontSize: Math.max(8, tempFs * 0.38), color: T.label, letterSpacing: "0.1em" }}>{k}</div>
            <div className="font-digi font-bold tabular-nums leading-none" style={{
              fontSize: tempFs, color: tc, textShadow: bloom(tc),
            }}>{temp != null ? Math.round(temp) : "--"}°</div>
            {showDetail && (
              <>
                <div className="font-lcd" style={{ fontSize: Math.max(7, tempFs * 0.36), color: T.label }}>PRS <span style={{ color: T.text }} className="tabular-nums">{press(pressVal)}</span></div>
                <div className="font-lcd" style={{ fontSize: Math.max(7, tempFs * 0.36), color: T.label }}>WR <span style={{ color: wearColor(wear, T) }} className="tabular-nums">{wear != null ? Math.round(wear) : "--"}%</span></div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Fuel({ data, w, h, T }) {
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;
  const showBars = h >= 140;
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1">
      <Title T={T}>FUEL / STRATEGY</Title>
      <Row label="REMAINING" value={`${(data.fuel_litres ?? 0).toFixed(1)}L`} lcolor={T.label} vcolor={T.text} />
      <Row label="FUEL REQ" value={data.fuel_required != null ? `${data.fuel_required.toFixed(1)}L` : "--"} lcolor={T.label} vcolor={T.text} />
      <Row label="AVG LAP" value={fmt(data.avg_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="LAST LAP" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="LAPS LEFT" value={lapsLeft != null ? lapsLeft.toFixed(1) : "--"} lcolor={T.label} vcolor={T.text} />
      {showBars && (
        <div className="flex flex-col gap-1 mt-0.5">
          <Bar label="THR" value={data.throttle} color={T.ledGreen} T={T} />
          <Bar label="BRK" value={data.brake} color={T.ledRed} T={T} />
        </div>
      )}
    </div>
  );
}

function Gear({ data, w, h, T, shape }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const gearFs = Math.max(48, Math.min(h * 0.42, w * 0.42));
  const gearColor = data.gear > 0 ? T.text : T.amber;
  const gearGlow = shift ? bloom(T.shiftColor, true) : bloom(gearColor);
  const numeral = (
    <motion.span
      key={data.gear}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className="font-digi font-bold tabular-nums relative z-10"
      style={{ fontSize: gearFs, lineHeight: 0.8, color: gearColor, textShadow: gearGlow }}
    >
      {data.gear > 0 ? data.gear : "N"}
    </motion.span>
  );

  if (shape === "ring") {
    const segs = 40;
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: segs }).map((_, i) => {
            const frac = i / segs;
            const lit = rpmPct >= frac;
            const ang = (frac * 360 - 90) * Math.PI / 180;
            const x1 = 50 + 44 * Math.cos(ang);
            const y1 = 50 + 44 * Math.sin(ang);
            const x2 = 50 + 48 * Math.cos(ang);
            const y2 = 50 + 48 * Math.sin(ang);
            const col = frac < 0.6 ? T.ledGreen : frac < 0.85 ? T.ledYellow : T.ledRed;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={lit ? col : T.dim} strokeWidth="2.2" strokeLinecap="round"
                style={lit ? { filter: `drop-shadow(0 0 3px ${col}) drop-shadow(0 0 6px ${col}88)` } : {}} />
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
            strokeLinecap="round" transform="rotate(-90 50 50)"
            style={{ filter: `drop-shadow(0 0 5px ${arcCol}) drop-shadow(0 0 10px ${arcCol}88)` }} />
          <circle cx="50" cy="50" r="38" fill="none" stroke={T.panelEdge} strokeWidth="0.5" opacity="0.6" />
        </svg>
        {numeral}
      </div>
    );
  }
  return <div className="w-full h-full flex items-center justify-center">{numeral}</div>;
}

function Delta({ data, w, h, T, caps }) {
  const delta = data.lap_delta;
  const tone = delta == null ? T.label : delta <= 0 ? T.ledGreen : T.ledRed;
  const deltaFs = Math.max(18, Math.min(h * 0.32, w * 0.16));
  const hasSectors = caps?.sectors;

  // Sector deltas (sim-native only): S1/S2/S3 coloured purple/green/red
  if (hasSectors) {
    const sectors = data.sector_times || [];
    const best = data.best_sectors || [];
    const pb = data.personal_best_sectors || [];
    const PURPLE = "#c084fc";
    const secColor = (i) => {
      const s = sectors[i];
      if (s == null) return T.label;
      if (best[i] != null && s <= best[i]) return PURPLE;
      if (pb[i] != null && s <= pb[i]) return T.ledGreen;
      return T.ledRed;
    };
    const secFs = Math.max(11, Math.min(h * 0.12, w * 0.07));
    return (
      <div className="w-full h-full p-2 flex flex-col">
        <div className="grid grid-cols-3 gap-1 mb-1">
          {["S1", "S2", "S3"].map((lbl, i) => {
            const c = secColor(i);
            return (
              <div key={lbl} className="rounded border text-center py-0.5" style={{ borderColor: `${c}55`, background: `${c}11`, boxShadow: innerBevel(T) }}>
                <div className="font-digi" style={{ fontSize: Math.max(7, secFs * 0.5), color: T.label, letterSpacing: "0.1em" }}>{lbl}</div>
                <div className="font-digi font-bold tabular-nums leading-none" style={{ fontSize: secFs, color: c, textShadow: bloom(c) }}>
                  {sectors[i] != null ? fmt(sectors[i]) : "--"}
                </div>
              </div>
            );
          })}
        </div>
        <Row label="LAST" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
        <Row label="BEST" value={fmt(data.best_lap_time)} lcolor={T.label} vcolor={T.text} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="font-digi" style={{ fontSize: Math.max(8, deltaFs * 0.22), color: T.label, letterSpacing: "0.15em" }}>DELTA</div>
          <div className="font-digi font-bold tabular-nums leading-none" style={{
            fontSize: deltaFs, color: tone, textShadow: bloom(tone),
            transition: "color 200ms ease",
          }}>
            {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
          </div>
        </div>
      </div>
    );
  }

  // Single lap delta
  return (
    <div className="w-full h-full p-2 flex flex-col">
      <Row label="LAST" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="BEST" value={fmt(data.best_lap_time)} lcolor={T.label} vcolor={T.text} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="font-digi" style={{ fontSize: Math.max(8, deltaFs * 0.22), color: T.label, letterSpacing: "0.15em" }}>DELTA</div>
        <div className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: deltaFs, color: tone, textShadow: bloom(tone),
          transition: "color 200ms ease",
        }}>
          {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}

function Laps({ data, color, w, h, T }) {
  const big = h > 180;
  const curFs = Math.max(14, Math.min(h * 0.28, w * 0.11));
  return (
    <div className="w-full h-full p-2 flex flex-col gap-1 justify-center">
      {big ? (
        <>
          <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} lcolor={T.label} vcolor={T.text} />
          <Row label="TIME REM" value={data.time_remaining != null ? `${Math.floor(data.time_remaining / 60)}:${String(Math.floor(data.time_remaining % 60)).padStart(2, "0")}` : "--:--"} lcolor={T.label} vcolor={T.text} />
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="font-digi" style={{ fontSize: Math.max(8, curFs * 0.3), color: T.label, letterSpacing: "0.15em" }}>CURRENT LAP</div>
            <motion.div
              key={data.lap}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="font-digi font-bold tabular-nums leading-none"
              style={{ fontSize: curFs, color, textShadow: bloom(color) }}
            >{fmt(data.current_lap_time)}</motion.div>
          </div>
        </>
      ) : (
        <>
          <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} lcolor={T.label} vcolor={T.text} />
          <Row label="TIME REM" value={data.time_remaining != null ? `${Math.floor(data.time_remaining / 60)}:${String(Math.floor(data.time_remaining % 60)).padStart(2, "0")}` : "--:--"} lcolor={T.label} vcolor={T.text} />
          <Row label="CURRENT" value={fmt(data.current_lap_time)} lcolor={T.label} vcolor={color} />
        </>
      )}
    </div>
  );
}

function Cars({ data, w, h, T }) {
  const gap = (g) => (g == null ? "--.---" : `${g > 0 ? "+" : ""}${g.toFixed(3)}`);
  const fs = Math.max(14, Math.min(h * 0.22, w * 0.11));
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 justify-center">
      <div>
        <Title T={T}>CAR AHEAD</Title>
        <div className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: fs, color: T.ledGreen, textShadow: bloom(T.ledGreen),
        }}>{gap(data.car_ahead_gap)}</div>
      </div>
      <div>
        <Title T={T}>CAR BEHIND</Title>
        <div className="font-digi font-bold tabular-nums leading-none" style={{
          fontSize: fs, color: T.ledRed, textShadow: bloom(T.ledRed),
        }}>{gap(data.car_behind_gap)}</div>
      </div>
    </div>
  );
}

function DialInputs({ data, T }) {
  const Gauge = ({ label, value, color }) => {
    const ang = ((value * 180 - 90) * Math.PI) / 180;
    const x2 = 50 + 40 * Math.sin(ang);
    const y2 = 50 - 40 * Math.cos(ang);
    const circ = Math.PI * 45;
    return (
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={T.track} strokeWidth="6" />
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${circ * value} ${circ}`} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color}66)` }} />
            <line x1="50" y1="50" x2={x2} y2={y2} stroke={T.text} strokeWidth="2" style={{ filter: `drop-shadow(0 0 2px ${T.text}88)` }} />
            <circle cx="50" cy="50" r="2.5" fill={T.text} style={{ filter: `drop-shadow(0 0 3px ${T.text}aa)` }} />
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
  // Weighted flex: POS gets priority, TC/ABS/MAP get smaller cells
  const items = [
    ["POS", `P${data.position || 0}`, null, 1.4],
    ["THR", `${Math.round((data.throttle || 0) * 100)}`, T.ledGreen, 1.0],
    ["BST", data.boost != null ? data.boost.toFixed(1) : "--", null, 1.0],
    ["INC", `${data.incidents || 0}`, T.ledYellow, 1.0],
    ["BBI", data.brake_bias != null ? data.brake_bias.toFixed(0) : "--", T.ledRed, 1.0],
    ["TC1", data.tc1 != null ? data.tc1 : "--", color, 0.7],
    ["TC2", data.tc2 != null ? data.tc2 : "--", null, 0.7],
    ["ABS", data.abs != null ? data.abs : "--", T.blue, 0.7],
    ["MAP", data.map != null ? data.map : "--", T.ledGreen, 0.7],
  ];
  return (
    <div className="w-full h-full flex gap-1 p-1">
      {items.map(([l, v, b, fl]) => (
        <div key={l} className="rounded border flex flex-col items-center justify-center" style={{
          flex: fl, borderColor: b || T.panelEdge, background: T.panel,
          boxShadow: b ? `inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px ${b}44, inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.2)` : `inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${T.panelEdge}88, inset 0 -1px 2px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.2)`,
        }}>
          <div className="font-digi" style={{ fontSize: "0.65em", color: T.label, letterSpacing: "0.08em" }}>{l}</div>
          <div className="font-digi font-bold tabular-nums" style={{ fontSize: "1.05em", color: b || T.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function renderWidget(type, ctx) {
  const { data, color, w, h, theme, shape, units, caps } = ctx;
  const T = { ...SEM, ...(theme || {}) };
  const sh = shape || "led";
  const u = units || { speed: "kmh", pressure: "psi" };
  switch (type) {
    case "rpmGear": return <RpmGear data={data} w={w} h={h} T={T} units={u} />;
    case "rpmBar": return <RpmBar data={data} w={w} h={h} T={T} />;
    case "shiftLights": return <ShiftLights data={data} T={T} shape={sh} />;
    case "speed": return <Speed data={data} w={w} h={h} T={T} units={u} />;
    case "tyres": return <Tyres data={data} w={w} h={h} T={T} units={u} caps={caps} />;
    case "fuel": return <Fuel data={data} w={w} h={h} T={T} />;
    case "gear": return <Gear data={data} w={w} h={h} T={T} shape={sh} />;
    case "delta": return <Delta data={data} w={w} h={h} T={T} caps={caps} />;
    case "laps": return <Laps data={data} color={color} w={w} h={h} T={T} />;
    case "cars": return <Cars data={data} w={w} h={h} T={T} />;
    case "inputs": return <Inputs data={data} color={color} w={w} h={h} T={T} shape={sh} />;
    case "status": return <Status data={data} color={color} w={w} h={h} T={T} />;
    default: return null;
  }
}