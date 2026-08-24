import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { MessageSquare, Send, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SetupComments({ setupId }) {
  const [content, setContent] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isAuthenticated) {
      base44.auth.me().then(u => setCurrentUserId(u?.id || null)).catch(() => {});
    }
  }, [isAuthenticated]);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["setup-comments", setupId],
    queryFn: () => base44.entities.SetupComment.filter({ setup_id: setupId }, "-created_date", 100),
    enabled: !!setupId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      const user = await base44.auth.me();
      if (!user) throw new Error("Not authenticated");
      return base44.entities.SetupComment.create({
        setup_id: setupId,
        author_id: user.id,
        author_name: user.full_name || user.email?.split("@")[0] || "Anonymous",
        content: content.trim(),
      });
    },
    onMutate: async () => {
      const previous = queryClient.getQueryData(["setup-comments", setupId]);
      const user = await base44.auth.me().catch(() => null);
      const optimistic = {
        id: "temp-" + Date.now(),
        setup_id: setupId,
        author_id: user?.id || "temp",
        author_name: user?.full_name || user?.email?.split("@")[0] || "You",
        content: content.trim(),
        created_date: new Date().toISOString(),
      };
      queryClient.setQueryData(["setup-comments", setupId], [optimistic, ...previous]);
      setContent("");
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setup-comments", setupId] });
    },
    onError: (_e, _v, context) => {
      queryClient.setQueryData(["setup-comments", setupId], context.previous);
      toast.error("Failed to post comment");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id) => base44.entities.SetupComment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setup-comments", setupId] });
      toast.success("Comment deleted");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addCommentMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h4 className="font-heading text-sm font-bold tracking-wide">Discussion ({comments.length})</h4>
      </div>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Ask a question or share your experience with this setup…"
            className="min-h-[70px] text-sm resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!content.trim() || addCommentMutation.isPending} className="text-xs">
              {addCommentMutation.isPending ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1" />}
              Post Comment
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
          <p className="text-xs text-muted-foreground">No comments yet. Start the discussion!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {comments.map(c => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-3 group">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {c.author_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium truncate">{c.author_name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(c.created_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                </div>
                {currentUserId === c.author_id && (
                  <button
                    onClick={() => deleteCommentMutation.mutate(c.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}