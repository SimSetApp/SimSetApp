import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, AlertTriangle } from "lucide-react";

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

/* Authentic Bosch motorsport high-contrast palette */
const C = {
  bg: "#000000",
  text: "#ffffff",
  label: "#6a6a6a",
  green: "#00ff66",
  yellow: "#ffe600",
  red: "#ff1a1a",
  cyan: "#00e5ff",
  amber: "#ff9800",
  border: "#1a1a1a",
  track: "#161616",
};

const SEGMENTS = 24;

function tempColor(t) {
  if (t == null) return C.label;
  if (t < 70) return "#2196f3";
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

  useEffect(() => {
    const handler = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFs = async () => {
    try {
      if (!document.fullscreenElement) await ref.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const lit = Math.round(rpmPct * SEGMENTS);
  const shift = rpmPct > 0.93;
  const rpmZoneColor = rpmPct > 0.93 ? C.red : rpmPct > 0.82 ? C.yellow : C.green;

  const segColor = (i) => {
    if (i >= lit) return "rgba(255,255,255,0.04)";
    if (i >= 20) return C.red;
    if (i >= 16) return C.yellow;
    return C.green;
  };

  const delta = data.lap_delta;
  const deltaTone = delta == null ? C.label : delta <= 0 ? C.green : C.red;
  const fuelPct = data.fuel_litres != null && data.fuel_per_lap ? Math.min(100, (data.fuel_litres / Math.max(1, data.fuel_per_lap * 30)) * 100) : null;
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;

  return (
    <div
      ref={ref}
      style={{ backgroundColor: C.bg, color: C.text }}
      className={`font-digi select-none overflow-hidden border border-[#1c1c1c] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${fs ? "w-screen h-screen flex flex-col justify-center max-w-none rounded-none border-0 p-6" : "w-full rounded-xl"}`}
    >
      <div className={fs ? "w-full max-w-3xl mx-auto" : ""}>
        {/* ── Shift-light strip ── */}
        <div className="px-2 pt-2">
          <div className={`flex gap-[2px] ${fs ? "h-6" : "h-4"}`}>
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div key={i} className="flex-1 rounded-[1.5px] transition-colors duration-75" style={{ backgroundColor: segColor(i), boxShadow: i < lit ? `0 0 ${fs ? 12 : 8}px ${segColor(i)}` : "none" }} />
            ))}
          </div>
        </div>

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-3 pt-1.5 pb-1">
          <span className="text-[10px] tracking-[0.3em] text-[#777]">DDU3 · {data.sim || "MOTORSPORT"}</span>
          <div className="flex items-center gap-2">
            {demo && <span className="text-[9px] tracking-widest text-amber-400 border border-amber-400/40 px-1.5 rounded">DEMO</span>}
            <span className="text-[9px] tracking-widest text-[#777]">{data.session_type || "RACE"}</span>
            <button onClick={toggleFs} className="ml-1 p-1 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Toggle fullscreen">
              {fs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ── Main: SPEED | GEAR | RPM ── */}
        <div className="grid grid-cols-3 items-center px-3 py-2 border-t border-[#1a1a1a]">
          <div className="flex flex-col">
            <span className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>SPEED</span>
            <span className={`${fs ? "text-5xl" : "text-3xl"} font-bold tabular-nums leading-none`}>{Math.round(data.speed_kmh || 0)}<span className="text-xs ml-1" style={{ color: C.label }}>km/h</span></span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>GEAR</span>
            <span className={`${fs ? "text-[9rem] leading-[0.85]" : "text-7xl"} font-bold tabular-nums leading-none`} style={{ color: data.gear > 0 ? C.text : C.amber, textShadow: shift ? `0 0 24px ${C.red}` : "none" }}>
              {data.gear > 0 ? data.gear : "N"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>RPM</span>
            <span className={`${fs ? "text-5xl" : "text-3xl"} font-bold tabular-nums leading-none`} style={{ color: shift ? C.red : C.cyan }}>{data.rpm || 0}</span>
          </div>
        </div>

        {/* ── RPM bar with zone colours ── */}
        <div className="px-3 pb-2">
          <div className={`relative ${fs ? "h-4" : "h-2.5"} rounded-full overflow-hidden`} style={{ backgroundColor: C.track }}>
            <div className="absolute inset-0 opacity-25" style={{ background: `linear-gradient(90deg, ${C.green} 0%, ${C.green} 75%, ${C.yellow} 82%, ${C.red} 93%)` }} />
            <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75" style={{ width: `${rpmPct * 100}%`, background: rpmZoneColor, boxShadow: `0 0 10px ${rpmZoneColor}` }} />
            <div className="absolute inset-y-0 w-px bg-white transition-[left] duration-75" style={{ left: `calc(${rpmPct * 100}% - 1px)`, opacity: rpmPct > 0.02 ? 1 : 0 }} />
          </div>
        </div>

        {/* ── Timing: lap time + delta ── */}
        <div className="grid grid-cols-2 gap-px border-t border-[#1a1a1a]" style={{ background: C.border }}>
          <div className="px-3 py-2" style={{ background: C.bg }}>
            <div className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>LAP TIME</div>
            <div className={`${fs ? "text-3xl" : "text-xl"} font-bold tabular-nums leading-tight`} style={{ color: C.cyan }}>{fmt(data.current_lap_time)}</div>
            <div className="flex gap-4 mt-1 text-[10px] tabular-nums" style={{ color: C.label }}>
              <span>LAST <span className="text-white">{fmt(data.last_lap_time)}</span></span>
              <span>BEST <span className="text-white">{fmt(data.best_lap_time)}</span></span>
            </div>
          </div>
          <div className="px-3 py-2 text-right" style={{ background: C.bg }}>
            <div className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>DELTA</div>
            <div className={`${fs ? "text-6xl" : "text-4xl"} font-bold tabular-nums leading-none`} style={{ color: deltaTone, textShadow: delta != null && delta <= 0 ? `0 0 16px ${C.green}` : "none" }}>
              {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
            </div>
            <div className="text-[10px] tabular-nums mt-1" style={{ color: C.label }}>LAP <span className="text-white">{data.lap ? `${data.lap}/${data.total_laps || "--"}` : "--/--"}</span></div>
          </div>
        </div>

        {/* ── Tyres ── */}
        <div className="px-3 py-2.5 border-t border-[#1a1a1a]">
          <div className="text-[9px] tracking-[0.25em] mb-1.5" style={{ color: C.label }}>TYRES · °C / PSI</div>
          <div className={`grid grid-cols-2 gap-1.5 ${fs ? "max-w-md" : "max-w-[300px]"} mx-auto`}>
            <TyreCell label="FL" t={data.tyres?.fl} big={fs} />
            <TyreCell label="FR" t={data.tyres?.fr} big={fs} />
            <TyreCell label="RL" t={data.tyres?.rl} big={fs} />
            <TyreCell label="RR" t={data.tyres?.rr} big={fs} />
          </div>
        </div>

        {/* ── Inputs + Fuel ── */}
        <div className="grid grid-cols-2 gap-px border-t border-[#1a1a1a]" style={{ background: C.border }}>
          <div className="p-3 space-y-2" style={{ background: C.bg }}>
            <div className="text-[9px] tracking-[0.25em]" style={{ color: C.label }}>INPUTS</div>
            <Bar label="THR" value={data.throttle} color={C.green} />
            <Bar label="BRK" value={data.brake} color={C.red} />
            <div>
              <div className="flex justify-between text-[9px]" style={{ color: C.label }}><span>STR</span><span>{(data.steer ?? 0).toFixed(2)}</span></div>
              <div className="relative h-2 rounded-full" style={{ background: C.track }}>
                <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "#444" }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-3 rounded-sm transition-[left] duration-75" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, background: C.cyan }} />
              </div>
            </div>
          </div>
          <div className="p-3" style={{ background: C.bg }}>
            <div className="flex items-center justify-between text-[9px] tracking-[0.25em]" style={{ color: C.label }}>
              <span>FUEL</span>
              <span>{lapsLeft != null ? `${lapsLeft.toFixed(1)} LAPS` : ""}</span>
            </div>
            <div className={`${fs ? "text-4xl" : "text-2xl"} font-bold tabular-nums mt-1`}>{data.fuel_litres != null ? data.fuel_litres.toFixed(1) : "--"}<span className="text-sm" style={{ color: C.label }}> L</span></div>
            <div className="h-2 rounded-full overflow-hidden mt-1" style={{ background: C.track }}>
              <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${fuelPct ?? 0}%`, background: (fuelPct ?? 100) < 15 ? C.red : (fuelPct ?? 100) < 30 ? C.amber : C.green }} />
            </div>
            {data.fuel_per_lap != null && <div className="text-[9px] mt-1" style={{ color: C.label }}>{data.fuel_per_lap} L/LAP</div>}
          </div>
        </div>

        {/* ── Status footer ── */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#1a1a1a] text-[10px]" style={{ color: C.label }}>
          <span className="truncate max-w-[40%]">{data.car || "—"}</span>
          <div className="flex items-center gap-3">
            <span className="font-bold" style={{ color: C.text }}>P{data.position || "--"}</span>
            {data.incidents ? <span className="flex items-center gap-1" style={{ color: C.amber }}><AlertTriangle className="w-2.5 h-2.5" />{data.incidents}</span> : null}
            <span className="truncate max-w-[120px]">{data.track || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TyreCell({ label, t, big }) {
  const temp = t?.temp_c;
  const wear = t?.wear_pct;
  return (
    <div className="rounded border border-[#222] px-2 py-1.5" style={{ background: `linear-gradient(135deg, ${tempColor(temp)}1f, transparent)` }}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-widest" style={{ color: C.label }}>{label}</span>
        <span className="text-[9px] tabular-nums" style={{ color: wearColor(wear) }}>{wear != null ? `${Math.round(wear)}%` : "--"}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`${big ? "text-3xl" : "text-xl"} font-bold tabular-nums leading-none`} style={{ color: tempColor(temp) }}>{temp != null ? Math.round(temp) : "--"}°</span>
        {t?.pressure_psi != null && <span className="text-[10px] tabular-nums" style={{ color: C.text }}>{t.pressure_psi.toFixed(1)}</span>}
      </div>
    </div>
  );
}

function Bar({ label, value, color }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between text-[9px]" style={{ color: C.label }}><span>{label}</span><span>{Math.round(v * 100)}%</span></div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: C.track }}>
        <div className="h-full rounded-full transition-[width] duration-75" style={{ width: `${v * 100}%`, background: color, boxShadow: v > 0.05 ? `0 0 6px ${color}` : "none" }} />
      </div>
    </div>
  );
}