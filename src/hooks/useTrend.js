import { useRef, useEffect } from "react";

// Rolling buffer of the last `n` samples per key path on `data`.
// Returns a map: key -> "up" | "down" | "flat" | null.
// No persistence — purely in-memory direction indication for trend arrows.
// The effect only runs when `data` changes (one real frame), not on every
// render, so the buffer fills with genuine distinct samples.
export function useTrend(data, keys, n = 20) {
  const ref = useRef({});
  const trends = {};
  for (const k of keys) {
    const hist = ref.current[k] || [];
    if (hist.length >= 2) {
      const oldest = hist[0];
      const newest = hist[hist.length - 1];
      const diff = newest - oldest;
      const threshold = Math.max(Math.abs(oldest) * 0.01, 0.05);
      trends[k] = Math.abs(diff) < threshold ? "flat" : diff > 0 ? "up" : "down";
    } else {
      trends[k] = null;
    }
  }
  useEffect(() => {
    const getVal = (k) => k.split(".").reduce((o, p) => (o == null ? undefined : o[p]), data);
    for (const k of keys) {
      const v = getVal(k);
      if (v == null || isNaN(v)) continue;
      const hist = ref.current[k] || [];
      ref.current[k] = [...hist.slice(-(n - 1)), v];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return trends;
}