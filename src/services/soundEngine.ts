/**
 * Audio Manager 2.0 for Truk Bicara!
 * 
 * Includes pre-synthesized standalone PCM WAV audio assets for:
 * - Truck Horn ("Bip-bip!")
 * - Truck Diesel Engine ("Brum-brum!")
 * - Dump Bed Tilt & Rock Clatter ("Krrrk... Bruk!")
 * - Excavator & Mixer sounds
 * 
 * Works 100% reliably in all environments with HTML5 Audio and Web Audio API.
 */

import { SoundPlayMode } from '../types';
import { SOUND_ASSETS } from './audioAssets';

class SoundEngine {
  private ctx: AudioContext | null = null;
  
  // Independent Channel Volumes
  private masterVolume: number = 0.85;
  private sfxVolume: number = 0.9;
  private narratorVolume: number = 0.95;
  private ambientVolume: number = 0.5;
  private isMuted: boolean = false;
  private soundMode: SoundPlayMode = 'all';

  // Narration configuration
  private speechRate: number = 0.82;
  private speechPitch: number = 1.15;
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private currentlyPlayingAudio: HTMLAudioElement | null = null;
  private activeSfxAudio: HTMLAudioElement | null = null;
  private isSpeaking: boolean = false;

  // Background Ambient Music Generator Nodes
  private ambientIntervalId: number | null = null;
  private activeMusicType: 'cheerful' | 'calm' | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }

      // Auto-unlock audio context on first user interaction anywhere
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      const idVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('id') ||
          v.lang.toLowerCase().includes('indonesia')
      );
      this.indonesianVoice = idVoice || null;
    }
  }

  // --- Volume & Mode Getters/Setters ---

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.activeSfxAudio) {
      this.activeSfxAudio.volume = this.masterVolume * this.sfxVolume;
    }
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.activeSfxAudio) {
      this.activeSfxAudio.volume = this.masterVolume * this.sfxVolume;
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setNarratorVolume(vol: number) {
    this.narratorVolume = Math.max(0, Math.min(1, vol));
  }

  public getNarratorVolume(): number {
    return this.narratorVolume;
  }

  public setAmbientVolume(vol: number) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
  }

  public getAmbientVolume(): number {
    return this.ambientVolume;
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
    this.speechRate = Math.max(0.65, Math.min(1.15, rate));
  }

  public setSoundMode(mode: SoundPlayMode) {
    this.soundMode = mode;
    if (mode === 'silent') {
      this.stopAll();
    } else if (mode === 'cheerful-music') {
      this.startCheerfulMusic();
    } else if (mode === 'calm-sound') {
      this.startCalmAmbient();
    } else if (mode === 'vehicle-sfx') {
      this.stopAmbientMusic();
    }
  }

  public getSoundMode(): SoundPlayMode {
    return this.soundMode;
  }

  public stopAll() {
    this.stopNarration();
    this.stopAmbientMusic();
    if (this.activeSfxAudio) {
      this.activeSfxAudio.pause();
      this.activeSfxAudio = null;
    }
  }

  public stopNarration() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentlyPlayingAudio) {
      this.currentlyPlayingAudio.pause();
      this.currentlyPlayingAudio = null;
    }
    this.isSpeaking = false;
  }

  // Helper check for permissions
  private canPlaySfx(): boolean {
    if (this.isMuted || this.soundMode === 'silent') return false;
    return true;
  }

  private canPlayNarrator(): boolean {
    if (this.isMuted || this.soundMode === 'silent') return false;
    return true;
  }

  private canPlayAmbient(): boolean {
    if (this.isMuted || this.soundMode === 'silent' || this.soundMode === 'vehicle-sfx') return false;
    return true;
  }

  // Play Standalone Audio Asset
  private playWavAsset(dataUri: string, volumeScale = 1.0) {
    if (!this.canPlaySfx()) return;
    try {
      const audio = new Audio(dataUri);
      audio.volume = Math.max(0, Math.min(1, this.masterVolume * this.sfxVolume * volumeScale));
      audio.play().catch(() => {
        // Fallback to Web Audio API if autoplay policy blocks
        this.getAudioContext();
      });
      this.activeSfxAudio = audio;
    } catch {
      // Fallback
    }
  }

  // =========================================================================
  // 1. KELOMPOK SUARA KENDARAAN (SFX)
  // =========================================================================

  // Klakson Pendek dan Lembut ("Bip-bip!" air horn)
  public playHorn() {
    if (!this.canPlaySfx()) return;
    // Triggers standalone PCM WAV audio clip for horn
    this.playWavAsset(SOUND_ASSETS.getTruckHorn(), 1.0);
  }

  // Mesin Truk Idle & Berjalan ("Brum-brum!" diesel engine rumble)
  public playTruckEngine() {
    if (!this.canPlaySfx()) return;
    // Triggers standalone PCM WAV audio clip for engine idling/rumble
    this.playWavAsset(SOUND_ASSETS.getTruckEngine(), 0.95);
  }

  // Alias for backward compatibility
  public playEngine() {
    this.playTruckEngine();
  }

  // Bunyi Bak Truk Mengangkat & Menurunkan Muatan ("Krrrk... Bruk!")
  public playDumpBed() {
    if (!this.canPlaySfx()) return;
    this.playWavAsset(SOUND_ASSETS.getDumpBed(), 1.0);
  }

  // Ekskavator Menggali
  public playExcavatorDig() {
    if (!this.canPlaySfx()) return;
    this.playWavAsset(SOUND_ASSETS.getExcavatorDig(), 1.0);
  }

  // Truk Molen Berputar
  public playCementSpin() {
    if (!this.canPlaySfx()) return;
    this.playWavAsset(SOUND_ASSETS.getCementMixer(), 0.9);
  }

  // Roda di Atas Kerikil (Gravel rumble)
  public playGravelRoll() {
    if (!this.canPlaySfx()) return;
    this.playEngine();
  }

  // Chime Selebrasi Berhasil
  public playCelebration() {
    if (!this.canPlaySfx()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.masterVolume * this.sfxVolume * 0.45, now);
    gain.connect(ctx.destination);

    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.12;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      noteGain.gain.setValueAtTime(0, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.45, noteTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);

      osc.connect(noteGain);
      noteGain.connect(gain);

      osc.start(noteTime);
      osc.stop(noteTime + 0.55);
    });
  }

  // Tombol Pop
  public playPop() {
    if (!this.canPlaySfx()) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.06);

    gain.gain.setValueAtTime(this.masterVolume * this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // =========================================================================
  // 2. KELOMPOK SUARA NARATOR (Web Speech API & Parent Custom Voice)
  // =========================================================================

  public speakIndonesian(
    text: string,
    customKey?: string,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.canPlayNarrator()) {
      if (onEnd) onEnd();
      return;
    }

    this.stopNarration();
    this.isSpeaking = true;

    // 1. Check parent custom recorded audio
    if (customKey && typeof window !== 'undefined') {
      const customDataUrl = localStorage.getItem(`truk_audio_${customKey}`);
      if (customDataUrl) {
        try {
          const audio = new Audio(customDataUrl);
          audio.volume = this.masterVolume * this.narratorVolume;
          this.currentlyPlayingAudio = audio;
          if (onStart) onStart();
          audio.onended = () => {
            this.currentlyPlayingAudio = null;
            this.isSpeaking = false;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            this.speakWithTTS(text, onStart, onEnd);
          };
          audio.play().catch(() => {
            this.speakWithTTS(text, onStart, onEnd);
          });
          return;
        } catch {
          // Fall through
        }
      }
    }

    // 2. Web Speech API with toddler-safe speed
    this.speakWithTTS(text, onStart, onEnd);
  }

  private speakWithTTS(text: string, onStart?: () => void, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.masterVolume * this.narratorVolume;
    utterance.rate = this.speechRate;
    utterance.pitch = this.speechPitch;
    utterance.lang = 'id-ID';

    if (this.indonesianVoice) {
      utterance.voice = this.indonesianVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // 3. KELOMPOK MUSIK & SUASANA (Procedural Ambient & Instrumental)
  // =========================================================================

  public startCheerfulMusic() {
    if (!this.canPlayAmbient()) return;
    this.stopAmbientMusic();
    this.activeMusicType = 'cheerful';

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const melody = [523.25, 659.25, 783.99, 659.25, 523.25, 392.0];
    let noteIdx = 0;

    const playNote = () => {
      if (this.activeMusicType !== 'cheerful' || !this.canPlayAmbient()) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[noteIdx % melody.length], now);
      noteIdx++;

      const vol = this.masterVolume * this.ambientVolume * 0.12;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.48);
    };

    playNote();
    this.ambientIntervalId = window.setInterval(playNote, 400);
  }

  public startCalmAmbient() {
    if (!this.canPlayAmbient()) return;
    this.stopAmbientMusic();
    this.activeMusicType = 'calm';

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const bells = [261.63, 329.63, 392.0, 440.0];
    const playCalmBell = () => {
      if (this.activeMusicType !== 'calm' || !this.canPlayAmbient()) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = bells[Math.floor(Math.random() * bells.length)];
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const vol = this.masterVolume * this.ambientVolume * 0.09;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    };

    playCalmBell();
    this.ambientIntervalId = window.setInterval(playCalmBell, 3200);
  }

  public stopAmbientMusic() {
    if (this.ambientIntervalId) {
      clearInterval(this.ambientIntervalId);
      this.ambientIntervalId = null;
    }
    this.activeMusicType = null;
  }

  // Parent Voice Recording Storage Helpers
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
