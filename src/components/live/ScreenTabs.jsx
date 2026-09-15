import { SCREEN_DEFS } from "@/lib/dashboardVariants";

export function ScreenTabs({ activeScreen, onScreenChange, accent, labelColor }) {
  return (
    <div className="flex items-center gap-0.5">
      {SCREEN_DEFS.map((s) => {
        const active = activeScreen === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onScreenChange(s.id)}
            className="font-digi px-1.5 py-0.5 rounded text-[10px] tracking-wider transition-colors"
            style={{
              color: active ? accent : labelColor,
              background: active ? `${accent}22` : "transparent",
              fontWeight: active ? 700 : 500,
            }}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

export function ScreenDots({ activeScreen, accent, dim }) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {SCREEN_DEFS.map((s) => (
        <div
          key={s.id}
          className="rounded-full transition-all"
          style={{
            width: 4,
            height: 4,
            background: activeScreen === s.id ? accent : dim,
            opacity: activeScreen === s.id ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

export default ScreenTabs;