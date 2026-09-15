// Web Audio API Ambient Sound Synthesizer & Audio Effects (100% Offline, Zero Assets)

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.currentAmbient = null;
    this.currentType = 'silence';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playChime() {
    try {
      const ctx = this.init();
      const now = ctx.currentTime;
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0, now + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 2.0);
      });
    } catch {
      // Audio playback blocked
    }
  }

  playClick() {
    try {
      const ctx = this.init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  playAmbient(type, volume = 0.4) {
    this.stopAmbient();
    this.currentType = type;
    if (type === 'silence') return;

    try {
      const ctx = this.init();

      if (type === 'rain' || type === 'white-noise') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            output[i] = white * 0.15;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 850 : 1200;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

        source.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        source.start();
        this.currentAmbient = {
          stop: () => {
            try { source.stop(); source.disconnect(); } catch {}
          }
        };
      } else if (type === 'lo-fi') {
        const freqs = [92.5, 138.59, 185.0, 277.18]; // F# Minor 9th chord
        const oscs = [];
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;

        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.value = f + (Math.random() * 0.4 - 0.2);
          osc.connect(filter);
          osc.start();
          oscs.push(osc);
        });

        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        this.currentAmbient = {
          stop: () => {
            oscs.forEach(o => {
              try { o.stop(); o.disconnect(); } catch {}
            });
          }
        };
      }
    } catch (e) {
      console.warn('Audio synthesizer error', e);
    }
  }

  stopAmbient() {
    if (this.currentAmbient) {
      try { this.currentAmbient.stop(); } catch {}
      this.currentAmbient = null;
    }
    this.currentType = 'silence';
  }
}

export const soundSynth = new SoundSynthesizer();
