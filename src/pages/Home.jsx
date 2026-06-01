import { Link } from "react-router-dom";
import { BookOpen, FolderOpen, ArrowRight, SlidersHorizontal, MapPin, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import { CAR_LISTS } from "../lib/simData";

const HERO_IMG = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/cfbbac601_generated_image.png";
const LOGO_URL = "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/c3005a416_SimSetAppSimRacingLogo2.png";

const simStats = Object.entries(CAR_LISTS).map(([name, groups]) => ({
  name,
  cars: Object.values(groups).reduce((s, c) => s + c.length, 0),
  classes: Object.keys(groups).length,
}));

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30" />
          {/* subtle green glow */}
          <div className="absolute bottom-0 left-0 w-1/2 h-64 bg-primary/5 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="max-w-2xl">
            <div className="mb-6">
              <img src={LOGO_URL} alt="SimSetApp" className="h-20 sm:h-24 w-auto drop-shadow-lg" />
            </div>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              The racing engineer in your pocket. Understand every setup parameter,
              browse real car lists from the biggest sims, and save your winning setups.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-heading text-sm tracking-wider shadow-lg shadow-primary/20">
                <Link to="/setup-guide">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Setup Guide
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading text-sm tracking-wider border-border/60 hover:border-primary/40">
                <Link to="/saved-setups">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  My Garage
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sim Stats */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          <h2 className="font-heading text-xs font-semibold tracking-widest uppercase text-muted-foreground">Supported Sims</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-primary/30 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {simStats.map(sim => (
            <Link
              key={sim.name}
              to="/setup-guide"
              className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-heading text-sm font-semibold tracking-wide">{sim.name}</h3>
              <div className="mt-3 flex items-center gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary tabular-nums">{sim.cars}</div>
                  <div className="text-xs text-muted-foreground">cars</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <div className="text-2xl font-bold tabular-nums">{sim.classes}</div>
                  <div className="text-xs text-muted-foreground">classes</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Browse cars <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: SlidersHorizontal,
              title: "Every Parameter Explained",
              desc: "From tyre pressures to differential preload — understand what each change does to your car's behavior.",
              accent: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: MapPin,
              title: "Track-Specific Tips",
              desc: "Quick recommendations for popular circuits — wing levels, brake cooling, and what to focus on.",
              accent: "text-chart-2",
              bg: "bg-chart-2/10",
            },
            {
              icon: Gauge,
              title: "Save Your Setups",
              desc: "Keep a garage of your winning setups with notes, so you're never starting from scratch.",
              accent: "text-chart-3",
              bg: "bg-chart-3/10",
            },
          ].map((f, i) => (
            <div key={i} className="relative rounded-2xl border border-border bg-card p-6 overflow-hidden group hover:border-border/80 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/20" />
              <div className={`relative w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.accent}`} />
              </div>
              <h3 className="relative font-heading text-sm font-semibold tracking-wide">{f.title}</h3>
              <p className="relative text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}