// Track map SVGs and key time-loss corner data
// Each corner has a `note` (Pro) and `rookie` object with beginner-friendly content.

export const TRACK_MAPS = {
  "Spa-Francorchamps": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/0e1f17a9c_SpaFrancorchampsTrackMap.svg",
    rookieTip: "Spa is a long, flowing track with big elevation changes. Your biggest enemy here is understeer through fast corners and cold tyres on the first lap. Keep the wing level medium-high so the car feels stable, and don't try to go flat through Eau Rouge until you're confident.",
    keyCorners: [
      {
        name: "Eau Rouge / Raidillon",
        importance: "critical",
        note: "Flat minimum-speed target ~260 km/h GT3. Rear aero load is the limiting factor — any wing deficit manifests as rear snap under lateral load at the compression. Trail-braking into the valley adds front load but risks rear unloading on the climb. Monitor rear tyre temperature delta after — inner rear overtemp indicates excessive slip angle.",
        rookie: {
          what: "A dramatic uphill S-bend taken flat-out. The car compresses hard at the bottom then shoots uphill — it feels very fast and intimidating.",
          inputs: "Don't brake here at all. Keep your hands light on the wheel — small corrections upset the car. Look up to the top of the hill, not the barriers beside you.",
          setup: "Run more rear wing than you think you need. Softer rear anti-roll bar helps the car stay planted. If the rear snaps, add a click of wing first.",
        }
      },
      {
        name: "Pouhon",
        importance: "critical",
        note: "Highest sustained lateral G on the lap (~4.5G GT3). Rear downforce is the hard constraint — insufficient rear wing produces a terminal push/snap transition at mid-corner. Optimal line: early turn-in using all track width, apex ~2/3 through, progressive throttle overlay. Any mid-corner lift initiates pendulum oversteer.",
        rookie: {
          what: "A very fast double-left taken at nearly full speed. Most cars should go flat here but it requires trust in your rear grip.",
          inputs: "Approach on the right side of the track, then sweep left and hold the throttle. If you feel the rear moving, gently lift — don't stab the brakes.",
          setup: "Rear wing setting is critical here. If the car feels nervous, add rear wing. Rear toe-in (pointing slightly inward) also adds high-speed stability.",
        }
      },
      {
        name: "La Source Hairpin",
        importance: "high",
        note: "Braking from ~290 km/h to ~70 km/h in ~80m. Rotation is the priority — use trail braking to keep fronts loaded while the car pivots. Low-speed differential lock directly determines rotation quality; too high = understeer on entry, too low = snap on throttle pickup. Exit vector dictates speed through the Eau Rouge valley.",
        rookie: {
          what: "The opening hairpin — a tight right-hander at the top of the hill. Easy to brake too late and run wide.",
          inputs: "Brake in a straight line, downshift early. Turn in late (later than you think), keep the apex kerb on your left, then accelerate smoothly. Don't rush — a good exit matters more than a fast entry.",
          setup: "A softer differential (lower power lock) helps the car rotate cleanly into this tight corner.",
        }
      },
      {
        name: "Bus Stop Chicane",
        importance: "high",
        note: "Second-apex exit vector determines carry speed onto the pit straight. Trail brake to the first apex to maintain rotation — early throttle application creates understeer at the second turn-in. Brake bias 57–58% front optimal; higher bias risks front lock under the direction change from second to first gear. Kerb contact at the second apex compresses suspension — stiffer bump slows corner entry.",
        rookie: {
          what: "A quick left-right chicane near the end of the lap. It's easy to lock a wheel and run wide.",
          inputs: "Brake firmly in a straight line before entering. Hit the first apex, let the car settle briefly, then accelerate from the second apex. Don't be greedy at the first apex or you'll miss the second.",
          setup: "Medium bump damping helps the car stay composed through the direction change. Rear toe-in prevents the tail from stepping out between the two apices.",
        }
      },
    ]
  },

  "Monza": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/fc406a6f9_MonzaTrackMap.svg",
    rookieTip: "Monza is all about braking. You'll be travelling over 300 km/h and braking to 80 km/h multiple times a lap. The key skill here is braking late but staying in control — not just braking as late as possible. Use low wing to go fast on the straights.",
    keyCorners: [
      {
        name: "Variante del Rettifilo (T1–T2)",
        importance: "critical",
        note: "Maximum deceleration point on the lap — 330→80 km/h in ~90m, peak decel ~5.5G. ABS threshold sensitivity highest here; early ABS trigger from sausage kerb contact causes late apex overshoot. Optimal brake bias 57.5–58.5% front. First apex is compromised by definition — second apex exit vector is the time-critical output. Stiff bump rebound causes brake-hop under peak deceleration.",
        rookie: {
          what: "The first chicane — you brake from maximum speed to nearly a standstill. It's the most dramatic braking point you'll experience.",
          inputs: "Brake early and firmly. Don't attack the kerbs — they will unsettle the car and you'll run wide. Hit the first apex, let the car straighten briefly, then rotate into the second apex.",
          setup: "Open your brake ducts fully — the brakes work extremely hard here. Avoid very stiff bump settings as the car needs to absorb the hard braking load smoothly.",
        }
      },
      {
        name: "Variante della Roggia",
        importance: "critical",
        note: "Approached ~20 km/h faster than T1 — braking zone is shorter (~65m) so threshold braking precision is higher. Exit speed here sets minimum corner speed through both Lesmos. Low-speed diff lock 55–65%: higher reduces rotation at the second apex, costing exit speed. Any kerb strike on the left-rear at the second apex destabilises the car under acceleration.",
        rookie: {
          what: "The second chicane, similar to the first but slightly faster. A clean exit here directly affects how fast you enter the Lesmo corners.",
          inputs: "Same rhythm as Turn 1 — brake, first apex, settle, second apex, accelerate. Focus on a clean exit rather than a heroic entry.",
          setup: "Brake bias around 57–58% front works well here. If fronts are locking under braking, move bias slightly rearward by 0.5%.",
        }
      },
      {
        name: "Ascari Chicane",
        importance: "high",
        note: "Taken at ~220–230 km/h in 4th/5th gear — the car transitions weight laterally twice under partial throttle. Rebound damping stiffness governs how quickly lateral load transfers between the two direction changes; excessive rebound creates oscillation. Run kerbs only at the second apex — first-apex kerb contact at this speed creates vertical momentum that unsettles the suspension geometry.",
        rookie: {
          what: "A faster chicane taken in 4th or 5th gear. The car moves quickly left-right and any nervous inputs will cause oversteer.",
          inputs: "Be smooth — don't jerk the wheel. Keep your steering inputs small and progressive. Carry as much speed as you can without touching the kerbs aggressively.",
          setup: "Stiffer rebound damping helps control the side-to-side body movement through the direction change.",
        }
      },
      {
        name: "Parabolica (Curva Alboreto)",
        importance: "critical",
        note: "Constant-radius 180° arc at ~145 km/h minimum. Exit speed integrates over the entire pit straight — +5 km/h exit = ~0.1s gain before braking for T1. Trail braking to ~70% arc keeps front loaded for rotation. Power diff lock 55–65%: too high creates understeer mid-arc under throttle, causing a wider exit line and understeer scrub. Rear spring rate governs arc stability — stiffer prevents rear squat but reduces traction.",
        rookie: {
          what: "A long, sweeping right-hander that leads onto the main straight. Every extra bit of speed you carry out of here turns directly into a faster lap time.",
          inputs: "Brake before the corner, turn in smoothly, and be patient with the throttle. Apply throttle progressively from the apex — squeezing not stomping. Exit wide to the left side of the track.",
          setup: "A lower power differential lock (around 55–65%) lets the car rotate cleanly on entry. Stiffer rear springs help the car stay planted through the long arc.",
        }
      },
    ]
  },

  "Nürburgring GP": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/18aa153ec_NurburgringGPTrackMap.svg",
    rookieTip: "The GP circuit is very stop-start with heavy braking zones followed by tight corners. Your brakes will get very hot — always open the cooling ducts. Medium-high wing helps the car feel confident through the technical sections.",
    keyCorners: [
      {
        name: "Mercedes Arena (T1 complex)",
        importance: "critical",
        note: "Five geometrically linked corners — each apex compromised by the preceding one. Front ARB stiffness governs balance through the entire sequence; too stiff creates front understeer that compounds through consecutive apices. Braking for T1 sets trajectory through T2 and T3 — an early turn-in at T1 forces a wider line at T2, losing 0.15–0.20s. Compromise line mandatory: sacrifice individual corner performance for sequential flow.",
        rookie: {
          what: "A series of connected corners in the stadium section — it flows left and right and requires the car to be set up for balance, not just grip.",
          inputs: "Look ahead to the next apex at all times. Don't fix one corner at the cost of the next — take a compromise line that lets you flow through all sections. Smooth, progressive throttle throughout.",
          setup: "A balanced car is more important than a fast one here. Medium ARB settings front and rear. Avoid very stiff springs which make the car twitchy through the linked sequence.",
        }
      },
      {
        name: "Michael Schumacher S",
        importance: "high",
        note: "High-speed lateral weight transfer at ~200 km/h — rear compliance under the direction change determines stability. Rear toe-in 0.8–1.0mm provides passive yaw stability; less than 0.6mm risks snap oversteer on weight transfer. Any trailing throttle lift mid-corner initiates rear weight transfer that cannot be recovered at this speed. Rebound damping on the rear axle governs how quickly the car settles between the two direction changes.",
        rookie: {
          what: "A fast S-bend named after the legend himself. Taken at high speed, the rear of the car can feel light as you change direction.",
          inputs: "Commit to the corner and don't lift mid-corner. Keep steering inputs smooth and small. If the rear moves, don't panic — hold the throttle and steer gently back.",
          setup: "Rear toe-in (pointing inward by 0.8–1.0mm) adds passive stability through fast direction changes like this.",
        }
      },
      {
        name: "Hairpin (Ford Kurve)",
        importance: "critical",
        note: "Minimum speed ~55 km/h — longest traction zone on the lap feeding a 600m straight. Power diff lock 65–75%: primary variable for exit traction. Trail braking to the apex keeps front grip for rotation; early throttle with insufficient diff lock produces rear-wheel spin and lateral snap. Rear spring rate influences mechanical traction — softer rear spring increases rear contact patch load under acceleration.",
        rookie: {
          what: "The slowest, tightest corner on the circuit — a classic hairpin. What you do here directly determines your speed down the back straight.",
          inputs: "Brake early, rotate the car in, and wait patiently before applying throttle. Exit traction is the only thing that matters. A late, perfect exit is much better than an early, messy one.",
          setup: "Higher power differential lock (65–75%) maximises traction on exit. Softer rear springs also help the car hook up as you accelerate away.",
        }
      },
      {
        name: "Einfahrt Motodrom",
        importance: "high",
        note: "Direction change at ~130 km/h over a mild kerb — bump damping compliance governs how much the suspension compresses on kerb contact. Rear ARB stiffness determines resistance to yaw between the two apices; too soft allows lateral drift that widens the exit. Exit vector pointing straight for the pit straight by the second apex is critical — any residual steering angle bleeds exit speed.",
        rookie: {
          what: "The final chicane-like section leading back to the main straight. Kerbs here are generous but aggressive use upsets the car.",
          inputs: "Use the kerbs gently — don't ride over them fully. Focus on the exit so you're pointing straight for the pit straight as early as possible.",
          setup: "Softer bump damping absorbs kerb hits. Stiffer rear ARB helps resist the direction change between the two apices.",
        }
      },
    ]
  },

  "Silverstone": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/7ae06fef8_SilverstoneTrackMap.svg",
    rookieTip: "Silverstone has some of the fastest corners in sim racing. The key is trusting the car — many beginners lift when the car is perfectly capable of going flat. Medium wing and a front-end focused setup help you build that confidence.",
    keyCorners: [
      {
        name: "Copse",
        importance: "critical",
        note: "Minimum speed ~265 km/h GT3 — theoretical flat for all GT3 cars with correct wing. Front aero balance governs confidence here: insufficient front downforce creates understeer at turn-in that forces a lift. Front ARB stiffness affects lateral load transfer at entry — too stiff generates understeer under the high lateral G. A single lift here versus flat costs ~0.15s or more.",
        rookie: {
          what: "A fast right-hander at the end of the main straight. Most GT cars can go completely flat here, but it takes time to build trust.",
          inputs: "Approach on the left, then sweep right without braking. Keep your eyes on the exit — where you look is where you'll go. If you need to, a small lift is fine while you build confidence, but aim to eventually hold full throttle.",
          setup: "Front anti-roll bar (ARB) stiffness is key here — it controls how much the nose dips in fast corners. If the front feels uncertain, try a slightly stiffer front ARB.",
        }
      },
      {
        name: "Maggots–Becketts–Chapel",
        importance: "critical",
        note: "Six direction changes at 240–280 km/h over ~800m — definitive aero balance diagnostic section. Any front/rear downforce imbalance amplifies through sequential apices. Optimal line sacrifices Maggots apex for Becketts entry angle — understeer at Maggots creates a chain reaction of compromised apices through Chapel. Steering torque feedback through Becketts indicates real-time lateral load; excessive understeer torque = front aero deficit.",
        rookie: {
          what: "The most famous section of Silverstone — a rapid left-right-left-right taken at very high speed. It feels scary at first but becomes very rewarding once you're in rhythm.",
          inputs: "Don't try to nail every apex on your first attempt. Build up lap by lap. Keep your hands light, use small steering inputs, and focus on rhythm. The car should feel like it's dancing, not fighting.",
          setup: "This section tells you everything about your aero balance. If the car understeers here, add front wing or reduce rear wing. If it oversteers, add rear wing. Medium wing overall works best.",
        }
      },
      {
        name: "Stowe",
        importance: "high",
        note: "~3.5s sustained lateral loading at ~185 km/h — rear tyre thermal degradation accumulates here faster than any other corner. Inner rear tyre temperature delta vs. outer rear after 5+ laps quantifies degradation rate. Rear camber and tyre pressure directly affect temperature spread. Throttle overlay timing at mid-corner is the primary driver variable — late throttle = less rear slip angle = less rear thermal load.",
        rookie: {
          what: "A long right-hand curve taken at medium-high speed. The rear tyres work very hard through here, especially late in a stint.",
          inputs: "Rotate in cleanly, then hold a consistent throttle — don't surge or lift mid-corner. If the rear slides, you're either going too fast or your tyres are worn.",
          setup: "Rear tyre pressures matter here. If the rear is sliding late in a stint, it may mean your rear is overheating — check tyre temps after the session.",
        }
      },
      {
        name: "Club Corner",
        importance: "high",
        note: "Medium-speed 90° right at ~130 km/h — traction zone feeds the 1.1 km pit straight. Power diff lock 60–65%: the longest traction zone of any final corner at Silverstone means a small lock delta has a significant time effect. Trail braking to apex maintains front load for late rotation; throttle at apex or slightly before is optimal. Rear spring rate governs squat under acceleration — stiffer reduces squat but reduces rear grip.",
        rookie: {
          what: "The final corner before the main straight — a medium-speed right-hander. A good exit here can make a big difference to your trap speed.",
          inputs: "Brake firmly, rotate in, then get on the throttle smoothly and early. Be on full throttle well before the exit kerb — you want maximum speed by the time you hit the straight.",
          setup: "Medium power differential lock (60–65%) gives good traction without pushing wide on exit.",
        }
      },
    ]
  },

  "Bathurst": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/91bab6483_BathurstTrackMap.svg",
    rookieTip: "Bathurst is one of the most challenging tracks in sim racing. The mountain section is narrow, bumpy, and blind. Start slow and build up — there is no shortcut. Maximum downforce and softest possible suspension for the bumps.",
    keyCorners: [
      {
        name: "The Cutting",
        importance: "critical",
        note: "Off-camber gradient of ~3° causes effective lateral grip reduction of ~8–10% vs. flat equivalent. Car goes uphill and off-camber simultaneously — vertical load on front outer tyre decreases through the arc. Maximum downforce is mandatory: each click of wing reduction measurably increases understeer here. Soft front bump keeps the outer front tyre in contact with the off-camber surface through lateral load transfer.",
        rookie: {
          what: "An uphill, off-camber right-hander where you can't see the exit. The track surface drops away from the car, which means grip disappears if you run wide.",
          inputs: "Brake earlier than feels natural. Stay on the inside of the track — running wide here drops you onto gravel. Be patient with the throttle and wait until you can see the exit.",
          setup: "Maximum downforce presses the car into the road surface, compensating for the off-camber geometry. Softer front bump helps the tyres follow the uneven track.",
        }
      },
      {
        name: "The Dipper / Forrest's Elbow",
        importance: "critical",
        note: "Vertical load drops as the track falls away — aerodynamic downforce reduces in proportion to speed loss, creating a double grip reduction. Rear axle load drops most acutely due to downhill pitch. Rear wing and rear toe-in are the primary stability variables. Trail braking past the crest reduces rear load further; any rear lateral slip at this point exceeds correction threshold. Threshold is absolute — the margin between flat and off is narrower here than anywhere on the lap.",
        rookie: {
          what: "A downhill section where the car becomes very light over the crest. The rear can suddenly snap if you're carrying too much speed.",
          inputs: "Lift earlier than feels necessary over the crest. Do not trail-brake here — the car is already light, so heavy braking causes the rear to step out. Trust the track — it widens on the way down.",
          setup: "More rear wing helps keep the rear planted as the car becomes light. Rear toe-in provides extra stability when the rear is under less load.",
        }
      },
      {
        name: "The Chase",
        importance: "critical",
        note: "Braking from 295+ km/h after 2.2 km flat — brake disc temperatures at peak before entry. Brake cooling duct setting is the most critical hardware variable here; insufficient cooling causes progressive fade from lap 3 onward in an endurance format. ABS threshold bite point migrates as discs overheat — reference braking markers become unreliable as fade progresses. Pad compound choice: harder compound (higher rating) extends fade threshold at cost of initial cold bite.",
        rookie: {
          what: "After the longest flat-out section on the lap (Conrod Straight at 300 km/h+), you brake very hard into a tight chicane. Brakes overheat easily here.",
          inputs: "Brake firm and early — this is not a place to be a hero. The chicane is tight and the barriers are close. Hit both apices cleanly, don't cut across the kerbs.",
          setup: "Open your front brake ducts fully. If the brakes are still fading or feeling spongy, use a more aggressive brake pad compound (lower number in ACC).",
        }
      },
      {
        name: "Griffins Bend (T1)",
        importance: "high",
        note: "First braking zone of the mountain section — car characteristics here establish the suspension and thermal state for the entire climb. Soft suspension for the mountain means this corner absorbs kerbs differently than a typical setup; bump damping values that work here need to be validated at The Cutting and Reid Park. Entry stability at Griffins directly predicts confidence level through the subsequent blind sections.",
        rookie: {
          what: "The first corner after the pit straight — a tighter right-hander that launches you into the mountain section. A bad lap almost always starts with a poor Griffins Bend.",
          inputs: "Don't be too aggressive here — you need to be settled and composed before the technical mountain section begins. Clean and smooth over anything ambitious.",
          setup: "Softer suspension all-round helps absorb the bumps as you begin the mountain climb. This is not a place to run a stiff race setup.",
        }
      },
    ]
  },

  "Suzuka": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/965ea0244_SuzukaTrackMap.svg",
    rookieTip: "Suzuka rewards smooth, flowing driving. The famous figure-of-eight layout means you need a setup that works everywhere — from the slow hairpin to the ultra-fast 130R. Medium-high wing and a balanced car are the key starting points.",
    keyCorners: [
      {
        name: "S-Curves (Turns 3–7)",
        importance: "critical",
        note: "Five direction changes at 200–250 km/h — total lateral G accumulated here is the highest of any section on the lap. Front ARB stiffness governs load transfer speed at each apex; too stiff creates progressive understeer that compounds across all five turns. Optimal line sacrifices T3 apex for T4 entry angle — the T3–T4 transition is the most speed-sensitive link. Any aero imbalance detected here will amplify through the sequence.",
        rookie: {
          what: "The famous S-bends at Suzuka — a rapid sequence of left-right-left taken at very high speed. One of the most exciting sections in motorsport.",
          inputs: "Flow through rather than fight through. Small, smooth steering inputs. Look ahead to the next apex. If the car feels uncertain, build up lap by lap — you don't need to nail every apex on day one.",
          setup: "This section reveals your aero balance most clearly. Front instability = add front wing. Rear instability = add rear wing. A balanced car that flows is faster than an unbalanced car at the limit.",
        }
      },
      {
        name: "Hairpin (Turn 11)",
        importance: "critical",
        note: "Minimum speed ~55 km/h — exit traction zone feeds a 750m straight, making this the highest-value traction corner on the lap. Power diff lock 65–75%: every 5% increase in lock produces measurable exit speed gain up to the understeer threshold. Trail braking deeply to the apex maximises front load for rotation without early power application. Rear spring rate directly governs rear squat and traction modulation through the acceleration phase.",
        rookie: {
          what: "The slowest corner on the lap — a tight hairpin. What you do here determines your speed down the entire back straight, which is very long.",
          inputs: "Brake early, turn in late (hug the apex kerb), then get on the throttle smoothly and progressively. Think of it as: slow in, fast out. A slow entry that gives you a fast exit wins every time.",
          setup: "Higher power differential lock (65–75%) gives maximum traction on exit. This is where most laptimes at Suzuka are actually lost or gained.",
        }
      },
      {
        name: "130R",
        importance: "critical",
        note: "130m radius at ~255–265 km/h — lateral G at the limit of rear aero capacity. Rear wing is the hard constraint: any reduction below the stable threshold produces rear slip angle that compounds through the arc. Mid-corner rear instability at 130R is non-recoverable due to corner speed and exit barrier proximity. Monitor inner rear tyre temperature after this corner — overtemp indicates sustained slip angle through the arc, signalling insufficient rear downforce.",
        rookie: {
          what: "A very fast left-hander named after its 130-metre radius. GT cars should be flat here but it feels terrifying at first.",
          inputs: "This is a mental challenge more than physical. Build up gradually — a small lift at first is absolutely fine. Stay committed once you're in the corner. If the rear feels nervous on the way out, that's a sign you need more rear wing.",
          setup: "Run enough rear wing that 130R feels stable. Losing time here because of insufficient wing is a false economy — the corner is long enough that stability matters more than a tiny top speed gain.",
        }
      },
      {
        name: "Casio Triangle (T15–T16)",
        importance: "high",
        note: "Braking from ~290 km/h into a double-apex chicane — brake bias sensitivity higher here as the car is still at high lateral load from 130R. Second apex exit vector is the critical output: exit angle determines straight-line speed onto the pit straight and braking point for T1. Brake bias 56.5–57.5% front: higher risks front lock at peak deceleration, lower causes rear instability under the direction change.",
        rookie: {
          what: "The final chicane before the pit straight. Hard braking, two apices, then acceleration onto the straight.",
          inputs: "Brake in a straight line, take the first apex gently, then focus all your energy on the second apex exit — that's what accelerates you onto the straight.",
          setup: "Brake bias around 57% front is a good starting point. If the fronts lock under braking, shift bias slightly rearward by 0.5–1%.",
        }
      },
    ]
  },

  "Brands Hatch GP": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/d37d003f2_BrandsHatchGPTrackMap.svg",
    rookieTip: "Brands Hatch is compact and intimidating with big elevation changes and blind corners. The circuit rewards confidence and smoothness over aggression. Medium-high wing and soft suspension for the undulations.",
    keyCorners: [
      {
        name: "Paddock Hill Bend",
        importance: "critical",
        note: "Blind entry with ~6° negative camber and simultaneous downhill gradient — outer front tyre vertical load drops through the arc. Front downforce setting directly compensates for the camber-induced grip loss. Braking past the brow of the hill reduces front vertical load further; brake bias must account for the front unloading. Suspension travel requirement is high — soft front bump is non-negotiable to maintain tyre contact through the camber transition.",
        rookie: {
          what: "The first corner — a blind, downhill, off-camber right-hander. You can't see the apex on the way in, and the track drops sharply away. It looks terrifying and feels it the first time.",
          inputs: "Brake before the brow of the hill, not after. Turn in before you can see the apex (trust the track). Don't run wide — the track drops off on the outside and you'll lose the car. Stay smooth.",
          setup: "More front downforce helps press the front into the road on the way down. Softer front bump damping keeps the tyre in contact with the falling surface.",
        }
      },
      {
        name: "Druids Hairpin",
        importance: "critical",
        note: "Uphill braking from ~185 km/h into a tight hairpin — ascending gradient reduces peak deceleration force, shifting effective brake bias slightly rearward vs. flat-ground calibration. Rotation quality determines exit trajectory down the steep descent; poor rotation (understeer) forces a wide exit line that costs speed through Graham Hill Bend. Low-speed diff lock 50–60%: too high prevents the car from rotating cleanly, forcing a wider line.",
        rookie: {
          what: "A slow, tight hairpin at the top of the hill after a quick uphill section. Hard braking, slow speed, then you drop steeply into Graham Hill Bend.",
          inputs: "Brake firmly uphill (the hill helps slow you). Rotate the car early and pick up the apex. Then accelerate gently as you drop downhill — too much throttle too early will spin the rear.",
          setup: "Lower power differential lock (50–60%) helps the car rotate cleanly into this tight hairpin. High lock makes it push wide on entry.",
        }
      },
      {
        name: "Graham Hill Bend",
        importance: "high",
        note: "Taken at ~140 km/h at the bottom of the gradient — approach speed higher than track map implies due to the downhill carry. Rear ARB stiffness governs yaw resistance between first and second direction changes; excessive stiffness creates snap oversteer as the car changes direction. Second apex exit line is geometry-constrained — any lateral car position wider than 30cm from the kerb at exit costs measurable speed.",
        rookie: {
          what: "A quick left-right at the bottom of the hill, taken at medium speed. The direction change feels rapid because of the downhill approach speed.",
          inputs: "Be smooth — no aggressive inputs. Two apices: the first is secondary, the second is critical. Exit pointing towards Surtees corner as cleanly as possible.",
          setup: "Medium rear ARB helps resist oversteer between the two apices. Softer rear suspension gives traction on the exit as the track flattens out.",
        }
      },
      {
        name: "Hawthorn Bend",
        importance: "high",
        note: "High-speed right at ~220 km/h feeding the upper loop — rear aero load is the primary grip variable. Trail braking here creates a rear-unloading condition under combined braking and lateral G; any rear slip angle at this speed is non-linear. Rear toe-in and medium-high wing work together to maintain passive yaw stability. Throttle overlay from ~60% arc; earlier application adds understeer that widens the exit into the Kentagon sequence.",
        rookie: {
          what: "A fast right-hander taken at high speed that feeds into the top loop of the GP circuit. Rear grip is critical here.",
          inputs: "Carry good entry speed and be smooth with the steering. Don't trail-brake aggressively — the rear is under load and any sudden input can cause a snap. Steady throttle application from the apex.",
          setup: "Rear toe-in and medium-high rear wing setting both contribute to keeping the rear stable through this fast bend.",
        }
      },
    ]
  },

  "Imola": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/14e25a4a7_ImolaTrackMap.svg",
    rookieTip: "Imola is a bumpy, technical track with very little room for error — the barriers are close and the kerbs are aggressive. Medium wing and softer suspension help manage the surface. Don't abuse the kerbs until you know which ones are safe.",
    keyCorners: [
      {
        name: "Tamburello chicane",
        importance: "critical",
        note: "Braking from ~310 km/h to ~80 km/h over sausage kerbs that produce 20–35mm vertical suspension impulse at peak deceleration. ABS threshold sensitivity is highest here due to simultaneous longitudinal and vertical loading. Exit stability under full acceleration is the primary time variable: rear ARB stiffness governs yaw resistance as throttle load is applied over residual kerb-induced vertical movement. Softer bump damping (allow kerb travel) + medium rear ARB is the optimal compromise. First apex is wholly secondary — second apex exit vector onto the pit straight determines trap speed.",
        rookie: {
          what: "A chicane replacing what used to be the flat-out Tamburello curve. The kerbs here can send the car airborne if hit hard, so be cautious.",
          inputs: "Brake firmly, take a gentle first apex (don't ride the kerb), then accelerate hard from the second apex. The kerbs look inviting but they're dangerous at speed.",
          setup: "Softer bump damping absorbs the shock of kerb contact. Medium-stiff rear ARB prevents the rear from snapping as you accelerate over uneven surface.",
        }
      },
      {
        name: "Acque Minerali",
        importance: "critical",
        note: "High-frequency surface irregularities through a medium-speed esses at ~180–200 km/h — bump damping compliance is the dominant setup variable. Wheel frequency at this section peaks at 8–12 Hz, which exceeds the natural response of stiff damper settings, causing tyre contact loss. Any steering correction over a contact-loss event creates oscillation. Optimal bump damping: 30–40% of maximum on both axles. Rebound rate governs how quickly the tyre returns to road contact after each surface irregularity — too stiff rebound prolongs the contact gap.",
        rookie: {
          what: "A mid-speed esses complex over a bumpy section of track. The car bounces and the grip level changes — it requires a lot of car confidence.",
          inputs: "Be smooth above all else. Don't react to every bump with a steering correction — let the car move under you slightly. Keep your grip light on the wheel.",
          setup: "This is where setup really matters — softer bump damping is essential. If the car is bouncing and losing contact, soften the bump setting on both axles.",
        }
      },
      {
        name: "Variante Alta",
        importance: "high",
        note: "Double-apex taken over a ridge crest at ~150 km/h — vertical load transitions from compression to extension as the car crosses the crest between the two apices. Spring rate governs how much the car extends over the ridge: too stiff = wheels lift, too soft = excessive body pitch masking road surface input. Blind second apex requires a committed turn-in point referenced to trackside markers, not visual apex confirmation. Any weight transfer initiated incorrectly at the first apex determines the car's attitude at the critical second apex.",
        rookie: {
          what: "A double-apex corner over a ridge — you can't see the second apex until you're committed to the first. It requires trusting the layout.",
          inputs: "Brake, take the first apex conservatively, and then look immediately for the second apex. Don't rush — the car needs time to settle between the two turning points.",
          setup: "Medium spring rates help the car ride the ridge without becoming unsettled. If the car bounces or skips here, the springs are too stiff.",
        }
      },
      {
        name: "Rivazza (final hairpins)",
        importance: "high",
        note: "Two geometrically linked hairpins — first hairpin rotation quality determines second hairpin entry angle. The second exit vector feeds the pit straight: any residual lateral slip angle from the first hairpin propagates into the second entry, creating an understeer condition that forces a wide exit. Power diff lock 65–72%: higher values prevent rotation at the first hairpin but maximise traction at the second. Optimal compromise: 67–70% lock, accept a slight rotation penalty at T1 to ensure clean traction at T2.",
        rookie: {
          what: "Two slow hairpins at the end of the lap. The second one leads directly onto the pit straight so exit traction is very important.",
          inputs: "Take the first hairpin cleanly, then focus everything on the second one. Slow in, late apex, clean throttle. The car you need coming out of Rivazza is fast, not dramatic.",
          setup: "Higher power differential lock (65–70%) maximises traction. Softer rear springs let the tyres hook up better on exit.",
        }
      },
    ]
  },

  "Le Mans": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/33ed3ee95_LeMansTrackMap.svg",
    rookieTip: "Le Mans is about the straights as much as the corners — you'll be flat-out for huge sections. The technical sections (Ford Chicanes, Porsche Curves) are where the lap is actually built. Minimum wing for prototypes, medium for GT cars.",
    keyCorners: [
      {
        name: "Ford Chicanes (T1–T2)",
        importance: "critical",
        note: "Braking from 340+ km/h to ~80 km/h — the highest peak deceleration of any corner in any series at Le Mans. Brake disc temperature at this point is the highest on the lap by a margin; GT cars running endurance stints require harder pad compounds (higher temperature operating range) and maximum cooling duct aperture. High sausage kerbs: contact at entry speed above 100 km/h generates peak vertical suspension impulse of ~40mm — insufficient bump travel causes the car to skip rather than absorb. First apex is a setup compromise; second apex exit vector determines Tertre Rouge approach speed.",
        rookie: {
          what: "The first braking point after the pit straight — you go from 300+ km/h to about 80 km/h. The kerbs here are high and dangerous if hit at speed.",
          inputs: "Brake very early on your first laps — you'll be going faster than you're used to. Two apices: hit both calmly without running over the sausage kerbs. Clean and controlled over anything aggressive.",
          setup: "Maximum brake cooling is needed here — open the ducts fully. Brake pads: use a harder compound (higher number in ACC) for endurance races to manage fade over long stints.",
        }
      },
      {
        name: "Tertre Rouge",
        importance: "critical",
        note: "Exit speed from this ~145 km/h right-hander integrates across 6.5 km of near-flat road (Mulsanne, Indianapolis, Arnage approaches) — every 1 km/h at the Tertre Rouge exit is worth approximately 0.08–0.12s of lap time before the next braking zone. Minimum wing setting is constrained by Tertre Rouge cornering load — insufficient rear wing causes rear slip angle here that delays full throttle application by 0.3–0.5s, erasing the straight-line drag advantage. Power diff lock 60–65%: higher values delay early throttle application at the apex due to understeer.",
        rookie: {
          what: "A fast right-hander at the end of the lap's technical section that fires you onto the Mulsanne Straight. Speed here multiplies across 6 km of flat road.",
          inputs: "Treat this as a corner where the exit matters more than any other corner on the track. Get on the throttle early and smoothly — even an extra 5 km/h here is worth seconds down the straight.",
          setup: "Less rear wing drag helps on the straights, but you still need enough grip through Tertre Rouge. This is the core wing-level trade-off at Le Mans.",
        }
      },
      {
        name: "Indianapolis / Arnage",
        importance: "critical",
        note: "Minimum speed ~55–80 km/h — aerodynamic contribution approaches zero, mechanical grip is the sole variable. Low-speed differential lock 55–65% governs rotation through the tight entry radius. At these speeds, tyre contact patch deformation under load is the primary grip source; higher tyre pressures reduce deformation and cost lap time. Rear spring rate and rear ARB influence how much load transfers to the outer rear tyre under throttle — a softer rear spring increases contact patch area and traction modulation. Most inter-class lap time differentials at Le Mans originate from this section.",
        rookie: {
          what: "A slow, tight chicane and hairpin in the infield section. At low speed, aero barely helps — it's all about mechanical grip and smooth throttle.",
          inputs: "Take each corner individually. Brake firmly, rotate the car, then apply smooth progressive throttle. Don't rush — the car needs to be pointed straight before you get on the power.",
          setup: "Differential settings matter more here than anywhere else. A lower power lock (55–65%) lets the car rotate cleanly through these tight sections.",
        }
      },
      {
        name: "Porsche Curves",
        importance: "critical",
        note: "Six direction changes at 200–250 km/h over a bumpy, undulating surface — the highest combined bump-damping and aero-balance demand of any section at Le Mans. Surface irregularities at this speed generate tyre load variations of ±30–40% instantaneously; insufficient bump compliance causes intermittent contact loss that appears as random understeer. Aero imbalance at these speeds amplifies through sequential direction changes identically to Suzuka S-Curves. Optimal bump damping: 30–40% of max on both axles. Rebound rate: slightly stiffer than bump to prevent oscillation build-up.",
        rookie: {
          what: "A flowing series of S-bends over a bumpy surface at the far end of the circuit. Very fast, very demanding, and the section where setups with imbalance get found out.",
          inputs: "Flow through — don't fight the car. Small, smooth steering inputs. Let the bumps move the car slightly rather than correcting every movement. If you're fighting the steering here, your setup needs work.",
          setup: "Softer bump damping is essential for the Porsche Curves. If the car is skipping over bumps and losing grip, soften bump damping on both axles first before changing anything else.",
        }
      },
    ]
  },

  "Circuit de Catalunya": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/8af4fca0a_CatalunyaTrackMap.svg",
    rookieTip: "Catalunya is famous for destroying front tyres. It has long, sustained corners that keep the fronts under constant load. Medium-high wing and conservative camber settings will help you manage front tyre wear throughout a stint.",
    keyCorners: [
      {
        name: "T1 (Elf)",
        importance: "critical",
        note: "Braking from ~280 km/h to ~75 km/h — peak front tyre deceleration load of the lap. Front tyre inner shoulder temperature accumulation from this corner onward tracks directly to T5 (Seat) wear rate. Brake bias 57–58% front: higher risks front lock on the slightly downhill approach, lower causes rear instability. Trail braking to ~60% of corner arc maintains front load for rotation; early throttle application before the car is settled produces understeer that forces a wide exit and compromises the T2 approach. Soft front rebound prevents the front from rising sharply after the braking phase ends.",
        rookie: {
          what: "The first corner — a heavy braking zone into a tight right-hander. Your front tyres get hit the hardest here, especially on the first lap when they're still cold.",
          inputs: "Brake in a straight line, downshift early, then turn in smoothly. Don't attack the kerb on exit — it's bumpy and will unsettle the car. Take your time with the throttle.",
          setup: "Front brake cooling is important here. Also, reduce front tyre pressure by 0.2–0.3 PSI compared to your normal baseline to help the fronts cope with the high load.",
        }
      },
      {
        name: "T3 (Renault)",
        importance: "critical",
        note: "~230 km/h right-hander with a minimal braking event (~0.8s braking pulse from 255 km/h) — the car transitions directly from high-speed aero-dominated mode to mechanical grip mode within the same arc. Front aero load is the critical input: insufficient front downforce at the turn-in point creates understeer before mechanical grip can compensate. Rear ARB stiffness must allow enough rear compliance to avoid oversteer as speed drops mid-arc. This corner is the definitive aero balance diagnostic — a balanced car carries more speed through here than either understeering or oversteering configurations.",
        rookie: {
          what: "A fast right-hander at the end of the back straight. This corner tells you more about your car's balance than any other — if it understeers here, your front aero is lacking.",
          inputs: "Light braking or a lift, then commit to the corner. The car should feel balanced and planted — if the front pushes wide, you need more front downforce or less rear wing.",
          setup: "If the car understeers here, try adding front splitter (if available) or reducing rear wing by one click. If it oversteers, add rear wing.",
        }
      },
      {
        name: "T5 (Seat)",
        importance: "critical",
        note: "~4.5 seconds of sustained lateral loading at ~140–160 km/h — the longest uninterrupted front tyre stress event of any corner at Catalunya. Inner front tyre temperature rise per lap-arc here is the highest of any corner: typically 8–12°C per lap for a GT3 car. Front camber is the primary thermal variable: each 0.1° of camber increase shifts ~2°C from outer to inner tyre face. Target: outer and inner front tyre temperatures within 15°C after a full stint. Throttle application timing mid-arc directly governs understeer load — early throttle increases front lateral load via weight transfer; delayed throttle maintains a more neutral balance.",
        rookie: {
          what: "A long, constant-radius right-hander. Your front tyres are under load for the entire duration — this is where they get hot and wear fastest.",
          inputs: "Smooth steering — don't 'hold' the wheel aggressively against understeer. If the front pushes, ease off the throttle gently rather than forcing the car. Trying to fight understeer here destroys front tyres.",
          setup: "Front camber is critical here — if your inner front tyre is much hotter than the outer after this corner, you have too much camber. If the outer is hotter, add more camber.",
        }
      },
      {
        name: "T9 La Caixa (hairpin)",
        importance: "high",
        note: "Minimum speed ~55 km/h — traction zone feeds the 1.05 km main straight via a compound uphill gradient. Power diff lock 65–72%: the uphill gradient after the apex increases weight transfer to the rear axle, which amplifies the effect of higher diff lock values compared to flat-ground equivalents. Trail braking to the apex is mandatory for rotation; the tight radius (≈25m) requires maximum front load. Rear tyre thermal state at this point in the lap is the highest on the circuit — high-lock diff with worn rears produces excessive wheelspin and makes the car feel understeering when it is actually rear-traction-limited.",
        rookie: {
          what: "A slow hairpin where traction on exit feeds the long main straight. Wheelspin here costs a lot of time.",
          inputs: "Slow and patient. Late apex, then progressive throttle. If you feel wheelspin, ease off slightly — fighting the wheels spinning loses more time than a controlled exit.",
          setup: "Higher power differential lock (65–70%) gives better traction. If the car still spins the wheels, lower traction control (TC) setting also allows the electronics to help manage wheelspin.",
        }
      },
    ]
  },

  "Laguna Seca": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/6022e1a32_LagunaSecaTrackMap.svg",
    rookieTip: "Laguna Seca is all about elevation and the Corkscrew. The circuit is compact but very technical with big drops and blind corners. Medium wing and soft suspension. Build up slowly — several corners here punish overconfidence harshly.",
    keyCorners: [
      {
        name: "Turn 2 (Castrol Corner)",
        importance: "critical",
        note: "Downhill braking from ~240 km/h — descending gradient progressively reduces front vertical load as braking proceeds, shifting the effective brake balance rearward dynamically during the stop. Brake bias 58–59% front nominal; the actual front proportion at peak deceleration is lower due to the pitch-induced weight reduction. Trail braking to mid-corner maintains residual front load for rotation. Soft front rebound prevents the nose from rising sharply when braking force reduces — excessive rebound stiffness creates a brief moment of front 'float' that reduces steering response at the turn-in point.",
        rookie: {
          what: "The first real braking zone — a downhill right-hander. The track drops as you brake, which can cause the front to lock if you brake too hard.",
          inputs: "Brake before the corner begins to drop (earlier than it looks necessary). Trail-brake gently into the apex. Focus on traction — the next section flows from this exit.",
          setup: "Slightly more forward brake bias (58–59%) helps manage the front loading under braking on the downhill approach.",
        }
      },
      {
        name: "Andretti Hairpin (Turn 5)",
        importance: "high",
        note: "Minimum speed ~45 km/h in a tight-radius hairpin — the most mechanically dominated corner at Laguna Seca. Low-speed diff lock 55–65%: the approach is slightly uphill, increasing rear axle load and amplifying the effect of diff lock on rotation resistance. Too high a lock (>65%) creates understeer that forces the car onto a wider line, adding ~0.2s. Rear spring rate governs mechanical traction quality — softer rear spring (within ride height constraints) increases rear contact patch load under acceleration. Front camber: maximum allowable reduces scrub and maintains steering precision at low speed.",
        rookie: {
          what: "A slow hairpin in the middle of the infield section. Very tight — you need to really slow down. Exit traction is the key.",
          inputs: "Brake firm, rotate the car, then apply throttle very progressively. Wheelspin here sends you sideways quickly. Patient and smooth.",
          setup: "Medium power differential lock (60–65%). Too high and the car pushes wide on entry; too low and the rear spins on exit.",
        }
      },
      {
        name: "Corkscrew (Turn 8/9)",
        importance: "critical",
        note: "Blind entry at ~135 km/h followed by a 17m elevation drop over ~80m horizontal distance — the steepest descent of any named corner in professional motorsport. Vertical compression at the bottom of the drop generates peak suspension travel of 30–45mm; insufficient ride height causes aerodynamic floor contact, creating an instantaneous grip reduction mid-corner. Soft bump damping (below 40% of max) is non-negotiable — stiffer settings cause the car to bounce off the compression and lose contact. Turn-in point is fixed by landmark (not visual apex) — commitment must be absolute before the car crests. Rear toe-in provides passive yaw stability during the direction change at the base of the drop.",
        rookie: {
          what: "The most famous corner in American motorsport. You drive over a crest and the road drops sharply away to the left, then immediately turns right. You can't see the landing from the entry.",
          inputs: "Pick a braking point landmark (a post, a line on the road) and use it every lap. Turn left before you can see the bottom. The car will drop — let it. Don't brake after you've turned. Trust the track.",
          setup: "This is the most important corner for soft suspension. If the car lands hard and bounces, soften bump damping. Soft rear springs also help absorb the compression at the bottom of the drop.",
        }
      },
      {
        name: "Rainey Curve (Turn 11)",
        importance: "critical",
        note: "~3.8 seconds of sustained loading at ~130–155 km/h — the longest single-corner front tyre stress event at Laguna Seca. Front camber balance governs temperature spread: target outer-inner delta below 18°C after a full stint. Power diff lock 58–65%: mid-corner throttle application under lateral G at this arc length creates a steady-state understeer condition — too high a lock makes this worse. Optimal throttle timing: at or just after the apex, with progressive overlay. Exit is the primary time output: higher exit speed adds ~0.05s per km/h through the braking zone for Turn 2 approach.",
        rookie: {
          what: "The long, final sweeping corner before the main straight. Taken at medium-high speed for an extended period — the front tyres work hard throughout.",
          inputs: "Brake just enough, then hold a smooth, consistent throttle through the corner. The exit is the priority — get the car pointing straight and accelerate hard.",
          setup: "If the front pushes wide through this corner, soften the front ARB slightly to give the front tyres more mechanical grip during the sustained arc.",
        }
      },
    ]
  },

  "Red Bull Ring": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/ef87aa55e_RedBullRingTrackMap.svg",
    rookieTip: "Red Bull Ring is a short, hilly circuit with very heavy braking zones and good overtaking. The key is getting the braking right — the uphills make you think you can brake later than you can. Medium wing and solid brake cooling are priorities.",
    keyCorners: [
      {
        name: "Turn 1 (Castrol Kurve)",
        importance: "critical",
        note: "Uphill braking from ~275 km/h — ascending gradient reduces aerodynamic contribution to downforce as speed drops faster than on flat ground, compressing the effective braking distance. The car is simultaneously decelerating and climbing, which reduces pitch moment and rear load transfer; this makes the rear less stable during hard braking versus flat-ground equivalent. Brake bias 57–58% front. Trail braking to the apex is the primary rotation tool — turn-in without trail braking causes understeer that forces a wide exit and reduces T1–T2 carry speed. Power diff lock 65–70% exploits the uphill gradient's natural rear-loading effect for exit traction.",
        rookie: {
          what: "An uphill right-hander at the end of the main straight. The uphill approach fools many beginners into braking too late — the car doesn't slow down as fast as on flat ground.",
          inputs: "Brake earlier than instinct suggests. The uphill helps, but not as much as you think. Late apex — hug the inside kerb — then get on the throttle early as the track continues uphill.",
          setup: "Higher power differential lock (65–70%) is rewarded here because the uphill gradient naturally helps traction. More lock = more acceleration up the hill.",
        }
      },
      {
        name: "Turn 3 (Remus Kurve)",
        importance: "critical",
        note: "Braking from ~240 km/h over a blind crest — the car is at minimum vertical load as braking commences (crest reduces both front and rear aero load simultaneously). This makes the brake bias threshold sensitivity higher than at T1: the same brake pressure that is stable at T1 may cause front lock here due to reduced overall load. ABS threshold recalibration between T1 and T3 is the highest-skill delta on the lap. Brake bias 57–58% front; any higher risks front lock at reduced-grip crest phase. This corner produces the largest time differential between driver skill levels at Red Bull Ring.",
        rookie: {
          what: "A heavy braking zone over a blind crest — you can't see the corner until you're nearly at it. This is where most time differences between drivers appear.",
          inputs: "Pick a braking marker and commit to it. Don't be tempted to brake later just because you can't see the corner yet. The crest can make the car light, so very late braking risks locking up and going straight on.",
          setup: "Brake bias should be set conservatively (57–58% front) to avoid locking a wheel over the crest where grip is temporarily reduced.",
        }
      },
      {
        name: "Turn 6 (Rindt Kurve)",
        importance: "high",
        note: "~175 km/h downhill right-hander — descending gradient reduces both aero downforce contribution (speed loss is slower, but pitch angle reduces front aero efficacy) and rear mechanical grip. The car transitions from compression (before entry) to pitch-neutral (mid-corner) to extension (exit), each phase requiring different grip demands. Rear wing setting must account for the extension phase where rear aero load drops most acutely. Rear toe-in provides passive yaw stability during the extension. Throttle application before the car is settled in the extension phase creates rear-oversteer on the downhill gradient.",
        rookie: {
          what: "A medium-speed right-hander that goes downhill. The car becomes lighter as the track drops, reducing rear grip.",
          inputs: "Be gentle with inputs as the car unloads. Don't trail-brake aggressively. Smooth throttle from the apex — the downhill actually helps you accelerate away.",
          setup: "More rear wing helps press the car down as it becomes light on the downhill section. Rear toe-in also provides passive stability.",
        }
      },
      {
        name: "Turn 9–10 (final complex)",
        importance: "high",
        note: "Final right-hander at ~80 km/h — exit vector feeds the 900m main straight and T1 braking zone directly. Power diff lock 65–70%: the corner is taken at a speed where the diff lock effect on rotation is significant (below ~100 km/h the mechanical effect is higher vs. aero-dominated cornering). Rear spring rate directly governs squat under acceleration — stiffer reduces squat body motion but reduces contact patch load. Optimal rear spring: soft enough to allow rear squat without bottoming; stiffer than Hungaroring equivalent due to higher average speed. Trail braking: mandatory for a tight entry radius (~18m) to maintain front load for rotation.",
        rookie: {
          what: "The final corner before the main straight — a slow right-hander. Exit speed directly translates to a higher trap speed on the straight.",
          inputs: "Slow and patient entry. Rotate cleanly, late apex, then early and smooth throttle. Think about where you want to be at the exit, not the entry.",
          setup: "Power differential lock (65–70%) maximises traction on exit. Softer rear springs help the car hook up on corner exit.",
        }
      },
    ]
  },

  "Hungaroring": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/adf49f391_HungaroringTrackMap.svg",
    rookieTip: "The Hungaroring is one of the slowest, most technical circuits — it's basically a karting track for GT cars. Maximum downforce helps everywhere. Tyre management is critical because you're constantly turning and loading the tyres with almost no relief.",
    keyCorners: [
      {
        name: "T1 (Opening hairpin)",
        importance: "critical",
        note: "Minimum speed ~60 km/h — a pattern repeated in near-identical geometry at T11, meaning the front tyre thermal cycle (heat-up, partial cool, heat-up again) occurs twice per lap at maximum mechanical grip demand. Inner front tyre operating temperature rises ~6–9°C per T1 pass; by lap 12–15, cumulative thermal degradation reduces front mechanical grip by 8–12%. Front camber balance target: inner-outer delta below 15°C across a full stint. Low-speed diff lock 55–65%: the hairpin radius requires rotation via front grip, not diff unlock — higher lock forces wider exit line and adds understeer scrub to already thermally stressed fronts.",
        rookie: {
          what: "The first corner and a tight hairpin. You brake from reasonable speed into a slow right-hander. This corner is repeated in almost the same form later in the lap, causing the fronts to overheat.",
          inputs: "Brake firmly, rotate the car, and apply smooth throttle. Don't attack the kerb on entry — it unbalances the car for the exit. Think about tyre conservation from lap one.",
          setup: "Conservative front camber settings protect the inner front tyre edge. If the inner front is much hotter than the outer after T1, reduce camber by 0.1–0.2°.",
        }
      },
      {
        name: "T4 (Long left-hander)",
        importance: "critical",
        note: "~5.2 seconds of continuous lateral loading at ~145 km/h — the highest single-corner front tyre thermal input of any corner in the GT calendar. Front ARB stiffness governs the load distribution between inner and outer front tyres: stiffer ARB = more lateral load transfer = higher outer front grip demand = inner front thermal underload and outer front overload. Target outer-inner front delta: below 20°C. Soft front ARB (within ride height constraints) maximises contact patch area by allowing more suspension travel under load. Understeer mid-arc under sustained throttle is the primary driver complaint — caused by front tyre degradation interacting with diff lock, not setup imbalance per se.",
        rookie: {
          what: "The longest corner on the lap — a sustained left-hander that keeps the front tyres under load for a long time. If your front tyres are worn by the end of a stint, this is why.",
          inputs: "Don't try to carry maximum speed — tyre protection matters more than lap time on a single corner here. Smooth throttle, avoid fighting understeer with steering force.",
          setup: "Soft front ARB gives more mechanical grip and reduces the load on the outer front tyre. If the fronts are overheating, this is the first setup change to try.",
        }
      },
      {
        name: "T6–T7 complex",
        importance: "high",
        note: "Direction changes at ~160–185 km/h over a smooth surface — the transition speed makes this the only section at the Hungaroring where aerodynamic balance is the primary grip variable rather than mechanical. Front-rear aero imbalance amplifies through the sequential direction changes identically to Maggots-Becketts at Silverstone but at lower speeds. Rear toe-in 0.8–1.0mm provides passive yaw stability between direction changes. Rear ARB stiffness governs lateral load transfer speed at each direction change — stiffer than 65% of max creates snap oversteer as weight transfers. This section is the aero setup diagnostic tool for the Hungaroring.",
        rookie: {
          what: "A flowing S-bend section in the middle of the circuit. It's faster than it looks and the car changes direction quickly.",
          inputs: "Flow through — small inputs. The car should feel planted and confident. If it doesn't, your aero balance is off. Be progressive with throttle through the second part.",
          setup: "This section diagnoses aero balance well. Understeer = less rear wing or more front wing. Oversteer = more rear wing.",
        }
      },
      {
        name: "T11 (Final hairpin)",
        importance: "critical",
        note: "Minimum speed ~50 km/h — the sole traction opportunity on a circuit with almost no meaningful straight. Power diff lock 65–75%: at the Hungaroring, this corner produces the highest lap time sensitivity to diff lock setting of any corner in the GT calendar due to the absence of any other significant traction zone. Every 5% increase in lock above the understeer threshold (usually ~70%) costs ~0.05s through the corner but recovers ~0.12s on the main straight — net positive only if the lock value is below the rotation-constraint threshold. Rear spring rate governs squat under acceleration: softer rear spring allows more squat, increasing rear contact patch load and modulating wheelspin. Front tyre thermal state at T11 determines rotation quality — degraded fronts cannot generate sufficient load for clean rotation, causing the car to push wide regardless of diff setting.",
        rookie: {
          what: "The final hairpin before the main straight. This is the last chance to build speed for the straight, so exit traction is the priority.",
          inputs: "Very slow in, very late apex, very smooth throttle. The car needs to be pointed straight before you apply full power. Any wheelspin here wastes your only real acceleration opportunity.",
          setup: "Higher power differential lock (65–75%). This is the corner where diff settings matter most at the Hungaroring — the right setting can find 0.2–0.3s on exit alone.",
        }
      },
    ]
  },

  "Nürburgring Nordschleife": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/e9a0a95f1_NordschleifeTrackMap.svg",
    rookieTip: "The Nordschleife is 26 km of extreme variety — no other track comes close. Treat it with complete respect. Raise your ride height, soften everything, run higher tyre pressures, and open brake ducts fully. Learn the track in sections, not all at once.",
    keyCorners: [
      {
        name: "Caracciola Karussell",
        importance: "critical",
        note: "Concrete banking of 25–28° at the Karussell's base — the banking provides an effective vertical load increase equivalent to +1.5–2.0G lateral compensation when the car is fully in contact. The setup requirement is the inverse of every other corner: softer springs allow the car to drop into the banking and maximise contact area; stiffer springs resist the banking geometry and reduce the load advantage. Ride height must be sufficient to prevent floor contact at the banking transition (compression into the bowl). Any steering input fighting the banking geometry reduces the contact patch area and negates the banking's load benefit. Exit: the car unloads sharply as it leaves the banking — aggressive throttle at this moment causes rear slip.",
        rookie: {
          what: "A famous banked corner — the track dips into a concrete banking that tilts the car. The banking provides extra grip but only if you use it correctly.",
          inputs: "Drop into the banking (the lower line), let the car lean into it, and carry your speed through. Don't fight the car or try to steer out of the banking — the geometry does the work. Smooth, consistent throttle.",
          setup: "Softer suspension lets the car settle into the banking naturally. Stiff springs fight the banking and create instability. Higher ride height prevents bottoming out in the dip.",
        }
      },
      {
        name: "Pflanzgarten",
        importance: "critical",
        note: "Two compression-rebound cycles followed by an airborne phase of ~0.15–0.25s at full speed — the highest ride height demand of any section at the Nordschleife. Floor contact at Pflanzgarten produces an instantaneous downforce loss that is non-recoverable at this speed. Minimum ride height: 10mm above the static clearance minimum. Bump damping: below 30% of max to absorb first compression; insufficient bump rate causes the car to bounce off the first compression and arrive at the second with excessive vertical velocity. Airborne: any steering input while the car is off the ground creates angular momentum — when the car lands with a steering angle applied, the resulting direction change is instantaneous and non-catchable. Brake before the crest, not on it — longitudinal deceleration during the airborne-to-compression transition creates rear instability.",
        rookie: {
          what: "A section with compressions and crests where the car can become airborne. One of the most dangerous sections of the Nordschleife at speed.",
          inputs: "Do not brake over the crests — you'll lock up immediately. Lift before the crest, not on it. Keep your hands still while airborne — steering inputs while the car is light cause huge instability on landing.",
          setup: "Maximum ride height to prevent bottoming out on the compressions. Softest possible bump damping so the car absorbs the landings rather than bouncing. This is the most setup-critical section.",
        }
      },
      {
        name: "Schwedenkreuz / Aremberg",
        importance: "critical",
        note: "~240–260 km/h left-right sequence over crests where the road surface is not visible from the entry braking point — aerodynamic stability is the primary safety variable at this speed. Rear wing below medium setting creates a rear instability condition over the crests where aero load drops; the car's yaw response at 260 km/h is non-linear and the correction window is <0.15s. Rear toe-in at the maximum allowable range provides passive yaw resistance. Rear ARB stiffness above 70% of max creates snap oversteer as the car transitions from one crest to the next — medium rear ARB is the stable range. Track knowledge is a setup surrogate: the committed driver line through Schwedenkreuz uses the full road width, which at these speeds requires absolute precision on the turn-in reference. Any deviation from the optimal line at this speed adds understeer load that cannot be corrected without a speed reduction.",
        rookie: {
          what: "A high-speed left-right sequence over blind crests — you can't see what's coming. This is the most intimidating section for newcomers to the Nordschleife.",
          inputs: "Build up to this section gradually over many laps. Use the barriers and tree lines as visual guides for where the track goes. Hold the throttle steadily — any sudden lift over the crests can unsettle the car. Trust the car.",
          setup: "High-speed rear stability is key — ensure rear wing is set to at least medium, and rear toe-in is at the higher end of range. A nervous rear through here is extremely dangerous.",
        }
      },
      {
        name: "Brünnchen complex",
        importance: "high",
        note: "~170 km/h sustained right-hander over a series of surface undulations with amplitude 20–40mm at 4–8 Hz — the highest combined bump-frequency and lateral-load demand at the Nordschleife. Tyre contact loss under lateral G at a bump creates a brief understeer-to-oversteer transition: the initial contact loss feels like understeer, but on contact restoration the tyre bites immediately and snaps oversteer follows. Bump damping below 35% of max prevents the oscillation from building across sequential undulations. Rebound rate: slightly stiffer than bump prevents the car from rebounding into the next undulation at increased vertical velocity. Throttle management: any wheelspin on a bump at this speed produces instantaneous oversteer — TC sensitivity should be raised specifically for the Brünnchen section if the sim allows per-section adjustment.",
        rookie: {
          what: "A long, medium-speed right-hander over a bumpy surface. The car can bounce and lose grip unexpectedly — this section catches many drivers out.",
          inputs: "Take a wide entry line, be smooth throughout, and don't fight the bumps with the steering. Apply throttle progressively — wheelspin on bumps causes instant oversteer. Margin is your friend here.",
          setup: "Softer bump and rebound damping is essential. If the car bounces or skips here, soften bump on both axles. Never run a stiff race setup at the Nordschleife.",
        }
      },
    ]
  },
};