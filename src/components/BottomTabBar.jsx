import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Sparkles, Bot, FolderOpen, Users } from "lucide-react";

const TABS = [
  { path: "/dashboard", label: "Home", icon: LayoutDashboard },
  { path: "/setup-wizard", label: "Wizard", icon: Sparkles },
  { path: "/race-engineer", label: "Engineer", icon: Bot },
  { path: "/saved-setups", label: "Garage", icon: FolderOpen },
  { path: "/community-library", label: "Community", icon: Users },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch max-w-md mx-auto">
        {TABS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors duration-150 select-none touch-manipulation ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full transition-opacity duration-150 ${
                  active ? "bg-primary opacity-100" : "opacity-0"
                }`}
              />
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}