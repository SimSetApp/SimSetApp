import { useState, useEffect } from "react";

// Interval-driven flash toggle at a safe cadence (default 2.5 Hz).
// Returns a boolean that flips every half-period. Used by shift lights and
// alarm banners so they flash smoothly without rAF polling or strobe risk.
// setInterval is lighter than rAF here — no need for sub-frame precision.
export function useFlashToggle(hz = 2.5) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1000 / (hz * 2));
    return () => clearInterval(id);
  }, [hz]);
  return on;
}