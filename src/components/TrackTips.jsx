import { useState } from "react";
import { TRACK_TIPS } from "../lib/simData";
import { TRACK_MAPS } from "../lib/trackMapsData";
import { MapPin, Wind, Lightbulb, ChevronDown, AlertCircle, Flame } from "lucide-react";
import TrackWeatherTips from "./TrackWeatherTips";

function CornerBadge({ corner }) {
  const isCritical = corner.importance === "critical";
  return (
    <div className={`flex items-start gap-2.5 p-3 rounded-lg border ${
      isCritical
        ? "bg-destructive/5 border-destructive/20"
        : "bg-chart-1/5 border-chart-1/20"
    }`}>
      <div className={`mt-0.5 shrink-0 ${isCritical ? "text-destructive" : "text-chart-1"}`}>
        {isCritical
          ? <Flame className="w-3 h-3" />
          : <AlertCircle className="w-3 h-3" />
        }
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
      {/* Header — always visible */}
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

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-border">
          <div className="flex flex-col lg:flex-row">

            {/* Track map */}
            {mapData?.mapUrl && (
              <div className="lg:w-72 xl:w-80 shrink-0 bg-card/60 border-b lg:border-b-0 lg:border-r border-border flex items-center justify-center p-4">
                <div className="relative w-full max-w-[260px] mx-auto">
                  <img
                    src={mapData.mapUrl}
                    alt={`${track} track map`}
                    className="w-full h-auto"
                    style={{
                      filter: "brightness(0) invert(1) opacity(0.9)",
                    }}
                  />
                  {/* Subtle primary glow overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded"
                    style={{
                      background: "radial-gradient(ellipse at center, hsl(var(--primary)/6%) 0%, transparent 70%)",
                    }}
                  />
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

              {/* Time loss zones */}
              {mapData?.keyCorners && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-destructive" />
                    Where time is lost
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mapData.keyCorners.map((corner, i) => (
                      <CornerBadge key={i} corner={corner} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2.5 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-destructive" /> Critical — most time lost/gained</span>
                    <span className="flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5 text-chart-1" /> Secondary — significant</span>
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