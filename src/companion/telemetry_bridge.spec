# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for the SimSetApp Telemetry Bridge.
#
# Build a one-click Windows executable (run from the src/companion/ folder):
#   pip install pyinstaller aiohttp psutil
#   pyinstaller telemetry_bridge.spec
#
# Output: dist/SimSetAppBridge/SimSetAppBridge.exe
# Double-click to run — it auto-detects your sim and starts the WebSocket.
#
# Before building, install the sim libraries so they bundle:
#   pip install pyinstaller aiohttp psutil irsdk pyaccsharedmemory pyrfactor2sharedmemory salsa20
# (F1 and Forza use UDP — no library. Assetto Corsa and AMS2 use pure ctypes — no library.)

block_cipher = None

# Bundle every sim library so the .exe supports all 8 sims out of the box.
# Libraries are optional at runtime — if one isn't installed at build time,
# collect_submodules returns [] and that sim just isn't bundled.
try:
    from PyInstaller.utils.hooks import collect_submodules
    acc_hidden = collect_submodules('pyaccsharedmemory')
    rf2_hidden = collect_submodules('sharedMemoryAPI') + collect_submodules('rF2data')
except Exception:
    acc_hidden, rf2_hidden = [], []

a = Analysis(
    ['telemetry_bridge.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['psutil', 'aiohttp', 'pyaccsharedmemory', 'irsdk',
                   'sharedMemoryAPI', 'rF2data', 'salsa20', 'Crypto.Cipher.Salsa20']
              + acc_hidden + rf2_hidden,
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_archive, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='SimSetAppBridge',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    runtime_tmpdir=None,
    console=True,  # keep the console window so users see "detected iRacing" etc.
    icon=None,
)