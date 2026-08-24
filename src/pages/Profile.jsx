import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, Save, User, Loader2, Settings, MessageCircle, MessageSquare, UserCheck, UserX, Users, Search, Copy, UserPlus, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import MessagesPanel from "@/components/MessagesPanel";

export default function Profile() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "messages" ? "messages" : searchParams.get("tab") === "friends" ? "friends" : "settings";
  const initialWith = searchParams.get("with") || null;

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    enabled: !!isAuthenticated,
  });

  const [form, setForm] = useState(null);
  const [tagSearch, setTagSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  if (user && form === null) {
    setForm({
      display_name: user.display_name || user.full_name || "",
      bio: user.bio || "",
      avatar_url: user.avatar_url || "",
      discord_webhook_url: user.discord_webhook_url || "",
    });
    const updates = {};
    if (!user.user_tag) {
      updates.user_tag = "SSA-" + Math.floor(10000 + Math.random() * 90000);
    }
    // Backdate: auto-fill display_name from full_name for existing users
    if (!user.display_name && user.full_name) {
      updates.display_name = user.full_name;
    }
    if (Object.keys(updates).length > 0) {
      base44.auth.updateMe(updates).then(() => queryClient.invalidateQueries({ queryKey: ["me"] }));
    }
  }

  // Generate a user tag if the user doesn't have one
  const ensureUserTag = async (currentUser) => {
    if (currentUser.user_tag) return currentUser.user_tag;
    const tag = "SSA-" + Math.floor(10000 + Math.random() * 90000);
    await base44.auth.updateMe({ user_tag: tag });
    return tag;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const tag = await ensureUserTag(user);
      await base44.auth.updateMe({ display_name: form.display_name, bio: form.bio, avatar_url: form.avatar_url, discord_webhook_url: form.discord_webhook_url, user_tag: tag });
      const mySetups = await base44.entities.CommunitySetup.filter({ author_id: user.id });
      if (mySetups.length > 0 && form.display_name) {
        await Promise.all(mySetups.map(s => base44.entities.CommunitySetup.update(s.id, { author_name: form.display_name })));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["communitySetups"] });
      queryClient.invalidateQueries({ queryKey: ["author-profiles-bulk"] });
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  // Friend requests
  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friend-requests", user?.id],
    queryFn: () => base44.entities.FriendRequest.list("-created_date", 100),
    enabled: !!user,
  });

  const incoming = friendRequests.filter(r => r.to_id === user?.id && r.status === "pending");
  const sent = friendRequests.filter(r => r.from_id === user?.id && r.status === "pending");
  const incomingIds = incoming.map(r => r.from_id);
  const sentIds = sent.map(r => r.to_id);

  const { data: incomingProfiles = [] } = useQuery({
    queryKey: ["incoming-profiles", incomingIds.join(",")],
    queryFn: async () => {
      if (incomingIds.length === 0) return [];
      const results = await Promise.all(
        incomingIds.map(id => base44.entities.User.filter({ id }).then(r => r?.[0] || null).catch(() => null))
      );
      return results.filter(Boolean);
    },
    enabled: incomingIds.length > 0,
  });

  const { data: sentProfiles = [] } = useQuery({
    queryKey: ["sent-profiles", sentIds.join(",")],
    queryFn: async () => {
      if (sentIds.length === 0) return [];
      const results = await Promise.all(
        sentIds.map(id => base44.entities.User.filter({ id }).then(r => r?.[0] || null).catch(() => null))
      );
      return results.filter(Boolean);
    },
    enabled: sentIds.length > 0,
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (reqId) => base44.entities.FriendRequest.delete(reqId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user?.id] });
      toast.success("Request cancelled.");
    },
  });

  const acceptMutation = useMutation({
    mutationFn: (reqId) => base44.entities.FriendRequest.update(reqId, { status: "accepted" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user?.id] });
      toast.success("Friend request accepted!");
    },
  });

  const declineMutation = useMutation({
    mutationFn: (reqId) => base44.entities.FriendRequest.update(reqId, { status: "declined" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", user?.id] });
    },
  });

  const sendRequestMutation = useMutation({
    mutationFn: (toId) => base44.entities.FriendRequest.create({ from_id: user.id, to_id: toId, status: "pending" }),
    onSuccess: () => {
      toast.success("Friend request sent!");
      setSearchResult(null);
      setTagSearch("");
    },
    onError: () => toast.error("Failed to send request"),
  });

  const handleTagSearch = async () => {
    const query = tagSearch.trim().toUpperCase();
    if (!query) return;
    setSearchLoading(true);
    setSearchError("");
    setSearchResult(null);
    const results = await base44.entities.User.filter({ user_tag: query });
    setSearchLoading(false);
    if (!results || results.length === 0) {
      setSearchError("No user found with that tag.");
    } else {
      const found = results[0];
      if (found.id === user.id) {
        setSearchError("That's you!");
      } else {
        setSearchResult(found);
      }
    }
  };

  const alreadyFriends = friendRequests.some(r =>
    (r.from_id === user?.id && r.to_id === searchResult?.id) ||
    (r.to_id === user?.id && r.from_id === searchResult?.id)
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, avatar_url: file_url }));
    setAvatarUploading(false);
  };

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground mb-4">Sign in to manage your profile.</p>
          <Button onClick={navigateToLogin}>Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="My Profile" />
      <div className="max-w-5xl mx-auto px-4 py-10 pb-24">
        <div className="hidden md:flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-2xl font-semibold tracking-tight">My Profile</h1>
        </div>

        {isLoading || !form ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue={initialTab}>
            <TabsList className="bg-secondary mb-6">
              <TabsTrigger value="settings" className="text-xs font-heading tracking-wide">
                <Settings className="w-3.5 h-3.5 mr-1.5" />Profile Settings
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs font-heading tracking-wide">
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />Messages
              </TabsTrigger>
              <TabsTrigger value="friends" className="text-xs font-heading tracking-wide relative">
                <Users className="w-3.5 h-3.5 mr-1.5" />Friends
                {incoming.length > 0 && (
                  <span className="ml-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{incoming.length}</span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings">
              <div className="max-w-lg space-y-7">
                <p className="text-sm text-muted-foreground -mt-2">
                  Changes reflect immediately across the community.
                </p>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                      {form.avatar_url ? (
                        <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={avatarUploading}
                      className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                    >
                      {avatarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <p className="text-xs text-muted-foreground">Click the camera to change your avatar</p>
                </div>

                {/* User Tag */}
                <div className="rounded-xl border border-border bg-secondary px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Your User Tag</p>
                    <p className="text-sm font-mono font-semibold text-primary">{user.user_tag || "Save profile to generate"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Share this with friends so they can find you</p>
                  </div>
                  {user.user_tag && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(user.user_tag); toast.success("Tag copied!"); }}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="username">Display Name</Label>
                  <Input
                    id="username"
                    value={form.display_name}
                    onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Tell the community about your sim racing..."
                    className="resize-none h-28"
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground text-right">{(form.bio || "").length}/300</p>
                </div>

                {/* Discord webhook */}
                <div className="space-y-2 rounded-xl border border-border bg-secondary/40 p-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <Label htmlFor="discord_webhook" className="text-sm font-semibold m-0">Discord Webhook URL</Label>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Paste a channel webhook URL to share your setups to your Discord server in one click.{" "}
                    <a href="https://support.discord.com/hc/en-us/articles/228384668-Intro-to-Webhooks" target="_blank" rel="noopener noreferrer" className="text-primary underline">How to create one</a>.
                  </p>
                  <Input
                    id="discord_webhook"
                    value={form.discord_webhook_url}
                    onChange={e => setForm(f => ({ ...f, discord_webhook_url: e.target.value }))}
                    placeholder="https://discord.com/api/webhooks/…"
                    className="font-mono text-xs"
                  />
                </div>

                <Button
                  className="w-full font-heading text-xs tracking-wider"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || avatarUploading}
                >
                  {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Profile
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <MessagesPanel me={user} initialUserId={initialWith} />
            </TabsContent>

            <TabsContent value="friends">
              <div className="max-w-lg space-y-4">
                <p className="text-sm text-muted-foreground -mt-2">Find users by their tag or manage incoming requests.</p>

                {/* Search by tag */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Find a User</p>
                  <div className="flex gap-2">
                    <Input
                      value={tagSearch}
                      onChange={e => { setTagSearch(e.target.value); setSearchError(""); setSearchResult(null); }}
                      onKeyDown={e => e.key === "Enter" && handleTagSearch()}
                      placeholder="Enter User Tag (e.g. SSA-12345)"
                      className="flex-1 font-mono text-sm"
                    />
                    <Button size="sm" onClick={handleTagSearch} disabled={searchLoading || !tagSearch.trim()} className="h-9 px-3">
                      {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                  {searchError && <p className="text-xs text-muted-foreground">{searchError}</p>}
                  {searchResult && (
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold overflow-hidden shrink-0">
                          {searchResult.avatar_url
                            ? <img src={searchResult.avatar_url} className="w-full h-full object-cover" alt="" />
                            : (searchResult.display_name || searchResult.full_name || "?")[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{searchResult.display_name || searchResult.full_name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{searchResult.user_tag}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 text-xs px-3"
                        disabled={alreadyFriends || sendRequestMutation.isPending}
                        onClick={() => sendRequestMutation.mutate(searchResult.id)}
                      >
                        {alreadyFriends ? "Already connected" : <><UserPlus className="w-3 h-3 mr-1" />Add Friend</>}
                      </Button>
                    </div>
                  )}
                </div>
                {/* Incoming requests */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />Incoming Requests
                    {incoming.length > 0 && <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{incoming.length}</span>}
                  </p>
                  {incoming.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                      <p className="text-sm text-muted-foreground">No incoming requests.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border">
                      {incoming.map(req => {
                        const sender = incomingProfiles.find(p => p.id === req.from_id);
                        const name = sender?.display_name || sender?.full_name || req.from_id;
                        return (
                          <div key={req.id} className="flex items-center justify-between gap-3 p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold overflow-hidden shrink-0">
                                {sender?.avatar_url
                                  ? <img src={sender.avatar_url} className="w-full h-full object-cover" alt={name} />
                                  : name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{sender?.user_tag}</p>
                              </div>
                            </div>
                            <div className="flex gap-1.5">
                              <Button size="sm" className="h-8 text-xs px-3" onClick={() => acceptMutation.mutate(req.id)} disabled={acceptMutation.isPending}>
                                <UserCheck className="w-3 h-3 mr-1" />Accept
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-xs px-2" onClick={() => declineMutation.mutate(req.id)} disabled={declineMutation.isPending}>
                                <UserX className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sent requests */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />Sent Requests
                    {sent.length > 0 && <span className="bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{sent.length}</span>}
                  </p>
                  {sent.length === 0 ? (
                    <div className="rounded-xl border border-border bg-card p-6 text-center">
                      <p className="text-sm text-muted-foreground">No pending sent requests.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border bg-card divide-y divide-border">
                      {sent.map(req => {
                        const recipient = sentProfiles.find(p => p.id === req.to_id);
                        const name = recipient?.display_name || recipient?.full_name || req.to_id;
                        return (
                          <div key={req.id} className="flex items-center justify-between gap-3 p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm font-bold overflow-hidden shrink-0">
                                {recipient?.avatar_url
                                  ? <img src={recipient.avatar_url} className="w-full h-full object-cover" alt={name} />
                                  : name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{recipient?.user_tag}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>
                              <Button size="sm" variant="outline" className="h-8 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => cancelRequestMutation.mutate(req.id)} disabled={cancelRequestMutation.isPending}>
                                <X className="w-3 h-3 mr-1" />Cancel
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  );
}