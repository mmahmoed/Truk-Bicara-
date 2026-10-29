import React from 'react';
import { Volume2, VolumeX, Moon, Sliders, Maximize2, ShieldCheck, Clock } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface Props {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenParentModal: () => void;
  isCalmMode: boolean;
  onToggleCalmMode: () => void;
  sessionSeconds: number;
  sessionLimitMinutes: number;
  currentMissionTitle?: string;
  onBackToHome?: () => void;
}

export const TvNavBar: React.FC<Props> = ({
  isMuted,
  onToggleMute,
  onOpenParentModal,
  isCalmMode,
  onToggleCalmMode,
  sessionSeconds,
  sessionLimitMinutes,
  currentMissionTitle,
  onBackToHome,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const limitSeconds = sessionLimitMinutes * 60;
  const isOverLimit = sessionSeconds > limitSeconds;

  const handleToggleFullscreen = () => {
    soundEngine.playPop();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="w-full bg-amber-500/95 backdrop-blur-md text-white px-4 md:px-8 py-3 shadow-md border-b-4 border-amber-600/70 select-none z-30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playPop();
              if (onBackToHome) onBackToHome();
            }}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none focus:ring-4 focus:ring-white rounded-xl px-2 py-1 transition-transform active:scale-95"
            title="Kembali ke Beranda"
          >
            <span className="text-2xl md:text-3xl filter drop-shadow">🚜</span>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight drop-shadow font-['Fredoka'] text-amber-950 flex items-center gap-1.5">
                Truk Bicara!
                <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                  TV
                </span>
              </h1>
              <p className="text-[11px] md:text-xs text-amber-950 font-semibold opacity-90 hidden sm:block">
                Stimulasi Wicara & Gerak Fisik
              </p>
            </div>
          </button>

          {currentMissionTitle && (
            <div className="hidden lg:flex items-center gap-2 bg-amber-600/60 text-white px-3 py-1 rounded-xl text-sm font-bold border border-amber-400/40">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
              <span>{currentMissionTitle}</span>
            </div>
          )}
        </div>

        {/* Status Indicators & Parent Quick Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Sesi Bermain Timer Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs md:text-sm font-black transition-colors ${
              isOverLimit
                ? 'bg-rose-500 text-white border-rose-300 animate-bounce'
                : 'bg-amber-600/60 text-amber-50 border-amber-400/40'
            }`}
            title={`Waktu sesi layar yang direkomendasikan: ${sessionLimitMinutes} menit`}
          >
            <Clock className="w-4 h-4" />
            <span>Sesi: {formatTime(sessionSeconds)}</span>
            {isOverLimit && <span className="hidden md:inline">(Ayo istirahat fisik)</span>}
          </div>

          {/* Quick Calm Mode (Layar Tenang) */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onToggleCalmMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold border-2 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-white ${
              isCalmMode
                ? 'bg-indigo-700 border-indigo-400 text-white'
                : 'bg-amber-600/50 hover:bg-amber-600 text-white border-amber-400/40'
            }`}
            title="Layar Tenang: redupkan layar agar anak fokus bermain fisik nyata"
          >
            <Moon className="w-4 h-4" />
            <span className="hidden md:inline">{isCalmMode ? 'Layar Terang' : 'Layar Tenang'}</span>
          </button>

          {/* Mute / Unmute */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onToggleMute();
            }}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-white ${
              isMuted
                ? 'bg-rose-600 border-rose-400 text-white'
                : 'bg-amber-600/50 hover:bg-amber-600 text-white border-amber-400/40'
            }`}
            title={isMuted ? 'Nyalakan Suara (M)' : 'Matikan Suara (M)'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl border-2 bg-amber-600/50 hover:bg-amber-600 text-white border-amber-400/40 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-white hidden sm:block"
            title="Layar Penuh TV (F11)"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          {/* Mode Orang Tua Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenParentModal();
            }}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white px-3 md:px-4 py-1.5 rounded-xl text-xs md:text-sm font-black border-2 border-slate-700 shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95"
            title="Mode Orang Tua & Panduan Bicara (Esc)"
          >
            <Sliders className="w-4 h-4" />
            <span>UNTUK ORANG TUA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
