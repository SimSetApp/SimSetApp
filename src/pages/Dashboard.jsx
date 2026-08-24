import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "../components/EmptyState";
import { Sparkles, Bot, Flag, Activity, FolderOpen, Car, MapPin, Clock, MessageSquare, Users, ArrowRight, TrendingUp, Calendar, LayoutDashboard } from "lucide-react";

const QUICK_ACTIONS = [
  { icon: Sparkles, label: "Setup Wizard", href: "/setup-wizard" },
  { icon: Bot, label: "Race Engineer", href: "/race-engineer" },
  { icon: Flag, label: "Pit Board", href: "/pit-board" },
  { icon: Activity, label: "Telemetry", href: "/telemetry" },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Dashboard() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    enabled: !!isAuthenticated,
  });

  const { data: setups = [], isLoading: setupsLoading } = useQuery({
    queryKey: ["saved-setups-dashboard"],
    queryFn: () => base44.entities.SavedSetup.list("-updated_date", 5),
    enabled: !!isAuthenticated,
  });
  const lastSetup = setups[0];

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions-dashboard"],
    queryFn: () => base44.entities.SessionLog.list("-created_date", 5),
    enabled: !!isAuthenticated,
  });
  const lastSession = sessions[0];

  const { data: myCommunitySetups = [] } = useQuery({
    queryKey: ["my-community-setups"],
    queryFn: () => base44.entities.CommunitySetup.filter({ author_id: me.id }),
    enabled: !!isAuthenticated && !!me,
  });
  const mySetupIds = useMemo(() => new Set(myCommunitySetups.map(s => s.id)), [myCommunitySetups]);
  const mySetupMap = useMemo(() => {
    const m = {};
    myCommunitySetups.forEach(s => { m[s.id] = s; });
    return m;
  }, [myCommunitySetups]);

  const { data: recentComments = [] } = useQuery({
    queryKey: ["dashboard-recent-comments", [...mySetupIds].sort().join(",")],
    queryFn: () => base44.entities.SetupComment.list("-created_date", 20),
    enabled: mySetupIds.size > 0,
  });
  const commentsOnMySetups = recentComments.filter(c => mySetupIds.has(c.setup_id)).slice(0, 4);

  const { data: follows = [] } = useQuery({
    queryKey: ["my-follows-dashboard"],
    queryFn: () => base44.entities.Follow.filter({ follower_id: me.id }),
    enabled: !!isAuthenticated && !!me,
  });
  const followingIds = useMemo(() => new Set(follows.map(f => f.following_id)), [follows]);

  const { data: communitySetups = [] } = useQuery({
    queryKey: ["communitySetups"],
    queryFn: () => base44.entities.CommunitySetup.list("-created_date", 30),
    enabled: !!isAuthenticated,
  });
  const followingSetups = communitySetups.filter(s => followingIds.has(s.author_id)).slice(0, 4);

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-xl border border-border bg-card p-10">
            <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-5">
              <LayoutDashboard className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-semibold tracking-tight mb-2">Your Sim Racing Dashboard</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Sign in to pick up where you left off — your latest setup, last session, and community activity.
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

  const greeting = me?.display_name || me?.full_name || "racer";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Dashboard" />
      <div className="max-w-5xl mx-auto px-4 py-10 pb-24">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-xs text-muted-foreground mb-1">Welcome back</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{greeting}</h1>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {QUICK_ACTIONS.map(a => (
            <Link
              key={a.href}
              to={a.href}
              className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-2.5">
                <a.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="text-sm font-medium">{a.label}</div>
              <div className="flex items-center gap-1 text-[11px] text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Continue where you left off */}
        <div className="mb-10">
          <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Continue Where You Left Off
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Last setup */}
            <Link to="/saved-setups" className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Latest Setup</span>
              </div>
              {setupsLoading ? (
                <div className="space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/2" /></div>
              ) : lastSetup ? (
                <>
                  <h3 className="font-heading text-sm font-medium truncate">{lastSetup.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Car className="w-3 h-3" />{lastSetup.car}</span>
                    {lastSetup.track && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lastSetup.track}</span>}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2">Updated {timeAgo(lastSetup.updated_date)}</div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No setups yet. Save your first setup to your garage.</p>
              )}
            </Link>

            {/* Last session */}
            <Link to="/telemetry" className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Session</span>
              </div>
              {sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions logged yet. Import telemetry or log a session.</p>
              ) : lastSession ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{lastSession.session_type}</Badge>
                    {lastSession.best_lap_time && <span className="text-sm font-semibold tabular-nums font-digi text-primary">{lastSession.best_lap_time}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {lastSession.total_laps != null && <span>{lastSession.total_laps} laps</span>}
                    {lastSession.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{lastSession.date}</span>}
                  </div>
                </>
              ) : null}
            </Link>
          </div>
        </div>

        {/* Activity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {/* Comments on your setups */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" /> Comments On Your Setups
            </h2>
            {mySetupIds.size === 0 ? (
              <p className="text-sm text-muted-foreground">Share a setup to the community to start getting feedback.</p>
            ) : commentsOnMySetups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <div className="space-y-3">
                {commentsOnMySetups.map(c => (
                  <div key={c.id} className="text-sm">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-xs">{c.author_name}</span>
                      <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_date)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{c.content}</p>
                    {mySetupMap[c.setup_id] && (
                      <p className="text-[10px] text-primary mt-0.5">on {mySetupMap[c.setup_id].title}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New from followed creators */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> From Creators You Follow
            </h2>
            {followingIds.size === 0 ? (
              <p className="text-sm text-muted-foreground">Follow creators in the Community Library to see their new setups here.</p>
            ) : followingSetups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No new setups from creators you follow.</p>
            ) : (
              <div className="space-y-3">
                {followingSetups.map(s => (
                  <Link key={s.id} to="/community-library" className="block group">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{s.title}</span>
                      {s.is_curated && <Badge variant="outline" className="text-[9px] border-primary/40 text-primary px-1 py-0 h-3.5">PRO</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>{s.author_name}</span>
                      <span>•</span>
                      <span className="truncate">{s.car}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* At-a-glance stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: FolderOpen, label: "Saved Setups", value: setups.length },
            { icon: Activity, label: "Sessions", value: sessions.length },
            { icon: Users, label: "Shared", value: myCommunitySetups.length },
            { icon: TrendingUp, label: "Following", value: followingIds.size },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <s.icon className="w-3.5 h-3.5" /> {s.label}
              </div>
              <div className="text-xl font-semibold tabular-nums font-digi">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}