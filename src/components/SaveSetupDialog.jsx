import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIM_TITLES, CAR_LISTS, TRACK_LISTS } from "../lib/simData";
import SetupEditorForm from "./SetupEditorForm";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, FileText, SlidersHorizontal } from "lucide-react";

export default function SaveSetupDialog({ open, onOpenChange, editSetup }) {
  const queryClient = useQueryClient();
  const [sim, setSim] = useState(editSetup?.sim_title || "");
  const [car, setCar] = useState(editSetup?.car || "");
  const [title, setTitle] = useState(editSetup?.title || "");
  const [track, setTrack] = useState(editSetup?.track || "");
  const [notes, setNotes] = useState(editSetup?.notes || "");
  const [parameters, setParameters] = useState(editSetup?.parameters || {});

  useEffect(() => {
    if (editSetup) {
      setSim(editSetup.sim_title || "");
      setCar(editSetup.car || "");
      setTitle(editSetup.title || "");
      setTrack(editSetup.track || "");
      setNotes(editSetup.notes || "");
      setParameters(editSetup.parameters || {});
    }
  }, [editSetup]);

  const carList = sim && CAR_LISTS[sim]
    ? Object.values(CAR_LISTS[sim]).flat()
    : [];

  const trackList = sim && TRACK_LISTS[sim] ? TRACK_LISTS[sim] : [];
  const [customTrack, setCustomTrack] = useState(
    editSetup?.track && TRACK_LISTS[editSetup?.sim_title] && !TRACK_LISTS[editSetup?.sim_title]?.includes(editSetup.track)
  );

  const mutation = useMutation({
    mutationFn: (data) => {
      if (editSetup) return base44.entities.SavedSetup.update(editSetup.id, data);
      return base44.entities.SavedSetup.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !sim || !car) return;
    mutation.mutate({ title, sim_title: sim, car, track, notes, parameters });
  };

  const handleSimChange = (v) => {
    setSim(v);
    setCar("");
    setParameters({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide">
            {editSetup ? "Edit Setup" : "Save New Setup"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic info */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Setup Name *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Spa Qualifying Low Fuel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Sim *</label>
              <Select value={sim} onValueChange={handleSimChange}>
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
            {trackList.length > 0 ? (
              <>
                <Select
                  value={customTrack ? "__custom__" : (track || "__none__")}
                  onValueChange={v => {
                    if (v === "__none__") { setTrack(""); setCustomTrack(false); }
                    else if (v === "__custom__") { setCustomTrack(true); setTrack(""); }
                    else { setCustomTrack(false); setTrack(v); }
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select track…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— No track —</SelectItem>
                    {trackList.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    <SelectItem value="__custom__">Other / Custom…</SelectItem>
                  </SelectContent>
                </Select>
                {customTrack && (
                  <Input value={track} onChange={e => setTrack(e.target.value)} placeholder="Type track name…" />
                )}
              </>
            ) : (
              <Input value={track} onChange={e => setTrack(e.target.value)} placeholder="Track name" />
            )}
          </div>

          {/* Tabs for notes vs setup params */}
          <Tabs defaultValue="params" className="mt-2">
            <TabsList className="bg-secondary w-full">
              <TabsTrigger value="params" className="flex-1 font-heading text-xs tracking-wider">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                Setup Parameters
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1 font-heading text-xs tracking-wider">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="params" className="mt-4">
              <SetupEditorForm sim={sim} parameters={parameters} onChange={setParameters} />
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Wing at 6, front ARB stiff, rear bias 57%..."
                rows={5}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!title || !sim || !car || mutation.isPending}>
              {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editSetup ? "Update" : "Save Setup"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}