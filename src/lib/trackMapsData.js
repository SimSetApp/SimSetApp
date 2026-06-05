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
        note: "Full commitment flat-out — rear stability is everything. A lift here costs tenths instantly.",
        rookie: {
          what: "A dramatic uphill S-bend taken flat-out. The car compresses hard at the bottom then shoots uphill — it feels very fast and intimidating.",
          inputs: "Don't brake here at all. Keep your hands light on the wheel — small corrections upset the car. Look up to the top of the hill, not the barriers beside you.",
          setup: "Run more rear wing than you think you need. Softer rear anti-roll bar helps the car stay planted. If the rear snaps, add a click of wing first.",
        }
      },
      {
        name: "Pouhon",
        importance: "critical",
        note: "Fastest true corner at Spa. Demands absolute rear grip — run enough wing to go flat.",
        rookie: {
          what: "A very fast double-left taken at nearly full speed. Most cars should go flat here but it requires trust in your rear grip.",
          inputs: "Approach on the right side of the track, then sweep left and hold the throttle. If you feel the rear moving, gently lift — don't stab the brakes.",
          setup: "Rear wing setting is critical here. If the car feels nervous, add rear wing. Rear toe-in (pointing slightly inward) also adds high-speed stability.",
        }
      },
      {
        name: "La Source Hairpin",
        importance: "high",
        note: "Trail braking and rotation set the trajectory into the Kemmel descent below.",
        rookie: {
          what: "The opening hairpin — a tight right-hander at the top of the hill. Easy to brake too late and run wide.",
          inputs: "Brake in a straight line, downshift early. Turn in late (later than you think), keep the apex kerb on your left, then accelerate smoothly. Don't rush — a good exit matters more than a fast entry.",
          setup: "A softer differential (lower power lock) helps the car rotate cleanly into this tight corner.",
        }
      },
      {
        name: "Bus Stop Chicane",
        importance: "high",
        note: "Focus on the second apex — clean exit feeds the run back to La Source.",
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
        note: "Heaviest braking on the calendar — 330→80 km/h. Kerbs unsettle under maximum braking.",
        rookie: {
          what: "The first chicane — you brake from maximum speed to nearly a standstill. It's the most dramatic braking point you'll experience.",
          inputs: "Brake early and firmly. Don't attack the kerbs — they will unsettle the car and you'll run wide. Hit the first apex, let the car straighten briefly, then rotate into the second apex.",
          setup: "Open your brake ducts fully — the brakes work extremely hard here. Avoid very stiff bump settings as the car needs to absorb the hard braking load smoothly.",
        }
      },
      {
        name: "Variante della Roggia",
        importance: "critical",
        note: "Second chicane — exit speed feeds the Lesmo sequence directly.",
        rookie: {
          what: "The second chicane, similar to the first but slightly faster. A clean exit here directly affects how fast you enter the Lesmo corners.",
          inputs: "Same rhythm as Turn 1 — brake, first apex, settle, second apex, accelerate. Focus on a clean exit rather than a heroic entry.",
          setup: "Brake bias around 57–58% front works well here. If fronts are locking under braking, move bias slightly rearward by 0.5%.",
        }
      },
      {
        name: "Ascari Chicane",
        importance: "high",
        note: "Fast two-apex S at high speed — car must be composed, not reactive.",
        rookie: {
          what: "A faster chicane taken in 4th or 5th gear. The car moves quickly left-right and any nervous inputs will cause oversteer.",
          inputs: "Be smooth — don't jerk the wheel. Keep your steering inputs small and progressive. Carry as much speed as you can without touching the kerbs aggressively.",
          setup: "Stiffer rebound damping helps control the side-to-side body movement through the direction change.",
        }
      },
      {
        name: "Parabolica (Curva Alboreto)",
        importance: "critical",
        note: "The lap-defining corner. Long, constant-radius — every mph on exit converts to main straight speed.",
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
        note: "The signature sequence — multiple linked corners, demands a calm and balanced car.",
        rookie: {
          what: "A series of connected corners in the stadium section — it flows left and right and requires the car to be set up for balance, not just grip.",
          inputs: "Look ahead to the next apex at all times. Don't fix one corner at the cost of the next — take a compromise line that lets you flow through all sections. Smooth, progressive throttle throughout.",
          setup: "A balanced car is more important than a fast one here. Medium ARB settings front and rear. Avoid very stiff springs which make the car twitchy through the linked sequence.",
        }
      },
      {
        name: "Michael Schumacher S",
        importance: "high",
        note: "Quick esses mid-sector — rear must remain stable through the fast direction change.",
        rookie: {
          what: "A fast S-bend named after the legend himself. Taken at high speed, the rear of the car can feel light as you change direction.",
          inputs: "Commit to the corner and don't lift mid-corner. Keep steering inputs smooth and small. If the rear moves, don't panic — hold the throttle and steer gently back.",
          setup: "Rear toe-in (pointing inward by 0.8–1.0mm) adds passive stability through fast direction changes like this.",
        }
      },
      {
        name: "Hairpin (Ford Kurve)",
        importance: "critical",
        note: "Tightest corner — traction zone feeds the back straight. Diff settings critical.",
        rookie: {
          what: "The slowest, tightest corner on the circuit — a classic hairpin. What you do here directly determines your speed down the back straight.",
          inputs: "Brake early, rotate the car in, and wait patiently before applying throttle. Exit traction is the only thing that matters. A late, perfect exit is much better than an early, messy one.",
          setup: "Higher power differential lock (65–75%) maximises traction on exit. Softer rear springs also help the car hook up as you accelerate away.",
        }
      },
      {
        name: "Einfahrt Motodrom",
        importance: "high",
        note: "Final complex — smooth over the kerbs, exit composure feeds the pit straight.",
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
        note: "Should be flat for most GT cars — any lift loses multiple tenths. Planted front end needed.",
        rookie: {
          what: "A fast right-hander at the end of the main straight. Most GT cars can go completely flat here, but it takes time to build trust.",
          inputs: "Approach on the left, then sweep right without braking. Keep your eyes on the exit — where you look is where you'll go. If you need to, a small lift is fine while you build confidence, but aim to eventually hold full throttle.",
          setup: "Front anti-roll bar (ARB) stiffness is key here — it controls how much the nose dips in fast corners. If the front feels uncertain, try a slightly stiffer front ARB.",
        }
      },
      {
        name: "Maggots–Becketts–Chapel",
        importance: "critical",
        note: "The lap. Rapid direction changes at extreme speed — the definitive aero balance test.",
        rookie: {
          what: "The most famous section of Silverstone — a rapid left-right-left-right taken at very high speed. It feels scary at first but becomes very rewarding once you're in rhythm.",
          inputs: "Don't try to nail every apex on your first attempt. Build up lap by lap. Keep your hands light, use small steering inputs, and focus on rhythm. The car should feel like it's dancing, not fighting.",
          setup: "This section tells you everything about your aero balance. If the car understeers here, add front wing or reduce rear wing. If it oversteers, add rear wing. Medium wing overall works best.",
        }
      },
      {
        name: "Stowe",
        importance: "high",
        note: "Long sustained load — exposes rear tyre condition more than anywhere else on the lap.",
        rookie: {
          what: "A long right-hand curve taken at medium-high speed. The rear tyres work very hard through here, especially late in a stint.",
          inputs: "Rotate in cleanly, then hold a consistent throttle — don't surge or lift mid-corner. If the rear slides, you're either going too fast or your tyres are worn.",
          setup: "Rear tyre pressures matter here. If the rear is sliding late in a stint, it may mean your rear is overheating — check tyre temps after the session.",
        }
      },
      {
        name: "Club Corner",
        importance: "high",
        note: "Last corner onto the pit straight — traction priority, feeds the highest speed section.",
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
        note: "Blind, uphill, off-camber. Max downforce, soft suspension — the car must be predictable.",
        rookie: {
          what: "An uphill, off-camber right-hander where you can't see the exit. The track surface drops away from the car, which means grip disappears if you run wide.",
          inputs: "Brake earlier than feels natural. Stay on the inside of the track — running wide here drops you onto gravel. Be patient with the throttle and wait until you can see the exit.",
          setup: "Maximum downforce presses the car into the road surface, compensating for the off-camber geometry. Softer front bump helps the tyres follow the uneven track.",
        }
      },
      {
        name: "The Dipper / Forrest's Elbow",
        importance: "critical",
        note: "Downhill, blind entry, car goes light. The most dangerous section. Any oversteer here is unrecoverable.",
        rookie: {
          what: "A downhill section where the car becomes very light over the crest. The rear can suddenly snap if you're carrying too much speed.",
          inputs: "Lift earlier than feels necessary over the crest. Do not trail-brake here — the car is already light, so heavy braking causes the rear to step out. Trust the track — it widens on the way down.",
          setup: "More rear wing helps keep the rear planted as the car becomes light. Rear toe-in provides extra stability when the rear is under less load.",
        }
      },
      {
        name: "The Chase",
        importance: "critical",
        note: "End of Conrod Straight — ultra-heavy braking zone after the longest flat section. Brake cooling essential.",
        rookie: {
          what: "After the longest flat-out section on the lap (Conrod Straight at 300 km/h+), you brake very hard into a tight chicane. Brakes overheat easily here.",
          inputs: "Brake firm and early — this is not a place to be a hero. The chicane is tight and the barriers are close. Hit both apices cleanly, don't cut across the kerbs.",
          setup: "Open your front brake ducts fully. If the brakes are still fading or feeling spongy, use a more aggressive brake pad compound (lower number in ACC).",
        }
      },
      {
        name: "Griffins Bend (T1)",
        importance: "high",
        note: "Entry to the mountain — sets the rhythm for the climb. Confidence here defines the rest.",
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
        note: "The iconic esses taken at high speed — front stability and aero balance define your pace here.",
        rookie: {
          what: "The famous S-bends at Suzuka — a rapid sequence of left-right-left taken at very high speed. One of the most exciting sections in motorsport.",
          inputs: "Flow through rather than fight through. Small, smooth steering inputs. Look ahead to the next apex. If the car feels uncertain, build up lap by lap — you don't need to nail every apex on day one.",
          setup: "This section reveals your aero balance most clearly. Front instability = add front wing. Rear instability = add rear wing. A balanced car that flows is faster than an unbalanced car at the limit.",
        }
      },
      {
        name: "Hairpin (Turn 11)",
        importance: "critical",
        note: "Slowest corner — maximum traction priority. Exit speed feeds the long back straight.",
        rookie: {
          what: "The slowest corner on the lap — a tight hairpin. What you do here determines your speed down the entire back straight, which is very long.",
          inputs: "Brake early, turn in late (hug the apex kerb), then get on the throttle smoothly and progressively. Think of it as: slow in, fast out. A slow entry that gives you a fast exit wins every time.",
          setup: "Higher power differential lock (65–75%) gives maximum traction on exit. This is where most laptimes at Suzuka are actually lost or gained.",
        }
      },
      {
        name: "130R",
        importance: "critical",
        note: "Flat-out for GT cars. Any rear instability here is not recoverable. Always run enough wing.",
        rookie: {
          what: "A very fast left-hander named after its 130-metre radius. GT cars should be flat here but it feels terrifying at first.",
          inputs: "This is a mental challenge more than physical. Build up gradually — a small lift at first is absolutely fine. Stay committed once you're in the corner. If the rear feels nervous on the way out, that's a sign you need more rear wing.",
          setup: "Run enough rear wing that 130R feels stable. Losing time here because of insufficient wing is a false economy — the corner is long enough that stability matters more than a tiny top speed gain.",
        }
      },
      {
        name: "Casio Triangle (T15–T16)",
        importance: "high",
        note: "Final chicane — braking stability then traction for the last corner onto the pit straight.",
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
        note: "Blind, downhill, off-camber drop. Most intimidating corner in the UK — confidence here is half the lap.",
        rookie: {
          what: "The first corner — a blind, downhill, off-camber right-hander. You can't see the apex on the way in, and the track drops sharply away. It looks terrifying and feels it the first time.",
          inputs: "Brake before the brow of the hill, not after. Turn in before you can see the apex (trust the track). Don't run wide — the track drops off on the outside and you'll lose the car. Stay smooth.",
          setup: "More front downforce helps press the front into the road on the way down. Softer front bump damping keeps the tyre in contact with the falling surface.",
        }
      },
      {
        name: "Druids Hairpin",
        importance: "critical",
        note: "Tight hairpin at the top of the hill — heavy braking, rotation, then traction for the steep descent.",
        rookie: {
          what: "A slow, tight hairpin at the top of the hill after a quick uphill section. Hard braking, slow speed, then you drop steeply into Graham Hill Bend.",
          inputs: "Brake firmly uphill (the hill helps slow you). Rotate the car early and pick up the apex. Then accelerate gently as you drop downhill — too much throttle too early will spin the rear.",
          setup: "Lower power differential lock (50–60%) helps the car rotate cleanly into this tight hairpin. High lock makes it push wide on entry.",
        }
      },
      {
        name: "Graham Hill Bend",
        importance: "high",
        note: "Bottom-section chicane — smooth direction change, don't sacrifice the exit for the entry.",
        rookie: {
          what: "A quick left-right at the bottom of the hill, taken at medium speed. The direction change feels rapid because of the downhill approach speed.",
          inputs: "Be smooth — no aggressive inputs. Two apices: the first is secondary, the second is critical. Exit pointing towards Surtees corner as cleanly as possible.",
          setup: "Medium rear ARB helps resist oversteer between the two apices. Softer rear suspension gives traction on the exit as the track flattens out.",
        }
      },
      {
        name: "Hawthorn Bend",
        importance: "high",
        note: "Fast right-hander into the GP loop — rear stability essential, feeds the long Kentagon section.",
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
        note: "Main overtaking point — flat-out chicane, kerbs can launch the car, exit stability critical.",
        rookie: {
          what: "A chicane replacing what used to be the flat-out Tamburello curve. The kerbs here can send the car airborne if hit hard, so be cautious.",
          inputs: "Brake firmly, take a gentle first apex (don't ride the kerb), then accelerate hard from the second apex. The kerbs look inviting but they're dangerous at speed.",
          setup: "Softer bump damping absorbs the shock of kerb contact. Medium-stiff rear ARB prevents the rear from snapping as you accelerate over uneven surface.",
        }
      },
      {
        name: "Acque Minerali",
        importance: "critical",
        note: "Mid-circuit complex — bumpy, high-speed. Soft bump damping allows the car to breathe over the surface.",
        rookie: {
          what: "A mid-speed esses complex over a bumpy section of track. The car bounces and the grip level changes — it requires a lot of car confidence.",
          inputs: "Be smooth above all else. Don't react to every bump with a steering correction — let the car move under you slightly. Keep your grip light on the wheel.",
          setup: "This is where setup really matters — softer bump damping is essential. If the car is bouncing and losing contact, soften the bump setting on both axles.",
        }
      },
      {
        name: "Variante Alta",
        importance: "high",
        note: "Double-apex over the ridge — blind entry requires composure. Both apices matter equally.",
        rookie: {
          what: "A double-apex corner over a ridge — you can't see the second apex until you're committed to the first. It requires trusting the layout.",
          inputs: "Brake, take the first apex conservatively, and then look immediately for the second apex. Don't rush — the car needs time to settle between the two turning points.",
          setup: "Medium spring rates help the car ride the ridge without becoming unsettled. If the car bounces or skips here, the springs are too stiff.",
        }
      },
      {
        name: "Rivazza (final hairpins)",
        importance: "high",
        note: "Double hairpin — second exit leads onto the pit straight. Traction is the priority.",
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
        note: "Opening chicane — braking from 330+ km/h over two apices. Kerb abuse here ruins tyres for the entire stint.",
        rookie: {
          what: "The first braking point after the pit straight — you go from 300+ km/h to about 80 km/h. The kerbs here are high and dangerous if hit at speed.",
          inputs: "Brake very early on your first laps — you'll be going faster than you're used to. Two apices: hit both calmly without running over the sausage kerbs. Clean and controlled over anything aggressive.",
          setup: "Maximum brake cooling is needed here — open the ducts fully. Brake pads: use a harder compound (higher number in ACC) for endurance races to manage fade over long stints.",
        }
      },
      {
        name: "Tertre Rouge",
        importance: "critical",
        note: "Fast right-hander feeding the Mulsanne. Every extra km/h here compounds across 6 km of flat.",
        rookie: {
          what: "A fast right-hander at the end of the lap's technical section that fires you onto the Mulsanne Straight. Speed here multiplies across 6 km of flat road.",
          inputs: "Treat this as a corner where the exit matters more than any other corner on the track. Get on the throttle early and smoothly — even an extra 5 km/h here is worth seconds down the straight.",
          setup: "Less rear wing drag helps on the straights, but you still need enough grip through Tertre Rouge. This is the core wing-level trade-off at Le Mans.",
        }
      },
      {
        name: "Indianapolis / Arnage",
        importance: "critical",
        note: "Slowest section of the lap — mechanical grip dominant. Most time gaps between classes are created here.",
        rookie: {
          what: "A slow, tight chicane and hairpin in the infield section. At low speed, aero barely helps — it's all about mechanical grip and smooth throttle.",
          inputs: "Take each corner individually. Brake firmly, rotate the car, then apply smooth progressive throttle. Don't rush — the car needs to be pointed straight before you get on the power.",
          setup: "Differential settings matter more here than anywhere else. A lower power lock (55–65%) lets the car rotate cleanly through these tight sections.",
        }
      },
      {
        name: "Porsche Curves",
        importance: "critical",
        note: "Multi-apex S-bends — the most technically demanding section. Bumpy, fast, unforgiving of setup imbalance.",
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
        note: "Heavy braking into a tight right — biggest front tyre load on the lap, sustained through the exit.",
        rookie: {
          what: "The first corner — a heavy braking zone into a tight right-hander. Your front tyres get hit the hardest here, especially on the first lap when they're still cold.",
          inputs: "Brake in a straight line, downshift early, then turn in smoothly. Don't attack the kerb on exit — it's bumpy and will unsettle the car. Take your time with the throttle.",
          setup: "Front brake cooling is important here. Also, reduce front tyre pressure by 0.2–0.3 PSI compared to your normal baseline to help the fronts cope with the high load.",
        }
      },
      {
        name: "T3 (Renault)",
        importance: "critical",
        note: "Fast right after the back straight — the primary aero balance diagnostic corner.",
        rookie: {
          what: "A fast right-hander at the end of the back straight. This corner tells you more about your car's balance than any other — if it understeers here, your front aero is lacking.",
          inputs: "Light braking or a lift, then commit to the corner. The car should feel balanced and planted — if the front pushes wide, you need more front downforce or less rear wing.",
          setup: "If the car understeers here, try adding front splitter (if available) or reducing rear wing by one click. If it oversteers, add rear wing.",
        }
      },
      {
        name: "T5 (Seat)",
        importance: "critical",
        note: "Long sustained right-hander — more front tyre degradation comes from here than anywhere else.",
        rookie: {
          what: "A long, constant-radius right-hander. Your front tyres are under load for the entire duration — this is where they get hot and wear fastest.",
          inputs: "Smooth steering — don't 'hold' the wheel aggressively against understeer. If the front pushes, ease off the throttle gently rather than forcing the car. Trying to fight understeer here destroys front tyres.",
          setup: "Front camber is critical here — if your inner front tyre is much hotter than the outer after this corner, you have too much camber. If the outer is hotter, add more camber.",
        }
      },
      {
        name: "T9 La Caixa (hairpin)",
        importance: "high",
        note: "Slow hairpin exit — diff setup critical, long traction zone onto the pit straight area.",
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
        note: "First heavy braking zone — key setup corner, traction out feeds the infield section.",
        rookie: {
          what: "The first real braking zone — a downhill right-hander. The track drops as you brake, which can cause the front to lock if you brake too hard.",
          inputs: "Brake before the corner begins to drop (earlier than it looks necessary). Trail-brake gently into the apex. Focus on traction — the next section flows from this exit.",
          setup: "Slightly more forward brake bias (58–59%) helps manage the front loading under braking on the downhill approach.",
        }
      },
      {
        name: "Andretti Hairpin (Turn 5)",
        importance: "high",
        note: "Tight hairpin — rotation and traction priority. Diff tuning matters significantly here.",
        rookie: {
          what: "A slow hairpin in the middle of the infield section. Very tight — you need to really slow down. Exit traction is the key.",
          inputs: "Brake firm, rotate the car, then apply throttle very progressively. Wheelspin here sends you sideways quickly. Patient and smooth.",
          setup: "Medium power differential lock (60–65%). Too high and the car pushes wide on entry; too low and the rear spins on exit.",
        }
      },
      {
        name: "Corkscrew (Turn 8/9)",
        importance: "critical",
        note: "The world's most famous corner. Blind entry, massive downhill drop, direction change. Soft suspension, total commitment.",
        rookie: {
          what: "The most famous corner in American motorsport. You drive over a crest and the road drops sharply away to the left, then immediately turns right. You can't see the landing from the entry.",
          inputs: "Pick a braking point landmark (a post, a line on the road) and use it every lap. Turn left before you can see the bottom. The car will drop — let it. Don't brake after you've turned. Trust the track.",
          setup: "This is the most important corner for soft suspension. If the car lands hard and bounces, soften bump damping. Soft rear springs also help absorb the compression at the bottom of the drop.",
        }
      },
      {
        name: "Rainey Curve (Turn 11)",
        importance: "critical",
        note: "Long final corner — sustained front load, traction onto the front straight. Front tyre condition key.",
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
        note: "Uphill heavy braking zone — grip builds through the corner. Late apex, aggressive traction.",
        rookie: {
          what: "An uphill right-hander at the end of the main straight. The uphill approach fools many beginners into braking too late — the car doesn't slow down as fast as on flat ground.",
          inputs: "Brake earlier than instinct suggests. The uphill helps, but not as much as you think. Late apex — hug the inside kerb — then get on the throttle early as the track continues uphill.",
          setup: "Higher power differential lock (65–70%) is rewarded here because the uphill gradient naturally helps traction. More lock = more acceleration up the hill.",
        }
      },
      {
        name: "Turn 3 (Remus Kurve)",
        importance: "critical",
        note: "Second major braking zone — over the crest blind. The primary lap time differentiator.",
        rookie: {
          what: "A heavy braking zone over a blind crest — you can't see the corner until you're nearly at it. This is where most time differences between drivers appear.",
          inputs: "Pick a braking marker and commit to it. Don't be tempted to brake later just because you can't see the corner yet. The crest can make the car light, so very late braking risks locking up and going straight on.",
          setup: "Brake bias should be set conservatively (57–58% front) to avoid locking a wheel over the crest where grip is temporarily reduced.",
        }
      },
      {
        name: "Turn 6 (Rindt Kurve)",
        importance: "high",
        note: "Downhill right-hander — car unloads, needs careful setup to stay planted at speed.",
        rookie: {
          what: "A medium-speed right-hander that goes downhill. The car becomes lighter as the track drops, reducing rear grip.",
          inputs: "Be gentle with inputs as the car unloads. Don't trail-brake aggressively. Smooth throttle from the apex — the downhill actually helps you accelerate away.",
          setup: "More rear wing helps press the car down as it becomes light on the downhill section. Rear toe-in also provides passive stability.",
        }
      },
      {
        name: "Turn 9–10 (final complex)",
        importance: "high",
        note: "Final corner combination — traction here feeds the main straight directly.",
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
        note: "Slow right-hand hairpin — repeated heat cycles destroy the front tyres. Tyre management begins here.",
        rookie: {
          what: "The first corner and a tight hairpin. You brake from reasonable speed into a slow right-hander. This corner is repeated in almost the same form later in the lap, causing the fronts to overheat.",
          inputs: "Brake firmly, rotate the car, and apply smooth throttle. Don't attack the kerb on entry — it unbalances the car for the exit. Think about tyre conservation from lap one.",
          setup: "Conservative front camber settings protect the inner front tyre edge. If the inner front is much hotter than the outer after T1, reduce camber by 0.1–0.2°.",
        }
      },
      {
        name: "T4 (Long left-hander)",
        importance: "critical",
        note: "The longest sustained corner — exposes every balance issue. Most front wear generated here.",
        rookie: {
          what: "The longest corner on the lap — a sustained left-hander that keeps the front tyres under load for a long time. If your front tyres are worn by the end of a stint, this is why.",
          inputs: "Don't try to carry maximum speed — tyre protection matters more than lap time on a single corner here. Smooth throttle, avoid fighting understeer with steering force.",
          setup: "Soft front ARB gives more mechanical grip and reduces the load on the outer front tyre. If the fronts are overheating, this is the first setup change to try.",
        }
      },
      {
        name: "T6–T7 complex",
        importance: "high",
        note: "Mid-circuit esses — faster than they appear, the key aero balance diagnosis section.",
        rookie: {
          what: "A flowing S-bend section in the middle of the circuit. It's faster than it looks and the car changes direction quickly.",
          inputs: "Flow through — small inputs. The car should feel planted and confident. If it doesn't, your aero balance is off. Be progressive with throttle through the second part.",
          setup: "This section diagnoses aero balance well. Understeer = less rear wing or more front wing. Oversteer = more rear wing.",
        }
      },
      {
        name: "T11 (Final hairpin)",
        importance: "critical",
        note: "Tight hairpin — traction exit feeds the main straight. Differential settings are the key variable.",
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
        note: "Banked concrete bowl — unload the car and let the banking do the work. Fighting it causes snap oversteer.",
        rookie: {
          what: "A famous banked corner — the track dips into a concrete banking that tilts the car. The banking provides extra grip but only if you use it correctly.",
          inputs: "Drop into the banking (the lower line), let the car lean into it, and carry your speed through. Don't fight the car or try to steer out of the banking — the geometry does the work. Smooth, consistent throttle.",
          setup: "Softer suspension lets the car settle into the banking naturally. Stiff springs fight the banking and create instability. Higher ride height prevents bottoming out in the dip.",
        }
      },
      {
        name: "Pflanzgarten",
        importance: "critical",
        note: "Two compressions and a jump — car goes airborne. Suspension compliance and ride height are everything here.",
        rookie: {
          what: "A section with compressions and crests where the car can become airborne. One of the most dangerous sections of the Nordschleife at speed.",
          inputs: "Do not brake over the crests — you'll lock up immediately. Lift before the crest, not on it. Keep your hands still while airborne — steering inputs while the car is light cause huge instability on landing.",
          setup: "Maximum ride height to prevent bottoming out on the compressions. Softest possible bump damping so the car absorbs the landings rather than bouncing. This is the most setup-critical section.",
        }
      },
      {
        name: "Schwedenkreuz / Aremberg",
        importance: "critical",
        note: "High-speed left-right over blind crests — the most dangerous section. Commitment builds over many laps.",
        rookie: {
          what: "A high-speed left-right sequence over blind crests — you can't see what's coming. This is the most intimidating section for newcomers to the Nordschleife.",
          inputs: "Build up to this section gradually over many laps. Use the barriers and tree lines as visual guides for where the track goes. Hold the throttle steadily — any sudden lift over the crests can unsettle the car. Trust the car.",
          setup: "High-speed rear stability is key — ensure rear wing is set to at least medium, and rear toe-in is at the higher end of range. A nervous rear through here is extremely dangerous.",
        }
      },
      {
        name: "Brünnchen complex",
        importance: "high",
        note: "Long mid-speed right — bumpy and traction-sensitive. More incidents occur here than anywhere on the lap.",
        rookie: {
          what: "A long, medium-speed right-hander over a bumpy surface. The car can bounce and lose grip unexpectedly — this section catches many drivers out.",
          inputs: "Take a wide entry line, be smooth throughout, and don't fight the bumps with the steering. Apply throttle progressively — wheelspin on bumps causes instant oversteer. Margin is your friend here.",
          setup: "Softer bump and rebound damping is essential. If the car bounces or skips here, soften bump on both axles. Never run a stiff race setup at the Nordschleife.",
        }
      },
    ]
  },
};