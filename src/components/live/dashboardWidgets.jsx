export const SEM = {
  green: "#00ff66", yellow: "#ffe600", red: "#ff1a1a",
  blue: "#3b82f6", amber: "#ff9800", label: "#6a6a6a",
  text: "#ffffff", panel: "#0a0a0a", border: "#262626", track: "#161616",
};

export const WIDGET_DEFS = [
  { type: "shiftLights", label: "Shift Lights", w: 960, h: 36 },
  { type: "tyres", label: "Tyres", w: 300, h: 300 },
  { type: "fuel", label: "Fuel / Temp", w: 300, h: 180 },
  { type: "gear", label: "Gear", w: 300, h: 200 },
  { type: "delta", label: "Delta / Time", w: 320, h: 150 },
  { type: "laps", label: "Laps / Time", w: 320, h: 90 },
  { type: "cars", label: "Cars Ahead / Behind", w: 320, h: 220 },
  { type: "inputs", label: "Inputs", w: 300, h: 170 },
  { type: "status", label: "Status Bar", w: 960, h: 50 },
];

function fmt(t) {
  if (t == null || isNaN(t)) return "--:--.---";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  const ms = Math.round((t % 1) * 1000);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}
function tempColor(t) {
  if (t == null) return SEM.label;
  if (t < 70) return SEM.blue;
  if (t < 86) return SEM.green;
  if (t < 96) return SEM.yellow;
  if (t < 108) return SEM.amber;
  return SEM.red;
}
function wearColor(w) {
  if (w == null) return SEM.label;
  if (w < 40) return SEM.green;
  if (w < 70) return SEM.yellow;
  if (w < 90) return SEM.amber;
  return SEM.red;
}

function Row({ label, value, lcolor, vcolor }) {
  return (
    <div className="flex justify-between" style={{ fontSize: "1em" }}>
      <span style={{ color: lcolor || SEM.label }}>{label}</span>
      <span className="tabular-nums" style={{ color: vcolor || SEM.text }}>{value}</span>
    </div>
  );
}
function Bar({ label, value, color }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between" style={{ fontSize: "0.9em", color: SEM.label }}>
        <span>{label}</span><span>{Math.round(v * 100)}%</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "0.55em", background: SEM.track }}>
        <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: color, boxShadow: v > 0.05 ? `0 0 5px ${color}` : "none" }} />
      </div>
    </div>
  );
}
function Title({ children }) {
  return <div style={{ fontSize: "0.8em", color: SEM.label, letterSpacing: "0.12em" }}>{children}</div>;
}

function ShiftLights({ data }) {
  const maxRpm = data.max_rpm || 8000;
  const shiftRpm = 0.93 * maxRpm;   // last LED lights at the shift point
  const lit = Math.max(0, Math.min(15, Math.round(((data.rpm || 0) - 2000) / (shiftRpm - 2000) * 15)));
  return (
    <div className="w-full h-full flex items-center justify-between px-1">
      {Array.from({ length: 15 }).map((_, i) => {
        const on = i < lit;
        const col = i < 5 ? SEM.green : i < 10 ? SEM.yellow : SEM.red;
        return (
          <div key={i} className="rounded-full aspect-square" style={{ height: "100%", background: on ? col : "rgba(255,255,255,0.07)", boxShadow: on ? `0 0 10px ${col}, inset 0 0 4px rgba(255,255,255,0.4)` : "none", opacity: on ? 1 : 0.55 }} />
        );
      })}
    </div>
  );
}

function Tyres({ data }) {
  const tyres = data.tyres || {};
  return (
    <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
      {["FL", "FR", "RL", "RR"].map((k) => {
        const t = tyres[k.toLowerCase()];
        const temp = t?.temp_c, press = t?.pressure_psi, wear = t?.wear_pct;
        return (
          <div key={k} className="rounded border p-1 flex flex-col justify-center" style={{ borderColor: SEM.border, background: `linear-gradient(135deg, ${tempColor(temp)}22, transparent)` }}>
            <div style={{ fontSize: "0.8em", color: SEM.label, letterSpacing: "0.1em" }}>{k}</div>
            <div className="font-bold tabular-nums" style={{ fontSize: "2.2em", lineHeight: 1, color: tempColor(temp) }}>{temp != null ? Math.round(temp) : "--"}°</div>
            <div style={{ fontSize: "0.78em", color: SEM.label }}>PRS <span style={{ color: SEM.text }}>{press != null ? press.toFixed(1) : "--"}</span></div>
            <div style={{ fontSize: "0.78em", color: SEM.label }}>WR <span style={{ color: wearColor(wear) }}>{wear != null ? Math.round(wear) : "--"}%</span></div>
          </div>
        );
      })}
    </div>
  );
}

function Fuel({ data }) {
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-0.5">
      <Title>FUEL / TEMP</Title>
      <Row label="REMAINING" value={`${(data.fuel_litres ?? 0).toFixed(1)}L`} />
      <Row label="FUEL REQ" value={data.fuel_required != null ? `${data.fuel_required.toFixed(1)}L` : "--"} />
      <Row label="AVG LAP" value={fmt(data.avg_lap_time)} />
      <Row label="LAST LAP" value={fmt(data.last_lap_time)} />
      <Row label="LAPS LEFT" value={lapsLeft != null ? lapsLeft.toFixed(1) : "--"} />
      <Bar label="THR" value={data.throttle} color={SEM.green} />
      <Bar label="BRK" value={data.brake} color={SEM.red} />
    </div>
  );
}

function Gear({ data, h }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="font-bold tabular-nums" style={{ fontSize: `${h * 0.6}px`, lineHeight: 0.8, color: data.gear > 0 ? SEM.text : SEM.amber, textShadow: shift ? `0 0 30px ${SEM.red}` : "none" }}>
        {data.gear > 0 ? data.gear : "N"}
      </span>
    </div>
  );
}

function Delta({ data }) {
  const delta = data.lap_delta;
  const tone = delta == null ? SEM.label : delta <= 0 ? SEM.green : SEM.red;
  return (
    <div className="w-full h-full p-1.5 flex flex-col">
      <Row label="LAST" value={fmt(data.last_lap_time)} />
      <Row label="BEST" value={fmt(data.best_lap_time)} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div style={{ fontSize: "0.85em", color: SEM.label, letterSpacing: "0.15em" }}>DELTA</div>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "4em", color: tone }}>
          {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}

function Laps({ data, color }) {
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-0.5 justify-center">
      <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} />
      <Row label="TIME REM" value={data.time_remaining != null ? `${Math.floor(data.time_remaining / 60)}:${String(Math.floor(data.time_remaining % 60)).padStart(2, "0")}` : "--:--"} />
      <Row label="CURRENT" value={fmt(data.current_lap_time)} vcolor={color} />
    </div>
  );
}

function Cars({ data }) {
  const gap = (g) => (g == null ? "--.---" : `${g > 0 ? "+" : ""}${g.toFixed(3)}`);
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1.5 justify-center">
      <div>
        <Title>CAR AHEAD</Title>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "1.9em", color: SEM.green }}>{gap(data.car_ahead_gap)}</div>
      </div>
      <div>
        <Title>CAR BEHIND</Title>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "1.9em", color: SEM.red }}>{gap(data.car_behind_gap)}</div>
      </div>
    </div>
  );
}

function Inputs({ data, color }) {
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1.5 justify-center">
      <Bar label="THR" value={data.throttle} color={SEM.green} />
      <Bar label="BRK" value={data.brake} color={SEM.red} />
      <div>
        <div className="flex justify-between" style={{ fontSize: "0.9em", color: SEM.label }}><span>STR</span><span>{(data.steer ?? 0).toFixed(2)}</span></div>
        <div className="relative rounded-full" style={{ height: "0.6em", background: SEM.track }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "#444" }} />
          <div className="absolute top-1/2 -translate-y-1/2 rounded-sm" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, width: "8px", height: "1.2em", background: color }} />
        </div>
      </div>
    </div>
  );
}

function Status({ data, color }) {
  const items = [
    ["POS", `P${data.position || 0}`, null],
    ["THROTT", `${Math.round((data.throttle || 0) * 100)}`, SEM.green],
    ["BOOST", data.boost != null ? data.boost.toFixed(1) : "--", null],
    ["INC", `${data.incidents || 0}`, SEM.yellow],
    ["BBIAS", data.brake_bias != null ? data.brake_bias.toFixed(1) : "--", SEM.red],
    ["TC1", data.tc1 != null ? data.tc1 : "--", color],
    ["TC2", data.tc2 != null ? data.tc2 : "--", null],
    ["ABS", data.abs != null ? data.abs : "--", SEM.blue],
    ["MAP", data.map != null ? data.map : "--", SEM.green],
  ];
  return (
    <div className="w-full h-full flex gap-1 p-1">
      {items.map(([l, v, b]) => (
        <div key={l} className="flex-1 rounded border flex flex-col items-center justify-center" style={{ borderColor: b || SEM.border, background: SEM.panel }}>
          <div style={{ fontSize: "0.7em", color: SEM.label, letterSpacing: "0.1em" }}>{l}</div>
          <div className="font-bold tabular-nums" style={{ fontSize: "1.1em", color: b || SEM.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function renderWidget(type, ctx) {
  const { data, color, h } = ctx;
  switch (type) {
    case "shiftLights": return <ShiftLights data={data} />;
    case "tyres": return <Tyres data={data} />;
    case "fuel": return <Fuel data={data} />;
    case "gear": return <Gear data={data} h={h} />;
    case "delta": return <Delta data={data} />;
    case "laps": return <Laps data={data} color={color} />;
    case "cars": return <Cars data={data} />;
    case "inputs": return <Inputs data={data} color={color} />;
    case "status": return <Status data={data} color={color} />;
    default: return null;
  }
}