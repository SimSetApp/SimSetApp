import { useState, useEffect, useCallback } from "react";

const layoutKey = (variantId, portrait) =>
  `simsetapp-dashLayout-${variantId}${portrait ? "-portrait" : ""}`;

/**
 * Per-variant custom widget layouts. Stores only the `type` override per slot
 * (keyed by slot id) — positions and sizes stay fixed from the variant default,
 * so layouts always remain aligned. Portrait uses a separate key so landscape
 * and portrait arrangements can differ independently.
 */
export function useCustomLayout(variantId, isPortrait) {
  const [overrides, setOverrides] = useState({});

  // Load when variant or orientation changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(layoutKey(variantId, isPortrait));
      setOverrides(raw ? JSON.parse(raw) : {});
    } catch {
      setOverrides({});
    }
  }, [variantId, isPortrait]);

  // Persist only on explicit user actions (not on load) — avoids race where
  // switching variants would overwrite the new variant's stored layout with
  // the previous variant's in-memory state.
  const persist = useCallback((next) => {
    setOverrides(next);
    try {
      localStorage.setItem(layoutKey(variantId, isPortrait), JSON.stringify(next));
    } catch { /* ignore */ }
  }, [variantId, isPortrait]);

  const getSlotType = useCallback((slotId, defaultType) => {
    const o = overrides[slotId];
    if (o === "empty") return "empty";
    return o || defaultType;
  }, [overrides]);

  const setSlotType = useCallback((slotId, type) => {
    persist({ ...overrides, [slotId]: type });
  }, [overrides, persist]);

  const clearSlot = useCallback((slotId) => {
    persist({ ...overrides, [slotId]: "empty" });
  }, [overrides, persist]);

  const resetLayout = useCallback(() => {
    persist({});
    try {
      localStorage.removeItem(layoutKey(variantId, isPortrait));
    } catch { /* ignore */ }
  }, [persist, variantId, isPortrait]);

  return { getSlotType, setSlotType, clearSlot, resetLayout };
}