import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SIM_TITLES, CAR_LISTS } from "../lib/simData";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function SaveSetupDialog({ open, onOpenChange, editSetup }) {
  const queryClient = useQueryClient();
  const [sim, setSim] = useState(editSetup?.sim_title || "");
  const [car, setCar] = useState(editSetup?.car || "");
  const [title, setTitle] = useState(editSetup?.title || "");
  const [track, setTrack] = useState(editSetup?.track || "");
  const [notes, setNotes] = useState(editSetup?.notes || "");

  const carList = sim && CAR_LISTS[sim]
    ? Object.values(CAR_LISTS[sim]).flat()
    : [];

  const mutation = useMutation({
    mutationFn: (data) => {
      if (editSetup) {
        return base44.entities.SavedSetup.update(editSetup.id, data);
      }
      return base44.entities.SavedSetup.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
      onOpenChange(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setSim(""); setCar(""); setTitle(""); setTrack(""); setNotes("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !sim || !car) return;
    mutation.mutate({ title, sim_title: sim, car, track, notes });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide">
            {editSetup ? "Edit Setup" : "Save New Setup"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Setup Name *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Spa Qualifying Low Fuel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Sim *</label>
              <Select value={sim} onValueChange={(v) => { setSim(v); setCar(""); }}>
                <SelectTrigger><SelectValue placeholder="Sim" /></SelectTrigger>
                <SelectContent>
                  {SIM_TITLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Car *</label>
              <Select value={car} onValueChange={setCar} disabled={!sim}>
                <SelectTrigger><SelectValue placeholder="Car" /></SelectTrigger>
                <SelectContent>
                  {carList.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Track</label>
            <Input value={track} onChange={e => setTrack(e.target.value)} placeholder="Spa-Francorchamps" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Wing at 6, front ARB stiff, rear bias 57%..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!title || !sim || !car || mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editSetup ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}