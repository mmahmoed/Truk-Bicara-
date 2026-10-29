import React from 'react';
import { Play, Truck, Sliders, Sparkles, Volume2 } from 'lucide-react';
import { YellowDumpTruck } from '../vehicles/YellowDumpTruck';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  onStartMission: () => void;
  onSelectVehicle: () => void;
  onOpenParentModal: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  onStartMission,
  onSelectVehicle,
  onOpenParentModal,
}) => {
  const handleHonk = () => {
    soundEngine.playHorn();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-6 px-4 md:px-8 max-w-6xl mx-auto w-full select-none">
      {/* Top Banner / Heading */}
      <div className="text-center space-y-2 mt-2">
        <div className="inline-flex items-center gap-2 bg-amber-200/80 border-2 border-amber-400 text-amber-950 px-4 py-1.5 rounded-full text-xs md:text-sm font-black shadow-sm tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Bermain Bersama di TV &bull; Stimulasi Wicara Usia 2–3 Tahun</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black font-['Fredoka'] text-amber-950 tracking-tight drop-shadow-sm">
          Truk Bicara!
        </h1>
        <p className="text-base md:text-xl text-slate-700 font-bold max-w-2xl mx-auto leading-relaxed">
          Ubah kebiasaan menonton video truk menjadi interaksi bicara hangat dan permainan fisik nyata bersama orang tua di rumah.
        </p>
      </div>

      {/* Hero Vehicle Illustration with Interactive Clickable Honk */}
      <div className="relative my-4 w-full max-w-xl flex flex-col items-center">
        <div
          onClick={handleHonk}
          className="cursor-pointer group transform hover:scale-102 transition-transform active:scale-98"
          title="Klik truk untuk membunyikan klakson!"
        >
          <YellowDumpTruck actionState="idle" isAnimated={false} className="w-full max-w-lg" />
        </div>

        {/* Small fun prompt for toddler */}
        <button
          onClick={handleHonk}
          className="mt-1 inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 px-4 py-1.5 rounded-full text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>Bip-bip! Tekan untuk Klakson</span>
        </button>
      </div>

      {/* Main Action Buttons (TV-friendly large touch targets) */}
      <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        {/* MULAI MISI (Primary Big Button) */}
        <button
          onClick={() => {
            soundEngine.playHorn();
            onStartMission();
          }}
          className="w-full sm:flex-1 py-5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-2xl md:text-3xl font-['Fredoka'] border-4 border-amber-600/70 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Mulai Misi Permainan (Spasi / Enter)"
        >
          <Play className="w-8 h-8 fill-current text-amber-950" />
          <span>MULAI MISI</span>
        </button>

        {/* PILIH TRUK */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onSelectVehicle();
          }}
          className="w-full sm:w-auto py-5 px-7 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-black text-lg md:text-xl border-4 border-slate-300 hover:border-amber-400 shadow-md flex items-center justify-center gap-3 cursor-pointer transform hover:scale-102 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Truck className="w-6 h-6 text-amber-600" />
          <span>PILIH TRUK</span>
        </button>

        {/* UNTUK ORANG TUA */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onOpenParentModal();
          }}
          className="w-full sm:w-auto py-5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-black text-base md:text-lg border-4 border-slate-700 shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Sliders className="w-5 h-5" />
          <span>UNTUK ORANG TUA</span>
        </button>
      </div>

      {/* TV Friendly Keyboard Hint Bar */}
      <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl px-4 py-2 text-xs font-semibold text-amber-950 flex flex-wrap items-center justify-center gap-4">
        <span>Gunakan Mouse atau Keyboard di Sofa:</span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [Spasi / Enter] Mulai
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [Esc] Panduan Orang Tua
        </span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">
          [M] Suara On/Off
        </span>
      </div>
    </div>
  );
};
