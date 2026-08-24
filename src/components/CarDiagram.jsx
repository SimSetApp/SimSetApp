import { useState } from "react";
import { Wind, Settings2, Disc, Zap, Cog, Circle, ArrowUpDown, Minus, Car } from "lucide-react";

const PARAM_CATEGORIES = [
  { id: "aero", label: "Aerodynamics", icon: Wind, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/30" },
  { id: "suspension", label: "Suspension & Springs", icon: ArrowUpDown, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/30" },
  { id: "arb", label: "Anti-Roll Bars", icon: Minus, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/30" },
  { id: "geometry", label: "Alignment & Geometry", icon: Settings2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" },
  { id: "diff", label: "Differential", icon: Cog, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30" },
  { id: "brakes", label: "Brakes", icon: Disc, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/30" },
  { id: "electronics", label: "Electronics (TC/ABS)", icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  { id: "tyres", label: "Tyres & Pressures", icon: Circle, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
];

// Hotspots placed on real car parts (viewBox 120 x 200, front = top)
const HOTSPOTS = [
  { id: "aero", cx: 60, cy: 8, label: "Front Splitter", r: 9 },
  { id: "aero", cx: 60, cy: 188, label: "Rear Wing", r: 9 },
  { id: "suspension", cx: 86, cy: 64, label: "Suspension", r: 7 },
  { id: "arb", cx: 34, cy: 64, label: "Anti-Roll Bars", r: 7 },
  { id: "geometry", cx: 82, cy: 28, label: "Front Alignment", r: 7 },
  { id: "geometry", cx: 82, cy: 102, label: "Rear Alignment", r: 7 },
  { id: "diff", cx: 60, cy: 152, label: "Differential", r: 7 },
  { id: "brakes", cx: 38, cy: 28, label: "Front Brakes", r: 7 },
  { id: "brakes", cx: 38, cy: 102, label: "Rear Brakes", r: 7 },
  { id: "electronics", cx: 60, cy: 62, label: "ECU / TC / ABS", r: 8 },
  { id: "tyres", cx: 82, cy: 20, label: "Front Tyres", r: 6 },
  { id: "tyres", cx: 82, cy: 94, label: "Rear Tyres", r: 6 },
];

const BODY = "hsl(var(--foreground))";
const VOID = "hsl(var(--background))";
const GLASS = "rgba(56,189,248,0.20)";
const TYRE = "hsl(var(--background))";
const STROKE = "hsl(var(--border))";

export default function CarDiagram({ onSelect, activeCategory }) {
  const [hovered, setHovered] = useState(null);
  const activeId = hovered || activeCategory;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-4 h-4 text-primary" />
        <h3 className="font-heading text-sm font-bold tracking-wide">Interactive Car Diagram</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Tap any part of the car to jump to that parameter group.</p>

      <div className="relative w-full max-w-[230px] mx-auto">
        <svg viewBox="0 0 120 200" className="w-full h-auto" style={{ overflow: "visible" }}>

          {/* ── Rear wing (behind body) ── */}
          <rect x="22" y="176" width="76" height="8" rx="2.5" fill={BODY} stroke={STROKE} strokeWidth="0.6" />
          <rect x="22" y="174" width="4" height="12" rx="1" fill={BODY} stroke={STROKE} strokeWidth="0.5" />
          <rect x="94" y="174" width="4" height="12" rx="1" fill={BODY} stroke={STROKE} strokeWidth="0.5" />
          <rect x="24" y="179" width="72" height="2" rx="1" fill="hsl(var(--primary))" opacity="0.45" />
          {/* Wing supports */}
          <rect x="50" y="167" width="3" height="11" fill={BODY} stroke={STROKE} strokeWidth="0.4" />
          <rect x="67" y="167" width="3" height="11" fill={BODY} stroke={STROKE} strokeWidth="0.4" />

          {/* ── Wheels / tyres (behind body, peek out at fenders) ── */}
          <rect x="70" y="22" width="7" height="16" rx="2.5" fill={TYRE} stroke={STROKE} strokeWidth="0.5" strokeOpacity="0.6" />
          <rect x="43" y="22" width="7" height="16" rx="2.5" fill={TYRE} stroke={STROKE} strokeWidth="0.5" strokeOpacity="0.6" />
          <rect x="80" y="88" width="8" height="20" rx="2.5" fill={TYRE} stroke={STROKE} strokeWidth="0.5" strokeOpacity="0.6" />
          <rect x="32" y="88" width="8" height="20" rx="2.5" fill={TYRE} stroke={STROKE} strokeWidth="0.5" strokeOpacity="0.6" />

          {/* ── Body silhouette (GT3 top-down, narrow nose / wide hips) ── */}
          <path
            d="M 60 7
               Q 64 7.5 66 12 Q 67 15 67 18 Q 67 21 66 22
               Q 69 23 72 28 Q 73 31 72 34 Q 71 37 69 40
               L 67 46 L 66 50
               Q 68 52 69 55 L 70 62 L 71 70
               Q 72 74 73 78 Q 76 82 78 86
               Q 82 91 82 96 Q 83 101 83 106
               Q 83 112 82 118 Q 81 124 80 130
               Q 78 136 77 142 Q 75 148 74 152
               Q 72 158 70 162 L 60 168
               L 50 162 Q 48 158 46 152 Q 45 148 43 142
               Q 42 136 40 130 Q 39 124 38 118
               Q 37 112 37 106 Q 37 101 38 96
               Q 38 91 42 86 Q 44 82 47 78
               Q 48 74 49 70 L 50 62 L 51 55
               Q 52 52 54 50 L 53 46 L 51 40
               Q 49 37 48 34 Q 47 31 48 28
               Q 51 23 54 22 Q 53 21 53 18
               Q 53 15 54 12 Q 56 7.5 60 7 Z"
            fill={BODY}
            stroke={STROKE}
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />

          {/* ── Headlights (round voids) ── */}
          <circle cx="54" cy="24" r="3" fill={VOID} />
          <circle cx="66" cy="24" r="3" fill={VOID} />
          <circle cx="54" cy="24" r="3.6" fill="none" stroke={STROKE} strokeWidth="0.4" strokeOpacity="0.5" />
          <circle cx="66" cy="24" r="3.6" fill="none" stroke={STROKE} strokeWidth="0.4" strokeOpacity="0.5" />

          {/* ── Hood vent (central intake) ── */}
          <rect x="55" y="33" width="10" height="6" rx="2" fill={VOID} />
          <rect x="55" y="33" width="10" height="6" rx="2" fill="none" stroke={STROKE} strokeWidth="0.4" strokeOpacity="0.5" />
          <line x1="57" y1="34.5" x2="57" y2="37.5" stroke={STROKE} strokeWidth="0.3" strokeOpacity="0.5" />
          <line x1="60" y1="34.5" x2="60" y2="37.5" stroke={STROKE} strokeWidth="0.3" strokeOpacity="0.5" />
          <line x1="63" y1="34.5" x2="63" y2="37.5" stroke={STROKE} strokeWidth="0.3" strokeOpacity="0.5" />

          {/* ── Greenhouse glass ── */}
          <path
            d="M 54 50 L 66 50 Q 68.5 53 67.5 57 L 66 82 Q 65 84 62 84 L 58 84 Q 55 84 54 82 L 52.5 57 Q 51.5 53 54 50 Z"
            fill={GLASS}
            stroke={STROKE}
            strokeWidth="0.4"
            strokeOpacity="0.6"
          />
          {/* Roof panel (body color, splits side windows) */}
          <rect x="57.5" y="58" width="5" height="17" rx="1" fill={BODY} />
          {/* A-pillar / window divider lines */}
          <line x1="57.5" y1="58" x2="57.5" y2="75" stroke={STROKE} strokeWidth="0.3" strokeOpacity="0.5" />
          <line x1="62.5" y1="58" x2="62.5" y2="75" stroke={STROKE} strokeWidth="0.3" strokeOpacity="0.5" />

          {/* ── Side mirrors (extend out from doors) ── */}
          <ellipse cx="46" cy="56" rx="3" ry="2" fill={BODY} stroke={STROKE} strokeWidth="0.4" />
          <ellipse cx="74" cy="56" rx="3" ry="2" fill={BODY} stroke={STROKE} strokeWidth="0.4" />

          {/* ── Panel gaps (door line) ── */}
          <path d="M 51 56 Q 50 64 49 70" fill="none" stroke={VOID} strokeWidth="0.5" strokeOpacity="0.55" />
          <path d="M 69 56 Q 70 64 71 70" fill="none" stroke={VOID} strokeWidth="0.5" strokeOpacity="0.55" />

          {/* ── Front splitter accent ── */}
          <rect x="50" y="6.5" width="20" height="1.6" rx="0.8" fill="hsl(var(--primary))" opacity="0.5" />

          {/* ── Rear diffuser fins ── */}
          <rect x="48" y="160" width="24" height="7" rx="1.5" fill={VOID} />
          <rect x="48" y="160" width="24" height="7" rx="1.5" fill="none" stroke={STROKE} strokeWidth="0.4" strokeOpacity="0.5" />
          {[52, 55, 58, 61, 64, 67, 70].map(x => (
            <line key={x} x1={x} y1="161" x2={x} y2="166" stroke={STROKE} strokeWidth="0.35" strokeOpacity="0.55" />
          ))}

          {/* ── Hotspots ── */}
          {HOTSPOTS.map((h, i) => {
            const cat = PARAM_CATEGORIES.find(c => c.id === h.id);
            const isActive = activeId === h.id;
            return (
              <g key={i}>
                <circle
                  cx={h.cx}
                  cy={h.cy}
                  r={isActive ? h.r + 1.5 : h.r}
                  fill={isActive ? "currentColor" : "transparent"}
                  className={cat.color}
                  fillOpacity={isActive ? 0.35 : 0}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeOpacity={isActive ? 1 : 0.6}
                  style={{ cursor: "pointer", transition: "all 0.18s ease" }}
                  onMouseEnter={() => setHovered(h.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect?.(h.id)}
                />
                {isActive && (
                  <text
                    x={h.cx}
                    y={h.cy - h.r - 2.5}
                    textAnchor="middle"
                    fill="currentColor"
                    className={cat.color}
                    style={{ fontSize: "5px", fontWeight: "bold", pointerEvents: "none" }}
                  >
                    {h.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Category chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
        {PARAM_CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect?.(cat.id)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                isActive
                  ? `${cat.bg} ${cat.border} ${cat.color}`
                  : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}