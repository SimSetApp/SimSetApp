import { Plus, Lock } from "lucide-react";
import { renderWidget, WIDGET_DEF_MAP } from "@/components/live/dashboardWidgets";

/**
 * A single dashboard slot (landscape absolute positioning).
 * Core slots are locked — no edit border, no tap-to-reassign, show a lock badge.
 * Peripheral slots are editable when `editing` is true.
 */
export default function DashSlot({ w, effectiveType, editing, accent, theme, data, variant, config, caps, trends, isCore, onSlotTap }) {
  const isEmpty = effectiveType === "empty";
  const def = WIDGET_DEF_MAP.get(effectiveType);
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: w.x, top: w.y, width: w.w, height: w.h,
        fontSize: `${Math.max(10, Math.min(20, w.h * 0.06))}px`,
        border: editing && !isCore ? `1px dashed ${accent}` : "none",
        background: "transparent",
        boxShadow: "none",
        cursor: editing && !isCore ? "pointer" : "default",
      }}
      onClick={editing && !isCore ? () => onSlotTap(w.id, effectiveType) : undefined}
    >
      {editing && !isCore && (
        <div className="absolute top-1 left-1 z-30 font-digi pointer-events-none" style={{ fontSize: 9, color: theme.label, background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
          {isEmpty ? "EMPTY" : def?.label || effectiveType}
        </div>
      )}
      {editing && isCore && (
        <div className="absolute top-1 left-1 z-30 font-digi pointer-events-none flex items-center gap-0.5" style={{ fontSize: 8, color: theme.label, background: "rgba(0,0,0,0.6)", padding: "1px 5px", borderRadius: 3, letterSpacing: "0.08em" }}>
          <Lock className="w-2 h-2" /> {def?.label || effectiveType}
        </div>
      )}
      {isEmpty ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5" style={{ opacity: 0.4 }}>
          {editing && (
            <>
              <div className="rounded-full p-2" style={{ border: `1px dashed ${theme.label}`, opacity: 0.6 }}>
                <Plus className="w-4 h-4" style={{ color: theme.label }} />
              </div>
              <span className="font-digi" style={{ fontSize: 8, color: theme.label, letterSpacing: "0.1em" }}>TAP TO ASSIGN</span>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-full">
          {renderWidget(effectiveType, { data, color: w.color || accent, w: w.w, h: w.h, theme, shape: variant.shape, units: config.units, caps, trends })}
        </div>
      )}
    </div>
  );
}