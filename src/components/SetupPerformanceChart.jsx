import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { TrendingUp, Trophy } from "lucide-react";

function parseLap(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d+):(\d+(?:\.\d+)?)$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseFloat(m[2]);
}

function fmtSec(s) {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(3);
  return `${m}:${sec.padStart(6, "0")}`;
}

function fmtDate(d) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

function LapTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 backdrop-blur-md px-3 py-2 text-xs shadow-xl">
      <div className="text-muted-foreground">{d.type} · {fmtDate(d.date)}</div>
      <div className="font-bold tabular-nums font-digi mt-0.5">{fmtSec(d.lap)}</div>
    </div>
  );
}

export default function SetupPerformanceChart({ sessions }) {
  const data = useMemo(() => {
    return sessions
      .map(s => ({ ...s, lap: parseLap(s.best_lap_time) }))
      .filter(s => s.lap != null && s.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((s, i) => ({ idx: i + 1, date: s.date, lap: s.lap, type: s.session_type }));
  }, [sessions]);

  if (data.length < 2) return null;

  const best = Math.min(...data.map(d => d.lap));
  const first = data[0].lap;
  const last = data[data.length - 1].lap;
  const trend = last - first;
  const improved = trend < 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading text-sm font-bold tracking-wide flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Performance Trend
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Trophy className="w-3 h-3 text-primary" />
            <span className="font-digi tabular-nums">{fmtSec(best)}</span>
          </span>
          <span className={`flex items-center gap-1 font-digi tabular-nums ${improved ? "text-green-400" : "text-red-400"}`}>
            {improved ? "▼" : "▲"} {Math.abs(trend).toFixed(3)}s
          </span>
        </div>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
            <XAxis dataKey="date" tickFormatter={fmtDate} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[(min) => min - 0.3, (max) => max + 0.3]} tickFormatter={(v) => v.toFixed(1)} stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} width={44} />
            <Tooltip content={<LapTooltip />} />
            <ReferenceLine y={best} stroke="hsl(var(--primary))" strokeDasharray="4 4" opacity={0.5} />
            <Line type="monotone" dataKey="lap" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">Best lap per session. Dashed line = overall best. Lower is faster.</p>
    </div>
  );
}