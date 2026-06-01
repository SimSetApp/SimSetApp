import { useState } from "react";
import { ChevronDown, Lightbulb, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupParameterCard({ param, color }) {
  const c = color || { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary", sliderVar: "hsl(var(--primary))" };
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border transition-all duration-300 ${
        expanded
          ? `${c.border} ${c.bg}`
          : "border-border bg-card hover:border-primary/20"
      }`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="font-medium text-sm">{param.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Direction indicator */}
              <div className="bg-secondary rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>← {param.left}</span>
                  <span>{param.right} →</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 rounded-full" style={{backgroundImage: `linear-gradient(to right, hsl(var(--muted)), ${c.sliderVar})`}} />
                </div>
              </div>

              {/* Effects */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/60 border border-border p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">← Effect</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{param.leftEffect}</p>
                </div>
                <div className={`rounded-lg ${c.bg} ${c.border} border p-3`}>
                  <div className={`text-xs font-medium ${c.text} mb-1`}>Effect →</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{param.rightEffect}</p>
                </div>
              </div>

              {/* Tip */}
              <div className="flex gap-3 items-start">
                <div className={`mt-0.5 w-6 h-6 rounded-md ${c.bg} flex items-center justify-center shrink-0`}>
                  <Lightbulb className={`w-3.5 h-3.5 ${c.text}`} />
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{param.tip}</p>
              </div>

              {/* Advanced */}
              {param.advanced && (
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{param.advanced}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}