import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SetupDiffTable from "./SetupDiffTable";
import { GitCompare, Loader2 } from "lucide-react";

export default function CompareSetupDialog({ setup, open, onOpenChange }) {
  const [savedId, setSavedId] = useState("");
  const { data: savedSetups = [], isLoading } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
  });
  const selected = savedSetups.find(s => s.id === savedId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-primary" /> Compare Setup
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Compare <span className="font-medium text-foreground">{setup?.title}</span> against one of your saved setups — see every parameter delta.
          </p>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : savedSetups.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Save a setup to your garage first, then you can compare any community setup against it.</p>
          ) : (
            <>
              <Select value={savedId} onValueChange={setSavedId}>
                <SelectTrigger className="bg-secondary"><SelectValue placeholder="Choose your setup…" /></SelectTrigger>
                <SelectContent>
                  {savedSetups.map(s => <SelectItem key={s.id} value={s.id}>{s.title} — {s.car}</SelectItem>)}
                </SelectContent>
              </Select>
              {selected && <SetupDiffTable setupA={setup} setupB={selected} />}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}