// Track map SVGs and key time-loss corner data
// Marker positions are expressed as percentage [left%, top%] of the rendered image bounding box,
// calibrated to the known visual layout of each circuit map.

export const TRACK_MAPS = {
  "Spa-Francorchamps": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/0e1f17a9c_SpaFrancorchampsTrackMap.svg",
    keyCorners: [
      { name: "Eau Rouge / Raidillon", importance: "critical", note: "Full commitment flat-out — rear stability is everything. A lift here costs tenths instantly.", marker: [28, 68] },
      { name: "Pouhon", importance: "critical", note: "Fastest true corner at Spa. Demands absolute rear grip — run enough wing to go flat.", marker: [18, 35] },
      { name: "La Source Hairpin", importance: "high", note: "Trail braking and rotation set the trajectory into the Kemmel descent below.", marker: [72, 60] },
      { name: "Bus Stop Chicane", importance: "high", note: "Focus on the second apex — clean exit feeds the run back to La Source.", marker: [82, 48] },
    ]
  },
  "Monza": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/fc406a6f9_MonzaTrackMap.svg",
    keyCorners: [
      { name: "Variante del Rettifilo (T1–T2)", importance: "critical", note: "Heaviest braking on the calendar — 330→80 km/h. Kerbs unsettle under maximum braking.", marker: [62, 18] },
      { name: "Variante della Roggia", importance: "critical", note: "Second chicane — exit speed feeds the Lesmo sequence directly.", marker: [82, 42] },
      { name: "Ascari Chicane", importance: "high", note: "Fast two-apex S at high speed — car must be composed, not reactive.", marker: [68, 78] },
      { name: "Parabolica (Curva Alboreto)", importance: "critical", note: "The lap-defining corner. Long, constant-radius — every mph on exit converts to main straight speed.", marker: [38, 82] },
    ]
  },
  "Nürburgring GP": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/18aa153ec_NurburgringGPTrackMap.svg",
    keyCorners: [
      { name: "Mercedes Arena (T1 complex)", importance: "critical", note: "The signature sequence — multiple linked corners, demands a calm and balanced car.", marker: [72, 72] },
      { name: "Michael Schumacher S", importance: "high", note: "Quick esses mid-sector — rear must remain stable through the fast direction change.", marker: [30, 55] },
      { name: "Hairpin (Ford Kurve)", importance: "critical", note: "Tightest corner — traction zone feeds the back straight. Diff settings critical.", marker: [20, 32] },
      { name: "Einfahrt Motodrom", importance: "high", note: "Final complex — smooth over the kerbs, exit composure feeds the pit straight.", marker: [55, 80] },
    ]
  },
  "Silverstone": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/7ae06fef8_SilverstoneTrackMap.svg",
    keyCorners: [
      { name: "Copse", importance: "critical", note: "Should be flat for most GT cars — any lift loses multiple tenths. Planted front end needed.", marker: [78, 22] },
      { name: "Maggots–Becketts–Chapel", importance: "critical", note: "The lap. Rapid direction changes at extreme speed — the definitive aero balance test.", marker: [55, 28] },
      { name: "Stowe", importance: "high", note: "Long sustained load — exposes rear tyre condition more than anywhere else on the lap.", marker: [82, 62] },
      { name: "Club Corner", importance: "high", note: "Last corner onto the pit straight — traction priority, feeds the highest speed section.", marker: [62, 78] },
    ]
  },
  "Bathurst": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/91bab6483_BathurstTrackMap.svg",
    keyCorners: [
      { name: "The Cutting", importance: "critical", note: "Blind, uphill, off-camber. Max downforce, soft suspension — the car must be predictable.", marker: [35, 28] },
      { name: "The Dipper / Forrest's Elbow", importance: "critical", note: "Downhill, blind entry, car goes light. The most dangerous section. Any oversteer here is unrecoverable.", marker: [28, 48] },
      { name: "The Chase", importance: "critical", note: "End of Conrod Straight — ultra-heavy braking zone after the longest flat section. Brake cooling essential.", marker: [72, 72] },
      { name: "Griffins Bend (T1)", importance: "high", note: "Entry to the mountain — sets the rhythm for the climb. Confidence here defines the rest.", marker: [65, 85] },
    ]
  },
  "Suzuka": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/965ea0244_SuzukaTrackMap.svg",
    keyCorners: [
      { name: "S-Curves (Turns 3–7)", importance: "critical", note: "The iconic esses taken at high speed — front stability and aero balance define your pace here.", marker: [62, 25] },
      { name: "Hairpin (Turn 11)", importance: "critical", note: "Slowest corner — maximum traction priority. Exit speed feeds the long back straight.", marker: [22, 62] },
      { name: "130R", importance: "critical", note: "Flat-out for GT cars. Any rear instability here is not recoverable. Always run enough wing.", marker: [38, 80] },
      { name: "Casio Triangle (T15–T16)", importance: "high", note: "Final chicane — braking stability then traction for the last corner onto the pit straight.", marker: [55, 72] },
    ]
  },
  "Brands Hatch GP": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/d37d003f2_BrandsHatchGPTrackMap.svg",
    keyCorners: [
      { name: "Paddock Hill Bend", importance: "critical", note: "Blind, downhill, off-camber drop. Most intimidating corner in the UK — confidence here is half the lap.", marker: [58, 28] },
      { name: "Druids Hairpin", importance: "critical", note: "Tight hairpin at the top of the hill — heavy braking, rotation, then traction for the steep descent.", marker: [72, 38] },
      { name: "Graham Hill Bend", importance: "high", note: "Bottom-section chicane — smooth direction change, don't sacrifice the exit for the entry.", marker: [42, 72] },
      { name: "Hawthorn Bend", importance: "high", note: "Fast right-hander into the GP loop — rear stability essential, feeds the long Kentagon section.", marker: [28, 52] },
    ]
  },
  "Imola": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/14e25a4a7_ImolaTrackMap.svg",
    keyCorners: [
      { name: "Tamburello chicane", importance: "critical", note: "Main overtaking point — flat-out chicane, kerbs can launch the car, exit stability critical.", marker: [42, 18] },
      { name: "Acque Minerali", importance: "critical", note: "Mid-circuit complex — bumpy, high-speed. Soft bump damping allows the car to breathe over the surface.", marker: [72, 42] },
      { name: "Variante Alta", importance: "high", note: "Double-apex over the ridge — blind entry requires composure. Both apices matter equally.", marker: [62, 65] },
      { name: "Rivazza (final hairpins)", importance: "high", note: "Double hairpin — second exit leads onto the pit straight. Traction is the priority.", marker: [28, 72] },
    ]
  },
  "Le Mans": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/33ed3ee95_LeMansTrackMap.svg",
    keyCorners: [
      { name: "Ford Chicanes (T1–T2)", importance: "critical", note: "Opening chicane — braking from 330+ km/h over two apices. Kerb abuse here ruins tyres for the entire stint.", marker: [52, 18] },
      { name: "Tertre Rouge", importance: "critical", note: "Fast right-hander feeding the Mulsanne. Every extra km/h here compounds across 6 km of flat.", marker: [72, 32] },
      { name: "Indianapolis / Arnage", importance: "critical", note: "Slowest section of the lap — mechanical grip dominant. Most time gaps between classes are created here.", marker: [72, 72] },
      { name: "Porsche Curves", importance: "critical", note: "Multi-apex S-bends — the most technically demanding section. Bumpy, fast, unforgiving of setup imbalance.", marker: [35, 75] },
    ]
  },
  "Circuit de Catalunya": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/8af4fca0a_CatalunyaTrackMap.svg",
    keyCorners: [
      { name: "T1 (Elf)", importance: "critical", note: "Heavy braking into a tight right — biggest front tyre load on the lap, sustained through the exit.", marker: [55, 22] },
      { name: "T3 (Renault)", importance: "critical", note: "Fast right after the back straight — the primary aero balance diagnostic corner.", marker: [80, 48] },
      { name: "T5 (Seat)", importance: "critical", note: "Long sustained right-hander — more front tyre degradation comes from here than anywhere else.", marker: [65, 70] },
      { name: "T9 La Caixa (hairpin)", importance: "high", note: "Slow hairpin exit — diff setup critical, long traction zone onto the pit straight area.", marker: [28, 65] },
    ]
  },
  "Laguna Seca": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/6022e1a32_LagunaSecaTrackMap.svg",
    keyCorners: [
      { name: "Turn 2 (Castrol Corner)", importance: "critical", note: "First heavy braking zone — key setup corner, traction out feeds the infield section.", marker: [68, 22] },
      { name: "Andretti Hairpin (Turn 5)", importance: "high", note: "Tight hairpin — rotation and traction priority. Diff tuning matters significantly here.", marker: [35, 45] },
      { name: "Corkscrew (Turn 8/9)", importance: "critical", note: "The world's most famous corner. Blind entry, massive downhill drop, direction change. Soft suspension, total commitment.", marker: [22, 30] },
      { name: "Rainey Curve (Turn 11)", importance: "critical", note: "Long final corner — sustained front load, traction onto the front straight. Front tyre condition key.", marker: [42, 78] },
    ]
  },
  "Red Bull Ring": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/ef87aa55e_RedBullRingTrackMap.svg",
    keyCorners: [
      { name: "Turn 1 (Castrol Kurve)", importance: "critical", note: "Uphill heavy braking zone — grip builds through the corner. Late apex, aggressive traction.", marker: [42, 22] },
      { name: "Turn 3 (Remus Kurve)", importance: "critical", note: "Second major braking zone — over the crest blind. The primary lap time differentiator.", marker: [72, 38] },
      { name: "Turn 6 (Rindt Kurve)", importance: "high", note: "Downhill right-hander — car unloads, needs careful setup to stay planted at speed.", marker: [68, 65] },
      { name: "Turn 9–10 (final complex)", importance: "high", note: "Final corner combination — traction here feeds the main straight directly.", marker: [32, 68] },
    ]
  },
  "Hungaroring": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/adf49f391_HungaroringTrackMap.svg",
    keyCorners: [
      { name: "T1 (Opening hairpin)", importance: "critical", note: "Slow right-hand hairpin — repeated heat cycles destroy the front tyres. Tyre management begins here.", marker: [55, 20] },
      { name: "T4 (Long left-hander)", importance: "critical", note: "The longest sustained corner — exposes every balance issue. Most front wear generated here.", marker: [75, 52] },
      { name: "T6–T7 complex", importance: "high", note: "Mid-circuit esses — faster than they appear, the key aero balance diagnosis section.", marker: [55, 68] },
      { name: "T11 (Final hairpin)", importance: "critical", note: "Tight hairpin — traction exit feeds the main straight. Differential settings are the key variable.", marker: [28, 52] },
    ]
  },
  "Nürburgring Nordschleife": {
    mapUrl: "https://media.base44.com/images/public/6a1df20e88c57b7eaae8c3da/e9a0a95f1_NordschleifeTrackMap.svg",
    keyCorners: [
      { name: "Caracciola Karussell", importance: "critical", note: "Banked concrete bowl — unload the car and let the banking do the work. Fighting it causes snap oversteer.", marker: [28, 55] },
      { name: "Pflanzgarten", importance: "critical", note: "Two compressions and a jump — car goes airborne. Suspension compliance and ride height are everything here.", marker: [68, 42] },
      { name: "Schwedenkreuz / Aremberg", importance: "critical", note: "High-speed left-right over blind crests — the most dangerous section. Commitment builds over many laps.", marker: [55, 25] },
      { name: "Brünnchen complex", importance: "high", note: "Long mid-speed right — bumpy and traction-sensitive. More incidents occur here than anywhere on the lap.", marker: [72, 68] },
    ]
  },
};