import { Sliders, RotateCcw, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const ACCENTS = ["#00e5ff", "#00ff66", "#ff1a1a", "#ffe600", "#ff9800", "#a855f7", "#ec4899", "#3b82f6"];

const TOGGLES = [
  { key: "shiftLights", label: "Shift Lights" },
  { key: "sideLeds", label: "Side LEDs" },
  { key: "tyres", label: "Tyres" },
  { key: "fuel", label: "Fuel / Temp" },
  { key: "gear", label: "Gear" },
  { key: "delta", label: "Delta / Time" },
  { key: "cars", label: "Cars Ahead / Behind" },
  { key: "bottom", label: "Status Bar" },
];

export default function DashboardCustomizer({ config, update, toggle, reset, onClose }) {
  return (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-heading font-semibold text-sm">
          <Sliders className="w-4 h-4" /> Customise Dashboard
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset to defaults">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Accent Colour</div>
        <div className="flex flex-wrap gap-2 items-center">
          {ACCENTS.map((c) => (
            <button
              key={c}
              onClick={() => update({ accent: c })}
              className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
              style={{ background: c, borderColor: config.accent === c ? "#fff" : "transparent" }}
              aria-label={`Accent ${c}`}
            />
          ))}
          <label className="w-7 h-7 rounded-full border border-border flex items-center justify-center cursor-pointer overflow-hidden relative hover:scale-110 transition-transform">
            <input
              type="color"
              value={config.accent}
              onChange={(e) => update({ accent: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="w-4 h-4 rounded-full" style={{ background: config.accent }} />
          </label>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Gear Size</span>
          <span className="tabular-nums">{config.gearScale.toFixed(2)}×</span>
        </div>
        <Slider value={[config.gearScale]} min={0.7} max={1.6} step={0.05} onValueChange={(v) => update({ gearScale: v[0] })} />
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2">Show / Hide Sections</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-center justify-between text-sm">
              <span>{t.label}</span>
              <Switch checked={config.show[t.key]} onCheckedChange={() => toggle(t.key)} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Drag the vertical dividers between columns on the dashboard to resize them. Your layout and colours are saved on this device.
      </p>
    </div>
  );
}