import { Loader2, ArrowDown } from "lucide-react";

const THRESHOLD = 72;

export default function PullToRefreshIndicator({ pullY, refreshing }) {
  if (!pullY && !refreshing) return null;
  const progress = Math.min(pullY / THRESHOLD, 1);
  const ready = pullY >= THRESHOLD;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-all duration-150"
      style={{ height: refreshing ? 48 : pullY }}
    >
      {refreshing ? (
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      ) : (
        <ArrowDown
          className="w-5 h-5 text-muted-foreground transition-transform"
          style={{
            transform: `rotate(${ready ? 180 : progress * 180}deg)`,
            opacity: progress,
          }}
        />
      )}
    </div>
  );
}