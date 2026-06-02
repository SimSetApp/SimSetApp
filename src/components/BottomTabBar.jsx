import { Link, useLocation } from "react-router-dom";
import { Home, FolderOpen, Bot, BookOpen } from "lucide-react";

const TABS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/setup-guide", label: "Setup Guide", icon: BookOpen },
  { path: "/race-engineer", label: "Engineer", icon: Bot },
  { path: "/saved-setups", label: "My Garage", icon: FolderOpen },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors select-none ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}