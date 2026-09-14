import { useRef, useState, useEffect } from "react";
import { Maximize2, Minimize2, Sliders, LayoutGrid, Plus, RotateCcw, Check } from "lucide-react";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useCustomLayout } from "@/hooks/useCustomLayout";
import { useFlashToggle } from "@/hooks/useFlashToggle";
import { useTrend } from "@/hooks/useTrend";
import BezelLEDs from "@/components/live/BezelLEDs";
import { WIDGET_DEFS } from "@/components/live/dashboardWidgets";
import WidgetPicker from "@/components/live/WidgetPicker";
import { renderWidget, panelBevel } from "@/components/live/dashboardWidgets";
import { DASH_VARIANTS, getVariant } from "@/lib/dashboardVariants";
import { deriveCapabilities } from "@/lib/dashboardCapabilities";
import DashboardCustomizer from "@/components/live/DashboardCustomizer";
import DashVariantGallery from "@/components/live/DashVariantGallery";
import PortraitDashboard from "@/components/live/PortraitDashboard";
import AlarmOverlay from "@/components/live/AlarmOverlay";

const CW = 1000, CH = 560;
const pad = (n) => String(n).padStart(2, "0");
const TREND_KEYS = ["fuel_litres", "lap_delta", "tyres.fl.temp_c", "tyres.fr.temp_c", "tyres.rl.temp_c", "tyres.rr.temp_c"];

export default function DDU3Dashboard({ data, demo, inKiosk = false }) {
  const bezelRef = useRef(null);
  const wrapRef = useRef(null);
  const [fs, setFs] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [scale, setScale] = useState(0.76);
  const [now, setNow] = useState(new Date());
  const [isPortrait, setIsPortrait] = useState(false);
  const { config, activeId, loadVariant, update, reset } = useDashboardConfig();
  const variant = getVariant(activeId);
  const flash = useFlashToggle(2.5);
  const trends = useTrend(data, TREND_KEYS);
  const theme = variant.theme;
  const { getSlotType, setSlotType, clearSlot, resetLayout } = useCustomLayout(activeId, false);
  const { getSlotType: getPortraitType, setSlotType: setPortraitType, clearSlot: clearPortraitSlot, resetLayout: resetPortraitLayout } = useCustomLayout(activeId, true);
  const [editing, setEditing] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(null);

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
    const detect = () => setIsPortrait(window.innerHeight > window.innerWidth);
    detect();
    window.addEventListener("resize", detect);
    window.addEventListener("orientationchange", detect);
    return () => {
      window.removeEventListener("resize", detect);
      window.removeEventListener("orientationchange", detect);
    };
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
  const caps = deriveCapabilities(data);
  const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <div className={inKiosk ? "flex flex-col h-full gap-3" : "space-y-3"}>
      {editing && (!fs || inKiosk) && (
        <div className="flex items-center justify-between gap-2 px-1">
          <button
            onClick={() => { resetLayout(); if (isPortrait) resetPortraitLayout(); }}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset to default
          </button>
          <span className="text-xs text-muted-foreground hidden sm:block">Tap a slot to change its widget</span>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground"
          >
            <Check className="w-3.5 h-3.5" /> Done
          </button>
        </div>
      )}
      {!editing && (!fs || inKiosk) && (
        <DashVariantGallery variants={DASH_VARIANTS} activeId={activeId} onSelect={loadVariant} />
      )}
      {customize && (!fs || inKiosk) && (
        <DashboardCustomizer config={config} update={update} reset={reset} />
      )}
      <div
        ref={bezelRef}
        className={`dash-bezel font-digi select-none overflow-hidden rounded-2xl ${fs && !inKiosk ? "w-screen h-screen flex flex-col justify-center max-w-none p-3" : inKiosk ? "flex-1 min-h-0 w-full p-2.5" : isPortrait ? "w-full p-2.5 h-[78vh] min-h-[440px]" : "w-full p-2.5 aspect-[16/9]"}`}
      >
        <div className={`flex gap-2 h-full ${fs ? "max-w-5xl mx-auto w-full" : ""}`}>
          {/* Left bezel status LEDs — functional indicators */}
          <BezelLEDs data={data} caps={caps} theme={theme} side="left" />
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
                <button onClick={() => setEditing((e) => !e)} className="p-0.5 rounded transition-colors" style={{ color: editing ? accent : theme.label }} aria-label="Edit layout">
                  <LayoutGrid className="w-3 h-3" />
                </button>
                <button onClick={toggleFs} className="p-0.5 rounded transition-colors" style={{ color: theme.label }} aria-label="Fullscreen">
                  {fs ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={wrapRef} className="flex-1 min-h-0 w-full relative">
              {isPortrait ? (
                <PortraitDashboard
                  data={data} variant={variant} config={config} caps={caps}
                  editing={editing}
                  flash={flash} trends={trends}
                  getSlotType={getPortraitType}
                  onSlotTap={(id, currentType) => setPickerSlot({ id, currentType, portrait: true })}
                />
              ) : (
                <div className="absolute" style={{ width: CW, height: CH, left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center", background: theme.bg }}>
                  {variant.layout.map((w) => {
                    const color = w.color || accent;
                    const effectiveType = getSlotType(w.id, w.type);
                    const isEmpty = effectiveType === "empty";
                    const def = WIDGET_DEFS.find((d) => d.type === effectiveType);
                    return (
                      <div
                        key={w.id}
                        className="absolute rounded-lg overflow-hidden"
                        style={{
                          left: w.x, top: w.y, width: w.w, height: w.h,
                          fontSize: `${Math.max(10, Math.min(20, w.h * 0.06))}px`,
                          border: editing ? `1px dashed ${accent}` : `1px solid ${theme.panelEdge}`,
                          background: theme.panel,
                          boxShadow: editing ? "none" : panelBevel(theme),
                          cursor: editing ? "pointer" : "default",
                        }}
                        onClick={editing ? () => setPickerSlot({ id: w.id, currentType: effectiveType }) : undefined}
                      >
                        {editing && (
                          <div className="absolute top-1 left-1 z-30 font-digi pointer-events-none" style={{ fontSize: 9, color: theme.label, background: theme.panel, padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
                            {isEmpty ? "EMPTY" : def?.label || effectiveType}
                          </div>
                        )}
                        {isEmpty ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5" style={{ opacity: 0.4 }}>
                            {editing && (
                              <>
                                <div className="rounded-full p-2" style={{ border: `1px dashed ${theme.label}`, opacity: 0.6 }}>
                                  <Plus className="w-4 h-4" style={{ color: theme.label }} />
                                </div>
                                <span className="font-digi" style={{ fontSize: 8, color: theme.label, letterSpacing: "0.1em" }}>TAP TO ASSIGN</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-full" style={{ opacity: editing ? 0.6 : 1 }}>
                            {renderWidget(effectiveType, { data, color, w: w.w, h: w.h, theme, shape: variant.shape, units: config.units, caps, flash, trends })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Alarm / flag overlay — flashes over the dash when active */}
            <AlarmOverlay data={data} caps={caps} flash={flash} />

            {/* Glass overlay — subtle reflection and vignette (landscape only) */}
            {!isPortrait && <div className="dash-glass absolute inset-0 z-20" />}
          </div>
          {/* Right bezel status LEDs — functional indicators */}
          <BezelLEDs data={data} caps={caps} theme={theme} side="right" />
        </div>
      </div>
      <WidgetPicker
        open={!!pickerSlot}
        onOpenChange={(o) => { if (!o) setPickerSlot(null); }}
        currentType={pickerSlot?.currentType}
        onSelect={(type) => {
          if (!pickerSlot) return;
          if (pickerSlot.portrait) setPortraitType(pickerSlot.id, type);
          else setSlotType(pickerSlot.id, type);
          setPickerSlot(null);
        }}
        onClear={() => {
          if (!pickerSlot) return;
          if (pickerSlot.portrait) clearPortraitSlot(pickerSlot.id);
          else clearSlot(pickerSlot.id);
          setPickerSlot(null);
        }}
      />
    </div>
  );
}