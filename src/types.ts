export type VehicleId = 'truk-kuning' | 'truk-merah' | 'ekskavator' | 'truk-molen';

export interface Vehicle {
  id: VehicleId;
  name: string;
  role: string;
  colorName: string;
  soundName: string;
  shortDesc: string;
  accentColor: string;
  badgeBg: string;
}

export type ScreenType =
  | 'home'
  | 'select-vehicle'
  | 'mission-intro'
  | 'physical-play'
  | 'mission-complete'
  | 'session-end';

export type MissionPhase =
  | 'intro'
  | 'instruction'
  | 'physical-action'
  | 'completion'
  | 'finished';

export type SoundPlayMode =
  | 'all'             // Suara Lengkap (Kendaraan + Narator + Musik Lembut)
  | 'vehicle-sfx'     // Hanya Suara Kendaraan
  | 'cheerful-music'  // Musik Ceria Instrumental
  | 'calm-sound'      // Suara Tenang (Alam & Nada Lembut)
  | 'silent';         // Mode Senyap

export type VisualMode = '3d' | '2d';
export type GraphicsQuality = 'high' | 'low';

export interface TargetWord {
  word: string;
  syllables?: string; // e.g. "ba-tu"
  actionPrompt: string; // e.g. "Ajak anak menunjuk atau mengambil benda"
}

export interface Mission {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  vehicleId: VehicleId;
  targetWords: TargetWord[];
  introSpeech: string;
  physicalInstruction: string;
  physicalPlayProps: string; // e.g. "Balok mainan / bantal / kardus kecil"
  parentTips: string[];
  exampleDialogue: {
    parent: string;
    childResponse: string;
    parentFollowUp: string;
  };
  completionSpeech: string;
  nextActivityIdea: string;
}

export interface AudioSettings {
  volume: number; // Master volume 0 to 1
  sfxVolume: number; // Suara kendaraan 0 to 1
  narratorVolume: number; // Suara narator 0 to 1
  ambientVolume: number; // Musik & suasana 0 to 1
  soundMode: SoundPlayMode;
  isMuted: boolean;
  speechRate: number; // 0.7 to 1.1
  soundEffects: boolean;
  voiceGenderPreference?: 'female' | 'male' | 'default';
}

export interface ParentSettings {
  tvSafeMargin: boolean;
  highContrast: boolean;
  sessionLimitMinutes: number; // default 5 minutes
  autoCalmAfterInstruction: boolean; // quiet the screen after 15s
  visualMode: VisualMode;
  graphicsQuality: GraphicsQuality;
}
