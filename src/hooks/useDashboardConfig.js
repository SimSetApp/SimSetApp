import { useState, useEffect, useCallback } from "react";
import { DASH_VARIANTS, getVariant } from "@/lib/dashboardVariants";

const activeKey = (namespace) => namespace ? `simsetapp-dash-active-${namespace}` : "simsetapp-dash-active";
const cfgKey = (id, namespace) => namespace ? `simsetapp-dash-config-${id}-${namespace}` : `simsetapp-dash-config-${id}`;

function loadSaved(variantId, namespace = "") {
  const variant = getVariant(variantId);
  try {
    const raw = localStorage.getItem(cfgKey(variantId, namespace));
    if (raw) {
      const p = JSON.parse(raw);
      return {
        accent: p.accent ?? variant.theme.accent,
        units: { ...variant.units, ...(p.units || {}) },
        activeScreen: p.activeScreen || "race1",
      };
    }
  } catch { /* ignore */ }
  return { accent: variant.theme.accent, units: { ...variant.units }, activeScreen: "race1" };
}

export function useDashboardConfig(namespace = "") {
  const [activeId, setActiveId] = useState(() => {
    const stored = localStorage.getItem(activeKey(namespace));
    return stored && DASH_VARIANTS.some((v) => v.id === stored) ? stored : DASH_VARIANTS[0].id;
  });
  const [config, setConfig] = useState(() =>
    loadSaved(localStorage.getItem(activeKey(namespace)) || DASH_VARIANTS[0].id, namespace)
  );

  useEffect(() => {
    try { localStorage.setItem(activeKey(namespace), activeId); } catch { /* ignore */ }
  }, [activeId, namespace]);
  useEffect(() => {
    try { localStorage.setItem(cfgKey(activeId, namespace), JSON.stringify(config)); } catch { /* ignore */ }
  }, [config, activeId, namespace]);

  const update = useCallback((patch) => setConfig((c) => ({ ...c, ...patch })), []);
  const setActiveScreen = useCallback((screen) => setConfig((c) => ({ ...c, activeScreen: screen })), []);
  const reset = useCallback(() => {
    const variant = getVariant(activeId);
    setConfig({ accent: variant.theme.accent, units: { ...variant.units }, activeScreen: "race1" });
  }, [activeId]);
  const loadVariant = useCallback((id) => {
    if (!DASH_VARIANTS.some((v) => v.id === id)) return;
    setActiveId(id);
    setConfig(loadSaved(id, namespace));
  }, [namespace]);

  return { config, activeId, loadVariant, update, reset, setActiveScreen };
}