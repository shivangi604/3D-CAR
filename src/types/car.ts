export type CarColor = {
  id: string;
  name: string;
  hex: string;
  finish: 'metallic' | 'matte' | 'iridescent';
  roughness: number;
  metalness: number;
  clearcoat: number;
  description: string;
  price: number;
};

export type WheelDesign = {
  id: string;
  name: string;
  spokeCount: number;
  style: 'turbofan' | 'monoblock' | 'cyberhex' | 'starburst';
  description: string;
  weightSavingsKg: number;
  price: number;
};

export type CaliperColor = {
  id: string;
  name: string;
  hex: string;
};

export type InteriorTheme = {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  ambientGlowHex: string;
  materialName: string;
  description: string;
  price: number;
};

export type PerformancePackage = {
  id: string;
  name: string;
  hpBonus: number;
  accelerationReduction: number;
  description: string;
  price: number;
};

export type CarHotspot = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  position: [number, number, number]; // 3D position relative to car
  cameraTarget: [number, number, number];
  cameraPos: [number, number, number];
  metrics: { label: string; value: string }[];
  details: string;
};

export type CameraPreset = 'orbit' | 'front' | 'side' | 'rear' | 'interior' | 'top' | 'wheel';

export const CAR_COLORS: CarColor[] = [
  {
    id: 'nebula-obsidian',
    name: 'Nebula Obsidian',
    hex: '#0b0f14',
    finish: 'metallic',
    roughness: 0.18,
    metalness: 0.95,
    clearcoat: 0.9,
    description: 'Deep celestial black with crystalline blue micro-flakes',
    price: 0,
  },
  {
    id: 'solar-copper',
    name: 'Solar Flare Copper',
    hex: '#e25822',
    finish: 'metallic',
    roughness: 0.22,
    metalness: 0.92,
    clearcoat: 0.85,
    description: 'Molten liquid copper with fiery orange luster',
    price: 3200,
  },
  {
    id: 'cyber-cyan',
    name: 'Cyberflux Cyan',
    hex: '#06b6d4',
    finish: 'iridescent',
    roughness: 0.15,
    metalness: 0.88,
    clearcoat: 1.0,
    description: 'Electric photonic teal with spectral violet shifts',
    price: 4500,
  },
  {
    id: 'quicksilver',
    name: 'Liquid Quicksilver',
    hex: '#c0c7cf',
    finish: 'metallic',
    roughness: 0.12,
    metalness: 0.98,
    clearcoat: 0.95,
    description: 'Polished mirrored aeronautical aluminum',
    price: 2500,
  },
  {
    id: 'stealth-matte',
    name: 'Apex Stealth Grey',
    hex: '#1e242d',
    finish: 'matte',
    roughness: 0.58,
    metalness: 0.45,
    clearcoat: 0.1,
    description: 'Radar-absorbent velvet matte tactical finish',
    price: 3800,
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora',
    hex: '#059669',
    finish: 'metallic',
    roughness: 0.2,
    metalness: 0.92,
    clearcoat: 0.9,
    description: 'Deep racing green with radiant viridian reflections',
    price: 3500,
  },
  {
    id: 'viper-crimson',
    name: 'Hyperion Crimson',
    hex: '#dc2626',
    finish: 'metallic',
    roughness: 0.16,
    metalness: 0.94,
    clearcoat: 0.95,
    description: 'High-octane blood red with candy lacquer depth',
    price: 4000,
  },
];

export const WHEEL_DESIGNS: WheelDesign[] = [
  {
    id: 'aero-turbofan',
    name: '21" Aero Turbofan',
    spokeCount: 12,
    style: 'turbofan',
    description: 'Carbon-shielded aero disc with vortex drag reduction (-7% drag)',
    weightSavingsKg: 8.4,
    price: 0,
  },
  {
    id: 'v-spoke-monoblock',
    name: '22" V-Spoke Monoblock',
    spokeCount: 10,
    style: 'monoblock',
    description: 'Ultra-rigid forged magnesium twin-strut geometry',
    weightSavingsKg: 14.2,
    price: 4800,
  },
  {
    id: 'cyber-hex',
    name: '21" Cyber Hexagonal',
    spokeCount: 6,
    style: 'cyberhex',
    description: 'Bionic generative lattice with perimeter aero blades',
    weightSavingsKg: 11.8,
    price: 5400,
  },
  {
    id: 'starburst-forged',
    name: '22" Starburst Hyper-Forged',
    spokeCount: 8,
    style: 'starburst',
    description: 'Asymmetric diamond-turned aerospace titanium spokes',
    weightSavingsKg: 16.0,
    price: 6200,
  },
];

export const CALIPER_COLORS: CaliperColor[] = [
  { id: 'acid-green', name: 'Acid Green', hex: '#84cc16' },
  { id: 'solar-orange', name: 'Solar Orange', hex: '#f97316' },
  { id: 'racing-red', name: 'Brembo Red', hex: '#ef4444' },
  { id: 'cyber-cyan', name: 'Electric Cyan', hex: '#06b6d4' },
  { id: 'liquid-silver', name: 'Silver Chrome', hex: '#e2e8f0' },
];

export const INTERIOR_THEMES: InteriorTheme[] = [
  {
    id: 'cyber-white',
    name: 'Neo Lunar White',
    primaryColor: '#f8fafc',
    accentColor: '#0ea5e9',
    ambientGlowHex: '#38bdf8',
    materialName: 'Perforated Vegan Leather & White Alcantara',
    description: 'Architectural minimalism with cool blue ambient cabin luminescence',
    price: 0,
  },
  {
    id: 'obsidian-matrix',
    name: 'Obsidian Matrix',
    primaryColor: '#111827',
    accentColor: '#10b981',
    ambientGlowHex: '#34d399',
    materialName: 'Forged Carbon Trim & Technical Microfiber',
    description: 'Race-cockpit dark environment with emerald laser contrast stitching',
    price: 2400,
  },
  {
    id: 'tuscan-amber',
    name: 'Tuscan Saffron',
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    ambientGlowHex: '#fbbf24',
    materialName: 'Hand-Stitched Full-Grain Saddle Leather',
    description: 'Warm grand touring luxury with warm golden perimeter illumination',
    price: 3600,
  },
  {
    id: 'crimson-sport',
    name: 'Crimson Velocity',
    primaryColor: '#991b1b',
    accentColor: '#f43f5e',
    ambientGlowHex: '#f43f5e',
    materialName: 'Alcantara Sport Weave & Kevlar Inlays',
    description: 'Intense cockpit focus built for aggressive cornering and high G-forces',
    price: 4200,
  },
];

export const PERFORMANCE_PACKAGES: PerformancePackage[] = [
  {
    id: 'pack-standard',
    name: 'Apex Dual Drive',
    hpBonus: 0,
    accelerationReduction: 0,
    description: 'Twin axial-flux motors producing 1,020 hp with AWD torque vectoring',
    price: 0,
  },
  {
    id: 'pack-hyper',
    name: 'Quantum Quad-Boost Pack',
    hpBonus: 430,
    accelerationReduction: 0.35,
    description: 'Quad independent per-wheel motors delivering 1,450 hp and 1.78s 0-60mph',
    price: 18500,
  },
  {
    id: 'pack-track',
    name: 'Nürburgring Aero Carbon Pack',
    hpBonus: 120,
    accelerationReduction: 0.15,
    description: 'Active venturi diffusers, front dive planes & DRS carbon rear wing (+450kg downforce)',
    price: 14200,
  },
];

export const CAR_HOTSPOTS: CarHotspot[] = [
  {
    id: 'powertrain',
    title: 'Solid-State Hyper-Flux Powertrain',
    category: 'PROPULSION & ENERGY',
    subtitle: '1,450 HP · Quad Axial-Flux Motors · 800V Architecture',
    position: [0, 0.4, 0.8],
    cameraTarget: [0, 0.4, 0.5],
    cameraPos: [1.8, 1.2, 2.2],
    metrics: [
      { label: 'Max Output', value: '1,450 HP (1,081 kW)' },
      { label: '0-60 MPH', value: '1.78 sec' },
      { label: 'Top Speed', value: '248 MPH (399 km/h)' },
      { label: 'Range', value: '460 Miles (WLTP)' },
    ],
    details: 'Silicon-carbon solid-state chemistry operating at 800 volts. Ultra-dense 115 kWh energy pack capable of 10% to 80% ultra-fast induction recharge in 9 minutes.',
  },
  {
    id: 'doors',
    title: 'Dihedral Synchro-Helix Aero Doors',
    category: 'CHASSIS & ACCESS',
    subtitle: 'Dry Carbon Monocoque · Synchronous Pivot · Zero-Resistance Servos',
    position: [1.1, 0.7, 0.1],
    cameraTarget: [0.6, 0.6, 0.0],
    cameraPos: [2.6, 1.4, 0.8],
    metrics: [
      { label: 'Door Weight', value: '6.2 kg per side' },
      { label: 'Opening Angle', value: '65° Synchronous' },
      { label: 'Hinge Tech', value: 'Bespoke Titanium Kinematics' },
      { label: 'Sensors', value: 'Ultrasonic Obstacle Detection' },
    ],
    details: 'Sculpted from aerospace autoclave dry carbon fiber. Upward sweeping dihedral doors integrate integrated vortex extraction channels to draw engine heat away from the cabin.',
  },
  {
    id: 'optics',
    title: 'Photonic Matrix Laser Optics',
    category: 'ILLUMINATION & SENSORS',
    subtitle: '600m Projection Range · Micro-Mirror Array · Dynamic Cornering',
    position: [0.7, 0.45, -1.9],
    cameraTarget: [0.4, 0.45, -1.8],
    cameraPos: [1.6, 0.8, -2.8],
    metrics: [
      { label: 'Beam Throw', value: '620 Meters' },
      { label: 'LED Matrix', value: '1.3M Micro-Mirrors' },
      { label: 'Signature', value: 'Cyberflux Monolithic Blade' },
      { label: 'LiDAR Co-Site', value: 'Sub-millimeter Spatial Mesh' },
    ],
    details: 'Adaptive laser-diode matrix optics with real-time beam shaping around oncoming road users. Embedded solid-state LiDAR sensors seamlessly integrated behind the crystal optic lenses.',
  },
  {
    id: 'wheels',
    title: 'Generative Forged Magnesium & Carbon Ceramics',
    category: 'BRAKING & RUNNING GEAR',
    subtitle: '410mm Drilled Rotors · 10-Piston Calipers · Active Regenerative Drag',
    position: [1.0, 0.35, -1.3],
    cameraTarget: [0.95, 0.35, -1.3],
    cameraPos: [1.9, 0.6, -1.1],
    metrics: [
      { label: 'Rotor Diameter', value: '410 mm Front / 390 mm Rear' },
      { label: '60-0 Braking', value: '92 Feet' },
      { label: 'Unsprung Mass', value: '-38% vs Cast Steel' },
      { label: 'Thermal Peak', value: '1,050° C Operating Limit' },
    ],
    details: 'Generative AI bionic spoke topology optimized for rotational stiffness and thermal dissipation. Carbon-silicon ceramic rotors with 10-piston monoblock calipers.',
  },
  {
    id: 'aerodynamics',
    title: 'Active Variable Vortex Aero-Blade',
    category: 'AERODYNAMICS & DOWNFORCE',
    subtitle: 'Variable Dual-Stage Wing · DRS High-Speed Mode · Venturi Ground Effect',
    position: [0, 0.85, 1.8],
    cameraTarget: [0, 0.7, 1.6],
    cameraPos: [0, 1.6, 3.2],
    metrics: [
      { label: 'Max Downforce', value: '820 kg @ 180 mph' },
      { label: 'Drag Coeff (Cd)', value: '0.21 (Aero Mode) / 0.38 (Braking)' },
      { label: 'Actuation Speed', value: '180 milliseconds' },
      { label: 'Airbrake Assist', value: '+0.6G Deceleration Bias' },
    ],
    details: 'Hydraulically articulated active rear spoiler featuring automatic Drag Reduction System (DRS) and dynamic airbrake deployment that tilts 70 degrees during heavy braking.',
  },
  {
    id: 'cockpit',
    title: 'Augmented Holographic Cockpit',
    category: 'INTERIOR & TELEMETRY',
    subtitle: 'Neural Glass HUD · Yoke F1 Ergonomics · Biometric Driver Sync',
    position: [0, 0.75, -0.1],
    cameraTarget: [0, 0.65, -0.2],
    cameraPos: [0.8, 1.2, 0.4],
    metrics: [
      { label: 'Display Mesh', value: 'Curved Seamless OLED 4K' },
      { label: 'Latency', value: '<2ms Haptic & Visual' },
      { label: 'Audio', value: 'Spatial 24-Speaker Transducer' },
      { label: 'Acoustic Glass', value: '-22dB Active Anti-Noise' },
    ],
    details: 'Minimalist driver-centric architecture crafted with sustainable vegan materials, forged carbon accents, capacitive touch controls, and continuous ambient luminescence.',
  },
];
