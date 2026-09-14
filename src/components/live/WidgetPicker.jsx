import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WIDGET_DEFS } from "@/components/live/dashboardWidgets";
import {
  Gauge, BarChart3, Lightbulb, Disc, Fuel,
  Settings, TrendingUp, Timer, Users, SlidersHorizontal, LayoutGrid, Trash2,
} from "lucide-react";

const ICONS = {
  rpmGear: Gauge,
  rpmBar: BarChart3,
  shiftLights: Lightbulb,
  speed: Gauge,
  tyres: Disc,
  fuel: Fuel,
  gear: Settings,
  delta: TrendingUp,
  laps: Timer,
  cars: Users,
  inputs: SlidersHorizontal,
  status: LayoutGrid,
};

export default function WidgetPicker({ open, onOpenChange, currentType, onSelect, onClear }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Choose widget</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {WIDGET_DEFS.map((w) => {
            const Icon = ICONS[w.type] || LayoutGrid;
            const active = w.type === currentType;
            return (
              <button
                key={w.type}
                onClick={() => onSelect(w.type)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0 text-primary" />
                <span className="text-sm font-medium">{w.label}</span>
              </button>
            );
          })}
        </div>
        {currentType && currentType !== "empty" && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 mt-3 text-sm text-destructive hover:text-destructive/80 transition-colors w-full justify-center py-2 rounded-lg border border-destructive/30 hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" /> Clear slot
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}