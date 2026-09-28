/**
 * High-fidelity Web Audio API Sound Synthesizer
 * Zero external audio file dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private rocketNoiseNode: AudioNode | null = null;
  private testDriveOsc: OscillatorNode | null = null;
  private testDriveGain: GainNode | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft tactile UI click
  playClick() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio error catch
    }
  }

  // Headlight laser photon activation
  playPhotonHeadlights(on: boolean) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      if (on) {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      } else {
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      }
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  // Dihedral car door motorized servo
  playDoorServo(open: boolean) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // High frequency servo whirr + lower mechanical clack
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      if (open) {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(560, now + 0.35);
      } else {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(280, now + 0.35);
      }
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      // Low pass filter to make it sound mechanical
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  // Color / finish change metallic pulse
  playChop() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Rocket countdown beep
  playCountdownBeep(highPitch = false) {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(highPitch ? 1400 : 700, now);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (highPitch ? 0.35 : 0.15));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (highPitch ? 0.36 : 0.16));
    } catch {}
  }

  // Rocket liftoff rumble
  startRocketRumble() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Buffer noise for burning exhaust
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.03 * white) / 1.03; // brown noise
        lastOut = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(600, ctx.currentTime + 3.0);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      this.rocketNoiseNode = gain;
    } catch {}
  }

  // Stop rocket rumble
  stopRocketRumble() {
    if (this.rocketNoiseNode && this.ctx) {
      try {
        const gain = this.rocketNoiseNode as GainNode;
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {}
      this.rocketNoiseNode = null;
    }
  }

  // Supersonic Boom / Car Entrance
  playSonicBoom() {
    if (!this.enabled) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Sub oscillator
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.7);

      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      subOsc.stop(now + 1.2);

      // Shimmer chord for car reveal
      const shimmer = ctx.createOscillator();
      const shimGain = ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(587.33, now + 0.2); // D5
      shimmer.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      shimGain.gain.setValueAtTime(0.001, now);
      shimGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
      shimGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      shimmer.connect(shimGain);
      shimGain.connect(ctx.destination);
      shimmer.start(now + 0.2);
      shimmer.stop(now + 1.4);
    } catch {}
  }

  // Test drive engine drone and rev
  updateEngineSound(speedRatio: number, isAccelerating: boolean) {
    if (!this.enabled) {
      this.stopEngineSound();
      return;
    }
    const ctx = this.getContext();
    if (!ctx) return;

    if (speedRatio <= 0.005 && !isAccelerating) {
      // Vehicle is completely stopped and not accelerating: silence engine audio
      if (this.testDriveGain) {
        this.testDriveGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06);
      }
      return;
    }

    try {
      if (!this.testDriveOsc) {
        this.testDriveOsc = ctx.createOscillator();
        this.testDriveGain = ctx.createGain();
        this.testDriveOsc.type = 'sawtooth';
        this.testDriveGain.gain.setValueAtTime(0.01, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        this.testDriveOsc.connect(filter);
        filter.connect(this.testDriveGain);
        this.testDriveGain.connect(ctx.destination);
        this.testDriveOsc.start();
      }

      const targetFreq = 75 + speedRatio * 420 + (isAccelerating ? 40 : 0);
      const targetGain = 0.02 + speedRatio * 0.08 + (isAccelerating ? 0.03 : 0);

      this.testDriveOsc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.08);
      if (this.testDriveGain) {
        this.testDriveGain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
      }
    } catch {}
  }

  stopEngineSound() {
    if (this.testDriveOsc) {
      try {
        this.testDriveOsc.stop();
        this.testDriveOsc.disconnect();
      } catch {}
      this.testDriveOsc = null;
      this.testDriveGain = null;
    }
  }
}

export const sound = new SoundEngine();
