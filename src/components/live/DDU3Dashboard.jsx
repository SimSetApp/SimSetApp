import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Grid } from "lucide-react";

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}
const pad = (n) => String(n).padStart(2, "0");

const C = {
  bg: "#000000", text: "#ffffff", label: "#6a6a6a",
  green: "#00ff66", yellow: "#ffe600", red: "#ff1a1a",
  cyan: "#00e5ff", blue: "#3b82f6", amber: "#ff9800",
  bezel: "#2a2a2a", panel: "#0a0a0a", border: "#262626",
};

function tempColor(t) {
  if (t == null) return C.label;
  if (t < 70) return C.blue;
  if (t < 86) return C.green;
  if (t < 96) return C.yellow;
  if (t < 108) return C.amber;
  return C.red;
}
function wearColor(w) {
  if (w == null) return C.label;
  if (w < 40) return C.green;
  if (w < 70) return C.yellow;
  if (w < 90) return C.amber;
  return C.red;
}

export default function DDU3Dashboard({ data, demo }) {
  const ref = useRef(null);
  const [fs, setFs] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  const toggleFs = async () => {
    try {
      if (!document.fullscreenElement) await ref.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const lit = Math.round(rpmPct * 15);
  const shift = rpmPct > 0.93;
  const tyres = data.tyres || {};
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;
  const delta = data.lap_delta;
  const deltaTone = delta == null ? C.label : delta <= 0 ? C.green : C.red;
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div
      ref={ref}
      style={{ backgroundColor: C.bg, color: C.text }}
      className={`font-digi select-none overflow-hidden rounded-2xl border-2 ${fs ? "w-screen h-screen flex flex-col justify-center max-w-none border-0 p-4" : "w-full"}`}
    >
      <div className={`flex gap-1.5 p-1.5 rounded-xl ${fs ? "max-w-5xl mx-auto w-full" : ""}`} style={{ background: C.bg, border: `1px solid ${C.bezel}` }}>
        <SideLEDs />
        <div className="flex-1 min-w-0">
          {/* Shift-light strip */}
          <div className={`flex gap-1 ${fs ? "h-5" : "h-3"} mb-1`}>
            {Array.from({ length: 15 }).map((_, i) => {
              const on = i < lit;
              const col = i < 5 ? C.green : i < 10 ? C.yellow : C.red;
              return <div key={i} className="flex-1 rounded-[2px] transition-colors duration-75" style={{ background: on ? col : "rgba(255,255,255,0.06)", boxShadow: on ? `0 0 8px ${col}` : "none" }} />;
            })}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-1.5 py-1 text-[10px] border-b" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-white">{clock}</span>
              <span style={{ color: C.label }}>AIR <span className="text-white">0.0°</span></span>
              <span style={{ color: C.label }}>TRK <span className="text-white">0.0°</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span><span style={{ color: C.label }}>RPM </span><span className="tabular-nums font-bold" style={{ color: shift ? C.red : C.text }}>{data.rpm || 0}</span></span>
              <span><span style={{ color: C.label }}>SPD </span><span className="tabular-nums font-bold text-white">{Math.round(data.speed_kmh || 0)}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: C.label }}>AIR/TRK <span className="text-white">0.0/0.0°C</span></span>
              {demo && <span style={{ color: C.amber }}>DEMO</span>}
              <button onClick={toggleFs} className="p-0.5 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Toggle fullscreen">
                {fs ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Body: 3 columns */}
          <div className="grid grid-cols-3 gap-1.5 px-1.5 py-1.5">
            {/* ── Left: Tyres ── */}
            <div className="space-y-1">
              <SectionLabel>TYRES</SectionLabel>
              <div className="grid grid-cols-2 gap-1">
                <TyreBlock label="FL" t={tyres.fl} />
                <TyreBlock label="FR" t={tyres.fr} />
                <TyreBlock label="RL" t={tyres.rl} />
                <TyreBlock label="RR" t={tyres.rr} />
              </div>
            </div>

            {/* ── Center: Fuel + Gear + Temps ── */}
            <div className="space-y-1">
              <div className="rounded border p-1.5 space-y-0.5 text-[10px]" style={{ borderColor: C.border, background: C.panel }}>
                <SectionLabel>FUEL / TEMP</SectionLabel>
                <Row label="REMAINING" value={`${(data.fuel_litres ?? 0).toFixed(1)}L`} />
                <Row label="FUEL REQ" value="--" />
                <Row label="AVG LAP" value="--" />
                <Row label="LAST LAP" value={fmt(data.last_lap_time)} />
                <Row label="LAPS LEFT" value={lapsLeft != null ? lapsLeft.toFixed(1) : "--"} />
                <Bar label="THR" value={data.throttle} color={C.green} />
                <Bar label="BRK" value={data.brake} color={C.red} />
              </div>
              <div className="flex flex-col items-center py-0.5">
                <span className={`${fs ? "text-9xl" : "text-6xl"} font-bold tabular-nums leading-[0.8]`} style={{ color: data.gear > 0 ? C.text : C.amber, textShadow: shift ? `0 0 30px ${C.red}` : "none" }}>
                  {data.gear > 0 ? data.gear : "N"}
                </span>
              </div>
              <div className="flex justify-center gap-3 text-[10px]">
                <span style={{ color: C.label }}>WATER T <span className="text-white">0°</span></span>
                <span style={{ color: C.label }}>OIL T <span className="text-white">0°</span></span>
              </div>
            </div>

            {/* ── Right: Delta / Time / Cars ── */}
            <div className="space-y-1">
              <div className="rounded border p-1.5 space-y-0.5 text-[10px]" style={{ borderColor: C.border, background: C.panel }}>
                <Row label="LAST LAP" value={fmt(data.last_lap_time)} />
                <Row label="BEST LAP" value={fmt(data.best_lap_time)} />
                <div className="text-center py-0.5">
                  <div className="text-[9px] tracking-widest" style={{ color: C.label }}>DELTA</div>
                  <div className={`${fs ? "text-4xl" : "text-2xl"} font-bold tabular-nums leading-none`} style={{ color: deltaTone }}>
                    {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
                  </div>
                </div>
              </div>
              <div className="rounded border p-1.5 space-y-0.5 text-[10px]" style={{ borderColor: C.border, background: C.panel }}>
                <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} />
                <Row label="TIME REM" value="00:00:00" />
                <Row label="CURRENT" value={fmt(data.current_lap_time)} valueColor={C.cyan} />
              </div>
              <div className="rounded border p-1.5 space-y-0.5 text-[10px]" style={{ borderColor: C.border, background: C.panel }}>
                <SectionLabel>CAR AHEAD</SectionLabel>
                <Row label="+0.00" value="00:00.000" labelColor={C.green} />
                <SectionLabel>CAR BEHIND</SectionLabel>
                <Row label="+0.00" value="00:00.000" labelColor={C.red} />
              </div>
            </div>
          </div>

          {/* ── Bottom row ── */}
          <div className="flex gap-1 px-1.5 pb-1.5">
            <MiniBox label="POS" value={`P${data.position || 0}`} />
            <MiniBox label="THROTT" value={`${Math.round((data.throttle || 0) * 100)}`} border={C.green} />
            <MiniBox label="BOOST" value="--" />
            <MiniBox label="INC" value={`${data.incidents || 0}`} border={C.yellow} />
            <MiniBox label="BBIAS" value="0.0" border={C.red} />
            <MiniBox label="TC1" value="0" border={C.cyan} />
            <MiniBox label="TC2" value="--" />
            <MiniBox label="ABS" value="0" border={C.blue} />
            <MiniBox label="MAP" value="0" border={C.green} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1 py-1 text-sm font-bold tracking-[0.3em] text-white border-t" style={{ borderColor: C.border }}>
            SIMUB<span className="inline-flex items-center"><Grid className="w-3.5 h-3.5 mx-0.5" /></span>X
          </div>
        </div>
        <SideLEDs />
      </div>
    </div>
  );
}

function SideLEDs() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="w-2 h-2 rounded-full" style={{ background: C.green, boxShadow: `0 0 6px ${C.green}`, opacity: i === 0 ? 1 : 0.45 }} />
      ))}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="text-[9px] tracking-widest" style={{ color: C.label }}>{children}</div>;
}
function Row({ label, value, labelColor, valueColor }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: labelColor || C.label }}>{label}</span>
      <span className="tabular-nums" style={{ color: valueColor || C.text }}>{value}</span>
    </div>
  );
}
function TyreBlock({ label, t }) {
  const temp = t?.temp_c, press = t?.pressure_psi, wear = t?.wear_pct;
  return (
    <div className="rounded border p-1.5" style={{ borderColor: C.border, background: C.panel }}>
      <div className="text-[9px] tracking-widest" style={{ color: C.label }}>{label}</div>
      <div className="text-lg font-bold tabular-nums leading-tight" style={{ color: tempColor(temp) }}>{temp != null ? Math.round(temp) : "--"}°</div>
      <div className="text-[9px] tabular-nums" style={{ color: C.label }}>PRS <span className="text-white">{press != null ? press.toFixed(1) : "--"}</span></div>
      <div className="text-[9px] tabular-nums" style={{ color: C.label }}>WR <span style={{ color: wearColor(wear) }}>{wear != null ? Math.round(wear) : "--"}%</span></div>
    </div>
  );
}
function Bar({ label, value, color }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between text-[9px]" style={{ color: C.label }}><span>{label}</span><span>{Math.round(v * 100)}%</span></div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#161616" }}>
        <div className="h-full rounded-full transition-[width] duration-75" style={{ width: `${v * 100}%`, background: color, boxShadow: v > 0.05 ? `0 0 5px ${color}` : "none" }} />
      </div>
    </div>
  );
}
function MiniBox({ label, value, border }) {
  return (
    <div className="flex-1 rounded border px-1 py-1 text-center" style={{ borderColor: border || C.border, background: C.panel }}>
      <div className="text-[8px] tracking-widest" style={{ color: C.label }}>{label}</div>
      <div className="text-xs font-bold tabular-nums" style={{ color: border || C.text }}>{value}</div>
    </div>
  );
}