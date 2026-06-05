import { useState } from "react";
import { TRACK_TIPS } from "../lib/simData";
import { MapPin, Wind, Lightbulb, Map, ChevronDown, ChevronUp } from "lucide-react";
import TrackWeatherTips from "./TrackWeatherTips";
import CircuitMap, { CIRCUIT_MAPS } from "./CircuitMap";

export default function TrackTips() {
  const [expandedMap, setExpandedMap] = useState(null);

  return (
    <div className="space-y-3">
      {Object.entries(TRACK_TIPS).map(([track, data]) => {
        const hasMap = !!CIRCUIT_MAPS[track];
        const mapOpen = expandedMap === track;

        return (
          <div
            key={track}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <h4 className="font-heading text-sm font-semibold tracking-wide">{track}</h4>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{data.character}</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Wind className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground">
                Wing: <span className="text-foreground font-medium">{data.wing}</span>
              </span>
            </div>

            <div className="mt-2 flex gap-2 items-start">
              <Lightbulb className="w-3 h-3 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">{data.tips}</p>
            </div>

            <TrackWeatherTips track={track} />

            {/* Circuit map toggle */}
            {hasMap && (
              <div className="mt-3">
                <button
                  onClick={() => setExpandedMap(mapOpen ? null : track)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Map className="w-3.5 h-3.5" />
                  {mapOpen ? "Hide circuit map" : "View circuit map & time-loss areas"}
                  {mapOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {mapOpen && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">
                      Tap a numbered zone to see setup advice for that section.
                    </p>
                    <CircuitMap trackName={track} />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}