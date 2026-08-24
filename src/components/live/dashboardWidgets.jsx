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
function tempColor(t, T) {
  if (t == null) return T.label;
  if (t < 70) return T.blue;
  if (t < 86) return T.ledGreen;
  if (t < 96) return T.ledYellow;
  if (t < 108) return T.amber;
  return T.ledRed;
}
function wearColor(w, T) {
  if (w == null) return T.label;
  if (w < 40) return T.ledGreen;
  if (w < 70) return T.ledYellow;
  if (w < 90) return T.amber;
  return T.ledRed;
}

function Row({ label, value, lcolor, vcolor }) {
  return (
    <div className="flex justify-between" style={{ fontSize: "1em" }}>
      <span style={{ color: lcolor }}>{label}</span>
      <span className="tabular-nums" style={{ color: vcolor }}>{value}</span>
    </div>
  );
}
function Bar({ label, value, color, T }) {
  const v = Math.max(0, Math.min(1, value ?? 0));
  return (
    <div>
      <div className="flex justify-between" style={{ fontSize: "0.9em", color: T.label }}>
        <span>{label}</span><span>{Math.round(v * 100)}%</span>
      </div>
      <div className="rounded-full overflow-hidden" style={{ height: "0.55em", background: T.track }}>
        <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: color, boxShadow: v > 0.05 ? `0 0 5px ${color}` : "none" }} />
      </div>
    </div>
  );
}
function Title({ children, T }) {
  return <div style={{ fontSize: "0.8em", color: T.label, letterSpacing: "0.12em" }}>{children}</div>;
}

function ShiftLights({ data, T, shape }) {
  const maxRpm = data.max_rpm || 8000;
  const shiftRpm = 0.925 * maxRpm;
  const lit = Math.max(0, Math.min(15, Math.round(((data.rpm || 0) - 2000) / (shiftRpm - 2000) * 15)));
  const atRedline = (data.rpm || 0) >= shiftRpm;
  const flashOn = atRedline && (Math.floor(Date.now() / 100) % 2 === 0);
  const segColor = (i) => (i < 5 ? T.ledGreen : i < 10 ? T.ledYellow : T.ledRed);
  const on = (i) => i < lit && (!atRedline || flashOn);

  if (shape === "bars") {
    return (
      <div className="w-full h-full flex items-center justify-between gap-0.5 px-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="flex-1 rounded-sm" style={{ height: "92%", background: on(i) ? segColor(i) : "rgba(255,255,255,0.07)", boxShadow: on(i) ? `0 0 8px ${segColor(i)}` : "none", opacity: on(i) ? 1 : 0.5 }} />
        ))}
      </div>
    );
  }
  if (shape === "arc") {
    return (
      <div className="w-full h-full relative">
        {Array.from({ length: 15 }).map((_, i) => {
          const ang = ((-75 + i * (150 / 14)) * Math.PI) / 180;
          const x = 50 + Math.sin(ang) * 44;
          const y = 96 - Math.cos(ang) * 80;
          return (
            <div key={i} className="absolute rounded-full" style={{ width: "5%", height: "55%", left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", background: on(i) ? segColor(i) : "rgba(255,255,255,0.08)", boxShadow: on(i) ? `0 0 10px ${segColor(i)}` : "none", opacity: on(i) ? 1 : 0.5 }} />
          );
        })}
      </div>
    );
  }
  if (shape === "dial") {
    return (
      <div className="w-full h-full flex items-center justify-between px-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ width: "5%", height: "80%", background: on(i) ? segColor(i) : "transparent", border: on(i) ? "none" : `1px solid rgba(255,255,255,0.14)`, transform: "rotate(45deg)", opacity: on(i) ? 1 : 0.5, boxShadow: on(i) ? `0 0 8px ${segColor(i)}` : "none" }} />
        ))}
      </div>
    );
  }
  // led (default) — round LEDs
  return (
    <div className="w-full h-full flex items-center justify-between px-1">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="rounded-full aspect-square" style={{ height: "100%", background: on(i) ? segColor(i) : "rgba(255,255,255,0.07)", boxShadow: on(i) ? `0 0 12px ${segColor(i)}, inset 0 0 4px rgba(255,255,255,0.5)` : "none", opacity: on(i) ? 1 : 0.55 }} />
      ))}
    </div>
  );
}

function Tyres({ data, T }) {
  const tyres = data.tyres || {};
  return (
    <div className="w-full h-full grid grid-cols-2 gap-1 p-1">
      {["FL", "FR", "RL", "RR"].map((k) => {
        const t = tyres[k.toLowerCase()];
        const temp = t?.temp_c, press = t?.pressure_psi, wear = t?.wear_pct;
        return (
          <div key={k} className="rounded border p-1 flex flex-col justify-center" style={{ borderColor: T.border, background: `linear-gradient(135deg, ${tempColor(temp, T)}22, transparent)` }}>
            <div style={{ fontSize: "0.8em", color: T.label, letterSpacing: "0.1em" }}>{k}</div>
            <div className="font-bold tabular-nums" style={{ fontSize: "2.2em", lineHeight: 1, color: tempColor(temp, T) }}>{temp != null ? Math.round(temp) : "--"}°</div>
            <div style={{ fontSize: "0.78em", color: T.label }}>PRS <span style={{ color: T.text }}>{press != null ? press.toFixed(1) : "--"}</span></div>
            <div style={{ fontSize: "0.78em", color: T.label }}>WR <span style={{ color: wearColor(wear, T) }}>{wear != null ? Math.round(wear) : "--"}%</span></div>
          </div>
        );
      })}
    </div>
  );
}

function Fuel({ data, T }) {
  const lapsLeft = data.fuel_per_lap ? (data.fuel_litres || 0) / data.fuel_per_lap : null;
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-0.5">
      <Title T={T}>FUEL / TEMP</Title>
      <Row label="REMAINING" value={`${(data.fuel_litres ?? 0).toFixed(1)}L`} lcolor={T.label} vcolor={T.text} />
      <Row label="FUEL REQ" value={data.fuel_required != null ? `${data.fuel_required.toFixed(1)}L` : "--"} lcolor={T.label} vcolor={T.text} />
      <Row label="AVG LAP" value={fmt(data.avg_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="LAST LAP" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="LAPS LEFT" value={lapsLeft != null ? lapsLeft.toFixed(1) : "--"} lcolor={T.label} vcolor={T.text} />
      <Bar label="THR" value={data.throttle} color={T.ledGreen} T={T} />
      <Bar label="BRK" value={data.brake} color={T.ledRed} T={T} />
    </div>
  );
}

function Gear({ data, h, T, shape }) {
  const maxRpm = data.max_rpm || 8000;
  const rpmPct = Math.min(1, (data.rpm || 0) / maxRpm);
  const shift = rpmPct > 0.93;
  const numeral = (
    <span className="font-bold tabular-nums" style={{ fontSize: `${h * 0.6}px`, lineHeight: 0.8, color: data.gear > 0 ? T.text : T.amber, textShadow: shift ? `0 0 30px ${T.shiftColor}` : "none" }}>
      {data.gear > 0 ? data.gear : "N"}
    </span>
  );
  if (shape === "arc" || shape === "dial") {
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="50" cy="50" r="46" fill="none" stroke={T.border} strokeWidth="2" />
          <circle cx="50" cy="50" r="46" fill="none" stroke={T.accent} strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 46 * rpmPct} ${2 * Math.PI * 46}`} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 4px ${T.accent})` }} />
        </svg>
        {numeral}
      </div>
    );
  }
  return <div className="w-full h-full flex items-center justify-center">{numeral}</div>;
}

function Delta({ data, T }) {
  const delta = data.lap_delta;
  const tone = delta == null ? T.label : delta <= 0 ? T.ledGreen : T.ledRed;
  return (
    <div className="w-full h-full p-1.5 flex flex-col">
      <Row label="LAST" value={fmt(data.last_lap_time)} lcolor={T.label} vcolor={T.text} />
      <Row label="BEST" value={fmt(data.best_lap_time)} lcolor={T.label} vcolor={T.text} />
      <div className="flex-1 flex flex-col items-center justify-center">
        <div style={{ fontSize: "0.85em", color: T.label, letterSpacing: "0.15em" }}>DELTA</div>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "4em", color: tone }}>
          {delta == null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`}
        </div>
      </div>
    </div>
  );
}

function Laps({ data, color, T }) {
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-0.5 justify-center">
      <Row label="LAPS" value={`${data.lap || 0}/${data.total_laps || 0}`} lcolor={T.label} vcolor={T.text} />
      <Row label="TIME REM" value={data.time_remaining != null ? `${Math.floor(data.time_remaining / 60)}:${String(Math.floor(data.time_remaining % 60)).padStart(2, "0")}` : "--:--"} lcolor={T.label} vcolor={T.text} />
      <Row label="CURRENT" value={fmt(data.current_lap_time)} lcolor={T.label} vcolor={color} />
    </div>
  );
}

function Cars({ data, T }) {
  const gap = (g) => (g == null ? "--.---" : `${g > 0 ? "+" : ""}${g.toFixed(3)}`);
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1.5 justify-center">
      <div>
        <Title T={T}>CAR AHEAD</Title>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "1.9em", color: T.ledGreen }}>{gap(data.car_ahead_gap)}</div>
      </div>
      <div>
        <Title T={T}>CAR BEHIND</Title>
        <div className="font-bold tabular-nums leading-none" style={{ fontSize: "1.9em", color: T.ledRed }}>{gap(data.car_behind_gap)}</div>
      </div>
    </div>
  );
}

function DialInputs({ data, T }) {
  const Gauge = ({ label, value, color }) => {
    const ang = ((value * 180 - 90) * Math.PI) / 180;
    const x2 = 50 + 40 * Math.sin(ang);
    const y2 = 50 - 40 * Math.cos(ang);
    const circ = Math.PI * 45;
    return (
      <div className="flex flex-col items-center justify-center" style={{ flex: 1 }}>
        <div className="relative w-full" style={{ aspectRatio: "2 / 1" }}>
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={T.track} strokeWidth="6" />
            <path d="M5 50 A45 45 0 0 1 95 50" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${circ * value} ${circ}`} strokeLinecap="round" />
            <line x1="50" y1="50" x2={x2} y2={y2} stroke={T.text} strokeWidth="2" />
            <circle cx="50" cy="50" r="2.5" fill={T.text} />
          </svg>
        </div>
        <div style={{ fontSize: "0.7em", color: T.label }}>{label} {Math.round((value ?? 0) * 100)}%</div>
      </div>
    );
  };
  return (
    <div className="w-full h-full p-1 flex flex-col gap-1">
      <div className="flex gap-1 flex-1">
        <Gauge label="THR" value={data.throttle ?? 0} color={T.ledGreen} />
        <Gauge label="BRK" value={data.brake ?? 0} color={T.ledRed} />
      </div>
      <div>
        <div className="flex justify-between" style={{ fontSize: "0.8em", color: T.label }}><span>STR</span><span>{(data.steer ?? 0).toFixed(2)}</span></div>
        <div className="relative rounded-full" style={{ height: "0.6em", background: T.track }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: T.border }} />
          <div className="absolute top-1/2 -translate-y-1/2 rounded-sm" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, width: "8px", height: "1.2em", background: T.accent }} />
        </div>
      </div>
    </div>
  );
}

function Inputs({ data, color, T, shape }) {
  if (shape === "dial") return <DialInputs data={data} T={T} />;
  const thrColor = shape === "bars" ? (color || T.accent) : T.ledGreen;
  return (
    <div className="w-full h-full p-1.5 flex flex-col gap-1.5 justify-center">
      <Bar label="THR" value={data.throttle} color={thrColor} T={T} />
      <Bar label="BRK" value={data.brake} color={T.ledRed} T={T} />
      <div>
        <div className="flex justify-between" style={{ fontSize: "0.9em", color: T.label }}><span>STR</span><span>{(data.steer ?? 0).toFixed(2)}</span></div>
        <div className="relative rounded-full" style={{ height: "0.6em", background: T.track }}>
          <div className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: T.border }} />
          <div className="absolute top-1/2 -translate-y-1/2 rounded-sm" style={{ left: `calc(${50 + (data.steer ?? 0) * 50}% - 4px)`, width: "8px", height: "1.2em", background: color || T.accent }} />
        </div>
      </div>
    </div>
  );
}

function Status({ data, color, T }) {
  const items = [
    ["POS", `P${data.position || 0}`, null],
    ["THROTT", `${Math.round((data.throttle || 0) * 100)}`, T.ledGreen],
    ["BOOST", data.boost != null ? data.boost.toFixed(1) : "--", null],
    ["INC", `${data.incidents || 0}`, T.ledYellow],
    ["BBIAS", data.brake_bias != null ? data.brake_bias.toFixed(1) : "--", T.ledRed],
    ["TC1", data.tc1 != null ? data.tc1 : "--", color],
    ["TC2", data.tc2 != null ? data.tc2 : "--", null],
    ["ABS", data.abs != null ? data.abs : "--", T.blue],
    ["MAP", data.map != null ? data.map : "--", T.ledGreen],
  ];
  return (
    <div className="w-full h-full flex gap-1 p-1">
      {items.map(([l, v, b]) => (
        <div key={l} className="flex-1 rounded border flex flex-col items-center justify-center" style={{ borderColor: b || T.border, background: T.panel }}>
          <div style={{ fontSize: "0.7em", color: T.label, letterSpacing: "0.1em" }}>{l}</div>
          <div className="font-bold tabular-nums" style={{ fontSize: "1.1em", color: b || T.text }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

export function renderWidget(type, ctx) {
  const { data, color, h, theme, shape } = ctx;
  const T = { ...SEM, ...(theme || {}) };
  const sh = shape || "led";
  switch (type) {
    case "shiftLights": return <ShiftLights data={data} T={T} shape={sh} />;
    case "tyres": return <Tyres data={data} T={T} />;
    case "fuel": return <Fuel data={data} T={T} />;
    case "gear": return <Gear data={data} h={h} T={T} shape={sh} />;
    case "delta": return <Delta data={data} T={T} />;
    case "laps": return <Laps data={data} color={color} T={T} />;
    case "cars": return <Cars data={data} T={T} />;
    case "inputs": return <Inputs data={data} color={color} T={T} shape={sh} />;
    case "status": return <Status data={data} color={color} T={T} />;
    default: return null;
  }
}