import { useEffect, useState } from "react";

/**
 * Flashing alarm / flag banner — derived purely from frame fields.
 * Active alarms flash as a prioritised, auto-clearing banner over the dash
 * and stack when multiple. No resting clutter when everything is normal.
 */

const FUEL_LOW_LAPS = 2;
const FUEL_CRITICAL_L = 3;

const TONE = {
  red: "#ff1a1a",
  yellow: "#ffe600",
  amber: "#ff9800",
  blue: "#3b82f6",
};

function deriveAlarms(data, caps) {
  if (!data) return [];
  const alarms = [];

  // Flags (sim-native only)
  if (caps.flags && data.flag_state) {
    const f = data.flag_state;
    if (f === "red") alarms.push({ id: "flag_red", label: "RED FLAG", tone: "red", priority: 6 });
    if (f === "yellow" || f === "yellow_full") alarms.push({ id: "flag_yellow", label: "YELLOW FLAG", tone: "yellow", priority: 5 });
    if (f === "blue") alarms.push({ id: "flag_blue", label: "BLUE FLAG", tone: "blue", priority: 4 });
  }

  // Low fuel
  if (data.fuel_litres != null && data.fuel_per_lap) {
    const lapsLeft = data.fuel_litres / data.fuel_per_lap;
    if (lapsLeft < FUEL_LOW_LAPS) alarms.push({ id: "fuel", label: "LOW FUEL", tone: "amber", priority: 3 });
  } else if (data.fuel_litres != null && data.fuel_litres < FUEL_CRITICAL_L) {
    alarms.push({ id: "fuel", label: "LOW FUEL", tone: "amber", priority: 3 });
  }

  // Over-temp (water / oil — sim-native only)
  if (data.water_temp != null && data.water_temp > 110) alarms.push({ id: "water", label: "WATER TEMP", tone: "red", priority: 4 });
  if (data.oil_temp != null && data.oil_temp > 130) alarms.push({ id: "oil", label: "OIL TEMP", tone: "red", priority: 4 });

  // Tyre pressure loss (puncture detection)
  if (data.tyres) {
    const pressures = Object.entries(data.tyres)
      .map(([k, t]) => ({ k, p: t?.pressure_psi }))
      .filter((x) => x.p != null);
    if (pressures.length >= 2) {
      const avg = pressures.reduce((a, b) => a + b.p, 0) / pressures.length;
      for (const { k, p } of pressures) {
        if (p < avg - 5) {
          alarms.push({ id: `puncture_${k}`, label: `TYRE ${k.toUpperCase()}`, tone: "red", priority: 5 });
          break;
        }
      }
    }
  }

  // Off-pace trend
  if (data.lap_delta != null && data.lap_delta > 1.5) alarms.push({ id: "delta", label: "OFF PACE", tone: "amber", priority: 2 });

  return alarms;
}

export default function AlarmOverlay({ data, caps }) {
  const [flash, setFlash] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setFlash((f) => !f), 250);
    return () => clearInterval(id);
  }, []);

  const alarms = deriveAlarms(data, caps);
  if (!alarms.length) return null;

  const top = [...alarms].sort((a, b) => b.priority - a.priority).slice(0, 3);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none">
      {top.map((a) => {
        const col = TONE[a.tone] || TONE.red;
        return (
          <div
            key={a.id}
            className="font-digi font-bold px-3 py-1 rounded-full text-xs tracking-widest whitespace-nowrap"
            style={{
              color: flash ? "#000" : col,
              background: flash ? col : "rgba(0,0,0,0.78)",
              border: `2px solid ${col}`,
              boxShadow: `0 0 18px ${col}88`,
            }}
          >
            {a.label}
          </div>
        );
      })}
    </div>
  );
}