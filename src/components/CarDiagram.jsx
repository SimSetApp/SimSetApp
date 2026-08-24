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

export default function CarDiagram({ onSelect, activeCategory }) {
  const [hovered, setHovered] = useState(null);

  // Hotspot positions on the car SVG (percentage based)
  const hotspots = [
    { id: "aero", cx: 15, cy: 25, label: "Front Wing", r: 8 },
    { id: "aero", cx: 85, cy: 25, label: "Rear Wing", r: 8 },
    { id: "suspension", cx: 25, cy: 50, label: "Front Springs", r: 7 },
    { id: "suspension", cx: 75, cy: 50, label: "Rear Springs", r: 7 },
    { id: "arb", cx: 25, cy: 62, label: "Front ARB", r: 6 },
    { id: "arb", cx: 75, cy: 62, label: "Rear ARB", r: 6 },
    { id: "geometry", cx: 25, cy: 75, label: "Front Alignment", r: 7 },
    { id: "geometry", cx: 75, cy: 75, label: "Rear Alignment", r: 7 },
    { id: "diff", cx: 50, cy: 55, label: "Differential", r: 7 },
    { id: "brakes", cx: 20, cy: 80, label: "Front Brakes", r: 6 },
    { id: "brakes", cx: 80, cy: 80, label: "Rear Brakes", r: 6 },
    { id: "electronics", cx: 50, cy: 35, label: "ECU / TC / ABS", r: 7 },
    { id: "tyres", cx: 15, cy: 82, label: "Front Tyres", r: 6 },
    { id: "tyres", cx: 85, cy: 82, label: "Rear Tyres", r: 6 },
  ];

  const activeId = hovered || activeCategory;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Car className="w-4 h-4 text-primary" />
        <h3 className="font-heading text-sm font-bold tracking-wide">Interactive Car Diagram</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Tap any part of the car to jump to that parameter group.</p>

      {/* Car SVG */}
      <div className="relative aspect-[16/10] w-full max-w-md mx-auto">
        <svg viewBox="0 0 100 62" className="w-full h-full" style={{ overflow: "visible" }}>
          {/* Car body silhouette */}
          <path
            d="M 8 35 Q 8 28 15 26 L 25 22 Q 35 18 50 18 Q 65 18 75 22 L 85 26 Q 92 28 92 35 L 92 48 Q 92 52 88 52 L 12 52 Q 8 52 8 48 Z"
            fill="hsl(var(--secondary))"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          {/* Cockpit */}
          <path
            d="M 35 22 Q 40 16 50 16 Q 60 16 65 22 L 62 26 Q 55 24 50 24 Q 45 24 38 26 Z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="0.3"
          />
          {/* Front wing */}
          <rect x="3" y="30" width="6" height="14" rx="1" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.3" />
          {/* Rear wing */}
          <rect x="91" y="24" width="6" height="18" rx="1" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.3" />
          {/* Wheels */}
          <circle cx="20" cy="50" r="6" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <circle cx="80" cy="50" r="6" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <circle cx="20" cy="50" r="3" fill="hsl(var(--muted))" />
          <circle cx="80" cy="50" r="3" fill="hsl(var(--muted))" />

          {/* Hotspots */}
          {hotspots.map((h, i) => {
            const cat = PARAM_CATEGORIES.find(c => c.id === h.id);
            const isActive = activeId === h.id;
            return (
              <g key={i}>
                <circle
                  cx={h.cx}
                  cy={h.cy * 0.62}
                  r={isActive ? h.r + 1 : h.r}
                  fill={isActive ? "currentColor" : "transparent"}
                  className={isActive ? cat.color : cat.color}
                  fillOpacity={isActive ? 0.3 : 0}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeOpacity={isActive ? 1 : 0.5}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={() => setHovered(h.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelect?.(h.id)}
                />
                {isActive && (
                  <text
                    x={h.cx}
                    y={h.cy * 0.62 - h.r - 2}
                    textAnchor="middle"
                    fill="currentColor"
                    className={cat.color}
                    style={{ fontSize: "3px", fontWeight: "bold", pointerEvents: "none" }}
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