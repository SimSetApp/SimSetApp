import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Wrench, AlertCircle } from "lucide-react";

export default function TelemetrySetupSuggestions({ telemetry, setup }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!telemetry || !setup) return null;

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const first5 = telemetry.laps.slice(0, 5).map(l => l.time.toFixed(3)).join(", ");
      const last5 = telemetry.laps.slice(-5).map(l => l.time.toFixed(3)).join(", ");
      const allTemps = telemetry.laps.flatMap(l => l.temps || []);
      const tempSummary = allTemps.length
        ? allTemps.slice(0, 24).map(t => `${t.key}=${t.value}`).join(", ")
        : "none available";

      const prompt = `You are an expert sim racing race engineer. Analyse the lap-time telemetry and the driver's current setup, then recommend specific setup changes to improve lap time and consistency.

Context:
- Sim: ${setup.sim_title}
- Car: ${setup.car}
- Track: ${setup.track || "unknown"}

Telemetry summary:
- Best lap: ${telemetry.bestLap.toFixed(3)}s
- Average lap: ${telemetry.avgLap.toFixed(3)}s
- Consistency (std dev): ${telemetry.consistency.toFixed(3)}s
- Total laps: ${telemetry.totalLaps}
- First 5 laps (s): ${first5}
- Last 5 laps (s): ${last5}
- Tyre temps / pressures in file: ${tempSummary}

Current setup parameters (JSON):
${JSON.stringify(setup.parameters, null, 2)}

Instructions:
- Infer likely handling issues from the telemetry (e.g. lap-time drop-off = tyre deg/overheating; high variance = instability; slow first laps = warm-up issues).
- Recommend 3 to 6 specific, actionable changes. Prefer parameters that exist in the current setup keys when relevant.
- For each: parameter name, current value (if known), recommended value, a short reason tied to the telemetry, and expected impact.
- Be concise and concrete. Do not invent telemetry that isn't provided.`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  parameter: { type: "string" },
                  current: { type: "string" },
                  recommended: { type: "string" },
                  reason: { type: "string" },
                  impact: { type: "string" },
                },
                required: ["parameter", "recommended", "reason"],
              },
            },
          },
          required: ["suggestions"],
        },
      });
      setResult(res);
    } catch (e) {
      setResult({ error: e?.message || "Failed to generate suggestions." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold tracking-wide">AI Setup Suggestions from Telemetry</h3>
            <p className="text-xs text-muted-foreground">Analyses your lap data against “{setup.title}” and recommends changes.</p>
          </div>
        </div>
        <Button size="sm" onClick={generate} disabled={loading} className="font-heading text-xs tracking-wider">
          {loading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
          {loading ? "Analysing…" : "Suggest Changes"}
        </Button>
      </div>

      {result?.error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5" /> {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="space-y-3">
          {result.summary && (
            <p className="text-xs text-muted-foreground leading-relaxed">{result.summary}</p>
          )}
          {result.suggestions?.map((s, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-card/70 p-3">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold">{s.parameter}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {s.current && <span className="text-muted-foreground">{s.current}</span>}
                  {s.current && <span className="text-muted-foreground">→</span>}
                  <span className="text-primary font-semibold">{s.recommended}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
              {s.impact && (
                <Badge variant="outline" className="mt-2 text-[10px] border-primary/30 text-primary">{s.impact}</Badge>
              )}
            </div>
          ))}
          {(!result.suggestions || result.suggestions.length === 0) && (
            <p className="text-xs text-muted-foreground">No specific changes suggested. Try refining your telemetry import.</p>
          )}
        </div>
      )}
    </div>
  );
}