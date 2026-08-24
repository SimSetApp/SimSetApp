import { useState, useMemo } from "react";
import { QrCode, Copy, Check, X, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function QRShareDialog({ open, onOpenChange, setup }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!setup) return "";
    const data = {
      title: setup.title,
      sim_title: setup.sim_title,
      car: setup.car,
      track: setup.track || "",
      notes: setup.notes || "",
      parameters: setup.parameters || {},
    };
    const encoded = btoa(JSON.stringify(data));
    return `${window.location.origin}/share?s=${encoded}`;
  }, [setup]);

  const qrUrl = useMemo(() => {
    if (!shareUrl) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(shareUrl)}`;
  }, [shareUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `setup-${setup?.title?.replace(/\s+/g, "-") || "qr"}.png`;
    link.target = "_blank";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" />
            QR Setup Share
          </DialogTitle>
        </DialogHeader>

        {setup && (
          <div className="space-y-4">
            {/* Setup info */}
            <div className="rounded-lg border border-border bg-secondary/50 p-3">
              <div className="font-heading text-sm font-semibold truncate">{setup.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">{setup.car} • {setup.sim_title}</div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-xl border-2 border-border bg-white p-3">
                {qrUrl && (
                  <img
                    src={qrUrl}
                    alt="Setup QR Code"
                    className="w-48 h-48"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Scan with your phone to import this setup instantly at the rig.
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleCopy}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1 text-primary" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleDownloadQR}>
                <Download className="w-3.5 h-3.5 mr-1" />
                Save QR
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}