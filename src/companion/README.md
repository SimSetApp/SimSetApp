# SimSetApp — Live Telemetry Bridge

A tiny local companion that reads live telemetry from **8 sim racing titles** and
streams it to the SimSetApp **Live Telemetry** dashboard in real time over a local
WebSocket — on your PC or on a phone on the same WiFi.

Your data stays on your machine — the browser dashboard connects directly to
this bridge. No cloud, no latency, no account needed.

**Supported sims (Phase 1):**

| Sim | Mechanism | One-time setup |
|-----|-----------|----------------|
| iRacing | Shared memory | `pip install irsdk` + set `irsdkEnableMem=1` in app.ini |
| ACC | Shared memory | `pip install pyaccsharedmemory` + enable Shared Memory in Options |
| Assetto Corsa | Shared memory | None (run bridge as admin if AC runs as admin) |
| rFactor 2 / Le Mans Ultimate | Shared memory | `pip install pyrfactor2sharedmemory` + install the SM plugin |
| Automobilista 2 | Shared memory | Set Shared Memory = "Project CARS 2" in System settings |
| F1 2023 / 2024 | UDP (port 20777) | Enable UDP Telemetry in game |
| Forza Motorsport / Horizon | UDP (port 5300) | Enable Data Out = "Dash" in game |
| Gran Turismo 7 | UDP (port 33740) | Run with `--gt7-ps5-ip <PS5-IP>` |

> **Why a small helper is required:** sim telemetry lives in the game's shared
> memory (PC) or UDP packets — browsers can't read process memory or raw UDP
> directly, so a tiny local bridge is needed. The good news: it can be a single
> double-clickable `.exe` — see below.

## One-click Windows app (recommended)

The simplest path: a single double-clickable `.exe` — no Python, no terminal.

1. Download **SimSetAppBridge.exe** from this repo's Releases page.
2. Double-click it. A small window opens and prints `waiting…`.
3. Launch your sim and start a session — it auto-detects and goes live.
4. In SimSetApp → **Live Telemetry** → tap **Connect to bridge**.

> **No exe yet?** Build one for free with **GitHub Actions** — nothing installed
> on your computer. Copy `companion/build-bridge.yml` to
> `.github/workflows/build-bridge.yml`, then push a tag like `bridge-v1`; the
> workflow builds and publishes the `.exe` to Releases automatically. Or build
> locally: `pip install pyinstaller aiohttp psutil`, then from the
> `companion/` folder run `pyinstaller telemetry_bridge.spec`. Output:
> `dist/SimSetAppBridge.exe` (single file).
>
> Tip: drop a shortcut to the `.exe` in your Windows Startup folder so it
> auto-starts with the PC.

---

## Run from Python (alternative — any OS)

### 1. Install

```bash
pip install aiohttp psutil
```

`psutil` powers auto-detection — without it you'll need `--sim <mock|iracing|...>`.

Then add the library for your sim(s) — they're auto-detected when installed:

```bash
# Shared-memory sims
pip install irsdk pyaccsharedmemory pyrfactor2sharedmemory
# (Assetto Corsa and Automobilista 2 need no extra library — pure ctypes)

# Gran Turismo 7 (pick one Salsa20 implementation)
pip install salsa20          # or:  pip install pycryptodome
```

F1 and Forza use UDP — just enable telemetry in-game, no library needed.

### 2. Run (one click — auto-detects your sim)

```bash
python telemetry_bridge.py
```

That's it. Launch your sim and start a session — the bridge detects the sim
process automatically and goes live. No `--sim` flag, no port config.

### Force a specific source (optional)

```bash
python telemetry_bridge.py --sim mock        # demo data, no sim needed
python telemetry_bridge.py --sim iracing
python telemetry_bridge.py --sim acc
python telemetry_bridge.py --sim ac          # Assetto Corsa
python telemetry_bridge.py --sim rf2         # rFactor 2
python telemetry_bridge.py --sim lmu         # Le Mans Ultimate
python telemetry_bridge.py --sim ams2        # Automobilista 2
python telemetry_bridge.py --sim f1          # F1 (UDP 20777)
python telemetry_bridge.py --sim forza        # Forza (UDP 5300)
python telemetry_bridge.py --sim gt7 --gt7-ps5-ip 192.168.1.20   # GT7 from a PS5
python telemetry_bridge.py --port 3344 --hz 20
python telemetry_bridge.py --f1-port 20777 --forza-port 5300 --gt7-port 33740
```

You should see:

```
 SimSetApp Telemetry Bridge (aiohttp)
 Mode       : auto-detect
 WebSocket  : ws://localhost:3344/ws
 Health     : http://localhost:3344/health
 Rate       : 20 Hz
```

### 3. Connect in the app

Open SimSetApp → **Live Telemetry** → tap **Connect to bridge**.
The page shows "waiting for your sim" until you start a session, then the
dashboard lights up automatically.

## Use it on a phone (same WiFi)

The bridge binds to `0.0.0.0` so any device on your home network can connect.
On startup it prints your PC's LAN IP(s) — e.g. `192.168.1.50`. On your phone:

1. Open SimSetApp → **Live Telemetry**.
2. In the "On a phone?" box, enter `ws://192.168.1.50:3344/ws` (your PC's IP).
3. Tap **Connect** — the live dashboard appears on your phone.

Your phone and PC must be on the same WiFi. The bridge window shows the exact
address to type.

## How it works

```
[sim] --shared memory / API--> [telemetry_bridge.py] --ws://localhost:3344--> [SimSetApp dashboard]
```

The bridge sends a flat JSON telemetry frame ~20×/second while a sim session is
live (speed, RPM, gear, pedals, steering, fuel, tyre temps/wear/pressures, lap
times, delta), and a `type:"status"` heartbeat once per second while waiting for
a sim. The dashboard renders it live and (optionally) auto-logs each lap to your
session history.

## Browser note (PNA / CORS)

The app is served over HTTPS but connects to `ws://localhost`. Chrome blocks
public-origin pages from reaching local/private network services unless the
service answers a **Private Network Access (PNA) preflight** — an `OPTIONS`
request with `Access-Control-Request-Private-Network: true`.

The bridge handles this natively with **aiohttp**: the `OPTIONS` route returns
`Access-Control-Allow-Private-Network: true` + CORS headers as a normal HTTP
response, then the browser sends the WebSocket upgrade and the dashboard
connects. No fragile library hacks, no special browser flags needed.

You can verify the bridge is running by visiting `http://localhost:3344/health`
in your browser — it returns `{"bridge": true, "sim": null}`.

## Per-sim notes

### Shared-memory sims (iRacing, ACC, Assetto Corsa, rFactor 2 / LMU, AMS2)

These read a Windows memory-mapped file, so the bridge must run on the same PC
as the sim. **Administrator rights must match** — if the sim (or its launcher)
runs as administrator, run the bridge as administrator too, or Windows silently
blocks the read.

- **iRacing** — `pip install irsdk`. Set `irsdkEnableMem=1` in `documents/iRacing/app.ini`.
- **ACC** — `pip install pyaccsharedmemory`. Enable **Shared Memory** in Options. Telemetry only streams inside a live session (practice/qualifying/race), not the main menu.
- **Assetto Corsa** — no extra library (pure ctypes over `Local\AC_MEMORY`). Run the bridge as admin if AC runs as admin.
- **rFactor 2 / Le Mans Ultimate** — `pip install pyrfactor2sharedmemory` and install the [rF2 Shared Memory plugin](https://github.com/TheIronWolfModding/rF2SharedMemoryMapPlugin) into the sim. LMU uses the same rFactor engine plugin.
- **Automobilista 2** — no extra library (pure ctypes over `$pcars2$`). In AMS2 System settings, set **Shared Memory = "Project CARS 2"**, then restart. The bridge auto-calibrates the struct offset on first connect.

### UDP sims (F1, Forza, Gran Turismo 7)

These send telemetry over UDP, so they work on PC **and** consoles. You must
enable telemetry output in the game and point it at the bridge. **Only one app
can receive a UDP stream at a time** — if CrewChief or another dash tool holds
the port, the bridge gets nothing.

- **F1 2023 / 2024** — enable **UDP Telemetry** in game settings; default port 20777. The bridge parses the CarTelemetry and LapData packets (speed, RPM, gear, pedals, tyres, lap times).
- **Forza Motorsport / Horizon** — enable **Data Out** and set the format to **"Dash"**; default port 5300. (Windows Store builds need a loopback exemption — the Steam build does not.)
- **Gran Turismo 7** — runs on a PS5. Start the bridge with `--gt7-ps5-ip <your-PS5-IP>` so it sends a heartbeat that tells GT7 to stream. The bridge listens on port 33740 and decrypts the Salsa20-encrypted packets. Needs `pip install salsa20` (or `pycryptodome`).

The Windows `.exe` build bundles the shared-memory libraries, so iRacing, ACC,
AC, rF2/LMU and AMS2 work out of the box with no `pip install` — you still need
to enable the in-game setting. F1, Forza and GT7 use UDP (no library needed
except GT7's Salsa20).