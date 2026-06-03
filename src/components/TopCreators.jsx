import { useMemo } from "react";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function TopCreators({ setups = [], onSelectAuthor }) {
  const creators = useMemo(() => {
    const map = {};
    setups.forEach(s => {
      if (!s.author_id) return;
      if (!map[s.author_id]) {
        map[s.author_id] = {
          id: s.author_id,
          name: s.author_name || "Unknown",
          setups: 0,
          downloads: 0,
          score: 0,
        };
      }
      map[s.author_id].setups++;
      map[s.author_id].downloads += s.download_count || 0;
      map[s.author_id].score += s.popularity_score || 0;
    });
    return Object.values(map).sort((a, b) => b.score - a.score).slice(0, 6);
  }, [setups]);

  // Fetch live user profiles for top creators
  const creatorIds = creators.map(c => c.id);
  const { data: userProfiles = [] } = useQuery({
    queryKey: ["creator-profiles", creatorIds.join(",")],
    queryFn: async () => {
      if (creatorIds.length === 0) return [];
      const results = await Promise.all(
        creatorIds.map(id =>
          base44.entities.User.filter({ id }).then(r => r?.[0] || null).catch(() => null)
        )
      );
      return results.filter(Boolean);
    },
    enabled: creatorIds.length > 0,
    staleTime: 0,
  });

  const profileMap = useMemo(() => {
    const m = {};
    userProfiles.forEach(u => { m[u.id] = u; });
    return m;
  }, [userProfiles]);

  if (creators.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="font-heading text-sm font-semibold tracking-wide">Top Creators</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {creators.map(creator => {
          const profile = profileMap[creator.id];
          const displayName = profile?.display_name || profile?.full_name || creator.name;
          const avatarUrl = profile?.avatar_url;
          const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

          return (
            <button
              key={creator.id}
              onClick={() => onSelectAuthor(creator.id, displayName)}
              className="rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/50 transition-all p-3 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold mb-2 overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <p className="text-xs font-semibold truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{creator.setups} setup{creator.setups !== 1 ? "s" : ""}</p>
              {creator.downloads > 0 && (
                <p className="text-xs text-muted-foreground">{creator.downloads} dl</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}