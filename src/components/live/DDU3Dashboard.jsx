import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Sliders, Pencil, Plus, X, RotateCcw } from "lucide-react";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { WIDGET_DEFS, renderWidget, SEM } from "@/components/live/dashboardWidgets";
import DashboardCustomizer from "@/components/live/DashboardCustomizer";

const CW = 1000, CH = 560;
const pad = (n) => String(n).padStart(2, "0");
const SWATCHES = ["#00e5ff", "#00ff66", "#ff1a1a", "#ffe600", "#ff9800", "#a855f7", "#ec4899", "#3b82f6", "#ffffff", "#6a6a6a"];

export default function DDU3Dashboard({ data, demo }) {
  const bezelRef = useRef(null);
  const wrapRef = useRef(null);
  const [fs, setFs] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [edit, setEdit] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [colorPick, setColorPick] = useState(null);
  const [scale, setScale] = useState(0.76);
  const [now, setNow] = useState(new Date());
  const { config, update, updateWidget, addWidget, removeWidget, resetLayout, reset } = useDashboardConfig();
  const op = useRef(null);
  const onMoveRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      const availH = fs ? window.innerHeight - 90 : Infinity;
      setScale(Math.max(0.2, Math.min(w / CW, availH / CH)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [fs]);

  useEffect(() => {
    const move = (e) => onMoveRef.current && onMoveRef.current(e);
    const up = () => { op.current = null; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const toggleFs = async () => {
    try {
      if (!document.fullscreenElement) await bezelRef.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  const accent = config.accent;
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const effScale = scale * (config.scale || 1);

  onMoveRef.current = (e) => {
    const o = op.current;
    if (!o) return;
    const dx = (e.clientX - o.startX) / effScale;
    const dy = (e.clientY - o.startY) / effScale;
    if (o.type === "drag") {
      const nx = Math.max(0, Math.min(CW - o.ow, o.ox + dx));
      const ny = Math.max(0, Math.min(CH - o.oh, o.oy + dy));
      updateWidget(o.id, { x: nx, y: ny });
    } else {
      const nw = Math.max(70, Math.min(CW - o.ox, o.ow + dx));
      const nh = Math.max(44, Math.min(CH - o.oy, o.oh + dy));
      updateWidget(o.id, { w: nw, h: nh });
    }
  };
  const startDrag = (e, id) => {
    if (!edit) return;
    e.stopPropagation();
    const w = config.widgets.find((w) => w.id === id);
    if (!w) return;
    op.current = { type: "drag", id, startX: e.clientX, startY: e.clientY, ox: w.x, oy: w.y, ow: w.w, oh: w.h };
    document.body.style.userSelect = "none";
  };
  const startResize = (e, id) => {
    e.stopPropagation();
    const w = config.widgets.find((w) => w.id === id);
    if (!w) return;
    op.current = { type: "resize", id, startX: e.clientX, startY: e.clientY, ox: w.x, oy: w.y, ow: w.w, oh: w.h };
    document.body.style.userSelect = "none";
  };

  return (
    <div className="space-y-3">
      {customize && !fs && (
        <DashboardCustomizer config={config} update={update} reset={reset} edit={edit} onToggleEdit={() => setEdit((v) => !v)} />
      )}
      <div
        ref={bezelRef}
        style={{ backgroundColor: "#000", color: "#fff" }}
        className={`font-digi select-none overflow-hidden rounded-2xl border-2 border-[#2a2a2a] ${fs ? "w-screen h-screen flex flex-col justify-center max-w-none border-0 p-4" : "w-full"}`}
      >
        <div className={`flex gap-1.5 p-1.5 rounded-xl ${fs ? "max-w-5xl mx-auto w-full" : ""}`} style={{ background: "#000", border: "1px solid #2a2a2a" }}>
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: SEM.green, boxShadow: `0 0 6px ${SEM.green}`, opacity: i === 0 ? 1 : 0.45 }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 py-1 text-[10px] border-b" style={{ borderColor: SEM.border }}>
              <div className="flex items-center gap-2">
                <span className="tabular-nums text-white">{clock}</span>
                <span style={{ color: SEM.label }}>AIR <span className="text-white">0.0°</span></span>
                <span style={{ color: SEM.label }}>TRK <span className="text-white">0.0°</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span><span style={{ color: SEM.label }}>RPM </span><span className="tabular-nums font-bold" style={{ color: shift ? SEM.red : accent }}>{data.rpm || 0}</span></span>
                <span><span style={{ color: SEM.label }}>SPD </span><span className="tabular-nums font-bold text-white">{Math.round(data.speed_kmh || 0)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: SEM.label }}>AIR/TRK <span className="text-white">0.0/0.0°C</span></span>
                {demo && <span style={{ color: SEM.amber }}>DEMO</span>}
                <div className="relative" style={{ display: edit ? "" : "none" }}>
                  <button onClick={() => setAddOpen((v) => !v)} className="p-0.5 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Add widget">
                    <Plus className="w-3 h-3" />
                  </button>
                  {addOpen && (
                    <div className="absolute right-0 top-full mt-1 z-50 rounded-lg border border-[#333] bg-black p-1 grid grid-cols-1 gap-0.5" style={{ minWidth: 140 }}>
                      {WIDGET_DEFS.map((d) => (
                        <button key={d.type} onClick={() => { addWidget(d.type); setAddOpen(false); }} className="text-left text-[10px] px-2 py-1 rounded hover:bg-white/10 text-white">{d.label}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => { if (edit) resetLayout(); }} className="p-0.5 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Reset layout" style={{ display: edit ? "" : "none" }}>
                  <RotateCcw className="w-3 h-3" />
                </button>
                <button onClick={() => setEdit((v) => !v)} className="p-0.5 rounded transition-colors" style={{ color: edit ? accent : "#777" }} aria-label="Toggle edit mode">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => setCustomize((c) => !c)} className="p-0.5 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Settings">
                  <Sliders className="w-3 h-3" />
                </button>
                <button onClick={toggleFs} className="p-0.5 rounded text-[#777] hover:text-white hover:bg-white/10 transition-colors" aria-label="Fullscreen">
                  {fs ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="w-full" style={{ height: CH * effScale }}>
              <div className="relative" style={{ width: CW, height: CH, transform: `scale(${effScale})`, transformOrigin: "top left", background: "#000" }}>
                {config.widgets.map((w) => {
                  const color = w.color || accent;
                  return (
                    <div
                      key={w.id}
                      className="absolute rounded-lg overflow-hidden"
                      style={{
                        left: w.x, top: w.y, width: w.w, height: w.h,
                        fontSize: `${Math.max(7, w.h * 0.052)}px`,
                        border: edit ? `1px dashed ${color}` : `1px solid ${SEM.border}`,
                        background: SEM.panel,
                        boxShadow: edit ? `0 0 0 1px ${color}33` : "none",
                        cursor: edit ? "move" : "default",
                        touchAction: "none",
                      }}
                      onPointerDown={(e) => startDrag(e, w.id)}
                    >
                      {edit && (
                        <>
                          <div className="absolute top-0.5 right-0.5 z-20 flex gap-0.5">
                            <button
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => setColorPick(colorPick === w.id ? null : w.id)}
                              className="w-4 h-4 rounded border border-white/40"
                              style={{ background: color }}
                              aria-label="Recolor"
                            />
                            <button
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => removeWidget(w.id)}
                              className="w-4 h-4 rounded bg-black/70 text-white/80 hover:bg-red-600 flex items-center justify-center"
                              aria-label="Remove"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          {colorPick === w.id && (
                            <div
                              onPointerDown={(e) => e.stopPropagation()}
                              className="absolute top-6 right-0.5 z-30 flex gap-1 p-1 rounded bg-black border border-[#333]"
                            >
                              <button onClick={() => { updateWidget(w.id, { color: null }); setColorPick(null); }} className="w-4 h-4 rounded border-2 border-white/60" style={{ background: accent }} title="Default" />
                              {SWATCHES.map((c) => (
                                <button key={c} onClick={() => { updateWidget(w.id, { color: c }); setColorPick(null); }} className="w-4 h-4 rounded" style={{ background: c }} />
                              ))}
                            </div>
                          )}
                          <div
                            onPointerDown={(e) => startResize(e, w.id)}
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                            style={{ background: color, opacity: 0.8 }}
                          />
                        </>
                      )}
                      <div className="w-full h-full" style={{ pointerEvents: edit ? "none" : "auto" }}>
                        {renderWidget(w.type, { data, color, w: w.w, h: w.h })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: SEM.green, boxShadow: `0 0 6px ${SEM.green}`, opacity: i === 0 ? 1 : 0.45 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}