import { useState, useEffect } from "react";
import { WIDGET_DEFS } from "@/components/live/dashboardWidgets";

const KEY = "ddu3-config";

const DEFAULT_WIDGETS = [
  { id: "w_shift", type: "shiftLights", x: 20, y: 10, w: 960, h: 36, color: null },
  { id: "w_tyres", type: "tyres", x: 20, y: 60, w: 300, h: 300, color: null },
  { id: "w_inputs", type: "inputs", x: 20, y: 370, w: 300, h: 170, color: null },
  { id: "w_fuel", type: "fuel", x: 340, y: 60, w: 300, h: 180, color: null },
  { id: "w_gear", type: "gear", x: 340, y: 250, w: 300, h: 200, color: null },
  { id: "w_delta", type: "delta", x: 660, y: 60, w: 320, h: 150, color: null },
  { id: "w_laps", type: "laps", x: 660, y: 220, w: 320, h: 90, color: null },
  { id: "w_cars", type: "cars", x: 660, y: 320, w: 320, h: 220, color: null },
  { id: "w_status", type: "status", x: 20, y: 500, w: 960, h: 50, color: null },
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