import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import CarSelector from "../components/CarSelector";
import SetupCategorySection from "../components/SetupCategorySection";
import TrackTips from "../components/TrackTips";
import SmartSetupMatch from "../components/SmartSetupMatch";
import { SETUP_PARAMETERS } from "../lib/simData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MapPin, Car, Thermometer, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TyreAnalyzer from "../components/TyreAnalyzer";

export default function SetupGuide() {
  const [sim, setSim] = useState("");
  const [car, setCar] = useState("");
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get("tab") || "parameters";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Setup Guide" />
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Setup Guide
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Pick your sim and car, then explore every setup parameter.
          </p>
        </div>

        {/* Car selector */}
        <div className="rounded-2xl border border-border bg-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Car className="w-4 h-4 text-primary" />
            <span className="font-heading text-xs font-bold tracking-widest uppercase text-muted-foreground">
              Your Car
            </span>
          </div>
          <CarSelector sim={sim} setSim={setSim} car={car} setCar={setCar} />
          {car && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium">
                <span className="text-primary">{car}</span>
                <span className="text-muted-foreground"> on </span>
                <span>{sim}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Setup tips below apply to most cars — fine-tune for your specific model.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="parameters" className="font-heading text-xs tracking-wider">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              Parameters
            </TabsTrigger>
            <TabsTrigger value="tracks" className="font-heading text-xs tracking-wider">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Track Tips
            </TabsTrigger>
            <TabsTrigger value="tyre-analyzer" className="font-heading text-xs tracking-wider">
              <Thermometer className="w-3.5 h-3.5 mr-1.5" />
              Tyre Temps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-3">
            {/* Smart Setup Match */}
            <SmartSetupMatch />

            {/* AI Wizard CTA */}
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-sm font-bold">Want a complete setup generated for you?</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Try the AI Setup Wizard — car, track, weather & issues → full setup with reasoning.</p>
              </div>
              <button
                onClick={() => navigate("/setup-wizard")}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-heading tracking-wider hover:bg-primary/90 transition-colors shrink-0"
              >
                Open
              </button>
            </div>

            {/* Parameter categories */}
            {SETUP_PARAMETERS.map((cat, idx) => (
              <div key={cat.category} id={`category-${idx}`}>
                <SetupCategorySection category={cat} index={idx} defaultOpen={idx === 0} />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tracks">
            <TrackTips />
          </TabsContent>

          <TabsContent value="tyre-analyzer">
            <div className="rounded-2xl border border-border bg-card p-5">
              <TyreAnalyzer />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}