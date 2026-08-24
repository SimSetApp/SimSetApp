export const LEARNING_PATH = [
  {
    level: "Beginner",
    icon: "Sprout",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    description: "Start here if you're new to sim racing setup tuning.",
    modules: [
      {
        title: "Understanding Tyre Pressures",
        duration: "5 min",
        summary: "The single most impactful setting. Learn why pressures matter, how heat affects them, and where to start.",
        keyTakeaways: [
          "Hot pressures rise 3-5 PSI from cold — always check after 3-4 laps",
          "GT3 target: 27-29 PSI hot (ACC), 28-30 PSI (iRacing)",
          "Too low = overheating edges, too high = slippery and nervous",
          "Start with the default, adjust one axle at a time"
        ],
        action: { label: "Open Tyre Calculator", href: "/saved-setups?tab=tyres" }
      },
      {
        title: "Brake Bias Basics",
        duration: "4 min",
        summary: "One slider that changes how your car enters every corner. Get this right first.",
        keyTakeaways: [
          "57-60% front is the safe GT3 starting point",
          "Front locking → move bias rearward",
          "Rear stepping out under braking → move bias forward",
          "Change by 0.5-1% at a time"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "What is Understeer & Oversteer?",
        duration: "6 min",
        summary: "The two fundamental handling problems. Learn to identify which one you have before trying to fix it.",
        keyTakeaways: [
          "Understeer: car won't turn in, pushes wide",
          "Oversteer: rear steps out, car wants to spin",
          "Fix understeer: softer front ARB, more front downforce",
          "Fix oversteer: softer rear ARB, more rear wing",
          "Always fix the entry symptom first, then exit"
        ],
        action: { label: "Open Problem Solver", href: "/problem-solver" }
      }
    ]
  },
  {
    level: "Intermediate",
    icon: "Wrench",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    description: "You understand the basics — now learn how the systems interact.",
    modules: [
      {
        title: "Anti-Roll Bars: Your Balance Tool",
        duration: "8 min",
        summary: "ARBs are the fastest way to change balance. Learn the front-to-rear ratio approach.",
        keyTakeaways: [
          "ARBs only work in corners — they transfer load between wheels",
          "Stiffer front ARB → more understeer mid-corner",
          "Softer rear ARB → more rear grip, fixes oversteer",
          "The F/R ratio matters more than absolute values",
          "Start with ARBs before touching springs"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "Differential Power & Coast",
        duration: "10 min",
        summary: "The diff controls rotation on entry and traction on exit. Understanding it unlocks cornering speed.",
        keyTakeaways: [
          "Power lock = traction on exit (higher = more grip, less rotation)",
          "Coast lock = rotation on entry (lower = rotates more)",
          "Preload = the transition zone between coast and power",
          "60-75% power lock is typical for GT3",
          "Trail-brakers prefer lower coast lock"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "Aero Balance & Ride Height",
        duration: "8 min",
        summary: "Downforce is free grip — but only if your ride height is right. Learn the rake concept.",
        keyTakeaways: [
          "More rear wing = more high-speed grip, less top speed",
          "Rake (front lower than rear) improves diffuser efficiency",
          "3-8mm rake is typical for GT3",
          "Too low = bottoming out on bumps",
          "Aero balance shifts with speed — test at your key corner speeds"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "Camber & Toe: Tyre Contact Patch",
        duration: "10 min",
        summary: "Geometry determines how much rubber is on the road in corners. Get this right and everything else gets easier.",
        keyTakeaways: [
          "More negative camber = more cornering grip, less braking grip",
          "Rear camber should be 1-2° less negative than front",
          "Slight front toe-out sharpens turn-in",
          "Rear toe-in is essential for high-speed stability",
          "Use tyre wear to validate camber settings"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      }
    ]
  },
  {
    level: "Advanced",
    icon: "GraduationCap",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
    description: "Fine-tuning for pace, consistency, and race strategy.",
    modules: [
      {
        title: "Damper Tuning: Bump & Rebound",
        duration: "12 min",
        summary: "Dampers control transient behavior — how the car responds to inputs and bumps. The final 2% of pace.",
        keyTakeaways: [
          "Bump controls compression — softer for kerbs, stiffer for crests",
          "Rebound controls extension — too stiff causes hydraulic jacking",
          "Low-speed bump = body motion, high-speed bump = kerbs",
          "Rebound:bump ratio of 1.5-2:1 is a common starting point",
          "Dampers are the LAST thing to adjust, not the first"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "Spring Rates & Weight Transfer",
        duration: "10 min",
        summary: "Springs control the platform. The right spring rate keeps your aero working and your tyres loaded.",
        keyTakeaways: [
          "Softer = more mechanical grip, more body roll",
          "Stiffer = faster response, less forgiving over bumps",
          "F/R spring ratio controls pitch behavior",
          "High-downforce cars need stiff springs to maintain ride height",
          "Rear-engine cars (Porsche) run stiffer rear springs"
        ],
        action: { label: "Read Full Guide", href: "/setup-guide" }
      },
      {
        title: "Fuel Strategy & Tyre Management",
        duration: "10 min",
        summary: "Setup isn't just about pace — it's about making the tyres and fuel last the distance.",
        keyTakeaways: [
          "Fuel mapping can save 10-15% — enough for one fewer pit stop",
          "Tyre compound choice depends on track temp and stint length",
          "Monitor tyre temps through a stint — degradation is non-linear",
          "Softer setups are often faster over a stint even if slower on one lap",
          "Use session logs to correlate setup changes with stint performance"
        ],
        action: { label: "Open Fuel Calculator", href: "/saved-setups?tab=fuel" }
      },
      {
        title: "Setup Methodology: The Process",
        duration: "15 min",
        summary: "A structured approach to building a setup from scratch. Stop guessing, start method-ing.",
        keyTakeaways: [
          "Step 1: Set pressures and fuel — get the baseline right",
          "Step 2: Fix balance with ARBs — biggest impact, easiest change",
          "Step 3: Tune aero for the track — wing levels per circuit",
          "Step 4: Geometry for tyre wear and response",
          "Step 5: Dampers last — the final 2%",
          "Always change ONE thing at a time"
        ],
        action: { label: "Open Methodology", href: "/methodology" }
      }
    ]
  }
];