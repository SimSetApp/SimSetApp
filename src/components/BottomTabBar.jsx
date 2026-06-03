import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FolderOpen, Bot, BookOpen, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const TABS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/setup-guide", label: "Setup Guide", icon: BookOpen },
  { path: "/race-engineer", label: "Engineer", icon: Bot },
  { path: "/saved-setups", label: "My Garage", icon: FolderOpen },
  { path: "/messages", label: "Messages", icon: MessageCircle },
];

export default function BottomTabBar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [meId, setMeId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      base44.auth.me().then(u => setMeId(u?.id || null));
    }
  }, [isAuthenticated]);

  const { data: unreadMessages = [] } = useQuery({
    queryKey: ["unread-count", meId],
    queryFn: () => base44.entities.Message.filter({ recipient_id: meId, read: false }, "-created_date", 50),
    enabled: !!meId,
    refetchInterval: 15000,
  });

  const unreadCount = unreadMessages.length;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          const showBadge = path === "/messages" && unreadCount > 0;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-100 select-none touch-manipulation active:scale-95 active:opacity-70 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}