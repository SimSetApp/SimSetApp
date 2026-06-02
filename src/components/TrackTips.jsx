import { TRACK_TIPS } from "../lib/simData";
import { MapPin, Wind, Lightbulb } from "lucide-react";
import TrackWeatherTips from "./TrackWeatherTips";

export default function TrackTips() {
  return (
    <div className="space-y-3">
      {Object.entries(TRACK_TIPS).map(([track, data]) => (
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
        </div>
      ))}
    </div>
  );
}