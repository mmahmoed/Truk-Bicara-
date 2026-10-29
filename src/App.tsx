/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ScreenType, VehicleId, AudioSettings, ParentSettings } from './types';
import { MISSIONS } from './data/missions';
import { VEHICLES } from './data/vehicles';
import { soundEngine } from './services/soundEngine';
import { TvNavBar } from './components/TvNavBar';
import { CalmScreenOverlay } from './components/CalmScreenOverlay';
import { ParentModal } from './components/ParentModal';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { SelectVehicleScreen } from './components/screens/SelectVehicleScreen';
import { MissionIntroScreen } from './components/screens/MissionIntroScreen';
import { PhysicalPlayScreen } from './components/screens/PhysicalPlayScreen';
import { MissionCompleteScreen } from './components/screens/MissionCompleteScreen';
import { SessionEndScreen } from './components/screens/SessionEndScreen';

export default function App() {
  // Screen and Flow States
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [currentMissionId, setCurrentMissionId] = useState<number>(1);
  const [selectedVehicleId, setSelectedVehicleId] = useState<VehicleId>('truk-kuning');

  // Modals & Overlays
  const [isCalmMode, setIsCalmMode] = useState<boolean>(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState<boolean>(false);

  // Session Timing
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(true);

  // Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    return {
      volume: 0.85,
      isMuted: false,
      speechRate: 0.82,
      soundEffects: true,
    };
  });

  const [parentSettings, setParentSettings] = useState<ParentSettings>(() => {
    // Load from localStorage if present
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('truk_parent_settings');
        if (saved) return JSON.parse(saved);
      } catch {
        // use default
      }
    }
    return {
      tvSafeMargin: false, // Default TV safe margin
      highContrast: false,
      sessionLimitMinutes: 5, // Recommends 5 min per session
      autoCalmAfterInstruction: true,
    };
  });

  // Current active mission
  const activeMission = MISSIONS.find((m) => m.id === currentMissionId) || MISSIONS[0];

  // Sync vehicle whenever mission changes
  useEffect(() => {
    if (activeMission) {
      setSelectedVehicleId(activeMission.vehicleId);
    }
  }, [activeMission]);

  // Session Timer Tick
  useEffect(() => {
    if (!isSessionActive) return;
    const interval = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSessionActive]);

  // Save parent settings changes
  const handleUpdateParentSettings = (newSettings: Partial<ParentSettings>) => {
    setParentSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('truk_parent_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleUpdateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (updated.volume !== undefined) soundEngine.setVolume(updated.volume);
      if (updated.isMuted !== undefined) soundEngine.setMuted(updated.isMuted);
      if (updated.speechRate !== undefined) soundEngine.setSpeechRate(updated.speechRate);
      return updated;
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !audioSettings.isMuted;
    handleUpdateAudioSettings({ isMuted: nextMuted });
  };

  // Keyboard navigation for TV wireless remote / keyboard
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture inside inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setIsParentModalOpen((prev) => !prev);
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      // Calm mode wake
      if (isCalmMode && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setIsCalmMode(false);
        return;
      }

      // Space or Enter key flow through screens
      if (e.key === ' ' || e.key === 'Enter') {
        if (isParentModalOpen) return;
        e.preventDefault();

        if (currentScreen === 'home') {
          soundEngine.playHorn();
          setCurrentScreen('mission-intro');
        } else if (currentScreen === 'select-vehicle') {
          soundEngine.playHorn();
          setCurrentScreen('mission-intro');
        } else if (currentScreen === 'mission-intro') {
          soundEngine.playPop();
          setCurrentScreen('physical-play');
        } else if (currentScreen === 'physical-play') {
          soundEngine.playCelebration();
          setCurrentScreen('mission-complete');
        } else if (currentScreen === 'mission-complete') {
          soundEngine.playPop();
          handleNextMission();
        } else if (currentScreen === 'session-end') {
          soundEngine.playPop();
          setCurrentScreen('home');
        }
      }
    },
    [currentScreen, isCalmMode, isParentModalOpen, audioSettings.isMuted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Mission Transition Handlers
  const handleNextMission = () => {
    if (currentMissionId < MISSIONS.length) {
      setCurrentMissionId((prev) => prev + 1);
      setCurrentScreen('mission-intro');
    } else {
      // Finished all 5 missions!
      setCurrentScreen('session-end');
    }
  };

  const handleSelectSpecificMission = (missionId: number) => {
    setCurrentMissionId(missionId);
    const m = MISSIONS.find((item) => item.id === missionId);
    if (m) setSelectedVehicleId(m.vehicleId);
    setCurrentScreen('mission-intro');
  };

  const handleEndSession = () => {
    soundEngine.stopAll();
    setCurrentScreen('session-end');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-['Nunito',sans-serif] transition-all bg-gradient-to-b from-amber-50 via-sky-50 to-amber-100 ${
        parentSettings.highContrast ? 'contrast-125 saturate-125' : ''
      }`}
    >
      {/* Top TV Navigation Bar */}
      <TvNavBar
        isMuted={audioSettings.isMuted}
        onToggleMute={handleToggleMute}
        onOpenParentModal={() => setIsParentModalOpen(true)}
        isCalmMode={isCalmMode}
        onToggleCalmMode={() => setIsCalmMode((prev) => !prev)}
        sessionSeconds={sessionSeconds}
        sessionLimitMinutes={parentSettings.sessionLimitMinutes}
        currentMissionTitle={currentScreen !== 'home' ? activeMission.title : undefined}
        onBackToHome={() => {
          soundEngine.stopAll();
          setCurrentScreen('home');
        }}
      />

      {/* Main Safe Area Container for TV 16:9 view */}
      <main
        className={`flex-1 flex flex-col justify-center items-center w-full transition-all ${
          parentSettings.tvSafeMargin ? 'p-6 md:p-12 lg:p-16' : 'p-3 md:p-6'
        }`}
      >
        {/* LAYAR A: BERANDA */}
        {currentScreen === 'home' && (
          <HomeScreen
            onStartMission={() => setCurrentScreen('mission-intro')}
            onSelectVehicle={() => setCurrentScreen('select-vehicle')}
            onOpenParentModal={() => setIsParentModalOpen(true)}
          />
        )}

        {/* LAYAR B: PILIH TRUK */}
        {currentScreen === 'select-vehicle' && (
          <SelectVehicleScreen
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={(id) => setSelectedVehicleId(id)}
            onProceedToMission={() => setCurrentScreen('mission-intro')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {/* LAYAR C: PENGANTAR MISI */}
        {currentScreen === 'mission-intro' && (
          <MissionIntroScreen
            mission={activeMission}
            onStartPhysicalMission={() => setCurrentScreen('physical-play')}
            onBackToSelectVehicle={() => setCurrentScreen('select-vehicle')}
          />
        )}

        {/* LAYAR D: MISI FISIK */}
        {currentScreen === 'physical-play' && (
          <PhysicalPlayScreen
            mission={activeMission}
            onCompleteMission={() => setCurrentScreen('mission-complete')}
            onActivateCalmMode={() => setIsCalmMode(true)}
          />
        )}

        {/* LAYAR E: MISI SELESAI */}
        {currentScreen === 'mission-complete' && (
          <MissionCompleteScreen
            mission={activeMission}
            onNextMission={handleNextMission}
            onEndSession={handleEndSession}
          />
        )}

        {/* LAYAR F: AKHIR SESI */}
        {currentScreen === 'session-end' && (
          <SessionEndScreen
            totalSessionMinutes={Math.max(1, Math.round(sessionSeconds / 60))}
            onBackToHome={() => {
              setSessionSeconds(0);
              setCurrentScreen('home');
            }}
            onSleepScreen={() => setIsCalmMode(true)}
          />
        )}
      </main>

      {/* Calm Screen Overlay (Mode Layar Tenang saat bermain fisik di lantai) */}
      <CalmScreenOverlay
        isOpen={isCalmMode}
        onWakeScreen={() => setIsCalmMode(false)}
        targetWord={activeMission?.targetWords[0]?.word}
        physicalPrompt={activeMission?.physicalInstruction}
      />

      {/* Parent Mode Modal */}
      <ParentModal
        isOpen={isParentModalOpen}
        onClose={() => setIsParentModalOpen(false)}
        audioSettings={audioSettings}
        onUpdateAudioSettings={handleUpdateAudioSettings}
        parentSettings={parentSettings}
        onUpdateParentSettings={handleUpdateParentSettings}
        currentMissionId={currentMissionId}
        onSelectMission={handleSelectSpecificMission}
        onEndSessionNow={handleEndSession}
        sessionSeconds={sessionSeconds}
        onResetSessionTimer={() => setSessionSeconds(0)}
      />
    </div>
  );
}
