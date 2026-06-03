import { useMemo } from "react";
import { Users } from "lucide-react";

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

  if (creators.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="font-heading text-sm font-semibold tracking-wide">Top Creators</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {creators.map(creator => {
          const initials = creator.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
          return (
            <button
              key={creator.id}
              onClick={() => onSelectAuthor(creator.id, creator.name)}
              className="rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-muted/50 transition-all p-3 text-left"
            >
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold mb-2">
                {initials}
              </div>
              <p className="text-xs font-semibold truncate">{creator.name}</p>
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