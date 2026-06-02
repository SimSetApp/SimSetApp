import { useState } from "react";
import { Star, Download, TrendingUp, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const COMMUNITY_SETUPS_LIMIT = 50;

function StarRating({ rating, onRate, interactive = false }) {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
        >
          <Star
            className={`w-4 h-4 ${
              star <= (hoverRating || rating)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function CommunitySetupCard({ setup }) {
  const queryClient = useQueryClient();
  const [showRating, setShowRating] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [saved, setSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.SavedSetup.create({
        title: setup.title,
        sim_title: setup.sim_title,
        car: setup.car,
        track: setup.track || "",
        parameters: setup.parameters || {},
        notes: `Imported from Community Library (by ${setup.author_name || "Community"})`
      });
      await base44.entities.CommunitySetup.update(setup.id, {
        download_count: (setup.download_count || 0) + 1,
        popularity_score: (setup.popularity_score || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      setSaved(true);
      toast.success("Setup saved to your garage!");
    },
    onError: () => toast.error("Failed to save setup")
  });

  const rateMutation = useMutation({
    mutationFn: async (stars) => {
      await base44.entities.CommunitySetup.update(setup.id, {
        rating_sum: (setup.rating_sum || 0) + stars,
        rating_count: (setup.rating_count || 0) + 1,
        popularity_score: (setup.popularity_score || 0) + stars
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      setShowRating(false);
      toast.success("Rating submitted!");
    },
    onError: () => toast.error("Failed to submit rating")
  });

  const avgRating = setup.rating_count > 0 ? (setup.rating_sum || 0) / setup.rating_count : 0;

  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-sm font-semibold truncate">{setup.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">by {setup.author_name || "Anonymous"}</p>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">{setup.sim_title}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-xs text-muted-foreground">
            {setup.rating_count > 0 ? `${avgRating.toFixed(1)} (${setup.rating_count})` : "No ratings"}
          </span>
        </div>
        
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">Car:</span>
            <span className="truncate">{setup.car}</span>
          </div>
          {setup.track && setup.track !== "N/A" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-medium text-foreground">Track:</span>
              <span className="truncate">{setup.track}</span>
            </div>
          )}
          {setup.notes && (
            <p className="text-muted-foreground italic line-clamp-2">{setup.notes}</p>
          )}
        </div>

        {showRating && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
            <p className="text-xs font-medium">Select your rating:</p>
            <StarRating rating={pendingRating} onRate={setPendingRating} interactive />
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="ghost" className="text-xs h-7 flex-1" onClick={() => setShowRating(false)}>Cancel</Button>
              <Button
                size="sm"
                className="text-xs h-7 flex-1"
                disabled={!pendingRating || rateMutation.isPending}
                onClick={() => rateMutation.mutate(pendingRating)}
              >Submit</Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-1 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Download className="w-3 h-3" />{setup.download_count || 0}</span>
          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />Score: {Math.round(setup.popularity_score || 0)}</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || saved}
          >
            <Download className="w-3 h-3 mr-1" />
            {saved ? "Saved!" : "Save to Garage"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs text-primary hover:bg-primary/10"
            onClick={() => { setShowRating(!showRating); setPendingRating(0); }}
          >
            <Star className="w-3 h-3 mr-1" />
            Rate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommunityLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [simFilter, setSimFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  const { data: setups, isLoading } = useQuery({
    queryKey: ["communitySetups"],
    queryFn: () => base44.entities.CommunitySetup.list("-popularity_score", COMMUNITY_SETUPS_LIMIT)
  });

  const filteredSetups = (setups || []).filter(setup => {
    const matchesSearch = setup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         setup.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (setup.track && setup.track.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSim = simFilter === "all" || setup.sim_title === simFilter;
    return matchesSearch && matchesSim;
  });

  const sortedSetups = [...filteredSetups].sort((a, b) => {
    if (sortBy === "popular") {
      return (b.popularity_score || 0) - (a.popularity_score || 0);
    } else if (sortBy === "rating") {
      const aRating = a.rating_count > 0 ? (a.rating_sum || 0) / a.rating_count : 0;
      const bRating = b.rating_count > 0 ? (b.rating_sum || 0) / b.rating_count : 0;
      return bRating - aRating;
    } else if (sortBy === "downloads") {
      return (b.download_count || 0) - (a.download_count || 0);
    } else if (sortBy === "recent") {
      return new Date(b.created_date) - new Date(a.created_date);
    }
    return 0;
  });

  const sims = ["all", ...new Set((setups || []).map(s => s.sim_title))];

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-10">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Globe className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight mb-2">Sign in to access the Community</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Browse, save, and rate community setups — all require a free account.
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Community Setup Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and share setups from the sim racing community
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Search setups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={simFilter} onValueChange={setSimFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Sims" />
            </SelectTrigger>
            <SelectContent>
              {sims.map(sim => (
                <SelectItem key={sim} value={sim}>
                  {sim === "all" ? "All Sims" : sim}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Most Popular
                </div>
              </SelectItem>
              <SelectItem value="rating">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Top Rated
                </div>
              </SelectItem>
              <SelectItem value="downloads">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Most Downloaded
                </div>
              </SelectItem>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Most Recent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-6 text-xs text-muted-foreground">
          <span>{sortedSetups.length} setups</span>
          <span className="w-px h-3 bg-border" />
          <span>{sims.length - 1} sims</span>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto" />
          </div>
        ) : sortedSetups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No setups found. Be the first to upload one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSetups.map(setup => (
              <CommunitySetupCard key={setup.id} setup={setup} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}