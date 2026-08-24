import { useState, useEffect, useCallback } from "react";
import { WIDGET_DEFS } from "@/components/live/dashboardWidgets";
import { DASH_VARIANTS, getVariant } from "@/lib/dashboardVariants";

const ACTIVE_KEY = "simsetapp-dash-active";
const cfgKey = (id) => `simsetapp-dash-config-${id}`;

function loadSaved(variantId) {
  const variant = getVariant(variantId);
  try {
    const raw = localStorage.getItem(cfgKey(variantId));
    if (raw) {
      const p = JSON.parse(raw);
      return {
        accent: p.accent ?? variant.theme.accent,
        scale: p.scale ?? 1,
        widgets: p.widgets && p.widgets.length ? p.widgets : variant.layout,
      };
    }
  } catch { /* ignore */ }
  return { accent: variant.theme.accent, scale: 1, widgets: variant.layout };
}

export function useDashboardConfig() {
  const [activeId, setActiveId] = useState(() => {
    const stored = localStorage.getItem(ACTIVE_KEY);
    return stored && DASH_VARIANTS.some((v) => v.id === stored) ? stored : DASH_VARIANTS[0].id;
  });
  const [config, setConfig] = useState(() =>
    loadSaved(localStorage.getItem(ACTIVE_KEY) || DASH_VARIANTS[0].id)
  );

  useEffect(() => {
    try { localStorage.setItem(ACTIVE_KEY, activeId); } catch { /* ignore */ }
  }, [activeId]);
  useEffect(() => {
    try { localStorage.setItem(cfgKey(activeId), JSON.stringify(config)); } catch { /* ignore */ }
  }, [config, activeId]);

  const update = useCallback((patch) => setConfig((c) => ({ ...c, ...patch })), []);
  const updateWidget = useCallback((id, patch) =>
    setConfig((c) => ({ ...c, widgets: c.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)) })), []);
  const addWidget = useCallback((type) => {
    const def = WIDGET_DEFS.find((d) => d.type === type);
    if (!def) return;
    setConfig((c) => ({
      ...c,
      widgets: [...c.widgets, { id: `w_${Date.now()}`, type, x: 120, y: 120, w: def.w, h: def.h, color: null }],
    }));
  }, []);
  const removeWidget = useCallback((id) =>
    setConfig((c) => ({ ...c, widgets: c.widgets.filter((w) => w.id !== id) })), []);
  const resetLayout = useCallback(() => {
    const variant = getVariant(activeId);
    setConfig((c) => ({ ...c, widgets: variant.layout }));
  }, [activeId]);
  const reset = useCallback(() => {
    const variant = getVariant(activeId);
    setConfig({ accent: variant.theme.accent, scale: 1, widgets: variant.layout });
  }, [activeId]);
  const loadVariant = useCallback((id) => {
    if (!DASH_VARIANTS.some((v) => v.id === id)) return;
    setActiveId(id);
    setConfig(loadSaved(id));
  }, []);

  return { config, activeId, loadVariant, update, updateWidget, addWidget, removeWidget, resetLayout, reset };
}