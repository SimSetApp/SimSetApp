import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileHeader from "../components/MobileHeader";
import { CheckCircle, Circle, ChevronDown, ChevronUp, ListOrdered, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    order: 1,
    title: "Ride Height & Rake",
    icon: "📐",
    timeframe: "First on track",
    why: "Ride height determines your entire aerodynamic map. Every other aero adjustment is relative to this foundation. Getting rake wrong means your setup will behave differently at low and high speed.",
    targets: [
      "Front ride height: follow manufacturer recommendation for car category",
      "Rear ride height: 3–8mm higher than front for positive rake",
      "Confirm car doesn't bottom out at circuit compressions",
      "Verify the front splitter isn't touching the road on kerbs"
    ],
    warning: "Don't touch wing settings until ride height is confirmed. Wing changes without stable ride height are meaningless.",
    tips: [
      "Run 2–3 easy laps first. Look for sparks or ride height sensor warnings.",
      "Drive over the kerbs you plan to use in racing — check ground clearance.",
      "In hot conditions, the car may run slightly lower as components expand — add 1mm margin."
    ]
  },
  {
    order: 2,
    title: "Spring Rates",
    icon: "🔩",
    timeframe: "Garage + initial laps",
    why: "Springs define the platform compliance — how much the car moves under load. They determine the natural frequency of the suspension, which must be set before dampers can be optimized. Getting the spring ratio right establishes baseline mechanical balance.",
    targets: [
      "Front natural frequency: 1.8–2.2 Hz for GT cars",
      "Rear natural frequency: 2.0–2.5 Hz (rear typically stiffer than front)",
      "F/R spring ratio: 0.85–0.95 for mild understeer bias (rear stiffer)",
      "Car should not bottom out under maximum fuel load"
    ],
    warning: "Changing springs significantly requires revisiting damper settings. They are closely linked.",
    tips: [
      "If you don't know the car mass, use the default springs as your reference and adjust ±10% from there.",
      "For endurance racing, set springs for heavy fuel load — the car will feel slightly stiffer when light.",
      "Bumpy tracks like the Nordschleife require softer springs than smooth circuits like Silverstone."
    ]
  },
  {
    order: 3,
    title: "Bump & Rebound Dampers",
    icon: "⚡",
    timeframe: "After springs, 5–6 laps",
    why: "Dampers control the rate of suspension movement — they don't support weight, they manage how quickly load transfers. Low-speed settings control body motion, high-speed settings control response to sharp inputs. Getting this wrong causes either a 'floaty' or 'bucking' car.",
    targets: [
      "Rebound:Bump ratio — approximately 1.5:1 to 2:1",
      "Low-speed bump: car should roll smoothly without flopping",
      "High-speed bump: car should absorb kerbs without bouncing",
      "No hydraulic jacking — car returns to full ride height between bumps"
    ],
    warning: "Stiff rebound with soft bump is the most common mistake. It causes hydraulic jacking over bumpy sections.",
    tips: [
      "Test kerb absorption specifically — drive over the same kerb 5 times with different bump settings.",
      "If the car bounces after a kerb, soften rebound. If it stays low after a sequence of bumps, soften rebound.",
      "Low-speed rebound controls how quickly the car reacts to direction changes — very important for chicane stability."
    ]
  },
  {
    order: 4,
    title: "Anti-Roll Bars (Balance Tuning)",
    icon: "⚖️",
    timeframe: "During mechanical balance session",
    why: "ARBs only affect the car in corners — they have no effect in a straight line. This makes them the ideal pure balance tool. The front-to-rear ARB ratio determines the fundamental mechanical balance: more front = understeer, more rear = oversteer.",
    targets: [
      "Start with the F/R ARB ratio matching the F/R spring ratio",
      "Front: provides turn-in response and initial rotation",
      "Rear: controls mid-corner stability and exit behavior",
      "Total ARB stiffness: softer on bumpy tracks, stiffer on smooth tracks"
    ],
    warning: "Don't use ARBs to compensate for spring rates that are fundamentally wrong. Fix springs first.",
    tips: [
      "On bumpy tracks, reduce both ARBs from the baseline to allow wheel independence.",
      "If the car understeers only in the middle of corners (not entry/exit), soften rear ARB first.",
      "Very stiff ARBs make the car sensitive to bumps mid-corner — the bump on one side affects the other."
    ]
  },
  {
    order: 5,
    title: "Aerodynamics (Wing & Aero Balance)",
    icon: "🌬️",
    timeframe: "After mechanical platform is set",
    why: "Wing settings are only meaningful when the mechanical platform is set. Adjusting aero balance after springs and ARBs means the reference point is stable. This step determines the overall downforce level for the circuit and the aero balance between front and rear.",
    targets: [
      "Choose downforce level based on circuit character (speed vs. cornering)",
      "Aero balance: 40–45% front / 55–60% rear for most circuits",
      "Confirm balance at the circuit's fastest corner (most demanding for aero)",
      "Check for underfloor stall — car should feel consistent through circuit depressions"
    ],
    warning: "Avoid the temptation to add rear wing to fix oversteer before checking the mechanical balance. Aero fixes that mask mechanical problems create inconsistent behavior at different speeds.",
    tips: [
      "Test in practice — check if balance feels different at maximum speed vs slow sections. If so, the aero balance is shifting with speed.",
      "Low-downforce tracks (Monza): minimum wing, lower front ride height to compensate.",
      "High-downforce tracks (Bathurst, Spa): prioritize stability at the circuit's most demanding corners."
    ]
  },
  {
    order: 6,
    title: "Suspension Geometry (Camber, Toe, Caster)",
    icon: "📏",
    timeframe: "After aero balance is confirmed",
    why: "Geometry determines the exact tire contact patch at every point in the corner. It's tuned last in the mechanical sequence because the optimal geometry depends on what the car is doing — which only becomes clear once the major dynamics (springs, dampers, aero) are set.",
    targets: [
      "Caster: maximum the car allows (dynamic camber gain)",
      "Front camber: inner edge 5–10°C warmer than outer edge (temperature analysis)",
      "Front toe: slight toe-out (0 to -0.5mm) for turn-in",
      "Rear toe: toe-in (0.5–1.5mm) for high-speed stability",
      "Rear camber: inner edge max 10°C warmer than outer edge"
    ],
    warning: "Camber adjustments require tyre temperature data to set correctly — guessing camber is inefficient.",
    tips: [
      "Run several full laps before checking tyre temps — temps need to stabilize.",
      "If your fastest lap and your best tire temp lap feel different, prioritize the tire temp data.",
      "On low-grip tracks (early race, wet patches), reduce front camber to maximize contact patch area."
    ]
  },
  {
    order: 7,
    title: "Differential",
    icon: "⚙️",
    timeframe: "When traction and rotation feel is established",
    why: "The differential is the final mechanical tuning parameter. By this point, the car has a known balance and the driver knows exactly what the traction and rotation feel is like — which allows precise diff tuning. Diff settings interact strongly with driving style, especially trail-braking technique.",
    targets: [
      "Preload: start at 40–60 Nm — increase if car snaps under lift-off",
      "Power lock: start at 50–65% — increase if wheelspin present, reduce if push on exit",
      "Coast lock: start at 30–45% — decrease if car won't rotate, increase if snap oversteer occurs"
    ],
    warning: "Don't use diff settings to compensate for fundamental balance issues. A car that understeers on exit with 0% power lock has a spring/ARB/aero balance problem, not a diff problem.",
    tips: [
      "Test power lock specifically in the same slow corner repeatedly — the effect is most obvious here.",
      "Snap oversteer is almost always a coast lock + preload issue. Increase both if the car snaps.",
      "High preload smooths transitions between throttle states — helps with inconsistent corner entry behavior."
    ]
  },
  {
    order: 8,
    title: "Tyre Pressures & Electronics",
    icon: "🔧",
    timeframe: "Final session — confirm with full distance",
    why: "Tyre pressures are set to achieve target hot pressures after 3–4 laps. Electronics (TC, ABS) should be tuned to match the mechanical setup that's been built — not to compensate for mechanical problems. This is the final tuning step.",
    targets: [
      "Hot tyre pressures within ±0.3 PSI (2 kPa) of target",
      "TC: minimum intervention for clean exits — reduce one click at a time",
      "ABS: reduce to the minimum that allows consistent braking — gives more feel and control",
      "Engine map: confirm fuel consumption target for race distance"
    ],
    warning: "Using electronics to mask a bad mechanical setup is slower and more inconsistent than fixing the underlying issue.",
    tips: [
      "Check pressures after an out-lap, warm-up lap, and 2 push laps — the pressures should plateau.",
      "Ambient temperature changes between sessions require pressure re-evaluation.",
      "If TC cuts in constantly, the diff or spring settings may be the real issue — more TC is a band-aid."
    ]
  }
];

function StepCard({ step, isCompleted, onToggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
      isCompleted ? "border-primary/40 bg-primary/5" : open ? "border-border/80 bg-card" : "border-border bg-card"
    }`}>
      <div className="flex items-start">
        {/* Number indicator */}
        <div className={`flex-shrink-0 w-12 sm:w-16 flex flex-col items-center pt-5 gap-1`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            isCompleted ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}>
            {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.order}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button className="w-full text-left py-4 pr-4 flex items-center gap-3" onClick={() => setOpen(!open)}>
            <span className="text-xl">{step.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-sm font-semibold">
                  Step {step.order}: {step.title}
                </span>
                <span className="text-xs text-muted-foreground">{step.timeframe}</span>
              </div>
            </div>
            {open ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="pr-4 pb-5 space-y-4 border-t border-border/50 pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.why}</p>

                  <div className="rounded-xl bg-muted/40 border border-border p-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Target Values</h4>
                    <ul className="space-y-1">
                      {step.targets.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.warning && (
                    <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-3 flex gap-2">
                      <span className="text-orange-400 text-sm flex-shrink-0">⚠</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.warning}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Practical Tips</h4>
                    <ul className="space-y-1">
                      {step.tips.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-0.5">→</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onToggle(step.order)}
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                    {isCompleted ? "Mark incomplete" : "Mark complete"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function SetupMethodology() {
  const [completed, setCompleted] = useState(new Set());
  const navigate = useNavigate();

  const toggle = (order) => {
    const next = new Set(completed);
    if (next.has(order)) next.delete(order); else next.add(order);
    setCompleted(next);
  };

  const progress = Math.round((completed.size / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MobileHeader title="Setup Methodology" />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ListOrdered className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Setup Workflow</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            8-Step Setup Methodology
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            A structured workflow for building a setup from scratch — ordered by importance and interdependency. Follow these steps in order for consistent results.
          </p>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Session progress</span>
              <span className="text-primary font-semibold">{completed.size} / {STEPS.length} steps</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map(step => (
            <StepCard
              key={step.order}
              step={step}
              isCompleted={completed.has(step.order)}
              onToggle={toggle}
            />
          ))}
        </div>

        {completed.size === STEPS.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center"
          >
            <div className="text-2xl mb-2">🏁</div>
            <p className="font-heading font-semibold text-primary">Setup complete!</p>
            <p className="text-xs text-muted-foreground mt-1">All 8 steps done. Time to go fast.</p>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}