import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Sparkles, Download, Star, Loader2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SIM_TITLES, CAR_LISTS, TRACK_LISTS } from "@/lib/simData";
import SearchableSelect from "./SearchableSelect";

export default function SmartSetupMatch({ onSetupClick }) {
  const [sim, setSim] = useState("");
  const [car, setCar] = useState("");
  const [track, setTrack] = useState("");

  const cars = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.values(CAR_LISTS[sim]).flat().sort();
  }, [sim]);

  const tracks = useMemo(() => {
    if (!sim || !TRACK_LISTS[sim]) return [];
    return [...TRACK_LISTS[sim]].sort();
  }, [sim]);

  const { data: allSetups = [], isLoading } = useQuery({
    queryKey: ["communitySetups"],
    queryFn: () => base44.entities.CommunitySetup.list("-popularity_score", 100),
  });

  const matched = useMemo(() => {
    let result = allSetups;
    if (sim) result = result.filter(s => s.sim_title === sim);
    if (car) result = result.filter(s => s.car === car);
    if (track) result = result.filter(s => s.track === track);

    // Sort: curated first, then by rating, then by popularity
    return result.sort((a, b) => {
      if ((b.is_curated ? 1 : 0) !== (a.is_curated ? 1 : 0)) return (b.is_curated ? 1 : 0) - (a.is_curated ? 1 : 0);
      const aRating = a.rating_count > 0 ? a.rating_sum / a.rating_count : 0;
      const bRating = b.rating_count > 0 ? b.rating_sum / b.rating_count : 0;
      if (bRating !== aRating) return bRating - aRating;
      return (b.popularity_score || 0) - (a.popularity_score || 0);
    }).slice(0, 6);
  }, [allSetups, sim, car, track]);

  const hasFilters = sim || car || track;

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="font-heading text-sm font-bold tracking-wide">Smart Setup Match</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Pick your car and track — we'll find the best community setups for that exact combo.</p>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <select
          value={sim}
          onChange={e => { setSim(e.target.value); setCar(""); setTrack(""); }}
          className="h-9 rounded-lg border border-border bg-secondary text-xs px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">Select Sim</option>
          {SIM_TITLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <SearchableSelect
          value={car}
          onValueChange={setCar}
          placeholder={sim ? "All Cars" : "Select sim first"}
          disabled={!sim}
          items={cars}
          searchPlaceholder="Search cars…"
        />
        <SearchableSelect
          value={track}
          onValueChange={setTrack}
          placeholder={sim ? "All Tracks" : "Select sim first"}
          disabled={!sim}
          items={tracks}
          searchPlaceholder="Search tracks…"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && !hasFilters && (
        <div className="text-center py-8">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
          <p className="text-xs text-muted-foreground">Select a sim to find matching setups.</p>
        </div>
      )}

      {!isLoading && hasFilters && matched.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground">No community setups match this exact combination yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to share one!</p>
        </div>
      )}

      {!isLoading && matched.length > 0 && (
        <div className="space-y-2">
          {matched.map(setup => {
            const avg = setup.rating_count > 0 ? (setup.rating_sum / setup.rating_count).toFixed(1) : "—";
            return (
              <div
                key={setup.id}
                className="rounded-xl border border-border bg-card p-3 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => onSetupClick?.(setup)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {setup.is_curated && (
                        <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                      )}
                      <h4 className="font-heading text-sm font-semibold truncate">{setup.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="truncate">{setup.car}</span>
                      {setup.track && <><span>•</span><span className="truncate">{setup.track}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="tabular-nums">{avg}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                      <Download className="w-3 h-3" />
                      <span className="tabular-nums">{setup.download_count || 0}</span>
                    </div>
                  </div>
                </div>
                {setup.is_curated && setup.verified_author && (
                  <div className="mt-1.5">
                    <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                      <BadgeCheck className="w-2.5 h-2.5 mr-1" /> {setup.verified_author}
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}