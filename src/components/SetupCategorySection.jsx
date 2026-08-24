import { useState } from "react";

const GROUP_COLORS = [
  { icon: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20",  text: "text-amber-400",  sliderVar: "#fbbf24" },
  { icon: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20",   text: "text-blue-400",   sliderVar: "#60a5fa" },
  { icon: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", text: "text-violet-400", sliderVar: "#a78bfa" },
  { icon: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20",  text: "text-green-400",  sliderVar: "#4ade80" },
  { icon: "text-sky-400",    bg: "bg-sky-400/10",    border: "border-sky-400/20",    text: "text-sky-400",    sliderVar: "#38bdf8" },
  { icon: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", text: "text-orange-400", sliderVar: "#fb923c" },
  { icon: "text-rose-400",   bg: "bg-rose-400/10",   border: "border-rose-400/20",   text: "text-rose-400",   sliderVar: "#fb7185" },
  { icon: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/20",   text: "text-cyan-400",   sliderVar: "#22d3ee" },
];
import { ChevronRight, Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap } from "lucide-react";
import SetupParameterCard from "./SetupParameterCard";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap
};

export default function SetupCategorySection({ category, index = 0, defaultOpen = false }) {
  const color = GROUP_COLORS[index % GROUP_COLORS.length];
  const [open, setOpen] = useState(defaultOpen);
  const IconComp = iconMap[category.icon] || Circle;

  return (
    <div className={`rounded-2xl border bg-card overflow-hidden transition-colors duration-200 ${open ? `${color.border}` : "border-border"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-muted/40 active:bg-muted/60 transition-colors"
      >
        <div className={`w-9 h-9 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
          <IconComp className={`w-4.5 h-4.5 ${color.icon}`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <h3 className={`font-heading text-sm font-semibold tracking-wide ${color.text} truncate`}>
            {category.category}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {category.params.length} param{category.params.length > 1 ? "s" : ""}
          </p>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${open ? `${color.bg}` : "bg-muted/60"}`}>
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${open ? `rotate-90 ${color.text}` : "text-muted-foreground"}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2">
              {category.params.map(param => (
                <SetupParameterCard key={param.name} param={param} color={color} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}