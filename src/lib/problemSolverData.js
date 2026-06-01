export const PROBLEM_CATEGORIES = [
  "Corner Entry", "Mid-Corner", "Corner Exit", "Braking", "Traction", "Tyre Wear", "Stability", "Transitional"
];

export const PROBLEMS = [
  {
    id: "entry_us_slow",
    title: "Entry Understeer — Slow Corners",
    category: "Corner Entry",
    condition: "Low-speed corners (1st–2nd gear)",
    severity: "high",
    description: "The front refuses to rotate on turn-in at slow corners. Needs earlier braking and more steering angle than should be necessary.",
    symptoms: [
      "Car pushes to the outside on turn-in",
      "Need to brake earlier than feels right",
      "Front tyres squealing during initial rotation",
      "Steering feels numb near the apex"
    ],
    fixes: [
      { priority: 1, action: "Shift brake bias rearward 1–2%", why: "More trail-brake capability — keeping brake on longer allows weight to stay on the front, improving front grip during turn-in" },
      { priority: 2, action: "Soften front ARB 1–2 clicks", why: "More front roll increases contact patch load on the outside front tyre, adding mechanical grip" },
      { priority: 3, action: "Add front toe-out 0.1–0.2mm", why: "Toe-out creates a more aggressive initial turn-in response as each front wheel steers into the corner independently" },
      { priority: 4, action: "Increase front bump damping 1 click", why: "More front bump resistance keeps weight on the front tyres longer during braking approach, improving turn-in grip" },
      { priority: 5, action: "Soften front spring rate 5–10%", why: "More compliant front allows the tyre to conform to the road better, improving contact under load" },
      { priority: 6, action: "Reduce diff coast lock 5%", why: "Less coast lock allows the inner rear to free up, helping the car rotate naturally under lift-off" }
    ],
    notApply: "High-speed corners — different fix required. Also check tyre pressures are not over-inflated before making mechanical changes."
  },
  {
    id: "entry_us_high",
    title: "Entry Understeer — High-Speed Corners",
    category: "Corner Entry",
    condition: "Fast sweepers and high-speed sections",
    severity: "high",
    description: "At high-speed corners the car doesn't want to change direction. Runs wide even with early steering input. This is primarily an aero and platform problem.",
    symptoms: [
      "Car runs wide at fast sweepers even with early steering",
      "Feels like driving on ice at 200+ km/h",
      "Front end feels completely absent at high speed",
      "Car wants to go straight regardless of steering input"
    ],
    fixes: [
      { priority: 1, action: "Add front wing/splitter 1 click", why: "The most direct solution — more front downforce adds front grip directly where it's needed at speed" },
      { priority: 2, action: "Increase caster angle", why: "More caster generates dynamic camber gain as you steer, which significantly increases front cornering grip at speed" },
      { priority: 3, action: "Lower front ride height 1mm", why: "Lower front increases splitter efficiency and front downforce, directly addressing high-speed front grip" },
      { priority: 4, action: "Check front tyre pressures aren't over 0.5 PSI above target", why: "Over-inflation reduces the contact patch area which is critical at high speed where you need maximum rubber on the road" },
      { priority: 5, action: "Soften front ARB 1 click", why: "Allows the outside front tyre to load progressively in high-speed sweepers rather than peaking and releasing" }
    ],
    notApply: "If the issue is only in slow corners, this is not an aero problem — see Entry Understeer (Slow Corners)."
  },
  {
    id: "mid_corner_us",
    title: "Mid-Corner Understeer",
    category: "Mid-Corner",
    condition: "Any speed — steady-state cornering",
    severity: "medium",
    description: "Car is fine entering but progressively pushes wide through the middle of the corner at constant throttle. The classic 'it doesn't turn' problem.",
    symptoms: [
      "Car drifts wide mid-corner on constant throttle",
      "Front tyres overheating on outer edge",
      "Need to lift to get the car to rotate to the apex",
      "Consistent understeer that's predictable but slow"
    ],
    fixes: [
      { priority: 1, action: "Soften rear ARB 1–2 clicks", why: "The primary mid-corner balance tool. Softening the rear ARB allows more rear roll, which loads the outside rear and creates natural rotation toward the apex" },
      { priority: 2, action: "Increase front negative camber 0.2°", why: "More camber improves cornering grip when the front tyre is at maximum lean angle mid-corner" },
      { priority: 3, action: "Reduce diff coast lock 5–10%", why: "Less coast lock allows the inner rear wheel to speed up slightly, helping the car rotate under partial throttle" },
      { priority: 4, action: "Stiffen front ARB 1 click", why: "This seems counterintuitive but slightly more front ARB stiffness can improve front contact patch loading by reducing excessive front roll" },
      { priority: 5, action: "Add rear toe-in 0.1mm", why: "More rear toe-in provides additional rear mechanical grip that supports the balance without adding oversteer" }
    ],
    notApply: "Don't confuse with entry understeer — the car must be fine on entry. If it's understeering on entry AND mid-corner, fix the entry issue first."
  },
  {
    id: "exit_us",
    title: "Exit Understeer (Push on Power)",
    category: "Corner Exit",
    condition: "Under acceleration",
    severity: "medium",
    description: "Car pushes to the outside of the corner when applying throttle on exit. Loses traction or pushes wide, costing exit speed.",
    symptoms: [
      "Car runs wide when applying gas after the apex",
      "Front tyres scrubbing on corner exit",
      "TC cutting in, car going sideways instead of forwards",
      "Can't get on throttle as early as needed"
    ],
    fixes: [
      { priority: 1, action: "Reduce diff power lock 5–10%", why: "Less locking allows the inner rear wheel to spin slightly, which helps the car rotate and follow the exit line rather than tracking straight" },
      { priority: 2, action: "Stiffen rear ARB 1 click", why: "More rear ARB stiffness helps the car rotate on exit by resisting rear compliance under load" },
      { priority: 3, action: "Soften front ARB 1 click", why: "Less front resistance allows the front wheels to track the road better as the car rotates under power" },
      { priority: 4, action: "Raise front ride height 1mm", why: "Slightly less front downforce shifts the aero balance rearward, reducing the front push effect under acceleration" },
      { priority: 5, action: "Check throttle technique — ensure fully at apex before full gas", why: "Applying throttle before the apex causes forward weight transfer that kills front grip. The car should be pointing straight before full gas." }
    ],
    notApply: "If the car is also spinning on exit, see Power Oversteer — these are different problems."
  },
  {
    id: "entry_os",
    title: "Entry Oversteer — Rear Slides on Turn-In",
    category: "Corner Entry",
    condition: "During braking into corner",
    severity: "high",
    description: "The rear steps out during braking into corners. Car wants to rotate too aggressively or snap sideways on initial turn-in.",
    symptoms: [
      "Rear slides under trail-braking",
      "Car rotates faster than intended on corner entry",
      "Having to catch the rear with opposite lock",
      "Happens predictably at the same corners"
    ],
    fixes: [
      { priority: 1, action: "Move brake bias forward 1–2%", why: "More front brake force reduces rear brake input below the lockup threshold, preventing the rear from stepping out under braking" },
      { priority: 2, action: "Increase rear toe-in 0.1–0.2mm", why: "More rear toe-in creates directional stability and resists yaw rotation during braking" },
      { priority: 3, action: "Increase diff coast lock 5%", why: "More coast lock connects the rear wheels under deceleration, providing more collective rear braking stability" },
      { priority: 4, action: "Stiffen rear spring rate 5%", why: "Stiffer rear spring resists the squat that makes the rear unstable under braking" },
      { priority: 5, action: "Stiffen rear rebound 1 click", why: "Slower rear extension rate after bumps prevents sudden rear unloading that can trigger entry snap" }
    ],
    notApply: "Don't confuse with lift-off oversteer — that happens when releasing throttle, not under braking."
  },
  {
    id: "mid_corner_os",
    title: "Mid-Corner Oversteer",
    category: "Mid-Corner",
    condition: "Steady-state cornering",
    severity: "medium",
    description: "The rear progressively rotates through the corner at constant throttle or when coasting. Predictable but requires constant correction.",
    symptoms: [
      "Rear slowly drifts outward through long corners",
      "Constant counter-steering needed",
      "Car is on the absolute limit in medium-speed bends",
      "Front end feels fine but rear can't hold on"
    ],
    fixes: [
      { priority: 1, action: "Stiffen rear ARB 1–2 clicks", why: "More rear ARB directly resists body roll that leads to rear tyre overload — the most targeted fix for mid-corner oversteer" },
      { priority: 2, action: "Add rear wing 1 click", why: "More rear downforce directly adds rear grip where it's needed — the most effective fix at speeds above 120 km/h" },
      { priority: 3, action: "Increase rear toe-in 0.1mm", why: "Rear toe-in provides passive stability by resisting yaw rotation during cornering" },
      { priority: 4, action: "Stiffen rear spring rate 5%", why: "Less rear squat under load keeps the rear geometry more consistent through the corner" },
      { priority: 5, action: "Increase rear ride height slightly", why: "More rear rake increases diffuser efficiency and rear downforce without significant drag penalty" }
    ],
    notApply: "If the oversteer only happens when applying power, see Power Oversteer — different cause and different fix."
  },
  {
    id: "power_os",
    title: "Power Oversteer (Exit Rotation Under Throttle)",
    category: "Corner Exit",
    condition: "Under acceleration, corner exit",
    severity: "high",
    description: "The rear breaks loose when applying throttle coming out of a corner. Can be triggered by TC intervention or natural wheelspin.",
    symptoms: [
      "Rear snaps sideways on hard throttle application",
      "TC cutting in heavily and causing unsettled behavior",
      "Car spins on corner exit, especially slower corners",
      "Worse in cool conditions before tyres are up to temp"
    ],
    fixes: [
      { priority: 1, action: "Increase diff power lock 5–10%", why: "More locking connects both rear wheels, spreading the torque and preventing single-wheel wheelspin that triggers the snap" },
      { priority: 2, action: "Soften rear ARB 1–2 clicks", why: "More rear compliance allows the suspension to absorb the weight transfer under acceleration, giving the tyre more load" },
      { priority: 3, action: "Increase TC by 1–2", why: "More TC protection while developing technique. The fastest setup has low TC, but a spinning setup is slower than TC-assisted." },
      { priority: 4, action: "Check rear tyre pressures aren't too low", why: "Under-inflated rear tyres have less structural rigidity and break away more suddenly under power" },
      { priority: 5, action: "Smooth throttle technique — squeeze, don't stamp", why: "Application rate is the #1 cause of power oversteer. Smooth throttle application gives the diff time to work." }
    ],
    notApply: "If oversteer happens before throttle application, see Entry Oversteer or Lift-Off Oversteer."
  },
  {
    id: "liftoff_os",
    title: "Lift-Off / Snap Oversteer",
    category: "Transitional",
    condition: "When releasing throttle or completing trail-brake",
    severity: "critical",
    description: "Car snaps into sudden, violent oversteer when lifting off the throttle or completing trail-braking. The most dangerous handling issue — usually results in a spin.",
    symptoms: [
      "Car snaps suddenly when you release the throttle mid-corner",
      "Violent rotation that's impossible to catch",
      "Happens at trail-brake completion — when throttle transitions to steady state",
      "Worse with lower diff coast settings"
    ],
    fixes: [
      { priority: 1, action: "Increase diff coast lock 5–10%", why: "The most direct fix. More coast lock prevents the sudden rear unloading by keeping both rear wheels connected through the deceleration phase" },
      { priority: 2, action: "Stiffen rear rebound damping 2 clicks", why: "Slower rear suspension return after bumps prevents the sudden weight shift forward that pitches the weight off the rear" },
      { priority: 3, action: "Increase diff preload", why: "Higher preload means the diff is always partially locked — this smooths the transition from coast to power and eliminates the snap point" },
      { priority: 4, action: "Soften front rebound 1 click", why: "Slower front weight transfer means the nose-dive is more gradual, giving the driver more warning and time to react" },
      { priority: 5, action: "Increase rear toe-in 0.1mm", why: "Passive yaw stability helps resist the initial rotation that triggers snap oversteer" },
      { priority: 6, action: "Practice smooth lift-off technique — modulate, don't snap", why: "Any abrupt throttle release creates a transient weight shift. Slow, deliberate throttle release dramatically reduces snap oversteer risk." }
    ],
    notApply: "This is the most serious handling issue — prioritize fixing it above all else. Don't try to drive around it with technique alone."
  },
  {
    id: "traction_loss",
    title: "Traction Loss / Wheelspin (Slow Corners)",
    category: "Traction",
    condition: "Slow corner exits, 1st–2nd gear",
    severity: "medium",
    description: "Inside rear tyre spinning on slow corner exits. Car moves sideways instead of forward. TC cutting power excessively.",
    symptoms: [
      "Inside rear spinning on exit",
      "TC cutting power aggressively mid-exit",
      "Car steps sideways on corner exit",
      "Worse when crossing inside kerbs"
    ],
    fixes: [
      { priority: 1, action: "Increase diff power lock 5–10%", why: "Connecting both rear wheels forces the torque to spread across both tyres, eliminating single-wheel spin" },
      { priority: 2, action: "Soften rear spring rate 5–10%", why: "More rear compliance allows the inside wheel to remain in contact with the road through the weight transfer" },
      { priority: 3, action: "Soften rear bump damping 1–2 clicks", why: "Better kerb absorption keeps both rear tyres on the ground when traversing inside kerbs on exit" },
      { priority: 4, action: "Increase rear ride height 1mm", why: "More rear downforce improves rear mechanical grip on corner exit" },
      { priority: 5, action: "Apply throttle earlier but more gently", why: "Earlier but smoother throttle application uses the diff's locking effect before maximum torque is applied" }
    ],
    notApply: "In cold conditions, traction loss is often a temperature issue — wait for tyres to come in before adjusting setup."
  },
  {
    id: "front_graining",
    title: "Front Tyre Graining",
    category: "Tyre Wear",
    condition: "Early in stint, especially cold conditions",
    severity: "medium",
    description: "Front tyres tearing and developing grain — visible rubber chunks. Grip falls off rapidly in the first 5–10 laps.",
    symptoms: [
      "Front tyre temps very high on inner edge",
      "Grip level drops after 5 laps",
      "Visible chunking/tearing on tyre surface",
      "Handling changes dramatically lap to lap"
    ],
    fixes: [
      { priority: 1, action: "Reduce front tyre pressure 0.3–0.5 PSI", why: "Lower pressure spreads the contact patch and reduces the peak shear stress at the tyre contact zone that causes tearing" },
      { priority: 2, action: "Reduce front negative camber 0.2–0.3°", why: "Less camber reduces edge-loading on the tyre inner edge, spreading the load more evenly across the contact patch" },
      { priority: 3, action: "Build tyre temps over 2 slow laps before pushing", why: "This is the #1 cause. Cold rubber tears under racing inputs. Two installation laps prevent graining on new tyres." },
      { priority: 4, action: "Soften front ARB 1 click", why: "Reduces peak loads on front tyres in corners, preventing the overloading that initiates graining" },
      { priority: 5, action: "Reduce front toe-out slightly", why: "Less toe-out reduces tyre scrub which generates the heat differential that leads to graining" }
    ],
    notApply: "Graining on all four tyres simultaneously is a compound choice issue, not a setup issue."
  },
  {
    id: "rear_graining",
    title: "Rear Tyre Graining",
    category: "Tyre Wear",
    condition: "Throughout stint, usually visible on inner edge",
    severity: "medium",
    description: "Rear tyres graining and degrading. Usually caused by excess camber, too much mechanical load, or overworking under acceleration.",
    symptoms: [
      "Rear instability that gets progressively worse",
      "Inner edge of rear tyre overheating significantly",
      "Rear graining visible in replays",
      "Stability decreases after lap 8–10"
    ],
    fixes: [
      { priority: 1, action: "Reduce rear negative camber 0.2°", why: "Excess camber causes inner edge overloading which tears the rubber on the heavily-loaded outside rear tyre" },
      { priority: 2, action: "Increase rear tyre pressure 0.3–0.5 PSI", why: "Slightly higher pressure helps reduce the sidewall flex that contributes to heat cycling and graining" },
      { priority: 3, action: "Reduce diff power lock slightly", why: "Less power lock reduces the heat generated at rear tyres under traction — the tyre doesn't experience as extreme load spikes" },
      { priority: 4, action: "Soften rear ARB 1 click", why: "Less ARB stiffness reduces peak lateral loads on rear tyres during cornering" },
      { priority: 5, action: "Reduce TC intervention (increase TC number in ACC)", why: "TC cutting in repeatedly creates heat cycles that accelerate graining progression" }
    ],
    notApply: "If rear temps are uniform across the contact patch, this isn't a camber or ARB issue — review differential and driving style."
  },
  {
    id: "high_speed_instability",
    title: "High-Speed Straight-Line Instability",
    category: "Stability",
    condition: "Straight-line running at maximum speed",
    severity: "high",
    description: "Car is nervous and twitchy at high speeds — particularly under braking for high-speed corners or on straight-line speed runs. Feels like it wants to swap ends.",
    symptoms: [
      "Car darts under heavy braking approaching fast corners",
      "Rear feels loose at 220+ km/h",
      "Micro-corrections needed constantly on straights",
      "One side feels lighter than the other at speed"
    ],
    fixes: [
      { priority: 1, action: "Add rear wing 1–2 clicks", why: "More rear downforce directly provides high-speed stability — the single most effective intervention" },
      { priority: 2, action: "Increase rear toe-in 0.1mm", why: "More rear toe-in creates directional stability and passive yaw resistance at high speed" },
      { priority: 3, action: "Check rear tyre pressures aren't too low", why: "Under-inflated rear tyres have reduced structural rigidity at high speed, creating instability and sidewall flex" },
      { priority: 4, action: "Increase diff preload", why: "Higher preload connects the rear wheels more solidly, providing a more cohesive rear axle at high speed" },
      { priority: 5, action: "Stiffen rear spring rate slightly", why: "More platform rigidity reduces the small movements that become amplified at high speed" }
    ],
    notApply: "If instability only occurs at a specific corner, this is a corner-specific issue not a general high-speed problem."
  },
  {
    id: "transitional_instability",
    title: "Transitional Instability (Chicanes / S-Bends)",
    category: "Transitional",
    condition: "Rapid direction changes",
    severity: "medium",
    description: "Car unstable when changing direction quickly at chicanes or S-bends. Rear oscillates or steps out between the two apices.",
    symptoms: [
      "Rear slides when switching from left to right",
      "Car oscillates through S-bends",
      "Rear steps out at the second apex in chicanes",
      "Feels like the car is too loose in the middle of direction changes"
    ],
    fixes: [
      { priority: 1, action: "Stiffen rear bump AND rebound 1 click each", why: "Controlling both compression and extension prevents the rear from oscillating — the suspension can't store and release energy between direction changes" },
      { priority: 2, action: "Increase rear toe-in 0.1–0.2mm", why: "Rear toe-in resists the yaw rotation generated during rapid direction changes" },
      { priority: 3, action: "Increase diff preload", why: "Creates a more solid rear axle connection, reducing the oscillation that builds between direction changes" },
      { priority: 4, action: "Stiffen rear spring rate 5%", why: "Less rear compliance reduces the side-to-side movement during transitions" },
      { priority: 5, action: "Steer the second apex, not the first", why: "The most common technique error in chicanes — prioritize the second apex. Take the first apex early to get a clean run to the exit." }
    ],
    notApply: "If both apices are problematic separately, you have different entry and exit issues. Solve them individually."
  },
  {
    id: "rear_lockup",
    title: "Rear Lockup Under Braking",
    category: "Braking",
    condition: "Heavy braking zones",
    severity: "high",
    description: "Rear wheels locking under hard braking, causing dangerous rotation into corners. Car rotates when you want it to go straight.",
    symptoms: [
      "Rear locks and car snaps under hard braking",
      "ABS triggering on rear wheels first",
      "Car rotates toward the inside of the corner under braking",
      "Need to modulate brakes rather than applying full pressure"
    ],
    fixes: [
      { priority: 1, action: "Move brake bias forward 1–2%", why: "Shifting bias forward is the most direct solution — reduces rear brake force below the lockup threshold" },
      { priority: 2, action: "Increase ABS by 1", why: "More ABS intervention specifically prevents wheel lock — effective in mixed conditions where grip levels vary" },
      { priority: 3, action: "Check rear tyre pressures not too low", why: "Under-inflated tyres have reduced braking capacity, making rear lockup more likely under peak braking forces" },
      { priority: 4, action: "Open rear brake duct 1 step", why: "Cooler rear brakes have more consistent bite — overheated rears lose bite consistency and lock more easily" }
    ],
    notApply: "Check that ABS isn't already at maximum before adjusting brake bias — combine both interventions."
  },
  {
    id: "front_lockup",
    title: "Front Lockup Under Braking",
    category: "Braking",
    condition: "Heavy braking zones",
    severity: "medium",
    description: "Front wheels locking under braking, causing straight-line push and longer stopping distances.",
    symptoms: [
      "Front tyres screeching under braking",
      "Car goes straight despite steering input",
      "ABS pumping heavily on the front",
      "Temperature spike on front brake discs"
    ],
    fixes: [
      { priority: 1, action: "Move brake bias rearward 1%", why: "Less front bias reduces front brake force to below the peak friction threshold" },
      { priority: 2, action: "Open front brake duct 1 step", why: "Cooler front brakes provide more consistent stopping force — overheated fronts fade and lock more under peak loads" },
      { priority: 3, action: "Check front tyre pressures aren't over-inflated", why: "Over-inflated front tyres reduce braking contact patch area, increasing lockup tendency" },
      { priority: 4, action: "Progressive brake release — don't snap off the pedal", why: "Sudden brake release can cause weight transfer shocks that momentarily overload the front tyre" }
    ],
    notApply: "If both front and rear are locking, overall brake force is too high — reduce max brake pressure setting."
  },
  {
    id: "kerb_sensitivity",
    title: "Kerb Sensitivity / Bumpy Circuit",
    category: "Stability",
    condition: "Over kerbs, bumpy surfaces",
    severity: "medium",
    description: "Car becomes unsettled over kerbs or bumpy road surfaces. Lateral instability or loss of control after hitting kerbs.",
    symptoms: [
      "Car jumps sideways when hitting inside kerbs",
      "Bouncing over sausage kerbs causes spin or loss of control",
      "Handling feels unpredictable over bumpy sections",
      "Can't use kerbs as aggressively as needed"
    ],
    fixes: [
      { priority: 1, action: "Soften front and rear bump damping 1–2 clicks", why: "Softer bump absorbs the initial kerb impact rather than transmitting the force directly into the chassis and destabilizing the car" },
      { priority: 2, action: "Soften front spring rate 5%", why: "More compliant front allows the wheel to move over bumps without lifting the rest of the car off the ground" },
      { priority: 3, action: "Increase ride height front and rear 1–2mm", why: "More clearance between the floor and ground reduces the risk of the car bottoming out on aggressive kerbs" },
      { priority: 4, action: "Soften rear ARB 1 click", why: "Softer rear ARB allows each rear wheel to move independently over bumps — less likely to transmit the disturbance across the axle" },
      { priority: 5, action: "Stiffening rebound slightly (1 click) after softening bump", why: "After the wheel absorbs the bump, controlled rebound prevents the car from bouncing back up — improving stability post-kerb" }
    ],
    notApply: "Sausage kerbs in sim can be impossible to use in some cars — if all adjustments fail, avoid them entirely."
  },
  {
    id: "trail_braking",
    title: "Inconsistent Trail-Braking Response",
    category: "Corner Entry",
    condition: "During trail-braking entry technique",
    severity: "medium",
    description: "Trail-braking produces unpredictable results — sometimes pushes, sometimes snaps. Difficult to find a consistent entry window.",
    symptoms: [
      "Car alternately understeers or oversteers when trail-braking",
      "Entry window is very narrow — hard to reproduce the same lap",
      "Small changes in brake release rate cause big attitude changes",
      "Car feels different on every lap through the same corner"
    ],
    fixes: [
      { priority: 1, action: "Reduce ABS by 1", why: "Less ABS intervention gives more pedal feel and control for fine brake modulation — this is essential for consistent trail-braking" },
      { priority: 2, action: "Set diff coast to mid-range (35–45%)", why: "The diff coast setting determines the trail-brake response window. Too low snaps, too high understeers — medium gives the widest, most forgiving window" },
      { priority: 3, action: "Set brake bias to neutral (57–59%)", why: "Extreme bias in either direction makes the trail-brake window narrower. A neutral setup gives the widest window for skill development" },
      { priority: 4, action: "Soften front bump damping 1 click", why: "Allows the front to load up progressively under trail-braking rather than reacting suddenly, widening the technique window" },
      { priority: 5, action: "Soften rear rebound 1 click", why: "Allows the rear to settle gradually as the brake is released, making the transition from trail-braking to apex smoother" }
    ],
    notApply: "If you're new to trail-braking, start with higher ABS and softer setup settings. Reduce both gradually as technique improves."
  },
  {
    id: "tyre_overheating",
    title: "Tyre Overheating / Blistering",
    category: "Tyre Wear",
    condition: "Hot ambient conditions or after extended hard running",
    severity: "high",
    description: "Tyres overheating and blistering, causing rapid degradation and a performance cliff. Often seen in hot ambient conditions or with aggressive setup.",
    symptoms: [
      "Tyre temps consistently above 105°C",
      "Blistering visible on tyre surfaces",
      "Performance cliff after 8–12 laps",
      "Grip level drops dramatically mid-stint"
    ],
    fixes: [
      { priority: 1, action: "Increase tyre pressures 0.3–0.5 PSI", why: "Higher pressure helps dissipate heat from the tyre carcass more efficiently, reducing the peak temperature reached" },
      { priority: 2, action: "Reduce camber by 0.2° front and rear", why: "Less camber spreads the contact patch over a larger area, distributing the thermal load more evenly and reducing hot spots" },
      { priority: 3, action: "Soften front and rear ARBs 1 click", why: "Less ARB stiffness reduces the peak lateral loads in corners, which are the primary heat generators" },
      { priority: 4, action: "Reduce engine map 1 step", why: "Less torque output reduces rear tyre load and heat generation, particularly helping rear blistering" },
      { priority: 5, action: "Consider harder compound if racing series allows", why: "A harder compound has a higher optimal operating temperature range and resists blistering — designed for exactly these conditions" }
    ],
    notApply: "If only one tyre position is overheating, it's a balance issue not a general temperature problem."
  },
  {
    id: "understeer_wet",
    title: "Persistent Understeer in Wet Conditions",
    category: "Stability",
    condition: "Wet track surface",
    severity: "high",
    description: "Car pushes severely in wet conditions. Front end refuses to respond, particularly in low and medium speed sections.",
    symptoms: [
      "Car is undriveable in the wet — just goes straight",
      "Can't carry any speed through corners",
      "Front feels completely absent in wet",
      "TC cutting in immediately on corner exit"
    ],
    fixes: [
      { priority: 1, action: "Reduce all tyre pressures 1.5–2 PSI (or 10–15 kPa)", why: "Lower pressures in the wet maximize the contact patch in conditions where grip is already dramatically reduced" },
      { priority: 2, action: "Reduce front camber by 0.5° (toward zero)", why: "Less camber means more contact patch area on a slippery surface — the opposite principle from dry conditions" },
      { priority: 3, action: "Increase TC setting significantly (3–4 higher than dry)", why: "TC prevents wheelspin on corner exit that compounds the understeer by destabilizing the car further" },
      { priority: 4, action: "Soften front and rear ARBs to minimum", why: "Maximum mechanical compliance in the wet keeps all four tyres in contact with the road as long as possible" },
      { priority: 5, action: "Open brake ducts both axles", why: "Brakes cool quickly in wet conditions — cooler brakes provide more consistent stopping force" }
    ],
    notApply: "Wet understeer that's only at corner entry is a driving style issue — smooth inputs, trail-braking must be reduced in the wet."
  }
];