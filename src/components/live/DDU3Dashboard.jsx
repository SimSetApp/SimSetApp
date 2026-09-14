import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Sliders } from "lucide-react";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { renderWidget } from "@/components/live/dashboardWidgets";
import { DASH_VARIANTS, getVariant } from "@/lib/dashboardVariants";
import DashboardCustomizer from "@/components/live/DashboardCustomizer";
import DashVariantGallery from "@/components/live/DashVariantGallery";

const CW = 1000, CH = 560;
const pad = (n) => String(n).padStart(2, "0");

export default function DDU3Dashboard({ data, demo, inKiosk = false }) {
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
      const h = wrapRef.current.clientHeight;
      if (!w || !h) return;
      setScale(Math.max(0.1, Math.min(w / CW, h / CH)));
    };
    const raf = () => requestAnimationFrame(measure);
    raf();
    const ro = new ResizeObserver(raf);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", raf);
    window.addEventListener("orientationchange", raf);
    window.addEventListener("scroll", raf, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", raf);
      window.removeEventListener("orientationchange", raf);
      window.removeEventListener("scroll", raf, true);
    };
  }, [fs, customize]);

  const toggleFs = async () => {
    if (inKiosk) {
      // Inside the pop-out window: toggle browser fullscreen of the whole document
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
        else await document.exitFullscreen?.();
      } catch { /* ignore */ }
      return;
    }
    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth >= 900;
    if (isDesktop) {
      // Desktop: pop the dashboard out into a separate OS window
      const w = window.open("/dashboard-fullscreen", "simsetapp-dash", "width=1280,height=720");
      if (w) w.focus();
      return;
    }
    // Mobile: same-tab bezel fullscreen (existing behaviour)
    try {
      if (!document.fullscreenElement) await bezelRef.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  const accent = config.accent;
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div className="space-y-3">
      {(!fs || inKiosk) && (
        <DashVariantGallery variants={DASH_VARIANTS} activeId={activeId} onSelect={loadVariant} />
      )}
      {customize && (!fs || inKiosk) && (
        <DashboardCustomizer config={config} update={update} reset={reset} />
      )}
      <div
        ref={bezelRef}
        className={`dash-bezel font-digi select-none overflow-hidden rounded-2xl ${fs && !inKiosk ? "w-screen h-screen flex flex-col justify-center max-w-none p-3" : "w-full p-2.5"}`}
      >
        <div className={`flex gap-2 ${fs ? "max-w-5xl mx-auto w-full" : ""}`}>
          {/* Left bezel status LEDs */}
          <div className="flex flex-col items-center justify-center gap-2 py-3 px-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: theme.ledGreen, boxShadow: `0 0 6px ${theme.ledGreen}`, opacity: i === 0 ? 1 : 0.4 }} />
            ))}
          </div>
          {/* Screen */}
          <div className="flex-1 min-w-0 relative rounded-lg overflow-hidden dash-bezel-inner flex flex-col" style={{ background: theme.bg }}>
            {/* Header */}
            <div className="flex items-center justify-between px-2 py-1 text-[10px] border-b relative z-10 shrink-0" style={{ borderColor: theme.panelEdge, color: theme.text }}>
              <div className="flex items-center gap-2.5">
                <span className="tabular-nums" style={{ color: theme.text }}>{clock}</span>
                <span style={{ color: theme.label }}>AIR <span style={{ color: theme.text }}>{data.air_temp != null ? data.air_temp.toFixed(1) : "0.0"}°</span></span>
                <span style={{ color: theme.label }}>TRK <span style={{ color: theme.text }}>{data.track_temp != null ? data.track_temp.toFixed(1) : "0.0"}°</span></span>
              </div>
              <div className="flex items-center gap-2">
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
            <div ref={wrapRef} className="flex-1 min-h-0 w-full relative">
              <div className="absolute" style={{ width: CW, height: CH, left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center", background: theme.bg }}>
                {variant.layout.map((w) => {
                  const color = w.color || accent;
                  return (
                    <div
                      key={w.id}
                      className="absolute rounded-lg overflow-hidden"
                      style={{
                        left: w.x, top: w.y, width: w.w, height: w.h,
                        fontSize: `${Math.max(10, Math.min(20, w.h * 0.06))}px`,
                        border: `1px solid ${theme.panelEdge}`,
                        background: theme.panel,
                        boxShadow: `inset 0 0 0 1px ${theme.panelEdge}55, inset 0 1px 2px rgba(0,0,0,0.4)`,
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

            {/* Glass overlay — reflection, scanlines, pixel grid, vignette */}
            <div className="dash-glass absolute inset-0 z-20" />
            <div className="dash-pixel-grid absolute inset-0 z-20" />
          </div>
          {/* Right bezel status LEDs */}
          <div className="flex flex-col items-center justify-center gap-2 py-3 px-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: theme.ledGreen, boxShadow: `0 0 6px ${theme.ledGreen}`, opacity: i === 0 ? 1 : 0.4 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}