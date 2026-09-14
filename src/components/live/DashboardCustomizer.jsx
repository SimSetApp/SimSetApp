import { memo } from "react";
import { Sliders, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCENTS = ["#00e5ff", "#00ff66", "#ff1a1a", "#ffe600", "#ff9800", "#a855f7", "#ec4899", "#3b82f6", "#ffffff"];

function DashboardCustomizerInner({ config, update, reset }) {
  const UnitToggle = ({ field, opts }) => (
    <div className="flex gap-1">
      {opts.map((o) => (
        <button
          key={o.value}
          onClick={() => update({ units: { ...config.units, [field]: o.value } })}
          className="flex-1 h-8 rounded-lg text-xs font-heading font-medium transition-colors"
          style={{
            background: config.units[field] === o.value ? "hsl(var(--primary))" : "hsl(var(--secondary))",
            color: config.units[field] === o.value ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    // Plain card — no .glass class, so no hover-lift side effect on this panel
    <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-semibold text-sm">
          <Sliders className="w-4 h-4" /> Display Options
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset to defaults">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Accent Colour</div>
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => update({ accent: c })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: config.accent === c ? "hsl(var(--foreground))" : "transparent" }}
            />
          ))}
          <label className="w-7 h-7 rounded-full border border-border flex items-center justify-center cursor-pointer overflow-hidden relative hover:scale-110 transition-transform">
            <input type="color" value={config.accent} onChange={(e) => update({ accent: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span className="w-4 h-4 rounded-full" style={{ background: config.accent }} />
          </label>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1.5">Speed Unit</div>
        <UnitToggle field="speed" opts={[{ value: "kmh", label: "km/h" }, { value: "mph", label: "mph" }]} />
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1.5">Tyre Pressure Unit</div>
        <UnitToggle field="pressure" opts={[{ value: "psi", label: "psi" }, { value: "bar", label: "bar" }]} />
      </div>
    </div>
  );
}

const DashboardCustomizer = memo(DashboardCustomizerInner);
export default DashboardCustomizer;