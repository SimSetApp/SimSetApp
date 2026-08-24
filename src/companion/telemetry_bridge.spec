# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec for the SimSetApp Telemetry Bridge.
#
# Build a one-click Windows executable (run from the src/companion/ folder):
#   pip install pyinstaller websockets psutil
#   pyinstaller telemetry_bridge.spec
#
# Output: dist/SimSetAppBridge/SimSetAppBridge.exe
# Double-click to run — it auto-detects your sim and starts the WebSocket.
#
# If you use iRacing, also `pip install irsdk` before building so it bundles.

block_cipher = None

a = Analysis(
    ['telemetry_bridge.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['psutil', 'websockets'],  # add 'irsdk' here if you build with iRacing support
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