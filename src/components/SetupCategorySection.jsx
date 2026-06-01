import { useState } from "react";
import { ChevronRight, Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap } from "lucide-react";
import SetupParameterCard from "./SetupParameterCard";
import { motion, AnimatePresence } from "framer-motion";

const iconMap = {
  Circle, Settings2, ArrowUpDown, Minus, Wind, Cog, Disc, Zap
};

export default function SetupCategorySection({ category }) {
  const [open, setOpen] = useState(false);
  const IconComp = iconMap[category.icon] || Circle;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <IconComp className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-heading text-sm font-semibold tracking-wide">
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