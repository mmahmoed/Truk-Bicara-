import React from 'react';
import { Sun, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface Props {
  isOpen: boolean;
  onWakeScreen: () => void;
  targetWord?: string;
  physicalPrompt?: string;
}

export const CalmScreenOverlay: React.FC<Props> = ({
  isOpen,
  onWakeScreen,
  targetWord,
  physicalPrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md text-amber-100 flex flex-col items-center justify-center p-6 text-center select-none animate-fadeIn">
      <div className="max-w-xl flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-amber-500/20 border-4 border-amber-400/40 flex items-center justify-center animate-pulse">
          <Sparkles className="w-12 h-12 text-amber-300" />
        </div>

        <div className="space-y-3">
          <span className="inline-block bg-amber-900/60 text-amber-300 border border-amber-500/40 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            Mode Layar Tenang Aktif
          </span>
          <h2 className="text-3xl md:text-4xl font-black font-['Fredoka'] text-white">
            Waktunya Bermain di Luar Layar!
          </h2>
          <p className="text-lg md:text-xl text-amber-200/90 font-medium leading-relaxed">
            Layar TV sengaja ditenangkan agar si kecil menatap wajah Ayah/Ibu dan mainan sungguhan di lantai.
          </p>
        </div>

        {targetWord && (
          <div className="bg-slate-900/80 border-2 border-amber-400/30 rounded-2xl p-5 w-full">
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">
              Fokus Kata Saat Ini:
            </p>
            <p className="text-3xl font-black text-amber-300 tracking-wider uppercase">
              "{targetWord}"
            </p>
            {physicalPrompt && (
              <p className="text-sm text-slate-300 mt-2 font-medium">
                {physicalPrompt}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            soundEngine.playPop();
            onWakeScreen();
          }}
          className="mt-4 flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xl font-black px-8 py-4 rounded-2xl border-4 border-amber-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white"
        >
          <Sun className="w-6 h-6" />
          <span>Kembali ke Layar Permainan (Spasi)</span>
        </button>

        <p className="text-xs text-slate-400">
          Tip: Orang tua bisa menekan tombol Spasi di keyboard untuk menyalakan kembali layar kapan saja.
        </p>
      </div>
    </div>
  );
};
