import { useState } from "react";

const GROUP_COLORS = [
  { icon: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", text: "text-amber-400" },
  { icon: "text-blue-400",  bg: "bg-blue-400/10",  border: "border-blue-400/20",  text: "text-blue-400" },
  { icon: "text-violet-400",bg: "bg-violet-400/10",border: "border-violet-400/20",text: "text-violet-400" },
  { icon: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", text: "text-green-400" },
  { icon: "text-sky-400",   bg: "bg-sky-400/10",   border: "border-sky-400/20",   text: "text-sky-400" },
  { icon: "text-orange-400",bg: "bg-orange-400/10",border: "border-orange-400/20",text: "text-orange-400" },
  { icon: "text-rose-400",  bg: "bg-rose-400/10",  border: "border-rose-400/20",  text: "text-rose-400" },
  { icon: "text-cyan-400",  bg: "bg-cyan-400/10",  border: "border-cyan-400/20",  text: "text-cyan-400" },
];
import { ChevronRight, Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap } from "lucide-react";
import SetupParameterCard from "./SetupParameterCard";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap
};

export default function SetupCategorySection({ category, index = 0 }) {
  const color = GROUP_COLORS[index % GROUP_COLORS.length];
  const [open, setOpen] = useState(false);
  const IconComp = iconMap[category.icon] || Circle;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center shrink-0`}>
          <IconComp className={`w-5 h-5 ${color.icon}`} />
        </div>
        <div className="flex-1 text-left">
          <h3 className={`font-heading text-sm font-semibold tracking-wide ${color.text}`}>
            {category.category}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {category.params.length} parameter{category.params.length > 1 ? "s" : ""}
          </p>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-2">
              {category.params.map(param => (
                <SetupParameterCard key={param.name} param={param} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}