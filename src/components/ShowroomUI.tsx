import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CarColor,
  WheelDesign,
  CaliperColor,
  InteriorTheme,
  PerformancePackage,
  CarHotspot,
  CameraPreset,
  CAR_COLORS,
  WHEEL_DESIGNS,
  CALIPER_COLORS,
  INTERIOR_THEMES,
  PERFORMANCE_PACKAGES,
  CAR_HOTSPOTS,
} from '../types/car';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Zap,
  Gauge,
  Sliders,
  ChevronRight,
  Eye,
  Check,
  Flame,
  X,
  Compass,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ShowroomUIProps {
  stage: 'prologue_standing' | 'prologue_launching' | 'prologue_warp' | 'showroom' | 'test_drive';
  onStartLaunch: () => void;
  onSkipToShowroom: () => void;
  onReplayLaunch: () => void;
  doorsOpen: boolean;
  onToggleDoors: () => void;
  wingDeployed: boolean;
  onToggleWing: () => void;
  frunkOpen: boolean;
  onToggleFrunk: () => void;
  headlightsOn: boolean;
  onToggleHeadlights: () => void;
  underglowOn: boolean;
  onToggleUnderglow: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  selectedColor: CarColor;
  onSelectColor: (c: CarColor) => void;
  selectedWheel: WheelDesign;
  onSelectWheel: (w: WheelDesign) => void;
  selectedCaliper: CaliperColor;
  onSelectCaliper: (c: CaliperColor) => void;
  selectedInterior: InteriorTheme;
  onSelectInterior: (i: InteriorTheme) => void;
  selectedPackage: PerformancePackage;
  onSelectPackage: (p: PerformancePackage) => void;
  activeHotspot: CarHotspot | null;
  onCloseHotspot: () => void;
  onOpenHotspot: (h: CarHotspot) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onEnterTestDrive: () => void;
  onExitTestDrive: () => void;
  testDriveSpeed: number;
  isAccelerating: boolean;
  onStartAccelerate: () => void;
  onStopAccelerate: () => void;
  onStartBrake: () => void;
  onStopBrake: () => void;
}

export const ShowroomUI: React.FC<ShowroomUIProps> = ({
  stage,
  onStartLaunch,
  onSkipToShowroom,
  onReplayLaunch,
  doorsOpen,
  onToggleDoors,
  wingDeployed,
  onToggleWing,
  frunkOpen,
  onToggleFrunk,
  headlightsOn,
  onToggleHeadlights,
  underglowOn,
  onToggleUnderglow,
  autoRotate,
  onToggleAutoRotate,
  cameraPreset,
  onSelectCameraPreset,
  selectedColor,
  onSelectColor,
  selectedWheel,
  onSelectWheel,
  selectedCaliper,
  onSelectCaliper,
  selectedInterior,
  onSelectInterior,
  selectedPackage,
  onSelectPackage,
  activeHotspot,
  onCloseHotspot,
  onOpenHotspot,
  soundEnabled,
  onToggleSound,
  onEnterTestDrive,
  onExitTestDrive,
  testDriveSpeed,
  isAccelerating,
  onStartAccelerate,
  onStopAccelerate,
  onStartBrake,
  onStopBrake,
}) => {
  const [activeTab, setActiveTab] = useState<'showroom' | 'specs' | 'builder'>('showroom');
  const [builderSubTab, setBuilderSubTab] = useState<'paint' | 'wheels' | 'interior' | 'performance'>('paint');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [countdownNum, setCountdownNum] = useState<number | null>(null);

  // Price Calculation
  const baseMSRP = 245000;
  const totalMSRP =
    baseMSRP +
    selectedColor.price +
    selectedWheel.price +
    selectedInterior.price +
    selectedPackage.price;

  const currentHp = 1020 + selectedPackage.hpBonus;
  const current0To60 = (2.13 - selectedPackage.accelerationReduction).toFixed(2);

  // Trigger Launch with tactile countdown
  const handleLaunchClick = () => {
    sound.playClick();
    setCountdownNum(3);
    sound.playCountdownBeep(false);

    setTimeout(() => {
      setCountdownNum(2);
      sound.playCountdownBeep(false);
    }, 900);

    setTimeout(() => {
      setCountdownNum(1);
      sound.playCountdownBeep(false);
    }, 1800);

    setTimeout(() => {
      setCountdownNum(0);
      sound.playCountdownBeep(true);
      onStartLaunch();
      setCountdownNum(null);
    }, 2700);
  };

  const handleOrderBuild = () => {
    sound.playSonicBoom();
    setOrderConfirmed(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#06b6d4', '#e25822', '#ffffff'],
    });
    setTimeout(() => setOrderConfirmed(false), 4500);
  };

  return (
    <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between overflow-hidden">
      {/* 1. TOP BAR CONTRACT: Zone 1 (Wordmark) — Zone 2 (4 clean links) — Zone 3 (1-2 primary actions) */}
      <header className="pointer-events-auto flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 px-6 py-3.5 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-extrabold tracking-wider text-slate-100">
            AETHER <span className="text-cyan-400">HYPERION</span>
          </span>
          <span className="hidden text-xs text-slate-400 sm:inline">· Concept 2027</span>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('showroom');
              if (stage === 'test_drive') onExitTestDrive();
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'showroom' && stage !== 'test_drive' ? 'font-semibold text-cyan-400' : ''
            }`}
          >
            Showroom
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('specs');
              if (stage === 'test_drive') onExitTestDrive();
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'specs' ? 'font-semibold text-cyan-400' : ''
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('builder');
              if (stage === 'test_drive') onExitTestDrive();
            }}
            className={`transition-colors hover:text-white ${
              activeTab === 'builder' ? 'font-semibold text-cyan-400' : ''
            }`}
          >
            Build Studio
          </button>
          <button
            onClick={() => {
              sound.playClick();
              if (stage !== 'test_drive') {
                onEnterTestDrive();
              } else {
                onExitTestDrive();
              }
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              stage === 'test_drive' ? 'font-semibold text-amber-400' : ''
            }`}
          >
            <Gauge className="h-4 w-4" />
            <span>Test Drive</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {stage === 'showroom' && (
            <button
              onClick={() => {
                sound.playClick();
                onReplayLaunch();
              }}
              className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
              title="Replay Character & Rocket Launch Intro"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Launch Intro</span>
            </button>
          )}

          <button
            onClick={onToggleSound}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/80 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-cyan-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>
      </header>

      {/* 2. PROLOGUE OVERLAY: Starting Character Pointing at Rocket */}
      {stage === 'prologue_standing' && (
        <div className="pointer-events-auto mx-auto my-auto max-w-xl p-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Aerospace Test Facility · Gantry Catwalk 09</span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
            Project Aether: Orbital Hypercar Delivery
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-md mx-auto">
            Test Commander Vex signals the launch sequence on the gantry platform, pointing toward the orbital rocket booster. Ignite propulsion to trigger the supersonic hypercar delivery.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleLaunchClick}
              disabled={countdownNum !== null}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-6 py-3 font-display text-sm font-bold tracking-wider text-white shadow-lg shadow-cyan-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-75"
            >
              <Flame className="h-4 w-4 text-amber-300 animate-bounce" />
              <span>
                {countdownNum !== null ? `T-MINUS 0${countdownNum}...` : 'IGNITE LAUNCH SEQUENCE'}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSkipToShowroom();
              }}
              className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/80 px-5 py-3 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
            >
              <span>Skip to 3D Showroom</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. PROLOGUE LAUNCHING OVERLAY: Rocket ascending */}
      {stage === 'prologue_launching' && (
        <div className="pointer-events-auto mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/60 px-4 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-md animate-pulse">
            <Flame className="h-4 w-4 text-amber-400" />
            <span>ROCKET PROPULSION ACTIVE · STRATOSPHERIC ASCENT</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Tracking telemetry... Supersonic shockwave imminent</p>
        </div>
      )}

      {/* 4. PROLOGUE WARP BOOM OVERLAY */}
      {stage === 'prologue_warp' && (
        <div className="pointer-events-none mx-auto my-auto text-center animate-pulse">
          <h2 className="font-display text-4xl font-black text-cyan-300 tracking-widest drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
            HYPER-ENTRY ENGAGED
          </h2>
          <p className="mt-1 text-sm text-slate-200">Materializing Aether Hyperion into Showroom...</p>
        </div>
      )}

      {/* 5. TEST DRIVE HUD MODE */}
      {stage === 'test_drive' && (
        <div className="pointer-events-auto flex flex-col justify-between p-6">
          {/* Top Test Drive Telemetry */}
          <div className="flex items-center justify-between">
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 backdrop-blur-md">
              <div className="text-xs text-slate-400">PROPULSION TELEMETRY</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono-data text-4xl font-bold text-cyan-400">{Math.round(testDriveSpeed)}</span>
                <span className="text-xs font-medium text-slate-400">MPH</span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                <span>Power: <strong className="text-slate-200">{Math.round((testDriveSpeed / 248) * currentHp)} HP</strong></span>
                <span>G-Force: <strong className="text-slate-200">{(1 + (isAccelerating ? 0.8 : 0)).toFixed(1)} G</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onExitTestDrive();
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Exit Test Drive</span>
            </button>
          </div>

          {/* Bottom Accelerator & Brake Pedals */}
          <div className="mx-auto flex items-center gap-4">
            <button
              onMouseDown={onStartBrake}
              onMouseUp={onStopBrake}
              onTouchStart={onStartBrake}
              onTouchEnd={onStopBrake}
              className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/50 bg-rose-950/40 px-6 py-4 text-rose-300 shadow-lg shadow-rose-950/30 transition-all hover:bg-rose-900/50 active:scale-95"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Brake</span>
              <span className="text-[10px] text-rose-400/80">(Hold or Spacebar)</span>
            </button>

            <button
              onMouseDown={onStartAccelerate}
              onMouseUp={onStopAccelerate}
              onTouchStart={onStartAccelerate}
              onTouchEnd={onStopAccelerate}
              className={`flex flex-col items-center justify-center rounded-2xl border px-8 py-5 text-white shadow-xl transition-all active:scale-95 ${
                isAccelerating
                  ? 'border-cyan-400 bg-cyan-600 shadow-cyan-500/40'
                  : 'border-cyan-500/50 bg-cyan-950/60 shadow-cyan-950/50 hover:bg-cyan-900/50'
              }`}
            >
              <span className="font-display text-sm font-bold uppercase tracking-wider">Throttle</span>
              <span className="text-[10px] text-cyan-300">(Hold or Up Arrow)</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. SHOWROOM MODE OVERLAYS */}
      {stage === 'showroom' && (
        <>
          {/* Top-Right Quick Hotspot Explorer Kicker */}
          <div className="pointer-events-auto absolute top-16 right-6 hidden lg:flex flex-col gap-1 rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 backdrop-blur-md w-64">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-cyan-400" />
                <span>3D Feature Hotspots</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono-data">{CAR_HOTSPOTS.length} NODES</span>
            </div>
            <div className="flex flex-col gap-1 mt-1 max-h-48 overflow-y-auto pr-1">
              {CAR_HOTSPOTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    sound.playClick();
                    onOpenHotspot(h);
                  }}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    activeHotspot?.id === h.id
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">{h.title}</span>
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE HOTSPOT DETAIL MODAL */}
          {activeHotspot && (
            <div className="pointer-events-auto absolute bottom-28 left-6 right-6 sm:left-auto sm:right-6 sm:bottom-28 z-30 max-w-md rounded-2xl border border-cyan-500/40 bg-slate-950/90 p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-cyan-400">
                    {activeHotspot.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-0.5">
                    {activeHotspot.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    onCloseHotspot();
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {activeHotspot.details}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3">
                {activeHotspot.metrics.map((m) => (
                  <div key={m.label} className="rounded-lg bg-slate-900/60 p-2">
                    <div className="text-[10px] text-slate-400">{m.label}</div>
                    <div className="font-mono-data text-xs font-semibold text-slate-100">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPECIFICATIONS TAB OVERLAY */}
          {activeTab === 'specs' && (
            <div className="pointer-events-auto absolute inset-x-6 top-16 bottom-24 z-20 mx-auto max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-medium text-cyan-400">TECHNICAL ARCHITECTURE</div>
                  <h2 className="font-display text-2xl font-bold text-white">Engineering Specifications</h2>
                </div>
                <button
                  onClick={() => setActiveTab('showroom')}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="text-xs text-slate-400">Total System Power</div>
                  <div className="font-mono-data text-2xl font-bold text-white mt-1">{currentHp} HP</div>
                  <div className="text-[11px] text-slate-400 mt-1">Quad Axial-Flux 800V Motors</div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="text-xs text-slate-400">0 - 60 MPH Acceleration</div>
                  <div className="font-mono-data text-2xl font-bold text-cyan-400 mt-1">{current0To60} sec</div>
                  <div className="text-[11px] text-slate-400 mt-1">Sub-second torque response</div>
                </div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4">
                  <div className="text-xs text-slate-400">Top Velocity</div>
                  <div className="font-mono-data text-2xl font-bold text-white mt-1">248 MPH</div>
                  <div className="text-[11px] text-slate-400 mt-1">Active Aero drag reduction</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Modules</h4>
                {CAR_HOTSPOTS.map((h) => (
                  <div
                    key={h.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="text-[11px] font-semibold text-cyan-400">{h.category}</div>
                      <div className="font-semibold text-slate-100">{h.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{h.details}</div>
                    </div>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('showroom');
                        onOpenHotspot(h);
                      }}
                      className="shrink-0 flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/60"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View in 3D</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BUILD STUDIO / CONFIGURATOR DRAWER */}
          {activeTab === 'builder' && (
            <div className="pointer-events-auto absolute inset-x-4 top-16 bottom-24 z-20 mx-auto max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-medium text-cyan-400">BESPOKE CUSTOMIZATION</div>
                  <h2 className="font-display text-2xl font-bold text-white">Build Your Car</h2>
                </div>
                <button
                  onClick={() => setActiveTab('showroom')}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Builder Sub-navigation tabs */}
              <div className="mt-4 flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                <button
                  onClick={() => {
                    sound.playClick();
                    setBuilderSubTab('paint');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    builderSubTab === 'paint' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exterior Paint ({CAR_COLORS.length})
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setBuilderSubTab('wheels');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    builderSubTab === 'wheels' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Wheels & Calipers
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setBuilderSubTab('interior');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    builderSubTab === 'interior' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Interior & Luminescence
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setBuilderSubTab('performance');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    builderSubTab === 'performance' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Performance Packages
                </button>
              </div>

              {/* Sub-tab 1: Paint */}
              {builderSubTab === 'paint' && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CAR_COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        sound.playChop();
                        onSelectColor(c);
                      }}
                      className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                        selectedColor.id === c.id
                          ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="h-5 w-5 rounded-full border border-white/30 shadow-md"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-sm font-semibold text-slate-100">{c.name}</span>
                        </div>
                        {selectedColor.id === c.id && <Check className="h-4 w-4 text-cyan-400" />}
                      </div>
                      <p className="mt-2 text-xs text-slate-400 leading-normal">{c.description}</p>
                      <div className="mt-2 text-xs font-mono-data font-medium text-cyan-300">
                        {c.price === 0 ? 'Included' : `+$${c.price.toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-tab 2: Wheels & Calipers */}
              {builderSubTab === 'wheels' && (
                <div className="mt-5 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Forged Wheel Designs</h4>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {WHEEL_DESIGNS.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => {
                            sound.playChop();
                            onSelectWheel(w);
                          }}
                          className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                            selectedWheel.id === w.id
                              ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-100">{w.name}</span>
                            {selectedWheel.id === w.id && <Check className="h-4 w-4 text-cyan-400" />}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">{w.description}</p>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-mono-data">-{w.weightSavingsKg}kg Mass</span>
                            <span className="font-mono-data text-cyan-300 font-medium">
                              {w.price === 0 ? 'Standard' : `+$${w.price.toLocaleString()}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Brembo Brake Caliper Finish</h4>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {CALIPER_COLORS.map((cal) => (
                        <button
                          key={cal.id}
                          onClick={() => {
                            sound.playClick();
                            onSelectCaliper(cal);
                          }}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                            selectedCaliper.id === cal.id
                              ? 'border-cyan-400 bg-cyan-950/40 text-white'
                              : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: cal.hex }}
                          />
                          <span>{cal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Interior */}
              {builderSubTab === 'interior' && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {INTERIOR_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        sound.playChop();
                        onSelectInterior(theme);
                      }}
                      className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                        selectedInterior.id === theme.id
                          ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: theme.ambientGlowHex }}
                          />
                          <span className="font-semibold text-slate-100">{theme.name}</span>
                        </div>
                        {selectedInterior.id === theme.id && <Check className="h-4 w-4 text-cyan-400" />}
                      </div>
                      <div className="mt-2 text-xs font-medium text-slate-300">{theme.materialName}</div>
                      <p className="mt-1 text-xs text-slate-400">{theme.description}</p>
                      <div className="mt-2 text-xs font-mono-data font-medium text-cyan-300">
                        {theme.price === 0 ? 'Included' : `+$${theme.price.toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Sub-tab 4: Performance Packages */}
              {builderSubTab === 'performance' && (
                <div className="mt-5 space-y-3">
                  {PERFORMANCE_PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => {
                        sound.playChop();
                        onSelectPackage(pkg);
                      }}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full rounded-xl border p-4 text-left transition-all ${
                        selectedPackage.id === pkg.id
                          ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-100">{pkg.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{pkg.description}</div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {pkg.hpBonus > 0 && (
                          <span className="text-xs font-mono-data text-amber-400 font-semibold">
                            +{pkg.hpBonus} HP
                          </span>
                        )}
                        <span className="text-xs font-mono-data font-medium text-cyan-300">
                          {pkg.price === 0 ? 'Standard' : `+$${pkg.price.toLocaleString()}`}
                        </span>
                        {selectedPackage.id === pkg.id && <Check className="h-4 w-4 text-cyan-400" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Build Summary Footer inside modal */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-5">
                <div>
                  <div className="text-xs text-slate-400">Total Configured MSRP</div>
                  <div className="font-mono-data text-2xl font-bold text-white">
                    ${totalMSRP.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('showroom');
                    }}
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-900"
                  >
                    Back to 3D View
                  </button>

                  <button
                    onClick={handleOrderBuild}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Save & Reserve Build</span>
                  </button>
                </div>
              </div>

              {orderConfirmed && (
                <div className="mt-4 rounded-xl border border-emerald-500/50 bg-emerald-950/50 p-3 text-center text-xs font-medium text-emerald-300 animate-in fade-in">
                  ✓ Specification saved to reservation docket. Production slot allocated for 2027 delivery!
                </div>
              )}
            </div>
          )}

          {/* 7. BOTTOM SHOWROOM CONTROL DOCK */}
          <div className="pointer-events-auto mx-auto mb-4 w-full max-w-4xl px-4">
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/85 p-2.5 shadow-2xl backdrop-blur-xl">
              {/* Row 1: Interactive Car Features (Doors, Wing, Headlights, Underglow, Frunk, Auto-Rotate) */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 sm:pb-0">
                {/* 360 Rotate Toggle */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onToggleAutoRotate();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    autoRotate
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle continuous 360° rotation"
                >
                  <RotateCcw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  <span>360° Rotate</span>
                </button>

                {/* Dihedral Doors */}
                <button
                  onClick={() => {
                    sound.playDoorServo(!doorsOpen);
                    onToggleDoors();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    doorsOpen
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Doors {doorsOpen ? 'Open' : 'Closed'}</span>
                </button>

                {/* Headlights Toggle */}
                <button
                  onClick={() => {
                    sound.playPhotonHeadlights(!headlightsOn);
                    onToggleHeadlights();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    headlightsOn
                      ? 'border-amber-400 bg-amber-950/50 text-amber-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Headlights {headlightsOn ? 'On' : 'Off'}</span>
                </button>

                {/* Active Aero Wing */}
                <button
                  onClick={() => {
                    sound.playDoorServo(!wingDeployed);
                    onToggleWing();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    wingDeployed
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Rear Wing {wingDeployed ? 'Deployed' : 'Stowed'}</span>
                </button>

                {/* Front Frunk */}
                <button
                  onClick={() => {
                    sound.playDoorServo(!frunkOpen);
                    onToggleFrunk();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    frunkOpen
                      ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Frunk {frunkOpen ? 'Open' : 'Closed'}</span>
                </button>

                {/* Underglow Neon */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onToggleUnderglow();
                  }}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                    underglowOn
                      ? 'border-emerald-400 bg-emerald-950/50 text-emerald-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Underglow</span>
                </button>
              </div>

              {/* Row 2: Camera View Presets */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-1.5 text-xs text-slate-400">
                <span className="hidden sm:inline text-[11px] font-medium text-slate-500">Camera:</span>
                <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                  {(
                    [
                      { id: 'orbit', label: 'Orbit 360°' },
                      { id: 'front', label: 'Front' },
                      { id: 'side', label: 'Side Profile' },
                      { id: 'rear', label: 'Rear Aero' },
                      { id: 'interior', label: 'Cockpit' },
                      { id: 'wheel', label: 'Wheel' },
                      { id: 'top', label: 'Top Aero' },
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        sound.playClick();
                        onSelectCameraPreset(preset.id);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                        cameraPreset === preset.id
                          ? 'bg-slate-800 text-cyan-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
