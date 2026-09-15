// Web Audio API Ambient Sound Generator and UI Sound Effects (100% Offline, Zero Assets)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentAmbientNode: { stop: () => void } | null = null;
  private currentAmbientType: string = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play pleasant chime on Pomodoro completion or achievement
  playChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Harmonic chords: E5, G#5, B5, E6
      const notes = [659.25, 830.61, 987.77, 1318.51];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.12);

        gain.gain.setValueAtTime(0, now + index * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.12 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.12);
        osc.stop(now + index * 0.12 + 2.0);
      });
    } catch (e) {
      console.warn('Audio chime playback blocked or unavailable', e);
    }
  }

  // Soft click feedback
  playClick() {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Ambient sound synthesizer
  playAmbient(type: 'rain' | 'lo-fi' | 'white-noise' | 'silence', volume: number = 0.5) {
    this.stopAmbient();
    if (type === 'silence') {
      this.currentAmbientType = 'silence';
      return;
    }

    try {
      const ctx = this.initContext();
      this.currentAmbientType = type;

      if (type === 'rain' || type === 'white-noise') {
        // Generate buffer with noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink/Brownish filtered noise for rain sound
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Gain compensation
          } else {
            // Soft white noise
            output[i] = white * 0.15;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 850 : 1200;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        whiteNoise.start();

        this.currentAmbientNode = {
          stop: () => {
            try {
              whiteNoise.stop();
              whiteNoise.disconnect();
            } catch {
              // ignore
            }
          }
        };
      } else if (type === 'lo-fi') {
        // Generate warm binaural drone chord (F# Minor 9th warm synth drone)
        const frequencies = [92.5, 138.59, 185.0, 277.18]; // F#2, C#3, F#3, C#4
        const oscs: OscillatorNode[] = [];
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;

        frequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.value = freq + (Math.random() * 0.4 - 0.2); // subtle detune
          osc.connect(filter);
          osc.start();
          oscs.push(osc);
        });

        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        this.currentAmbientNode = {
          stop: () => {
            oscs.forEach(o => {
              try {
                o.stop();
                o.disconnect();
              } catch {
                // ignore
              }
            });
          }
        };
      }
    } catch (e) {
      console.warn('Ambient sound engine error', e);
    }
  }

  stopAmbient() {
    if (this.currentAmbientNode) {
      try {
        this.currentAmbientNode.stop();
      } catch {
        // ignore
      }
      this.currentAmbientNode = null;
    }
    this.currentAmbientType = 'none';
  }

  getCurrentAmbientType() {
    return this.currentAmbientType;
  }
}

export const soundEngine = new SoundEngine();
