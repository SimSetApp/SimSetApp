import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyChip({ text, label }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
      } else {
        fallbackCopy(text, done);
      }
    } catch {
      fallbackCopy(text, done);
    }
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

function fallbackCopy(text, done) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    done();
  } catch {
    /* ignore */
  }
}