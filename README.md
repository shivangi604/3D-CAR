# 🚀 Aether Hyperion - Future 3D Car Showroom

A cinematic, interactive 3D WebGL web application showcasing the next-generation **Aether Hyperion** concept hypercar. The experience opens with an animated space commander gesturing toward an orbital rocket, followed by a rocket launch sequence and supersonic warp transition directly into a 3D automotive showroom.

---

## ✨ Key Features

### 1. 🎬 Cinematic 3D Rocket Launch Prologue
- **Animated 3D Sci-Fi Commander**: Standing on a gantry observation catwalk, breathing, turning, and dynamically pointing with arm and extended index finger toward the orbital booster.
- **Multistage Rocket & Gantry**: Detailed booster core, stage separation ring, aerodynamic grid fins, payload fairing, service arms, and industrial trusses.
- **Real-Time Physics & Particles**: Countdown sequence, volumetric thruster flame cones, smoke plume particles, camera shake, and stratospheric liftoff.
- **Supersonic Shockwave & Warp Boom**: Atmospheric condensation ring expansion, screen flash, synthesized sub-bass sonic boom, and smooth materialization of the hypercar onto the circular turntable platform.
- **Instant Controls**: One-click "Skip to Showroom" and "Replay Launch Intro" options available anytime.

### 2. 🏎️ 360° Interactive 3D Hypercar in the Center
- **Smooth 360° Orbit Navigation**: Drag horizontally and vertically to inspect the car from any angle; mouse wheel/pinch to zoom with constrained bounds.
- **Camera Presets**: Instant camera glide between Orbit 360°, Front Fascia, Side Silhouette, Rear Aerofoil, Cockpit Interior, Wheel Detail, and Top Aero views.
- **Articulated Dihedral Butterfly Doors**: Smooth synchronized upward and outward motorized wing-door articulation (65° angle) with realistic servo acoustics.
- **Active Aerodynamics (DRS Wing)**: Articulated rear wing that deploys for downforce and tilts upward into an airbrake position during heavy braking.
- **Opening Frunk**: Front hood opens upward to reveal the glowing solid-state quantum energy core.
- **Matrix LED Laser Headlights & Underglow**: Dual physical Three.js SpotLights projecting onto the floor, front cyber blade DRL strip, rear continuous OLED taillight ribbon with brake flare, and customizable chassis underglow.

### 3. 🛠️ "Build Your Car" Studio / Configurator
- **Exterior Paint Studio**: 7 bespoke finishes (*Nebula Obsidian*, *Solar Flare Copper*, *Cyberflux Cyan*, *Liquid Quicksilver*, *Apex Stealth Grey*, *Emerald Aurora*, *Hyperion Crimson*) with metallic, matte, and iridescent clearcoat shaders.
- **Forged Wheel Designs**: 4 aerodynamic designs (*21" Aero Turbofan*, *22" V-Spoke Monoblock*, *21" Cyber Hexagonal*, *22" Starburst Hyper-Forged*) with mass savings metrics.
- **Brembo Brake Calipers**: 5 custom caliper finishes (*Acid Green*, *Solar Orange*, *Brembo Red*, *Electric Cyan*, *Silver Chrome*).
- **Interior & Ambient Luminescence**: Perforated vegan leather and Alcantara themes (*Neo Lunar White*, *Obsidian Matrix*, *Tuscan Saffron*, *Crimson Velocity*) with synchronized interior ambient lighting.
- **Performance Packages**: Select between *Apex Dual Drive*, *Quantum Quad-Boost Pack* (+430 HP, 1.78s 0-60), and *Nürburgring Aero Carbon Pack*.
- **Live MSRP & Spec Calculations**: Dynamic calculation of horsepower (up to 1,450 HP), 0-60 mph acceleration, and total pricing with a celebratory confetti reservation confirmation.

### 4. 🔍 Interactive 3D Feature Hotspots
- Spatial pins anchored in 3D world space highlighting:
  1. **Solid-State Hyper-Flux Powertrain** (Quad axial-flux motors, 800V architecture)
  2. **Dihedral Synchro-Helix Aero Doors** (Carbon monocoque construction)
  3. **Photonic Matrix Laser Optics** (600m forward projection beam)
  4. **Generative Forged Magnesium & Carbon Ceramics** (410mm drilled rotors)
  5. **Active Variable Vortex Aero-Blade** (Downforce & DRS airbrake)
  6. **Augmented Holographic Cockpit** (Neural glass HUD & F1 yoke steering)

### 5. ⚡ Test Drive Simulator
- Showroom turntable smoothly transforms into an infinite high-speed neon cyber tunnel with motion speed grid lines.
- Dynamic digital telemetry HUD: speed in MPH, real-time horsepower output, and G-force load.
- Interactive Throttle and Brake pedals with keyboard controls.
- Stationary accuracy: when speed is 0 MPH or when holding the brake at a standstill, the road and wheels remain completely stationary.
- Active taillight brake flaring and dynamic airbrake wing deployment.

### 6. 🔊 Synthesized Web Audio Engine
- Pure procedural Web Audio API sound synthesis with zero external MP3 file dependencies:
  - Rocket engine rumble & brown noise exhaust sweep
  - Supersonic shockwave sub-bass boom
  - Motorized servo whirrs for dihedral doors and aero wing
  - Laser photon boot chirp for headlights
  - Dynamic multi-oscillator hypercar engine acceleration drone
  - UI tactile clicks and sound mute/unmute toggle

---

## 💻 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics Engine**: Three.js (WebGL, physically correct lights, ACESFilmicToneMapping, PCFSoftShadowMap)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`)
- **Icons**: Lucide React
- **Animations & Effects**: Custom RequestAnimationFrame loops, smooth vector lerping, Canvas Confetti
- **Audio**: Web Audio API Sound Synthesizer

---

## 🎮 Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Rotate 360°** | Click and drag on the 3D canvas |
| **Zoom In / Out** | Mouse wheel or pinch gesture |
| **Inspect Feature Hotspot** | Click any glowing cyan sphere on the car |
| **Accelerate (Test Drive)** | Press and hold `W` or `Arrow Up`, or hold the **Throttle** button |
| **Brake (Test Drive)** | Press and hold `S`, `Arrow Down`, or `Spacebar`, or hold the **Brake** button |
| **Toggle Audio** | Click the speaker icon in the top right |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd aether-hyperion-showroom
