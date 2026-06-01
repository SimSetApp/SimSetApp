import { useState, useEffect } from "react";

const GROUP_COLORS = [
  { bg: "bg-amber-400/10",  border: "border-amber-400/30",  text: "text-amber-400",  slider: "[&_[role=slider]]:bg-amber-400" },
  { bg: "bg-blue-400/10",   border: "border-blue-400/30",   text: "text-blue-400",   slider: "[&_[role=slider]]:bg-blue-400" },
  { bg: "bg-green-400/10",  border: "border-green-400/30",  text: "text-green-400",  slider: "[&_[role=slider]]:bg-green-400" },
  { bg: "bg-violet-400/10", border: "border-violet-400/30", text: "text-violet-400", slider: "[&_[role=slider]]:bg-violet-400" },
  { bg: "bg-orange-400/10", border: "border-orange-400/30", text: "text-orange-400", slider: "[&_[role=slider]]:bg-orange-400" },
  { bg: "bg-rose-400/10",   border: "border-rose-400/30",   text: "text-rose-400",   slider: "[&_[role=slider]]:bg-rose-400" },
  { bg: "bg-cyan-400/10",   border: "border-cyan-400/30",   text: "text-cyan-400",   slider: "[&_[role=slider]]:bg-cyan-400" },
];
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ParamRow({ param, value, onChange }) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{param.label}</span>
        <Badge variant="outline" className="text-xs font-mono min-w-[56px] text-center">
          {value.toFixed(param.step < 1 ? 1 : 0)}{param.unit}
        </Badge>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(param.key, v)}
        min={param.min}
        max={param.max}
        step={param.step}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-0.5">
        <span>{param.min}{param.unit}</span>
        <span>{param.max}{param.unit}</span>
      </div>
    </div>
  );
}

function GroupSection({ group, values, onChange, colorIndex = 0 }) {
  const color = GROUP_COLORS[colorIndex % GROUP_COLORS.length];
  const [open, setOpen] = useState(true);

  return (
    <div className={`rounded-xl border ${color.border} bg-card overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors"
      >
        <span className={`font-heading text-xs font-semibold tracking-wider ${color.text}`}>{group.group}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{group.params.length} params</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="px-4 pb-3 divide-y divide-border">
              {group.params.map(param => (
                <ParamRow
                  key={param.key}
                  param={param}
                  value={values[param.key] ?? param.default}
                  onChange={onChange}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SetupEditorForm({ sim, parameters, onChange }) {
  const groups = sim ? SIM_SETUP_PARAMS[sim] : null;

  // Initialize defaults when sim changes
  useEffect(() => {
    if (!groups) return;
    const defaults = {};
    groups.forEach(g => g.params.forEach(p => {
      if (parameters[p.key] === undefined) {
        defaults[p.key] = p.default;
      }
    }));
    if (Object.keys(defaults).length > 0) {
      onChange({ ...parameters, ...defaults });
    }
  }, [sim]);

  const handleChange = (key, value) => {
    onChange({ ...parameters, [key]: value });
  };

  if (!groups) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Select a sim to see available setup parameters
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group, idx) => (
        <GroupSection
          key={group.group}
          group={group}
          values={parameters}
          onChange={handleChange}
          colorIndex={idx}
        />
      ))}
    </div>
  );
}