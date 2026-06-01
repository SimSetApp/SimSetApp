import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Trash2, Trophy, CloudRain, Wrench, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WEATHER_ICONS = {
  "Sunny": "☀️", "Partly Cloudy": "⛅", "Overcast": "☁️",
  "Light Rain": "🌦️", "Heavy Rain": "🌧️", "Variable / Changing": "🌤️"
};

const SESSION_COLORS = {
  "Practice": "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "Qualifying": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Race": "text-green-400 bg-green-400/10 border-green-400/20",
  "Hot Lap": "text-violet-400 bg-violet-400/10 border-violet-400/20",
  "Endurance": "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

export default function SessionCard({ session, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  let laps = [];
  let stops = [];
  try { laps = JSON.parse(session.lap_times_json || "[]"); } catch {}
  try { stops = JSON.parse(session.pit_stops_json || "[]"); } catch {}

  const colorClass = SESSION_COLORS[session.session_type] || "text-muted-foreground bg-muted border-border";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted/30 transition-colors text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs border ${colorClass}`}>{session.session_type}</Badge>
            {session.date && <span className="text-xs text-muted-foreground">{session.date}</span>}
            {session.weather && <span className="text-xs">{WEATHER_ICONS[session.weather] || ""} {session.weather}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {session.best_lap_time && (
              <span className="flex items-center gap-1 text-xs font-mono text-amber-400 font-semibold">
                <Trophy className="w-3 h-3" />{session.best_lap_time}
              </span>
            )}
            {laps.length > 0 && <span className="text-xs text-muted-foreground">{laps.length} laps</span>}
            {stops.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wrench className="w-3 h-3" />{stops.length} stop{stops.length !== 1 ? "s" : ""}
              </span>
            )}
            {session.tyre_compound && <span className="text-xs text-muted-foreground">{session.tyre_compound}</span>}
            {session.race_position_finish && (
              <span className="text-xs text-green-400 font-semibold">P{session.race_position_finish}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
              {/* Weather detail */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {session.track_temp && (
                  <div className="rounded-lg bg-secondary p-2 text-center">
                    <div className="text-xs text-muted-foreground">Track</div>
                    <div className="text-sm font-semibold text-orange-400">{session.track_temp}°C</div>
                  </div>
                )}
                {session.air_temp && (
                  <div className="rounded-lg bg-secondary p-2 text-center">
                    <div className="text-xs text-muted-foreground">Air</div>
                    <div className="text-sm font-semibold text-blue-400">{session.air_temp}°C</div>
                  </div>
                )}
                {session.humidity && (
                  <div className="rounded-lg bg-secondary p-2 text-center">
                    <div className="text-xs text-muted-foreground">Humidity</div>
                    <div className="text-sm font-semibold text-cyan-400">{session.humidity}%</div>
                  </div>
                )}
                {session.wind_speed && (
                  <div className="rounded-lg bg-secondary p-2 text-center">
                    <div className="text-xs text-muted-foreground">Wind</div>
                    <div className="text-sm font-semibold text-green-400">{session.wind_speed}km/h</div>
                  </div>
                )}
              </div>

              {/* Lap times preview */}
              {laps.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Timer className="w-3 h-3" /> Lap Times
                  </p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="max-h-48 overflow-y-auto divide-y divide-border">
                      {laps.map((lap, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-1.5 text-xs">
                          <span className="text-muted-foreground font-mono w-8">L{lap.lap}</span>
                          <span className="font-mono font-medium">{lap.time}</span>
                          <span className="text-muted-foreground">{lap.note || ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Pit stops */}
              {stops.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> Pit Stops
                  </p>
                  <div className="space-y-1.5">
                    {stops.map((stop, i) => (
                      <div key={i} className="rounded-lg bg-secondary px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold">Lap {stop.lap}</span>
                        <Badge variant="outline" className="text-xs">{stop.compound}</Badge>
                        {stop.fuel_added && <span className="text-muted-foreground">+{stop.fuel_added}L</span>}
                        {stop.duration_secs && <span className="text-muted-foreground">{stop.duration_secs}s</span>}
                        {stop.notes && <span className="text-muted-foreground">— {stop.notes}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fuel & race result */}
              {(session.fuel_per_lap_actual || session.race_position_start || session.race_position_finish || session.incidents) && (
                <div className="flex flex-wrap gap-3 text-xs">
                  {session.fuel_per_lap_actual && <span className="text-muted-foreground">Fuel/lap: <span className="text-foreground font-medium">{session.fuel_per_lap_actual}L</span></span>}
                  {session.race_position_start && <span className="text-muted-foreground">Started: <span className="text-foreground font-medium">P{session.race_position_start}</span></span>}
                  {session.race_position_finish && <span className="text-muted-foreground">Finished: <span className="text-green-400 font-medium">P{session.race_position_finish}</span></span>}
                  {session.incidents ? <span className="text-muted-foreground">Incidents: <span className="text-rose-400 font-medium">{session.incidents}x</span></span> : null}
                </div>
              )}

              {session.notes && (
                <div className="rounded-lg bg-secondary/50 border border-border px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                  {session.notes}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onEdit(session)}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => onDelete(session.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}