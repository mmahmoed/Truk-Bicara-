/**
 * Sound Engine for Truk Bicara!
 * - Web Audio API for offline procedural sound effects (Horn, Engine, Hydraulic, Rocks Dump, Chime)
 * - Web Speech API (Indonesian id-ID) with toddler-stimulation pacing
 * - Custom Parent Voice Recording support with offline localStorage persistence
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.85;
  private isMuted: boolean = false;
  private speechRate: number = 0.82; // Natural, slow toddler pace
  private speechPitch: number = 1.15; // Warm, gentle pitch
  private voicesLoaded: boolean = false;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private currentlyPlayingAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private getAudioContext(): AudioContext | null {
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

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      this.voicesLoaded = true;
      // Search for Indonesian voice
      const idVoice = voices.find(
        (v) => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesia')
      );
      this.indonesianVoice = idVoice || null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.2, rate));
  }

  public stopAll() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentlyPlayingAudio) {
      this.currentlyPlayingAudio.pause();
      this.currentlyPlayingAudio = null;
    }
  }

  // Procedural Sound: Friendly Truck Horn ("Bip-bip!")
  public playHorn() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // Two short horn beeps
    [0, 0.22].forEach((offset) => {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';

      // Friendly dual tone (~F4 and A4)
      osc1.frequency.setValueAtTime(349.23, now + offset);
      osc2.frequency.setValueAtTime(440.0, now + offset);

      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.5, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(masterGain);

      osc1.start(now + offset);
      osc2.start(now + offset);
      osc1.stop(now + offset + 0.2);
      osc2.stop(now + offset + 0.2);
    });
  }

  // Procedural Sound: Diesel Engine Rumble ("Brum-brum!")
  public playEngine() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.4, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.4);
    osc.frequency.linearRampToValueAtTime(60, now + 0.9);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(14, now);
    lfoGain.gain.setValueAtTime(18, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.6, now + 0.1);
    env.gain.exponentialRampToValueAtTime(0.01, now + 1.1);

    osc.connect(filter);
    filter.connect(env);
    env.connect(masterGain);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 1.15);
    lfo.stop(now + 1.15);
  }

  // Procedural Sound: Hydraulic Excavator Digging Lift
  public playHydraulic() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, now);
    masterGain.connect(ctx.destination);

    // Rising sine with soft resonant tone
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.6);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.75);
  }

  // Procedural Sound: Cement Mixer Rotating Swirl
  public playCementSpin() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.35, now);
    masterGain.connect(ctx.destination);

    // Swirling frequency modulated tone
    const osc = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4, now); // 4 rotations per second
    lfoGain.gain.setValueAtTime(35, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    lfo.start(now);
    osc.stop(now + 0.95);
    lfo.stop(now + 0.95);
  }

  // Procedural Sound: Cargo Dump / Rocks clattering
  public playCargoDump() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // 4 successive wooden block clatters
    const delays = [0, 0.08, 0.17, 0.28, 0.38];
    const freqs = [120, 160, 95, 140, 80];

    delays.forEach((delay, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqs[idx] || 110, now + delay);
      osc.frequency.exponentialRampToValueAtTime(45, now + delay + 0.12);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.6, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.14);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    });
  }

  // Procedural Sound: Joyful Celebration Chime (pentatonic major arpeggio)
  public playCelebration() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.45, now);
    masterGain.connect(ctx.destination);

    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.5, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.55);
    });
  }

  // Procedural Sound: Friendly Button Pop
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Play Indonesian Speech Synthesis or Custom Voice Recording
  public speakIndonesian(
    text: string,
    customKey?: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    // 1. Check if a custom parent recording exists for this key in localStorage
    if (customKey && typeof window !== 'undefined') {
      const customDataUrl = localStorage.getItem(`truk_audio_${customKey}`);
      if (customDataUrl) {
        try {
          if (this.currentlyPlayingAudio) {
            this.currentlyPlayingAudio.pause();
          }
          const audio = new Audio(customDataUrl);
          audio.volume = this.volume;
          this.currentlyPlayingAudio = audio;
          if (onStart) onStart();
          audio.onended = () => {
            this.currentlyPlayingAudio = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            // Fall back to TTS
            this.speakWithTTS(text, onStart, onEnd);
          };
          audio.play().catch(() => {
            this.speakWithTTS(text, onStart, onEnd);
          });
          return;
        } catch {
          // Fall back to TTS
        }
      }
    }

    // 2. Fall back to standard Web Speech API
    this.speakWithTTS(text, onStart, onEnd);
  }

  private speakWithTTS(text: string, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.volume;
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;
    utterance.lang = 'id-ID';

    if (this.indonesianVoice) {
      utterance.voice = this.indonesianVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  // Helper for parents to save custom voice recordings locally
  public saveCustomRecording(key: string, dataUrl: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`truk_audio_${key}`, dataUrl);
      } catch (err) {
        console.warn('Could not save recording to localStorage:', err);
      }
    }
  }

  public getCustomRecording(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`truk_audio_${key}`);
  }

  public removeCustomRecording(key: string) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`truk_audio_${key}`);
  }
}

export const soundEngine = new SoundEngine();
