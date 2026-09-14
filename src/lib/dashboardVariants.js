// Brand-free authentic motorsport dash presets. 3 GT3-style + 2 Formula-style.
// All layouts are locked (hybrid): positions/sizes fixed; accent + units adjustable.

const GT3_PRO_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 32, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 48, w: 300, h: 300, color: null },
  { id: "w_inputs", type: "inputs", x: 16, y: 356, w: 300, h: 152, color: null },
  { id: "w_fuel", type: "fuel", x: 332, y: 48, w: 336, h: 176, color: null },
  { id: "w_gear", type: "gear", x: 332, y: 232, w: 336, h: 276, color: null },
  { id: "w_delta", type: "delta", x: 680, y: 48, w: 304, h: 140, color: null },
  { id: "w_laps", type: "laps", x: 680, y: 196, w: 304, h: 84, color: null },
  { id: "w_cars", type: "cars", x: 680, y: 288, w: 304, h: 220, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

const GT3_RACE_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 40, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 56, w: 300, h: 260, color: null },
  { id: "w_inputs", type: "inputs", x: 16, y: 324, w: 300, h: 184, color: null },
  { id: "w_gear", type: "gear", x: 332, y: 56, w: 336, h: 320, color: null },
  { id: "w_fuel", type: "fuel", x: 680, y: 56, w: 304, h: 160, color: null },
  { id: "w_delta", type: "delta", x: 680, y: 224, w: 304, h: 120, color: null },
  { id: "w_laps", type: "laps", x: 332, y: 384, w: 336, h: 124, color: null },
  { id: "w_cars", type: "cars", x: 680, y: 352, w: 304, h: 156, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

const GT3_ENDURANCE_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 32, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 48, w: 240, h: 300, color: null },
  { id: "w_fuel", type: "fuel", x: 264, y: 48, w: 240, h: 180, color: null },
  { id: "w_delta", type: "delta", x: 264, y: 236, w: 240, h: 112, color: null },
  { id: "w_gear", type: "gear", x: 512, y: 48, w: 200, h: 300, color: null },
  { id: "w_laps", type: "laps", x: 512, y: 356, w: 200, h: 160, color: null },
  { id: "w_cars", type: "cars", x: 724, y: 48, w: 260, h: 230, color: null },
  { id: "w_inputs", type: "inputs", x: 724, y: 286, w: 260, h: 230, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

const FORMULA_WHEEL_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 28, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 48, w: 276, h: 200, color: null },
  { id: "w_fuel", type: "fuel", x: 16, y: 256, w: 276, h: 120, color: null },
  { id: "w_gear", type: "gear", x: 300, y: 60, w: 400, h: 400, color: null },
  { id: "w_delta", type: "delta", x: 724, y: 48, w: 260, h: 120, color: null },
  { id: "w_laps", type: "laps", x: 724, y: 176, w: 260, h: 100, color: null },
  { id: "w_cars", type: "cars", x: 724, y: 284, w: 260, h: 172, color: null },
  { id: "w_inputs", type: "inputs", x: 16, y: 384, w: 276, h: 128, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

const FORMULA_HALO_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 28, color: null },
  { id: "w_speed", type: "speed", x: 16, y: 48, w: 300, h: 200, color: null },
  { id: "w_gear", type: "gear", x: 16, y: 256, w: 300, h: 200, color: null },
  { id: "w_laps", type: "laps", x: 324, y: 48, w: 360, h: 200, color: null },
  { id: "w_delta", type: "delta", x: 324, y: 256, w: 360, h: 200, color: null },
  { id: "w_tyres", type: "tyres", x: 696, y: 48, w: 288, h: 200, color: null },
  { id: "w_fuel", type: "fuel", x: 696, y: 256, w: 288, h: 120, color: null },
  { id: "w_inputs", type: "inputs", x: 696, y: 384, w: 288, h: 128, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

export const DASH_VARIANTS = [
  {
    id: "gt3-pro",
    name: "GT3 Pro Display",
    category: "gt3",
    shape: "led",
    theme: {
      isLight: false, bg: "#050505", panel: "#0d0d0d", panelEdge: "#1c1c1c",
      text: "#f5f5f5", label: "#5a5a5a", dim: "#2a2a2a", accent: "#00ff88",
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
      text: "#e6f3f7", label: "#5b7385", dim: "#2a3a48", accent: "#00d4c8",
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
    shape: "led",
    theme: {
      isLight: false, bg: "#060604", panel: "#0e0e0a", panelEdge: "#1f1f14",
      text: "#f5f0e0", label: "#6a5d3a", dim: "#2a2418", accent: "#ffb020",
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
      text: "#ffffff", label: "#5a5a5a", dim: "#2a2a2a", accent: "#ff2d2d",
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
      text: "#ffffff", label: "#4a4a4a", dim: "#222222", accent: "#ffffff",
      ledGreen: "#00ff66", ledYellow: "#ffe600", ledRed: "#ff1a1a", shiftColor: "#ff1a1a",
      track: "#141414", warn: "#ff9800",
    },
    layout: FORMULA_HALO_LAYOUT,
    units: { speed: "kmh", pressure: "psi" },
  },
];

export function getVariant(id) {
  return DASH_VARIANTS.find((v) => v.id === id) || DASH_VARIANTS[0];
}