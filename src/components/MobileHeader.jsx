import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MobileHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div
      className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 h-12"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors select-none"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      {title && (
        <span className="font-heading text-sm font-semibold truncate">{title}</span>
      )}
    </div>
  );
}