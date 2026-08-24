# SimSetApp — Live Telemetry Bridge

A tiny local companion that reads telemetry from your sim and streams it to the
SimSetApp **Live Telemetry** dashboard in real time over a local WebSocket.

Your data stays on your machine — the browser dashboard connects directly to
this bridge on `ws://localhost:3344`. No cloud, no latency, no account needed.

> **Why a small helper is required:** sim telemetry lives in the game's shared
> memory (PC) or telemetry files — it isn't exposed over USB or the network, and
> browsers can't read process memory directly. So a tiny local bridge is needed.
> The good news: it can be a single double-clickable `.exe` — see below.

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

`psutil` powers auto-detection — without it you'll need `--sim <mock|iracing|acc>`.

For real sim data, add the sim's library (auto-detected when installed):

```bash
# iRacing
pip install irsdk

# ACC — uses shared memory; see the ACC section below
```

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
python telemetry_bridge.py --port 3344 --hz 20
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

## ACC shared memory

ACC exposes telemetry via a Windows memory-mapped file. The bridge reads it
with [`pyaccsharedmemory`](https://github.com/rrennoir/PyAccSharedMemory):

```bash
pip install pyaccsharedmemory
```

Two things to know:

1. **Enable Shared Memory** in ACC: Options → Assetto Corsa Competizione →
   Shared Memory = ON. Without it, `read_shared_memory()` returns nothing and
   the dashboard stays on "ACC detected — start a session."
2. **Telemetry only streams inside a live session** (practice, qualifying, or
   race). On the main menu there is no data, so the bridge sends `detected:
   true, reason: "no_session"` status frames and the dashboard tells you to
   start a session — that's expected, not an error.

The Windows `.exe` build bundles `pyaccsharedmemory`, so ACC works out of the
box with no `pip install` — you still need to enable Shared Memory in ACC.