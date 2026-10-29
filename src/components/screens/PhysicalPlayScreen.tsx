import React, { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, Volume2, Moon, Sparkles, HeartHandshake } from 'lucide-react';
import { Mission, TargetWord } from '../../types';
import { VehicleRenderer } from '../vehicles/VehicleRenderer';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  mission: Mission;
  onCompleteMission: () => void;
  onActivateCalmMode: () => void;
}

export const PhysicalPlayScreen: React.FC<Props> = ({
  mission,
  onCompleteMission,
  onActivateCalmMode,
}) => {
  const [activeWord, setActiveWord] = useState<TargetWord>(mission.targetWords[0]);
  const [isCalmScreen, setIsCalmScreen] = useState(false);
  const [instructionRepeats, setInstructionRepeats] = useState(0);

  // Initial instruction audio with slow toddler pacing
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlayInstructionAudio();
    }, 500);

    // After 10 seconds, transition vehicle into calm static state
    const calmTimer = setTimeout(() => {
      setIsCalmScreen(true);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(calmTimer);
      soundEngine.stopAll();
    };
  }, [mission.id]);

  const handlePlayInstructionAudio = () => {
    const key = `phys_${mission.slug}`;
    soundEngine.speakIndonesian(mission.physicalInstruction, key);
  };

  const handleSpeakTargetWord = (tw: TargetWord) => {
    setActiveWord(tw);
    const key = tw.word.toLowerCase();

    // Play word audio: first procedural accent then speech
    soundEngine.playPop();
    soundEngine.speakIndonesian(tw.word, key);
  };

  const handleRepeatInstruction = () => {
    setInstructionRepeats((prev) => prev + 1);
    soundEngine.playPop();
    handlePlayInstructionAudio();
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-4 px-4 md:px-8 max-w-6xl mx-auto w-full select-none">
      {/* Top Header Information for Parents */}
      <div className="flex items-center justify-between gap-3 bg-amber-100/90 border-2 border-amber-300 rounded-2xl px-5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="text-base md:text-lg font-black text-amber-950">
            {mission.title}: <span className="font-medium text-slate-700">{mission.subtitle}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white text-slate-700 font-bold px-3 py-1 rounded-xl border border-amber-300 hidden sm:inline">
            Alat: {mission.physicalPlayProps}
          </span>
          <button
            onClick={() => {
              soundEngine.playPop();
              onActivateCalmMode();
            }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            title="Redupkan layar agar anak tidak terpaku ke TV"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Redupkan Layar</span>
          </button>
        </div>
      </div>

      {/* Main Playing Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-2">
        {/* Left Column: Calm Vehicle Illustration (Quiet state) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-md relative">
            <VehicleRenderer
              vehicleId={mission.vehicleId}
              actionState={isCalmScreen ? 'idle' : 'driving'}
              isAnimated={false} // Intentionally calm to avoid hypnotizing toddler
              className="w-full h-auto"
            />

            {/* Serene Badge */}
            {isCalmScreen && (
              <div className="absolute top-2 right-2 bg-slate-900/80 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm border border-amber-400/40">
                Truk Istirahat &bull; Giliran Anak Bermain
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 font-bold mt-2 text-center">
            Truk sedang menunggu di lokasi. Sekarang giliran si kecil bergerak!
          </p>
        </div>

        {/* Right Column: Prominent Target Words & Physical Instruction */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Big Physical Instruction Box */}
          <div className="bg-white border-4 border-amber-400 rounded-3xl p-5 md:p-6 shadow-xl">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Instruksi Gerak Fisik Bersama</span>
            </div>

            <h3 className="text-2xl md:text-4xl font-black font-['Fredoka'] text-slate-900 leading-snug">
              "{mission.physicalInstruction}"
            </h3>

            {/* Parent Speaking Prompt */}
            <div className="mt-4 pt-4 border-t-2 border-slate-100 flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
              <HeartHandshake className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <p className="font-bold text-amber-950 mb-0.5">Tips untuk Orang Tua:</p>
                <p className="leading-relaxed">
                  {mission.parentTips[1] || mission.parentTips[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Target Word Chips (High TV Contrast) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Target Kosakata (Klik kata untuk dengarkan pengucapan):
              </p>
              <span className="text-[11px] text-slate-500 font-semibold">
                Beri jeda 3-5 detik setelah mengucapkannya
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {mission.targetWords.map((tw) => {
                const isActive = activeWord.word === tw.word;
                return (
                  <button
                    key={tw.word}
                    onClick={() => handleSpeakTargetWord(tw)}
                    className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300 ${
                      isActive
                        ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-md scale-102 font-black'
                        : 'bg-white border-slate-300 hover:border-amber-400 text-slate-800'
                    }`}
                  >
                    <span className="text-xl md:text-2xl font-black uppercase font-['Fredoka'] tracking-wider">
                      {tw.word}
                    </span>
                    {tw.syllables && (
                      <span className="text-[10px] opacity-75 font-mono font-bold">
                        {tw.syllables}
                      </span>
                    )}
                    <Volume2 className="w-4 h-4 opacity-80" />
                  </button>
                );
              })}
            </div>

            {/* Active word prompt details */}
            <div className="bg-slate-100 rounded-xl px-4 py-2 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span>
                <strong>Aksi "{activeWord.word.toUpperCase()}":</strong> {activeWord.actionPrompt}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Parent Control Bar (TV large actions) */}
      <div className="bg-white/90 backdrop-blur-sm border-4 border-slate-200 rounded-3xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRepeatInstruction}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3.5 rounded-2xl border-2 border-slate-300 font-bold text-sm transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300"
            title="Ulangi instruksi fisik untuk anak (R)"
          >
            <RotateCcw className="w-5 h-5 text-amber-600" />
            <span>ULANGI PETUNJUK (R)</span>
          </button>
        </div>

        {/* Big Selesai Button */}
        <button
          onClick={() => {
            soundEngine.playCelebration();
            onCompleteMission();
          }}
          className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl md:text-2xl font-['Fredoka'] border-4 border-emerald-700 shadow-lg flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-300"
          title="Selesai Bermain Fisik (Spasi / Enter)"
        >
          <CheckCircle2 className="w-7 h-7" />
          <span>SELESAI! (ANAK SUDAH MAIN)</span>
        </button>
      </div>
    </div>
  );
};
