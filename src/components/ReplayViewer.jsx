import { useState } from "react";
import { Video, Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReplayViewer({ urls = [] }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!urls || urls.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => { setCurrent(0); setOpen(true); }}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <Play className="w-3.5 h-3.5" />
        Watch {urls.length} Replay{urls.length > 1 ? "s" : ""}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-card border border-border shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">
                  Replay {current + 1} / {urls.length}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video */}
            <div className="bg-black aspect-video">
              <video
                key={urls[current]}
                src={urls[current]}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>

            {/* Navigation */}
            {urls.length > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrent(i => Math.max(0, i - 1))}
                  disabled={current === 0}
                  className="text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                <div className="flex gap-1.5">
                  {urls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/40"}`}
                    />
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrent(i => Math.min(urls.length - 1, i + 1))}
                  disabled={current === urls.length - 1}
                  className="text-xs"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}