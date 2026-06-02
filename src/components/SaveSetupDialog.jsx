import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SIM_TITLES, CAR_LISTS, TRACK_LISTS, SIM_SETUP_PARAMS } from "../lib/simData";
import { CLASS_SETUP_DEFAULTS, getCarClass } from "../lib/classSetupDefaults";
import SetupEditorForm from "./SetupEditorForm";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, FileText, SlidersHorizontal, Upload, Download } from "lucide-react";

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

  const carGroups = sim && CAR_LISTS[sim] ? CAR_LISTS[sim] : {};
  const classNames = Object.keys(carGroups);
  const [activeClass, setActiveClass] = useState("");
  const [customCar, setCustomCar] = useState(
    editSetup?.car && sim && CAR_LISTS[sim] && !Object.values(CAR_LISTS[sim] || {}).flat().includes(editSetup.car)
  );

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
    setTrack("");
    setParameters({});
    setActiveClass("");
    setCustomCar(false);
    setCustomTrack(false);
  };

  const handleCarChange = (carName) => {
    if (carName === "__custom__") { setCustomCar(true); setCar(""); return; }
    setCustomCar(false);
    setCar(carName);
    // Auto-fill class defaults if no parameters set yet
    if (Object.keys(parameters).length === 0) {
      const carClass = getCarClass(sim, carName);
      const classDefaults = carClass && CLASS_SETUP_DEFAULTS[sim]?.[carClass];
      if (classDefaults) {
        setParameters(classDefaults);
      } else if (SIM_SETUP_PARAMS[sim]) {
        // Fall back to sim defaults
        const flat = {};
        SIM_SETUP_PARAMS[sim].forEach(group => group.params.forEach(p => { flat[p.key] = p.default; }));
        setParameters(flat);
      }
    }
  };

  const handleExport = () => {
    const data = { simsetapp_version: 1, title, sim_title: sim, car, track, notes, parameters };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "setup"}.simsetapp.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = JSON.parse(ev.target.result);
      if (data.title) setTitle(data.title);
      if (data.sim_title) { setSim(data.sim_title); setActiveClass(""); }
      if (data.car) { setCar(data.car); setCustomCar(false); }
      if (data.track) setTrack(data.track);
      if (data.notes) setNotes(data.notes);
      if (data.parameters) setParameters(data.parameters);
    };
    reader.readAsText(file);
    e.target.value = "";
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
              {classNames.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  <button
                    type="button"
                    onClick={() => { setActiveClass(""); setCar(""); }}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                      activeClass === ""
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >All</button>
                  {classNames.map(cls => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => { setActiveClass(cls); setCar(""); }}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        activeClass === cls
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >{cls}</button>
                  ))}
                </div>
              )}
              <Select
                value={customCar ? "__custom__" : (car || "")}
                onValueChange={handleCarChange}
                disabled={!sim}
              >
                <SelectTrigger><SelectValue placeholder="Car" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(carGroups)
                    .filter(([cls]) => !activeClass || cls === activeClass)
                    .map(([cls, cars]) => (
                      <SelectGroup key={cls}>
                        <SelectLabel className="text-primary text-xs">{cls}</SelectLabel>
                        {cars.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectGroup>
                    ))}
                  {!sim && <div className="px-3 py-2 text-xs text-muted-foreground">Pick a sim first</div>}
                  {sim && <SelectItem value="__custom__">Other / Custom car…</SelectItem>}
                </SelectContent>
              </Select>
              {customCar && (
                <Input
                  value={car}
                  onChange={e => setCar(e.target.value)}
                  placeholder="Type car name or mod…"
                  className="mt-1"
                />
              )}
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

          <div className="flex gap-2 pt-1">
            <label className="cursor-pointer">
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
              <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input bg-transparent text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </div>
            </label>
            <button
              type="button"
              onClick={handleExport}
              disabled={!title && !sim}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-input bg-transparent text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>
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