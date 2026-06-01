import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Navbar from "../components/Navbar";
import SaveSetupDialog from "../components/SaveSetupDialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Car, MapPin, FileText, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const EMPTY_IMG = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/54a49a89f_generated_image.png";

export default function SavedSetups() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSetup, setEditSetup] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data: setups = [], isLoading } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedSetup.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
      setDeleteId(null);
    },
  });

  const openEdit = (setup) => {
    setEditSetup(setup);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditSetup(null);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              My Garage
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your saved setups — always ready for race day.
            </p>
          </div>
          <Button onClick={openCreate} className="font-heading text-xs tracking-wider">
            <Plus className="w-4 h-4 mr-1.5" />
            New Setup
          </Button>
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && setups.length === 0 && (
          <div className="text-center py-20">
            <img src={EMPTY_IMG} alt="" className="w-48 h-48 mx-auto rounded-2xl object-cover mb-6 opacity-60" />
            <h3 className="font-heading text-lg font-semibold tracking-wide">Your garage is empty</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Save your first setup and never start from scratch again.
            </p>
            <Button onClick={openCreate} className="mt-6 font-heading text-xs tracking-wider">
              <Plus className="w-4 h-4 mr-1.5" />
              Save First Setup
            </Button>
          </div>
        )}

        {!isLoading && setups.length > 0 && (
          <div className="space-y-3">
            {setups.map(setup => (
              <div
                key={setup.id}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-semibold tracking-wide truncate">
                      {setup.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Car className="w-3 h-3 text-primary" />
                        {setup.car}
                      </span>
                      <span className="text-xs text-border">•</span>
                      <span className="text-xs text-muted-foreground">{setup.sim_title}</span>
                      {setup.track && (
                        <>
                          <span className="text-xs text-border">•</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {setup.track}
                          </span>
                        </>
                      )}
                    </div>
                    {setup.notes && (
                      <div className="mt-3 flex items-start gap-2">
                        <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {setup.notes}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(setup)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteId(setup.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {dialogOpen && (
        <SaveSetupDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editSetup={editSetup}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this setup?</AlertDialogTitle>
            <AlertDialogDescription>
              This can't be undone. The setup will be permanently removed from your garage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep It</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(deleteId)}
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}