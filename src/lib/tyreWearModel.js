/**
 * Tyre wear prediction model.
 * Estimates degradation rate and stint life based on compound, conditions, and setup.
 *
 * Inputs:
 *  - compound: "soft" | "medium" | "hard" | "wet" (or sim-specific)
 *  - trackTempC: track temperature in Celsius
 *  - ambientTempC: ambient temperature
 *  - pressures: { fl, fr, rl, rr } in PSI (or kPa — pass isKpa=true)
 *  - camberFront, camberRear: degrees (negative)
 *  - stintLengthLaps: number of laps planned
 *  - drivingStyle: "smooth" | "aggressive" | "balanced"
 *  - carClass: e.g. "GT3", "GT4", "LMP"
 *
 * Returns:
 *  - degradationPerLap: estimated seconds lost per lap due to wear
 *  - cliffLap: estimated lap where degradation accelerates dramatically
 *  - stintLife: estimated laps before tyre is "dead"
 *  - riskLevel: "low" | "medium" | "high"
 *  - notes: array of advisory strings
 */

const COMPOUND_FACTORS = {
  soft: { baseDeg: 0.08, tempOptimal: 80, tempRange: 30, lifeBase: 18 },
  medium: { baseDeg: 0.05, tempOptimal: 85, tempRange: 35, lifeBase: 28 },
  hard: { baseDeg: 0.03, tempOptimal: 90, tempRange: 40, lifeBase: 40 },
  wet: { baseDeg: 0.02, tempOptimal: 50, tempRange: 25, lifeBase: 20 },
  // Sim-specific
  SH: { baseDeg: 0.07, tempOptimal: 80, tempRange: 30, lifeBase: 20 },
  H: { baseDeg: 0.05, tempOptimal: 85, tempRange: 35, lifeBase: 28 },
  M: { baseDeg: 0.04, tempOptimal: 85, tempRange: 35, lifeBase: 30 },
  S: { baseDeg: 0.07, tempOptimal: 80, tempRange: 30, lifeBase: 18 },
  SS: { baseDeg: 0.09, tempOptimal: 75, tempRange: 25, lifeBase: 12 },
  RH: { baseDeg: 0.04, tempOptimal: 90, tempRange: 40, lifeBase: 35 },
  RM: { baseDeg: 0.06, tempOptimal: 85, tempRange: 35, lifeBase: 22 },
  RS: { baseDeg: 0.08, tempOptimal: 80, tempRange: 30, lifeBase: 15 },
  IM: { baseDeg: 0.02, tempOptimal: 50, tempRange: 25, lifeBase: 20 },
  W: { baseDeg: 0.015, tempOptimal: 45, tempRange: 20, lifeBase: 25 },
};

const STYLE_FACTORS = {
  smooth: 0.85,
  balanced: 1.0,
  aggressive: 1.25,
};

export function predictTyreWear(input) {
  const {
    compound = "medium",
    trackTempC = 25,
    ambientTempC = 20,
    pressures = {},
    camberFront = -3.0,
    camberRear = -2.0,
    stintLengthLaps = 20,
    drivingStyle = "balanced",
    carClass = "GT3",
    isKpa = false,
  } = input;

  const factor = COMPOUND_FACTORS[compound?.toLowerCase()] || COMPOUND_FACTORS[compound] || COMPOUND_FACTORS.medium;
  const styleMult = STYLE_FACTORS[drivingStyle] || 1.0;

  // Temperature deviation penalty
  const tempDeviation = Math.abs(trackTempC - factor.tempOptimal);
  const tempPenalty = 1 + (tempDeviation / factor.tempRange) * 0.5;

  // Pressure deviation from target (assume ~27.5 PSI / ~190 kPa is ideal hot)
  const targetPressure = isKpa ? 190 : 27.5;
  const avgPressure = pressures.fl && pressures.fr && pressures.rl && pressures.rr
    ? (pressures.fl + pressures.fr + pressures.rl + pressures.rr) / 4
    : targetPressure;
  const pressureDeviation = Math.abs(avgPressure - targetPressure);
  const pressurePenalty = 1 + (pressureDeviation / (isKpa ? 30 : 4)) * 0.3;

  // Camber penalty — more negative = more edge wear
  const camberPenalty = 1 + (Math.abs(camberFront) / 5) * 0.15 + (Math.abs(camberRear) / 5) * 0.1;

  // Class factor — heavier cars wear faster
  const classMult = carClass.includes("LMP") || carClass.includes("Hyper") ? 1.3
    : carClass === "GT3" ? 1.0
    : carClass === "GT4" ? 0.8
    : 1.0;

  const degradationPerLap = factor.baseDeg * styleMult * tempPenalty * pressurePenalty * camberPenalty * classMult;
  const stintLife = Math.round(factor.lifeBase / (styleMult * tempPenalty * pressurePenalty * classMult));
  const cliffLap = Math.round(stintLife * 0.75);

  // Risk assessment
  let riskLevel = "low";
  const notes = [];

  if (tempDeviation > factor.tempRange * 0.7) {
    riskLevel = "high";
    notes.push(`Track temp is ${trackTempC}°C — far from optimal for ${compound.toUpperCase()} (${factor.tempOptimal}°C). Consider a different compound.`);
  } else if (tempDeviation > factor.tempRange * 0.5) {
    riskLevel = "medium";
    notes.push(`Track temp is ${trackTempC}°C — outside the ideal window for ${compound.toUpperCase()}. Watch for early degradation.`);
  }

  if (pressureDeviation > (isKpa ? 20 : 3)) {
    riskLevel = riskLevel === "low" ? "medium" : riskLevel;
    notes.push(`Average pressure is ${avgPressure.toFixed(1)}${isKpa ? " kPa" : " PSI"} — ${pressureDeviation > 0 ? "above" : "below"} the ideal hot target. Uneven wear likely.`);
  }

  if (Math.abs(camberFront) > 4) {
    notes.push(`Front camber of ${camberFront}° is aggressive — expect heavy inner-edge wear on the fronts.`);
  }

  if (drivingStyle === "aggressive") {
    notes.push("Aggressive driving style increases wear by ~25%. Plan for an earlier pit window.");
  }

  if (stintLengthLaps > stintLife) {
    riskLevel = "high";
    notes.push(`Planned stint of ${stintLengthLaps} laps exceeds estimated tyre life of ${stintLife} laps. You'll hit the cliff before the pit window.`);
  } else if (stintLengthLaps > cliffLap) {
    riskLevel = riskLevel === "low" ? "medium" : riskLevel;
    notes.push(`Planned stint of ${stintLengthLaps} laps is past the degradation cliff (~lap ${cliffLap}). Pace will drop significantly in the final laps.`);
  }

  if (notes.length === 0) {
    notes.push("Conditions look good for this compound and setup. Tyres should perform consistently through the stint.");
  }

  return {
    degradationPerLap: Math.round(degradationPerLap * 1000) / 1000,
    cliffLap,
    stintLife,
    riskLevel,
    notes,
    compoundFactor: factor,
  };
}

/**
 * Estimate total time loss over a stint due to tyre degradation.
 */
export function estimateStintTimeLoss(degradationPerLap, stintLaps) {
  // Degradation is roughly linear until the cliff, then accelerates
  const cliffLap = Math.round(stintLaps * 0.75);
  let totalLoss = 0;
  for (let lap = 1; lap <= stintLaps; lap++) {
    if (lap <= cliffLap) {
      totalLoss += degradationPerLap * lap;
    } else {
      totalLoss += degradationPerLap * lap * (1 + (lap - cliffLap) * 0.15);
    }
  }
  return Math.round(totalLoss * 10) / 10;
}