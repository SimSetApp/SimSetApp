import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, UserMinus, Download, TrendingUp, Car, MapPin, MessageCircle, UserCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function UserProfileSheet({ authorId, authorName, isOpen, onClose, currentUserId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authorUser } = useQuery({
    queryKey: ["user-profile", authorId],
    queryFn: async () => {
      const users = await base44.entities.User.filter({ id: authorId });
      return users?.[0] || null;
    },
    enabled: isOpen && !!authorId,
  });

  const displayName = authorUser?.full_name || authorName || "Unknown Creator";
  const bio = authorUser?.bio;
  const avatarUrl = authorUser?.avatar_url;

  const { data: theirSetups = [] } = useQuery({
    queryKey: ["author-setups", authorId],
    queryFn: () => base44.entities.CommunitySetup.filter({ author_id: authorId }),
    enabled: isOpen && !!authorId,
  });

  const { data: allFollows = [] } = useQuery({
    queryKey: ["follows-for", authorId],
    queryFn: () => base44.entities.Follow.filter({ following_id: authorId }),
    enabled: isOpen && !!authorId,
  });

  const myFollow = currentUserId ? allFollows.find(f => f.follower_id === currentUserId) : null;
  const isFollowing = !!myFollow;

  // Friend request status
  const { data: friendRequests = [] } = useQuery({
    queryKey: ["friend-requests", currentUserId],
    queryFn: () => base44.entities.FriendRequest.list("-created_date", 100),
    enabled: isOpen && !!currentUserId && !!authorId,
  });

  const myRequests = friendRequests.filter(r =>
    (r.from_id === currentUserId && r.to_id === authorId) ||
    (r.from_id === authorId && r.to_id === currentUserId)
  );
  const activeRequest = myRequests.find(r => r.status !== "declined");
  const isFriend = activeRequest?.status === "accepted";
  const isPending = activeRequest?.status === "pending";
  const iSentRequest = activeRequest?.from_id === currentUserId;

  const followMutation = useMutation({
    mutationFn: () => base44.entities.Follow.create({ follower_id: currentUserId, following_id: authorId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows-for", authorId] });
      queryClient.invalidateQueries({ queryKey: ["my-follows"] });
      toast.success(`Following ${displayName}!`);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => base44.entities.Follow.delete(myFollow.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows-for", authorId] });
      queryClient.invalidateQueries({ queryKey: ["my-follows"] });
      toast.success(`Unfollowed ${displayName}`);
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: () => base44.entities.FriendRequest.create({
      from_id: currentUserId,
      to_id: authorId,
      status: "pending",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-requests", currentUserId] });
      toast.success(`Friend request sent to ${displayName}!`);
    },
    onError: () => toast.error("Failed to send friend request"),
  });

  const handleMessage = () => {
    onClose();
    navigate(`/messages?with=${authorId}`);
  };

  const totalDownloads = theirSetups.reduce((sum, s) => sum + (s.download_count || 0), 0);
  const initials = displayName
    ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const isOwnProfile = currentUserId && authorId === currentUserId;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto pb-24">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="font-heading text-lg">{displayName}</SheetTitle>
              {bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{bio}</p>}
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                <span>{allFollows.length} follower{allFollows.length !== 1 ? "s" : ""}</span>
                <span className="w-px h-3 bg-border" />
                <span>{theirSetups.length} setup{theirSetups.length !== 1 ? "s" : ""}</span>
                {totalDownloads > 0 && (
                  <>
                    <span className="w-px h-3 bg-border" />
                    <span>{totalDownloads} downloads</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {currentUserId && !isOwnProfile && (
            <div className="flex flex-col gap-2 mt-3">
              {/* Follow button */}
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className="w-full"
                disabled={followMutation.isPending || unfollowMutation.isPending}
                onClick={() => isFollowing ? unfollowMutation.mutate() : followMutation.mutate()}
              >
                {isFollowing ? (
                  <><UserMinus className="w-4 h-4 mr-1.5" /> Unfollow</>
                ) : (
                  <><UserPlus className="w-4 h-4 mr-1.5" /> Follow</>
                )}
              </Button>

              {/* Friend / Message buttons */}
              {isFriend ? (
                <Button size="sm" variant="outline" className="w-full" onClick={handleMessage}>
                  <MessageCircle className="w-4 h-4 mr-1.5" /> Message
                </Button>
              ) : isPending ? (
                <Button size="sm" variant="outline" className="w-full" disabled>
                  <Clock className="w-4 h-4 mr-1.5" />
                  {iSentRequest ? "Request Sent" : "Respond in Messages"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => addFriendMutation.mutate()}
                  disabled={addFriendMutation.isPending}
                >
                  <UserCheck className="w-4 h-4 mr-1.5" /> Add Friend
                </Button>
              )}
            </div>
          )}
        </SheetHeader>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Setups</h3>
          {theirSetups.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No setups shared yet.</p>
          ) : (
            theirSetups.map(setup => (
              <div key={setup.id} className="rounded-xl border border-border bg-card/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{setup.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Car className="w-3 h-3" />{setup.car}
                      </span>
                      {setup.track && setup.track !== "N/A" && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />{setup.track}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">{setup.sim_title}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{setup.download_count || 0}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{Math.round(setup.popularity_score || 0)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}