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
  volume: number; // 0 to 1
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
}
