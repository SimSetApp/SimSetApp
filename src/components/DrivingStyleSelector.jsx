import { Check, Zap, Crosshair, RotateCw, TrendingUp } from "lucide-react";

const STYLES = [
  { value: "Smooth & Consistent", icon: Check, desc: "Prioritises consistency and tyre preservation over outright pace." },
  { value: "Aggressive & Attack", icon: Zap, desc: "Pushes hard on entry and exit. Needs a stable platform." },
  { value: "Trail-Braker", icon: Crosshair, desc: "Carries brake into the apex. Needs rotation-friendly coast settings." },
  { value: "Late Apex Rotator", icon: RotateCw, desc: "Rotates the car late for tight exits. Needs free diff and soft rear." },
  { value: "High-Speed Specialist", icon: TrendingUp, desc: "Lives in fast sweepers. Needs aero confidence and rear stability." },
];

export default function DrivingStyleSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {STYLES.map(s => {
        const Icon = s.icon;
        const active = value === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onChange(s.value)}
            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-primary/20" : "bg-muted"}`}>
              <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{s.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export { STYLES as DRIVING_STYLES };