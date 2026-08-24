import { SIM_SETUP_PARAMS, TYRE_PRESSURE_BASES } from "./simData";

/**
 * Validates setup parameters against sane ranges for the given sim.
 * Returns an array of warning objects: { key, label, severity, message }
 */
export function validateSetup(sim, parameters, carClass) {
  if (!sim || !parameters || !SIM_SETUP_PARAMS[sim]) return [];
  const warnings = [];
  const groups = SIM_SETUP_PARAMS[sim];

  groups.forEach(group => {
    group.params.forEach(param => {
      const val = parameters[param.key];
      if (val === undefined || val === null) return;

      const range = param.max - param.min;
      const lowWarn = param.min + range * 0.1;
      const highWarn = param.max - range * 0.1;

      if (val < param.min || val > param.max) {
        warnings.push({
          key: param.key,
          label: param.label,
          severity: "error",
          message: `${param.label} is ${val}${param.unit} — outside valid range (${param.min}–${param.max}${param.unit}).`
        });
      } else if (val < lowWarn) {
        warnings.push({
          key: param.key,
          label: param.label,
          severity: "warning",
          message: `${param.label} is very low at ${val}${param.unit} — may cause instability or poor grip.`
        });
      } else if (val > highWarn) {
        warnings.push({
          key: param.key,
          label: param.label,
          severity: "warning",
          message: `${param.label} is very high at ${val}${param.unit} — may cause excessive wear or understeer.`
        });
      }
    });
  });

  // Tyre pressure specific checks
  if (carClass && TYRE_PRESSURE_BASES[carClass]) {
    const bases = TYRE_PRESSURE_BASES[carClass];
    const pressureKeys = ["tyre_pressure_fl", "tyre_pressure_fr", "tyre_pressure_rl", "tyre_pressure_rr"];

    pressureKeys.forEach(key => {
      const val = parameters[key];
      if (val === undefined) return;
      const unit = groups.flatMap(g => g.params).find(p => p.key === key)?.unit || "";
      const isKpa = unit.includes("kPa");
      const target = isKpa ? (bases.gt7_kpa || bases.lmu_kpa) : (bases.acc || bases.iracing || 27.5);
      if (!target) return;
      const diff = Math.abs(val - target);
      if (diff > (isKpa ? 30 : 3)) {
        warnings.push({
          key,
          label: key.replace("tyre_pressure_", "Pressure ").toUpperCase(),
          severity: "warning",
          message: `${key.replace("tyre_pressure_", "Pressure ").toUpperCase()} is ${val}${unit} — ideal hot target is ~${target}${unit} for ${carClass}.`
        });
      }
    });
  }

  // Brake bias sanity
  const bbKeys = ["brake_bias", "brake_balance"];
  bbKeys.forEach(key => {
    const val = parameters[key];
    if (val === undefined) return;
    if (key === "brake_bias" && (val < 50 || val > 68)) {
      warnings.push({
        key,
        label: "Brake Bias",
        severity: "warning",
        message: `Brake bias at ${val}% is extreme — below 50% risks rear lockup, above 68% risks front lockup.`
      });
    }
  });

  return warnings;
}

/**
 * Returns a score 0-100 for how "safe" a setup is.
 */
export function setupSafetyScore(sim, parameters, carClass) {
  const warnings = validateSetup(sim, parameters, carClass);
  const errors = warnings.filter(w => w.severity === "error").length;
  const warns = warnings.filter(w => w.severity === "warning").length;
  return Math.max(0, 100 - errors * 25 - warns * 8);
}