import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyChip({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-foreground hover:border-primary/50 transition-colors"
    >
      <span>{label || text}</span>
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground group-hover:text-primary" />}
    </button>
  );
}