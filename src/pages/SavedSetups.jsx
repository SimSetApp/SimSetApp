import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import usePullToRefresh from "../hooks/usePullToRefresh";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import SaveSetupDialog from "../components/SaveSetupDialog";
import TyrePressureCalc from "../components/TyrePressureCalc";
import FuelCalc from "../components/FuelCalc";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Car, MapPin, FileText, Loader2, SlidersHorizontal, Circle, Fuel, FolderOpen, Clock, GitCompare, Search, X, Share2, Check, Globe, Link, Trash } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { SIM_SETUP_PARAMS, SIM_TITLES, CAR_LISTS, TRACK_LISTS } from "../lib/simData";
import SetupDetailSheet from "../components/SetupDetailSheet";
import SetupComparison from "../components/SetupComparison";

function SetupParamsSummary({ sim, parameters }) {
  const groups = sim && SIM_SETUP_PARAMS[sim];
  if (!groups || !parameters || Object.keys(parameters).length === 0) return null;
  
  // Show just a few key values
  const highlights = ["rear_wing", "front_splitter", "brake_bias", "tc1", "tc", "diff_power"];
  const shown = [];
  groups.forEach(g => g.params.forEach(p => {
    if (highlights.includes(p.key) && parameters[p.key] !== undefined) {
      shown.push({ label: p.label, value: parameters[p.key], unit: p.unit });
    }
  }));

  if (shown.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {shown.slice(0, 4).map(({ label, value, unit }) => (
        <Badge key={label} variant="outline" className="text-xs font-mono">
          {label}: {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{unit}
        </Badge>
      ))}
    </div>
  );
}

export default function SavedSetups() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSetup, setEditSetup] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [detailSetup, setDetailSetup] = useState(null);
  const [filterSim, setFilterSim] = useState("");
  const [filterCar, setFilterCar] = useState("");
  const [filterTrack, setFilterTrack] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    base44.auth.me().then(user => setUserId(user?.id || null));
  }, [isAuthenticated]);

  const { data: setups = [], isLoading } = useQuery({
    queryKey: ["saved-setups"],
    queryFn: () => base44.entities.SavedSetup.list("-created_date"),
    enabled: !!isAuthenticated,
  });

  const { data: customVehicles = [] } = useQuery({
    queryKey: ["custom-vehicles"],
    queryFn: () => base44.entities.CustomVehicle.list(),
    enabled: !!isAuthenticated,
  });

  const { data: communitySetups = [] } = useQuery({
    queryKey: ["communitySetups"],
    queryFn: () => base44.entities.CommunitySetup.list(),
    enabled: !!isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedSetup.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["saved-setups"] });
      const previous = queryClient.getQueryData(["saved-setups"]);
      queryClient.setQueryData(["saved-setups"], (old = []) => old.filter(s => s.id !== id));
      setDeleteId(null);
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["saved-setups"], context.previous);
      toast.error("Failed to delete setup");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
    },
  });

  const [sharingId, setSharingId] = useState(null);

  const shareToCommunityMutation = useMutation({
    mutationFn: async (setup) => {
      const user = await base44.auth.me();
      if (!user) throw new Error("Not authenticated");
      return await base44.entities.CommunitySetup.create({
        title: setup.title,
        sim_title: setup.sim_title,
        car: setup.car,
        track: setup.track || "",
        notes: setup.notes || "",
        parameters: setup.parameters || {},
        author_id: user.id,
        author_name: user.full_name || user.email?.split('@')[0] || "Anonymous",
        download_count: 0,
        rating_count: 0,
        rating_sum: 0,
        popularity_score: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      toast.success("Setup shared to community!");
      setSharingId(null);
    },
    onError: (err) => {
      toast.error("Failed to share: " + err.message);
      setSharingId(null);
    }
  });

  const removeFromCommunityMutation = useMutation({
    mutationFn: async (setup) => {
      // Use already-fetched communitySetups from query cache
      const allCommunity = await base44.entities.CommunitySetup.filter({ author_id: userId });
      const matchingSetup = allCommunity.find(
        cs => cs.title === setup.title && 
              cs.car === setup.car && 
              cs.sim_title === setup.sim_title
      );
      if (!matchingSetup) throw new Error("Setup not found in community");
      return await base44.entities.CommunitySetup.delete(matchingSetup.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      toast.success("Setup removed from community");
    },
    onError: (err) => {
      toast.error("Failed to remove from community: " + err.message);
    }
  });

  // Full lists from simData + any custom cars saved in setups for this sim
  const allSims = SIM_TITLES;
  const savedCarsForSim = filterSim
    ? setups.filter(s => s.sim_title === filterSim && s.car).map(s => s.car)
    : [];
  const customVehicleCarsForSim = filterSim
    ? customVehicles.filter(v => v.sim_title === filterSim).map(v => v.name)
    : [];
  const baseCars = filterSim && CAR_LISTS[filterSim]
    ? Object.values(CAR_LISTS[filterSim]).flat()
    : [];
  const allCars = filterSim
    ? [...new Set([...baseCars, ...customVehicleCarsForSim, ...savedCarsForSim])].sort()
    : [];
  const allTracks = filterSim && TRACK_LISTS[filterSim]
    ? [...new Set(TRACK_LISTS[filterSim])].sort()
    : [];

  const filteredSetups = setups.filter(s =>
    (!filterSim || s.sim_title === filterSim) &&
    (!filterCar || s.car === filterCar) &&
    (!filterTrack || s.track === filterTrack)
  );

  const sharedSetupIds = new Set(
    communitySetups
      .filter(cs => cs.author_id === userId)
      .map(cs => `${cs.title}-${cs.car}-${cs.sim_title}`)
  );

  const [copiedId, setCopiedId] = useState(null);

  const shareSetup = (setup) => {
    const data = { title: setup.title, sim_title: setup.sim_title, car: setup.car, track: setup.track, notes: setup.notes, parameters: setup.parameters };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/share?s=${encoded}`;
    navigator.clipboard.writeText(url);
    setCopiedId(setup.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["saved-setups"] });
  }, [queryClient]);

  const { containerRef, pullY, refreshing } = usePullToRefresh(handleRefresh);

  const openEdit = (setup) => { setEditSetup(setup); setDialogOpen(true); };
  const openDetail = (setup) => setDetailSetup(setup);
  const openCreate = () => { setEditSetup(null); setDialogOpen(true); };

  // Show login gate for unauthenticated users
  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <FolderOpen className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-2">Sign in to access My Garage</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Save setups, share to the community, and track your session history — all require a free account.
            </p>
            <Button onClick={navigateToLogin} className="w-full font-heading text-xs tracking-wider">
              Sign In / Register
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="My Garage" />
      <div ref={containerRef} className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">My Garage</h1>
          <p className="text-sm text-muted-foreground mt-1">Setups, tyre pressures, and fuel strategy — all in one place.</p>
        </div>

        <Tabs defaultValue="garage">
          <TabsList className="bg-secondary mb-6 w-full">
            <TabsTrigger value="garage" className="flex-1 font-heading text-xs tracking-wider">
              <FolderOpen className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Garage</span>
            </TabsTrigger>
            <TabsTrigger value="tyres" className="flex-1 font-heading text-xs tracking-wider">
              <Circle className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Tyre Pressures</span>
            </TabsTrigger>
            <TabsTrigger value="fuel" className="flex-1 font-heading text-xs tracking-wider">
              <Fuel className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Fuel Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex-1 font-heading text-xs tracking-wider">
              <GitCompare className="w-3.5 h-3.5 sm:mr-1.5" /><span className="hidden sm:inline">Compare</span>
            </TabsTrigger>
          </TabsList>

          {/* Garage tab */}
          <TabsContent value="garage">
            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {/* Sim filter */}
                <select
                  value={filterSim}
                  onChange={e => { setFilterSim(e.target.value); setFilterCar(""); setFilterTrack(""); }}
                  className="col-span-2 h-9 rounded-lg border border-border bg-secondary text-xs px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">All Sims</option>
                  {allSims.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {/* Car filter */}
                <select
                  value={filterCar}
                  onChange={e => setFilterCar(e.target.value)}
                  disabled={!filterSim}
                  className="h-9 rounded-lg border border-border bg-secondary text-xs px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">{filterSim ? "All Cars" : "Select sim first"}</option>
                  {allCars.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {/* Track filter */}
                <select
                  value={filterTrack}
                  onChange={e => setFilterTrack(e.target.value)}
                  disabled={!filterSim}
                  className="h-9 rounded-lg border border-border bg-secondary text-xs px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <option value="">{filterSim ? "All Tracks" : "Select sim first"}</option>
                  {allTracks.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {(filterSim || filterCar || filterTrack) && (
                  <button
                    onClick={() => { setFilterSim(""); setFilterCar(""); setFilterTrack(""); }}
                    className="h-9 px-3 rounded-lg border border-border bg-secondary text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              <Button onClick={openCreate} className="w-full sm:w-auto font-heading text-xs tracking-wider">
                <Plus className="w-4 h-4 mr-1.5" /> New Setup
              </Button>
            </div>

            {isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && setups.length === 0 && (
              <div className="text-center py-20">
                <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <h3 className="font-heading text-lg font-semibold tracking-wide">Your garage is empty</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                  Save your first setup with full parameter values — never start from scratch again.
                </p>
                <Button onClick={openCreate} className="mt-6 font-heading text-xs tracking-wider">
                  <Plus className="w-4 h-4 mr-1.5" /> Save First Setup
                </Button>
              </div>
            )}

            {!isLoading && setups.length > 0 && (
              <div className="space-y-3">
                {filteredSetups.length === 0 && (
                  <div className="text-center py-12 text-sm text-muted-foreground">No setups match the selected filters.</div>
                )}
                {filteredSetups.map(setup => (
                  <div
                    key={setup.id}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition-colors cursor-pointer"
                    onClick={() => openEdit(setup)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading text-sm font-semibold tracking-wide truncate">{setup.title}</h3>
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
                                <MapPin className="w-3 h-3" />{setup.track}
                              </span>
                            </>
                          )}
                        </div>
                        <SetupParamsSummary sim={setup.sim_title} parameters={setup.parameters} />
                        {setup.notes && (
                          <div className="mt-2 flex items-start gap-2">
                            <FileText className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{setup.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                      {sharedSetupIds.has(`${setup.title}-${setup.car}-${setup.sim_title}`) ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-orange-500 hover:text-orange-500" 
                          title="Remove from community" 
                          onClick={(e) => { e.stopPropagation(); removeFromCommunityMutation.mutate(setup); }}
                          disabled={removeFromCommunityMutation.isPending}
                        >
                          {removeFromCommunityMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash className="w-3.5 h-3.5" />}
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          title="Share to community" 
                          onClick={(e) => { e.stopPropagation(); setSharingId(setup.id); shareToCommunityMutation.mutate(setup); }}
                          disabled={sharingId === setup.id || shareToCommunityMutation.isPending}
                        >
                          {sharingId === setup.id && shareToCommunityMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Copy share link" onClick={(e) => { e.stopPropagation(); shareSetup(setup); }}>
                        {copiedId === setup.id ? <Check className="w-3.5 h-3.5 text-primary" /> : <Link className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); setDeleteId(setup.id); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tyre calculator */}
          <TabsContent value="tyres">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-sm font-bold tracking-wide mb-1">Tyre Pressure Calculator</h2>
              <p className="text-xs text-muted-foreground mb-6">Calculates cold start pressures based on track and ambient temperatures.</p>
              <TyrePressureCalc />
            </div>
          </TabsContent>

          {/* Fuel calculator */}
          <TabsContent value="fuel">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-sm font-bold tracking-wide mb-1">Fuel Strategy Calculator</h2>
              <p className="text-xs text-muted-foreground mb-6">Work out exactly how much fuel you need for any race format.</p>
              <FuelCalc />
            </div>
          </TabsContent>

          {/* Compare tab */}
          <TabsContent value="compare">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-sm font-bold tracking-wide mb-1">Setup Comparison</h2>
              <p className="text-xs text-muted-foreground mb-6">Side-by-side diff of any two saved setups with deltas on every parameter.</p>
              <SetupComparison />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <SetupDetailSheet
        setup={detailSetup}
        open={!!detailSetup}
        onOpenChange={(o) => { if (!o) setDetailSetup(null); }}
      />

      {dialogOpen && (
        <SaveSetupDialog open={dialogOpen} onOpenChange={setDialogOpen} editSetup={editSetup} />
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
      <Footer />
    </div>
  );
}