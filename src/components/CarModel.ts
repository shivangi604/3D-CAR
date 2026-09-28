import * as THREE from 'three';
import { CarColor, WheelDesign, CaliperColor, InteriorTheme } from '../types/car';

export interface CarModelObjects {
  group: THREE.Group;
  carBodyMesh: THREE.Mesh;
  bodyMaterial: THREE.MeshPhysicalMaterial;
  leftDoorPivot: THREE.Group;
  rightDoorPivot: THREE.Group;
  rearWingPivot: THREE.Group;
  frunkPivot: THREE.Group;
  wheelAssemblies: {
    frontLeft: THREE.Group;
    frontRight: THREE.Group;
    rearLeft: THREE.Group;
    rearRight: THREE.Group;
    wheelMeshes: THREE.Mesh[];
    caliperMeshes: THREE.Mesh[];
  };
  headlights: {
    leftSpot: THREE.SpotLight;
    rightSpot: THREE.SpotLight;
    leftLens: THREE.Mesh;
    rightLens: THREE.Mesh;
    drlStrip: THREE.Mesh;
    taillightStrip: THREE.Mesh;
    underglowLight: THREE.PointLight;
    underglowMesh: THREE.Mesh;
  };
  interior: {
    seatsMaterial: THREE.MeshStandardMaterial;
    ambientLights: THREE.Mesh[];
    interiorPointLight: THREE.PointLight;
  };
  updateConfig: (
    color: CarColor,
    wheel: WheelDesign,
    caliper: CaliperColor,
    interior: InteriorTheme
  ) => void;
  updateAnimations: (
    doorsOpen: boolean,
    wingDeployed: boolean,
    frunkOpen: boolean,
    headlightsOn: boolean,
    underglowOn: boolean,
    wheelSpinSpeed: number,
    delta: number,
    isBraking?: boolean
  ) => void;
}

export function createCarModel(): CarModelObjects {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  // 1. Primary Car Materials
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0b0f14,
    metalness: 0.95,
    roughness: 0.18,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  });

  const carbonFiberMat = new THREE.MeshStandardMaterial({
    color: 0x11161d,
    roughness: 0.45,
    metalness: 0.7,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.4,
    transparent: true,
    opacity: 0.88,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.98,
    roughness: 0.1,
  });

  // 2. Main Chassis & Sculpted Fuselage
  const mainBodyGroup = new THREE.Group();

  // Central low-profile monocoque hull
  // Dimensions roughly: width 2.0m, length 4.6m, height 1.15m
  const hullShape = new THREE.Shape();
  // Side silhouette profile
  hullShape.moveTo(-2.2, 0.28); // Rear diffuser
  hullShape.lineTo(-1.9, 0.45); // Rear deck
  hullShape.lineTo(-1.2, 0.68); // Rear haunches
  hullShape.lineTo(-0.6, 0.95); // Roof line back
  hullShape.lineTo(0.3, 0.95);  // Roof line front
  hullShape.lineTo(1.2, 0.62);  // Windshield base
  hullShape.lineTo(1.9, 0.42);  // Low nose hood
  hullShape.lineTo(2.3, 0.24);  // Front splitter tip
  hullShape.lineTo(2.2, 0.18);  // Lower splitter
  hullShape.lineTo(-2.1, 0.18); // Flat undertray
  hullShape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 2,
    depth: 1.76,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.08,
    bevelSegments: 5,
  };

  const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
  hullGeo.center(); // Center at car origin
  const carBodyMesh = new THREE.Mesh(hullGeo, bodyMaterial);
  carBodyMesh.position.set(0, 0.52, 0);
  carBodyMesh.rotation.y = Math.PI / 2; // Face forward along Z-axis
  carBodyMesh.castShadow = true;
  carBodyMesh.receiveShadow = true;
  mainBodyGroup.add(carBodyMesh);

  // Aerodynamic Front Splitter & Canards (Carbon fiber)
  const splitterGeo = new THREE.BoxGeometry(1.94, 0.06, 0.85);
  const splitter = new THREE.Mesh(splitterGeo, carbonFiberMat);
  splitter.position.set(0, 0.18, -1.95);
  splitter.castShadow = true;
  mainBodyGroup.add(splitter);

  // Front air intake vents
  const intakeGeo = new THREE.BoxGeometry(0.75, 0.22, 0.35);
  const intakeLeft = new THREE.Mesh(intakeGeo, carbonFiberMat);
  intakeLeft.position.set(-0.62, 0.32, -2.1);
  mainBodyGroup.add(intakeLeft);
  const intakeRight = new THREE.Mesh(intakeGeo, carbonFiberMat);
  intakeRight.position.set(0.62, 0.32, -2.1);
  mainBodyGroup.add(intakeRight);

  // Sculpted Side Skirts with aero fins
  const sideSkirtGeo = new THREE.BoxGeometry(0.12, 0.08, 2.7);
  const sideSkirtLeft = new THREE.Mesh(sideSkirtGeo, carbonFiberMat);
  sideSkirtLeft.position.set(-0.96, 0.2, 0.0);
  mainBodyGroup.add(sideSkirtLeft);
  const sideSkirtRight = new THREE.Mesh(sideSkirtGeo, carbonFiberMat);
  sideSkirtRight.position.set(0.96, 0.2, 0.0);
  mainBodyGroup.add(sideSkirtRight);

  // Aggressive Rear Diffuser with 4 vertical strakes
  const diffuserGeo = new THREE.BoxGeometry(1.88, 0.15, 0.65);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonFiberMat);
  diffuser.position.set(0, 0.24, 2.05);
  diffuser.rotation.x = 0.12;
  mainBodyGroup.add(diffuser);

  for (let i = -3; i <= 3; i += 2) {
    const strakeGeo = new THREE.BoxGeometry(0.04, 0.22, 0.58);
    const strake = new THREE.Mesh(strakeGeo, carbonFiberMat);
    strake.position.set(i * 0.26, 0.24, 2.05);
    mainBodyGroup.add(strake);
  }

  // Teardrop Panoramic Glass Canopy (Windshield, Roof, Rear glass)
  const canopyGeo = new THREE.SphereGeometry(0.92, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48);
  canopyGeo.scale(1.0, 0.55, 2.1);
  const canopy = new THREE.Mesh(canopyGeo, glassMat);
  canopy.position.set(0, 0.65, -0.05);
  canopy.castShadow = true;
  mainBodyGroup.add(canopy);

  // Roof intake snorkel (Center dorsal aero fin)
  const dorsalFinGeo = new THREE.BoxGeometry(0.06, 0.18, 1.2);
  const dorsalFin = new THREE.Mesh(dorsalFinGeo, carbonFiberMat);
  dorsalFin.position.set(0, 1.05, 0.45);
  mainBodyGroup.add(dorsalFin);

  group.add(mainBodyGroup);

  // 3. Dihedral Synchronous Butterfly Doors (Left & Right)
  // Left Door Group
  const leftDoorPivot = new THREE.Group();
  // Pivot placed at front A-pillar base
  leftDoorPivot.position.set(-0.85, 0.58, -0.6);

  const doorShellGeo = new THREE.BoxGeometry(0.14, 0.52, 1.25);
  const leftDoorShell = new THREE.Mesh(doorShellGeo, bodyMaterial);
  leftDoorShell.position.set(-0.06, 0.08, 0.55);
  leftDoorShell.castShadow = true;
  leftDoorPivot.add(leftDoorShell);

  const leftDoorInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 1.15), carbonFiberMat);
  leftDoorInner.position.set(0.02, 0.08, 0.55);
  leftDoorPivot.add(leftDoorInner);

  // Left Door Window
  const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.9), glassMat);
  leftWindow.position.set(-0.04, 0.36, 0.55);
  leftDoorPivot.add(leftWindow);

  // Side Mirror (Left)
  const mirrorGeo = new THREE.BoxGeometry(0.24, 0.08, 0.14);
  const leftMirror = new THREE.Mesh(mirrorGeo, carbonFiberMat);
  leftMirror.position.set(-0.18, 0.28, 0.05);
  leftDoorPivot.add(leftMirror);

  group.add(leftDoorPivot);

  // Right Door Group
  const rightDoorPivot = new THREE.Group();
  rightDoorPivot.position.set(0.85, 0.58, -0.6);

  const rightDoorShell = new THREE.Mesh(doorShellGeo, bodyMaterial);
  rightDoorShell.position.set(0.06, 0.08, 0.55);
  rightDoorShell.castShadow = true;
  rightDoorPivot.add(rightDoorShell);

  const rightDoorInner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 1.15), carbonFiberMat);
  rightDoorInner.position.set(-0.02, 0.08, 0.55);
  rightDoorPivot.add(rightDoorInner);

  const rightWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.9), glassMat);
  rightWindow.position.set(0.04, 0.36, 0.55);
  rightDoorPivot.add(rightWindow);

  const rightMirror = new THREE.Mesh(mirrorGeo, carbonFiberMat);
  rightMirror.position.set(0.18, 0.28, 0.05);
  rightDoorPivot.add(rightMirror);

  group.add(rightDoorPivot);

  // 4. Active Rear Aero Wing
  const rearWingPivot = new THREE.Group();
  rearWingPivot.position.set(0, 0.82, 1.7);

  // Wing upright struts
  const strutGeo = new THREE.BoxGeometry(0.05, 0.35, 0.22);
  const leftStrut = new THREE.Mesh(strutGeo, carbonFiberMat);
  leftStrut.position.set(-0.52, 0.16, 0);
  rearWingPivot.add(leftStrut);
  const rightStrut = new THREE.Mesh(strutGeo, carbonFiberMat);
  rightStrut.position.set(0.52, 0.16, 0);
  rearWingPivot.add(rightStrut);

  // Wing main airfoil blade
  const bladeGeo = new THREE.BoxGeometry(1.82, 0.05, 0.42);
  const mainBlade = new THREE.Mesh(bladeGeo, carbonFiberMat);
  mainBlade.position.set(0, 0.34, 0.02);
  mainBlade.castShadow = true;
  rearWingPivot.add(mainBlade);

  // Endplates
  const endplateGeo = new THREE.BoxGeometry(0.04, 0.22, 0.48);
  const leftEndplate = new THREE.Mesh(endplateGeo, carbonFiberMat);
  leftEndplate.position.set(-0.91, 0.34, 0.02);
  rearWingPivot.add(leftEndplate);
  const rightEndplate = new THREE.Mesh(endplateGeo, carbonFiberMat);
  rightEndplate.position.set(0.91, 0.34, 0.02);
  rearWingPivot.add(rightEndplate);

  group.add(rearWingPivot);

  // 5. Frunk / Front Hood Opening
  const frunkPivot = new THREE.Group();
  frunkPivot.position.set(0, 0.62, -1.05);

  const frunkHood = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.95), bodyMaterial);
  frunkHood.position.set(0, 0, -0.45);
  frunkHood.castShadow = true;
  frunkPivot.add(frunkHood);

  // Interior frunk compartment core (Quantum flux battery bay)
  const coreBay = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.25, 0.75),
    new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.6 })
  );
  coreBay.position.set(0, 0.45, -1.48);
  group.add(coreBay);

  // Glowing energy module in frunk
  const energyModule = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.4, 16),
    new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      metalness: 0.9,
    })
  );
  energyModule.rotation.z = Math.PI / 2;
  energyModule.position.set(0, 0.48, -1.48);
  group.add(energyModule);

  group.add(frunkPivot);

  // 6. Cockpit Interior & Ambient Luminescence
  const interiorGroup = new THREE.Group();

  const seatsMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Neo Lunar White by default
    roughness: 0.65,
    metalness: 0.1,
  });

  // Sports bucket seats (Driver & Passenger)
  const seatBackGeo = new THREE.BoxGeometry(0.42, 0.58, 0.12);
  const seatBottomGeo = new THREE.BoxGeometry(0.42, 0.12, 0.48);

  const leftSeatGroup = new THREE.Group();
  leftSeatGroup.position.set(-0.38, 0.42, 0.05);
  const leftSeatBack = new THREE.Mesh(seatBackGeo, seatsMaterial);
  leftSeatBack.position.set(0, 0.32, 0.22);
  leftSeatBack.rotation.x = -0.15;
  const leftSeatBottom = new THREE.Mesh(seatBottomGeo, seatsMaterial);
  leftSeatBottom.position.set(0, 0.06, 0);
  leftSeatGroup.add(leftSeatBack, leftSeatBottom);
  interiorGroup.add(leftSeatGroup);

  const rightSeatGroup = new THREE.Group();
  rightSeatGroup.position.set(0.38, 0.42, 0.05);
  const rightSeatBack = new THREE.Mesh(seatBackGeo, seatsMaterial);
  rightSeatBack.position.set(0, 0.32, 0.22);
  rightSeatBack.rotation.x = -0.15;
  const rightSeatBottom = new THREE.Mesh(seatBottomGeo, seatsMaterial);
  rightSeatBottom.position.set(0, 0.06, 0);
  rightSeatGroup.add(rightSeatBack, rightSeatBottom);
  interiorGroup.add(rightSeatGroup);

  // Center console & floating Quantum Drive dial
  const consoleGeo = new THREE.BoxGeometry(0.24, 0.34, 1.1);
  const centerConsole = new THREE.Mesh(consoleGeo, carbonFiberMat);
  centerConsole.position.set(0, 0.45, -0.05);
  interiorGroup.add(centerConsole);

  // Futuristic Yoke Steering Wheel
  const yokeGroup = new THREE.Group();
  yokeGroup.position.set(-0.38, 0.68, -0.42);
  yokeGroup.rotation.x = 0.25;

  const yokeRim = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.025, 8, 24, Math.PI * 1.3),
    carbonFiberMat
  );
  yokeRim.rotation.z = -Math.PI * 0.65;
  const yokeHub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 12), chromeMat);
  yokeHub.rotation.x = Math.PI / 2;
  yokeGroup.add(yokeRim, yokeHub);
  interiorGroup.add(yokeGroup);

  // Curved Holographic Instrument Dashboard Display
  const dashScreen = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.16, 0.04),
    new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
  );
  dashScreen.position.set(0, 0.72, -0.58);
  dashScreen.rotation.x = 0.15;
  interiorGroup.add(dashScreen);

  // Ambient interior LED strip lighting
  const ambientNeonGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.3, 8);
  ambientNeonGeo.rotateZ(Math.PI / 2);
  const ambientMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const ambientStrip1 = new THREE.Mesh(ambientNeonGeo, ambientMat);
  ambientStrip1.position.set(0, 0.62, -0.55);
  interiorGroup.add(ambientStrip1);

  const ambientStrip2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.02, 1.0),
    ambientMat
  );
  ambientStrip2.position.set(-0.13, 0.58, 0.05);
  interiorGroup.add(ambientStrip2);

  const ambientStrip3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.02, 1.0),
    ambientMat
  );
  ambientStrip3.position.set(0.13, 0.58, 0.05);
  interiorGroup.add(ambientStrip3);

  const interiorPointLight = new THREE.PointLight(0x38bdf8, 0.8, 2.5);
  interiorPointLight.position.set(0, 0.7, 0);
  interiorGroup.add(interiorPointLight);

  group.add(interiorGroup);

  // 7. Wheel Assemblies & Calipers
  // Wheel positions: Front L/R at Z=-1.35, Rear L/R at Z=1.35, X=±0.92
  const wheelMeshes: THREE.Mesh[] = [];
  const caliperMeshes: THREE.Mesh[] = [];

  const caliperMat = new THREE.MeshStandardMaterial({
    color: 0xef4444, // Default Brembo Red
    roughness: 0.3,
    metalness: 0.8,
  });

  const rotorMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.25,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
    metalness: 0.15,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4d8,
    metalness: 0.95,
    roughness: 0.15,
  });

  const createWheel = (isLeft: boolean, isFront: boolean) => {
    const wheelGroup = new THREE.Group();

    // Tire
    const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 32);
    tireGeo.rotateZ(Math.PI / 2);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Rim Outer Barrel
    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.24, 28);
    rimGeo.rotateZ(Math.PI / 2);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    wheelGroup.add(rim);
    wheelMeshes.push(rim);

    // Central Aero Hubcap / Spokes
    const spokeCount = 10;
    const spokeGeo = new THREE.BoxGeometry(0.25, 0.04, 0.05);
    for (let i = 0; i < spokeCount; i++) {
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      const angle = (i / spokeCount) * Math.PI * 2;
      spoke.position.set(0, Math.cos(angle) * 0.12, Math.sin(angle) * 0.12);
      spoke.rotation.x = angle;
      wheelGroup.add(spoke);
      wheelMeshes.push(spoke);
    }

    // Drilled Brake Rotor
    const rotorGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
    rotorGeo.rotateZ(Math.PI / 2);
    const rotor = new THREE.Mesh(rotorGeo, rotorMat);
    rotor.position.set(isLeft ? 0.04 : -0.04, 0, 0);
    wheelGroup.add(rotor);

    // High Performance Caliper
    const caliperGeo = new THREE.BoxGeometry(0.08, 0.14, 0.18);
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(isLeft ? 0.08 : -0.08, 0.12, 0.08);
    wheelGroup.add(caliper);
    caliperMeshes.push(caliper);

    return wheelGroup;
  };

  const frontLeftWheel = createWheel(true, true);
  frontLeftWheel.position.set(-0.95, 0.36, -1.35);
  group.add(frontLeftWheel);

  const frontRightWheel = createWheel(false, true);
  frontRightWheel.position.set(0.95, 0.36, -1.35);
  group.add(frontRightWheel);

  const rearLeftWheel = createWheel(true, false);
  rearLeftWheel.position.set(-0.95, 0.36, 1.35);
  group.add(rearLeftWheel);

  const rearRightWheel = createWheel(false, false);
  rearRightWheel.position.set(0.95, 0.36, 1.35);
  group.add(rearRightWheel);

  // 8. Headlights, Tailbars, & Dynamic Underglow
  // Left and Right Laser SpotLights
  const leftSpot = new THREE.SpotLight(0xffffff, 4.0, 30, Math.PI / 6, 0.4, 1.2);
  leftSpot.position.set(-0.65, 0.48, -2.1);
  leftSpot.target.position.set(-0.65, 0.0, -15);
  group.add(leftSpot);
  group.add(leftSpot.target);

  const rightSpot = new THREE.SpotLight(0xffffff, 4.0, 30, Math.PI / 6, 0.4, 1.2);
  rightSpot.position.set(0.65, 0.48, -2.1);
  rightSpot.target.position.set(0.65, 0.0, -15);
  group.add(rightSpot);
  group.add(rightSpot.target);

  // Emissive Lens Geometries
  const lensGeo = new THREE.BoxGeometry(0.35, 0.06, 0.12);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x38bdf8,
    emissiveIntensity: 2.5,
  });

  const leftLens = new THREE.Mesh(lensGeo, lensMat);
  leftLens.position.set(-0.65, 0.48, -2.12);
  leftLens.rotation.y = 0.25;
  group.add(leftLens);

  const rightLens = new THREE.Mesh(lensGeo, lensMat);
  rightLens.position.set(0.65, 0.48, -2.12);
  rightLens.rotation.y = -0.25;
  group.add(rightLens);

  // Front Cyber Blade DRL Strip
  const drlGeo = new THREE.BoxGeometry(1.6, 0.03, 0.08);
  const drlStrip = new THREE.Mesh(drlGeo, lensMat);
  drlStrip.position.set(0, 0.45, -2.18);
  group.add(drlStrip);

  // Rear Full-Width Taillight Ribbon
  const taillightGeo = new THREE.BoxGeometry(1.85, 0.05, 0.1);
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff1e1e,
    emissive: 0xff0022,
    emissiveIntensity: 2.2,
  });
  const taillightStrip = new THREE.Mesh(taillightGeo, taillightMat);
  taillightStrip.position.set(0, 0.65, 2.12);
  group.add(taillightStrip);

  // Dynamic Underglow Neon Light
  const underglowLight = new THREE.PointLight(0x06b6d4, 2.5, 3.8);
  underglowLight.position.set(0, 0.06, 0);
  group.add(underglowLight);

  const underglowMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 3.8),
    new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
  );
  underglowMesh.rotation.x = -Math.PI / 2;
  underglowMesh.position.set(0, 0.03, 0);
  group.add(underglowMesh);

  // Update Config Function (Color, Wheels, Calipers, Interior)
  const updateConfig = (
    color: CarColor,
    wheel: WheelDesign,
    caliper: CaliperColor,
    interior: InteriorTheme
  ) => {
    // Body Paint
    bodyMaterial.color.set(color.hex);
    bodyMaterial.roughness = color.roughness;
    bodyMaterial.metalness = color.metalness;
    bodyMaterial.clearcoat = color.clearcoat;
    if (color.finish === 'matte') {
      bodyMaterial.clearcoat = 0.05;
      bodyMaterial.reflectivity = 0.2;
    } else if (color.finish === 'iridescent') {
      bodyMaterial.clearcoat = 1.0;
      bodyMaterial.reflectivity = 0.98;
    }

    // Wheel Calipers
    caliperMat.color.set(caliper.hex);

    // Rim styling based on WheelDesign
    const rimColorHex =
      wheel.style === 'turbofan'
        ? 0x27272a
        : wheel.style === 'cyberhex'
        ? 0x18181b
        : wheel.style === 'starburst'
        ? 0xf1f5f9
        : 0xd4d4d8;
    rimMat.color.setHex(rimColorHex);
    rimMat.metalness = wheel.style === 'turbofan' ? 0.6 : 0.96;
    rimMat.roughness = wheel.style === 'turbofan' ? 0.4 : 0.15;

    // Interior theme
    seatsMaterial.color.set(interior.primaryColor);
    ambientMat.color.set(interior.ambientGlowHex);
    interiorPointLight.color.set(interior.ambientGlowHex);
    underglowLight.color.set(interior.ambientGlowHex);
    (underglowMesh.material as THREE.MeshBasicMaterial).color.set(interior.ambientGlowHex);
  };

  // Update Animations (Doors, Wing, Frunk, Headlights, Wheel spin, Brake light flare)
  const updateAnimations = (
    doorsOpen: boolean,
    wingDeployed: boolean,
    frunkOpen: boolean,
    headlightsOn: boolean,
    underglowOn: boolean,
    wheelSpinSpeed: number,
    delta: number,
    isBraking: boolean = false
  ) => {
    const lerpSpeed = Math.min(1, delta * 6);

    // Dihedral Butterfly Doors: rotate outward around Z and upward around X
    const targetDoorRotZ = doorsOpen ? 0.58 : 0.0;
    const targetDoorRotX = doorsOpen ? -0.85 : 0.0;

    leftDoorPivot.rotation.z = THREE.MathUtils.lerp(leftDoorPivot.rotation.z, -targetDoorRotZ, lerpSpeed);
    leftDoorPivot.rotation.x = THREE.MathUtils.lerp(leftDoorPivot.rotation.x, targetDoorRotX, lerpSpeed);

    rightDoorPivot.rotation.z = THREE.MathUtils.lerp(rightDoorPivot.rotation.z, targetDoorRotZ, lerpSpeed);
    rightDoorPivot.rotation.x = THREE.MathUtils.lerp(rightDoorPivot.rotation.x, targetDoorRotX, lerpSpeed);

    // Active Aero Wing: elevate position Y and tilt pitch X (tilt higher as airbrake during heavy braking)
    const targetWingY = (wingDeployed || isBraking) ? 1.08 : 0.82;
    const targetWingPitch = isBraking ? -0.45 : wingDeployed ? -0.25 : 0.0;
    rearWingPivot.position.y = THREE.MathUtils.lerp(rearWingPivot.position.y, targetWingY, lerpSpeed);
    rearWingPivot.rotation.x = THREE.MathUtils.lerp(rearWingPivot.rotation.x, targetWingPitch, lerpSpeed);

    // Frunk Hood opening
    const targetFrunkPitch = frunkOpen ? -0.7 : 0.0;
    frunkPivot.rotation.x = THREE.MathUtils.lerp(frunkPivot.rotation.x, targetFrunkPitch, lerpSpeed);

    // Headlights
    const targetLightIntensity = headlightsOn ? 4.5 : 0.0;
    leftSpot.intensity = THREE.MathUtils.lerp(leftSpot.intensity, targetLightIntensity, lerpSpeed * 2);
    rightSpot.intensity = THREE.MathUtils.lerp(rightSpot.intensity, targetLightIntensity, lerpSpeed * 2);
    (leftLens.material as THREE.MeshStandardMaterial).emissiveIntensity = headlightsOn ? 3.0 : 0.2;
    (rightLens.material as THREE.MeshStandardMaterial).emissiveIntensity = headlightsOn ? 3.0 : 0.2;
    (drlStrip.material as THREE.MeshStandardMaterial).emissiveIntensity = headlightsOn ? 2.5 : 0.4;

    // Taillight Brake Flare
    const targetTailEmissive = isBraking ? 5.0 : 2.2;
    (taillightStrip.material as THREE.MeshStandardMaterial).emissiveIntensity = THREE.MathUtils.lerp(
      (taillightStrip.material as THREE.MeshStandardMaterial).emissiveIntensity,
      targetTailEmissive,
      lerpSpeed * 3
    );

    // Underglow
    const targetUnderglowIntensity = underglowOn ? 2.8 : 0.0;
    underglowLight.intensity = THREE.MathUtils.lerp(underglowLight.intensity, targetUnderglowIntensity, lerpSpeed * 2);
    (underglowMesh.material as THREE.MeshBasicMaterial).opacity = underglowOn ? 0.45 : 0.0;

    // Wheel spin (rotation around X axis)
    if (wheelSpinSpeed !== 0) {
      frontLeftWheel.rotation.x += wheelSpinSpeed * delta;
      frontRightWheel.rotation.x += wheelSpinSpeed * delta;
      rearLeftWheel.rotation.x += wheelSpinSpeed * delta;
      rearRightWheel.rotation.x += wheelSpinSpeed * delta;
    }
  };

  return {
    group,
    carBodyMesh,
    bodyMaterial,
    leftDoorPivot,
    rightDoorPivot,
    rearWingPivot,
    frunkPivot,
    wheelAssemblies: {
      frontLeft: frontLeftWheel,
      frontRight: frontRightWheel,
      rearLeft: rearLeftWheel,
      rearRight: rearRightWheel,
      wheelMeshes,
      caliperMeshes,
    },
    headlights: {
      leftSpot,
      rightSpot,
      leftLens,
      rightLens,
      drlStrip,
      taillightStrip,
      underglowLight,
      underglowMesh,
    },
    interior: {
      seatsMaterial,
      ambientLights: [ambientStrip1, ambientStrip2, ambientStrip3],
      interiorPointLight,
    },
    updateConfig,
    updateAnimations,
  };
}
