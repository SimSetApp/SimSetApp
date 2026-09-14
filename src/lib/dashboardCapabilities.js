/**
 * Derives telemetry capability flags from a frame.
 *
 * The bridge sets `capabilities` on each frame when a sim exposes depth data;
 * if absent we derive defensively from which fields are actually populated.
 *
 * Depth widgets (3-point tyres, brake temps, sectors, flags) only render when
 * the connected sim genuinely exposes the underlying data — never synthesised.
 */
export function deriveCapabilities(frame) {
  const empty = { tyre_3point: false, brake_temps: false, sectors: false, flags: false };
  if (!frame) return empty;
  if (frame.capabilities) {
    return {
      tyre_3point: !!frame.capabilities.tyre_3point,
      brake_temps: !!frame.capabilities.brake_temps,
      sectors: !!frame.capabilities.sectors,
      flags: !!frame.capabilities.flags,
    };
  }
  const tyres = frame.tyres || {};
  const corners = Object.values(tyres);
  return {
    tyre_3point: corners.some((t) => t && t.temp_i != null),
    brake_temps: corners.some((t) => t && t.brake_temp != null),
    sectors: Array.isArray(frame.sector_times) && frame.sector_times.some((s) => s != null),
    flags: frame.flag_state != null && frame.flag_state !== "none" && frame.flag_state !== "green",
  };
}