import { Link, useLocation } from "react-router-dom";

const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";
import { Gauge, BookOpen, FolderOpen } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Gauge },
  { path: "/setup-guide", label: "Setup Guide", icon: BookOpen },
  { path: "/saved-setups", label: "My Garage", icon: FolderOpen },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={LOGO_URL} alt="SimSetApp" className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}