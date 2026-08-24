import { SEM } from "@/components/live/dashboardWidgets";

// Variant 1 — kept verbatim from the original default layout.
const BASE_LAYOUT = [
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

// Ferrari 296 — large central gear, fuel tucked beneath it.
const FERRARI_LAYOUT = [
  { id: "w_shift", type: "shiftLights", x: 16, y: 8, w: 968, h: 32, color: null },
  { id: "w_tyres", type: "tyres", x: 16, y: 48, w: 280, h: 280, color: null },
  { id: "w_inputs", type: "inputs", x: 16, y: 336, w: 280, h: 172, color: null },
  { id: "w_gear", type: "gear", x: 312, y: 48, w: 376, h: 300, color: null },
  { id: "w_fuel", type: "fuel", x: 312, y: 356, w: 376, h: 152, color: null },
  { id: "w_delta", type: "delta", x: 704, y: 48, w: 280, h: 130, color: null },
  { id: "w_laps", type: "laps", x: 704, y: 186, w: 280, h: 80, color: null },
  { id: "w_cars", type: "cars", x: 704, y: 274, w: 280, h: 234, color: null },
  { id: "w_status", type: "status", x: 16, y: 516, w: 968, h: 36, color: null },
];

export const DASH_VARIANTS = [
  {
    id: "bosch",
    name: "Bosch DDU3",
    shape: "led",
    theme: {
      isLight: false, bg: "#000000", panel: SEM.panel, text: SEM.text,
      label: SEM.label, border: SEM.border, track: SEM.track, accent: "#00e5ff",
      blue: SEM.blue, amber: SEM.amber,
      ledGreen: SEM.green, ledYellow: SEM.yellow, ledRed: SEM.red, shiftColor: SEM.red,
    },
    layout: BASE_LAYOUT,
  },
  {
    id: "motec",
    name: "MoTeC TFT",
    shape: "arc",
    theme: {
      isLight: false, bg: "#0b0f14", panel: "#111821", text: "#e6f3f7",
      label: "#5b7385", border: "#1c2a36", track: "#0d141b", accent: "#00d4c8",
      blue: "#3aa0d8", amber: "#ff9800",
      ledGreen: "#2ee6a0", ledYellow: "#ffd23f", ledRed: "#ff4d5e", shiftColor: "#ff4d5e",
    },
    layout: BASE_LAYOUT,
  },
  {
    id: "ferrari",
    name: "Ferrari 296",
    shape: "led",
    theme: {
      isLight: false, bg: "#0a0202", panel: "#150606", text: "#fff0f0",
      label: "#8a5a5a", border: "#2a1010", track: "#100404", accent: "#ff2d2d",
      blue: "#3b82f6", amber: "#ff9800",
      ledGreen: "#00ff66", ledYellow: "#ffe600", ledRed: "#ff1a1a", shiftColor: "#ffe600",
    },
    layout: FERRARI_LAYOUT,
  },
  {
    id: "mclaren",
    name: "McLaren Papaya",
    shape: "bars",
    theme: {
      isLight: true, bg: "#f4f5f7", panel: "#ffffff", text: "#1a1a1a",
      label: "#8a8f96", border: "#d8dde2", track: "#e8ebee", accent: "#ff6a00",
      blue: "#1e90d0", amber: "#f5a300",
      ledGreen: "#00a86b", ledYellow: "#f5a300", ledRed: "#e02020", shiftColor: "#ff6a00",
    },
    layout: BASE_LAYOUT,
  },
  {
    id: "retro",
    name: "Retro Analog",
    shape: "dial",
    theme: {
      isLight: true, bg: "#e8e2d4", panel: "#f2ecdd", text: "#2a2418",
      label: "#8a7d63", border: "#c9bfa6", track: "#d9cfb4", accent: "#c8862a",
      blue: "#3a6a8a", amber: "#c8862a",
      ledGreen: "#4a7a3a", ledYellow: "#d4a017", ledRed: "#a83232", shiftColor: "#c8862a",
    },
    layout: BASE_LAYOUT,
  },
];

export function getVariant(id) {
  return DASH_VARIANTS.find((v) => v.id === id) || DASH_VARIANTS[0];
}