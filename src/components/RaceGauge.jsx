export default function RaceGauge({ value, tone, icon: Icon, centerValue, unit, label, sublabel, onMinus, onPlus }) {
  const r = 42;
  const C = 2 * Math.PI * r;
  const sweep = 0.75; // 270°
  const trackDash = `${sweep * C} ${C}`;
  const frac = Math.max(0, Math.min(1, value / 100));
  const valDash = `${frac * sweep * C} ${C}`;
  const toneStroke = { good: "text-green-400", warn: "text-amber-400", bad: "text-red-400" };

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full rotate-[135deg]">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="7" className="stroke-border" strokeDasharray={trackDash} strokeLinecap="round" />
          <circle
            cx="50" cy="50" r={r} fill="none" strokeWidth="7"
            className={toneStroke[tone]} stroke="currentColor"
            strokeDasharray={valDash} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.45s ease, color 0.3s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className={`w-4 h-4 mb-0.5 ${toneStroke[tone]}`} />
          <div className={`text-2xl font-bold tabular-nums font-digi leading-none ${toneStroke[tone]}`}>{centerValue}</div>
          <div className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">{unit}</div>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-2 font-medium">{label}</div>
      <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">{sublabel}</div>
      <div className="flex gap-1.5 mt-2 w-full">
        <button onClick={onMinus} className="flex-1 h-8 rounded-lg border border-border/60 bg-secondary/60 text-sm font-bold active:scale-95 transition-transform flex items-center justify-center">
          <span className="text-lg leading-none">−</span>
        </button>
        <button onClick={onPlus} className="flex-1 h-8 rounded-lg border border-border/60 bg-secondary/60 text-sm font-bold active:scale-95 transition-transform flex items-center justify-center">
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </div>
  );
}