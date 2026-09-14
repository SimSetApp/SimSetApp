// Faithful miniature preview of each variant's actual layout — renders the
// real widget positions (scaled) so thumbnails are distinguishable.

function MiniLayout({ variant }) {
  const { layout, theme } = variant;
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: theme.bg }}>
      {layout.map((w) => (
        <div
          key={w.id}
          className="absolute rounded-sm"
          style={{
            left: `${(w.x / 1000) * 100}%`,
            top: `${(w.y / 560) * 100}%`,
            width: `${(w.w / 1000) * 100}%`,
            height: `${(w.h / 560) * 100}%`,
            background: theme.panel,
            border: `1px solid ${theme.panelEdge}`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        />
      ))}
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
            <div className="rounded-lg overflow-hidden m-0.5" style={{
              aspectRatio: "16 / 9",
              border: "2px solid #1a1a1a",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), inset 0 -1px 3px rgba(0,0,0,0.5)",
            }}>
              <MiniLayout variant={v} />
            </div>
            <div className="text-[10px] font-heading font-medium text-center py-1 text-foreground truncate px-1">{v.name}</div>
          </button>
        );
      })}
    </div>
  );
}