import { useFlash } from "@/lib/flashContext";

// Functional bezel status LEDs — driven by telemetry, dim when inactive.
// Left side: flag, pit limiter, DRS. Right side: TC, ABS, shift alert.
// TC/ABS light on intervention (heuristic: throttle-in-corner / brake-at-speed),
// not merely when the setting exists. Shift LED aligns with the 93% widget
// threshold and flashes in sync with the rAF flash toggle.
export default function BezelLEDs({ data, caps, theme, side }) {
  const flash = useFlash();
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shiftActive = rpmPct > 0.93;
  const flagCol =
    caps?.flags && data.flag_state
      ? { red: "#ff1a1a", yellow: "#ffe600", yellow_full: "#ffe600", blue: "#3b82f6", green: "#00ff66" }[data.flag_state]
      : null;

  // TC intervention heuristic: applying throttle while cornering
  const tcActive = data.tc1 != null && (data.throttle || 0) > 0.3 && Math.abs(data.steer || 0) > 0.15;
  // ABS intervention heuristic: braking at speed
  const absActive = data.abs != null && (data.brake || 0) > 0.3 && (data.speed_kmh || 0) > 30;
  // DRS active
  const drsActive = !!(data.drs || data.drs_enabled);
  // Pit limiter
  const pitActive = !!data.pit_limiter;

  const items =
    side === "left"
      ? [
          { id: "flag", col: flagCol, active: !!flagCol, label: "FLG" },
          { id: "pit", col: "#ff9800", active: pitActive, label: "PIT" },
          { id: "drs", col: theme.ledGreen, active: drsActive, label: "DRS" },
        ]
      : [
          { id: "tc", col: theme.accent, active: tcActive, label: "TC" },
          { id: "abs", col: "#3b82f6", active: absActive, label: "ABS" },
          { id: "shift", col: theme.ledRed, active: shiftActive && flash, label: "SFT" },
        ];

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-3 px-1">
      {items.map((it) => (
        <div key={it.id} className="flex flex-col items-center gap-0.5">
          <div
            className="w-2.5 h-2.5 rounded-full transition-all duration-200"
            style={
              it.active
                ? { background: it.col, boxShadow: `0 0 8px ${it.col}, 0 0 4px ${it.col}, inset 0 0 2px rgba(255,255,255,0.5)` }
                : { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)" }
            }
          />
          <span
            className="font-digi"
            style={{ fontSize: 7, color: it.active ? it.col : theme.dim, letterSpacing: "0.05em", opacity: it.active ? 1 : 0.5 }}
          >
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}