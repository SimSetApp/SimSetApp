// Functional bezel status LEDs — driven by telemetry, dim when inactive.
// Left side: flag, pit limiter, DRS. Right side: TC, ABS, shift alert.
export default function BezelLEDs({ data, caps, theme, side }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const flagCol =
    caps?.flags && data.flag_state
      ? { red: "#ff1a1a", yellow: "#ffe600", yellow_full: "#ffe600", blue: "#3b82f6", green: "#00ff66" }[data.flag_state]
      : null;

  const items =
    side === "left"
      ? [
          { id: "flag", col: flagCol, active: !!flagCol, label: "FLG" },
          { id: "pit", col: "#ff9800", active: !!data.pit_limiter, label: "PIT" },
          { id: "drs", col: theme.ledGreen, active: !!(data.drs || data.drs_enabled), label: "DRS" },
        ]
      : [
          { id: "tc", col: theme.accent, active: data.tc1 != null, label: "TC" },
          { id: "abs", col: "#3b82f6", active: data.abs != null, label: "ABS" },
          { id: "shift", col: theme.ledRed, active: rpmPct > 0.9, label: "SFT" },
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