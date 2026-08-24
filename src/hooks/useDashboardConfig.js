import { useState, useEffect } from "react";

const DEFAULT = {
  accent: "#00e5ff",
  scale: 1,
  gearScale: 1,
  tyreScale: 1,
  deltaScale: 1,
  show: {
    shiftLights: true,
    sideLeds: true,
    tyres: true,
    fuel: true,
    gear: true,
    delta: true,
    cars: true,
    bottom: true,
  },
  layout: [33, 34, 33],
};

const KEY = "ddu3-config";

export function useDashboardConfig() {
  const [config, setConfig] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT,
          ...parsed,
          show: { ...DEFAULT.show, ...(parsed.show || {}) },
        };
      }
    } catch { /* ignore */ }
    return DEFAULT;
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(config)); } catch { /* ignore */ }
  }, [config]);

  const update = (patch) => setConfig((c) => ({ ...c, ...patch }));
  const toggle = (key) => setConfig((c) => ({ ...c, show: { ...c.show, [key]: !c.show[key] } }));
  const reset = () => setConfig(DEFAULT);

  return { config, update, toggle, reset };
}