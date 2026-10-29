import React, { useEffect } from 'react';
import { ArrowRight, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Mission } from '../../types';
import { VehicleRenderer } from '../vehicles/VehicleRenderer';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  mission: Mission;
  onNextMission: () => void;
  onEndSession: () => void;
}

export const MissionCompleteScreen: React.FC<Props> = ({
  mission,
  onNextMission,
  onEndSession,
}) => {
  useEffect(() => {
    // Play completion chime & speech
    soundEngine.playCelebration();
    if (mission.vehicleId === 'truk-kuning') soundEngine.playCargoDump();

    const timer = setTimeout(() => {
      soundEngine.speakIndonesian(mission.completionSpeech || 'Hore! Truk selesai bekerja!');
    }, 400);

    return () => {
      clearTimeout(timer);
      soundEngine.stopAll();
    };
  }, [mission.id]);

  return (
    <div className="flex-1 flex flex-col justify-between py-6 px-4 md:px-8 max-w-5xl mx-auto w-full select-none">
      {/* Top Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 px-4 py-1.5 rounded-full text-xs md:text-sm font-black shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Misi #{mission.id} Berhasil!</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black font-['Fredoka'] text-amber-950">
          Hore! Truk Selesai Bekerja!
        </h2>
        <p className="text-base md:text-lg text-slate-700 font-bold">
          {mission.completionSpeech}
        </p>
      </div>

      {/* Center Celebration Animation (Tipping cargo / happy vehicle) */}
      <div className="my-auto flex flex-col items-center">
        <div className="w-full max-w-lg">
          <VehicleRenderer
            vehicleId={mission.vehicleId}
            actionState="dumping"
            isAnimated={true}
            className="w-full h-auto"
            showRocks={false} // Bed emptied
          />
        </div>

        {/* Target Words Learned Together */}
        <div className="bg-white border-4 border-amber-300 rounded-3xl p-5 shadow-lg max-w-xl w-full text-center mt-3">
          <p className="text-xs font-black uppercase text-slate-500 tracking-wider mb-2">
            Kata yang kita gunakan bersama si kecil:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {mission.targetWords.map((tw) => (
              <span
                key={tw.word}
                className="bg-amber-100 text-amber-950 font-black text-sm md:text-base px-3 py-1 rounded-xl border border-amber-300"
              >
                "{tw.word}"
              </span>
            ))}
          </div>

          <p className="text-xs text-emerald-800 font-bold mt-3">
            Tip: Berikan tos tangan (high five) atau pelukan hangat untuk anak!
          </p>
        </div>
      </div>

      {/* Action Buttons: Next Mission or End Session */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto w-full mb-2">
        {/* Next Mission */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onNextMission();
          }}
          className="w-full sm:flex-1 py-5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xl md:text-2xl font-['Fredoka'] border-4 border-amber-600 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <span>MISI BERIKUTNYA</span>
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* End Session */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onEndSession();
          }}
          className="w-full sm:w-auto py-5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-black text-lg md:text-xl border-4 border-slate-700 shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <HeartHandshake className="w-5 h-5" />
          <span>AKHIRI SESI (MAIN NYATA)</span>
        </button>
      </div>
    </div>
  );
};
