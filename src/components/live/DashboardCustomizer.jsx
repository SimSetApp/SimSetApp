import { Sliders, RotateCcw, Pencil, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const ACCENTS = ["#00e5ff", "#00ff66", "#ff1a1a", "#ffe600", "#ff9800", "#a855f7", "#ec4899", "#3b82f6"];

export default function DashboardCustomizer({ config, update, reset, edit, onToggleEdit }) {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-semibold text-sm">
          <Sliders className="w-4 h-4" /> Dashboard Settings
        </div>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset to defaults">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Default Accent Colour</div>
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => update({ accent: c })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: config.accent === c ? "#fff" : "transparent" }}
            />
          ))}
          <label className="w-7 h-7 rounded-full border border-border flex items-center justify-center cursor-pointer overflow-hidden relative hover:scale-110 transition-transform">
            <input type="color" value={config.accent} onChange={(e) => update({ accent: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer" />
            <span className="w-4 h-4 rounded-full" style={{ background: config.accent }} />
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Dashboard Scale</span>
          <span className="tabular-nums">{config.scale.toFixed(2)}×</span>
        </div>
        <Slider value={[config.scale]} min={0.6} max={1.5} step={0.05} onValueChange={(v) => update({ scale: v[0] })} />
      </div>

      <Button onClick={onToggleEdit} variant={edit ? "default" : "outline"} className="w-full gap-2">
        {edit ? <><Check className="w-4 h-4" /> Exit Edit Mode</> : <><Pencil className="w-4 h-4" /> Edit Layout</>}
      </Button>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        In edit mode, drag widgets to move them, drag the bottom-right corner to resize, and tap the colour dot to recolor each gauge. Your layout is saved on this device.
      </p>
    </div>
  );
}