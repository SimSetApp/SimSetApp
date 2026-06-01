export const TUNING_ARTICLES = [
  {
    id: "springs",
    title: "Springs & Platform Control",
    category: "Mechanical",
    readTime: "6 min",
    summary: "Springs define the fundamental platform of your car. Setting them correctly before any other mechanical adjustment is essential.",
    sections: [
      {
        heading: "What springs actually do",
        body: "Springs are the only thing supporting the weight of the car. Their rate determines how much the car moves under the forces of cornering, braking, and acceleration. A stiffer spring resists movement more — the body stays flatter, the ride height is maintained, but the tyre has less ability to follow uneven surfaces. A softer spring allows more body motion, which increases mechanical grip potential on rough surfaces but complicates the aerodynamic platform."
      },
      {
        heading: "Front-to-rear spring ratio",
        body: "The ratio of front to rear spring stiffness determines the car's natural tendency to understeer or oversteer. A stiffer front spring relative to the rear creates understeer — the front transfers load faster than the rear, causing the front to reach its traction limit first. Most race cars run the rear stiffer than the front for a slight understeer bias. The ratio is more important than the absolute values — two cars with completely different spring rates can have identical balance if the ratio is the same."
      },
      {
        heading: "Springs and aerodynamics — the hidden interaction",
        body: "For downforce cars, springs must be stiff enough to prevent the aerodynamic load from compressing the suspension excessively at speed. If the car drops 5mm at 200 km/h due to soft springs, your aero map is completely different at that speed than it was at low speed in the garage. This is why GT3 and LMP cars often run surprisingly stiff springs — they need to maintain the ride height that was set in the pits. Too soft and the car gets progressively lower at speed, increasing downforce but also increasing the risk of bottoming out and changing the balance."
      },
      {
        heading: "Natural frequency concept",
        body: "Spring rate alone doesn't tell you how the car behaves — you need to consider the sprung mass. A 100 N/mm spring under a 1500kg car (750kg per axle) has a different frequency than the same spring under a 900kg car. Natural frequency (measured in Hz) is a better metric. Race cars typically target 1.5–2.5 Hz at the front and 1.8–3.0 Hz at the rear. Higher rear frequency relative to front (more 'over-critical') helps prevent the rear from bobbing during acceleration and improves stability."
      },
      {
        heading: "Practical adjustment protocol",
        body: "Start from the default setup. Drive a session and note whether the car feels lazy (soft) or skittish (stiff) over bumps. If the car bottoms out or feels aero-unstable at speed, the springs may be too soft. Increase in 5–10% increments only. The spring rate affects the natural frequency, which in turn determines optimal damper settings — if you change springs significantly, revisit your dampers."
      }
    ]
  },
  {
    id: "dampers",
    title: "Damper Philosophy — High-Speed vs Low-Speed",
    category: "Mechanical",
    readTime: "8 min",
    summary: "Dampers are the most misunderstood component in a race car setup. Understanding the high-speed/low-speed distinction changes everything.",
    sections: [
      {
        heading: "What dampers actually control",
        body: "Springs provide the restoring force — dampers control the rate of motion. Without dampers, a compressed spring would bounce the car back up and the chassis would oscillate indefinitely. The damper converts this energy into heat. The key insight is that 'high-speed' and 'low-speed' in damper terminology refer to the speed of the damper piston, not the speed of the car. You can be stationary and have high damper speed if you hit a sharp kerb."
      },
      {
        heading: "Low-speed bump and rebound",
        body: "Low-speed bump (compression) controls body motion during cornering, braking, and acceleration — the large, slow movements. Increasing low-speed bump slows the rate of weight transfer, making the car more stable but reducing the agility. Low-speed rebound controls how quickly the suspension returns after being compressed under load — how quickly weight transfers back to a corner after braking, for example. Too stiff low-speed rebound slows down the weight transfer responses, which can make the car feel sluggish."
      },
      {
        heading: "High-speed bump and rebound",
        body: "High-speed bump controls the response to sharp, fast inputs: kerbs, bumps, road irregularities. Softer high-speed bump allows the wheel to absorb these without transmitting the impact to the chassis. If your car bounces over kerbs or feels like it's skipping, high-speed bump is too stiff. High-speed rebound controls how quickly the wheel returns after a sharp impact. If rebound is too stiff relative to bump, the suspension cannot return before the next bump — this creates 'hydraulic jacking' where the car progressively drops on the bumpy side."
      },
      {
        heading: "The bump-to-rebound ratio",
        body: "A starting ratio of rebound = 1.5 to 2.0× bump is common in circuit racing. Higher rebound relative to bump controls the 'return' of the suspension more carefully, which improves stability but can limit compliance. For rough tracks, reduce rebound relative to bump to allow faster recovery. For smooth tracks, higher rebound provides more platform control."
      },
      {
        heading: "Hydraulic jacking — the hidden danger",
        body: "When rebound damping is too high relative to bump, the suspension cannot return to its natural position between bumps. Over a rough surface, the car progressively rides lower and lower on that corner — this is hydraulic jacking. You may see the car visibly lower on one side after a bumpy section. The fix is to soften rebound or stiffen bump (or both) until the car maintains consistent ride height over consecutive bumps."
      },
      {
        heading: "Practical setup approach",
        body: "Start with low-speed settings. Set them first since they dominate the overall feel on a smooth circuit. Drive a session focused on body control — is the car rolling too much? Are transitions too slow? Then focus on high-speed settings using a circuit with kerbs or bumps. Test kerb absorption specifically. A good damper setup absorbs kerbs without unsettling the car while maintaining body control through normal cornering."
      }
    ]
  },
  {
    id: "arbs",
    title: "Anti-Roll Bars — Balance and Independence",
    category: "Mechanical",
    readTime: "5 min",
    summary: "ARBs are the balance tuning tool of the mechanical package. They only work in corners and have no effect on a straight — making them ideal for targeted adjustments.",
    sections: [
      {
        heading: "How ARBs work",
        body: "An anti-roll bar connects the left and right suspension across an axle. When one side compresses relative to the other (during cornering), the bar twists and transfers some of that load to the opposite side. This reduces body roll but, critically, transfers load from the inner tyre (which is lifting) to the outer tyre (which is being compressed). The outer tyre is already loaded — adding more load to it increases its grip demand and can push it toward its limit."
      },
      {
        heading: "ARBs and tyre load distribution",
        body: "More ARB stiffness = more lateral load transfer = the outer tyre is loaded harder = grip limit is reached sooner on that axle. This is why stiffer front ARB can cause understeer (front axle reaches its limit first) and stiffer rear ARB can cause oversteer (rear axle reaches its limit first). The ARB ratio is the key balance parameter — it's why experienced engineers talk about 'ARB ratio' rather than individual ARB settings."
      },
      {
        heading: "ARBs vs springs for balance",
        body: "Both ARBs and springs affect balance, but ARBs only work in corners while springs affect everything. This is why ARBs are preferred for balance tuning — you can make the car more aggressive in corners without changing straight-line ride quality. Springs affect both. For a car that's wrong in corners but feels fine on straights, adjust the ARB ratio first. If the car is wrong everywhere, look at springs."
      },
      {
        heading: "Wheel independence",
        body: "A very stiff ARB essentially makes the two wheels on an axle act as one unit — if one wheel goes over a bump, the ARB pulls the other wheel up too. This is why very stiff ARBs hurt performance on bumpy circuits. For bumpy tracks, softer ARBs allow each wheel to move more independently, maintaining contact with the road even when the surface is uneven. This is the primary reason teams run softer ARBs at circuits like the Nürburgring Nordschleife."
      }
    ]
  },
  {
    id: "aerodynamics",
    title: "Aerodynamics, Rake, and Aero Maps",
    category: "Aerodynamics",
    readTime: "7 min",
    summary: "Modern race car aerodynamics are far more complex than just wing angle. Understanding rake, aero maps, and balance shifts changes how you approach setup.",
    sections: [
      {
        heading: "Downforce vs drag — the fundamental trade-off",
        body: "Every aerodynamic surface generates lift (or downforce, which is negative lift) and drag. More downforce generally means more drag — except in specific situations where clever aerodynamics can generate downforce without a proportional drag penalty. Wing angle is the simplest adjustment: more angle = more downforce and more drag. The art is finding the optimal balance for each circuit based on the relative importance of corner speed vs straight-line speed."
      },
      {
        heading: "Rake angle — the most underrated aero tool",
        body: "Rake is the difference in ride height between the front and rear of the car. Most race cars run the front lower than the rear — this positive rake creates a wedge shape that dramatically increases the efficiency of the underbody diffuser at the rear. The diffuser accelerates air under the car, creating significant downforce without a drag penalty. Even 3–5mm of additional rake can produce measurable rear downforce increases. This is why front ride height adjustments affect balance dramatically — you're moving the rake, not just the front downforce."
      },
      {
        heading: "Ground effect and diffuser sensitivity",
        body: "As the car gets closer to the ground, the underbody flow accelerates (reduced cross-sectional area, conservation of mass flow). This increases downforce significantly — but there's a cliff. Too low and the flow separates, losing downforce suddenly. This 'stall' behavior is dangerous at speed. Most sim physics models this — you'll feel a sudden loss of stability if the car drops too low, usually when crossing a compression on the circuit."
      },
      {
        heading: "Aero balance shifts with speed",
        body: "A critical concept often missed: the aero balance (front/rear distribution) changes with speed. A wing that produces 40% front / 60% rear downforce at 150 km/h may produce 38% / 62% at 250 km/h if the rear wing is more efficient at high speed. This means a setup that's perfectly balanced at medium speed can develop oversteer at high speed. If your car feels neutral in slow corners but nervous in fast sweepers, this may be the cause — add a click of front wing."
      },
      {
        heading: "Aero sensitivity and setup progression",
        body: "Some cars are more 'aero-sensitive' than others — small wing changes have a large effect on balance. LMP cars and hypercars are extremely aero-sensitive. GT3 cars are less so. Understanding your car's sensitivity determines whether to make changes in 1-click or 2-click increments. Always test both directions from your current setting to understand the sensitivity before committing to a direction."
      }
    ]
  },
  {
    id: "tyres",
    title: "Tyre Modelling, Heat Cycles & Pressure Theory",
    category: "Tyres",
    readTime: "6 min",
    summary: "Tyres are the interface between car and track. Understanding how they generate grip, overheat, and degrade is fundamental to every setup decision.",
    sections: [
      {
        heading: "How tyres generate grip",
        body: "Racing tyres generate grip through two primary mechanisms: mechanical interlocking (the rubber deforming around micro-surface irregularities) and adhesion (molecular bonding between rubber and road). The optimal temperature window activates both mechanisms — too cold and the rubber is too stiff to conform and bond properly; too hot and the rubber degrades faster than it can bond. This is why tyre temperature management is a core skill."
      },
      {
        heading: "The tyre temperature window",
        body: "Each tyre compound has an optimal temperature range. For GT3 dry tyres in ACC, this is roughly 80–105°C across the contact patch. Below 70°C, you're losing peak grip. Above 115°C, degradation accelerates dramatically. The 'inside/middle/outside' temperature measurement tells you the temperature distribution across the contact patch — ideally all three readings should be within 10–15°C of each other."
      },
      {
        heading: "Heat cycles and tyre degradation",
        body: "Every time a tyre heats up and cools down, it goes through a heat cycle. The rubber compounds partially oxidize during each cycle, progressively reducing peak grip. A tyre that has been heated 3 times will never produce the same peak grip as a new tyre, even if the temperatures were identical. This is why endurance strategies include 'saving' tyres — keeping them below peak temperature to extend the number of usable laps."
      },
      {
        heading: "Tyre pressure and contact patch",
        body: "Tyre pressure is essentially the spring rate of the tyre sidewall. Too low and the sidewall flexes excessively, generating heat in the carcass rather than the contact patch — leading to blistering from inside out. Too high and the contact patch becomes crown-shaped (the middle touches the road more than the edges), reducing grip and causing overheating of the centre. The ideal pressure maximizes the flat contact patch area while maintaining structural integrity."
      },
      {
        heading: "Cold pressure setting for target hot pressure",
        body: "In sim racing, you set cold pressures in the pits, but the car runs on hot pressures. The difference between cold and hot depends on ambient temperature, track temperature, and car speed. A rough rule: pressures rise approximately 3 PSI (21 kPa) from cold to hot for GT3 cars. To hit 27.5 PSI hot at 25°C ambient on a 35°C track, start cold at around 24.5 PSI. In cold conditions (10°C ambient), add another 0.5–1.0 PSI to the cold setting to compensate for slower heat buildup."
      },
      {
        heading: "Reading tyre temperatures to diagnose setup",
        body: "Inner edge much hotter: too much negative camber. Outer edge much hotter: not enough camber. Centre much hotter: tyre pressure too high. Both edges much hotter than centre: pressure too low. All temperatures too high: compound too soft, loads too high, or pressures need increasing. All temperatures too low: car isn't working the tyres hard enough — may need softer springs or lower pressures to generate heat."
      }
    ]
  },
  {
    id: "differential",
    title: "Differential Theory — Traction, Rotation, and Stability",
    category: "Drivetrain",
    readTime: "5 min",
    summary: "The differential is the traction and rotation control device. Understanding preload, power lock, and coast lock unlocks a whole dimension of car behavior.",
    sections: [
      {
        heading: "Why differentials matter",
        body: "In any corner, the outer wheel must travel a longer distance than the inner wheel. An open differential allows this by letting each wheel spin at different speeds. But an open diff also means that if one wheel loses traction, all the torque goes to that wheel (it's the path of least resistance). A limited-slip differential (LSD) manages this trade-off: it locks the axle progressively as torque/speed differential exceeds a threshold."
      },
      {
        heading: "Preload — the baseline locking force",
        body: "Preload is the minimum locking force applied even when there's no torque difference. Think of it as the diff's 'idle' lock level. Higher preload means the diff behaves more locked at all times — even when coasting or at constant throttle. This creates a more predictable, connected feeling but can make it harder to rotate the car in slow corners where you need the inner wheel to spin freely."
      },
      {
        heading: "Power (acceleration) lock",
        body: "Power lock controls how the diff responds under acceleration. Higher lock means both wheels are forced to turn at the same speed under power, maximizing traction at the cost of some rotation. Lower lock allows some wheelspin on the inner wheel, which helps the car rotate on exit but can cause wheelspin. On rear-engine cars where the weight is already over the rear axle, you can often run higher power lock. Front-engine cars may need lower settings to avoid understeer on exit."
      },
      {
        heading: "Coast (deceleration) lock",
        body: "Coast lock controls the diff response when the engine is overrunning — when you're decelerating or trail-braking. Higher coast lock connects the rear wheels more strongly during deceleration, stabilizing the car under braking. Lower coast lock allows the rear wheels to spin at different speeds during deceleration, which helps rotation under trail-braking. This is why aggressive trail-brakers often prefer low coast lock — the rotation is natural and controllable."
      },
      {
        heading: "The snap oversteer connection",
        body: "Lift-off snap oversteer is almost always a diff issue. When you suddenly lift off the throttle, the engine braking force suddenly loads both rear wheels. If coast lock is too low, the inner rear wheel can lock (engine brake more than the outside due to geometry) while the outer keeps spinning — creating an instantaneous yaw moment that's impossible to catch. Increasing preload and coast lock is the primary fix for snap oversteer."
      }
    ]
  },
  {
    id: "geometry",
    title: "Suspension Geometry — Camber, Toe, and Caster in Depth",
    category: "Geometry",
    readTime: "7 min",
    summary: "Geometry settings define how the tyres sit on the road. Getting them right is the difference between worn edges and a balanced contact patch.",
    sections: [
      {
        heading: "Camber — the lean angle",
        body: "Camber is the angle of the wheel relative to vertical. Negative camber (top of tyre leaning inward) increases cornering grip because when the car rolls in a corner, the negative camber compensates for the geometric camber loss, keeping the tyre flatter on the road surface. However, too much camber reduces straight-line braking and acceleration grip — the tyre contact patch is smaller and the inner edge carries too much load."
      },
      {
        heading: "Dynamic camber vs static camber",
        body: "Static camber is what you set in the pits. Dynamic camber is what the tyre actually experiences in the corner. As the car rolls, the geometry changes — a well-designed suspension system maintains nearly zero dynamic camber on the outer tyre through the suspension range of motion. Caster angle contributes to this: more caster generates additional negative camber on the outside front wheel as the steering wheel is turned."
      },
      {
        heading: "Reading camber via tyre temperatures",
        body: "The inside/middle/outside temperature distribution is the primary diagnostic tool for camber. If the inner edge is consistently 15–20°C hotter than the outer edge, you have too much negative camber. The inner tyre edge is doing most of the work. If the outer is hotter, you need more camber. In practice, a slight inner-edge bias (inner 5–10°C hotter than outer) is normal for race cars — it means the tyre is working slightly more on the loaded side, which is expected."
      },
      {
        heading: "Toe — active vs passive steering",
        body: "Toe is the direction the wheel faces relative to the car's centerline. Toe-in means the front of the tyre points inward. Front toe-out on race cars creates a more aggressive initial turn-in response because the outside front wheel is already slightly pointed into the corner as you begin steering. Too much toe-out creates excess tyre scrub and heat. Rear toe-in is almost universally used on race cars — it creates passive yaw stability that keeps the rear from stepping out under load."
      },
      {
        heading: "Caster — the steering geometry",
        body: "Caster is the forward/backward tilt of the steering axis. More caster creates stronger self-centering (the steering wheel wants to return to center), heavier steering feel, and most importantly, dynamic camber gain as you steer. As the front wheel turns, the geometry causes it to gain negative camber, improving cornering grip. This is 'free' grip — you get better cornering grip without paying the straight-line penalty of more static camber. Most GT3 cars run maximum caster unless weight of steering is an issue."
      }
    ]
  },
  {
    id: "weight_jacking",
    title: "Weight Jacking — Advanced Platform Dynamics",
    category: "Advanced",
    readTime: "5 min",
    summary: "Weight jacking is an advanced damper phenomenon where repeated bumps progressively lower the car. Understanding it explains many mysterious handling changes.",
    sections: [
      {
        heading: "What is weight jacking?",
        body: "Hydraulic jacking (weight jacking) occurs when the rebound damping is set too high relative to the bump damping. Over repeated bumps or kerbs, the suspension cannot extend back to its full travel before the next bump hits. Each successive bump adds a small amount of 'locked' compression. Over several bumps in quick succession — like a series of kerbs, a chicane, or a bumpy section — the car rides progressively lower. This changes the ride height, aero balance, and ground clearance significantly."
      },
      {
        heading: "How to identify weight jacking",
        body: "Weight jacking is identifiable in replays by watching the car's ride height through bumpy sections. If the car visibly drops on one side during a bumpy section and stays low until reaching smooth tarmac, you have jacking. The symptoms are inconsistent handling through bumpy sections — the car feels different on lap 1 through a bumpy complex versus later in the lap when it's 'jacked up' on one corner."
      },
      {
        heading: "The fix",
        body: "Soften the high-speed rebound damping, stiffen the high-speed bump damping (or both). The goal is to ensure the suspension can return to full travel between bumps. A ratio test: with the car on flat ground, bounce each corner. The corner should return to full height in one smooth motion without under-shooting or over-shooting. If it bounces or gets 'stuck' partway, the ratio is wrong."
      },
      {
        heading: "Weight jacking as a tool",
        body: "Paradoxically, some engineers use controlled weight jacking to their advantage. By setting one corner slightly differently, they can fine-tune the aerodynamic balance through high-speed bumpy sections. This is an advanced technique used in series with very detailed aerodynamic models. For most sim racing setups, avoid jacking rather than trying to exploit it."
      }
    ]
  },
  {
    id: "brakes",
    title: "Brake Setup, Temperatures, and Fade",
    category: "Brakes",
    readTime: "4 min",
    summary: "Braking stability is the foundation of consistent lap times. Brake balance and temperature management are core setup tools.",
    sections: [
      {
        heading: "Brake bias and balance",
        body: "Brake bias determines the front-to-rear distribution of braking force. More forward bias (60%+) is safer — if you over-brake, the front locks rather than the rear, and front lock is recoverable. More rearward bias allows shorter braking distances because rear brakes are contributing more, but risk rear lockup under heavy braking. GT3 cars typically run 55–60% front bias. The optimal is circuit-dependent: heavy-braking circuits benefit from slightly more rearward bias."
      },
      {
        heading: "Brake temperature windows",
        body: "Race brakes have a specific operating temperature range — typically 400–800°C for carbon-ceramic discs. Below 300°C, carbon brakes are barely functioning. Above 900°C, they fade and lose bite completely. The goal is to operate in the 400–700°C range for consistent performance. Brake ducts control airflow to the discs — more duct opening = more cooling = lower temperatures."
      },
      {
        heading: "Brake fade",
        body: "Fade occurs when brake temperatures exceed the operating range. The disc glazes and the pad loses friction coefficient. Once fade occurs, it's difficult to recover mid-race. Prevention: open brake ducts before temperatures exceed the upper limit, not after. Monitor duct settings during practice. Fade is more likely late in a stint when the brakes have accumulated heat over many laps."
      },
      {
        heading: "ABS interaction with bias",
        body: "ABS affects how much real-world benefit brake bias changes deliver. With high ABS, the system modulates pedal pressure before lock occurs, limiting the impact of bias changes. With low ABS, bias changes have a more direct effect. Generally, lower ABS allows more precise bias tuning but requires more driver skill. The interaction between ABS and brake bias is a setup choice — choose a combination that suits your driving style."
      }
    ]
  },
  {
    id: "methodology",
    title: "Setup Methodology — Building from Zero",
    category: "Process",
    readTime: "8 min",
    summary: "There's an optimal order for making setup changes. Getting this wrong means you'll adjust one thing and break another. Here's the proper workflow.",
    sections: [
      {
        heading: "Why order matters",
        body: "Setup parameters interact with each other. Changing springs affects the optimal damper settings. Changing ride height affects the aero balance. Changing tyres pressures affects everything. Working in the wrong order means you might fix one thing and break another, then go back and forth indefinitely without converging. The correct approach is to work from the most fundamental parameters to the most sensitive ones."
      },
      {
        heading: "Step 1: Baseline and ride height",
        body: "Start from the manufacturer default. Set ride height first. This determines your aero map — everything downstream depends on it. Set front and rear ride height to achieve your target rake angle (typically 3–8mm more rake than a flat platform). Drive 2–3 laps to confirm the car isn't bottoming out and the ride height is stable at speed."
      },
      {
        heading: "Step 2: Spring rates",
        body: "Once ride height is confirmed, set spring rates. Aim for a natural frequency of 1.8–2.2 Hz front and 2.0–2.5 Hz rear. Adjust to confirm the car feels appropriately responsive — not bouncing or too stiff. The spring ratio determines baseline balance — adjust until the car has a neutral or slight understeer tendency."
      },
      {
        heading: "Step 3: Dampers",
        body: "With springs set, configure dampers. Start with low-speed settings (body motion control), then high-speed (kerb absorption). Low-speed bump should control roll rate without being harsh. Rebound should be 1.5–2× the bump value. Test over the circuit's representative bumps. The car should absorb kerbs without unsettling and return to ride height smoothly."
      },
      {
        heading: "Step 4: Anti-Roll Bars",
        body: "ARBs fine-tune the mechanical balance without changing the spring platform. Use the front-to-rear ratio to address understeer/oversteer. Add front stiffness for more turn-in response, add rear stiffness for more exit rotation. The total ARB stiffness affects bump compliance — softer total ARB is better for bumpy circuits."
      },
      {
        heading: "Step 5: Aerodynamics",
        body: "With the mechanical platform set, tune aerodynamics. Set wing angle based on circuit character (high vs low downforce). Adjust front/rear balance by modifying splitter/front wing relative to rear wing. Test at the key corners for each axle — fast sweepers test rear aero, medium-speed braking zones test front aero."
      },
      {
        heading: "Step 6: Alignment (Camber, Toe, Caster)",
        body: "Alignment is the fine-tuning of geometry. Set maximum caster first (better cornering without straight-line cost). Then set camber using tyre temperature data from your aero-balanced setup — inner/outer should be within 10–15°C. Finally, set toe: slight front toe-out for turn-in, rear toe-in for stability."
      },
      {
        heading: "Step 7: Differential",
        body: "Differential is the last mechanical parameter to tune. With everything else balanced, the diff settings fine-tune traction and rotation. Set preload to control snap oversteer tendency. Set power lock for exit traction. Set coast lock for trail-braking response. The diff interacts heavily with tyre condition — re-evaluate after a full-length stint."
      },
      {
        heading: "Step 8: Tyre pressures and electronics",
        body: "Set cold tyre pressures to achieve your target hot pressures. Use the thermal model or track experience to calibrate. Then set electronics: ABS and TC to suit your driving style and conditions. Only reduce electronics gradually as you gain confidence with the mechanical setup."
      }
    ]
  }
];