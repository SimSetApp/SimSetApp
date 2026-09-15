import { useRef, useEffect, useState } from "react";
import { Plus, Lock } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { renderWidget, WIDGET_DEF_MAP, panelBevel } from "@/components/live/dashboardWidgets";
import { PORTRAIT_LAYOUT, CORE_TYPES, PORTRAIT_CORE_HEIGHTS } from "@/lib/dashboardVariants";

/**
 * Mobile-portrait vertical flex-stack with multi-screen support.
 * Core items (rpmBar, gear, speed) have fixed pixel heights and stay mounted
 * across screen changes. Peripheral items flex-fill the remaining space and
 * cross-fade when the active screen changes. Supports per-variant custom
 * widget assignment via tap-to-assign (peripheral slots only).
 */
export default function PortraitDashboard({ data, variant, config, caps, editing, trends, activeScreen = "race1", getSlotType, onSlotTap }) {
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 360, h: 640 });
  const theme = variant.theme;
  const accent = config.accent;

  useEffect(() => {
    const measure = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      const h = ref.current.clientHeight;
      if (w && h) setDims({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const portraitLayout = variant.portraitScreens?.[activeScreen] || variant.portraitLayout || PORTRAIT_LAYOUT;
  const coreItems = portraitLayout.filter((item) => CORE_TYPES.has(item.type));
  const peripheralItems = portraitLayout.filter((item) => !CORE_TYPES.has(item.type));
  const totalPeriphFlex = peripheralItems.reduce((a, b) => a + b.flex, 0);
  const gap = 4;
  const coreHeight = coreItems.reduce((a, item) => a + (PORTRAIT_CORE_HEIGHTS[item.type] || 60), 0);
  const periphH = Math.max(0, dims.h - coreHeight - coreItems.length * gap - peripheralItems.length * gap - 8);

  const renderSlot = (item, i, isCore) => {
    const slotId = `p${i}_${item.type}`;
    const effectiveType = isCore ? item.type : (getSlotType ? getSlotType(slotId, item.type) : item.type);
    const isEmpty = effectiveType === "empty";
    const def = WIDGET_DEF_MAP.get(effectiveType);
    const itemH = isCore ? (PORTRAIT_CORE_HEIGHTS[item.type] || 60) : (periphH * item.flex) / Math.max(1, totalPeriphFlex);
    return (
      <div
        key={slotId}
        className="overflow-hidden relative"
        style={{
          ...(isCore ? { height: itemH, flexShrink: 0 } : { flex: `${item.flex} 1 0`, minHeight: 0 }),
          border: editing && !isCore ? `1px dashed ${accent}` : "none",
          background: "transparent",
          boxShadow: "none",
          cursor: editing && !isCore ? "pointer" : "default",
        }}
        onClick={editing && !isCore && onSlotTap ? () => onSlotTap(slotId, effectiveType) : undefined}
      >
        {editing && !isCore && (
          <div className="absolute top-1 left-1 z-30 font-digi pointer-events-none" style={{ fontSize: 9, color: theme.label, background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
            {isEmpty ? "EMPTY" : def?.label || effectiveType}
          </div>
        )}
        {editing && isCore && (
          <div className="absolute top-1 left-1 z-30 font-digi pointer-events-none flex items-center gap-0.5" style={{ fontSize: 8, color: theme.label, background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
            <Lock className="w-2 h-2" /> {def?.label || effectiveType}
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
          <div className="w-full h-full" style={{ fontSize: `${Math.max(10, Math.min(20, itemH * 0.06))}px` }}>
            {renderWidget(effectiveType, {
              data,
              color: accent,
              w: dims.w,
              h: itemH,
              theme,
              shape: variant.shape,
              units: config.units,
              caps,
              trends,
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className="w-full h-full flex flex-col gap-1 p-1" style={{ background: theme.bg }}>
      {/* Core items — fixed height, always mounted */}
      {coreItems.map((item, i) => renderSlot(item, i, true))}
      {/* Peripheral items — flex-fill, cross-fade per screen */}
      <div className="flex-1 relative min-h-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeScreen}
            className="absolute inset-0 flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {peripheralItems.map((item, i) => renderSlot(item, coreItems.length + i, false))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}