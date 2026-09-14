import { useRef, useEffect, useState } from "react";
import { renderWidget } from "@/components/live/dashboardWidgets";
import { PORTRAIT_LAYOUT } from "@/lib/dashboardVariants";

/**
 * Mobile-portrait vertical flex-stack.
 * Instead of shrinking the 1000×560 landscape canvas, portrait renders a
 * vertical stack (RPM bar → gear → speed → delta → tyres → fuel → laps) that
 * reflows to fill the screen at full size. Each item's pixel height is
 * computed from its flex weight so widget font-sizing stays accurate.
 */
export default function PortraitDashboard({ data, variant, config, caps }) {
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

  const totalFlex = PORTRAIT_LAYOUT.reduce((a, b) => a + b.flex, 0);
  const gap = 4;
  const totalGap = gap * (PORTRAIT_LAYOUT.length - 1);
  const availH = Math.max(0, dims.h - totalGap - 8);

  return (
    <div ref={ref} className="w-full h-full flex flex-col gap-1 p-1" style={{ background: theme.bg }}>
      {PORTRAIT_LAYOUT.map((item, i) => {
        const itemH = (availH * item.flex) / totalFlex;
        return (
          <div
            key={i}
            className="rounded-lg overflow-hidden"
            style={{
              flex: `${item.flex} 1 0`,
              minHeight: 0,
              border: `1px solid ${theme.panelEdge}`,
              background: theme.panel,
              boxShadow: `inset 0 0 0 1px ${theme.panelEdge}55, inset 0 1px 2px rgba(0,0,0,0.4)`,
            }}
          >
            <div className="w-full h-full" style={{ fontSize: `${Math.max(10, Math.min(20, itemH * 0.06))}px` }}>
              {renderWidget(item.type, {
                data,
                color: accent,
                w: dims.w,
                h: itemH,
                theme,
                shape: variant.shape,
                units: config.units,
                caps,
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}