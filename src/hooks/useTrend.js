import { useRef, useEffect, useMemo } from "react";

// Rolling buffer of the last `n` samples per key path on `data`.
// Returns a map: key -> "up" | "down" | "flat" | null.
//
// The output object is memoized: it returns the SAME reference when no
// trend direction has changed, so consumers that receive `trends` as a prop
// don't re-render from identity churn alone. Key paths are pre-split once
// instead of per-frame.
export function useTrend(data, keys, n = 20) {
  const ref = useRef({});
  const trendsRef = useRef({});

  // Pre-split key paths once (keys is expected to be a stable module-level array)
  const splitKeys = useMemo(() => keys.map((k) => k.split(".")), [keys]);

  const trends = useMemo(() => {
    const out = {};
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const hist = ref.current[k] || [];
      let val;
      if (hist.length >= 2) {
        const oldest = hist[0];
        const newest = hist[hist.length - 1];
        const diff = newest - oldest;
        const threshold = Math.max(Math.abs(oldest) * 0.01, 0.05);
        val = Math.abs(diff) < threshold ? "flat" : diff > 0 ? "up" : "down";
      } else {
        val = null;
      }
      out[k] = val;
      if (trendsRef.current[k] !== val) changed = true;
    }
    if (changed) {
      trendsRef.current = out;
      return out;
    }
    return trendsRef.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, keys]);

  useEffect(() => {
    for (let i = 0; i < splitKeys.length; i++) {
      const k = keys[i];
      let v = data;
      for (const p of splitKeys[i]) {
        v = v == null ? undefined : v[p];
      }
      if (v == null || isNaN(v)) continue;
      const hist = ref.current[k] || [];
      ref.current[k] = [...hist.slice(-(n - 1)), v];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, splitKeys, keys, n]);

  return trends;
}