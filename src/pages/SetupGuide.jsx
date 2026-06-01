import { useState } from "react";
import Navbar from "../components/Navbar";
import CarSelector from "../components/CarSelector";
import SetupCategorySection from "../components/SetupCategorySection";
import TrackTips from "../components/TrackTips";
import { SETUP_PARAMETERS } from "../lib/simData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, MapPin, Car, Thermometer, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TyreAnalyzer from "../components/TyreAnalyzer";

export default function SetupGuide() {
  const [sim, setSim] = useState("");
  const [car, setCar] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
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
        <Tabs defaultValue="parameters" className="space-y-6">
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

          <TabsContent value="parameters" className="space-y-4">
            {SETUP_PARAMETERS.map((cat, idx) => (
              <SetupCategorySection key={cat.category} category={cat} index={idx} />
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
    </div>
  );
}