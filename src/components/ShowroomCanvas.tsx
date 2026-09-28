import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createRocketScene, RocketSceneObjects } from './RocketScene';
import { createCarModel, CarModelObjects } from './CarModel';
import {
  CarColor,
  WheelDesign,
  CaliperColor,
  InteriorTheme,
  CameraPreset,
  CarHotspot,
  CAR_HOTSPOTS,
} from '../types/car';
import { sound } from '../utils/audio';

interface ShowroomCanvasProps {
  stage: 'prologue_standing' | 'prologue_launching' | 'prologue_warp' | 'showroom' | 'test_drive';
  onLaunchComplete: () => void;
  doorsOpen: boolean;
  wingDeployed: boolean;
  frunkOpen: boolean;
  headlightsOn: boolean;
  underglowOn: boolean;
  autoRotate: boolean;
  selectedColor: CarColor;
  selectedWheel: WheelDesign;
  selectedCaliper: CaliperColor;
  selectedInterior: InteriorTheme;
  cameraPreset: CameraPreset;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: CarHotspot | null) => void;
  testDriveSpeed: number; // 0 to 248 mph
  isAccelerating: boolean;
  isBraking: boolean;
}

export const ShowroomCanvas: React.FC<ShowroomCanvasProps> = ({
  stage,
  onLaunchComplete,
  doorsOpen,
  wingDeployed,
  frunkOpen,
  headlightsOn,
  underglowOn,
  autoRotate,
  selectedColor,
  selectedWheel,
  selectedCaliper,
  selectedInterior,
  cameraPreset,
  activeHotspotId,
  onSelectHotspot,
  testDriveSpeed,
  isAccelerating,
  isBraking,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rocketSceneRef = useRef<RocketSceneObjects | null>(null);
  const carModelRef = useRef<CarModelObjects | null>(null);
  const turntableRef = useRef<THREE.Group | null>(null);
  const tunnelGridRef = useRef<THREE.Group | null>(null);
  const shockwaveRef = useRef<THREE.Mesh | null>(null);

  // Hotspot 3D spheres
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; hotspot: CarHotspot }[]>([]);

  // State refs for animation loop
  const stageRef = useRef(stage);
  const testDriveSpeedRef = useRef(testDriveSpeed);
  const isAcceleratingRef = useRef(isAccelerating);
  const isBrakingRef = useRef(isBraking);
  const doorsOpenRef = useRef(doorsOpen);
  const wingDeployedRef = useRef(wingDeployed);
  const frunkOpenRef = useRef(frunkOpen);
  const headlightsOnRef = useRef(headlightsOn);
  const underglowOnRef = useRef(underglowOn);
  const autoRotateRef = useRef(autoRotate);
  const activeHotspotIdRef = useRef(activeHotspotId);

  // Sync state refs on each render
  useEffect(() => {
    stageRef.current = stage;
    testDriveSpeedRef.current = testDriveSpeed;
    isAcceleratingRef.current = isAccelerating;
    isBrakingRef.current = isBraking;
    doorsOpenRef.current = doorsOpen;
    wingDeployedRef.current = wingDeployed;
    frunkOpenRef.current = frunkOpen;
    headlightsOnRef.current = headlightsOn;
    underglowOnRef.current = underglowOn;
    autoRotateRef.current = autoRotate;
    activeHotspotIdRef.current = activeHotspotId;
  }, [
    stage,
    testDriveSpeed,
    isAccelerating,
    isBraking,
    doorsOpen,
    wingDeployed,
    frunkOpen,
    headlightsOn,
    underglowOn,
    autoRotate,
    activeHotspotId,
  ]);

  // Camera Orbit & Lerp State
  const cameraStateRef = useRef({
    targetPos: new THREE.Vector3(4.2, 2.0, 5.0),
    currentPos: new THREE.Vector3(4.2, 2.0, 5.0),
    targetLookAt: new THREE.Vector3(0, 0.6, 0),
    currentLookAt: new THREE.Vector3(0, 0.6, 0),
    azimuth: 0.8,
    elevation: 0.35,
    distance: 6.2,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    shakeIntensity: 0,
  });

  // Launch state
  const launchProgressRef = useRef(0);
  const launchStartTimeRef = useRef(0);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // WebGL Context Safety Handlers
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL context lost');
    };
    const handleContextRestored = () => {
      console.info('WebGL context restored');
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06090e);
    scene.fog = new THREE.FogExp2(0x06090e, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 300);
    camera.position.set(4.2, 2.0, 5.0);
    cameraRef.current = camera;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 40;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // Rim / Backlight
    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.8);
    rimLight.position.set(0, 8, -10);
    scene.add(rimLight);

    // Showroom Circular Turntable Platform
    const turntableGroup = new THREE.Group();
    const diskGeo = new THREE.CylinderGeometry(4.8, 5.1, 0.22, 64);
    const diskMat = new THREE.MeshStandardMaterial({
      color: 0x090d14,
      roughness: 0.12,
      metalness: 0.95,
    });
    const disk = new THREE.Mesh(diskGeo, diskMat);
    disk.position.y = -0.11;
    disk.receiveShadow = true;
    turntableGroup.add(disk);

    // Floor Glowing Concentric Rings
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.002;
    turntableGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.6, 4.64, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      side: THREE.DoubleSide,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.002;
    turntableGroup.add(ring2);

    // Overhead Halo Light Structure
    const haloGeo = new THREE.TorusGeometry(4.2, 0.08, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe });
    const overheadHalo = new THREE.Mesh(haloGeo, haloMat);
    overheadHalo.rotation.x = Math.PI / 2;
    overheadHalo.position.set(0, 5.5, 0);
    turntableGroup.add(overheadHalo);

    const haloDownLight = new THREE.PointLight(0xe0f2fe, 1.8, 15);
    haloDownLight.position.set(0, 5.4, 0);
    turntableGroup.add(haloDownLight);

    scene.add(turntableGroup);
    turntableRef.current = turntableGroup;

    // Test Drive Infinite High-Speed Tunnel Grid
    const tunnelGroup = new THREE.Group();
    tunnelGroup.visible = false;
    const tunnelRoadGeo = new THREE.PlaneGeometry(12, 160, 20, 40);
    const tunnelRoadMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false,
    });
    const tunnelRoad = new THREE.Mesh(tunnelRoadGeo, tunnelRoadMat);
    tunnelRoad.rotation.x = -Math.PI / 2;
    tunnelRoad.position.set(0, -0.01, -30);
    tunnelGroup.add(tunnelRoad);

    // Glowing Speed Grid Lines
    const gridLinesCount = 30;
    for (let i = 0; i < gridLinesCount; i++) {
      const lineGeo = new THREE.BoxGeometry(0.08, 0.02, 3.5);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
      const lineLeft = new THREE.Mesh(lineGeo, lineMat);
      lineLeft.position.set(-3.2, 0.01, -80 + i * 5);
      tunnelGroup.add(lineLeft);

      const lineRight = new THREE.Mesh(lineGeo, lineMat);
      lineRight.position.set(3.2, 0.01, -80 + i * 5);
      tunnelGroup.add(lineRight);
    }

    scene.add(tunnelGroup);
    tunnelGridRef.current = tunnelGroup;

    // Supersonic Shockwave Ring (for rocket boom warp)
    const shockwaveGeo = new THREE.RingGeometry(0.1, 1.2, 48);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwave.rotation.x = -Math.PI / 2;
    shockwave.position.set(0, 18, 0);
    scene.add(shockwave);
    shockwaveRef.current = shockwave;

    // Create Rocket Scene
    const rocketObjects = createRocketScene();
    scene.add(rocketObjects.group);
    rocketSceneRef.current = rocketObjects;

    // Create Car Model
    const carObjects = createCarModel();
    scene.add(carObjects.group);
    carModelRef.current = carObjects;

    // Hotspot 3D marker pins
    const hotspotMarkers: { mesh: THREE.Mesh; hotspot: CarHotspot }[] = [];
    CAR_HOTSPOTS.forEach((spot) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...spot.position);

      const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const pinSphere = new THREE.Mesh(sphereGeo, sphereMat);
      pinGroup.add(pinSphere);

      const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const pinRing = new THREE.Mesh(ringGeo, ringMat);
      pinRing.rotation.x = Math.PI / 2;
      pinGroup.add(pinRing);

      pinSphere.userData = { hotspot: spot };
      carObjects.group.add(pinGroup);
      hotspotMarkers.push({ mesh: pinSphere, hotspot: spot });
    });
    hotspotMeshesRef.current = hotspotMarkers;

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Single Unified Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const camState = cameraStateRef.current;
      const cameraObj = cameraRef.current;
      const currentStage = stageRef.current;
      const currentSpeed = testDriveSpeedRef.current;
      const accelerating = isAcceleratingRef.current;
      const braking = isBrakingRef.current;

      // Handle Launch Screen Shake
      if (camState.shakeIntensity > 0.001) {
        camState.shakeIntensity *= 0.94;
      }

      // Smooth camera interpolation (Lerp)
      if (cameraObj) {
        cameraObj.position.lerp(camState.targetPos, Math.min(1, delta * 4.5));
        camState.currentLookAt.lerp(camState.targetLookAt, Math.min(1, delta * 4.5));

        // Add shake if active
        if (camState.shakeIntensity > 0.01) {
          const shakeX = (Math.random() - 0.5) * camState.shakeIntensity;
          const shakeY = (Math.random() - 0.5) * camState.shakeIntensity;
          cameraObj.position.x += shakeX;
          cameraObj.position.y += shakeY;
        }

        cameraObj.lookAt(camState.currentLookAt);
      }

      // Hotspot pulse
      hotspotMeshesRef.current.forEach(({ mesh }, idx) => {
        const pulse = 1 + Math.sin(elapsed * 4 + idx) * 0.2;
        mesh.scale.set(pulse, pulse, pulse);
      });

      // Auto-rotate in showroom if enabled and not dragging or inspecting hotspot
      if (currentStage === 'showroom' && autoRotateRef.current && !camState.isDragging && !activeHotspotIdRef.current) {
        camState.azimuth += delta * 0.35;
        const x = Math.sin(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
        const z = Math.cos(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
        const y = Math.sin(camState.elevation) * camState.distance + 0.6;
        camState.targetPos.set(x, y, z);
      }

      // TEST DRIVE MOVEMENT & DYNAMICS
      let spinSpeed = 0;
      if (currentStage === 'test_drive') {
        // IMPORTANT: Only advance road and spin wheels when speed > 0.05 MPH!
        // When speed is zero (or on applying brake at zero), car and road are completely stationary!
        if (currentSpeed > 0.05) {
          spinSpeed = (currentSpeed / 60) * Math.PI * 8;

          if (tunnelGridRef.current && tunnelGridRef.current.visible) {
            const lines = tunnelGridRef.current.children;
            const moveDelta = delta * (currentSpeed * 0.45);
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i];
              line.position.z += moveDelta;
              if (line.position.z > 15) {
                line.position.z = -75;
              }
            }
          }
        }

        // Sound engine update
        sound.updateEngineSound(currentSpeed / 248, accelerating);
      }

      // Update Car Model animations
      if (carModelRef.current) {
        const isDriving = currentStage === 'test_drive';
        carModelRef.current.updateAnimations(
          doorsOpenRef.current,
          wingDeployedRef.current || (isDriving && (currentSpeed > 80 || braking)),
          frunkOpenRef.current,
          headlightsOnRef.current,
          underglowOnRef.current,
          spinSpeed,
          delta,
          braking
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      renderer.dispose();
    };
  }, []);

  // Update Config when color, wheel, caliper, interior changes
  useEffect(() => {
    if (carModelRef.current) {
      carModelRef.current.updateConfig(
        selectedColor,
        selectedWheel,
        selectedCaliper,
        selectedInterior
      );
    }
  }, [selectedColor, selectedWheel, selectedCaliper, selectedInterior]);

  // Handle stage state changes & launch choreography
  useEffect(() => {
    const rocket = rocketSceneRef.current;
    const car = carModelRef.current;
    const turntable = turntableRef.current;
    const tunnel = tunnelGridRef.current;
    const camState = cameraStateRef.current;

    if (!rocket || !car || !turntable || !tunnel) return;

    if (stage === 'prologue_standing') {
      rocket.group.visible = true;
      car.group.visible = false;
      turntable.visible = false;
      tunnel.visible = false;
      launchProgressRef.current = 0;
      rocket.updateLaunch(0, 0);

      // Camera positioned looking dramatically at the character and the towering rocket
      camState.targetPos.set(-4.8, 16.5, 3.2);
      camState.targetLookAt.set(-1.0, 16.8, -1.0);
    } else if (stage === 'prologue_launching') {
      rocket.group.visible = true;
      car.group.visible = false;
      turntable.visible = false;
      tunnel.visible = false;

      sound.startRocketRumble();
      launchStartTimeRef.current = performance.now();

      // Launch interval runner
      const duration = 4800; // ms
      let launchTimer: number;

      const launchStep = () => {
        const elapsedMs = performance.now() - launchStartTimeRef.current;
        const p = Math.min(1, elapsedMs / duration);
        launchProgressRef.current = p;
        rocket.updateLaunch(p, elapsedMs * 0.001);

        // Shake camera as launch progresses
        camState.shakeIntensity = Math.sin(p * Math.PI) * 0.28;

        // Camera tilts upward tracking the ascending rocket
        camState.targetPos.set(-6.5, 14 + p * 35, 12);
        camState.targetLookAt.set(0, rocket.rocket.position.y + 4, 0);

        // Supersonic Shockwave Ring expansion near apogee
        if (p > 0.65 && shockwaveRef.current) {
          const ringP = (p - 0.65) / 0.35;
          shockwaveRef.current.position.y = rocket.rocket.position.y;
          shockwaveRef.current.scale.set(ringP * 35, ringP * 35, 1);
          (shockwaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - ringP);
        }

        if (p < 1) {
          launchTimer = requestAnimationFrame(launchStep);
        } else {
          sound.stopRocketRumble();
          sound.playSonicBoom();
          onLaunchComplete();
        }
      };

      launchTimer = requestAnimationFrame(launchStep);

      return () => {
        cancelAnimationFrame(launchTimer);
        sound.stopRocketRumble();
      };
    } else if (stage === 'prologue_warp') {
      // Warp Boom transition: Smoke clears, hypercar drops gracefully into view!
      sound.stopRocketRumble();
      rocket.group.visible = false;
      car.group.visible = true;
      turntable.visible = true;
      tunnel.visible = false;

      // Car drops smoothly from sky into the turntable with a light pulse
      car.group.position.y = 4.0;
      let dropTimer: number;
      const dropStart = performance.now();

      const dropStep = () => {
        const elapsed = (performance.now() - dropStart) / 1000;
        if (elapsed < 1.2) {
          car.group.position.y = Math.max(0, 4.0 * Math.pow(1 - elapsed / 1.2, 2));
          dropTimer = requestAnimationFrame(dropStep);
        } else {
          car.group.position.y = 0;
        }
      };
      dropTimer = requestAnimationFrame(dropStep);

      // Camera swoops in around the car
      camState.targetPos.set(4.6, 2.2, 5.2);
      camState.targetLookAt.set(0, 0.6, 0);

      return () => cancelAnimationFrame(dropTimer);
    } else if (stage === 'showroom') {
      rocket.group.visible = false;
      car.group.visible = true;
      car.group.position.set(0, 0, 0);
      turntable.visible = true;
      tunnel.visible = false;
      sound.stopEngineSound();
    } else if (stage === 'test_drive') {
      rocket.group.visible = false;
      car.group.visible = true;
      car.group.position.set(0, 0, 0);
      turntable.visible = false;
      tunnel.visible = true;

      // Dynamic Chase Cam behind and slightly above the car
      camState.targetPos.set(0, 1.45, 5.4);
      camState.targetLookAt.set(0, 0.65, -3.0);
    }
  }, [stage, onLaunchComplete]);

  // Handle Preset Camera Views
  useEffect(() => {
    if (stage !== 'showroom') return;
    const camState = cameraStateRef.current;

    switch (cameraPreset) {
      case 'front':
        camState.targetPos.set(0, 1.2, -5.5);
        camState.targetLookAt.set(0, 0.5, 0);
        break;
      case 'side':
        camState.targetPos.set(-5.8, 1.2, 0);
        camState.targetLookAt.set(0, 0.5, 0);
        break;
      case 'rear':
        camState.targetPos.set(0, 1.6, 5.8);
        camState.targetLookAt.set(0, 0.65, 0);
        break;
      case 'interior':
        camState.targetPos.set(-0.35, 0.95, -0.15);
        camState.targetLookAt.set(-0.38, 0.72, -0.6);
        break;
      case 'top':
        camState.targetPos.set(0, 7.8, 0.1);
        camState.targetLookAt.set(0, 0, 0);
        break;
      case 'wheel':
        camState.targetPos.set(-2.2, 0.55, -1.35);
        camState.targetLookAt.set(-0.95, 0.36, -1.35);
        break;
      case 'orbit':
      default:
        camState.targetPos.set(4.6, 2.0, 5.2);
        camState.targetLookAt.set(0, 0.6, 0);
        break;
    }
  }, [cameraPreset, stage]);

  // Handle Active Hotspot camera target
  useEffect(() => {
    if (activeHotspotId && stage === 'showroom') {
      const spot = CAR_HOTSPOTS.find((h) => h.id === activeHotspotId);
      if (spot) {
        const camState = cameraStateRef.current;
        camState.targetPos.set(...spot.cameraPos);
        camState.targetLookAt.set(...spot.cameraTarget);
      }
    }
  }, [activeHotspotId, stage]);

  // Pointer Interaction Handlers for 360° Drag & Click on Hotspots
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const camState = cameraStateRef.current;
    camState.isDragging = true;
    camState.prevPointerX = e.clientX;
    camState.prevPointerY = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const camState = cameraStateRef.current;
    if (!camState.isDragging) return;

    const dx = e.clientX - camState.prevPointerX;
    const dy = e.clientY - camState.prevPointerY;
    camState.prevPointerX = e.clientX;
    camState.prevPointerY = e.clientY;

    if (stage === 'showroom') {
      camState.azimuth -= dx * 0.007;
      camState.elevation = Math.max(0.08, Math.min(1.2, camState.elevation + dy * 0.006));

      const x = Math.sin(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
      const z = Math.cos(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
      const y = Math.sin(camState.elevation) * camState.distance + 0.6;
      camState.targetPos.set(x, y, z);
    }
  };

  const handlePointerUp = () => {
    cameraStateRef.current.isDragging = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (stage !== 'showroom') return;
    const camState = cameraStateRef.current;
    camState.distance = Math.max(3.2, Math.min(10.5, camState.distance + e.deltaY * 0.004));

    const x = Math.sin(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
    const z = Math.cos(camState.azimuth) * camState.distance * Math.cos(camState.elevation);
    const y = Math.sin(camState.elevation) * camState.distance + 0.6;
    camState.targetPos.set(x, y, z);
  };

  // Click on 3D Raycasted Hotspots
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (stage !== 'showroom' || !cameraRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const meshes = hotspotMeshesRef.current.map((h) => h.mesh);
    const intersects = raycaster.intersectObjects(meshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const targetHotspot = hit.userData?.hotspot as CarHotspot;
      if (targetHotspot) {
        sound.playClick();
        onSelectHotspot(targetHotspot);
      }
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />
    </div>
  );
};
