import { useRef, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { renderWidget, WIDGET_DEFS, panelBevel } from "@/components/live/dashboardWidgets";
import { PORTRAIT_LAYOUT } from "@/lib/dashboardVariants";

/**
 * Mobile-portrait vertical flex-stack.
 * Instead of shrinking the 1000×560 landscape canvas, portrait renders a
 * vertical stack that reflows to fill the screen at full size. Each item's
 * pixel height is computed from its flex weight so widget font-sizing stays
 * accurate. Supports per-variant custom widget assignment via tap-to-assign.
 */
export default function PortraitDashboard({ data, variant, config, caps, editing, flash, trends, getSlotType, onSlotTap }) {
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

  const portraitLayout = variant.portraitLayout || PORTRAIT_LAYOUT;
  const totalFlex = portraitLayout.reduce((a, b) => a + b.flex, 0);
  const gap = 4;
  const totalGap = gap * (portraitLayout.length - 1);
  const availH = Math.max(0, dims.h - totalGap - 8);

  return (
    <div ref={ref} className="w-full h-full flex flex-col gap-1 p-1" style={{ background: theme.bg }}>
      {portraitLayout.map((item, i) => {
        const slotId = `p${i}`;
        const effectiveType = getSlotType ? getSlotType(slotId, item.type) : item.type;
        const isEmpty = effectiveType === "empty";
        const def = WIDGET_DEFS.find((d) => d.type === effectiveType);
        const itemH = (availH * item.flex) / totalFlex;
        return (
          <div
            key={i}
            className="rounded-lg overflow-hidden relative"
            style={{
              flex: `${item.flex} 1 0`,
              minHeight: 0,
              border: editing ? `1px dashed ${accent}` : `1px solid ${theme.panelEdge}`,
              background: theme.panel,
              boxShadow: editing ? "none" : panelBevel(theme),
              cursor: editing ? "pointer" : "default",
            }}
            onClick={editing && onSlotTap ? () => onSlotTap(slotId, effectiveType) : undefined}
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
              <div className="w-full h-full" style={{ fontSize: `${Math.max(10, Math.min(20, itemH * 0.06))}px`, opacity: editing ? 0.6 : 1 }}>
                {renderWidget(effectiveType, {
                  data,
                  color: accent,
                  w: dims.w,
                  h: itemH,
                  theme,
                  shape: variant.shape,
                  units: config.units,
                  caps,
                  flash,
                  trends,
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}