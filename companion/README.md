# SimSetApp — Live Telemetry Bridge

A tiny local companion that reads telemetry from your sim and streams it to the
SimSetApp **Live Telemetry** dashboard in real time over a local WebSocket.

Your data stays on your machine — the browser dashboard connects directly to
this bridge on `ws://localhost:3344`. No cloud, no latency, no account needed.

## 1. Install

```bash
pip install websockets psutil
```

`psutil` powers auto-detection — without it you'll need `--sim <mock|iracing|acc>`.

For real sim data, add the sim's library (auto-detected when installed):

```bash
# iRacing
pip install irsdk

# ACC — uses shared memory; see the ACC section below
```

## 2. Run (one click — auto-detects your sim)

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
 SimSetApp Telemetry Bridge
 Mode   : auto-detect
 WebSocket : ws://localhost:3344
 Rate   : 20 Hz
```

## 3. Connect in the app

Open SimSetApp → **Live Telemetry** → tap **Connect to bridge**.
The page shows "waiting for your sim" until you start a session, then the
dashboard lights up automatically.

## Build a one-click .exe (optional)

Package the bridge into a double-clickable Windows executable so users never
touch a terminal:

```bash
pip install pyinstaller websockets psutil
# (add `pip install irsdk` first if you want iRacing bundled in)
pyinstaller telemetry_bridge.spec
```

Output: `dist/SimSetAppBridge/SimSetAppBridge.exe`. Double-click to run — it
auto-detects the sim and starts the WebSocket. Drop a shortcut to it in the
Windows Startup folder to auto-start with the PC.

> Compiling the `.exe` is a native build step that runs on your machine — it
> can't be produced from inside the web app.

## How it works

```
[sim] --shared memory / API--> [telemetry_bridge.py] --ws://localhost:3344--> [SimSetApp dashboard]
```

The bridge sends a flat JSON telemetry frame ~20×/second while a sim session is
live (speed, RPM, gear, pedals, steering, fuel, tyre temps/wear/pressures, lap
times, delta), and a `type:"status"` heartbeat once per second while waiting for
a sim. The dashboard renders it live and (optionally) auto-logs each lap to your
session history.

## Browser note

The app is served over HTTPS but connects to `ws://localhost`. Chrome, Edge and
Firefox all **allow** insecure WebSocket to `localhost` from secure pages
(localhost is treated as a trusted origin), so this works out of the box. If your
browser blocks it, run the bridge with `wss://` + a self-signed cert and accept
the cert once.

## ACC shared memory

ACC exposes telemetry via a Windows memory-mapped file. The included `ACCProvider`
is a thin stub using `acc_shared_memory`. Install a binding (e.g.
[`pyaccsharedmemory`](https://github.com/RiddleTime/ACCSharedMemory)) and adjust
the field reads in `telemetry_bridge.py` to match its API — the structure is
already wired, only the attribute names need confirming against your binding.