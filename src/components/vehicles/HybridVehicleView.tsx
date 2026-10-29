import React, { useState } from 'react';
import { VehicleId, VisualMode } from '../../types';
import { VehicleRenderer } from './VehicleRenderer';
import { Construction3DView } from '../3d/Construction3DView';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  vehicleId: VehicleId;
  visualMode: VisualMode;
  actionState?: 'idle' | 'driving' | 'dumping' | 'digging' | 'spinning' | 'stop' | 'celebrate' | 'bed-open';
  isCalmMode?: boolean;
  className?: string;
  onToggleVisualMode?: () => void;
  showToggleBadge?: boolean;
}

export const HybridVehicleView: React.FC<Props> = ({
  vehicleId,
  visualMode,
  actionState = 'idle',
  isCalmMode = false,
  className,
  onToggleVisualMode,
}) => {
  const [is2dBedOpen, setIs2dBedOpen] = useState(false);

  const handle2dToggleBed = () => {
    soundEngine.playHorn();
    const next = !is2dBedOpen;
    setIs2dBedOpen(next);
    if (next) {
      soundEngine.playDumpBed();
    } else {
      soundEngine.playPop();
    }
  };

  const effective2dAction = is2dBedOpen ? 'bed-open' : actionState;

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Mode or 2D Mode View — Clean and Uncluttered */}
      {visualMode === '3d' ? (
        <Construction3DView
          vehicleId={vehicleId}
          actionState={actionState}
          isCalmMode={isCalmMode}
          className={className}
          onFallbackTo2D={onToggleVisualMode}
        />
      ) : (
        <div className="w-full flex flex-col items-center">
          <div
            onClick={handle2dToggleBed}
            className="w-full flex justify-center cursor-pointer active:scale-98 transition-transform"
            title="Klik truk untuk membuka atau menutup bak!"
          >
            <VehicleRenderer
              vehicleId={vehicleId}
              actionState={effective2dAction}
              isAnimated={actionState !== 'idle' && !isCalmMode}
              className="w-full max-w-lg h-auto"
              onClick={handle2dToggleBed}
            />
          </div>
        </div>
      )}
    </div>
  );
};
