import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, AlertTriangle } from "lucide-react";

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

const SEGMENTS = 22;

function tempColor(t) {
  if (t == null) return "#555";
  if (t < 70) return "#2196f3";
  if (t < 86) return "#00e676";
  if (t < 96) return "#ffeb3b";
  if (t < 108) return "#ff9800";
  return "#f44336";
}
function wearColor(w) {
  if (w == null) return "#555";
  if (w < 40) return "#00e676";
  if (w < 70) return "#ffeb3b";
  if (w < 90) return "#ff9800";
  return "#f44336";
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

  const rpmPct = (data.rpm || 0) / (data.max_rpm || 8000);
  const lit = Math.round(rpmPct * SEGMENTS);
  const shift = rpmPct > 0.93;

  const segColor = (i) => {
    if (i >= lit) return "rgba(255,255,255,0.05)";
    if (i >= 18) return "#ff1744";
    if (i >= 14) return "#ffea00";
    return "#00e676";
  };

  const delta = data.lap_delta;
  const deltaTone = delta == null ? "#666" : delta <= 0 ? "#00e676" : "#ff1744";
  const fuelPct = data.fuel_litres != null && data.fuel_per_lap ? Math.min(100, (data.fuel_litres / Math.max(1, data.fuel_per_lap * 30)) * 100) : null;
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;

  return (
    <div
      ref={ref}
      className={`rounded-xl overflow-hidden border border-[#1c1c1c] bg-black text-white font-digi select-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] ${fs ? "w-screen h-screen flex flex-col justify-center max-w-none rounded-none border-0 p-6" : "w-full"}`}
    >
      <div className={fs ? "w-full max-w-3xl mx-auto" : ""}>
        {/* Brand bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a0a0a] border-b border-[#1f1f1f]">
          <span className="text-[10px] tracking-[0.25em] text-[#777]">DDU3 · TELEMETRY</span>
          <div className="flex items-center gap-2">
            {demo && <span className="text-[9px] tracking-widest text-amber-400 border border-amber-400/40 px-1.5 rounded">DEMO</span>}
            <span className={`w-1.5 h-1.5 rounded-full ${shift ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
            <span className="text-[9px] tracking-widest text-[#777]">{data.session_type || "RACE"}</span>
            <button onClick={toggleFs} className="ml-1 p-1 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Toggle fullscreen">
              {fs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Shift-light bar */}
        <div className="px-3 pt-3">
          <div className={`flex gap-[3px] ${fs ? "h-6" : "h-3.5"}`}>
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <div key={i} className="flex-1 rounded-[2px] transition-colors duration-75" style={{ backgroundColor: segColor(i), boxShadow: i < lit ? `0 0 ${fs ? 10 : 7}px ${segColor(i)}` : "none" }} />
            ))}
          </div>
          {shift && <div className="text-center text-[10px] tracking-[0.3em] text-red-500 animate-pulse mt-1">▲ SHIFT ▲</div>}
        </div>

        {/* Speed | Gear | RPM */}
        <div className="grid grid-cols-3 items-center px-3 py-2 border-b border-[#1a1a1a]">
          <div className="flex flex-col">
            <span className="text-[9px] tracking-[0.2em] text-[#666]">SPEED km/h</span>
            <span className={`${fs ? "text-6xl" : "text-4xl"} font-bold tabular-nums leading-none`}>{Math.round(data.speed_kmh || 0)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] tracking-[0.2em] text-[#666]">GEAR</span>
            <span className={`${fs ? "text-9xl" : "text-7xl"} font-bold tabular-nums leading-none`} style={{ color: data.gear > 0 ? "#fff" : "#ff9800" }}>
              {data.gear > 0 ? data.gear : "N"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] tracking-[0.2em] text-[#666]">RPM</span>
            <span className={`${fs ? "text-6xl" : "text-4xl"} font-bold tabular-nums leading-none`} style={{ color: shift ? "#ff1744" : "#00e5ff" }}>
              {data.rpm || 0}
            </span>
            <div className="w-full h-1 mt-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-75" style={{ width: `${Math.min(100, rpmPct * 100)}%`, background: shift ? "#ff1744" : "#00e5ff" }} />
            </div>
          </div>
        </div>

        {/* Current lap + lap counter */}
        <div className="flex items-baseline justify-between px-3 py-2 border-b border-[#1a1a1a]">
          <div>
            <div className="text-[9px] tracking-[0.2em] text-[#666]">NOW</div>
            <div className={`${fs ? "text-4xl" : "text-2xl"} font-bold tabular-nums leading-tight`} style={{ color: "#00e5ff" }}>{fmt(data.current_lap_time)}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] tracking-[0.2em] text-[#666]">LAP</div>
            <div className={`${fs ? "text-2xl" : "text-lg"} font-bold tabular-nums leading-tight`}>{data.lap ? `${data.lap}/${data.total_laps || "--"}` : "--/--"}</div>
          </div>
        </div>

        {/* Last / Best / Delta */}
        <div className="grid grid-cols-3 gap-px bg-[#1a1a1a] border-b border-[#1a1a1a]">
          <Cell label="LAST" value={fmt(data.last_lap_time)} />
          <Cell label="BEST" value={fmt(data.best_lap_time)} />
          <Cell label="DELTA" value={delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`} valueColor={deltaTone} />
        </div>

        {/* Tyres */}
        <div className="px-3 py-3 border-b border-[#1a1a1a]">
          <div className="text-[9px] tracking-[0.2em] text-[#666] mb-2">TYRES · °C / WEAR</div>
          <div className={`grid grid-cols-2 gap-2 ${fs ? "max-w-md" : "max-w-[280px]"} mx-auto`}>
            <TyreCell label="FL" t={data.tyres?.fl} big={fs} />
            <TyreCell label="FR" t={data.tyres?.fr} big={fs} />
            <TyreCell label="RL" t={data.tyres?.rl} big={fs} />
            <TyreCell label="RR" t={data.tyres?.rr} big={fs} />
          </div>
        </div>

        {/* Inputs + Fuel */}
        <div className="grid grid-cols-2 gap-px bg-[#1a1a1a]">
          <div className="bg-black p-3 space-y-2">
            <div className="text-[9px] tracking-[0.2em] text-[#666]">INPUTS</div>
            <Bar label="THR" value={data.throttle} color="#00e676" />
            <Bar label="BRK" value={data.brake} color="#ff1744" />
            <div>
              <div className="flex justify-between text-[9px] text-[#666]"><span>STR</span><span>{(data.steer ?? 0).toFixed(2)}</span></div>
              <div className="relative h-2 bg-[#1a1a1a] rounded-full">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#444]" />
                <div className="absolute top-1/2 -translate-y-1/2 w-2 h-3 rounded-sm bg-[#00e5ff] transition-[left] duration-75" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)` }} />
              </div>
            </div>
          </div>
          <div className="bg-black p-3">
            <div className="flex items-center justify-between text-[9px] tracking-[0.2em] text-[#666]">
              <span>FUEL</span>
              <span>{lapsLeft != null ? `${lapsLeft.toFixed(1)} LAPS` : ""}</span>
            </div>
            <div className={`${fs ? "text-4xl" : "text-2xl"} font-bold tabular-nums mt-1`}>{data.fuel_litres != null ? data.fuel_litres.toFixed(1) : "--"}<span className="text-sm text-[#666]"> L</span></div>
            <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-1">
              <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${fuelPct ?? 0}%`, background: (fuelPct ?? 100) < 15 ? "#ff1744" : (fuelPct ?? 100) < 30 ? "#ff9800" : "#00e676" }} />
            </div>
            {data.fuel_per_lap != null && <div className="text-[9px] text-[#666] mt-1">{data.fuel_per_lap} L/LAP</div>}
          </div>
        </div>

        {/* Status footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#0a0a0a] border-t border-[#1f1f1f] text-[10px] text-[#888]">
          <span className="truncate max-w-[40%]">{data.car || "—"}</span>
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">P{data.position || "--"}</span>
            {data.incidents ? <span className="text-amber-400 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" />{data.incidents}</span> : null}
            <span className="truncate max-w-[120px]">{data.track || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, valueColor }) {
  return (
    <div className="bg-black px-2 py-2">
      <div className="text-[9px] tracking-[0.2em] text-[#666]">{label}</div>
      <div className="text-base font-bold tabular-nums leading-tight" style={{ color: valueColor || "#fff" }}>{value}</div>
    </div>
  );
}

function TyreCell({ label, t, big }) {
  const temp = t?.temp_c;
  const wear = t?.wear_pct;
  return (
    <div className="rounded border border-[#222] p-2" style={{ background: `linear-gradient(135deg, ${tempColor(temp)}22, transparent)` }}>
      <div className="flex items-center justify-between">
        <span className="text-[9px] tracking-widest text-[#888]">{label}</span>
        <span className="text-[9px] tabular-nums" style={{ color: wearColor(wear) }}>{wear != null ? `${Math.round(wear)}%` : "--"}</span>
      </div>
      <div className={`${big ? "text-3xl" : "text-xl"} font-bold tabular-nums leading-none my-0.5`} style={{ color: tempColor(temp) }}>{temp != null ? Math.round(temp) : "--"}°</div>
      {t?.pressure_psi != null && <div className="text-[9px] text-[#666] tabular-nums">{t.pressure_psi.toFixed(1)} psi</div>}
    </div>
  );
}

function Bar({ label, value, color }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between text-[9px] text-[#666]"><span>{label}</span><span>{Math.round(v * 100)}%</span></div>
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-[width] duration-75" style={{ width: `${v * 100}%`, background: color, boxShadow: v > 0.05 ? `0 0 6px ${color}` : "none" }} />
      </div>
    </div>
  );
}