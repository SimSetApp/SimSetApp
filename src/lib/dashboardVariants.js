// Brand-free authentic motorsport dash presets. 3 GT3-style + 2 Formula-style.
// All layouts are locked (hybrid): positions/sizes fixed; accent + units adjustable.
// Coordinates audited for zero overlap with a consistent 8px gutter on a 1000×560 canvas.

// GT3 Pro — integrated RPM bar + gear (Bosch DDU / AiM page style)
const GT3_PRO_LAYOUT = [
  { id: "w_rpmgear", type: "rpmGear", x: 296, y: 56, w: 408, h: 300, color: null },
  { id: "w_tyres", type: "tyres", x: 8, y: 56, w: 280, h: 260, color: null },
  { id: "w_inputs", type: "inputs", x: 8, y: 324, w: 280, h: 180, color: null },
  { id: "w_delta", type: "delta", x: 712, y: 56, w: 280, h: 140, color: null },
  { id: "w_laps", type: "laps", x: 712, y: 204, w: 280, h: 100, color: null },
  { id: "w_cars", type: "cars", x: 712, y: 312, w: 280, h: 192, color: null },
  { id: "w_fuel", type: "fuel", x: 296, y: 364, w: 408, h: 140, color: null },
  { id: "w_status", type: "status", x: 8, y: 512, w: 984, h: 40, color: null },
];

// GT3 Race — circular RPM arc gauge around central gear, cyan
const GT3_RACE_LAYOUT = [
  { id: "w_gear", type: "gear", x: 296, y: 56, w: 408, h: 300, color: null },
  { id: "w_curlap", type: "laps", x: 296, y: 364, w: 408, h: 140, color: null },
  { id: "w_tyres", type: "tyres", x: 8, y: 56, w: 280, h: 180, color: null },
  { id: "w_fuel", type: "fuel", x: 8, y: 244, w: 280, h: 120, color: null },
  { id: "w_inputs", type: "inputs", x: 8, y: 372, w: 280, h: 132, color: null },
  { id: "w_delta", type: "delta", x: 712, y: 56, w: 280, h: 140, color: null },
  { id: "w_cars", type: "cars", x: 712, y: 204, w: 280, h: 300, color: null },
  { id: "w_status", type: "status", x: 8, y: 512, w: 984, h: 40, color: null },
];

// GT3 Endurance — data-dense: fuel strategy, stint timer, tyre-wear, amber
const GT3_ENDURANCE_LAYOUT = [
  { id: "w_rpmgear", type: "rpmGear", x: 296, y: 56, w: 408, h: 200, color: null },
  { id: "w_stint", type: "laps", x: 296, y: 264, w: 408, h: 240, color: null },
  { id: "w_tyres", type: "tyres", x: 8, y: 56, w: 280, h: 260, color: null },
  { id: "w_fuel", type: "fuel", x: 8, y: 324, w: 280, h: 180, color: null },
  { id: "w_delta", type: "delta", x: 712, y: 56, w: 280, h: 120, color: null },
  { id: "w_laps", type: "laps", x: 712, y: 184, w: 280, h: 160, color: null },
  { id: "w_cars", type: "cars", x: 712, y: 352, w: 280, h: 152, color: null },
  { id: "w_status", type: "status", x: 8, y: 512, w: 984, h: 40, color: null },
];

// Formula Wheel — large central gear with circular RPM LED ring, red
const FORMULA_WHEEL_LAYOUT = [
  { id: "w_gear", type: "gear", x: 300, y: 56, w: 400, h: 448, color: null },
  { id: "w_tyres", type: "tyres", x: 8, y: 56, w: 284, h: 140, color: null },
  { id: "w_fuel", type: "fuel", x: 8, y: 204, w: 284, h: 120, color: null },
  { id: "w_inputs", type: "inputs", x: 8, y: 332, w: 284, h: 172, color: null },
  { id: "w_speed", type: "speed", x: 712, y: 56, w: 284, h: 100, color: null },
  { id: "w_delta", type: "delta", x: 712, y: 164, w: 284, h: 120, color: null },
  { id: "w_laps", type: "laps", x: 712, y: 292, w: 284, h: 120, color: null },
  { id: "w_cars", type: "cars", x: 712, y: 420, w: 284, h: 84, color: null },
  { id: "w_status", type: "status", x: 8, y: 512, w: 984, h: 40, color: null },
];

// Formula Halo — big speed + gear + lap, slim RPM bar, high-contrast white
const FORMULA_HALO_LAYOUT = [
  { id: "w_rpmbar", type: "rpmBar", x: 8, y: 8, w: 984, h: 32, color: null },
  { id: "w_speed", type: "speed", x: 8, y: 56, w: 300, h: 200, color: null },
  { id: "w_gear", type: "gear", x: 8, y: 264, w: 300, h: 200, color: null },
  { id: "w_laps", type: "laps", x: 316, y: 56, w: 360, h: 200, color: null },
  { id: "w_delta", type: "delta", x: 316, y: 264, w: 360, h: 200, color: null },
  { id: "w_tyres", type: "tyres", x: 688, y: 56, w: 304, h: 200, color: null },
  { id: "w_fuel", type: "fuel", x: 688, y: 264, w: 304, h: 120, color: null },
  { id: "w_inputs", type: "inputs", x: 688, y: 392, w: 304, h: 112, color: null },
  { id: "w_status", type: "status", x: 8, y: 512, w: 984, h: 40, color: null },
];

export const DASH_VARIANTS = [
  {
    id: "gt3-pro",
    name: "GT3 Pro Display",
    category: "gt3",
    shape: "bar",
    theme: {
      isLight: false, bg: "#050505", panel: "#0d0d0d", panelEdge: "#1c1c1c",
      text: "#f5f5f5", label: "#8a8a8a", dim: "#2a2a2a", accent: "#00ff88",
      ledGreen: "#00ff66", ledYellow: "#ffe600", ledRed: "#ff1a1a", shiftColor: "#ff1a1a",
      track: "#161616", warn: "#ff9800",
    },
    layout: GT3_PRO_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
  {
    id: "gt3-race",
    name: "GT3 Race Dash",
    category: "gt3",
    shape: "arc",
    theme: {
      isLight: false, bg: "#0a0f14", panel: "#111821", panelEdge: "#1c2a36",
      text: "#e6f3f7", label: "#7a95a8", dim: "#2a3a48", accent: "#00d4c8",
      ledGreen: "#2ee6a0", ledYellow: "#ffd23f", ledRed: "#ff4d5e", shiftColor: "#ff4d5e",
      track: "#0d141b", warn: "#ff9800",
    },
    layout: GT3_RACE_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
  {
    id: "gt3-endurance",
    name: "GT3 Endurance Display",
    category: "gt3",
    shape: "bar",
    theme: {
      isLight: false, bg: "#060604", panel: "#0e0e0a", panelEdge: "#1f1f14",
      text: "#f5f0e0", label: "#8a7d5a", dim: "#2a2418", accent: "#ffb020",
      ledGreen: "#00ff66", ledYellow: "#ffd23f", ledRed: "#ff4d4d", shiftColor: "#ff4d4d",
      track: "#161408", warn: "#ff9800",
    },
    layout: GT3_ENDURANCE_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
  {
    id: "formula-wheel",
    name: "Formula Wheel Display",
    category: "formula",
    shape: "ring",
    theme: {
      isLight: false, bg: "#080808", panel: "#101010", panelEdge: "#222222",
      text: "#ffffff", label: "#8a8a8a", dim: "#2a2a2a", accent: "#ff2d2d",
      ledGreen: "#00ff66", ledYellow: "#ffe600", ledRed: "#ff1a1a", shiftColor: "#ffe600",
      track: "#161616", warn: "#ff9800",
    },
    layout: FORMULA_WHEEL_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
  {
    id: "formula-halo",
    name: "Formula Halo Display",
    category: "formula",
    shape: "led",
    theme: {
      isLight: false, bg: "#000000", panel: "#0a0a0a", panelEdge: "#1a1a1a",
      text: "#ffffff", label: "#7a7a7a", dim: "#222222", accent: "#ffffff",
      ledGreen: "#00ff66", ledYellow: "#ffe600", ledRed: "#ff1a1a", shiftColor: "#ff1a1a",
      track: "#141414", warn: "#ff9800",
    },
    layout: FORMULA_HALO_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
];

// Shared portrait (mobile) layout — vertical flex-stack that reflows to fill
// the screen at full size instead of shrinking the landscape canvas.
// flex weights: thin RPM bar, big gear, speed, delta, big tyres, fuel, laps.
export const PORTRAIT_LAYOUT = [
  { type: "rpmBar", flex: 0.4 },
  { type: "gear", flex: 1.5 },
  { type: "speed", flex: 1.1 },
  { type: "delta", flex: 1.3 },
  { type: "tyres", flex: 2.6 },
  { type: "fuel", flex: 1.8 },
  { type: "laps", flex: 1.3 },
];

export function getVariant(id) {
  const v = DASH_VARIANTS.find((v) => v.id === id) || DASH_VARIANTS[0];
  return { ...v, portraitLayout: v.portraitLayout || PORTRAIT_LAYOUT };
}