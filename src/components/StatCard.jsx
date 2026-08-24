function MiniRing({ value, tone }) {
  const r = 11;
  const C = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, value / 100));
  const cls = tone || "text-primary";
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7 -rotate-90 shrink-0">
      <circle cx="14" cy="14" r={r} fill="none" strokeWidth="3" className="stroke-border" />
      <circle
        cx="14" cy="14" r={r} fill="none" strokeWidth="3"
        stroke="currentColor" className={cls}
        strokeDasharray={`${frac * C} ${C}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray .4s ease" }}
      />
    </svg>
  );
}

export default function StatCard({ icon: Icon, label, value, unit, tone, gauge, gaugeTone }) {
  return (
    <div className="group relative rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-3 overflow-hidden transition-all duration-200 hover:border-primary/30 hover:bg-card h-full">
      <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-center justify-between gap-2 h-full">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{label}</span>
          </div>
          <div className={`text-xl font-bold tabular-nums font-digi leading-tight ${tone || "text-foreground"}`}>
            {value}
            {unit && <span className="text-xs text-muted-foreground ml-0.5 font-body font-normal">{unit}</span>}
          </div>
        </div>
        {gauge != null && <MiniRing value={gauge} tone={gaugeTone || tone} />}
      </div>
    </div>
  );
}