import { useState, useEffect, useRef } from "react";

// rAF-driven flash toggle at a safe cadence (default 2.5 Hz).
// Returns a boolean that flips every half-period. Used by shift lights and
// alarm banners so they flash smoothly without Date.now polling or strobe risk.
export function useFlashToggle(hz = 2.5) {
  const [on, setOn] = useState(true);
  const last = useRef(0);
  const half = 1000 / (hz * 2);
  useEffect(() => {
    let raf;
    const tick = (t) => {
      if (last.current === 0) last.current = t;
      if (t - last.current >= half) {
        setOn((v) => !v);
        last.current = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [half]);
  return on;
}