import { useFlash } from "@/lib/flashContext";

// Functional bezel status LEDs — driven by telemetry, dim when inactive.
// Left side: flag, pit limiter, DRS. Right side: TC, ABS, shift alert.
// TC/ABS light on intervention (heuristic: high power in corner / hard braking
// at speed), not merely when the setting exists. Shift LED aligns with the 93%
// widget threshold and flashes in sync with the interval flash toggle.
//
// The shift LED is split into its own sub-component so the other LEDs don't
// re-render at 5Hz when the flash toggles — only the shift LED consumes flash.
export default function BezelLEDs({ data, caps, theme, side }) {
  const flagCol =
    caps?.flags && data.flag_state
      ? { red: "#ff1a1a", yellow: "#ffe600", yellow_full: "#ffe600", blue: "#3b82f6", green: "#00ff66", checkered: "#ffffff" }[data.flag_state]
      : null;

  // TC intervention heuristic: high throttle while cornering (corner-exit wheelspin)
  const tcActive = data.tc1 != null && (data.throttle || 0) > 0.55 && Math.abs(data.steer || 0) > 0.2;
  // ABS intervention heuristic: hard braking at speed (threshold, not every brake press)
  const absActive = data.abs != null && (data.brake || 0) > 0.55 && (data.speed_kmh || 0) > 50;
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
          { id: "abs", col: theme.absColor || "#4a9eff", active: absActive, label: "ABS" },
          { id: "shift", col: theme.ledRed, active: false, label: "SFT", isShift: true },
        ];

  return (
    <div className="flex flex-col items-center justify-center gap-2.5 py-4 px-1">
      {items.map((it) =>
        it.isShift ? (
          <ShiftLED key={it.id} data={data} theme={theme} label={it.label} />
        ) : (
          <div key={it.id} className="flex flex-col items-center gap-0.5">
            <div
              className="w-2.5 h-2.5 rounded-full transition-colors duration-200"
              style={
                it.active
                  ? { background: it.col, boxShadow: `0 0 8px ${it.col}, 0 0 4px ${it.col}, inset 0 0 2px rgba(255,255,255,0.5)` }
                  : { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)" }
              }
            />
            <span
              className="font-digi"
              style={{ fontSize: 9, color: it.active ? it.col : theme.dim, letterSpacing: "0.05em", opacity: it.active ? 1 : 0.5 }}
            >
              {it.label}
            </span>
          </div>
        )
      )}
    </div>
  );
}

// Shift LED — the only bezel LED that flashes. Isolated so the other LEDs
// don't subscribe to the flash context and re-render at 5Hz.
function ShiftLED({ data, theme, label }) {
  const flash = useFlash();
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shiftActive = rpmPct > 0.93;
  const on = shiftActive && flash;
  const col = theme.ledRed;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="w-2.5 h-2.5 rounded-full transition-colors duration-150"
        style={
          on
            ? { background: col, boxShadow: `0 0 8px ${col}, 0 0 4px ${col}, inset 0 0 2px rgba(255,255,255,0.5)` }
            : { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0 3px rgba(0,0,0,0.5)" }
        }
      />
      <span
        className="font-digi"
        style={{ fontSize: 9, color: on ? col : theme.dim, letterSpacing: "0.05em", opacity: on ? 1 : 0.3 }}
      >
        {label}
      </span>
    </div>
  );
}