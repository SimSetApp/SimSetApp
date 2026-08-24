function MiniShift({ theme, shape }) {
  const seg = (i) => (i < 5 ? theme.ledGreen : i < 10 ? theme.ledYellow : theme.ledRed);
  const cells = Array.from({ length: 9 });
  if (shape === "bars") {
    return (
      <div className="flex gap-0.5 h-2.5 items-end">
        {cells.map((_, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: "92%", background: i < 6 ? seg(i) : "rgba(255,255,255,0.12)" }} />
        ))}
      </div>
    );
  }
  if (shape === "dial") {
    return (
      <div className="flex gap-0.5 h-2.5 items-center justify-around">
        {cells.map((_, i) => (
          <div key={i} style={{ width: 6, height: 6, background: i < 6 ? seg(i) : "transparent", border: i < 6 ? "none" : "1px solid rgba(255,255,255,0.18)", transform: "rotate(45deg)" }} />
        ))}
      </div>
    );
  }
  // led & arc — round dots
  return (
    <div className="flex gap-0.5 h-2.5 items-center">
      {cells.map((_, i) => (
        <div key={i} className="flex-1 rounded-full" style={{ aspectRatio: "1", height: "80%", background: i < 6 ? seg(i) : "rgba(255,255,255,0.14)" }} />
      ))}
    </div>
  );
}

function MiniMock({ theme, shape }) {
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1" style={{ background: theme.bg }}>
      <MiniShift theme={theme} shape={shape} />
      <div className="flex-1 flex gap-1">
        <div className="flex-1 rounded" style={{ background: theme.panel, border: `1px solid ${theme.border}` }} />
        <div className="flex-[1.4] rounded flex items-center justify-center" style={{ background: theme.panel, border: `1px solid ${theme.border}` }}>
          <span className="font-bold font-digi leading-none" style={{ color: theme.text, fontSize: 15 }}>3</span>
        </div>
        <div className="flex-1 rounded" style={{ background: theme.panel, border: `1px solid ${theme.border}` }} />
      </div>
      <div className="flex gap-1 h-1.5">
        <div className="flex-1 rounded" style={{ background: theme.panel, border: `1px solid ${theme.border}` }} />
        <div className="flex-[2] rounded" style={{ background: theme.panel, border: `1px solid ${theme.border}` }} />
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
            style={{ width: 128 }}
            aria-label={`Select ${v.name} dashboard`}
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