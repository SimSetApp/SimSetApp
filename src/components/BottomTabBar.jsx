import { Link, useLocation } from "react-router-dom";
import { Home, FolderOpen, Bot, BookOpen, Heart, Wrench } from "lucide-react";

const TABS = [
  { path: "/", label: "Home", icon: Home },
  { path: "/setup-guide", label: "Guide", icon: BookOpen },
  { path: "/setup-wizard", label: "Wizard", icon: Wrench },
  { path: "/race-engineer", label: "Engineer", icon: Bot },
  { path: "/saved-setups", label: "Garage", icon: FolderOpen },
  { path: "/support", label: "Support", icon: Heart },
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
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-100 select-none touch-manipulation active:scale-95 active:opacity-70 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Icon className={`w-6 h-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}