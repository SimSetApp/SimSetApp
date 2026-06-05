import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, ArrowRight, SlidersHorizontal, MapPin, Gauge, Bot, Zap, Wrench, Users, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CAR_LISTS } from "../lib/simData";

const HERO_IMG = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/cfbbac601_generated_image.png";
const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";

const simStats = Object.entries(CAR_LISTS).map(([name, groups]) => ({
  name,
  cars: Object.values(groups).reduce((s, c) => s + c.length, 0),
  classes: Object.keys(groups).length,
}));

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Every Parameter Explained",
    desc: "From tyre pressures to differential preload — understand what each change does to your car.",
    accent: "text-primary",
    bg: "bg-primary/10",
    href: "/setup-guide",
  },
  {
    icon: MapPin,
    title: "Track-Specific Tips",
    desc: "Wing levels, brake cooling, and key focus areas for popular circuits across all sims.",
    accent: "text-chart-2",
    bg: "bg-chart-2/10",
    href: "/setup-guide?tab=tracks",
  },
  {
    icon: Gauge,
    title: "Problem Solver",
    desc: "Describe your handling issue and get targeted setup suggestions to fix it fast.",
    accent: "text-chart-3",
    bg: "bg-chart-3/10",
    href: "/problem-solver",
  },
  {
    icon: FolderOpen,
    title: "My Garage",
    desc: "Save your setups with notes and session logs so you're never starting from scratch.",
    accent: "text-chart-4",
    bg: "bg-chart-4/10",
    href: "/saved-setups",
  },
  {
    icon: BookOpen,
    title: "Setup Methodology",
    desc: "A structured approach to building a setup from the ground up, one step at a time.",
    accent: "text-chart-5",
    bg: "bg-chart-5/10",
    href: "/methodology",
  },
  {
    icon: Wrench,
    title: "Tuning Guide",
    desc: "Deep-dive reference for every tunable element — suspension geometry, aero, diff and more.",
    accent: "text-primary",
    bg: "bg-primary/10",
    href: "/tuning-guide",
  },
  {
    icon: Users,
    title: "Community Library",
    desc: "Browse and share setups from the community. Rate, download, and improve your lap times.",
    accent: "text-chart-1",
    bg: "bg-chart-1/10",
    href: "/community-library",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Sim racing car on track" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          <div className="absolute bottom-0 left-0 w-2/3 h-72 bg-primary/5 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-2xl">
            <img src={LOGO_URL} alt="SimSetApp — Sim Racing Setup Tool" className="h-24 sm:h-32 w-auto mb-6" style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,0.35)) drop-shadow(0 0 40px rgba(255,255,255,0.15))" }} />
            <h1 className="sr-only">SimSetApp — Sim Racing Setup Guide, AI Race Engineer &amp; Community Setups</h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              The complete sim racing setup companion. Understand every parameter,
              get AI-powered race engineer advice, and save your best setups for iRacing, ACC, Assetto Corsa, GT7 &amp; more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-heading text-sm tracking-wider shadow-lg shadow-primary/20">
                <Link to="/race-engineer">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Race Engineer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading text-sm tracking-wider border-border/60 hover:border-primary/40">
                <Link to="/setup-guide">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Setup Guide
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
            className="group block rounded-2xl border border-primary/40 bg-card overflow-hidden hover:border-primary/70 transition-all duration-300 shadow-xl shadow-black/30"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold tracking-wider uppercase">
                    <Zap className="w-3 h-3" /> Headline Feature
                  </span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold">AI Race Engineer for Sim Racing</h2>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-2xl">
                  Describe your handling problem and get instant, specific setup changes — understeer, snap oversteer, tyre overheating, braking instability and more. Works with iRacing, ACC, Assetto Corsa, GT7 and more.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-semibold group-hover:gap-3 transition-all flex-shrink-0 whitespace-nowrap">
                Try it now <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Supported Sims */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            <h2 className="font-heading text-xs font-semibold tracking-widest uppercase text-muted-foreground">Supported Sim Racing Games</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {simStats.map(sim => (
              <Link
                key={sim.name}
                to="/setup-guide"
                className="group relative rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-heading text-xs font-semibold tracking-wide leading-tight">{sim.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <div>
                    <div className="text-xl font-bold text-primary tabular-nums">{sim.cars}</div>
                    <div className="text-xs text-muted-foreground">cars</div>
                  </div>
                  <div className="w-px h-7 bg-border" />
                  <div>
                    <div className="text-xl font-bold tabular-nums">{sim.classes}</div>
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
            <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
            <h2 className="font-heading text-xs font-semibold tracking-widest uppercase text-muted-foreground">Sim Racing Setup Tools</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Link
                key={i}
                to={f.href}
                className="group relative rounded-xl border border-border bg-card p-5 hover:border-border/80 hover:bg-secondary/30 transition-all duration-200 overflow-hidden"
              >
                <div className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}>
                  <f.icon className={`w-4.5 h-4.5 ${f.accent}`} />
                </div>
                <h3 className="font-heading text-sm font-semibold">{f.title}</h3>
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
          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          <h2 className="font-heading text-xs font-semibold tracking-widest uppercase text-muted-foreground">Community</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
        </div>
        <a
          href="https://www.instagram.com/simsetapp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-4 rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-secondary/30 transition-all duration-200 group"
        >
          <Instagram className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
          <div>
            <p className="font-heading text-sm font-semibold">Follow us on Instagram</p>
            <p className="text-xs text-muted-foreground mt-0.5">@simsetapp — updates, tips &amp; sim racing community</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto transition-colors flex-shrink-0" />
        </a>

      </div>
      <Footer />
    </div>
  );
}