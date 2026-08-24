# SimSetApp — Live Telemetry Bridge

A tiny local companion that reads telemetry from your sim and streams it to the
SimSetApp **Live Telemetry** dashboard in real time over a local WebSocket.

Your data stays on your machine — the browser dashboard connects directly to
this bridge on `ws://localhost:3344`. No cloud, no latency, no account needed.

## 1. Install

```bash
pip install websockets
```

For real sim data, add the sim's library:

```bash
# iRacing
pip install irsdk

# ACC — uses shared memory; see the ACC section below
```

## 2. Run

```bash
# Mock data (test the dashboard instantly, no sim required)
python telemetry_bridge.py

# iRacing (launch iRacing + a session first)
python telemetry_bridge.py --sim iracing

# ACC
python telemetry_bridge.py --sim acc

# Options
python telemetry_bridge.py --port 3344 --hz 20
```

You should see:

```
 SimSetApp Telemetry Bridge
 Source : Mock Sim
 WebSocket : ws://localhost:3344
```

## 3. Connect in the app

Open SimSetApp → **Live Telemetry** (Tools menu) → tap **Connect**.
The dashboard lights up immediately.

## How it works

```
[sim] --telemetry--> [telemetry_bridge.py] --ws://localhost:3344--> [SimSetApp dashboard]
```

The bridge sends a flat JSON frame ~20×/second with speed, RPM, gear, pedals,
steering, fuel, tyre temps/wear/pressures, lap times, and delta. The dashboard
renders it live and (optionally) auto-logs each lap to your session history.

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