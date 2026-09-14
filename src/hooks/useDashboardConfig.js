import { useState, useEffect, useCallback } from "react";
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
        units: { ...variant.units, ...(p.units || {}) },
      };
    }
  } catch { /* ignore */ }
  return { accent: variant.theme.accent, units: { ...variant.units } };
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
  const reset = useCallback(() => {
    const variant = getVariant(activeId);
    setConfig({ accent: variant.theme.accent, units: { ...variant.units } });
  }, [activeId]);
  const loadVariant = useCallback((id) => {
    if (!DASH_VARIANTS.some((v) => v.id === id)) return;
    setActiveId(id);
    setConfig(loadSaved(id));
  }, []);

  return { config, activeId, loadVariant, update, reset };
}