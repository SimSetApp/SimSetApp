import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SetupDiffTable from "./SetupDiffTable";
import { Loader2, GitBranch } from "lucide-react";

export default function ForkSourceCompareDialog({ setup, open, onOpenChange }) {
  const { data: original, isLoading } = useQuery({
    queryKey: ["community-setup-original", setup?.source_setup_id],
    queryFn: () => base44.entities.CommunitySetup.get(setup.source_setup_id),
    enabled: !!setup?.source_setup_id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-primary" /> Your Fork vs Original
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            See how your version has diverged from the community setup you forked from
            {setup?.source_title ? ` (“${setup.source_title}”)` : ""}.
          </p>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
          ) : original ? (
            <SetupDiffTable setupA={original} setupB={setup} />
          ) : (
            <p className="text-sm text-muted-foreground">The original community setup is no longer available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}