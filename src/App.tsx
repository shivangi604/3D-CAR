import { useState, useEffect, useCallback } from 'react';
import { ShowroomCanvas } from './components/ShowroomCanvas';
import { ShowroomUI } from './components/ShowroomUI';
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
} from './types/car';
import { sound } from './utils/audio';

export default function App() {
  // App Stage
  const [stage, setStage] = useState<
    'prologue_standing' | 'prologue_launching' | 'prologue_warp' | 'showroom' | 'test_drive'
  >('prologue_standing');

  // Car Customization States
  const [selectedColor, setSelectedColor] = useState<CarColor>(CAR_COLORS[0]);
  const [selectedWheel, setSelectedWheel] = useState<WheelDesign>(WHEEL_DESIGNS[0]);
  const [selectedCaliper, setSelectedCaliper] = useState<CaliperColor>(CALIPER_COLORS[2]); // Brembo red
  const [selectedInterior, setSelectedInterior] = useState<InteriorTheme>(INTERIOR_THEMES[0]);
  const [selectedPackage, setSelectedPackage] = useState<PerformancePackage>(PERFORMANCE_PACKAGES[1]); // Quantum quad-boost

  // Car Interactive Feature Toggles
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [wingDeployed, setWingDeployed] = useState(false);
  const [frunkOpen, setFrunkOpen] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [underglowOn, setUnderglowOn] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);

  // Camera & Hotspot States
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('orbit');
  const [activeHotspot, setActiveHotspot] = useState<CarHotspot | null>(null);

  // Sound Engine
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Test Drive Simulator State
  const [testDriveSpeed, setTestDriveSpeed] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isBraking, setIsBraking] = useState(false);

  // Sound toggle handler
  const handleToggleSound = useCallback(() => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
  }, [soundEnabled]);

  // Stage Transitions
  const handleStartLaunch = useCallback(() => {
    setStage('prologue_launching');
  }, []);

  const handleLaunchComplete = useCallback(() => {
    setStage('prologue_warp');
    setTimeout(() => {
      setStage('showroom');
    }, 1400);
  }, []);

  const handleSkipToShowroom = useCallback(() => {
    sound.stopRocketRumble();
    sound.playSonicBoom();
    setStage('showroom');
  }, []);

  const handleReplayLaunch = useCallback(() => {
    sound.stopEngineSound();
    setStage('prologue_standing');
    setDoorsOpen(false);
    setFrunkOpen(false);
  }, []);

  // Hotspot selection
  const handleSelectHotspot = useCallback((spot: CarHotspot | null) => {
    setActiveHotspot(spot);
    if (spot) {
      setAutoRotate(false);
    }
  }, []);

  // Test Drive Loop
  useEffect(() => {
    if (stage !== 'test_drive') {
      setTestDriveSpeed(0);
      setIsAccelerating(false);
      setIsBraking(false);
      return;
    }

    const interval = setInterval(() => {
      setTestDriveSpeed((prev) => {
        let next = prev;
        if (isAccelerating) {
          next = Math.min(248, prev + 3.2);
        } else if (isBraking) {
          next = Math.max(0, prev - 5.5);
        } else {
          // Natural coasting deceleration
          next = Math.max(0, prev - 0.8);
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [stage, isAccelerating, isBraking]);

  // Keyboard navigation for Test Drive
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === 'test_drive') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          setIsAccelerating(true);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === ' ') {
          setIsBraking(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (stage === 'test_drive') {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          setIsAccelerating(false);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === ' ') {
          setIsBraking(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [stage]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#07090e]">
      {/* 3D WebGL Canvas Viewport */}
      <ShowroomCanvas
        stage={stage}
        onLaunchComplete={handleLaunchComplete}
        doorsOpen={doorsOpen}
        wingDeployed={wingDeployed}
        frunkOpen={frunkOpen}
        headlightsOn={headlightsOn}
        underglowOn={underglowOn}
        autoRotate={autoRotate}
        selectedColor={selectedColor}
        selectedWheel={selectedWheel}
        selectedCaliper={selectedCaliper}
        selectedInterior={selectedInterior}
        cameraPreset={cameraPreset}
        activeHotspotId={activeHotspot?.id || null}
        onSelectHotspot={handleSelectHotspot}
        testDriveSpeed={testDriveSpeed}
        isAccelerating={isAccelerating}
      />

      {/* Futuristic UI HUD, Top Bar & Configurator Panels */}
      <ShowroomUI
        stage={stage}
        onStartLaunch={handleStartLaunch}
        onSkipToShowroom={handleSkipToShowroom}
        onReplayLaunch={handleReplayLaunch}
        doorsOpen={doorsOpen}
        onToggleDoors={() => setDoorsOpen((v) => !v)}
        wingDeployed={wingDeployed}
        onToggleWing={() => setWingDeployed((v) => !v)}
        frunkOpen={frunkOpen}
        onToggleFrunk={() => setFrunkOpen((v) => !v)}
        headlightsOn={headlightsOn}
        onToggleHeadlights={() => setHeadlightsOn((v) => !v)}
        underglowOn={underglowOn}
        onToggleUnderglow={() => setUnderglowOn((v) => !v)}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate((v) => !v)}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={(preset) => {
          setCameraPreset(preset);
          setActiveHotspot(null);
        }}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedWheel={selectedWheel}
        onSelectWheel={setSelectedWheel}
        selectedCaliper={selectedCaliper}
        onSelectCaliper={setSelectedCaliper}
        selectedInterior={selectedInterior}
        onSelectInterior={setSelectedInterior}
        selectedPackage={selectedPackage}
        onSelectPackage={setSelectedPackage}
        activeHotspot={activeHotspot}
        onCloseHotspot={() => setActiveHotspot(null)}
        onOpenHotspot={handleSelectHotspot}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onEnterTestDrive={() => {
          setStage('test_drive');
          setDoorsOpen(false);
          setFrunkOpen(false);
          setActiveHotspot(null);
        }}
        onExitTestDrive={() => {
          setStage('showroom');
          sound.stopEngineSound();
        }}
        testDriveSpeed={testDriveSpeed}
        isAccelerating={isAccelerating}
        onStartAccelerate={() => setIsAccelerating(true)}
        onStopAccelerate={() => setIsAccelerating(false)}
        onStartBrake={() => setIsBraking(true)}
        onStopBrake={() => setIsBraking(false)}
      />
    </main>
  );
}
