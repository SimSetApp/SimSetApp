import { useState } from "react";
import { TRACK_TIPS } from "../lib/simData";
import { TRACK_MAPS } from "../lib/trackMapsData";
import { MapPin, Wind, Lightbulb, ChevronDown, AlertCircle, Flame } from "lucide-react";
import TrackWeatherTips from "./TrackWeatherTips";

// Accurate marker dots overlaid on the track map image
function TrackMapOverlay({ mapUrl, keyCorners, track }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: "4/3" }}>
      {/* Dark backing card with contrast border */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          background: "hsl(var(--card))",
          boxShadow: "0 0 0 1px hsl(var(--border)), 0 0 0 2px hsl(var(--background))",
        }}
      >
        {/* Track map — thin white line with dark outline contrast */}
        <img
          src={mapUrl}
          alt={`${track} track map`}
          className="absolute inset-0 w-full h-full object-contain p-3"
          style={{
            // Renders the SVG as thin white lines with a dark drop-shadow for contrast
            filter:
              "brightness(0) invert(1) " +
              "drop-shadow(0px 0px 3px rgba(0,0,0,0.95)) " +
              "drop-shadow(0px 0px 6px rgba(0,0,0,0.8)) " +
              "drop-shadow(0px 0px 1px rgba(0,0,0,1)) " +
              "opacity(0.92)",
          }}
          draggable={false}
        />
      </div>

      {/* Corner markers */}
      {keyCorners.map((corner, i) => {
        const isCritical = corner.importance === "critical";
        const isHovered = hovered === i;
        const [left, top] = corner.marker;

        return (
          <div
            key={i}
            className="absolute z-10"
            style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(isHovered ? null : i)}
          >
            {/* Pulse ring */}
            <div
              className={`absolute inset-0 rounded-full animate-ping ${
                isCritical ? "bg-destructive/50" : "bg-chart-1/40"
              }`}
              style={{ width: 14, height: 14, margin: -2 }}
            />
            {/* Dot — outlined for contrast */}
            <div
              className={`relative rounded-full cursor-pointer transition-transform duration-150 ${
                isHovered ? "scale-150" : "scale-100"
              }`}
              style={{
                width: 10,
                height: 10,
                background: isCritical ? "hsl(var(--destructive))" : "hsl(var(--chart-1))",
                boxShadow: `0 0 0 1.5px hsl(var(--background)), 0 0 0 3px ${
                  isCritical ? "hsl(var(--destructive)/60%)" : "hsl(var(--chart-1)/50%)"
                }, 0 2px 8px rgba(0,0,0,0.7)`,
              }}
            />

            {/* Tooltip */}
            {isHovered && (
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  minWidth: 160,
                  maxWidth: 220,
                }}
              >
                <div
                  className="rounded-lg p-2.5 text-xs shadow-xl"
                  style={{
                    background: "hsl(var(--card))",
                    border: `1px solid ${isCritical ? "hsl(var(--destructive)/40%)" : "hsl(var(--chart-1)/40%)"}`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  }}
                >
                  <p
                    className="font-semibold mb-1 flex items-center gap-1.5"
                    style={{ color: isCritical ? "hsl(var(--destructive))" : "hsl(var(--chart-1))" }}
                  >
                    {isCritical ? <Flame className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
                    {corner.name}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{corner.note}</p>
                </div>
                {/* Arrow */}
                <div
                  className="mx-auto w-2 h-2 rotate-45 -mt-1"
                  style={{
                    background: "hsl(var(--card))",
                    borderRight: `1px solid ${isCritical ? "hsl(var(--destructive)/40%)" : "hsl(var(--chart-1)/40%)"}`,
                    borderBottom: `1px solid ${isCritical ? "hsl(var(--destructive)/40%)" : "hsl(var(--chart-1)/40%)"}`,
                  }}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div
        className="absolute bottom-2 right-2 flex items-center gap-2 px-2 py-1 rounded-md text-[9px] text-muted-foreground"
        style={{ background: "hsl(var(--background)/80%)" }}
      >
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive inline-block" /> Critical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: "hsl(var(--chart-1))" }} /> Key zone
        </span>
      </div>
    </div>
  );
}

function CornerBadge({ corner, index }) {
  const isCritical = corner.importance === "critical";
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
      isCritical
        ? "bg-destructive/5 border-destructive/20"
        : "bg-chart-1/5 border-chart-1/20"
    }`}>
      <div className={`mt-0.5 shrink-0 ${isCritical ? "text-destructive" : "text-chart-1"}`}>
        {isCritical ? <Flame className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
      </div>
      <div>
        <p className={`text-xs font-semibold ${isCritical ? "text-destructive" : "text-chart-1"}`}>
          {corner.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{corner.note}</p>
      </div>
    </div>
  );
}

function TrackCard({ track, data }) {
  const [expanded, setExpanded] = useState(false);
  const mapData = TRACK_MAPS[track];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <h4 className="font-heading text-sm font-semibold tracking-wide truncate">{track}</h4>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block">{data.character}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="border-t border-border">
          <div className="flex flex-col lg:flex-row">

            {/* Track map with markers */}
            {mapData?.mapUrl && (
              <div className="lg:w-72 xl:w-80 shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-border flex items-center justify-center">
                <div className="w-full">
                  <TrackMapOverlay
                    mapUrl={mapData.mapUrl}
                    keyCorners={mapData.keyCorners}
                    track={track}
                  />
                  <p className="text-center text-[10px] text-muted-foreground mt-2">Hover markers for corner details</p>
                </div>
              </div>
            )}

            {/* Details */}
            <div className="flex-1 p-4 space-y-4">
              {/* Character + wing */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs text-muted-foreground">
                  {data.character}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
                  <Wind className="w-3 h-3" />
                  Wing: {data.wing}
                </span>
              </div>

              {/* Setup tips */}
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{data.tips}</p>
              </div>

              {/* Weather tips */}
              <TrackWeatherTips track={track} />

              {/* Corner list */}
              {mapData?.keyCorners && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-destructive" />
                    Where time is lost
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mapData.keyCorners.map((corner, i) => (
                      <CornerBadge key={i} corner={corner} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackTips() {
  return (
    <div className="space-y-2">
      {Object.entries(TRACK_TIPS).map(([track, data]) => (
        <TrackCard key={track} track={track} data={data} />
      ))}
    </div>
  );
}