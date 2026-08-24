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
  { id: "aero", cx: 60, cy: 8, label: "Front Wing", r: 9 },
  { id: "aero", cx: 60, cy: 190, label: "Rear Wing", r: 9 },
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

      <div className="relative w-full max-w-[220px] mx-auto">
        <svg viewBox="0 0 120 200" className="w-full h-auto" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--muted))" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.12)" />
            </linearGradient>
          </defs>

          {/* Rear wing */}
          <rect x="12" y="184" width="96" height="9" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <rect x="14" y="186" width="92" height="2.5" rx="1" fill="hsl(var(--primary))" opacity="0.5" />

          {/* Front wing / splitter */}
          <rect x="18" y="3" width="84" height="7" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <rect x="20" y="5" width="80" height="2.5" rx="1" fill="hsl(var(--primary))" opacity="0.5" />

          {/* Wheels (drawn behind body, sticking out at sides) */}
          <rect x="78" y="16" width="9" height="18" rx="2.5" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <rect x="33" y="16" width="9" height="18" rx="2.5" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <rect x="79" y="90" width="9" height="18" rx="2.5" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <rect x="32" y="90" width="9" height="18" rx="2.5" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.6" />

          {/* Main body — top-down GT silhouette */}
          <path
            d="M 60 9
               Q 70 11 74 14
               Q 82 18 82 24
               Q 80 30 76 34
               L 74 48
               Q 73 55 77 62
               Q 79 70 75 78
               Q 80 86 84 94
               Q 86 100 83 108
               L 78 140
               Q 75 165 70 180
               L 60 184
               L 50 180
               Q 45 165 42 140
               L 37 108
               Q 34 100 36 94
               Q 40 86 45 78
               Q 41 70 43 62
               Q 47 55 46 48
               L 44 34
               Q 40 30 38 24
               Q 38 18 46 14
               Q 50 11 60 9 Z"
            fill="url(#bodyGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.7"
          />

          {/* Hood vent lines */}
          <line x1="52" y1="40" x2="52" y2="44" stroke="hsl(var(--border))" strokeWidth="0.6" />
          <line x1="68" y1="40" x2="68" y2="44" stroke="hsl(var(--border))" strokeWidth="0.6" />

          {/* Cockpit canopy */}
          <path
            d="M 60 48 Q 50 50 49 60 Q 49 72 60 78 Q 71 72 71 60 Q 70 50 60 48 Z"
            fill="url(#glassGrad)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          {/* Cockpit spine */}
          <line x1="60" y1="50" x2="60" y2="76" stroke="hsl(var(--border))" strokeWidth="0.4" opacity="0.6" />

          {/* Side mirrors */}
          <rect x="46" y="50" width="4" height="3" rx="1" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.3" />
          <rect x="70" y="50" width="4" height="3" rx="1" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.3" />

          {/* Diffuser fins at rear */}
          <line x1="48" y1="176" x2="48" y2="182" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <line x1="54" y1="176" x2="54" y2="182" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <line x1="60" y1="176" x2="60" y2="182" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <line x1="66" y1="176" x2="66" y2="182" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <line x1="72" y1="176" x2="72" y2="182" stroke="hsl(var(--border))" strokeWidth="0.5" />

          {/* Roof scoop */}
          <rect x="57" y="82" width="6" height="8" rx="1.5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.4" />

          {/* Hotspots */}
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
                  strokeWidth="0.7"
                  strokeOpacity={isActive ? 1 : 0.55}
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