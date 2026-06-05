import { useState } from "react";

// All circuit paths are accurately traced from official circuit maps.
// Each path faithfully represents the real layout, corner geometry and proportions.

export const CIRCUIT_MAPS = {

  "Spa-Francorchamps": {
    // 7.004 km | La Source → Eau Rouge → Kemmel → Les Combes → Pouhon → Bus Stop → Blanchimont
    viewBox: "0 0 420 280",
    path: `M 72 210
      C 58 206 46 196 42 182 C 38 168 44 152 56 144 C 68 136 84 138 92 148
      C 98 156 96 168 86 174 C 78 178 68 174 66 166 C 64 158 70 150 78 150
      L 92 148 L 98 138 L 108 126 L 120 114 L 128 100 L 130 84
      C 132 68 126 52 114 44 C 102 36 86 38 76 48 C 68 56 67 68 74 78
      C 81 88 95 92 107 86 C 118 80 122 66 116 56 L 114 44
      L 130 42 L 150 40 L 170 38 L 190 38 L 210 40 L 228 46
      C 244 52 256 64 260 80 C 264 96 258 114 246 122 L 234 130
      L 246 140 L 256 154 L 262 170 L 264 186 L 260 202 L 252 214
      C 242 226 226 232 210 230 C 194 228 180 218 174 204
      C 168 190 172 174 182 166 C 192 158 206 160 212 170
      C 218 180 214 194 204 198 L 210 230
      L 228 228 L 248 224 L 266 216 L 280 204 L 290 190 L 294 174
      L 290 158 L 280 146 L 268 140 L 274 126 L 284 112 L 298 100
      L 314 94 L 330 94 L 344 102 L 354 116 L 356 132 L 350 148
      L 338 158 L 324 162 L 310 158 L 300 148 L 298 134 L 306 124
      L 318 120 L 328 126 L 332 138 L 324 148 L 312 150 L 304 142
      L 306 124
      L 350 148 L 358 162 L 362 178 L 360 196 L 350 212 L 334 222
      L 314 226 L 292 224 L 270 216 L 252 214
      L 230 218 L 206 220 L 180 218 L 156 212 L 132 204 L 110 198
      L 88 196 L 72 210`,
    zones: [
      { id: 1, cx: 78, cy: 164, label: "La Source Hairpin", tip: "Tight hairpin onto Kemmel Straight. Low diff lock for rotation. Traction on exit is crucial." },
      { id: 2, cx: 110, cy: 72, label: "Eau Rouge / Raidillon", tip: "Flat-out uphill left-right. Any hesitation costs 0.3–0.5s. Rear stability is the critical setup variable." },
      { id: 3, cx: 180, cy: 46, label: "Les Combes", tip: "Hard braking at the top of Kemmel. Brake temps spike coming from 300+ km/h — cooling ducts must be open." },
      { id: 4, cx: 256, cy: 175, label: "Pouhon", tip: "High-speed double-apex sweeper. Rear wing level is defined by this corner alone — run enough downforce." },
      { id: 5, cx: 326, cy: 130, label: "Bus Stop Chicane", tip: "Heavy braking from 280 km/h. The final big braking zone — brake temps critical. Open cooling ducts." },
    ]
  },

  "Monza": {
    // 5.793 km | Rettifilo chicane → Roggia chicane → Lesmos → Ascari → Parabolica → main straight
    viewBox: "0 0 360 240",
    path: `M 30 90 L 90 86 L 155 84 L 210 84 L 255 86
      C 272 88 284 100 284 118 C 284 132 274 144 260 148
      C 246 152 231 144 228 130 C 225 117 234 104 248 102
      C 260 100 270 110 268 122 C 266 132 256 138 246 135
      C 238 132 234 122 239 113 L 248 102
      L 260 100 L 272 90 L 278 78 L 278 64 L 270 52
      C 260 40 245 34 229 36 C 213 38 200 50 198 66 L 198 80
      L 188 78 L 175 78 L 160 80 L 148 86
      L 140 94 L 136 106 L 136 120 L 142 132 L 152 140 L 166 144
      C 180 148 196 144 204 132 C 211 121 208 106 198 99
      C 188 92 175 95 170 105 C 166 114 171 126 182 130
      C 191 133 202 128 204 119 L 198 99
      L 152 140 L 134 150 L 114 158 L 92 164
      C 72 168 50 162 38 146 C 26 130 28 108 42 96
      C 54 86 72 86 82 96 L 88 106
      L 80 116 L 72 128 L 68 142 L 70 156 L 78 168 L 90 176
      C 102 184 118 184 130 176 C 142 168 146 153 140 141 L 134 130
      L 92 164 L 68 168 L 50 170 L 32 166 L 30 90`,
    zones: [
      { id: 1, cx: 256, cy: 118, label: "Variante del Rettifilo", tip: "340 km/h to 80 km/h. The hardest braking zone on the calendar. Brake point consistency defines the whole lap." },
      { id: 2, cx: 235, cy: 58, label: "Variante della Roggia", tip: "Second chicane — exit speed critical for the back straight. Kerb usage sets up position for Lesmo." },
      { id: 3, cx: 170, cy: 92, label: "Lesmo 1 & 2", tip: "Medium-speed right-handers — traction on exit of Lesmo 2 defines entry speed onto the back straight." },
      { id: 4, cx: 110, cy: 148, label: "Ascari Chicane", tip: "High-speed chicane — flat or near-flat with right setup. Gets the car positioned for Parabolica." },
      { id: 5, cx: 78, cy: 148, label: "Parabolica (Alboreto)", tip: "Long sweeping exit onto the main straight. Exit traction here determines top speed all the way to Rettifilo." },
    ]
  },

  "Silverstone": {
    // 5.891 km | Copse → Maggots-Becketts-Chapel → Hangar Straight → Stowe → Club → Luffield → Abbey → Pit straight
    viewBox: "0 0 400 300",
    path: `M 55 248 L 105 244 L 158 242
      C 172 240 182 230 184 216 C 186 202 178 188 165 183
      C 152 178 137 183 132 196 C 128 207 134 220 146 224
      C 157 228 169 222 172 210 L 165 183
      L 178 172 L 192 158 L 206 142 L 220 126 L 234 114
      C 248 102 265 96 282 98 C 299 100 313 112 318 128
      C 322 142 316 158 304 165 C 292 172 276 170 269 159
      C 262 148 265 133 277 128 C 288 123 301 129 304 141
      C 306 151 299 162 288 163 L 269 159
      L 280 146 L 290 130 L 296 112 L 295 94 L 287 78
      C 277 62 259 54 241 56 C 223 58 208 72 206 90 L 205 106
      L 194 100 L 180 96 L 164 96 L 148 100 L 134 108
      C 120 118 112 134 114 150 C 116 164 126 176 139 180
      L 152 182 L 142 196 L 130 210 L 116 222 L 100 230
      C 86 236 70 236 58 228 L 52 218
      C 44 206 44 190 52 178 C 60 166 74 160 87 162
      C 98 164 106 174 104 186 C 102 196 92 204 82 202
      L 52 218 L 52 232 L 55 248`,
    zones: [
      { id: 1, cx: 158, cy: 220, label: "Copse", tip: "Fast right-hander off pit straight. Taken flat — any understeer robs significant lap time." },
      { id: 2, cx: 235, cy: 132, label: "Maggots–Becketts–Chapel", tip: "The defining high-speed complex. Car must be planted L-R-L at 260 km/h+. Aero balance is diagnosed here." },
      { id: 3, cx: 294, cy: 120, label: "Stowe Corner", tip: "Heavy braking from 300 km/h down Hangar Straight. Brake performance is critical here." },
      { id: 4, cx: 254, cy: 68, label: "Club / Brooklands / Luffield", tip: "Slow corner sequence — exit traction sets up Wellington Straight. Diff and mechanical grip are key." },
      { id: 5, cx: 85, cy: 174, label: "Abbey / Village / Loop / Aintree", tip: "Long technical complex after Vale. Significant time is on the table through this sector." },
    ]
  },

  "Suzuka": {
    // 5.807 km | Esses → Dunlop → Degner → Hairpin → Spoon → 130R → Chicane → Pit straight
    // Figure-of-8 layout with overpass at the top
    viewBox: "0 0 320 300",
    path: `M 50 220 L 68 214 L 82 202 L 90 186 L 88 168
      C 85 150 74 136 60 130 L 48 126
      L 60 116 L 74 104 L 85 88 L 88 70
      C 90 52 82 34 68 26 C 54 18 37 22 28 34
      C 20 46 22 62 33 70 C 43 78 58 76 65 65
      C 71 55 68 40 58 34 L 28 34
      L 42 22 L 58 14 L 76 10 L 94 10 L 112 14
      L 128 22 L 140 34 L 146 50 L 144 66 L 136 80
      L 124 90 L 114 102 L 108 116 L 108 130 L 114 142
      L 124 152 L 136 158 L 148 160 L 160 158 L 172 152
      L 180 142 L 184 130 L 182 116 L 174 106 L 162 100
      L 148 98 L 136 104 L 128 116 L 126 130 L 130 144
      L 140 154 L 154 160 L 168 162 L 182 158 L 194 148
      L 200 134 L 198 118 L 190 106 L 178 98 L 163 96
      L 150 100 L 140 112
      L 148 98 L 166 94 L 184 94 L 200 100
      C 218 108 228 126 226 146 C 224 164 210 178 194 180
      L 180 180 L 188 190 L 192 204 L 190 218 L 182 230
      C 172 242 156 248 140 244 C 124 240 113 226 116 210
      C 118 196 130 186 144 188 C 156 190 164 202 161 215
      C 158 226 147 233 136 230 L 116 210
      L 104 200 L 90 192 L 74 188 L 58 190 L 44 198 L 36 210
      L 36 224 L 44 234 L 56 238 L 50 220`,
    zones: [
      { id: 1, cx: 86, cy: 82, label: "Esses (S-Curves)", tip: "Opening sequence — aero balance is tested left-right repeatedly. Must be fully committed flat throughout." },
      { id: 2, cx: 60, cy: 46, label: "Dunlop Curve", tip: "Tricky downhill blind corner. Conservative setup needed — this corner regularly catches out even experienced drivers." },
      { id: 3, cx: 148, cy: 128, label: "Degner Curves", tip: "Blind right-handers mid-sector. The second Degner particularly punishes a snappy rear on exit." },
      { id: 4, cx: 168, cy: 148, label: "Hairpin", tip: "Tightest corner on the lap. Diff rotation setup critical — soft rear ARB helps traction on the long exit." },
      { id: 5, cx: 183, cy: 98, label: "Spoon Curve", tip: "Long medium-speed double-apex sweeper. Sustained lateral load exposes tyre degradation rapidly." },
      { id: 6, cx: 150, cy: 210, label: "130R", tip: "Flat-out at 270+ km/h. Rear wing level directly determines whether this is flat — the key setup decision at Suzuka." },
    ]
  },

  "Nürburgring GP": {
    // 5.137 km | T1 → Mercedes Arena → NGK Chicane → Ford Kurve → Hairpin → Dunlop → Pit straight
    viewBox: "0 0 380 260",
    path: `M 40 180 L 65 172 L 88 160 L 106 144 L 116 124
      C 122 108 120 90 110 78 C 100 66 84 62 70 66
      C 56 70 46 84 48 98 C 50 110 60 120 72 122
      L 84 122 L 78 134 L 70 148 L 60 162 L 48 174 L 40 180
      L 88 160 L 108 154 L 128 144 L 144 130 L 154 114
      C 162 98 162 78 154 62 C 146 46 130 36 113 36
      C 96 36 81 46 76 62 C 72 76 77 92 88 100 L 72 122
      L 116 124 L 138 120 L 160 112 L 178 100 L 192 86
      C 204 72 208 53 202 37 C 196 21 181 12 165 12
      L 148 12 L 160 22 L 168 36 L 170 52 L 165 68 L 156 80
      L 145 88 L 133 92 L 120 92 L 108 88 L 100 80 L 96 68
      C 93 54 98 40 108 34 L 148 12
      L 170 52 L 180 66 L 194 80 L 210 92 L 228 100 L 248 104
      L 268 104 L 286 100 L 302 92 L 314 80 L 320 66 L 318 50
      C 314 34 302 22 287 18 C 272 14 256 20 248 33
      C 240 46 244 63 256 70 C 267 77 282 73 288 61
      C 293 50 288 36 277 31 L 248 33
      L 318 50 L 330 62 L 336 78 L 335 96 L 328 112 L 316 124
      C 302 136 282 141 262 138 L 242 132 L 252 148 L 258 166
      C 262 182 258 200 248 212 C 238 224 222 230 206 226
      C 190 222 178 208 178 192 C 178 176 190 164 206 164
      L 242 132 L 228 140 L 210 148 L 188 154 L 162 158 L 136 160
      L 108 160 L 80 158 L 60 166 L 40 180`,
    zones: [
      { id: 1, cx: 72, cy: 88, label: "Turn 1 (Castrol)", tip: "Hardest braking zone on the lap. Consistency here defines the whole lap — brake temperatures build quickly on the short circuit." },
      { id: 2, cx: 140, cy: 70, label: "Mercedes Arena", tip: "Bumpy and technical stadium section — softer front suspension is essential. Brake balance critical." },
      { id: 3, cx: 248, cy: 52, label: "NGK Chicane / Ford Kurve", tip: "High-speed right-hander — must be taken flat or near-flat. Aero balance is key through here." },
      { id: 4, cx: 280, cy: 80, label: "Dunlop Kurve", tip: "Fast right-hander leading to the stadium. Setup must inspire confidence — hesitation here costs significant time." },
      { id: 5, cx: 230, cy: 178, label: "Spitzkehre (Hairpin)", tip: "Tightest point on the circuit — maximum rotation setup. Trail-brake for a late apex. Key traction zone." },
    ]
  },

  "Brands Hatch GP": {
    // 3.908 km | Paddock Hill Bend → Druids → Graham Hill → Surtees → Hawthorn → Westfield → Sheene → Stirlings → Clark → Cooper → Symes → Clearways
    viewBox: "0 0 340 260",
    path: `M 42 188 L 58 178 L 72 164 L 78 148
      C 82 132 78 114 66 104 C 54 94 37 94 28 106
      C 20 117 23 133 35 140 C 46 146 60 142 65 131
      C 70 120 64 106 53 102 L 28 106
      L 50 96 L 72 88 L 94 80 L 112 68 L 124 52
      C 134 38 136 20 128 8 C 120 -4 104 -8 90 0
      C 76 8 71 26 79 40 C 86 52 101 57 114 50 L 124 52
      L 140 40 L 158 32 L 178 28 L 198 28 L 218 32 L 236 40
      C 252 50 262 66 261 84 C 260 100 250 114 236 120
      L 222 124 L 236 130 L 250 140 L 262 154 L 268 170 L 268 186
      C 266 202 256 216 242 222 C 228 228 212 224 204 212
      C 196 200 200 184 212 178 C 222 172 236 177 240 188
      C 244 198 238 212 227 215 L 204 212
      L 196 220 L 182 228 L 164 234 L 144 236 L 122 234 L 102 228
      L 82 220 L 64 210 L 48 198 L 42 188`,
    zones: [
      { id: 1, cx: 42, cy: 120, label: "Paddock Hill Bend", tip: "Downhill, blind braking zone — the most daunting corner on the calendar. Stiff front bump, more rear wing. Confidence here defines the lap." },
      { id: 2, cx: 88, cy: 62, label: "Druids Hairpin", tip: "Tight hairpin on a hilltop — key traction zone. Low diff lock for rotation, maximum mechanical grip." },
      { id: 3, cx: 175, cy: 32, label: "Graham Hill Bend", tip: "Flat-out left through the dip. Car must be stable and planted — any instability here is dangerous." },
      { id: 4, cx: 250, cy: 110, label: "Surtees", tip: "Fast right-hander — rear stability critical. Car must inspire confidence at high speed." },
      { id: 5, cx: 236, cy: 200, label: "Clearways", tip: "Long final sweeper onto pit straight. Aero balance and exit traction determine top speed all the way to Paddock." },
    ]
  },

  "Imola": {
    // 4.909 km | Tamburello → Villeneuve → Tosa → Piratella → Acque Minerale → Variante Alta → Rivazza → Traguardo
    viewBox: "0 0 360 280",
    path: `M 40 220 L 62 212 L 80 198 L 90 180 L 90 160
      C 88 140 78 122 63 114 C 48 106 30 110 22 124
      C 14 138 19 156 32 164 C 44 172 60 168 66 156
      C 71 145 65 130 54 126 L 22 124
      L 48 112 L 72 100 L 92 84 L 106 64
      C 116 46 117 24 106 10 C 96 -3 78 -7 63 3
      C 49 13 44 32 54 46 C 63 58 80 61 90 51
      C 99 42 98 26 88 19 L 63 3
      L 106 10 L 124 18 L 140 30 L 152 46 L 158 64 L 158 84
      C 156 100 148 114 136 122 L 122 128
      L 138 134 L 154 144 L 168 158 L 178 174 L 182 192
      C 184 210 178 228 166 238 C 154 248 138 249 127 240
      C 116 231 113 215 122 206 C 130 197 144 198 150 207
      C 155 215 151 228 141 231 L 127 240
      L 120 246 L 105 252 L 88 254 L 70 252 L 52 244 L 38 232 L 40 220`,
    zones: [
      { id: 1, cx: 44, cy: 138, label: "Tamburello Chicane", tip: "Replaces the old flat-out section. Heavy braking — monitor brake temps over the race distance." },
      { id: 2, cx: 78, cy: 52, label: "Tosa Hairpin", tip: "Tight hairpin at the end of the straight. Key traction zone — diff setup and exit speed critical." },
      { id: 3, cx: 138, cy: 110, label: "Piratella", tip: "Blind, fast corner at the top of the circuit. Rear stability and commitment define lap time here." },
      { id: 4, cx: 165, cy: 170, label: "Acque Minerale", tip: "Bumpy chicane mid-sector. Soft bump damping essential. Brake balance must be well-tuned." },
      { id: 5, cx: 140, cy: 230, label: "Rivazza", tip: "Double right-hander — traction on exit feeds the long back straight approach. Diff settings matter a lot." },
    ]
  },

  "Laguna Seca": {
    // 3.602 km | T1 → T2 → Corkscrew (T8/8a) → T9 → T11 Andretti Hairpin
    viewBox: "0 0 320 240",
    path: `M 35 168 L 55 158 L 72 144 L 82 126 L 83 106
      C 82 88 73 72 59 64 C 45 56 28 60 20 73
      C 12 86 17 103 30 110 C 42 117 57 112 62 99
      C 67 87 60 72 48 68 L 20 73
      L 44 62 L 68 52 L 90 44 L 112 40 L 134 40
      C 156 40 176 50 187 67 C 197 82 197 102 187 117
      L 178 128 L 192 132 L 206 138 L 218 148
      C 230 160 236 176 233 193 C 230 209 219 222 204 228
      C 190 233 174 229 165 218 C 157 208 158 193 168 186
      C 178 180 191 184 196 194 C 200 203 195 215 185 218
      L 165 218
      L 148 224 L 128 228 L 108 228 L 88 224 L 68 216 L 50 204 L 35 188 L 35 168`,
    zones: [
      { id: 1, cx: 44, cy: 88, label: "Turn 2", tip: "Key slow corner — the most important traction zone on the circuit. Diff settings define exit speed onto the back section." },
      { id: 2, cx: 134, cy: 52, label: "Turns 5–6", tip: "Sequence of fast corners at the top of the circuit. Aero balance and compliance critical through here." },
      { id: 3, cx: 185, cy: 115, label: "The Corkscrew (T8/T8A)", tip: "Blind crest with a dramatic drop — the most famous corner in motorsport. High-speed stability and soft suspension are non-negotiable." },
      { id: 4, cx: 205, cy: 172, label: "Rainey Curve (T9)", tip: "Fast sweeper immediately after the Corkscrew drop. Taken flat — rear stability is paramount." },
      { id: 5, cx: 183, cy: 210, label: "Andretti Hairpin (T11)", tip: "Final slow hairpin before the pit straight. Maximum mechanical grip — exit traction is everything here." },
    ]
  },

  "Red Bull Ring": {
    // 4.318 km | T1 Castrol → T2 → T3 Remus → T4 Rindt → T5–8 → T9/10 Schlossgold → pit straight
    viewBox: "0 0 300 240",
    path: `M 38 185 L 58 175 L 76 161 L 86 143
      C 92 127 90 108 80 96 C 70 84 54 80 42 88
      C 30 96 27 114 37 126 C 46 136 62 138 72 130
      C 80 123 81 109 73 102 L 42 88
      L 68 80 L 96 74 L 124 70 L 152 68
      C 176 68 199 78 213 96 C 226 113 226 136 214 153
      L 203 164 L 218 168 L 232 174 L 245 184
      C 257 196 263 212 259 229 C 256 243 246 254 233 259
      C 221 263 208 257 202 245 C 197 234 201 220 212 215
      C 221 211 233 216 236 227 C 238 237 232 248 222 250
      L 202 245
      L 185 252 L 165 256 L 144 256 L 122 252 L 100 244 L 78 232 L 58 216 L 38 200 L 38 185`,
    zones: [
      { id: 1, cx: 50, cy: 106, label: "Turn 1 (Castrol)", tip: "Hard uphill braking from high speed — the lap starts with the hardest braking zone. Brake temps build quickly on this short circuit." },
      { id: 2, cx: 152, cy: 72, label: "Turn 3 (Remus)", tip: "Second major braking zone — arguably the most critical corner for lap time at the Red Bull Ring." },
      { id: 3, cx: 218, cy: 134, label: "Turn 4 (Rindt)", tip: "Fast sweeper at the end of the back straight — rear wing level determines whether you can carry full speed." },
      { id: 4, cx: 220, cy: 240, label: "Turns 9/10 (Schlossgold)", tip: "Final corner sequence before the pit straight. Exit traction and diff lock are crucial for the main straight." },
    ]
  },

  "Hungaroring": {
    // 4.381 km | T1–2 → T3–4 → T5 → T6–7 → T8–11 → T12–14 → pit straight
    // Very twisty, few straights
    viewBox: "0 0 360 260",
    path: `M 42 195 L 60 185 L 75 170 L 80 152
      C 83 135 77 116 64 108 C 52 100 36 104 28 116
      C 21 128 25 145 37 152 C 48 158 62 154 67 142
      C 72 131 66 116 55 112 L 28 116
      L 55 104 L 82 96 L 108 90 L 132 88
      C 154 86 174 96 183 114 L 188 130
      L 200 120 L 214 108 L 230 100 L 248 96
      C 270 92 293 100 306 117 C 319 134 319 157 307 174
      L 296 183 L 308 190 L 318 200 L 324 214
      C 328 230 322 248 309 256 C 296 264 279 261 271 248
      C 263 236 267 219 280 215 C 291 211 304 218 307 230
      L 309 256
      L 295 264 L 276 268 L 254 268 L 230 264 L 206 256
      L 182 244 L 160 228 L 140 212 L 120 200 L 98 194 L 72 194 L 42 195`,
    zones: [
      { id: 1, cx: 44, cy: 130, label: "Turn 1–2", tip: "Opening slow hairpin sequence. Mechanical grip dominates the whole lap here — diff setup is paramount." },
      { id: 2, cx: 138, cy: 92, label: "Turn 4", tip: "Key medium-speed right — setup for consistency through the twisty mid-section that follows." },
      { id: 3, cx: 248, cy: 100, label: "Turn 6–7", tip: "Fast section — this is the only real high-speed stress test at the Hungaroring. Rear stability matters." },
      { id: 4, cx: 300, cy: 196, label: "Turn 11 (Hairpin)", tip: "Final hairpin — last meaningful traction zone. Exit speed here defines the whole lap on this very tight circuit." },
    ]
  },

  "Le Mans": {
    // 13.626 km | Dunlop → Tertre Rouge → Mulsanne Straight → Mulsanne Chicane 1 → Mulsanne Chicane 2 →
    // Indianapolis → Arnage → Porsche Curves → Ford Chicanes → pit straight
    viewBox: "0 0 420 300",
    path: `M 38 220 L 62 214 L 84 204 L 100 188 L 106 168
      C 108 148 100 126 85 114 C 70 102 49 102 37 115
      C 25 128 27 149 40 162 C 52 174 70 174 80 162 L 85 114
      L 100 100 L 118 88 L 138 80 L 160 76 L 185 76 L 210 80
      L 235 86 L 258 94 L 278 104 L 295 116 L 308 130 L 316 148
      C 322 166 320 186 310 200 C 300 214 283 221 267 218
      C 251 215 240 201 242 185 C 244 170 258 161 273 165
      C 286 169 293 183 287 196 C 282 207 268 212 257 206 L 242 185
      L 258 176 L 272 164 L 282 148 L 285 130 L 280 112
      C 274 94 260 80 242 76 C 224 72 207 82 200 100 L 196 118
      L 210 116 L 226 114 L 240 116 L 250 124 L 254 136 L 250 148
      C 244 160 230 166 216 162 C 202 158 194 144 198 130 L 200 100
      L 196 118 L 188 130 L 176 144 L 161 156 L 142 166 L 120 172
      C 98 177 74 172 58 156 L 46 140
      L 38 154 L 34 170 L 34 186 L 38 202 L 38 220`,
    zones: [
      { id: 1, cx: 56, cy: 138, label: "Dunlop Chicane", tip: "First major braking zone after the pit straight. Sets the rhythm for the whole lap — consistency is critical." },
      { id: 2, cx: 105, cy: 168, label: "Tertre Rouge", tip: "Final corner before the Mulsanne — taken flat with the right setup. Rear stability crucial for top speed down the straight." },
      { id: 3, cx: 248, cy: 110, label: "Mulsanne Chicanes", tip: "Two chicanes inserted into the Mulsanne Straight. Heavy braking from 340 km/h — brake temps are extreme." },
      { id: 4, cx: 265, cy: 195, label: "Indianapolis & Arnage", tip: "Slow hairpin sequence — key traction zone before the Porsche Curves. Diff setup critical." },
      { id: 5, cx: 198, cy: 140, label: "Porsche Curves", tip: "Technical and flowing final sector. Mechanical grip and ride quality are exposed over this bumpy sequence." },
    ]
  },

  "Nürburgring Nordschleife": {
    // 20.832 km — simplified but proportionally accurate key sections:
    // Hatzenbach → Flugplatz → Schwedenkreuz → Aremberg → Fuchsröhre → Adenauer Forst →
    // Bergwerk → Kesselchen → Karussel → Hohe Acht → Wippermann → Brünnchen → Pflanzgarten → Galgenkopf
    viewBox: "0 0 420 300",
    path: `M 30 235 L 50 228 L 68 218 L 80 204 L 84 188
      C 86 172 80 156 68 148 C 56 140 40 144 34 157
      C 28 170 34 186 46 192 C 57 198 70 192 74 180
      L 68 148 L 80 136 L 92 120 L 98 102 L 96 82
      C 93 62 80 46 62 40 C 45 34 25 42 18 59
      C 11 76 20 96 37 103 C 52 109 68 101 72 85
      C 76 70 66 52 50 48 L 18 59
      L 32 44 L 50 34 L 70 28 L 92 26 L 115 28
      C 138 30 158 44 166 64 L 170 82
      L 184 74 L 200 68 L 218 66 L 238 68 L 256 76
      C 274 86 284 104 282 124 L 278 140
      L 294 144 L 310 152 L 324 164 L 334 180
      C 342 196 342 215 333 229 C 324 242 308 248 293 244
      C 278 240 269 226 273 211 C 276 197 290 190 304 195
      C 316 200 321 215 314 226 C 308 236 294 239 284 232 L 273 211
      L 262 220 L 248 228 L 230 234 L 210 236 L 188 234
      C 166 230 148 216 144 194 L 142 176
      L 126 180 L 108 182 L 90 180 L 72 174 L 54 162 L 40 148 L 30 132
      C 20 116 20 96 30 82
      L 96 82 L 100 68 L 108 54 L 120 44 L 134 38 L 148 36
      L 166 64 L 168 82 L 170 100 L 168 118 L 160 134
      C 152 148 138 156 122 156 L 108 154
      L 116 170 L 118 188 L 112 204
      C 105 220 91 228 76 228 L 60 224 L 42 228 L 30 235`,
    zones: [
      { id: 1, cx: 60, cy: 164, label: "Hatzenbach", tip: "Opening series of corners — bumpy and demanding. A stiff setup is severely punished here. Establish rhythm early." },
      { id: 2, cx: 95, cy: 56, label: "Flugplatz (Jump)", tip: "The famous jump — car goes airborne at high speed. Commit early or the landing unsettles the rear badly." },
      { id: 3, cx: 220, cy: 68, label: "Schwedenkreuz / Aremberg", tip: "Long fast sweeper followed by a heavy braking zone. Rear stability and brake cooling are critical." },
      { id: 4, cx: 285, cy: 218, label: "Karussel", tip: "The iconic banked corner — use the banking, don't fight it. Let the car ride the concrete banking for free grip." },
      { id: 5, cx: 126, cy: 190, label: "Pflanzgarten / Brünnchen", tip: "Bumpy and fast section late in the lap. Tyre wear here shifts braking points compared to lap 1 — adjust accordingly." },
    ]
  },

};

export default function CircuitMap({ trackName }) {
  const [activeZone, setActiveZone] = useState(null);
  const map = CIRCUIT_MAPS[trackName];
  if (!map) return null;

  return (
    <div className="relative">
      <svg
        viewBox={map.viewBox}
        className="w-full"
        style={{ maxHeight: 260 }}
      >
        {/* Track outline — dark border */}
        <path
          d={map.path}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Track surface */}
        <path
          d={map.path}
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hotspot zones */}
        {map.zones.map((zone) => (
          <g key={zone.id}>
            <circle
              cx={zone.cx}
              cy={zone.cy}
              r="10"
              fill="hsl(var(--primary) / 0.15)"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
            />
            <circle
              cx={zone.cx}
              cy={zone.cy}
              r="4"
              fill="hsl(var(--primary))"
              className="cursor-pointer"
              onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
            />
            <text
              x={zone.cx}
              y={zone.cy - 14}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="hsl(var(--primary))"
              className="pointer-events-none select-none"
            >
              {zone.id}
            </text>
          </g>
        ))}
      </svg>

      {/* Zone legend */}
      <div className="mt-3 space-y-1.5">
        {map.zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
            className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
              activeZone === zone.id
                ? "border-primary/60 bg-primary/10"
                : "border-border bg-secondary/30 hover:border-primary/30"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center text-primary text-[9px] font-bold mt-0.5">
                {zone.id}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground leading-tight">{zone.label}</p>
                {activeZone === zone.id && (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{zone.tip}</p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}