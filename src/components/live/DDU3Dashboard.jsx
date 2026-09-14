import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Sliders } from "lucide-react";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { renderWidget } from "@/components/live/dashboardWidgets";
import { DASH_VARIANTS, getVariant } from "@/lib/dashboardVariants";
import DashboardCustomizer from "@/components/live/DashboardCustomizer";
import DashVariantGallery from "@/components/live/DashVariantGallery";

const CW = 1000, CH = 560;
const pad = (n) => String(n).padStart(2, "0");

export default function DDU3Dashboard({ data, demo }) {
  const bezelRef = useRef(null);
  const wrapRef = useRef(null);
  const [fs, setFs] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [scale, setScale] = useState(0.76);
  const [now, setNow] = useState(new Date());
  const { config, activeId, loadVariant, update, reset } = useDashboardConfig();
  const variant = getVariant(activeId);
  const theme = variant.theme;

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
  const dispSpeed = config.units.speed === "mph"
    ? Math.round((data.speed_kmh || 0) * 0.621371)
    : Math.round(data.speed_kmh || 0);

  return (
    <div className="space-y-3">
      {!fs && (
        <DashVariantGallery variants={DASH_VARIANTS} activeId={activeId} onSelect={loadVariant} />
      )}
      {customize && !fs && (
        <DashboardCustomizer config={config} update={update} reset={reset} />
      )}
      <div
        ref={bezelRef}
        style={{ backgroundColor: theme.bg, color: theme.text }}
        className={`font-digi select-none overflow-hidden rounded-2xl border-2 ${fs ? "w-screen h-screen flex flex-col justify-center max-w-none border-0 p-4" : "w-full"}`}
      >
        <div className={`flex gap-1.5 p-1.5 rounded-xl ${fs ? "max-w-5xl mx-auto w-full" : ""}`} style={{ background: theme.bg, border: `1px solid ${theme.panelEdge}` }}>
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: theme.ledGreen, boxShadow: `0 0 6px ${theme.ledGreen}`, opacity: i === 0 ? 1 : 0.45 }} />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 py-1 text-[10px] border-b" style={{ borderColor: theme.panelEdge }}>
              <div className="flex items-center gap-2">
                <span className="tabular-nums" style={{ color: theme.text }}>{clock}</span>
                <span style={{ color: theme.label }}>AIR <span style={{ color: theme.text }}>{data.air_temp != null ? data.air_temp.toFixed(1) : "0.0"}°</span></span>
                <span style={{ color: theme.label }}>TRK <span style={{ color: theme.text }}>{data.track_temp != null ? data.track_temp.toFixed(1) : "0.0"}°</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span><span style={{ color: theme.label }}>RPM </span><span className="tabular-nums font-bold" style={{ color: shift ? theme.shiftColor : accent, textShadow: shift ? `0 0 10px ${theme.shiftColor}` : "none" }}>{data.rpm || 0}</span></span>
                <span><span style={{ color: theme.label }}>SPD </span><span className="tabular-nums font-bold" style={{ color: theme.text }}>{dispSpeed}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: theme.label }}>AIR/TRK <span style={{ color: theme.text }}>{data.air_temp != null && data.track_temp != null ? `${data.air_temp.toFixed(1)}/${data.track_temp.toFixed(1)}°C` : "0.0/0.0°C"}</span></span>
                {demo && <span style={{ color: theme.warn }}>DEMO</span>}
                <button onClick={() => setCustomize((c) => !c)} className="p-0.5 rounded transition-colors" style={{ color: customize ? accent : theme.label }} aria-label="Display options">
                  <Sliders className="w-3 h-3" />
                </button>
                <button onClick={toggleFs} className="p-0.5 rounded transition-colors" style={{ color: theme.label }} aria-label="Fullscreen">
                  {fs ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="w-full" style={{ height: CH * scale }}>
              <div className="relative" style={{ width: CW, height: CH, transform: `scale(${scale})`, transformOrigin: "top left", background: theme.bg }}>
                {variant.layout.map((w) => {
                  const color = w.color || accent;
                  return (
                    <div
                      key={w.id}
                      className="absolute rounded-lg overflow-hidden"
                      style={{
                        left: w.x, top: w.y, width: w.w, height: w.h,
                        fontSize: `${Math.max(7, w.h * 0.052)}px`,
                        border: `1px solid ${theme.panelEdge}`,
                        background: theme.panel,
                        boxShadow: `inset 0 0 0 1px ${theme.panelEdge}55`,
                      }}
                    >
                      <div className="w-full h-full">
                        {renderWidget(w.type, { data, color, w: w.w, h: w.h, theme, shape: variant.shape, units: config.units })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: theme.ledGreen, boxShadow: `0 0 6px ${theme.ledGreen}`, opacity: i === 0 ? 1 : 0.45 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}