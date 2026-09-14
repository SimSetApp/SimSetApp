import { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, ChevronDown, ChevronUp, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_PORT = "3344";

export default function PhonePairPanel({ defaultUrl = "", onManualConnect }) {
  // Try to prefill IP from an existing ws:// URL (e.g. saved localhost)
  const parseInitial = (u) => {
    try {
      const m = (u || "").match(/^ws:\/\/([^:/]+)(?::(\d+))?\/?/);
      if (m) return { ip: m[1], port: m[2] || DEFAULT_PORT };
    } catch {}
    return { ip: "", port: DEFAULT_PORT };
  };
  const initial = parseInitial(defaultUrl);
  const [ip, setIp] = useState(initial.ip);
  const [port, setPort] = useState(initial.port);
  const [showManual, setShowManual] = useState(false);
  const [manualUrl, setManualUrl] = useState(defaultUrl || "ws://localhost:3344/ws");

  const wsUrl = useMemo(() => {
    if (!ip) return "";
    return `ws://${ip}:${port || DEFAULT_PORT}/ws`;
  }, [ip, port]);

  const deepLink = useMemo(() => {
    if (!wsUrl) return "";
    return `${window.location.origin}/live-telemetry?connect=${encodeURIComponent(wsUrl)}`;
  }, [wsUrl]);

  const ipValid = /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) || /^[a-z0-9.-]+$/i.test(ip);

  return (
    <div className="rounded-lg border border-border bg-secondary/20 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Smartphone className="w-3.5 h-3.5 text-primary" />
        <h4 className="font-heading text-sm font-semibold">Pair your phone</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Run the bridge on your PC — it prints your LAN IP (e.g. <code className="font-mono text-foreground">192.168.1.50</code>). Enter it below, then scan the QR with your phone camera to connect instantly.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="192.168.1.50"
          inputMode="decimal"
          className="flex-1 h-9 rounded-lg border border-border bg-secondary text-sm px-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>:</span>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value.replace(/\D/g, "").slice(0, 5))}
            className="w-14 h-9 rounded-lg border border-border bg-secondary text-sm px-2 font-mono text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {ipValid && wsUrl ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <QRCodeSVG value={deepLink} size={180} level="M" includeMargin={false} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Scan with your phone camera — it opens the app and connects automatically.
          </p>
          <p className="text-[11px] text-muted-foreground/70 text-center">
            Phone and PC must be on the same WiFi.
          </p>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/70 text-center py-3">
          Enter your PC's IP to generate the QR code.
        </p>
      )}

      {/* Manual fallback */}
      <div className="mt-3 border-t border-border pt-3">
        <button
          onClick={() => setShowManual((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showManual ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          Or type the address manually
        </button>
        {showManual && (
          <div className="flex gap-2 mt-2">
            <input
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="ws://192.168.1.50:3344/ws"
              className="flex-1 h-9 rounded-lg border border-border bg-secondary text-sm px-3 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button
              onClick={() => onManualConnect?.(manualUrl)}
              className="font-heading text-xs tracking-wider shrink-0"
            >
              <Wifi className="w-3.5 h-3.5 mr-1.5" /> Connect
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}