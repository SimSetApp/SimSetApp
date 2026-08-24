import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { base44 } from "@/api/base44Client";
import { SIM_TITLES, CAR_LISTS, TRACK_LISTS, SIM_SETUP_PARAMS, TRACK_TIPS, BASELINE_SETUPS } from "../lib/simData";
import SearchableSelect from "../components/SearchableSelect";
import DrivingStyleSelector from "../components/DrivingStyleSelector";
import SetupValidator from "../components/SetupValidator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Car, MapPin, Cloud, Zap, ChevronRight, ChevronLeft, Loader2, RotateCcw, Save, AlertTriangle, CheckCircle2, Thermometer, Wind } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

const TRACK_CONDITIONS = ["Green", "Rubbered In", "Damp", "Wet", "Drying"];
const WEATHER_OPTIONS = ["Sunny", "Partly Cloudy", "Overcast", "Light Rain", "Heavy Rain", "Variable / Changing"];

const HANDLING_ISSUES = [
  { id: "entry_understeer", label: "Understeer on entry", desc: "Car won't turn in" },
  { id: "mid_understeer", label: "Understeer mid-corner", desc: "Pushes wide in the middle" },
  { id: "exit_understeer", label: "Understeer on exit", desc: "Pushes wide under power" },
  { id: "entry_oversteer", label: "Oversteer on entry", desc: "Rear steps out on braking" },
  { id: "snap_oversteer", label: "Snap oversteer on exit", desc: "Rear suddenly lets go" },
  { id: "traction", label: "Poor traction on exit", desc: "Wheelspin, can't put power down" },
  { id: "high_speed_nervous", label: "Nervous at high speed", desc: "Unstable in fast corners" },
  { id: "kerb_harsh", label: "Harsh over kerbs", desc: "Bounces, loses composure" },
  { id: "brake_lockup", label: "Front brake lockup", desc: "Fronts lock under braking" },
  { id: "tyre_overheating", label: "Tyres overheating", desc: "Pressures climb too high" },
];

const STEPS = [
  { id: "car", label: "Car & Track", icon: Car },
  { id: "conditions", label: "Conditions", icon: Cloud },
  { id: "style", label: "Driving Style", icon: Zap },
  { id: "issues", label: "Issues", icon: AlertTriangle },
  { id: "result", label: "Your Setup", icon: Sparkles },
];

export default function SetupWizard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(0);
  const [sim, setSim] = useState("");
  const [car, setCar] = useState("");
  const [track, setTrack] = useState("");
  const [trackTemp, setTrackTemp] = useState(28);
  const [ambientTemp, setAmbientTemp] = useState(22);
  const [trackCondition, setTrackCondition] = useState("Rubbered In");
  const [weather, setWeather] = useState("Sunny");
  const [humidity, setHumidity] = useState(50);
  const [drivingStyle, setDrivingStyle] = useState("Smooth & Consistent");
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const cars = useMemo(() => {
    if (!sim || !CAR_LISTS[sim]) return [];
    return Object.values(CAR_LISTS[sim]).flat().sort();
  }, [sim]);

  const tracks = useMemo(() => {
    if (!sim || !TRACK_LISTS[sim]) return [];
    return [...TRACK_LISTS[sim]].sort();
  }, [sim]);

  const trackTip = useMemo(() => {
    if (!track) return null;
    return TRACK_TIPS[track] || Object.values(TRACK_TIPS).find(t => track.includes(t.character?.split(",")[0]));
  }, [track]);

  const paramGroups = useMemo(() => (sim && SIM_SETUP_PARAMS[sim]) || [], [sim]);

  const toggleIssue = (id) => {
    setSelectedIssues(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const canProceed = () => {
    if (step === 0) return sim && car;
    return true;
  };

  const generateSetup = async () => {
    setGenerating(true);
    setResult(null);

    const issueLabels = selectedIssues.map(id => HANDLING_ISSUES.find(i => i.id === id)?.label).filter(Boolean);
    const trackInfo = trackTip ? `Track character: ${trackTip.character}. Track tip: ${trackTip.tips}` : "";
    const baselineInfo = Object.entries(BASELINE_SETUPS).map(([k, v]) => `${k}: ${JSON.stringify(v.params)}`).join("\n");
    const paramSchema = paramGroups.map(g => `${g.group}: ${g.params.map(p => `${p.key}(${p.label}, ${p.min}-${p.max}${p.unit})`).join(", ")}`).join("\n");

    const prompt = `You are an expert sim racing setup engineer. Generate a complete, optimized setup for the following conditions. Return ONLY a JSON object.

SIM: ${sim}
CAR: ${car}
TRACK: ${track || "generic"}
WEATHER: ${weather}, ${trackCondition} track
TRACK TEMP: ${trackTemp}°C, AMBIENT: ${ambientTemp}°C, HUMIDITY: ${humidity}%
DRIVING STYLE: ${drivingStyle}
HANDLING ISSUES TO FIX: ${issueLabels.length ? issueLabels.join(", ") : "None — balanced baseline"}
${trackInfo}

AVAILABLE PARAMETERS AND RANGES:
${paramSchema}

REFERENCE BASELINE SETUPS (for similar cars):
${baselineInfo}

Generate a setup that addresses the conditions and issues. For each parameter, provide a value within its valid range. Also provide:
- "reasoning": a brief explanation of the key changes and why (2-3 paragraphs)
- "priorityChanges": an array of the 3-5 most impactful changes with "parameter", "value", and "why" fields
- "weatherNotes": specific notes about how the weather/track conditions influenced the setup
- "styleNotes": how the driving style influenced the setup

Return a JSON object with all parameter keys from the schema above, plus "reasoning", "priorityChanges", "weatherNotes", and "styleNotes".`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: "claude_sonnet_4_6",
        response_json_schema: {
          type: "object",
          properties: {
            ...Object.fromEntries(paramGroups.flatMap(g => g.params.map(p => [p.key, { type: "number" }]))),
            reasoning: { type: "string" },
            priorityChanges: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  parameter: { type: "string" },
                  value: { type: "string" },
                  why: { type: "string" },
                },
              },
            },
            weatherNotes: { type: "string" },
            styleNotes: { type: "string" },
          },
        },
      });

      setResult(response);
      setStep(4);
    } catch (err) {
      toast.error("Failed to generate setup: " + (err.message || "Unknown error"));
    } finally {
      setGenerating(false);
    }
  };

  const saveSetup = async () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save setups to your garage");
      return;
    }
    try {
      const params = { ...result };
      delete params.reasoning;
      delete params.priorityChanges;
      delete params.weatherNotes;
      delete params.styleNotes;

      await base44.entities.SavedSetup.create({
        title: `AI Setup — ${car} @ ${track || "Generic"}`,
        sim_title: sim,
        car,
        track: track || "",
        parameters: params,
        notes: `AI-generated setup (${drivingStyle}, ${weather}, ${trackCondition})\n\nReasoning: ${result.reasoning}`,
      });
      toast.success("Setup saved to your garage!");
      navigate("/saved-setups");
    } catch (err) {
      toast.error("Failed to save: " + err.message);
    }
  };

  const reset = () => {
    setStep(0);
    setSim("");
    setCar("");
    setTrack("");
    setSelectedIssues([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Setup Wizard" />
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-2xl font-bold tracking-tight">AI Setup Wizard</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Tell us your car, conditions, and issues — get a complete AI-generated setup with reasoning.
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === i;
            const done = step > i;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active ? "bg-primary/15 text-primary border border-primary/30" :
                    done ? "bg-primary/5 text-primary/70" :
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Step 0: Car & Track */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-sm font-bold tracking-wide">Select Your Car & Track</h3>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Sim</label>
                <select
                  value={sim}
                  onChange={e => { setSim(e.target.value); setCar(""); setTrack(""); }}
                  className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Select a sim…</option>
                  {SIM_TITLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Car</label>
                <SearchableSelect
                  value={car}
                  onValueChange={setCar}
                  placeholder={sim ? "Search cars…" : "Select sim first"}
                  disabled={!sim}
                  items={cars}
                  searchPlaceholder="Search cars…"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Track (optional but recommended)</label>
                <SearchableSelect
                  value={track}
                  onValueChange={setTrack}
                  placeholder={sim ? "Search tracks…" : "Select sim first"}
                  disabled={!sim}
                  items={tracks}
                  searchPlaceholder="Search tracks…"
                />
              </div>
              {trackTip && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">{trackTip.character}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{trackTip.tips}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Wing: {trackTip.wing}</Badge>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!canProceed()} className="font-heading text-xs tracking-wider">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Conditions */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-sm font-bold tracking-wide">Weather & Track Conditions</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Weather</label>
                  <select value={weather} onChange={e => setWeather(e.target.value)} className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                    {WEATHER_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Track Condition</label>
                  <select value={trackCondition} onChange={e => setTrackCondition(e.target.value)} className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                    {TRACK_CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Track Temp (°C)</label>
                  <input type="number" value={trackTemp} onChange={e => setTrackTemp(+e.target.value)} className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Wind className="w-3 h-3" /> Ambient (°C)</label>
                  <input type="number" value={ambientTemp} onChange={e => setAmbientTemp(+e.target.value)} className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Humidity (%)</label>
                  <input type="number" value={humidity} onChange={e => setHumidity(+e.target.value)} className="w-full h-9 rounded-lg border border-border bg-secondary text-sm px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {weather.includes("Rain") || trackCondition === "Wet" || trackCondition === "Damp"
                    ? "🌧️ Wet conditions detected — the AI will recommend wet tyres, higher brake bias, and more conservative settings."
                    : trackTemp > 35
                    ? "🔥 Hot track — the AI will recommend harder compounds and more brake cooling."
                    : trackTemp < 15
                    ? "❄️ Cold track — the AI will recommend softer compounds and lower starting pressures."
                    : "✅ Conditions look standard — the AI will generate a balanced baseline."}
                </p>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)} className="font-heading text-xs tracking-wider">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(2)} className="font-heading text-xs tracking-wider">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Driving Style */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-sm font-bold tracking-wide">Your Driving Style</h3>
              </div>
              <p className="text-xs text-muted-foreground">This helps the AI tailor the setup to how you actually drive.</p>
              <DrivingStyleSelector value={drivingStyle} onChange={setDrivingStyle} />
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="font-heading text-xs tracking-wider">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={() => setStep(3)} className="font-heading text-xs tracking-wider">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Issues */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="font-heading text-sm font-bold tracking-wide">Handling Issues (Optional)</h3>
              </div>
              <p className="text-xs text-muted-foreground">Select any issues you're experiencing. The AI will prioritize fixing these.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HANDLING_ISSUES.map(issue => {
                  const active = selectedIssues.includes(issue.id);
                  return (
                    <button
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        active ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}>{issue.label}</div>
                        <div className="text-xs text-muted-foreground">{issue.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="font-heading text-xs tracking-wider">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button onClick={generateSetup} disabled={generating} className="font-heading text-xs tracking-wider">
                {generating ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4 mr-1.5" /> Generate Setup</>}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && result && (
          <div className="space-y-5">
            {generating && (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Generating your setup…</p>
                <p className="text-xs text-muted-foreground mt-1">Analyzing conditions, driving style, and handling issues</p>
              </div>
            )}

            {result && !generating && (
              <>
                {/* Summary card */}
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-heading text-base font-bold">Your AI-Generated Setup</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">{sim}</Badge>
                    <Badge variant="outline" className="text-xs">{car}</Badge>
                    {track && <Badge variant="outline" className="text-xs">{track}</Badge>}
                    <Badge variant="outline" className="text-xs">{drivingStyle}</Badge>
                    <Badge variant="outline" className="text-xs">{weather}, {trackCondition}</Badge>
                  </div>

                  {/* Priority changes */}
                  {result.priorityChanges?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Priority Changes</h4>
                      {result.priorityChanges.map((change, i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold shrink-0">{i + 1}</span>
                            <span className="text-sm font-medium">{change.parameter}</span>
                            <Badge variant="outline" className="text-xs ml-auto">{change.value}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground ml-7">{change.why}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                {result.reasoning && (
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h4 className="font-heading text-sm font-bold tracking-wide mb-2">Setup Reasoning</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
                  </div>
                )}

                {/* Weather & Style notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.weatherNotes && (
                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Cloud className="w-4 h-4 text-sky-400" />
                        <h4 className="text-xs font-bold tracking-wide text-sky-400">Weather Adaptation</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{result.weatherNotes}</p>
                    </div>
                  )}
                  {result.styleNotes && (
                    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Zap className="w-4 h-4 text-violet-400" />
                        <h4 className="text-xs font-bold tracking-wide text-violet-400">Style Adaptation</h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{result.styleNotes}</p>
                    </div>
                  )}
                </div>

                {/* Full parameter values — grouped by category */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h4 className="font-heading text-sm font-bold tracking-wide mb-3">Full Parameter Values</h4>
                  <div className="space-y-4">
                    {paramGroups.map(group => {
                      const filled = group.params.filter(p => result[p.key] !== undefined && result[p.key] !== null);
                      if (filled.length === 0) return null;
                      return (
                        <div key={group.group}>
                          <h5 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">{group.group}</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {filled.map(p => {
                              const val = result[p.key];
                              return (
                                <div key={p.key} className="rounded-lg border border-border bg-secondary/50 p-2">
                                  <div className="text-[10px] text-muted-foreground truncate">{p.label}</div>
                                  <div className="text-sm font-mono font-semibold tabular-nums">
                                    {typeof val === "number" && val % 1 !== 0 ? val.toFixed(2) : val}{p.unit}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Validation */}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h4 className="font-heading text-sm font-bold tracking-wide mb-3">Setup Validation</h4>
                  <SetupValidator sim={sim} parameters={result} carClass="GT3" />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={saveSetup} className="flex-1 font-heading text-xs tracking-wider">
                    <Save className="w-4 h-4 mr-1.5" /> Save to Garage
                  </Button>
                  <Button variant="outline" onClick={reset} className="font-heading text-xs tracking-wider">
                    <RotateCcw className="w-4 h-4 mr-1.5" /> New Setup
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}