import { useState, useEffect, useCallback } from "react";

const layoutKey = (variantId, portrait, namespace = "") =>
  `simsetapp-dashLayout-${variantId}${portrait ? "-portrait" : ""}${namespace ? `-${namespace}` : ""}`;

/**
 * Per-variant custom widget layouts. Stores only the `type` override per slot
 * (keyed by slot id) — positions and sizes stay fixed from the variant default,
 * so layouts always remain aligned. Portrait uses a separate key so landscape
 * and portrait arrangements can differ independently. An optional `namespace`
 * isolates kiosk/fullscreen dashboards from the main page.
 */
export function useCustomLayout(variantId, isPortrait, namespace = "") {
  const [overrides, setOverrides] = useState({});

  // Load when variant, orientation, or namespace changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(layoutKey(variantId, isPortrait, namespace));
      setOverrides(raw ? JSON.parse(raw) : {});
    } catch {
      setOverrides({});
    }
  }, [variantId, isPortrait, namespace]);

  // Persist only on explicit user actions (not on load) — avoids race where
  // switching variants would overwrite the new variant's stored layout with
  // the previous variant's in-memory state.
  const persist = useCallback((next) => {
    setOverrides(next);
    try {
      localStorage.setItem(layoutKey(variantId, isPortrait, namespace), JSON.stringify(next));
    } catch { /* ignore */ }
  }, [variantId, isPortrait, namespace]);

  const getSlotType = useCallback((slotId, defaultType) => {
    const o = overrides[slotId];
    if (o === "empty") return "empty";
    return o ?? defaultType;
  }, [overrides]);

  const setSlotType = useCallback((slotId, type) => {
    persist({ ...overrides, [slotId]: type });
  }, [overrides, persist]);

  const clearSlot = useCallback((slotId) => {
    persist({ ...overrides, [slotId]: "empty" });
  }, [overrides, persist]);

  const resetLayout = useCallback(() => {
    setOverrides({});
    try {
      localStorage.removeItem(layoutKey(variantId, isPortrait, namespace));
    } catch { /* ignore */ }
  }, [variantId, isPortrait, namespace]);

  return { getSlotType, setSlotType, clearSlot, resetLayout };
}