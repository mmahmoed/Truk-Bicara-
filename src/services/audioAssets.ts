/**
 * Procedural Audio Asset Generator for Truk Bicara!
 * Generates valid standalone 16-bit PCM RIFF WAV Data-URIs:
 * - Real Truck Horn ("Bip-bip!" air horn)
 * - Real Diesel Engine ("Brum-brum!" combustion rumble)
 * - Dump Bed Hydraulic Lift & Rock Clatter ("Krrrk... Bruk!")
 * - Excavator Hydraulic Scoop
 * - Cement Mixer Drum Rotation
 * 
 * 100% Offline, Zero external 404s, works reliably in all HTML5 Audio and Web Audio players!
 */

// Helper to convert Float32 audio samples (-1 to 1) into a standard WAV base64 data-uri
function encodeWav(samples: Float32Array, sampleRate: number): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF Chunk Descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM samples (16-bit signed integer)
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  // Base64 encode
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return 'data:audio/wav;base64,' + btoa(binary);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// 1. Truck Horn ("Bip-bip!" authentic dual-tone air horn)
export function createTruckHornWav(): string {
  const sampleRate = 22050;
  const duration = 0.65;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Two beeps: beep 1 (0 to 0.22s), beep 2 (0.32 to 0.54s)
  const f1 = 370; // F#4
  const f2 = 466; // A#4
  const f3 = 740; // Harmonic overtone

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let env = 0;

    // First beep
    if (t >= 0.02 && t < 0.22) {
      const localT = t - 0.02;
      env = Math.sin((localT / 0.2) * Math.PI);
    }
    // Second beep
    else if (t >= 0.32 && t < 0.54) {
      const localT = t - 0.32;
      env = Math.sin((localT / 0.22) * Math.PI);
    }

    if (env > 0) {
      const wave =
        0.5 * Math.sin(2 * Math.PI * f1 * t) +
        0.4 * Math.sin(2 * Math.PI * f2 * t) +
        0.15 * Math.sin(2 * Math.PI * f3 * t);
      samples[i] = wave * env * 0.75;
    }
  }

  return encodeWav(samples, sampleRate);
}

// 2. Diesel Engine ("Brum-brum-brum" rhythmic combustion rumble)
export function createTruckEngineWav(): string {
  const sampleRate = 22050;
  const duration = 1.4;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  // Cylinder firing frequency (~16 Hz idle pulse with 65 Hz harmonic bass)
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Envelope: ramps up, revs slightly, then rumbles
    const masterEnv = Math.min(1, t * 8) * Math.max(0, 1 - (t - 0.9) / 0.5);

    // Fundamental diesel rumble (62-85 Hz)
    const baseFreq = 65 + Math.sin(t * 5) * 12;
    const cylinderPulse = Math.pow(Math.max(0, Math.sin(2 * Math.PI * 16 * t)), 3);
    const subBass = Math.sin(2 * Math.PI * baseFreq * t);
    const exhaustOvertones =
      0.3 * Math.sin(2 * Math.PI * baseFreq * 2 * t) +
      0.2 * Math.sin(2 * Math.PI * baseFreq * 3 * t);

    // Subtle noise representing gravel/combustion air
    const noise = (Math.random() * 2 - 1) * 0.12;

    const signal = (subBass * 0.6 + exhaustOvertones + cylinderPulse * 0.5 + noise) * masterEnv;
    samples[i] = Math.max(-1, Math.min(1, signal * 0.7));
  }

  return encodeWav(samples, sampleRate);
}

// 3. Dump Bed Opening & Rock Clatter ("Krrr... Bruk!")
export function createDumpBedWav(): string {
  const sampleRate = 22050;
  const duration = 1.2;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let s = 0;

    // 1. Hydraulic lift whine (0.0 to 0.5s)
    if (t < 0.5) {
      const hydEnv = Math.sin((t / 0.5) * Math.PI);
      const hydFreq = 180 + t * 240;
      s += Math.sin(2 * Math.PI * hydFreq * t) * 0.35 * hydEnv;
    }

    // 2. Heavy stones dropping and bouncing (0.4 to 1.1s)
    if (t >= 0.4 && t < 1.1) {
      const clatterTimes = [0.42, 0.52, 0.63, 0.76, 0.88];
      clatterTimes.forEach((ct, idx) => {
        const dt = t - ct;
        if (dt >= 0 && dt < 0.12) {
          const stoneEnv = Math.exp(-dt * 30);
          const stoneTone = Math.sin(2 * Math.PI * (110 - idx * 10) * dt);
          const impact = (Math.random() * 2 - 1) * 0.4;
          s += (stoneTone * 0.5 + impact) * stoneEnv * 0.6;
        }
      });
    }

    samples[i] = Math.max(-1, Math.min(1, s));
  }

  return encodeWav(samples, sampleRate);
}

// 4. Excavator Hydraulic Digging Scoop
export function createExcavatorDigWav(): string {
  const sampleRate = 22050;
  const duration = 0.95;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin((t / 0.95) * Math.PI);
    // Hydraulic pressure hiss + scoop
    const freq = 140 + Math.sin(t * 4) * 80;
    const hydraulicTone = Math.sin(2 * Math.PI * freq * t) * 0.4;
    const gravelFriction = (Math.random() * 2 - 1) * 0.25;

    samples[i] = (hydraulicTone + gravelFriction) * env * 0.75;
  }

  return encodeWav(samples, sampleRate);
}

// 5. Cement Mixer Drum Swirl
export function createCementMixerWav(): string {
  const sampleRate = 22050;
  const duration = 1.1;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.sin((t / 1.1) * Math.PI);
    // 3 rotations per second swirl
    const swirl = Math.sin(2 * Math.PI * 3.5 * t);
    const baseFreq = 120 + swirl * 35;
    const tone = Math.sin(2 * Math.PI * baseFreq * t) * 0.45;
    const slosh = (Math.random() * 2 - 1) * 0.15 * Math.max(0, swirl);

    samples[i] = (tone + slosh) * env * 0.7;
  }

  return encodeWav(samples, sampleRate);
}

// Pre-generated static assets (Lazy initialized on first access)
let _hornWav: string | null = null;
let _engineWav: string | null = null;
let _dumpBedWav: string | null = null;
let _excavatorWav: string | null = null;
let _mixerWav: string | null = null;

export const SOUND_ASSETS = {
  getTruckHorn: () => {
    if (!_hornWav) _hornWav = createTruckHornWav();
    return _hornWav;
  },
  getTruckEngine: () => {
    if (!_engineWav) _engineWav = createTruckEngineWav();
    return _engineWav;
  },
  getDumpBed: () => {
    if (!_dumpBedWav) _dumpBedWav = createDumpBedWav();
    return _dumpBedWav;
  },
  getExcavatorDig: () => {
    if (!_excavatorWav) _excavatorWav = createExcavatorDigWav();
    return _excavatorWav;
  },
  getCementMixer: () => {
    if (!_mixerWav) _mixerWav = createCementMixerWav();
    return _mixerWav;
  },
};
