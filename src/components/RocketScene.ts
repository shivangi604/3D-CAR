import * as THREE from 'three';

export interface RocketSceneObjects {
  group: THREE.Group;
  character: THREE.Group;
  rightArmPivot: THREE.Group;
  head: THREE.Group;
  rocket: THREE.Group;
  flameCone: THREE.Mesh;
  flameLight: THREE.PointLight;
  particles: THREE.Points;
  particlePositions: Float32Array;
  particleVelocities: Float32Array;
  updateLaunch: (progress: number, elapsed: number) => void;
}

export function createRocketScene(): RocketSceneObjects {
  const group = new THREE.Group();

  // 1. Launch Platform Base & Gantry Tower
  const platformGeo = new THREE.CylinderGeometry(8, 9, 1.2, 32);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x1e242d,
    roughness: 0.7,
    metalness: 0.8,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(0, 0.6, 0);
  platform.receiveShadow = true;
  group.add(platform);

  // Metal grating ring on launchpad
  const ringGeo = new THREE.RingGeometry(4, 7.8, 32);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
    metalness: 0.9,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 1.21;
  ring.receiveShadow = true;
  group.add(ring);

  // Flame exhaust trench hole
  const trenchGeo = new THREE.CylinderGeometry(2.4, 2.4, 3, 24, 1, true);
  const trenchMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.9,
    metalness: 0.3,
  });
  const trench = new THREE.Mesh(trenchGeo, trenchMat);
  trench.position.set(0, 0, 0);
  group.add(trench);

  // Tower Gantry Truss Structure
  const gantryGroup = new THREE.Group();
  const trussMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Industrial aerospace orange
    roughness: 0.4,
    metalness: 0.7,
  });

  // Vertical legs
  const legGeo = new THREE.BoxGeometry(0.3, 22, 0.3);
  const legPositions = [
    [-3.2, 11, -3.2],
    [-2.0, 11, -3.2],
    [-3.2, 11, -2.0],
    [-2.0, 11, -2.0],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, trussMat);
    leg.position.set(x, y, z);
    leg.castShadow = true;
    gantryGroup.add(leg);
  });

  // Cross horizontal trusses
  const crossGeo = new THREE.BoxGeometry(1.4, 0.15, 1.4);
  for (let i = 2; i <= 21; i += 2.2) {
    const cross = new THREE.Mesh(crossGeo, trussMat);
    cross.position.set(-2.6, i, -2.6);
    gantryGroup.add(cross);
  }

  // Swing Service Arm pointing to rocket
  const armGeo = new THREE.BoxGeometry(2.4, 0.4, 0.5);
  const armMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
  const serviceArm = new THREE.Mesh(armGeo, armMat);
  serviceArm.position.set(-1.4, 15, -2.6);
  gantryGroup.add(serviceArm);

  // Gantry warning strobe lights
  const beaconGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.set(-2.6, 22.2, -2.6);
  gantryGroup.add(beacon);

  group.add(gantryGroup);

  // 2. Character: Sci-fi Commander / Astronaut
  // Positioned on the elevated gantry observation catwalk
  const character = new THREE.Group();
  character.position.set(-2.6, 15.3, -1.8);
  character.rotation.y = Math.PI * 0.25; // angled toward rocket

  // Catwalk platform under character
  const catwalkGeo = new THREE.BoxGeometry(1.6, 0.15, 1.6);
  const catwalkMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.4 });
  const catwalk = new THREE.Mesh(catwalkGeo, catwalkMat);
  catwalk.position.set(0, -0.08, 0);
  character.add(catwalk);

  // Safety railing
  const railMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5 });
  const railGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
  const post1 = new THREE.Mesh(railGeo, railMat);
  post1.position.set(0.7, 0.55, 0.7);
  character.add(post1);
  const post2 = new THREE.Mesh(railGeo, railMat);
  post2.position.set(-0.7, 0.55, 0.7);
  character.add(post2);

  // Character body materials
  const suitMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Obsidian dark aerospace suit
    roughness: 0.5,
    metalness: 0.6,
  });
  const armorMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8, // Electric cyan armor plates
    roughness: 0.2,
    metalness: 0.8,
  });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Gold reflective visor
    roughness: 0.05,
    metalness: 0.95,
  });

  // Legs & Boots
  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.7, 12), suitMat);
  leg1.position.set(-0.16, 0.35, 0);
  character.add(leg1);
  const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.7, 12), suitMat);
  leg2.position.set(0.16, 0.35, 0);
  character.add(leg2);

  const bootGeo = new THREE.BoxGeometry(0.16, 0.14, 0.24);
  const boot1 = new THREE.Mesh(bootGeo, suitMat);
  boot1.position.set(-0.16, 0.07, 0.04);
  character.add(boot1);
  const boot2 = new THREE.Mesh(bootGeo, suitMat);
  boot2.position.set(0.16, 0.07, 0.04);
  character.add(boot2);

  // Pelvis & Torso
  const torsoGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.7, 14);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, 1.05, 0);
  character.add(torso);

  // Chest Armor Plate with glowing reactor core
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.28), armorMat);
  chestPlate.position.set(0, 1.15, 0.04);
  character.add(chestPlate);

  const reactorCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12),
    new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
  );
  reactorCore.rotation.x = Math.PI / 2;
  reactorCore.position.set(0, 1.18, 0.18);
  character.add(reactorCore);

  // Head & Helmet
  const head = new THREE.Group();
  head.position.set(0, 1.55, 0);

  const helmetGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const helmet = new THREE.Mesh(helmetGeo, suitMat);
  head.add(helmet);

  // Visor
  const visorGeo = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 0.7, 0, Math.PI * 0.6);
  const visor = new THREE.Mesh(visorGeo, visorMat);
  visor.rotation.y = -Math.PI * 0.35;
  visor.position.set(0, 0, 0.06);
  head.add(visor);
  character.add(head);

  // Left Arm (relaxed at side)
  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.6, 10), suitMat);
  leftArm.position.set(-0.32, 1.05, 0);
  leftArm.rotation.z = 0.1;
  character.add(leftArm);

  // Right Arm: Rigged to POINT towards the rocket!
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.32, 1.35, 0); // Shoulder socket

  const upperArmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.42, 10);
  upperArmGeo.translate(0, -0.21, 0);
  const upperArm = new THREE.Mesh(upperArmGeo, suitMat);

  const elbowGroup = new THREE.Group();
  elbowGroup.position.set(0, -0.42, 0);

  const forearmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.42, 10);
  forearmGeo.translate(0, -0.21, 0);
  const forearm = new THREE.Mesh(forearmGeo, armorMat);
  elbowGroup.add(forearm);

  // Pointing Hand & Extended Finger
  const handGroup = new THREE.Group();
  handGroup.position.set(0, -0.42, 0);

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 0.06), suitMat);
  handGroup.add(palm);

  // Extended index finger pointing outward
  const fingerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8);
  fingerGeo.translate(0, -0.07, 0);
  const indexFinger = new THREE.Mesh(fingerGeo, armorMat);
  indexFinger.position.set(0.02, -0.05, 0.02);
  handGroup.add(indexFinger);

  elbowGroup.add(handGroup);
  rightArmPivot.add(upperArm);
  rightArmPivot.add(elbowGroup);

  // Initial dramatic pointing pose towards rocket:
  // Arm raised up and angled forward-inward
  rightArmPivot.rotation.x = -Math.PI * 0.45; // forward raise
  rightArmPivot.rotation.z = -Math.PI * 0.25; // angled outward
  elbowGroup.rotation.x = -Math.PI * 0.15; // straightened forearm
  character.add(rightArmPivot);

  group.add(character);

  // 3. The 3D Orbital Rocket
  const rocket = new THREE.Group();
  rocket.position.set(0, 1.2, 0);

  // Main rocket materials
  const rocketWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.7,
    roughness: 0.25,
  });
  const rocketCarbonMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.8,
    roughness: 0.35,
  });
  const rocketAccentMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan stripe
    metalness: 0.5,
    roughness: 0.3,
  });

  // Stage 1 Booster Core
  const stage1Geo = new THREE.CylinderGeometry(1.6, 1.7, 12, 32);
  const stage1 = new THREE.Mesh(stage1Geo, rocketWhiteMat);
  stage1.position.y = 6;
  stage1.castShadow = true;
  rocket.add(stage1);

  // Interstage Carbon Ring
  const interstageGeo = new THREE.CylinderGeometry(1.58, 1.6, 1.4, 32);
  const interstage = new THREE.Mesh(interstageGeo, rocketCarbonMat);
  interstage.position.y = 12.7;
  rocket.add(interstage);

  // Stage 2 Core
  const stage2Geo = new THREE.CylinderGeometry(1.55, 1.58, 8, 32);
  const stage2 = new THREE.Mesh(stage2Geo, rocketWhiteMat);
  stage2.position.y = 17.4;
  stage2.castShadow = true;
  rocket.add(stage2);

  // Aerodynamic Payload Fairing (Nose Cone)
  const fairingGeo = new THREE.ConeGeometry(1.55, 5.2, 32);
  const fairing = new THREE.Mesh(fairingGeo, rocketWhiteMat);
  fairing.position.y = 24.0;
  fairing.castShadow = true;
  rocket.add(fairing);

  // Cyan futuristic logo ring on fairing
  const fairingRing = new THREE.Mesh(new THREE.CylinderGeometry(1.56, 1.56, 0.4, 32), rocketAccentMat);
  fairingRing.position.y = 20.8;
  rocket.add(fairingRing);

  // Grid Aerodynamic Fins
  const finGeo = new THREE.BoxGeometry(0.1, 1.8, 1.2);
  for (let i = 0; i < 4; i++) {
    const fin = new THREE.Mesh(finGeo, rocketCarbonMat);
    const angle = (i * Math.PI) / 2;
    fin.position.set(Math.cos(angle) * 1.9, 13, Math.sin(angle) * 1.9);
    fin.rotation.y = angle;
    rocket.add(fin);
  }

  // Base Rocket Engine Bells (Cluster of 5)
  const bellGeo = new THREE.CylinderGeometry(0.3, 0.65, 1.4, 20, 1, true);
  const bellMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.95,
    roughness: 0.2,
  });

  const enginePositions = [
    [0, 0],
    [0.7, 0],
    [-0.7, 0],
    [0, 0.7],
    [0, -0.7],
  ];
  enginePositions.forEach(([ex, ez]) => {
    const bell = new THREE.Mesh(bellGeo, bellMat);
    bell.position.set(ex, -0.7, ez);
    rocket.add(bell);
  });

  // Thrust Flame Cone (pulsates during launch)
  const flameGeo = new THREE.ConeGeometry(1.6, 7.5, 24, 1, true);
  flameGeo.rotateX(Math.PI);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const flameCone = new THREE.Mesh(flameGeo, flameMat);
  flameCone.position.set(0, -4.2, 0);
  rocket.add(flameCone);

  // High-intensity exhaust point light
  const flameLight = new THREE.PointLight(0xff7700, 0, 35, 1.5);
  flameLight.position.set(0, -2, 0);
  rocket.add(flameLight);

  group.add(rocket);

  // 4. Particle System for Launch Smoke & Fire Sparkles
  const particleCount = 450;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 2;
    particlePositions[i * 3 + 1] = 0.5;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;

    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    particleVelocities[i * 3] = Math.cos(angle) * speed;
    particleVelocities[i * 3 + 1] = Math.random() * 1.5;
    particleVelocities[i * 3 + 2] = Math.sin(angle) * speed;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xffaa44,
    size: 0.45,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  // Update launch animation physics
  const updateLaunch = (progress: number, elapsed: number) => {
    // Character subtle breathing & arm pointing adjustment
    const breathe = Math.sin(elapsed * 2.5) * 0.03;
    character.position.y = 15.3 + breathe;
    
    // Head tracks upward as rocket rises
    const rocketHeight = rocket.position.y;
    head.rotation.x = -Math.min(1.1, (rocketHeight - 1.2) * 0.05);

    if (progress <= 0) {
      // Idle state
      flameCone.scale.set(0.01, 0.01, 0.01);
      (flameCone.material as THREE.MeshBasicMaterial).opacity = 0;
      flameLight.intensity = 0;
      (particles.material as THREE.PointsMaterial).opacity = 0;
      rocket.position.y = 1.2;
      return;
    }

    // Launch active
    const isIgniting = progress < 0.25;
    const ignitionNorm = isIgniting ? progress / 0.25 : 1.0;

    // Thruster flame visuals
    const flameFlicker = 1 + (Math.sin(elapsed * 45) * 0.15 + Math.cos(elapsed * 60) * 0.1);
    const flameOpacity = Math.min(1, ignitionNorm * 1.5);
    (flameCone.material as THREE.MeshBasicMaterial).opacity = flameOpacity;
    (flameCone.material as THREE.MeshBasicMaterial).color.setHex(progress > 0.4 ? 0x38bdf8 : 0xff5500); // changes to blue ion plasma at speed!
    flameCone.scale.set(flameFlicker, flameFlicker * (1 + progress * 2), flameFlicker);
    flameLight.intensity = flameOpacity * 8;
    flameLight.color.setHex(progress > 0.4 ? 0x38bdf8 : 0xff7700);

    // Rocket lifts off exponentially: y = 1.2 + a * t^2
    const launchPhase = Math.max(0, (progress - 0.15) / 0.85);
    rocket.position.y = 1.2 + Math.pow(launchPhase, 2.6) * 95;

    // Arm tracking pointing gesture moves higher with rocket
    rightArmPivot.rotation.x = -Math.PI * 0.45 - launchPhase * 0.4;

    // Particles smoke & fire burst
    (particles.material as THREE.PointsMaterial).opacity = Math.max(0, 0.8 - launchPhase * 0.7);
    const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < particleCount; i++) {
      let py = particlePositions[i * 3 + 1];
      if (py > 15 || Math.random() < 0.03) {
        // Reset near rocket base
        particlePositions[i * 3] = rocket.position.x + (Math.random() - 0.5) * 1.5;
        particlePositions[i * 3 + 1] = Math.max(0.5, rocket.position.y - 1);
        particlePositions[i * 3 + 2] = rocket.position.z + (Math.random() - 0.5) * 1.5;
      } else {
        particlePositions[i * 3] += particleVelocities[i * 3] * 0.03;
        particlePositions[i * 3 + 1] += particleVelocities[i * 3 + 1] * 0.03 + 0.05;
        particlePositions[i * 3 + 2] += particleVelocities[i * 3 + 2] * 0.03;
      }
    }
    posAttr.needsUpdate = true;
  };

  return {
    group,
    character,
    rightArmPivot,
    head,
    rocket,
    flameCone,
    flameLight,
    particles,
    particlePositions,
    particleVelocities,
    updateLaunch,
  };
}
