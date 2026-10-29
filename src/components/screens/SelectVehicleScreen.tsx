import React, { useState } from 'react';
import { ArrowLeft, Play, Volume2, Check } from 'lucide-react';
import { VEHICLES } from '../../data/vehicles';
import { VehicleId } from '../../types';
import { VehicleRenderer } from '../vehicles/VehicleRenderer';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  selectedVehicleId: VehicleId;
  onSelectVehicle: (id: VehicleId) => void;
  onProceedToMission: () => void;
  onBackToHome: () => void;
}

export const SelectVehicleScreen: React.FC<Props> = ({
  selectedVehicleId,
  onSelectVehicle,
  onProceedToMission,
  onBackToHome,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const currentVehicle = VEHICLES.find((v) => v.id === selectedVehicleId) || VEHICLES[0];

  const handlePickVehicle = (id: VehicleId) => {
    onSelectVehicle(id);
    setIsAnimating(true);

    // Play specific vehicle sound
    if (id === 'truk-kuning') {
      soundEngine.playHorn();
    } else if (id === 'truk-merah') {
      soundEngine.playEngine();
    } else if (id === 'ekskavator') {
      soundEngine.playHydraulic();
    } else if (id === 'truk-molen') {
      soundEngine.playCementSpin();
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 900);
  };

  const handlePlaySound = () => {
    if (selectedVehicleId === 'truk-kuning') {
      soundEngine.playHorn();
      soundEngine.speakIndonesian('Truk kuning! Bip-bip!');
    } else if (selectedVehicleId === 'truk-merah') {
      soundEngine.playEngine();
      soundEngine.speakIndonesian('Truk merah! Brum-brum!');
    } else if (selectedVehicleId === 'ekskavator') {
      soundEngine.playHydraulic();
      soundEngine.speakIndonesian('Ekskavator! Gali pasir!');
    } else if (selectedVehicleId === 'truk-molen') {
      soundEngine.playCementSpin();
      soundEngine.speakIndonesian('Truk molen! Putar semen!');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-5 px-4 md:px-8 max-w-6xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            soundEngine.playPop();
            onBackToHome();
          }}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 px-4 py-2 rounded-2xl border-2 border-slate-300 font-bold text-sm shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <div className="text-center">
          <span className="text-xs bg-amber-200 text-amber-900 font-bold px-3 py-0.5 rounded-full border border-amber-300">
            Layar B &bull; Pilih Truk Favorit
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-['Fredoka'] text-amber-950">
            Pilih Kendaraan Konstruksi
          </h2>
        </div>

        <div className="w-24 hidden sm:block" />
      </div>

      {/* Main Focus Vehicle Display */}
      <div className="my-4 flex flex-col items-center">
        <div className={`w-full max-w-md transition-transform duration-300 ${isAnimating ? 'scale-105 -rotate-1' : ''}`}>
          <VehicleRenderer
            vehicleId={selectedVehicleId}
            actionState={isAnimating ? 'driving' : 'idle'}
            isAnimated={isAnimating}
            className="w-full h-auto"
          />
        </div>

        {/* Selected Vehicle Name in Big Bold TV Letters */}
        <div className="text-center mt-2 space-y-1">
          <h3 className="text-3xl md:text-5xl font-black font-['Fredoka'] text-slate-900 tracking-wide uppercase">
            {currentVehicle.name}
          </h3>
          <p className="text-sm md:text-base font-bold text-amber-900 bg-amber-100/80 px-4 py-1 rounded-full border border-amber-200 inline-block">
            {currentVehicle.role} &bull; {currentVehicle.shortDesc}
          </p>
        </div>

        {/* Manual Sound Button */}
        <button
          onClick={handlePlaySound}
          className="mt-3 inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-800 border-2 border-amber-400 px-5 py-2 rounded-full text-xs md:text-sm font-black shadow-sm transition-all cursor-pointer hover:scale-103 active:scale-95"
        >
          <Volume2 className="w-4 h-4 text-amber-600" />
          <span>Dengarkan Suara {currentVehicle.name}</span>
        </button>
      </div>

      {/* 4 Vehicle Selection Cards (Large, accessible) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl mx-auto my-2">
        {VEHICLES.map((veh) => {
          const isSelected = veh.id === selectedVehicleId;
          return (
            <button
              key={veh.id}
              onClick={() => handlePickVehicle(veh.id)}
              className={`p-3 md:p-4 rounded-2xl border-4 transition-all flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-400 ${
                isSelected
                  ? 'border-amber-500 bg-amber-100/90 shadow-lg scale-103'
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
              }`}
            >
              <div className="w-full h-20 md:h-24 flex items-center justify-center">
                <VehicleRenderer
                  vehicleId={veh.id}
                  actionState="idle"
                  className="w-full h-full max-h-20"
                />
              </div>

              <div className="text-center w-full">
                <p className="font-black text-sm md:text-base text-slate-900 leading-tight">
                  {veh.name}
                </p>
                <p className="text-[11px] text-slate-500 font-bold truncate">
                  {veh.role}
                </p>
              </div>

              {isSelected && (
                <span className="flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300">
                  <Check className="w-3 h-3" /> Dipilih
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Continue Action */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => {
            soundEngine.playHorn();
            onProceedToMission();
          }}
          className="w-full max-w-md py-4 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xl md:text-2xl font-['Fredoka'] border-4 border-amber-600 shadow-xl flex items-center justify-center gap-3 cursor-pointer transform hover:scale-103 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>LANJUT KE MISI TRUK</span>
        </button>
      </div>
    </div>
  );
};
