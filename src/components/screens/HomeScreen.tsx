import React from 'react';
import { Play, Truck, Sliders, Sparkles, Volume2, Box } from 'lucide-react';
import { HybridVehicleView } from '../vehicles/HybridVehicleView';
import { soundEngine } from '../../services/soundEngine';
import { VisualMode } from '../../types';

interface Props {
  onStartMission: () => void;
  onSelectVehicle: () => void;
  onOpenParentModal: () => void;
  visualMode: VisualMode;
  onToggleVisualMode: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onStartMission,
  onSelectVehicle,
  onOpenParentModal,
  visualMode,
  onToggleVisualMode,
}) => {
  const handleHonk = () => {
    soundEngine.playHorn();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-4 px-4 md:px-8 max-w-6xl mx-auto w-full select-none">
      {/* Top Banner / Heading */}
      <div className="text-center space-y-1 mt-1">
        <div className="inline-flex items-center gap-2 bg-amber-200/80 border-2 border-amber-400 text-amber-950 px-4 py-1 rounded-full text-xs md:text-sm font-black shadow-sm tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Bermain Bersama di TV &bull; Stimulasi Wicara & Gerak Fisik Usia 2–3 Tahun</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black font-['Fredoka'] text-amber-950 tracking-tight drop-shadow-sm">
          Truk Bicara! <span className="text-2xl md:text-3xl font-black text-amber-700">3D</span>
        </h1>
        <p className="text-sm md:text-lg text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
          Ubah kebiasaan menonton video truk menjadi interaksi bicara hangat dan permainan fisik nyata bersama orang tua di rumah.
        </p>
      </div>

      {/* Hero Vehicle: 3D Three.js or 2D Cartoon SVG */}
      <div className="relative my-2 w-full max-w-2xl flex flex-col items-center">
        <HybridVehicleView
          vehicleId="truk-kuning"
          visualMode={visualMode}
          actionState="idle"
          className="w-full h-64 md:h-80"
          onToggleVisualMode={onToggleVisualMode}
        />
      </div>

      {/* Main Action Buttons (TV-friendly large touch targets) */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
        {/* MULAI MISI (Primary Big Button) */}
        <button
          onClick={() => {
            soundEngine.playHorn();
            onStartMission();
          }}
          className="w-full sm:flex-1 py-4 md:py-5 px-6 md:px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xl md:text-2xl font-['Fredoka'] border-4 border-amber-600/70 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Mulai Misi Permainan (Spasi / Enter)"
        >
          <Play className="w-7 h-7 fill-current text-amber-950" />
          <span>MULAI MISI</span>
        </button>

        {/* PILIH TRUK */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onSelectVehicle();
          }}
          className="w-full sm:w-auto py-4 md:py-5 px-6 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-black text-base md:text-lg border-4 border-slate-300 hover:border-amber-400 shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Truck className="w-5 h-5 text-amber-600" />
          <span>PILIH TRUK</span>
        </button>

        {/* UNTUK ORANG TUA */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onOpenParentModal();
          }}
          className="w-full sm:w-auto py-4 md:py-5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-black text-sm md:text-base border-4 border-slate-700 shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Sliders className="w-5 h-5" />
          <span>ORANG TUA</span>
        </button>
      </div>

      {/* TV Friendly Keyboard Hint Bar */}
      <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl px-4 py-1.5 text-xs font-semibold text-amber-950 flex flex-wrap items-center justify-center gap-3">
        <span>Navigasi TV di Sofa:</span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [Spasi / Enter] Mulai
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [Esc] Orang Tua
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [M] Mute
        </span>
      </div>
    </div>
  );
};
