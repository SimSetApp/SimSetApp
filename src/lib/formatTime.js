/**
 * Unified lap-time formatter — shared across the dashboard widgets and the
 * auto-log page so lap times render identically everywhere.
 *
 * "fmt"  — m:ss.mmm (always zero-padded minutes) for lap/sector times.
 * "fmtDuration" — H:MM:SS for race time-remaining over 60 min, else MM:SS.
 */

export function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  // Round once at the top to avoid the 999.5ms → 1000ms carry bug
  const totalMs = Math.round(t * 1000);
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function fmtDuration(secs) {
  if (secs == null || isNaN(secs)) return "--:--";
  if (secs >= 3600) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(Math.floor(secs % 60)).padStart(2, "0")}`;
}