import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Trash2, Heart, ChevronDown, Wrench, BookOpen, Zap, FlaskConical, Bot, FolderOpen, Users, Gauge, UserCircle, Palette, Instagram, Sparkles, Flag, Activity, GraduationCap, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme, THEMES } from "@/lib/ThemeContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";

// Top-level nav links
const primaryNav = [
  { path: "/dashboard", label: "Home" },
  { path: "/setup-wizard", label: "Setup Wizard", icon: Sparkles },
  { path: "/race-engineer", label: "Race Engineer", icon: Bot },
  { path: "/community-library", label: "Community", icon: Users },
  { path: "/saved-setups", label: "My Garage", icon: FolderOpen },
];

// Grouped under "Tools" dropdown
const toolsNav = [
  { path: "/setup-guide", label: "Setup Guide", icon: Wrench, desc: "Interactive parameter guide" },
  { path: "/problem-solver", label: "Problem Solver", icon: Zap, desc: "Fix handling issues fast" },
  { path: "/tuning-guide", label: "Tuning Guide", icon: BookOpen, desc: "Deep-dive tuning articles" },
  { path: "/methodology", label: "Methodology", icon: FlaskConical, desc: "Step-by-step setup process" },
  { path: "/telemetry", label: "Telemetry Import", icon: Activity, desc: "Upload & analyze lap data" },
  { path: "/pit-board", label: "Pit Board", icon: Flag, desc: "Live race dashboard" },
  { path: "/learning-path", label: "Learning Path", icon: GraduationCap, desc: "Beginner to advanced guide" },
];

function ToolsDropdown({ location }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = toolsNav.some(t => location.pathname === t.path);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }`}
      >
        <Gauge className="w-3.5 h-3.5" />
        Tools
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div         className="absolute top-full left-0 mt-2 w-56 rounded-xl glass-strong shadow-2xl overflow-hidden z-50">
          {toolsNav.map(({ path, label, icon: Icon, desc }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 px-4 py-3 transition-colors duration-150 ${
                  active ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className={`text-xs font-semibold ${active ? "text-primary" : "text-foreground"}`}>{label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = THEMES.find(t => t.id === theme) || THEMES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        aria-label="Select theme"
      >
        <span className="w-3 h-3 rounded-full ring-1 ring-white/10" style={{ backgroundColor: current.color }} />
        <span>{current.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 w-40 rounded-xl glass-strong shadow-2xl overflow-hidden z-50">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                theme === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-white/10" style={{ backgroundColor: t.color }} />
              {t.label}
              {theme === t.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, navigateToLogin, deleteAccount } = useAuth();
  const { theme, setTheme, mode, toggleMode, isDark } = useTheme();

  const allMobileNav = [...primaryNav, ...toolsNav];

  return (
    <nav className="sticky top-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-foreground/8" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0 mr-2" onClick={() => setMobileOpen(false)}>
          <img src={LOGO_URL} alt="SimSetApp" className="h-8 w-auto" />
        </Link>

        {/* Desktop primary nav */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {primaryNav.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <ToolsDropdown location={location} />
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
          <ThemeDropdown />

          {theme === 'liquid' && (
            <button
              onClick={toggleMode}
              className="flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
              aria-label="Toggle light/dark"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Instagram */}
          <a
            href="https://www.instagram.com/simsetapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Support button with glow */}
          <Link
            to="/support"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            Support
          </Link>

          {/* Auth */}
          <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${location.pathname === "/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                >
                  <UserCircle className="w-3.5 h-3.5" /> Profile
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently deletes your account and all saved setups. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={deleteAccount}>
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <button
                onClick={navigateToLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden ml-auto">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-0.5">
            {allMobileNav.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border mt-1">
              <p className="px-3 py-1 text-xs text-muted-foreground font-medium flex items-center gap-1.5"><Palette className="w-3.5 h-3.5" /> Theme</p>
              <div className="grid grid-cols-3 gap-1 px-2 pb-1">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setMobileOpen(false); }}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-[10px] font-medium transition-all ${
                      theme === t.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full ring-1 ring-white/10" style={{ backgroundColor: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>
              {theme === 'liquid' && (
                <button
                  onClick={() => toggleMode()}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Switch to Light" : "Switch to Dark"}
                </button>
              )}
            </div>
            <div className="pt-2 border-t border-border mt-1 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <UserCircle className="w-4 h-4" /> Edit Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently deletes your account and all saved setups. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={deleteAccount}>
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              ) : (
                <button
                  onClick={() => { navigateToLogin(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground"
                >
                  <LogIn className="w-4 h-4" /> Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}