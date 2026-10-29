import React, { useState } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  BookOpen,
  Mic,
  Tv,
  CheckCircle2,
  Play,
  RotateCcw,
  Square,
  HeartHandshake,
  Clock,
  Info,
  Box,
  Music,
} from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { soundEngine } from '../services/soundEngine';
import { ParentSettings, AudioSettings, SoundPlayMode, VisualMode, GraphicsQuality } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: Partial<AudioSettings>) => void;
  parentSettings: ParentSettings;
  onUpdateParentSettings: (settings: Partial<ParentSettings>) => void;
  currentMissionId: number;
  onSelectMission: (missionId: number) => void;
  onEndSessionNow: () => void;
  sessionSeconds: number;
  onResetSessionTimer: () => void;
}

export const ParentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  audioSettings,
  onUpdateAudioSettings,
  parentSettings,
  onUpdateParentSettings,
  currentMissionId,
  onSelectMission,
  onEndSessionNow,
  sessionSeconds,
  onResetSessionTimer,
}) => {
  const [activeTab, setActiveTab] = useState<'misi' | 'stimulasi' | 'audio' | 'tampilan'>('misi');
  const [isRecording, setIsRecording] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingSuccessKey, setRecordingSuccessKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRecording = async (key: string) => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Fitur perekam mikrofon belum didukung pada browser ini.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          soundEngine.saveCustomRecording(key, base64data);
          setRecordingSuccessKey(key);
          setTimeout(() => setRecordingSuccessKey(null), 3000);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(key);
    } catch {
      alert('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan di browser.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    setIsRecording(null);
    setMediaRecorder(null);
  };

  const handleTestAudio = (text: string, key?: string) => {
    soundEngine.speakIndonesian(text, key);
  };

  const handleRemoveCustomAudio = (key: string) => {
    soundEngine.removeCustomRecording(key);
    soundEngine.playPop();
    setRecordingSuccessKey(null);
  };

  const soundModes: { id: SoundPlayMode; label: string; desc: string }[] = [
    { id: 'all', label: 'Semua Suara', desc: 'Suara kendaraan + narasi instruksi + musik instrumen lembut' },
    { id: 'vehicle-sfx', label: 'Suara Kendaraan Saja', desc: 'Hanya mesin, klakson, roda kerikil, dan bak truk' },
    { id: 'cheerful-music', label: 'Musik Ceria', desc: 'Melodi instrumental riang pengantar bermain' },
    { id: 'calm-sound', label: 'Suara Tenang', desc: 'Nada lonceng damai dengan jeda hening ramah sensorik' },
    { id: 'silent', label: 'Mode Senyap', desc: 'Semua audio dinonaktifkan (hening total)' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto select-none animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-amber-500 text-amber-950 px-6 py-4 flex items-center justify-between border-b-4 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-600 flex items-center justify-center">
              <Sliders className="w-6 h-6 text-amber-950" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Fredoka'] tracking-tight">
                Mode Orang Tua — Truk Bicara! 2.0
              </h2>
              <p className="text-xs font-semibold text-amber-950/80">
                Kendali visual 3D, audio 3-jalur, durasi layar TV, dan panduan stimulasi anak
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 transition-transform active:scale-90 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b-2 border-slate-200 bg-slate-100 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('misi')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'misi'
                ? 'bg-white text-amber-600 shadow-sm border-t-2 border-x-2 border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Pilih Misi ({MISSIONS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('stimulasi')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'stimulasi'
                ? 'bg-white text-amber-600 shadow-sm border-t-2 border-x-2 border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Panduan Wicara 2–3 Th</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'audio'
                ? 'bg-white text-amber-600 shadow-sm border-t-2 border-x-2 border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Audio & Suara Orang Tua</span>
          </button>
          <button
            onClick={() => setActiveTab('tampilan')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === 'tampilan'
                ? 'bg-white text-amber-600 shadow-sm border-t-2 border-x-2 border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Visual 3D/2D & Layar TV</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PILIH MISI */}
          {activeTab === 'misi' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-950 font-medium">
                  Setiap misi dirancang untuk waktu layar singkat (1–2 menit) yang langsung disambung
                  dengan 3–5 menit aktivitas bermain fisik nyata di lantai bersama orang tua.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MISSIONS.map((m) => {
                  const isCurrent = m.id === currentMissionId;
                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border-3 transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-300'
                          : 'border-slate-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
                            MISI #{m.id}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Sedang Aktif
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-base text-slate-900">{m.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 mb-2">{m.subtitle}</p>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {m.targetWords.map((tw) => (
                            <span
                              key={tw.word}
                              className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              "{tw.word}"
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-slate-500 italic mb-3">
                          Alat: {m.physicalPlayProps}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          soundEngine.playPop();
                          onSelectMission(m.id);
                          onClose();
                        }}
                        className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-500 text-amber-950 hover:bg-amber-400'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCurrent ? 'Lanjutkan Misi Ini' : 'Mulai Misi Ini'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PANDUAN STIMULASI WICARA */}
          {activeTab === 'stimulasi' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                <h3 className="text-base font-black text-emerald-950 flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Prinsip Stimulasi Bicara 2–3 Tahun (Klinis Ramah Anak)
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Aplikasi ini merupakan sarana interaksi bersama, bukan pengganti terapi wicara medis.
                  Tujuan utama adalah memicu komunikasi spontan tanpa rasa tertekan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
                  <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black">1</span>
                    Beri Contoh 1–2 Kata Pendek
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Ucapkan kata sasaran dengan artikulasi jelas dan nada hangat. Contoh: "Batu!", "Truk jalan!", "Ambil!". Hindari kalimat terlalu panjang saat anak baru belajar kata pertama.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
                  <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black">2</span>
                    Beri Jeda 3–5 Detik (Golden Silence)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Setelah memberi contoh, tatap mata anak dan tunggu dengan senyum hangat. Anak usia 2 tahun memerlukan waktu beberapa detik untuk memproses instruksi dan merespons.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
                  <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black">3</span>
                    Sambut Semua Bentuk Respons
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Menunjuk, memegang balok, bergumam "ba", atau tersenyum adalah komunikasi yang valid! Segera sambut hangat: "Iya, itu batu!" tanpa meminta anak mengulang.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 space-y-2">
                  <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black">4</span>
                    Jangan Menahan Mainan
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Jangan menahan truk mainan sambil berkata "Bilang truk dulu baru dikasih". Berikan mainan dengan gembira agar anak merasa bicara adalah hal yang menyenangkan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO MANAGER 2.0 (3 Channel Audio) */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              {/* Sound & Play Mode Selector */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-amber-600" />
                    Pilih Mode Audio (Sound & Play Mode)
                  </span>
                  <button
                    onClick={() => onUpdateAudioSettings({ isMuted: !audioSettings.isMuted })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      audioSettings.isMuted
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {audioSettings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{audioSettings.isMuted ? 'Muted' : 'Suara Aktif'}</span>
                  </button>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {soundModes.map((sm) => {
                    const isSelected = audioSettings.soundMode === sm.id;
                    return (
                      <button
                        key={sm.id}
                        onClick={() => {
                          soundEngine.playPop();
                          soundEngine.setSoundMode(sm.id);
                          onUpdateAudioSettings({ soundMode: sm.id });
                        }}
                        className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-sm font-black'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-amber-300'
                        }`}
                      >
                        <p className="font-black text-xs">{sm.label}</p>
                        <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{sm.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Separate Volume Sliders */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Pengaturan Volume 3-Jalur Terpisah:
                </h4>

                {/* 1. Suara Kendaraan SFX */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>1. Suara Kendaraan (Mesin, Klakson, Kerikil, Bak)</span>
                    <span>{Math.round(audioSettings.sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioSettings.sfxVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      soundEngine.setSfxVolume(val);
                      onUpdateAudioSettings({ sfxVolume: val });
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* 2. Suara Narator */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>2. Suara Narator & Contoh Kata (Bahasa Indonesia)</span>
                    <span>{Math.round(audioSettings.narratorVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioSettings.narratorVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      soundEngine.setNarratorVolume(val);
                      onUpdateAudioSettings({ narratorVolume: val });
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* 3. Musik & Suara Suasana */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>3. Musik Suasana & Nada Tenang</span>
                    <span>{Math.round(audioSettings.ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioSettings.ambientVolume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      soundEngine.setAmbientVolume(val);
                      onUpdateAudioSettings({ ambientVolume: val });
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Musik suasana otomatis berhenti saat masuk ke layar aktivitas fisik agar anak fokus bermain nyata.
                  </p>
                </div>
              </div>

              {/* Rekam Suara Orang Tua Sendiri */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Mic className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black text-sm text-amber-950">
                      Rekam Suara Bunda / Ayah Sendiri (Lokal & Pribadi)
                    </h4>
                    <p className="text-xs text-amber-900/80 leading-relaxed">
                      Rekam suara asli Anda untuk kata sasaran. Suara orang tua adalah stimulus terbaik bagi anak!
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  {[
                    { key: 'batu', text: 'Batu! Ambil batu!' },
                    { key: 'jalan', text: 'Truk jalan! Brum brum!' },
                    { key: 'stop', text: 'Stop! Berhenti!' },
                    { key: 'gali', text: 'Gali pasir! Serok!' },
                    { key: 'putar', text: 'Putar molen! Wuuush!' },
                    { key: 'selesai', text: 'Hore! Selesai!' },
                  ].map((item) => {
                    const hasCustom = Boolean(soundEngine.getCustomRecording(item.key));
                    const isRec = isRecording === item.key;
                    return (
                      <div
                        key={item.key}
                        className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-black text-slate-900 text-sm">"{item.key.toUpperCase()}"</p>
                          <p className="text-slate-500">{item.text}</p>
                          {hasCustom && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              ✓ Rekaman Orang Tua Aktif
                            </span>
                          )}
                          {recordingSuccessKey === item.key && (
                            <span className="inline-block mt-1 ml-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                              Disimpan!
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleTestAudio(item.text, item.key)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                            title="Putar Contoh Suara"
                          >
                            <Play className="w-4 h-4" />
                          </button>

                          {isRec ? (
                            <button
                              onClick={handleStopRecording}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold animate-pulse cursor-pointer"
                            >
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Selesai</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartRecording(item.key)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold transition-colors cursor-pointer"
                              title="Rekam Suara Sendiri"
                            >
                              <Mic className="w-3.5 h-3.5" />
                              <span>{hasCustom ? 'Rekam Ulang' : 'Rekam'}</span>
                            </button>
                          )}

                          {hasCustom && (
                            <button
                              onClick={() => handleRemoveCustomAudio(item.key)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus rekaman lokal"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISUAL 3D/2D & TAMPILAN TV */}
          {activeTab === 'tampilan' && (
            <div className="space-y-5">
              {/* Visual Mode (3D vs 2D) */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Box className="w-5 h-5 text-amber-600" />
                  Mode Tampilan Kendaraan
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onUpdateParentSettings({ visualMode: '3d' });
                    }}
                    className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                      parentSettings.visualMode === '3d'
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <p className="font-black text-base text-slate-900">Mode 3D Interaktif</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Visual 3D Three.js dengan roda berputar, bak truk terangkat, ekskavator menggali, dan pencahayaan studio lembut.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onUpdateParentSettings({ visualMode: '2d' });
                    }}
                    className={`p-4 rounded-2xl border-3 text-left transition-all cursor-pointer ${
                      parentSettings.visualMode === '2d'
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <p className="font-black text-base text-slate-900">Mode 2D Kartun Cepat (Fallback)</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Visual vektor SVG ringan, sangat hemat CPU dan ideal untuk TV Box atau laptop dengan spesifikasi minim.
                    </p>
                  </button>
                </div>
              </div>

              {/* Safe Overscan Margin & Session Limit */}
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">Margin Aman TV (Safe Area 5%)</p>
                    <p className="text-xs text-slate-500">
                      Bantalan tepi layar agar tombol tidak terpotong oleh bezel TV lama.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={parentSettings.tvSafeMargin}
                    onChange={(e) => onUpdateParentSettings({ tvSafeMargin: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-slate-900">
                      Target Batas Sesi Layar: {parentSettings.sessionLimitMinutes} Menit
                    </p>
                    <p className="text-xs text-slate-500">
                      Pemberitahuan santai agar anak segera beralih ke permainan fisik sungguhan.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[3, 5, 8, 10].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => {
                          soundEngine.playPop();
                          onUpdateParentSettings({ sessionLimitMinutes: mins });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          parentSettings.sessionLimitMinutes === mins
                            ? 'bg-amber-500 text-amber-950 font-black'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcut Cheatsheet */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-black text-amber-300 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tombol Pintas Keyboard (Remote TV / Wireless Keyboard di Sofa)
                </h4>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                  <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-bold">Spasi / Enter</span>
                    <span className="text-slate-300 font-sans">Lanjut Misi / Selesai</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-bold">R</span>
                    <span className="text-slate-300 font-sans">Ulangi Narasi</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-bold">M</span>
                    <span className="text-slate-300 font-sans">Mute Audio</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                    <span className="text-amber-400 font-bold">Esc</span>
                    <span className="text-slate-300 font-sans">Mode Orang Tua</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playPop();
                onResetSessionTimer();
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              Reset Timer ({Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s)
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
                onEndSessionNow();
              }}
              className="px-4 py-2 rounded-xl text-xs font-black bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition-colors cursor-pointer"
            >
              Akhiri Sesi Layar
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-amber-950 transition-all cursor-pointer shadow-md active:scale-95"
          >
            Tutup & Kembali Bermain
          </button>
        </div>
      </div>
    </div>
  );
};
