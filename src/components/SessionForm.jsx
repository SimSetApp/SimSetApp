import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Timer, CloudRain, Wrench, FileText } from "lucide-react";
import LapTimesPanel from "./LapTimesPanel";
import PitStrategyPanel from "./PitStrategyPanel";

const SESSION_TYPES = ["Practice", "Qualifying", "Race", "Hot Lap", "Endurance"];
const WEATHER_OPTIONS = ["Sunny", "Partly Cloudy", "Overcast", "Light Rain", "Heavy Rain", "Variable / Changing"];
const TRACK_CONDITIONS = ["Green", "Rubbered In", "Damp", "Wet", "Drying"];
const COMPOUNDS = ["Dry - Hard", "Dry - Medium", "Dry - Soft", "Wet - Inter", "Wet - Full", "Racing Soft", "Racing Hard"];

export default function SessionForm({ setupId, onDone, editSession }) {
  const queryClient = useQueryClient();
  const [sessionType, setSessionType] = useState(editSession?.session_type || "Practice");
  const [date, setDate] = useState(editSession?.date || new Date().toISOString().split("T")[0]);
  const [weather, setWeather] = useState(editSession?.weather || "Sunny");
  const [trackCondition, setTrackCondition] = useState(editSession?.track_condition || "Rubbered In");
  const [trackTemp, setTrackTemp] = useState(editSession?.track_temp || 30);
  const [airTemp, setAirTemp] = useState(editSession?.air_temp || 22);
  const [humidity, setHumidity] = useState(editSession?.humidity || 55);
  const [windSpeed, setWindSpeed] = useState(editSession?.wind_speed || 15);
  const [compound, setCompound] = useState(editSession?.tyre_compound || "Dry - Medium");
  const [fuelStart, setFuelStart] = useState(editSession?.fuel_start || "");
  const [fuelPerLap, setFuelPerLap] = useState(editSession?.fuel_per_lap_actual || "");
  const [gridPos, setGridPos] = useState(editSession?.race_position_start || "");
  const [finishPos, setFinishPos] = useState(editSession?.race_position_finish || "");
  const [incidents, setIncidents] = useState(editSession?.incidents || "");
  const [laps, setLaps] = useState(() => {
    try { return JSON.parse(editSession?.lap_times_json || "[]"); } catch { return []; }
  });
  const [stops, setStops] = useState(() => {
    try { return JSON.parse(editSession?.pit_stops_json || "[]"); } catch { return []; }
  });
  const [notes, setNotes] = useState(editSession?.notes || "");

  const mutation = useMutation({
    mutationFn: (data) => editSession
      ? base44.entities.SessionLog.update(editSession.id, data)
      : base44.entities.SessionLog.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", setupId] });
      onDone();
    }
  });

  const bestLap = (() => {
    const valid = laps.filter(l => l.note !== "Out Lap" && l.note !== "In Lap").map(l => {
      const parts = l.time.split(":");
      return parts.length === 2 ? parseFloat(parts[0]) * 60 + parseFloat(parts[1]) : parseFloat(l.time);
    }).filter(n => !isNaN(n));
    if (!valid.length) return "";
    const best = Math.min(...valid);
    const m = Math.floor(best / 60);
    const s = (best % 60).toFixed(3).padStart(6, "0");
    return `${m}:${s}`;
  })();

  const save = () => {
    mutation.mutate({
      setup_id: setupId,
      session_type: sessionType,
      date,
      weather,
      track_condition: trackCondition,
      track_temp: trackTemp,
      air_temp: airTemp,
      humidity,
      wind_speed: windSpeed,
      tyre_compound: compound,
      fuel_start: fuelStart ? Number(fuelStart) : undefined,
      fuel_per_lap_actual: fuelPerLap ? Number(fuelPerLap) : undefined,
      race_position_start: gridPos ? Number(gridPos) : undefined,
      race_position_finish: finishPos ? Number(finishPos) : undefined,
      incidents: incidents ? Number(incidents) : undefined,
      lap_times_json: JSON.stringify(laps),
      pit_stops_json: JSON.stringify(stops),
      total_laps: laps.length,
      best_lap_time: bestLap,
      notes
    });
  };

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Session Type *</label>
          <Select value={sessionType} onValueChange={setSessionType}>
            <SelectTrigger className="bg-secondary h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{SESSION_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Date</label>
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-secondary h-9" />
        </div>
      </div>

      <Tabs defaultValue="weather">
        <TabsList className="bg-secondary w-full grid grid-cols-4">
          <TabsTrigger value="weather" className="text-xs"><CloudRain className="w-3 h-3 mr-1" />Weather</TabsTrigger>
          <TabsTrigger value="laps" className="text-xs"><Timer className="w-3 h-3 mr-1" />Lap Times</TabsTrigger>
          <TabsTrigger value="pits" className="text-xs"><Wrench className="w-3 h-3 mr-1" />Pit Strategy</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs"><FileText className="w-3 h-3 mr-1" />Notes</TabsTrigger>
        </TabsList>

        {/* Weather Tab */}
        <TabsContent value="weather" className="space-y-4 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Weather</label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="bg-secondary h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{WEATHER_OPTIONS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Track Condition</label>
              <Select value={trackCondition} onValueChange={setTrackCondition}>
                <SelectTrigger className="bg-secondary h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{TRACK_CONDITIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: "Track Temp", value: trackTemp, set: setTrackTemp, min: 5, max: 65, unit: "°C", color: "text-orange-400" },
              { label: "Air Temp", value: airTemp, set: setAirTemp, min: 0, max: 45, unit: "°C", color: "text-blue-400" },
              { label: "Humidity", value: humidity, set: setHumidity, min: 0, max: 100, unit: "%", color: "text-cyan-400" },
              { label: "Wind Speed", value: windSpeed, set: setWindSpeed, min: 0, max: 100, unit: "km/h", color: "text-green-400" },
            ].map(({ label, value, set, min, max, unit, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}{unit}</span>
                </div>
                <Slider value={[value]} onValueChange={([v]) => set(v)} min={min} max={max} step={1} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Lap Times Tab */}
        <TabsContent value="laps" className="pt-3 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Start Tyre Compound</label>
              <Select value={compound} onValueChange={setCompound}>
                <SelectTrigger className="bg-secondary h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{COMPOUNDS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Fuel at Start (L)</label>
              <Input value={fuelStart} onChange={e => setFuelStart(e.target.value)} type="number"
                placeholder="e.g. 110" className="bg-secondary h-9" />
            </div>
          </div>
          {sessionType === "Race" || sessionType === "Endurance" ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Grid Position</label>
                <Input value={gridPos} onChange={e => setGridPos(e.target.value)} type="number"
                  placeholder="e.g. 4" className="bg-secondary h-9" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Finish Position</label>
                <Input value={finishPos} onChange={e => setFinishPos(e.target.value)} type="number"
                  placeholder="e.g. 2" className="bg-secondary h-9" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Incidents / Pen.</label>
                <Input value={incidents} onChange={e => setIncidents(e.target.value)} type="number"
                  placeholder="e.g. 4x" className="bg-secondary h-9" />
              </div>
            </div>
          ) : null}
          <LapTimesPanel laps={laps} onChange={setLaps} />
          {laps.length > 1 && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Actual Fuel / Lap (L)</label>
              <Input value={fuelPerLap} onChange={e => setFuelPerLap(e.target.value)} type="number"
                step="0.1" placeholder="e.g. 3.2" className="bg-secondary h-9 w-40" />
            </div>
          )}
        </TabsContent>

        {/* Pit Strategy Tab */}
        <TabsContent value="pits" className="pt-3">
          <PitStrategyPanel stops={stops} onChange={setStops} />
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="pt-3 space-y-3">
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Car balance notes, track evolution, issues, driver feedback, setup changes for next session..."
            rows={8}
            className="bg-secondary"
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button variant="ghost" onClick={onDone} className="flex-1">Cancel</Button>
        <Button onClick={save} disabled={mutation.isPending} className="flex-1">
          {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {editSession ? "Update Session" : "Save Session"}
        </Button>
      </div>
    </div>
  );
}