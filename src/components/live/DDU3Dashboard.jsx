import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Maximize2, Minimize2, Sliders, LayoutGrid, Plus, RotateCcw, Check, AlertTriangle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboardConfig } from "@/hooks/useDashboardConfig";
import { useCustomLayout } from "@/hooks/useCustomLayout";
import { FlashProvider } from "@/lib/flashContext";
import { useTrend } from "@/hooks/useTrend";
import { useCapabilities } from "@/lib/dashboardCapabilities";
import BezelLEDs from "@/components/live/BezelLEDs";
import { WIDGET_DEFS, WIDGET_DEF_MAP } from "@/components/live/dashboardWidgets";
import WidgetPicker from "@/components/live/WidgetPicker";
import { renderWidget, panelBevel } from "@/components/live/dashboardWidgets";
import { DASH_VARIANTS, getVariant, CORE_TYPES, SCREEN_DEFS } from "@/lib/dashboardVariants";
import DashboardCustomizer from "@/components/live/DashboardCustomizer";
import DashVariantGallery from "@/components/live/DashVariantGallery";
import PortraitDashboard from "@/components/live/PortraitDashboard";
import AlarmOverlay from "@/components/live/AlarmOverlay";
import ScreenTabs, { ScreenDots } from "@/components/live/ScreenTabs";
import DashSlot from "@/components/live/DashSlot";

const CW = 1000, CH = 560;
const pad = (n) => String(n).padStart(2, "0");
const TREND_KEYS = ["fuel_litres", "lap_delta", "tyres.fl.temp_c", "tyres.fr.temp_c", "tyres.rl.temp_c", "tyres.rr.temp_c"];

// Isolated clock — its 1Hz setNow tick re-renders only this component, not
// the entire dashboard canvas + all widgets on top of the 20fps telemetry.
function DashClock({ theme }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums" style={{ color: theme.text }}>
      {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
    </span>
  );
}

function DDU3DashboardInner({ data, demo, inKiosk = false, namespace = "", stale = false }) {
  const bezelRef = useRef(null);
  const wrapRef = useRef(null);
  const [fs, setFs] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [scale, setScale] = useState(0.76);
  const [isPortrait, setIsPortrait] = useState(false);
  const { config, activeId, loadVariant, update, reset, setActiveScreen } = useDashboardConfig(namespace);
  const activeScreen = config.activeScreen || "race1";
  const variant = getVariant(activeId);
  const trends = useTrend(data, TREND_KEYS);
  const caps = useCapabilities(data);
  const theme = variant.theme;
  const { getSlotType, setSlotType, clearSlot, resetLayout } = useCustomLayout(activeId, false, namespace, activeScreen);
  const { getSlotType: getPortraitType, setSlotType: setPortraitType, clearSlot: clearPortraitSlot, resetLayout: resetPortraitLayout } = useCustomLayout(activeId, true, namespace, activeScreen);
  const [editing, setEditing] = useState(false);
  const [pickerSlot, setPickerSlot] = useState(null);

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
    // Cancel any pending rAF on cleanup (P9) — no document-level scroll listener (P2)
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [fs, isPortrait]);

  const toggleFs = async () => {
    if (inKiosk) {
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
      const w = window.open("/dashboard-fullscreen", "simsetapp-dash", "width=1280,height=720");
      if (w) w.focus();
      return;
    }
    try {
      if (!document.fullscreenElement) await bezelRef.current?.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch { /* ignore */ }
  };

  const accent = config.accent;
  const flagCol = caps?.flags && data.flag_state
    ? { red: "#ff1a1a", yellow: "#ffe600", yellow_full: "#ffe600", blue: "#3b82f6", green: "#00ff66", checkered: "#ffffff" }[data.flag_state]
    : null;

  // Screen cycling (swipe + buttons)
  const dragRef = useRef(null);
  const cycleScreen = useCallback((dir) => {
    const idx = SCREEN_DEFS.findIndex((s) => s.id === activeScreen);
    const next = SCREEN_DEFS[(idx + dir + SCREEN_DEFS.length) % SCREEN_DEFS.length].id;
    setActiveScreen(next);
  }, [activeScreen, setActiveScreen]);
  const onPointerDown = (e) => {
    if (editing) return;
    dragRef.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (dragRef.current == null) return;
    const dx = e.clientX - dragRef.current;
    if (Math.abs(dx) > 50) cycleScreen(dx > 0 ? -1 : 1);
    dragRef.current = null;
  };

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
      <FlashProvider>
      <div
        ref={bezelRef}
        className={`dash-bezel font-digi select-none overflow-hidden rounded-xl ${fs && !inKiosk ? "w-full h-full flex flex-col justify-center max-w-none p-3" : inKiosk ? "flex-1 min-h-0 w-full p-2.5" : isPortrait ? "w-full p-2.5 h-[78vh] min-h-[440px]" : "w-full p-2.5 aspect-[16/9]"}`}
      >
        <div className={`flex gap-2 h-full ${fs ? "max-w-7xl mx-auto w-full" : ""}`}>
          {/* Left bezel status LEDs — functional indicators */}
          <BezelLEDs data={data} caps={caps} theme={theme} side="left" />
          {/* Screen */}
          <div className="flex-1 min-w-0 relative rounded-lg overflow-hidden dash-bezel-inner flex flex-col" style={{ background: theme.bg }}>
            {/* Glass overlay — BEHIND widgets (z-0) so the specular sheen shows
                only in gaps between panels, never washing over telemetry numerals */}
            <div className="dash-glass absolute inset-0 z-0" />

            {/* Header — above glass */}
            <div className="flex items-center justify-between px-2 py-1 text-[10px] border-b relative z-10 shrink-0" style={{ borderColor: `${theme.panelEdge}88`, color: theme.text }}>
              <div className="flex items-center gap-2.5">
                <DashClock theme={theme} />
                <span style={{ color: theme.label }}>AIR <span style={{ color: theme.text }} className="tabular-nums">{data.air_temp != null ? data.air_temp.toFixed(1) : "--"}°</span></span>
                <span style={{ color: theme.label }}>TRK <span style={{ color: theme.text }} className="tabular-nums">{data.track_temp != null ? data.track_temp.toFixed(1) : "--"}°</span></span>
                {data.water_temp != null && <span style={{ color: theme.label }}>H₂O <span style={{ color: data.water_temp > 110 ? "#ff1a1a" : theme.text }} className="tabular-nums">{data.water_temp.toFixed(0)}°</span></span>}
                {data.oil_temp != null && <span style={{ color: theme.label }}>OIL <span style={{ color: data.oil_temp > 130 ? "#ff1a1a" : theme.text }} className="tabular-nums">{data.oil_temp.toFixed(0)}°</span></span>}
                {caps?.flags && (
                  <span className="font-digi font-bold px-1.5 rounded" style={{ color: flagCol || theme.dim, background: flagCol ? `${flagCol}22` : "transparent", letterSpacing: "0.1em" }}>
                    {data.flag_state ? data.flag_state.toUpperCase() : "GREEN"}
                  </span>
                )}
                {data.pit_limiter && (
                  <span className="font-digi font-bold px-1.5 rounded" style={{ color: "#ff9800", background: "#ff980022", letterSpacing: "0.1em" }}>
                    PIT {data.pit_speed_limit || 60}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ScreenTabs activeScreen={activeScreen} onScreenChange={setActiveScreen} accent={accent} labelColor={theme.label} />
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

            {/* Screen page dots */}
            <div className="flex items-center justify-center py-0.5 relative z-10 shrink-0" style={{ borderBottom: `1px solid ${theme.panelEdge}44` }}>
              <ScreenDots activeScreen={activeScreen} accent={accent} dim={theme.dim} />
            </div>

            {/* Canvas — above glass */}
            <div ref={wrapRef} className="flex-1 min-h-0 w-full relative z-10" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              {isPortrait ? (
                <PortraitDashboard
                  data={data} variant={variant} config={config} caps={caps}
                  editing={editing}
                  trends={trends}
                  activeScreen={activeScreen}
                  getSlotType={getPortraitType}
                  onSlotTap={(id, currentType) => setPickerSlot({ id, currentType, portrait: true })}
                />
              ) : (
                <div className="absolute" style={{ width: CW, height: CH, left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center", background: theme.bg }}>
                  {/* Hairline dividers between major zones — per-variant to avoid overlapping widgets */}
                  {(variant.dividers || []).map((dx, i) => (
                    <div key={`d${i}`} className="absolute pointer-events-none" style={{ left: dx, top: 56, bottom: 56, width: 1, background: theme.panelEdge, opacity: 0.5 }} />
                  ))}
                  {/* Core slots — always mounted, never swapped (gear/RPM/speed/status) */}
                  {variant.layout.filter((w) => CORE_TYPES.has(w.type)).map((w) => (
                    <DashSlot
                      key={w.id}
                      w={w}
                      effectiveType={w.type}
                      editing={editing}
                      accent={accent}
                      theme={theme}
                      data={data}
                      variant={variant}
                      config={config}
                      caps={caps}
                      trends={trends}
                      isCore
                    />
                  ))}
                  {/* Peripheral slots — cross-fade per screen */}
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={activeScreen}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {variant.layout.filter((w) => !CORE_TYPES.has(w.type)).map((w) => {
                        const screenDefault = variant.screens?.[activeScreen]?.[w.id] || w.type;
                        const effectiveType = getSlotType(w.id, screenDefault);
                        return (
                          <DashSlot
                            key={w.id}
                            w={w}
                            effectiveType={effectiveType}
                            editing={editing}
                            accent={accent}
                            theme={theme}
                            data={data}
                            variant={variant}
                            config={config}
                            caps={caps}
                            trends={trends}
                            isCore={false}
                            onSlotTap={(id, type) => setPickerSlot({ id, currentType: type })}
                          />
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Alarm / flag overlay — flashes over the dash when active */}
            <AlarmOverlay data={data} caps={caps} />

            {/* Stale-data watermark — dim + warning so frozen frames don't look live */}
            {stale && (
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ background: "rgba(0,0,0,0.45)" }}>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,152,0,0.5)" }}>
                  <AlertTriangle className="w-4 h-4" style={{ color: "#ff9800" }} />
                  <span className="font-digi text-xs tracking-widest" style={{ color: "#ff9800" }}>STALE — NO DATA</span>
                </div>
              </div>
            )}
          </div>
          {/* Right bezel status LEDs — functional indicators */}
          <BezelLEDs data={data} caps={caps} theme={theme} side="right" />
        </div>
      </div>
      </FlashProvider>
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

const DDU3Dashboard = memo(DDU3DashboardInner);
export default DDU3Dashboard;