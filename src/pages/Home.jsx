import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, ArrowRight, SlidersHorizontal, MapPin, Gauge, Bot, Zap, Wrench, Users, Instagram, Sparkles, Flag, Activity, GraduationCap, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CAR_LISTS } from "../lib/simData";
import { useAuth } from "@/lib/AuthContext";
import { Navigate } from "react-router-dom";

const HERO_IMG = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/cfbbac601_generated_image.png";
const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";

const simStats = Object.entries(CAR_LISTS).map(([name, groups]) => ({
  name,
  cars: Object.values(groups).reduce((s, c) => s + c.length, 0),
  classes: Object.keys(groups).length,
}));

const FEATURES = [
  { icon: Sparkles, title: "AI Setup Wizard", desc: "Tell us your car, track, weather & issues — get a complete AI-generated setup with reasoning.", href: "/setup-wizard", badge: "NEW" },
  { icon: Activity, title: "Telemetry Import", desc: "Upload MoTeC or Garage 61 CSV exports. See lap consistency and correlate with your setups.", href: "/telemetry", badge: "NEW" },
  { icon: Flag, title: "Pit Board Race Mode", desc: "Live race dashboard — track fuel, tyres, and pit windows with big glanceable targets.", href: "/pit-board", badge: "NEW" },
  { icon: GraduationCap, title: "Learning Path", desc: "Progress from beginner to advanced — one concept at a time, with tracked progress.", href: "/learning-path", badge: "NEW" },
  { icon: SlidersHorizontal, title: "Setup Guide", desc: "Every parameter explained — from tyre pressures to differential preload.", href: "/setup-guide" },
  { icon: Gauge, title: "Problem Solver", desc: "Describe your handling issue and get targeted setup suggestions to fix it fast.", href: "/problem-solver" },
  { icon: Bot, title: "AI Race Engineer", desc: "Chat with an AI race engineer about any handling problem — get specific advice.", href: "/race-engineer" },
  { icon: FolderOpen, title: "My Garage", desc: "Save your setups with notes, session logs, QR sharing, and tyre wear prediction.", href: "/saved-setups" },
  { icon: Users, title: "Community Library", desc: "Browse and share setups. Smart matching, pro badges, discussions, and ratings.", href: "/community-library" },
];

export default function Home() {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (!isLoadingAuth && isAuthenticated) return <Navigate to="/dashboard" replace />;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Sim racing car on track" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-2xl">
            <img src={LOGO_URL} alt="SimSetApp — Sim Racing Setup Tool" className="h-24 sm:h-32 w-auto mb-6" />
            <h1 className="sr-only">SimSetApp — Sim Racing Setup Guide, AI Race Engineer &amp; Community Setups</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              The complete sim racing setup companion. Understand every parameter,
              get AI-powered race engineer advice, and save your best setups for iRacing, ACC, Assetto Corsa, GT7 &amp; more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-heading text-sm tracking-wider">
                <Link to="/setup-wizard">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Setup Wizard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading text-sm tracking-wider border-border hover:border-primary/40">
                <Link to="/race-engineer">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Race Engineer
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-32 md:pb-24 space-y-20">

        {/* AI Race Engineer Highlight */}
        <div className="-mt-16 relative z-10">
          <Link
            to="/race-engineer"
            className="group block rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-colors"
          >
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Bot className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
                    <Zap className="w-3 h-3" /> Headline Feature
                  </span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight">AI Race Engineer for Sim Racing</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
                  Describe your handling problem and get instant, specific setup changes — understeer, snap oversteer, tyre overheating, braking instability and more. Works with iRacing, ACC, Assetto Corsa, GT7 and more.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all flex-shrink-0 whitespace-nowrap">
                Try it now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Supported Sims */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground">Supported Sim Racing Games</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {simStats.map(sim => (
              <Link
                key={sim.name}
                to="/setup-guide"
                className="group rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-heading text-xs font-medium tracking-wide leading-tight">{sim.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div>
                    <div className="text-xl font-semibold tabular-nums">{sim.cars}</div>
                    <div className="text-xs text-muted-foreground">cars</div>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div>
                    <div className="text-xl font-semibold tabular-nums">{sim.classes}</div>
                    <div className="text-xs text-muted-foreground">classes</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground">Sim Racing Setup Tools</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map((f, i) => (
              <Link
                key={i}
                to={f.href}
                className="group relative rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                {f.badge && (
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-semibold tracking-wider">{f.badge}</span>
                )}
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-heading text-sm font-medium">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-heading text-xs font-medium uppercase tracking-wider text-muted-foreground">Community</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <a
          href="https://www.instagram.com/simsetapp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
        >
          <Instagram className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <p className="font-heading text-sm font-medium">Follow us on Instagram</p>
            <p className="text-xs text-muted-foreground mt-0.5">@simsetapp — updates, tips &amp; sim racing community</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors flex-shrink-0" />
        </a>

      </div>
      <Footer />
    </div>
  );
}