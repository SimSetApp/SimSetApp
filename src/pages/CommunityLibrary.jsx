import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Download, Upload, Filter, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

  const downloadMutation = useMutation({
    mutationFn: async () => {
      await base44.entities.CommunitySetup.update(setup.id, {
        download_count: (setup.download_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      toast.success("Setup saved to your garage!");
    }
  });

  const handleSave = () => {
    const savedSetup = {
      title: setup.title,
      sim_title: setup.sim_title,
      car: setup.car,
      track: setup.track || "N/A",
      parameters: setup.parameters || {},
      notes: `Imported from Community Library (by ${setup.author_name || "Community"})`
    };
    base44.entities.SavedSetup.create(savedSetup);
    downloadMutation.mutate();
  };

  const avgRating = setup.rating_count > 0 ? (setup.rating_sum || 0) / setup.rating_count : 0;

  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-sm font-semibold truncate">{setup.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              by {setup.author_name || "Anonymous"}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {setup.sim_title}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(avgRating)} />
          <span className="text-xs text-muted-foreground">
            ({setup.rating_count || 0})
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
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" />
            {setup.download_count || 0}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            Score: {Math.round(setup.popularity_score || 0)}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={handleSave}
          >
            <Download className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => {}}
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Community Setup Library</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse and share setups from the sim racing community
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/community-library/upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Setup
            </Link>
          </Button>
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