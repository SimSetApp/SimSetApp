import { useState } from "react";
import { TRACK_TIPS } from "../lib/simData";
import { TRACK_MAPS } from "../lib/trackMapsData";
import { MapPin, Wind, Lightbulb, ChevronDown, AlertCircle, Flame } from "lucide-react";
import TrackWeatherTips from "./TrackWeatherTips";

// Simple track map — clean outline, no markers
function TrackMap({ mapUrl, track }) {
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden"
      style={{
        aspectRatio: "4/3",
        background: "hsl(var(--card))",
        boxShadow: "0 0 0 1px hsl(var(--border)), 0 0 0 2px hsl(var(--background))",
      }}
    >
      <img
        src={mapUrl}
        alt={`${track} track map`}
        className="absolute inset-0 w-full h-full object-contain p-3"
        style={{
          filter:
            "brightness(0) invert(1) " +
            "drop-shadow(0px 0px 3px rgba(69, 179, 47, 0.95)) " +
            "drop-shadow(0px 0px 6px rgba(0,0,0,0.8)) " +
            "drop-shadow(0px 0px 1px rgba(0,0,0,1)) " +
            "opacity(0.92)",
        }}
        draggable={false}
      />
    </div>
  );
}

// Rookie corner card — structured with what/inputs/setup
function RookieCornerCard({ corner }) {
  const isCritical = corner.importance === "critical";
  const r = corner.rookie;
  return (
    <div className={`rounded-lg border p-3 space-y-2.5 ${
      isCritical ? "bg-destructive/5 border-destructive/20" : "bg-chart-1/5 border-chart-1/20"
    }`}>
      <p className={`text-xs font-semibold flex items-center gap-1.5 ${isCritical ? "text-destructive" : "text-chart-1"}`}>
        {isCritical ? <Flame className="w-3 h-3 shrink-0" /> : <AlertCircle className="w-3 h-3 shrink-0" />}
        {corner.name}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">{r.what}</p>
      <div className="space-y-1.5">
        <div className="flex gap-2 items-start">
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">INPUTS</span>
          <p className="text-xs text-muted-foreground leading-relaxed">{r.inputs}</p>
        </div>
        <div className="flex gap-2 items-start">
          <span className="text-[10px] font-semibold text-chart-2 bg-chart-2/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">SETUP</span>
          <p className="text-xs text-muted-foreground leading-relaxed">{r.setup}</p>
        </div>
      </div>
    </div>
  );
}

// Pro corner card — technical with inputs/setup
function ProCornerCard({ corner }) {
  const isCritical = corner.importance === "critical";
  const r = corner.rookie;
  return (
    <div className={`rounded-lg border p-3 space-y-2 ${
      isCritical ? "bg-destructive/5 border-destructive/20" : "bg-chart-1/5 border-chart-1/20"
    }`}>
      <div className="flex items-start gap-2">
        <div className={`mt-0.5 shrink-0 ${isCritical ? "text-destructive" : "text-chart-1"}`}>
          {isCritical ? <Flame className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
        </div>
        <div>
          <p className={`text-xs font-semibold ${isCritical ? "text-destructive" : "text-chart-1"}`}>{corner.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{corner.note}</p>
        </div>
      </div>
      {r && (
        <div className="space-y-1.5 pl-5">
          <div className="flex gap-2 items-start">
            <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">INPUTS</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.inputs}</p>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-[10px] font-semibold text-chart-2 bg-chart-2/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">SETUP</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.setup}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Rookie / Pro toggle pill
function ModeToggle({ isRookie, onChange }) {
  return (
    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted border border-border text-xs font-semibold">
      <button
        onClick={() => onChange(true)}
        className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
          isRookie
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        🟢 Rookie
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-2.5 py-1 rounded-md transition-all duration-150 ${
          !isRookie
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        🏁 Pro
      </button>
    </div>
  );
}

function TrackCard({ track, data, isRookie }) {
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

      {expanded && (
        <div className="border-t border-border">
          <div className="flex flex-col lg:flex-row">

            {/* Track map */}
            {mapData?.mapUrl && (
              <div className="lg:w-72 xl:w-80 shrink-0 p-4 border-b lg:border-b-0 lg:border-r border-border flex items-center justify-center">
                <TrackMap mapUrl={mapData.mapUrl} track={track} />
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

              {/* Main tip — mode-aware */}
              <div className="flex gap-2 items-start">
                <Lightbulb className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isRookie && mapData?.rookieTip ? mapData.rookieTip : data.tips}
                </p>
              </div>

              <TrackWeatherTips track={track} />

              {/* Corner breakdown */}
              {mapData?.keyCorners && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-destructive" />
                    {isRookie ? "Key corners to learn" : "Where time is lost"}
                  </p>
                  <div className="grid gap-2 grid-cols-1">
                    {mapData.keyCorners.map((corner, i) =>
                      isRookie
                        ? <RookieCornerCard key={i} corner={corner} />
                        : <ProCornerCard key={i} corner={corner} />
                    )}
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
  const [isRookie, setIsRookie] = useState(false);

  return (
    <div className="space-y-3">
      {/* Global toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isRookie
            ? "Rookie mode — plain language with driver input & setup tips"
            : "Pro mode — concise technical notes"}
        </p>
        <ModeToggle isRookie={isRookie} onChange={setIsRookie} />
      </div>

      <div className="space-y-2">
        {Object.entries(TRACK_TIPS).map(([track, data]) => (
          <TrackCard key={track} track={track} data={data} isRookie={isRookie} />
        ))}
      </div>
    </div>
  );
}