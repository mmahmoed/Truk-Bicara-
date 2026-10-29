import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { Mission } from '../../types';
import { VehicleRenderer } from '../vehicles/VehicleRenderer';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  mission: Mission;
  onStartPhysicalMission: () => void;
  onBackToSelectVehicle: () => void;
}

export const MissionIntroScreen: React.FC<Props> = ({
  mission,
  onStartPhysicalMission,
  onBackToSelectVehicle,
}) => {
  const [repeatCount, setRepeatCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play mission introduction audio once on enter
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePlayIntroAudio();
    }, 400);

    return () => {
      clearTimeout(timer);
      soundEngine.stopAll();
    };
  }, [mission.id]);

  const handlePlayIntroAudio = () => {
    setIsSpeaking(true);
    // Play vehicle sound effect first
    if (mission.vehicleId === 'truk-kuning') soundEngine.playHorn();
    if (mission.vehicleId === 'truk-merah') soundEngine.playEngine();
    if (mission.vehicleId === 'ekskavator') soundEngine.playHydraulic();
    if (mission.vehicleId === 'truk-molen') soundEngine.playCementSpin();

    // Custom key fallback
    const key = `intro_${mission.slug}`;
    soundEngine.speakIndonesian(
      mission.introSpeech,
      key,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleRepeatVoice = () => {
    setRepeatCount((prev) => prev + 1);
    handlePlayIntroAudio();
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-6 px-4 md:px-8 max-w-5xl mx-auto w-full select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            soundEngine.playPop();
            onBackToSelectVehicle();
          }}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-4 py-2 rounded-2xl border-2 border-slate-300 font-bold text-sm shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <span className="text-xs bg-amber-200 text-amber-900 font-bold px-3 py-0.5 rounded-full border border-amber-300">
            Layar C &bull; Pengantar Misi #{mission.id}
          </span>
          <h2 className="text-xl md:text-2xl font-black font-['Fredoka'] text-amber-950">
            {mission.title}
          </h2>
        </div>

        <div className="w-24 hidden sm:block" />
      </div>

      {/* Main Content Area */}
      <div className="my-auto flex flex-col items-center text-center space-y-4">
        {/* Animated Vehicle */}
        <div className="w-full max-w-lg">
          <VehicleRenderer
            vehicleId={mission.vehicleId}
            actionState={isSpeaking ? 'driving' : 'idle'}
            isAnimated={isSpeaking}
            className="w-full h-auto"
          />
        </div>

        {/* Clear Instruction in Big Child-Friendly Typography */}
        <div className="bg-white border-4 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl w-full">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-bold px-4 py-1 rounded-full text-xs md:text-sm mb-3 border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Instruksi Singkat</span>
          </div>

          <h3 className="text-3xl md:text-5xl font-black font-['Fredoka'] text-slate-900 leading-tight">
            "{mission.introSpeech}"
          </h3>

          <p className="text-sm md:text-base text-slate-600 font-bold mt-3">
            {mission.subtitle}
          </p>
        </div>

        {/* Gentle note for parent if repeated often */}
        {repeatCount >= 3 && (
          <div className="bg-amber-100 border-2 border-amber-300 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold max-w-md animate-fadeIn">
            💡 Hebat! Sekarang ayo ajak si kecil bergerak bersama Ayah/Ibu dan mulai misi fisik di lantai.
          </div>
        )}
      </div>

      {/* Action Buttons (2 Large buttons as specified in specs) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto w-full mb-3">
        {/* MULAI MISI */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onStartPhysicalMission();
          }}
          className="w-full sm:flex-1 py-5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-2xl md:text-3xl font-['Fredoka'] border-4 border-amber-600 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Mulai Misi Bermain Fisik (Spasi / Enter)"
        >
          <Play className="w-8 h-8 fill-current text-amber-950" />
          <span>MULAI MISI</span>
        </button>

        {/* ULANGI SUARA (Limited repeats) */}
        <button
          onClick={handleRepeatVoice}
          disabled={isSpeaking}
          className="w-full sm:w-auto py-5 px-7 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-black text-lg md:text-xl border-4 border-slate-300 hover:border-amber-400 shadow-md flex items-center justify-center gap-3 cursor-pointer transform hover:scale-102 active:scale-95 transition-all disabled:opacity-50 focus:outline-none focus:ring-4 focus:ring-amber-300"
          title="Ulangi Instruksi Suara (R)"
        >
          <RotateCcw className="w-6 h-6 text-amber-600" />
          <span>ULANGI SUARA</span>
        </button>
      </div>
    </div>
  );
};
