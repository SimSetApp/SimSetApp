import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Trash2, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/setup-guide", label: "Setup Guide" },
  { path: "/problem-solver", label: "Problem Solver" },
  { path: "/tuning-guide", label: "Tuning Guide" },
  { path: "/methodology", label: "Methodology" },
  { path: "/race-engineer", label: "Race Engineer" },
  { path: "/saved-setups", label: "My Garage" },
  { path: "/community-library", label: "Community" },
  { path: "/support", label: "❤ Support" },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout, navigateToLogin, deleteAccount } = useAuth();
  const { isDark, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center flex-shrink-0" onClick={() => setMobileOpen(false)}>
          <img src={LOGO_URL} alt="SimSetApp" className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navItems.map(({ path, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Theme toggle - desktop */}
        <button
          onClick={toggle}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Auth button - desktop */}
        <div className="hidden md:flex items-center gap-1 ml-2 border-l border-border pl-2">
          {isAuthenticated ? (
            <>
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
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={deleteAccount}
                    >
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-0.5">
            {navItems.map(({ path, label }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-border mt-1">
              <button
                onClick={toggle}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <div className="pt-2 border-t border-border mt-1 space-y-1">
              {isAuthenticated ? (
                <>
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
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={deleteAccount}
                        >
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