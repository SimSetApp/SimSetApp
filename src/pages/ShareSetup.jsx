import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SIM_SETUP_PARAMS } from "../lib/simData";
import { Save, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";

function decodeSetup() {
  const params = new URLSearchParams(window.location.search);
  const s = params.get("s");
  if (!s) return null;
  try {
    return JSON.parse(atob(s));
  } catch {
    return null;
  }
}

export default function ShareSetup() {
  const setup = useMemo(() => decodeSetup(), []);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState({});

  const save = useMutation({
    mutationFn: () =>
      base44.entities.SavedSetup.create({
        title: setup.title,
        sim_title: setup.sim_title,
        car: setup.car,
        track: setup.track,
        notes: setup.notes,
        parameters: setup.parameters,
      }),
    onSuccess: () => setSaved(true),
  });

  if (!setup) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-heading text-xl font-bold mb-2">Invalid Setup Link</h1>
          <p className="text-muted-foreground text-sm">This link appears to be broken or expired.</p>
          <Button asChild className="mt-6"><Link to="/">Go Home</Link></Button>
        </div>
      </div>
    );
  }

  const paramGroups = setup.sim_title ? (SIM_SETUP_PARAMS[setup.sim_title] || []) : [];
  const paramMap = Object.fromEntries(
    paramGroups.flatMap(g => g.params.map(p => [p.key, p]))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase mb-1">Shared Setup</p>
              <h1 className="font-heading text-2xl font-bold">{setup.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3">
                {setup.sim_title && <Badge variant="secondary">{setup.sim_title}</Badge>}
                {setup.car && <Badge variant="outline">{setup.car}</Badge>}
                {setup.track && <Badge variant="outline">🏁 {setup.track}</Badge>}
              </div>
            </div>
            <Button
              onClick={() => save.mutate()}
              disabled={save.isPending || saved}
              className="flex-shrink-0"
            >
              <Save className="w-4 h-4 mr-2" />
              {saved ? "Saved to Garage ✓" : "Save to My Garage"}
            </Button>
          </div>
          {setup.notes && (
            <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4 leading-relaxed">
              {setup.notes}
            </p>
          )}
        </div>

        {/* Parameters */}
        {paramGroups.length > 0 && setup.parameters && Object.keys(setup.parameters).length > 0 && (
          <div className="space-y-3">
            <h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-muted-foreground px-1">Setup Parameters</h2>
            {paramGroups.map((group) => {
              const groupParams = group.params.filter(p => setup.parameters[p.key] !== undefined);
              if (groupParams.length === 0) return null;
              const isOpen = expanded[group.group] !== false;
              return (
                <div key={group.group} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/40 transition-colors"
                    onClick={() => setExpanded(e => ({ ...e, [group.group]: !isOpen }))}
                  >
                    <span className="font-heading text-sm font-semibold">{group.group}</span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {isOpen && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border border-t border-border">
                      {groupParams.map(p => (
                        <div key={p.key} className="bg-card px-4 py-3">
                          <div className="text-xs text-muted-foreground">{p.label}</div>
                          <div className="font-heading text-sm font-semibold mt-0.5">
                            {setup.parameters[p.key]}{p.unit ? ` ${p.unit}` : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pt-2">
          Shared via <Link to="/" className="text-primary hover:underline">SimSetApp</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}