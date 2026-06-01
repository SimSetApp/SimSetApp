import { CAR_LISTS } from "./simData";

// ─────────────────────────────────────────────
// UTILITY: get which class a car belongs to
// ─────────────────────────────────────────────
export function getCarClass(sim, carName) {
  if (!sim || !CAR_LISTS[sim]) return null;
  for (const [cls, cars] of Object.entries(CAR_LISTS[sim])) {
    if (cars.includes(carName)) return cls;
  }
  return null;
}

// ─────────────────────────────────────────────
// CLASS-SPECIFIC SETUP DEFAULTS
// Auto-populated when a car is selected, based on its class.
// Keys match CAR_LISTS class names exactly per sim.
// ─────────────────────────────────────────────
export const CLASS_SETUP_DEFAULTS = {
  "Assetto Corsa Competizione": {
    "GT3": {
      tyre_pressure_fl: 27.3, tyre_pressure_fr: 27.3, tyre_pressure_rl: 26.8, tyre_pressure_rr: 26.8,
      front_splitter: 1, rear_wing: 6, ride_height_front: 58, ride_height_rear: 62,
      camber_front: -3.5, camber_rear: -2.5, toe_front: -0.3, toe_rear: 0.8, caster: 12.5,
      arb_front: 5, arb_rear: 4, spring_front: 90, spring_rear: 100, bump_front: 4, bump_rear: 4, rebound_front: 4, rebound_rear: 4,
      diff_preload: 60, diff_power: 60, diff_coast: 40, brake_bias: 57.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    },
    "GT4": {
      tyre_pressure_fl: 26.8, tyre_pressure_fr: 26.8, tyre_pressure_rl: 26.3, tyre_pressure_rr: 26.3,
      front_splitter: 0, rear_wing: 4, ride_height_front: 60, ride_height_rear: 66,
      camber_front: -3.2, camber_rear: -2.2, toe_front: -0.2, toe_rear: 0.7, caster: 11.5,
      arb_front: 4, arb_rear: 3, spring_front: 68, spring_rear: 78, bump_front: 3, bump_rear: 3, rebound_front: 3, rebound_rear: 3,
      diff_preload: 40, diff_power: 50, diff_coast: 28, brake_bias: 56.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 5, tc2: 4, abs: 4, engine_map: 5
    },
    "GT2": {
      tyre_pressure_fl: 28.0, tyre_pressure_fr: 28.0, tyre_pressure_rl: 27.5, tyre_pressure_rr: 27.5,
      front_splitter: 2, rear_wing: 8, ride_height_front: 55, ride_height_rear: 60,
      camber_front: -3.8, camber_rear: -2.8, toe_front: -0.4, toe_rear: 0.9, caster: 13.0,
      arb_front: 6, arb_rear: 5, spring_front: 115, spring_rear: 125, bump_front: 5, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 70, diff_power: 70, diff_coast: 45, brake_bias: 58.0, brake_duct_front: 3, brake_duct_rear: 2,
      tc1: 3, tc2: 2, abs: 2, engine_map: 5
    },
    "Cup Cars": {
      tyre_pressure_fl: 28.5, tyre_pressure_fr: 28.5, tyre_pressure_rl: 28.0, tyre_pressure_rr: 28.0,
      front_splitter: 1, rear_wing: 7, ride_height_front: 57, ride_height_rear: 61,
      camber_front: -3.6, camber_rear: -2.4, toe_front: -0.3, toe_rear: 0.9, caster: 12.5,
      arb_front: 5, arb_rear: 5, spring_front: 95, spring_rear: 105, bump_front: 4, bump_rear: 4, rebound_front: 4, rebound_rear: 4,
      diff_preload: 80, diff_power: 65, diff_coast: 42, brake_bias: 57.8, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    },
    "TCX": {
      tyre_pressure_fl: 29.0, tyre_pressure_fr: 29.0, tyre_pressure_rl: 28.5, tyre_pressure_rr: 28.5,
      front_splitter: 0, rear_wing: 3, ride_height_front: 62, ride_height_rear: 68,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.2, toe_rear: 0.6, caster: 11.0,
      arb_front: 3, arb_rear: 2, spring_front: 58, spring_rear: 65, bump_front: 3, bump_rear: 3, rebound_front: 3, rebound_rear: 3,
      diff_preload: 35, diff_power: 45, diff_coast: 25, brake_bias: 56.0, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 6, tc2: 5, abs: 5, engine_map: 5
    }
  },

  "iRacing": {
    "GT3": {
      tyre_pressure_fl: 28.0, tyre_pressure_fr: 28.0, tyre_pressure_rl: 27.5, tyre_pressure_rr: 27.5,
      front_downforce: 6, rear_downforce: 7, ride_height_front: 2.5, ride_height_rear: 3.0,
      camber_front: -3.2, camber_rear: -2.0, toe_front: -0.10, toe_rear: 0.10, caster: 11.0,
      spring_front: 550, spring_rear: 600, arb_front: 4, arb_rear: 3, bump_front: 8, bump_rear: 8, rebound_front: 8, rebound_rear: 8,
      diff_preload: 50, diff_power: 65, diff_coast: 35, brake_bias: 57.0, brake_force: 100,
      tc: 3, abs: 3
    },
    "GT4": {
      tyre_pressure_fl: 27.5, tyre_pressure_fr: 27.5, tyre_pressure_rl: 27.0, tyre_pressure_rr: 27.0,
      front_downforce: 4, rear_downforce: 5, ride_height_front: 2.75, ride_height_rear: 3.25,
      camber_front: -3.0, camber_rear: -1.8, toe_front: -0.08, toe_rear: 0.08, caster: 10.0,
      spring_front: 400, spring_rear: 450, arb_front: 3, arb_rear: 2, bump_front: 7, bump_rear: 7, rebound_front: 7, rebound_rear: 7,
      diff_preload: 35, diff_power: 55, diff_coast: 28, brake_bias: 56.5, brake_force: 100,
      tc: 4, abs: 4
    },
    "GTE": {
      tyre_pressure_fl: 27.5, tyre_pressure_fr: 27.5, tyre_pressure_rl: 27.0, tyre_pressure_rr: 27.0,
      front_downforce: 6, rear_downforce: 8, ride_height_front: 2.25, ride_height_rear: 2.75,
      camber_front: -3.4, camber_rear: -2.2, toe_front: -0.10, toe_rear: 0.12, caster: 11.5,
      spring_front: 600, spring_rear: 650, arb_front: 5, arb_rear: 4, bump_front: 9, bump_rear: 9, rebound_front: 9, rebound_rear: 9,
      diff_preload: 55, diff_power: 65, diff_coast: 38, brake_bias: 57.5, brake_force: 100,
      tc: 3, abs: 3
    },
    "GTP / LMDh": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_downforce: 7, rear_downforce: 9, ride_height_front: 2.0, ride_height_rear: 2.5,
      camber_front: -3.5, camber_rear: -2.3, toe_front: -0.12, toe_rear: 0.12, caster: 12.0,
      spring_front: 750, spring_rear: 800, arb_front: 6, arb_rear: 5, bump_front: 10, bump_rear: 10, rebound_front: 10, rebound_rear: 10,
      diff_preload: 60, diff_power: 70, diff_coast: 40, brake_bias: 57.5, brake_force: 100,
      tc: 2, abs: 2
    },
    "LMP2": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_downforce: 8, rear_downforce: 10, ride_height_front: 2.0, ride_height_rear: 2.5,
      camber_front: -3.2, camber_rear: -2.0, toe_front: -0.10, toe_rear: 0.10, caster: 11.0,
      spring_front: 700, spring_rear: 750, arb_front: 5, arb_rear: 4, bump_front: 10, bump_rear: 10, rebound_front: 10, rebound_rear: 10,
      diff_preload: 55, diff_power: 68, diff_coast: 38, brake_bias: 57.0, brake_force: 100,
      tc: 3, abs: 3
    },
    "Open Wheel": {
      tyre_pressure_fl: 25.0, tyre_pressure_fr: 25.0, tyre_pressure_rl: 24.5, tyre_pressure_rr: 24.5,
      front_downforce: 8, rear_downforce: 10, ride_height_front: 1.75, ride_height_rear: 2.0,
      camber_front: -3.0, camber_rear: -1.5, toe_front: -0.06, toe_rear: 0.06, caster: 13.0,
      spring_front: 900, spring_rear: 1000, arb_front: 7, arb_rear: 6, bump_front: 12, bump_rear: 12, rebound_front: 12, rebound_rear: 12,
      diff_preload: 30, diff_power: 55, diff_coast: 20, brake_bias: 58.0, brake_force: 100,
      tc: 2, abs: 2
    },
    "Touring / TCR": {
      tyre_pressure_fl: 30.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 29.5, tyre_pressure_rr: 29.5,
      front_downforce: 3, rear_downforce: 4, ride_height_front: 3.0, ride_height_rear: 3.5,
      camber_front: -2.8, camber_rear: -1.8, toe_front: -0.06, toe_rear: 0.06, caster: 9.5,
      spring_front: 380, spring_rear: 420, arb_front: 3, arb_rear: 2, bump_front: 6, bump_rear: 6, rebound_front: 6, rebound_rear: 6,
      diff_preload: 30, diff_power: 50, diff_coast: 25, brake_bias: 56.0, brake_force: 100,
      tc: 5, abs: 5
    },
    "NASCAR Cup": {
      tyre_pressure_fl: 26.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 22.0, tyre_pressure_rr: 32.0,
      front_downforce: 5, rear_downforce: 6, ride_height_front: 3.5, ride_height_rear: 3.75,
      camber_front: -2.0, camber_rear: -0.5, toe_front: 0.04, toe_rear: 0.04, caster: 7.0,
      spring_front: 600, spring_rear: 650, arb_front: 5, arb_rear: 4, bump_front: 9, bump_rear: 9, rebound_front: 9, rebound_rear: 9,
      diff_preload: 80, diff_power: 80, diff_coast: 60, brake_bias: 55.0, brake_force: 100,
      tc: 0, abs: 0
    },
    "NASCAR Xfinity": {
      tyre_pressure_fl: 25.5, tyre_pressure_fr: 29.5, tyre_pressure_rl: 21.5, tyre_pressure_rr: 31.5,
      front_downforce: 4, rear_downforce: 5, ride_height_front: 3.5, ride_height_rear: 3.75,
      camber_front: -2.0, camber_rear: -0.5, toe_front: 0.04, toe_rear: 0.04, caster: 7.0,
      spring_front: 550, spring_rear: 600, arb_front: 5, arb_rear: 4, bump_front: 8, bump_rear: 8, rebound_front: 8, rebound_rear: 8,
      diff_preload: 75, diff_power: 75, diff_coast: 55, brake_bias: 55.0, brake_force: 100,
      tc: 0, abs: 0
    },
    "NASCAR Truck": {
      tyre_pressure_fl: 25.0, tyre_pressure_fr: 29.0, tyre_pressure_rl: 21.0, tyre_pressure_rr: 31.0,
      front_downforce: 3, rear_downforce: 4, ride_height_front: 3.75, ride_height_rear: 4.0,
      camber_front: -2.0, camber_rear: -0.5, toe_front: 0.04, toe_rear: 0.04, caster: 7.0,
      spring_front: 500, spring_rear: 550, arb_front: 4, arb_rear: 4, bump_front: 8, bump_rear: 8, rebound_front: 8, rebound_rear: 8,
      diff_preload: 70, diff_power: 72, diff_coast: 52, brake_bias: 55.0, brake_force: 100,
      tc: 0, abs: 0
    },
    "Mazda": {
      tyre_pressure_fl: 30.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 29.5, tyre_pressure_rr: 29.5,
      front_downforce: 2, rear_downforce: 3, ride_height_front: 3.0, ride_height_rear: 3.5,
      camber_front: -2.5, camber_rear: -1.5, toe_front: -0.04, toe_rear: 0.06, caster: 9.0,
      spring_front: 300, spring_rear: 350, arb_front: 2, arb_rear: 2, bump_front: 5, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 20, diff_power: 40, diff_coast: 20, brake_bias: 56.0, brake_force: 100,
      tc: 0, abs: 0
    },
    "Oval / Dirt": {
      tyre_pressure_fl: 24.0, tyre_pressure_fr: 28.0, tyre_pressure_rl: 20.0, tyre_pressure_rr: 30.0,
      front_downforce: 3, rear_downforce: 4, ride_height_front: 4.0, ride_height_rear: 4.25,
      camber_front: -3.0, camber_rear: -0.5, toe_front: 0.06, toe_rear: 0.06, caster: 8.0,
      spring_front: 450, spring_rear: 500, arb_front: 4, arb_rear: 3, bump_front: 7, bump_rear: 7, rebound_front: 7, rebound_rear: 7,
      diff_preload: 60, diff_power: 70, diff_coast: 50, brake_bias: 54.5, brake_force: 100,
      tc: 0, abs: 0
    },
    "Radical / Sports": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_downforce: 5, rear_downforce: 7, ride_height_front: 2.25, ride_height_rear: 2.75,
      camber_front: -3.5, camber_rear: -2.0, toe_front: -0.08, toe_rear: 0.10, caster: 12.0,
      spring_front: 600, spring_rear: 650, arb_front: 5, arb_rear: 4, bump_front: 9, bump_rear: 9, rebound_front: 9, rebound_rear: 9,
      diff_preload: 40, diff_power: 60, diff_coast: 30, brake_bias: 57.0, brake_force: 100,
      tc: 2, abs: 2
    }
  },

  "Assetto Corsa": {
    "GT3": {
      tyre_pressure_fl: 27.3, tyre_pressure_fr: 27.3, tyre_pressure_rl: 26.8, tyre_pressure_rr: 26.8,
      front_wing: 4, rear_wing: 6, ride_height_front: 58, ride_height_rear: 62,
      camber_front: -3.4, camber_rear: -2.4, toe_front: -0.3, toe_rear: 0.8, caster: 12.0,
      arb_front: 20, arb_rear: 15, spring_front: 85, spring_rear: 95, bump_front: 3500, bump_rear: 3500, rebound_front: 4000, rebound_rear: 4000,
      diff_preload: 50, diff_power: 60, diff_coast: 35, brake_bias: 57.0, brake_duct: 2,
      tc: 4, abs: 3
    },
    "GTE / GT2": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_wing: 5, rear_wing: 7, ride_height_front: 56, ride_height_rear: 60,
      camber_front: -3.6, camber_rear: -2.5, toe_front: -0.35, toe_rear: 0.9, caster: 12.5,
      arb_front: 25, arb_rear: 18, spring_front: 95, spring_rear: 110, bump_front: 4000, bump_rear: 4000, rebound_front: 4500, rebound_rear: 4500,
      diff_preload: 55, diff_power: 65, diff_coast: 38, brake_bias: 57.5, brake_duct: 3,
      tc: 3, abs: 3
    },
    "LMP1": {
      tyre_pressure_fl: 26.0, tyre_pressure_fr: 26.0, tyre_pressure_rl: 25.5, tyre_pressure_rr: 25.5,
      front_wing: 6, rear_wing: 8, ride_height_front: 52, ride_height_rear: 58,
      camber_front: -3.5, camber_rear: -2.2, toe_front: -0.4, toe_rear: 1.0, caster: 13.0,
      arb_front: 30, arb_rear: 20, spring_front: 130, spring_rear: 150, bump_front: 5000, bump_rear: 5000, rebound_front: 6000, rebound_rear: 6000,
      diff_preload: 65, diff_power: 70, diff_coast: 42, brake_bias: 58.0, brake_duct: 4,
      tc: 2, abs: 2
    },
    "LMP2": {
      tyre_pressure_fl: 26.5, tyre_pressure_fr: 26.5, tyre_pressure_rl: 26.0, tyre_pressure_rr: 26.0,
      front_wing: 5, rear_wing: 7, ride_height_front: 54, ride_height_rear: 60,
      camber_front: -3.3, camber_rear: -2.1, toe_front: -0.35, toe_rear: 0.9, caster: 12.0,
      arb_front: 28, arb_rear: 18, spring_front: 110, spring_rear: 130, bump_front: 4500, bump_rear: 4500, rebound_front: 5500, rebound_rear: 5500,
      diff_preload: 60, diff_power: 68, diff_coast: 40, brake_bias: 57.5, brake_duct: 3,
      tc: 3, abs: 3
    },
    "GT4": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_wing: 3, rear_wing: 5, ride_height_front: 62, ride_height_rear: 67,
      camber_front: -3.1, camber_rear: -2.1, toe_front: -0.2, toe_rear: 0.7, caster: 11.0,
      arb_front: 15, arb_rear: 10, spring_front: 68, spring_rear: 78, bump_front: 2800, bump_rear: 2800, rebound_front: 3500, rebound_rear: 3500,
      diff_preload: 40, diff_power: 50, diff_coast: 28, brake_bias: 56.5, brake_duct: 2,
      tc: 5, abs: 4
    },
    "Open Wheel": {
      tyre_pressure_fl: 25.0, tyre_pressure_fr: 25.0, tyre_pressure_rl: 24.5, tyre_pressure_rr: 24.5,
      front_wing: 5, rear_wing: 6, ride_height_front: 50, ride_height_rear: 55,
      camber_front: -3.0, camber_rear: -1.5, toe_front: -0.1, toe_rear: 0.05, caster: 13.5,
      arb_front: 25, arb_rear: 15, spring_front: 120, spring_rear: 140, bump_front: 4000, bump_rear: 4000, rebound_front: 5000, rebound_rear: 5000,
      diff_preload: 30, diff_power: 55, diff_coast: 20, brake_bias: 58.0, brake_duct: 2,
      tc: 2, abs: 1
    },
    "Touring / WTCC": {
      tyre_pressure_fl: 29.5, tyre_pressure_fr: 29.5, tyre_pressure_rl: 29.0, tyre_pressure_rr: 29.0,
      front_wing: 3, rear_wing: 4, ride_height_front: 65, ride_height_rear: 70,
      camber_front: -2.8, camber_rear: -1.8, toe_front: -0.15, toe_rear: 0.5, caster: 10.0,
      arb_front: 12, arb_rear: 8, spring_front: 65, spring_rear: 75, bump_front: 2800, bump_rear: 2800, rebound_front: 3500, rebound_rear: 3500,
      diff_preload: 35, diff_power: 48, diff_coast: 25, brake_bias: 56.0, brake_duct: 2,
      tc: 5, abs: 4
    },
    "GT Sport / Road": {
      tyre_pressure_fl: 30.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 29.5, tyre_pressure_rr: 29.5,
      front_wing: 2, rear_wing: 3, ride_height_front: 70, ride_height_rear: 75,
      camber_front: -2.5, camber_rear: -1.8, toe_front: -0.1, toe_rear: 0.4, caster: 10.0,
      arb_front: 10, arb_rear: 8, spring_front: 60, spring_rear: 70, bump_front: 2500, bump_rear: 2500, rebound_front: 3000, rebound_rear: 3000,
      diff_preload: 30, diff_power: 45, diff_coast: 20, brake_bias: 56.0, brake_duct: 1,
      tc: 5, abs: 4
    }
  },

  "Assetto Corsa Evo": {
    "GT3 (2024 Spec)": {
      tyre_pressure_fl: 27.3, tyre_pressure_fr: 27.3, tyre_pressure_rl: 26.8, tyre_pressure_rr: 26.8,
      front_splitter: 1, rear_wing: 6, ride_height_front: 58, ride_height_rear: 62,
      camber_front: -3.5, camber_rear: -2.5, toe_front: -0.3, toe_rear: 0.8, caster: 12.5,
      arb_front: 5, arb_rear: 4, spring_front: 90, spring_rear: 100, bump_front: 4, bump_rear: 4, rebound_front: 4, rebound_rear: 4,
      diff_preload: 60, diff_power: 60, diff_coast: 40, brake_bias: 57.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    },
    "GTE": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_splitter: 2, rear_wing: 7, ride_height_front: 56, ride_height_rear: 60,
      camber_front: -3.7, camber_rear: -2.6, toe_front: -0.4, toe_rear: 0.9, caster: 13.0,
      arb_front: 6, arb_rear: 5, spring_front: 105, spring_rear: 115, bump_front: 5, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 65, diff_power: 65, diff_coast: 42, brake_bias: 58.0, brake_duct_front: 3, brake_duct_rear: 2,
      tc1: 3, tc2: 2, abs: 2, engine_map: 5
    },
    "GT4": {
      tyre_pressure_fl: 26.8, tyre_pressure_fr: 26.8, tyre_pressure_rl: 26.3, tyre_pressure_rr: 26.3,
      front_splitter: 0, rear_wing: 4, ride_height_front: 60, ride_height_rear: 66,
      camber_front: -3.2, camber_rear: -2.2, toe_front: -0.2, toe_rear: 0.7, caster: 11.5,
      arb_front: 4, arb_rear: 3, spring_front: 68, spring_rear: 78, bump_front: 3, bump_rear: 3, rebound_front: 3, rebound_rear: 3,
      diff_preload: 40, diff_power: 50, diff_coast: 28, brake_bias: 56.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 5, tc2: 4, abs: 4, engine_map: 5
    },
    "Cup Cars": {
      tyre_pressure_fl: 28.5, tyre_pressure_fr: 28.5, tyre_pressure_rl: 28.0, tyre_pressure_rr: 28.0,
      front_splitter: 1, rear_wing: 7, ride_height_front: 57, ride_height_rear: 61,
      camber_front: -3.6, camber_rear: -2.4, toe_front: -0.3, toe_rear: 0.9, caster: 12.5,
      arb_front: 5, arb_rear: 5, spring_front: 95, spring_rear: 105, bump_front: 4, bump_rear: 4, rebound_front: 4, rebound_rear: 4,
      diff_preload: 80, diff_power: 65, diff_coast: 42, brake_bias: 57.8, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 4, tc2: 3, abs: 3, engine_map: 5
    },
    "Touring": {
      tyre_pressure_fl: 29.0, tyre_pressure_fr: 29.0, tyre_pressure_rl: 28.5, tyre_pressure_rr: 28.5,
      front_splitter: 0, rear_wing: 3, ride_height_front: 62, ride_height_rear: 68,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.2, toe_rear: 0.6, caster: 11.0,
      arb_front: 3, arb_rear: 2, spring_front: 60, spring_rear: 68, bump_front: 3, bump_rear: 3, rebound_front: 3, rebound_rear: 3,
      diff_preload: 35, diff_power: 45, diff_coast: 25, brake_bias: 56.0, brake_duct_front: 2, brake_duct_rear: 1,
      tc1: 6, tc2: 5, abs: 5, engine_map: 5
    },
    "Supercars / Road": {
      tyre_pressure_fl: 30.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 29.5, tyre_pressure_rr: 29.5,
      front_splitter: 0, rear_wing: 2, ride_height_front: 65, ride_height_rear: 70,
      camber_front: -2.5, camber_rear: -1.8, toe_front: -0.15, toe_rear: 0.4, caster: 10.5,
      arb_front: 3, arb_rear: 2, spring_front: 65, spring_rear: 75, bump_front: 3, bump_rear: 3, rebound_front: 3, rebound_rear: 3,
      diff_preload: 30, diff_power: 45, diff_coast: 20, brake_bias: 56.5, brake_duct_front: 1, brake_duct_rear: 1,
      tc1: 6, tc2: 5, abs: 5, engine_map: 5
    }
  },

  "Le Mans Ultimate": {
    "Hypercar (LMH / LMDh)": {
      tyre_pressure_fl: 185, tyre_pressure_fr: 185, tyre_pressure_rl: 182, tyre_pressure_rr: 182,
      front_wing: 6, rear_wing: 8, ride_height_front: 50, ride_height_rear: 60,
      camber_front: -3.2, camber_rear: -2.0, toe_front: -0.4, toe_rear: 0.6, caster: 10.5,
      spring_front: 120, spring_rear: 145, arb_front: 35, arb_rear: 28, bump_front: 4500, bump_rear: 4500, rebound_front: 5500, rebound_rear: 5500,
      diff_preload: 65, diff_power: 68, diff_coast: 42, brake_bias: 57.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 3, abs: 2, engine_map: 3
    },
    "LMP2": {
      tyre_pressure_fl: 188, tyre_pressure_fr: 188, tyre_pressure_rl: 185, tyre_pressure_rr: 185,
      front_wing: 8, rear_wing: 10, ride_height_front: 55, ride_height_rear: 65,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.4, toe_rear: 0.6, caster: 10.5,
      spring_front: 100, spring_rear: 120, arb_front: 25, arb_rear: 20, bump_front: 4000, bump_rear: 4000, rebound_front: 5000, rebound_rear: 5000,
      diff_preload: 60, diff_power: 65, diff_coast: 40, brake_bias: 57.5, brake_duct_front: 3, brake_duct_rear: 2,
      tc: 4, abs: 3, engine_map: 3
    },
    "LMGT3 (2024)": {
      tyre_pressure_fl: 192, tyre_pressure_fr: 192, tyre_pressure_rl: 188, tyre_pressure_rr: 188,
      front_wing: 7, rear_wing: 9, ride_height_front: 58, ride_height_rear: 65,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.4, toe_rear: 0.6, caster: 10.5,
      spring_front: 100, spring_rear: 120, arb_front: 25, arb_rear: 20, bump_front: 4000, bump_rear: 4000, rebound_front: 5000, rebound_rear: 5000,
      diff_preload: 60, diff_power: 65, diff_coast: 40, brake_bias: 57.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 4, abs: 3, engine_map: 3
    },
    "GTE (Legacy 2022)": {
      tyre_pressure_fl: 190, tyre_pressure_fr: 190, tyre_pressure_rl: 186, tyre_pressure_rr: 186,
      front_wing: 8, rear_wing: 10, ride_height_front: 56, ride_height_rear: 64,
      camber_front: -3.2, camber_rear: -2.1, toe_front: -0.4, toe_rear: 0.7, caster: 11.0,
      spring_front: 105, spring_rear: 125, arb_front: 28, arb_rear: 22, bump_front: 4200, bump_rear: 4200, rebound_front: 5200, rebound_rear: 5200,
      diff_preload: 62, diff_power: 67, diff_coast: 42, brake_bias: 57.5, brake_duct_front: 3, brake_duct_rear: 2,
      tc: 3, abs: 3, engine_map: 3
    }
  },

  "Automobilista 2": {
    "GT3": {
      tyre_pressure_fl: 27.0, tyre_pressure_fr: 27.0, tyre_pressure_rl: 26.5, tyre_pressure_rr: 26.5,
      front_wing: 4, rear_wing: 6, ride_height_front: 57, ride_height_rear: 63,
      camber_front: -3.4, camber_rear: -2.3, toe_front: -0.3, toe_rear: 0.8, caster: 12.0,
      arb_front: 5, arb_rear: 4, spring_front: 88, spring_rear: 98, bump_front: 8, bump_rear: 8, rebound_front: 8, rebound_rear: 8,
      diff_preload: 55, diff_power: 60, diff_coast: 38, brake_bias: 57.0, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 4, abs: 3, engine_map: 3
    },
    "GT4": {
      tyre_pressure_fl: 26.5, tyre_pressure_fr: 26.5, tyre_pressure_rl: 26.0, tyre_pressure_rr: 26.0,
      front_wing: 3, rear_wing: 4, ride_height_front: 62, ride_height_rear: 68,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.2, toe_rear: 0.7, caster: 11.0,
      arb_front: 4, arb_rear: 3, spring_front: 68, spring_rear: 78, bump_front: 6, bump_rear: 6, rebound_front: 6, rebound_rear: 6,
      diff_preload: 38, diff_power: 48, diff_coast: 25, brake_bias: 56.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 5, abs: 4, engine_map: 3
    },
    "GTE": {
      tyre_pressure_fl: 26.5, tyre_pressure_fr: 26.5, tyre_pressure_rl: 26.0, tyre_pressure_rr: 26.0,
      front_wing: 5, rear_wing: 7, ride_height_front: 56, ride_height_rear: 61,
      camber_front: -3.6, camber_rear: -2.4, toe_front: -0.35, toe_rear: 0.9, caster: 12.5,
      arb_front: 6, arb_rear: 5, spring_front: 100, spring_rear: 115, bump_front: 9, bump_rear: 9, rebound_front: 9, rebound_rear: 9,
      diff_preload: 62, diff_power: 65, diff_coast: 40, brake_bias: 57.5, brake_duct_front: 3, brake_duct_rear: 2,
      tc: 3, abs: 3, engine_map: 3
    },
    "LMP": {
      tyre_pressure_fl: 25.5, tyre_pressure_fr: 25.5, tyre_pressure_rl: 25.0, tyre_pressure_rr: 25.0,
      front_wing: 6, rear_wing: 8, ride_height_front: 52, ride_height_rear: 60,
      camber_front: -3.3, camber_rear: -2.1, toe_front: -0.4, toe_rear: 0.9, caster: 12.0,
      arb_front: 7, arb_rear: 5, spring_front: 115, spring_rear: 135, bump_front: 11, bump_rear: 11, rebound_front: 11, rebound_rear: 11,
      diff_preload: 65, diff_power: 70, diff_coast: 42, brake_bias: 58.0, brake_duct_front: 3, brake_duct_rear: 2,
      tc: 3, abs: 2, engine_map: 3
    },
    "Cup Cars": {
      tyre_pressure_fl: 28.0, tyre_pressure_fr: 28.0, tyre_pressure_rl: 27.5, tyre_pressure_rr: 27.5,
      front_wing: 3, rear_wing: 6, ride_height_front: 58, ride_height_rear: 63,
      camber_front: -3.5, camber_rear: -2.3, toe_front: -0.3, toe_rear: 0.9, caster: 12.0,
      arb_front: 5, arb_rear: 5, spring_front: 92, spring_rear: 102, bump_front: 8, bump_rear: 8, rebound_front: 8, rebound_rear: 8,
      diff_preload: 75, diff_power: 65, diff_coast: 42, brake_bias: 57.8, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 4, abs: 3, engine_map: 3
    },
    "Formula": {
      tyre_pressure_fl: 24.5, tyre_pressure_fr: 24.5, tyre_pressure_rl: 24.0, tyre_pressure_rr: 24.0,
      front_wing: 7, rear_wing: 9, ride_height_front: 48, ride_height_rear: 55,
      camber_front: -3.2, camber_rear: -1.6, toe_front: -0.1, toe_rear: 0.05, caster: 13.5,
      arb_front: 7, arb_rear: 5, spring_front: 150, spring_rear: 180, bump_front: 13, bump_rear: 13, rebound_front: 13, rebound_rear: 13,
      diff_preload: 30, diff_power: 58, diff_coast: 20, brake_bias: 58.0, brake_duct_front: 2, brake_duct_rear: 2,
      tc: 2, abs: 1, engine_map: 2
    },
    "Stock Car Brasil": {
      tyre_pressure_fl: 25.0, tyre_pressure_fr: 28.0, tyre_pressure_rl: 22.0, tyre_pressure_rr: 30.0,
      front_wing: 3, rear_wing: 4, ride_height_front: 65, ride_height_rear: 70,
      camber_front: -1.5, camber_rear: -0.5, toe_front: 0.0, toe_rear: 0.0, caster: 6.0,
      arb_front: 4, arb_rear: 3, spring_front: 75, spring_rear: 85, bump_front: 7, bump_rear: 7, rebound_front: 7, rebound_rear: 7,
      diff_preload: 70, diff_power: 75, diff_coast: 55, brake_bias: 55.5, brake_duct_front: 2, brake_duct_rear: 2,
      tc: 3, abs: 3, engine_map: 3
    },
    "Prototype / Group C": {
      tyre_pressure_fl: 26.0, tyre_pressure_fr: 26.0, tyre_pressure_rl: 25.5, tyre_pressure_rr: 25.5,
      front_wing: 6, rear_wing: 9, ride_height_front: 50, ride_height_rear: 58,
      camber_front: -3.5, camber_rear: -2.2, toe_front: -0.4, toe_rear: 1.0, caster: 12.5,
      arb_front: 7, arb_rear: 5, spring_front: 120, spring_rear: 140, bump_front: 12, bump_rear: 12, rebound_front: 12, rebound_rear: 12,
      diff_preload: 65, diff_power: 72, diff_coast: 44, brake_bias: 58.0, brake_duct_front: 4, brake_duct_rear: 3,
      tc: 3, abs: 2, engine_map: 2
    },
    "Copa Truck": {
      tyre_pressure_fl: 28.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 26.0, tyre_pressure_rr: 28.0,
      front_wing: 2, rear_wing: 3, ride_height_front: 80, ride_height_rear: 85,
      camber_front: -1.0, camber_rear: -0.3, toe_front: 0.0, toe_rear: 0.1, caster: 5.0,
      arb_front: 3, arb_rear: 2, spring_front: 55, spring_rear: 65, bump_front: 6, bump_rear: 6, rebound_front: 6, rebound_rear: 6,
      diff_preload: 80, diff_power: 85, diff_coast: 60, brake_bias: 55.0, brake_duct_front: 2, brake_duct_rear: 2,
      tc: 3, abs: 3, engine_map: 3
    },
    "Touring / Road": {
      tyre_pressure_fl: 30.0, tyre_pressure_fr: 30.0, tyre_pressure_rl: 29.5, tyre_pressure_rr: 29.5,
      front_wing: 2, rear_wing: 3, ride_height_front: 68, ride_height_rear: 73,
      camber_front: -2.5, camber_rear: -1.5, toe_front: -0.15, toe_rear: 0.4, caster: 9.5,
      arb_front: 3, arb_rear: 2, spring_front: 60, spring_rear: 70, bump_front: 5, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 25, diff_power: 40, diff_coast: 20, brake_bias: 56.0, brake_duct_front: 1, brake_duct_rear: 1,
      tc: 5, abs: 4, engine_map: 3
    },
    "Historic F1": {
      tyre_pressure_fl: 26.0, tyre_pressure_fr: 26.0, tyre_pressure_rl: 25.5, tyre_pressure_rr: 25.5,
      front_wing: 7, rear_wing: 9, ride_height_front: 50, ride_height_rear: 58,
      camber_front: -3.0, camber_rear: -1.5, toe_front: -0.1, toe_rear: 0.05, caster: 11.0,
      arb_front: 5, arb_rear: 4, spring_front: 130, spring_rear: 160, bump_front: 10, bump_rear: 10, rebound_front: 10, rebound_rear: 10,
      diff_preload: 25, diff_power: 55, diff_coast: 18, brake_bias: 58.5, brake_duct_front: 2, brake_duct_rear: 2,
      tc: 0, abs: 0, engine_map: 2
    },
    "Touring Car Historic": {
      tyre_pressure_fl: 28.5, tyre_pressure_fr: 28.5, tyre_pressure_rl: 28.0, tyre_pressure_rr: 28.0,
      front_wing: 2, rear_wing: 3, ride_height_front: 65, ride_height_rear: 72,
      camber_front: -2.8, camber_rear: -1.8, toe_front: -0.1, toe_rear: 0.4, caster: 9.5,
      arb_front: 3, arb_rear: 2, spring_front: 60, spring_rear: 70, bump_front: 5, bump_rear: 5, rebound_front: 5, rebound_rear: 5,
      diff_preload: 30, diff_power: 45, diff_coast: 22, brake_bias: 56.5, brake_duct_front: 2, brake_duct_rear: 1,
      tc: 0, abs: 0, engine_map: 3
    }
  },

  "Gran Turismo 7": {
    "Gr.1 Prototype": {
      tyre_pressure_fl: 220, tyre_pressure_fr: 220, tyre_pressure_rl: 215, tyre_pressure_rr: 215,
      ride_height_front: 80, ride_height_rear: 85, spring_front: 14, spring_rear: 16,
      damper_ext_front: 6, damper_ext_rear: 6, damper_comp_front: 6, damper_comp_rear: 6, arb_front: 5, arb_rear: 4,
      camber_front: -2.5, camber_rear: -1.8, toe_front: -0.2, toe_rear: 0.4,
      lsd_initial: 25, lsd_accel: 35, lsd_decel: 25, brake_balance: 9,
      downforce_front: 650, downforce_rear: 700
    },
    "Gr.2 Touring Car": {
      tyre_pressure_fl: 240, tyre_pressure_fr: 240, tyre_pressure_rl: 235, tyre_pressure_rr: 235,
      ride_height_front: 90, ride_height_rear: 95, spring_front: 8, spring_rear: 9,
      damper_ext_front: 5, damper_ext_rear: 5, damper_comp_front: 5, damper_comp_rear: 5, arb_front: 4, arb_rear: 3,
      camber_front: -2.0, camber_rear: -1.5, toe_front: -0.2, toe_rear: 0.5,
      lsd_initial: 20, lsd_accel: 30, lsd_decel: 20, brake_balance: 10,
      downforce_front: 550, downforce_rear: 600
    },
    "Gr.3 GT Race Car": {
      tyre_pressure_fl: 230, tyre_pressure_fr: 230, tyre_pressure_rl: 225, tyre_pressure_rr: 225,
      ride_height_front: 88, ride_height_rear: 93, spring_front: 9, spring_rear: 10,
      damper_ext_front: 5, damper_ext_rear: 5, damper_comp_front: 5, damper_comp_rear: 5, arb_front: 4, arb_rear: 3,
      camber_front: -2.0, camber_rear: -1.5, toe_front: -0.2, toe_rear: 0.5,
      lsd_initial: 20, lsd_accel: 30, lsd_decel: 20, brake_balance: 10,
      downforce_front: 600, downforce_rear: 650
    },
    "Gr.4 GT Car": {
      tyre_pressure_fl: 235, tyre_pressure_fr: 235, tyre_pressure_rl: 230, tyre_pressure_rr: 230,
      ride_height_front: 92, ride_height_rear: 97, spring_front: 7, spring_rear: 8,
      damper_ext_front: 5, damper_ext_rear: 5, damper_comp_front: 4, damper_comp_rear: 4, arb_front: 3, arb_rear: 3,
      camber_front: -1.8, camber_rear: -1.3, toe_front: -0.2, toe_rear: 0.4,
      lsd_initial: 15, lsd_accel: 25, lsd_decel: 18, brake_balance: 10,
      downforce_front: 550, downforce_rear: 600
    },
    "Gr.B Rally Car": {
      tyre_pressure_fl: 260, tyre_pressure_fr: 260, tyre_pressure_rl: 255, tyre_pressure_rr: 255,
      ride_height_front: 120, ride_height_rear: 125, spring_front: 6, spring_rear: 7,
      damper_ext_front: 4, damper_ext_rear: 4, damper_comp_front: 4, damper_comp_rear: 4, arb_front: 2, arb_rear: 2,
      camber_front: -1.0, camber_rear: -0.5, toe_front: 0.0, toe_rear: 0.5,
      lsd_initial: 30, lsd_accel: 45, lsd_decel: 35, brake_balance: 12,
      downforce_front: 0, downforce_rear: 0
    },
    "N400": {
      tyre_pressure_fl: 250, tyre_pressure_fr: 250, tyre_pressure_rl: 245, tyre_pressure_rr: 245,
      ride_height_front: 100, ride_height_rear: 105, spring_front: 6, spring_rear: 7,
      damper_ext_front: 4, damper_ext_rear: 4, damper_comp_front: 4, damper_comp_rear: 4, arb_front: 3, arb_rear: 2,
      camber_front: -1.5, camber_rear: -1.0, toe_front: -0.1, toe_rear: 0.3,
      lsd_initial: 15, lsd_accel: 25, lsd_decel: 18, brake_balance: 11,
      downforce_front: 0, downforce_rear: 0
    },
    "N300": {
      tyre_pressure_fl: 255, tyre_pressure_fr: 255, tyre_pressure_rl: 250, tyre_pressure_rr: 250,
      ride_height_front: 105, ride_height_rear: 110, spring_front: 5, spring_rear: 6,
      damper_ext_front: 4, damper_ext_rear: 4, damper_comp_front: 3, damper_comp_rear: 3, arb_front: 2, arb_rear: 2,
      camber_front: -1.2, camber_rear: -0.8, toe_front: -0.1, toe_rear: 0.2,
      lsd_initial: 10, lsd_accel: 20, lsd_decel: 15, brake_balance: 11,
      downforce_front: 0, downforce_rear: 0
    },
    "N200": {
      tyre_pressure_fl: 260, tyre_pressure_fr: 260, tyre_pressure_rl: 255, tyre_pressure_rr: 255,
      ride_height_front: 110, ride_height_rear: 115, spring_front: 4, spring_rear: 5,
      damper_ext_front: 3, damper_ext_rear: 3, damper_comp_front: 3, damper_comp_rear: 3, arb_front: 2, arb_rear: 1,
      camber_front: -1.0, camber_rear: -0.6, toe_front: -0.1, toe_rear: 0.2,
      lsd_initial: 8, lsd_accel: 15, lsd_decel: 12, brake_balance: 11,
      downforce_front: 0, downforce_rear: 0
    },
    "S (Supercar)": {
      tyre_pressure_fl: 240, tyre_pressure_fr: 240, tyre_pressure_rl: 235, tyre_pressure_rr: 235,
      ride_height_front: 95, ride_height_rear: 100, spring_front: 10, spring_rear: 12,
      damper_ext_front: 5, damper_ext_rear: 5, damper_comp_front: 5, damper_comp_rear: 5, arb_front: 4, arb_rear: 3,
      camber_front: -1.8, camber_rear: -1.2, toe_front: -0.15, toe_rear: 0.3,
      lsd_initial: 20, lsd_accel: 30, lsd_decel: 20, brake_balance: 10,
      downforce_front: 500, downforce_rear: 550
    },
    "N100 (Kei Cars)": {
      tyre_pressure_fl: 270, tyre_pressure_fr: 270, tyre_pressure_rl: 265, tyre_pressure_rr: 265,
      ride_height_front: 115, ride_height_rear: 120, spring_front: 3, spring_rear: 4,
      damper_ext_front: 3, damper_ext_rear: 3, damper_comp_front: 2, damper_comp_rear: 2, arb_front: 1, arb_rear: 1,
      camber_front: -0.8, camber_rear: -0.5, toe_front: 0.0, toe_rear: 0.1,
      lsd_initial: 5, lsd_accel: 10, lsd_decel: 8, brake_balance: 11,
      downforce_front: 0, downforce_rear: 0
    },
    "Gr.X / Vision GT": {
      tyre_pressure_fl: 215, tyre_pressure_fr: 215, tyre_pressure_rl: 210, tyre_pressure_rr: 210,
      ride_height_front: 75, ride_height_rear: 80, spring_front: 18, spring_rear: 20,
      damper_ext_front: 7, damper_ext_rear: 7, damper_comp_front: 7, damper_comp_rear: 7, arb_front: 6, arb_rear: 5,
      camber_front: -3.0, camber_rear: -2.0, toe_front: -0.3, toe_rear: 0.5,
      lsd_initial: 30, lsd_accel: 40, lsd_decel: 30, brake_balance: 9,
      downforce_front: 750, downforce_rear: 800
    }
  }
};