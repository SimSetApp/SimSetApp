import { useState, useCallback, useMemo } from "react";
import { Star, Download, TrendingUp, Clock, Globe, Users, BadgeCheck, MessageSquare } from "lucide-react";
import ReplayViewer from "../components/ReplayViewer";
import SmartSetupMatch from "../components/SmartSetupMatch";
import SetupComments from "../components/SetupComments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MobileSelect from "@/components/MobileSelect";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import usePullToRefresh from "../hooks/usePullToRefresh";
import PullToRefreshIndicator from "../components/PullToRefreshIndicator";
import TopCreators from "../components/TopCreators";
import UserProfileSheet from "../components/UserProfileSheet";
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

function CommunitySetupCard({ setup, onAuthorClick, authorProfile, onCommentsClick }) {
  const queryClient = useQueryClient();
  const [showRating, setShowRating] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [saved, setSaved] = useState(false);

  const displayAuthorName = authorProfile?.display_name || authorProfile?.full_name || setup.author_name || "Anonymous";
  const authorAvatarUrl = authorProfile?.avatar_url;

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
    onMutate: async () => {
      setSaved(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      toast.success("Setup saved to your garage!");
    },
    onError: () => {
      setSaved(false);
      toast.error("Failed to save setup");
    }
  });

  const rateMutation = useMutation({
    mutationFn: async (stars) => {
      await base44.entities.CommunitySetup.update(setup.id, {
        rating_sum: (setup.rating_sum || 0) + stars,
        rating_count: (setup.rating_count || 0) + 1,
        popularity_score: (setup.popularity_score || 0) + stars
      });
    },
    onMutate: async () => {
      setShowRating(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      toast.success("Rating submitted!");
    },
    onError: () => {
      setShowRating(true);
      toast.error("Failed to submit rating");
    }
  });

  const avgRating = setup.rating_count > 0 ? (setup.rating_sum || 0) / setup.rating_count : 0;

  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {setup.is_curated && (
                <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
              )}
              <h3 className="font-heading text-sm font-semibold truncate">{setup.title}</h3>
            </div>
            <button
              className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 hover:text-primary transition-colors text-left"
              onClick={() => onAuthorClick?.(setup.author_id, displayAuthorName)}
            >
              {authorAvatarUrl ? (
                <img src={authorAvatarUrl} alt={displayAuthorName} className="w-4 h-4 rounded-full object-cover shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0" style={{ fontSize: "8px" }}>
                  {displayAuthorName[0]?.toUpperCase()}
                </span>
              )}
              {displayAuthorName}
              {setup.verified_author && (
                <Badge variant="outline" className="text-[9px] border-primary/40 text-primary px-1 py-0 h-3.5">{setup.verified_author}</Badge>
              )}
            </button>
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

        {setup.replay_urls?.length > 0 && (
          <div className="pt-1">
            <ReplayViewer urls={setup.replay_urls} />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || saved}
          >
            <Download className="w-3 h-3 mr-1" />
            {saved ? "Saved!" : "Save"}
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
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onCommentsClick?.(setup)}
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Discuss
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
  const [replayFilter, setReplayFilter] = useState(false);
  const [profileSheet, setProfileSheet] = useState(null); // { id, name }
  const [commentSetup, setCommentSetup] = useState(null);
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);

  const { data: setups, isLoading } = useQuery({
    queryKey: ["communitySetups"],
    queryFn: () => base44.entities.CommunitySetup.list("-popularity_score", COMMUNITY_SETUPS_LIMIT)
  });

  // Fetch live profiles for all unique authors
  const authorIds = useMemo(() => [...new Set((setups || []).map(s => s.author_id).filter(Boolean))], [setups]);
  const { data: authorProfiles = [] } = useQuery({
    queryKey: ["author-profiles-bulk", authorIds.join(",")],
    queryFn: async () => {
      if (authorIds.length === 0) return [];
      const results = await Promise.all(
        authorIds.map(id =>
          base44.entities.User.filter({ id }).then(r => r?.[0] || null).catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: authorIds.length > 0,
    staleTime: 0,
  });
  const authorProfileMap = useMemo(() => {
    const m = {};
    authorProfiles.forEach(u => { m[u.id] = u; });
    return m;
  }, [authorProfiles]);

  const { data: myFollows = [] } = useQuery({
    queryKey: ["my-follows"],
    queryFn: async () => {
      const user = await base44.auth.me();
      setCurrentUserId(user?.id || null);
      if (!user) return [];
      return base44.entities.Follow.filter({ follower_id: user.id });
    },
    enabled: !!isAuthenticated,
  });

  const followingIds = new Set(myFollows.map(f => f.following_id));

  const filteredSetups = (setups || []).filter(setup => {
    const matchesSearch = setup.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         setup.car.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (setup.track && setup.track.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSim = simFilter === "all" || setup.sim_title === simFilter;
    const matchesReplay = !replayFilter || (setup.replay_urls?.length > 0);
    return matchesSearch && matchesSim && matchesReplay;
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

  const followingSetups = (setups || []).filter(s => followingIds.has(s.author_id));

  const sims = ["all", ...new Set((setups || []).map(s => s.sim_title))];

  const queryClient = useQueryClient();
  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
  }, [queryClient]);
  const { containerRef, pullY, refreshing } = usePullToRefresh(handleRefresh);

  const handleAuthorClick = (id, name) => setProfileSheet({ id, name });

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

  function SetupGrid({ list }) {
    if (isLoading) return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto" />
      </div>
    );
    if (list.length === 0) return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-sm">No setups found.</p>
      </div>
    );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(setup => (
          <CommunitySetupCard key={setup.id} setup={setup} onAuthorClick={handleAuthorClick} authorProfile={authorProfileMap[setup.author_id]} onCommentsClick={setCommentSetup} />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Community Library" />
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-8 pb-24">
        <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">Community Setup Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and share setups from the sim racing community
          </p>
        </div>

        {/* Smart Setup Match */}
        <div className="mb-6">
          <SmartSetupMatch onSetupClick={(s) => setCommentSetup(s)} />
        </div>

        {/* Top Creators */}
        <TopCreators setups={setups || []} onSelectAuthor={handleAuthorClick} />

        {/* Tabs: All / Following */}
        <Tabs defaultValue="all">
          <TabsList className="bg-secondary mb-5">
            <TabsTrigger value="all" className="text-xs font-heading tracking-wide">All Setups</TabsTrigger>
            <TabsTrigger value="following" className="text-xs font-heading tracking-wide">
              <Users className="w-3.5 h-3.5 mr-1.5" />Following
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <Input
                placeholder="Search setups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
              <MobileSelect
                value={simFilter}
                onValueChange={setSimFilter}
                placeholder="All Sims"
                triggerClassName="w-40"
                options={sims.map(sim => ({ value: sim, label: sim === "all" ? "All Sims" : sim }))}
              />
              <MobileSelect
                value={sortBy}
                onValueChange={setSortBy}
                placeholder="Sort by"
                triggerClassName="w-40"
                options={[
                  { value: "popular", label: "Most Popular" },
                  { value: "rating", label: "Top Rated" },
                  { value: "downloads", label: "Most Downloaded" },
                  { value: "recent", label: "Most Recent" },
                ]}
              />
              <button
                onClick={() => setReplayFilter(r => !r)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  replayFilter
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                🎬 Has Replay
              </button>
            </div>
            <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
              <span>{sortedSetups.length} setups</span>
              <span className="w-px h-3 bg-border" />
              <span>{sims.length - 1} sims</span>
            </div>
            <SetupGrid list={sortedSetups} />
          </TabsContent>

          <TabsContent value="following">
            {followingIds.size === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>You're not following anyone yet.</p>
                <p className="text-xs mt-1">Click a creator above to follow them.</p>
              </div>
            ) : (
              <SetupGrid list={followingSetups} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />

      {profileSheet && (
        <UserProfileSheet
          authorId={profileSheet.id}
          authorName={profileSheet.name}
          isOpen={!!profileSheet}
          onClose={() => setProfileSheet(null)}
          currentUserId={currentUserId}
        />
      )}

      {commentSetup && (
        <Dialog open={!!commentSetup} onOpenChange={(o) => { if (!o) setCommentSetup(null); }}>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {commentSetup.is_curated && <BadgeCheck className="w-4 h-4 text-primary" />}
                <span className="truncate">{commentSetup.title}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">{commentSetup.sim_title}</Badge>
                <Badge variant="outline" className="text-xs">{commentSetup.car}</Badge>
                {commentSetup.track && <Badge variant="outline" className="text-xs">{commentSetup.track}</Badge>}
              </div>
              {commentSetup.notes && <p className="text-sm text-muted-foreground leading-relaxed">{commentSetup.notes}</p>}
            </div>
            <div className="pt-3 border-t border-border">
              <SetupComments setupId={commentSetup.id} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}