import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Check, CheckCheck, UserCheck, UserX, Users } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

function makeConversationId(a, b) {
  return [a, b].sort().join("_");
}

export default function Messages() {
  const { isAuthenticated, isLoadingAuth, navigateToLogin } = useAuth();
  const [me, setMe] = useState(null);
  const [activeConvUserId, setActiveConvUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated) {
      base44.auth.me().then(u => setMe(u));
    }
  }, [isAuthenticated]);

  // All friend requests involving me
  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friend-requests", me?.id],
    queryFn: () => base44.entities.FriendRequest.list("-created_date", 100),
    enabled: !!me,
  });

  const myRequests = friendRequests.filter(r => r.from_id === me?.id || r.to_id === me?.id);
  const accepted = myRequests.filter(r => r.status === "accepted");
  const incoming = myRequests.filter(r => r.to_id === me?.id && r.status === "pending");

  const friendIds = accepted.map(r => r.from_id === me?.id ? r.to_id : r.from_id);

  // Fetch friend profiles
  const { data: friendProfiles = [] } = useQuery({
    queryKey: ["friend-profiles", friendIds.join(",")],
    queryFn: async () => {
      if (friendIds.length === 0) return [];
      const results = await Promise.all(
        friendIds.map(id => base44.entities.User.filter({ id }).then(r => r?.[0] || null))
      );
      return results.filter(Boolean);
    },
    enabled: friendIds.length > 0,
    staleTime: 30_000,
  });

  // Fetch sender profiles for incoming requests
  const incomingIds = incoming.map(r => r.from_id);
  const { data: incomingProfiles = [] } = useQuery({
    queryKey: ["incoming-profiles", incomingIds.join(",")],
    queryFn: async () => {
      if (incomingIds.length === 0) return [];
      const results = await Promise.all(
        incomingIds.map(id => base44.entities.User.filter({ id }).then(r => r?.[0] || null))
      );
      return results.filter(Boolean);
    },
    enabled: incomingIds.length > 0,
    staleTime: 30_000,
  });

  // Messages for active conversation
  const activeConvId = me && activeConvUserId ? makeConversationId(me.id, activeConvUserId) : null;
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", activeConvId],
    queryFn: () => base44.entities.Message.filter({ conversation_id: activeConvId }, "created_date", 200),
    enabled: !!activeConvId,
    refetchInterval: 4000,
  });

  // All my messages (for conversation list preview)
  const { data: allMessages = [] } = useQuery({
    queryKey: ["all-messages", me?.id],
    queryFn: () => base44.entities.Message.filter({ sender_id: me?.id }, "-created_date", 200),
    enabled: !!me,
    refetchInterval: 8000,
  });
  const { data: allReceivedMessages = [] } = useQuery({
    queryKey: ["all-received-messages", me?.id],
    queryFn: () => base44.entities.Message.filter({ recipient_id: me?.id }, "-created_date", 200),
    enabled: !!me,
    refetchInterval: 8000,
  });

  const allConvMessages = useMemo(() => [...allMessages, ...allReceivedMessages], [allMessages, allReceivedMessages]);

  // Latest message per friend
  const latestPerFriend = useMemo(() => {
    const map = {};
    allConvMessages.forEach(msg => {
      const otherId = msg.sender_id === me?.id ? msg.recipient_id : msg.sender_id;
      if (!map[otherId] || new Date(msg.created_date) > new Date(map[otherId].created_date)) {
        map[otherId] = msg;
      }
    });
    return map;
  }, [allConvMessages, me]);

  // Unread count per friend
  const unreadPerFriend = useMemo(() => {
    const map = {};
    allReceivedMessages.forEach(msg => {
      if (!msg.read) {
        map[msg.sender_id] = (map[msg.sender_id] || 0) + 1;
      }
    });
    return map;
  }, [allReceivedMessages]);

  const totalUnread = Object.values(unreadPerFriend).reduce((a, b) => a + b, 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!activeConvId || !me) return;
    const unread = messages.filter(m => m.recipient_id === me.id && !m.read);
    unread.forEach(m => base44.entities.Message.update(m.id, { read: true }));
    if (unread.length > 0) {
      queryClient.invalidateQueries({ queryKey: ["all-received-messages", me.id] });
    }
  }, [messages, activeConvId, me]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim() || !activeConvUserId || !me) return;
      await base44.entities.Message.create({
        conversation_id: activeConvId,
        sender_id: me.id,
        recipient_id: activeConvUserId,
        content: newMessage.trim(),
        read: false,
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", activeConvId] });
      queryClient.invalidateQueries({ queryKey: ["all-messages", me?.id] });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const acceptMutation = useMutation({
    mutationFn: (reqId) => base44.entities.FriendRequest.update(reqId, { status: "accepted" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", me?.id] });
      toast.success("Friend request accepted!");
    },
  });

  const declineMutation = useMutation({
    mutationFn: (reqId) => base44.entities.FriendRequest.update(reqId, { status: "declined" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", me?.id] });
    },
  });

  const activeProfile = friendProfiles.find(p => p.id === activeConvUserId);

  if (!isLoadingAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="rounded-2xl border border-border bg-card p-10">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">Sign in to use Messages</h2>
            <p className="text-sm text-muted-foreground mb-6">Connect with other sim racers.</p>
            <Button onClick={navigateToLogin} className="w-full">Sign In / Register</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <MobileHeader title="Messages" />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-28">
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-xl font-bold">Messages</h1>
          {totalUnread > 0 && (
            <Badge className="text-xs h-5 px-1.5">{totalUnread}</Badge>
          )}
        </div>

        {/* Incoming friend requests */}
        {incoming.length > 0 && (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 mb-5 space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Friend Requests</p>
            {incoming.map(req => {
              const sender = incomingProfiles.find(p => p.id === req.from_id);
              const name = sender?.full_name || req.from_id;
              return (
                <div key={req.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold overflow-hidden">
                      {sender?.avatar_url ? <img src={sender.avatar_url} className="w-full h-full object-cover" /> : name[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="sm" className="h-7 text-xs px-3" onClick={() => acceptMutation.mutate(req.id)} disabled={acceptMutation.isPending}>
                      <UserCheck className="w-3 h-3 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-3" onClick={() => declineMutation.mutate(req.id)} disabled={declineMutation.isPending}>
                      <UserX className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[60vh] min-h-[400px]">
          {/* Friends list */}
          <div className="md:col-span-1 rounded-xl border border-border bg-card overflow-y-auto">
            {friendProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <Users className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No friends yet.</p>
                <p className="text-xs mt-1">Add friends from creator profiles in the Community Library.</p>
              </div>
            ) : (
              <div>
                {friendProfiles.map(profile => {
                  const latest = latestPerFriend[profile.id];
                  const unread = unreadPerFriend[profile.id] || 0;
                  const isActive = activeConvUserId === profile.id;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => setActiveConvUserId(profile.id)}
                      className={`w-full flex items-center gap-3 p-3 border-b border-border last:border-0 transition-colors text-left hover:bg-muted/40 ${isActive ? "bg-primary/10" : ""}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0 overflow-hidden">
                        {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" /> : profile.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{profile.full_name}</p>
                          {latest && <span className="text-xs text-muted-foreground shrink-0">{formatDistanceToNow(new Date(latest.created_date), { addSuffix: false })}</span>}
                        </div>
                        {latest && <p className="text-xs text-muted-foreground truncate">{latest.sender_id === me?.id ? "You: " : ""}{latest.content}</p>}
                      </div>
                      {unread > 0 && <Badge className="h-4 px-1 text-xs shrink-0">{unread}</Badge>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chat panel */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card flex flex-col overflow-hidden">
            {!activeConvUserId ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold overflow-hidden">
                    {activeProfile?.avatar_url
                      ? <img src={activeProfile.avatar_url} alt={activeProfile.full_name} className="w-full h-full object-cover" />
                      : activeProfile?.full_name?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-medium text-sm">{activeProfile?.full_name}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                  {messages.map(msg => {
                    const isMine = msg.sender_id === me?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${isMine ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <p>{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-0.5 text-xs ${isMine ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"}`}>
                            <span>{formatDistanceToNow(new Date(msg.created_date), { addSuffix: false })}</span>
                            {isMine && (msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-border shrink-0">
                  <form
                    className="flex gap-2"
                    onSubmit={e => { e.preventDefault(); sendMutation.mutate(); }}
                  >
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 text-sm"
                      autoComplete="off"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim() || sendMutation.isPending}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}