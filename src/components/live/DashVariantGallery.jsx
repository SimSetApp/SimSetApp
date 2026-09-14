function MiniShift({ theme, shape }) {
  const seg = (i) => (i < 5 ? theme.ledGreen : i < 10 ? theme.ledYellow : theme.ledRed);
  const cells = Array.from({ length: 9 });
  if (shape === "arc") {
    return (
      <div className="flex gap-0.5 h-2.5 items-center justify-center">
        {cells.map((_, i) => (
          <div key={i} className="rounded-full" style={{ width: 4, height: 4, background: i < 6 ? seg(i) : "rgba(255,255,255,0.14)" }} />
        ))}
      </div>
    );
  }
  if (shape === "ring") {
    return (
      <div className="flex gap-0.5 h-2.5 items-end">
        {cells.map((_, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: "70%", background: i < 6 ? seg(i) : "rgba(255,255,255,0.12)" }} />
        ))}
      </div>
    );
  }
  // led — round dots
  return (
    <div className="flex gap-0.5 h-2.5 items-center">
      {cells.map((_, i) => (
        <div key={i} className="flex-1 rounded-full" style={{ aspectRatio: "1", height: "80%", background: i < 6 ? seg(i) : "rgba(255,255,255,0.14)" }} />
      ))}
    </div>
  );
}

function MiniMock({ theme, shape }) {
  if (shape === "ring") {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: theme.bg }}>
        <div className="relative" style={{ width: "62%", aspectRatio: "1" }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="none" stroke={theme.panelEdge} strokeWidth="4" />
            <circle cx="50" cy="50" r="44" fill="none" stroke={theme.accent} strokeWidth="4" strokeDasharray="200 360" strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 2px ${theme.accent})` }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold font-digi leading-none" style={{ color: theme.text, fontSize: 17 }}>3</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1" style={{ background: theme.bg }}>
      <MiniShift theme={theme} shape={shape} />
      <div className="flex-1 flex gap-1">
        <div className="flex-1 rounded flex flex-col justify-center px-1" style={{ background: theme.panel, border: `1px solid ${theme.panelEdge}` }}>
          <div className="font-digi leading-none" style={{ color: theme.label, fontSize: 5 }}>TYR</div>
          <div className="font-digi font-bold leading-none" style={{ color: theme.ledGreen, fontSize: 8 }}>82°</div>
        </div>
        <div className="flex-[1.4] rounded flex items-center justify-center" style={{ background: theme.panel, border: `1px solid ${theme.panelEdge}` }}>
          <span className="font-bold font-digi leading-none" style={{ color: theme.text, fontSize: 19 }}>3</span>
        </div>
        <div className="flex-1 rounded flex flex-col justify-center px-1" style={{ background: theme.panel, border: `1px solid ${theme.panelEdge}` }}>
          <div className="font-digi leading-none" style={{ color: theme.label, fontSize: 5 }}>LAP</div>
          <div className="font-digi font-bold leading-none" style={{ color: theme.accent, fontSize: 8 }}>1:58</div>
        </div>
      </div>
    </div>
  );
}

export default function DashVariantGallery({ variants, activeId, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {variants.map((v) => {
        const active = v.id === activeId;
        return (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            className={`shrink-0 rounded-xl border-2 transition-all ${active ? "border-primary shadow-sm" : "border-border hover:border-primary/50"}`}
            style={{ width: 132 }}
            aria-label={`Select ${v.name}`}
            aria-pressed={active}
          >
            <div className="rounded-lg overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
              <MiniMock theme={v.theme} shape={v.shape} />
            </div>
            <div className="text-[10px] font-heading font-medium text-center py-1 text-foreground truncate px-1">{v.name}</div>
          </button>
        );
      })}
    </div>
  );
}