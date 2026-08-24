import { useState, useEffect } from "react";
import { WIDGET_DEFS } from "@/components/live/dashboardWidgets";

const KEY = "ddu3-config-v2";

// Non-overlapping grid layout within the 1000×560 design canvas.
// Columns: left (16–316), center (332–668), right (680–984).
// Rows: shift strip (8–40), body (48–508), status strip (516–552).
const DEFAULT_WIDGETS = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 32, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 48, w: 300, h: 300, color: null },
  { id: "w_inputs", type: "inputs", x: 16, y: 356, w: 300, h: 152, color: null },
  { id: "w_fuel", type: "fuel", x: 332, y: 48, w: 336, h: 176, color: null },
  { id: "w_gear", type: "gear", x: 332, y: 232, w: 336, h: 276, color: null },
  { id: "w_delta", type: "delta", x: 680, y: 48, w: 304, h: 140, color: null },
  { id: "w_laps", type: "laps", x: 680, y: 196, w: 304, h: 84, color: null },
  { id: "w_cars", type: "cars", x: 680, y: 288, w: 304, h: 220, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

const DEFAULT = {
  accent: "#00e5ff",
  scale: 1,
  widgets: DEFAULT_WIDGETS,
};

export function useDashboardConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return {
          ...DEFAULT,
          ...p,
          widgets: p.widgets && p.widgets.length ? p.widgets : DEFAULT_WIDGETS,
        };
      }
    } catch { /* ignore */ }
    return DEFAULT;
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(config)); } catch { /* ignore */ }
  }, [config]);

  const update = (patch) => setConfig((c) => ({ ...c, ...patch }));
  const updateWidget = (id, patch) =>
    setConfig((c) => ({ ...c, widgets: c.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)) }));
  const addWidget = (type) => {
    const def = WIDGET_DEFS.find((d) => d.type === type);
    if (!def) return;
    setConfig((c) => ({
      ...c,
      widgets: [...c.widgets, { id: `w_${Date.now()}`, type, x: 120, y: 120, w: def.w, h: def.h, color: null }],
    }));
  };
  const removeWidget = (id) => setConfig((c) => ({ ...c, widgets: c.widgets.filter((w) => w.id !== id) }));
  const resetLayout = () => setConfig((c) => ({ ...c, widgets: DEFAULT_WIDGETS }));
  const reset = () => setConfig(DEFAULT);

  return { config, update, updateWidget, addWidget, removeWidget, resetLayout, reset };
}