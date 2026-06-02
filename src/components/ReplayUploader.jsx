import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, Video, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ReplayUploader({ setupId, existingUrls = [], onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      toast.error("File too large. Max size is 200MB.");
      return;
    }

    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const newUrls = [...existingUrls, file_url];
    await base44.entities.CommunitySetup.update(setupId, { replay_urls: newUrls });
    toast.success("Replay uploaded!");
    onUploaded(newUrls);
    setUploading(false);
    e.target.value = "";
  };

  const handleRemove = async (url) => {
    const newUrls = existingUrls.filter(u => u !== url);
    await base44.entities.CommunitySetup.update(setupId, { replay_urls: newUrls });
    onUploaded(newUrls);
    toast.success("Replay removed");
  };

  return (
    <div className="space-y-3">
      {existingUrls.length > 0 && (
        <div className="space-y-2">
          {existingUrls.map((url, i) => (
            <div key={url} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <Video className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs text-muted-foreground flex-1 truncate">Replay {i + 1}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className={`cursor-pointer ${uploading ? "pointer-events-none" : ""}`}>
        <input
          type="file"
          accept="video/*,.mp4,.mkv,.avi,.mov,.webm"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className="flex items-center gap-2 h-9 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
          {uploading ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="w-3.5 h-3.5" /> Upload Replay Video</>
          )}
        </div>
      </label>
      <p className="text-[10px] text-muted-foreground">Supports MP4, MKV, MOV, WebM — max 200MB</p>
    </div>
  );
}