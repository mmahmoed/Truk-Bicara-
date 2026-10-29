import React from 'react';
import { VehicleId } from '../../types';
import { YellowDumpTruck } from './YellowDumpTruck';
import { RedDumpTruck } from './RedDumpTruck';
import { OrangeExcavator } from './OrangeExcavator';
import { CementMixerTruck } from './CementMixerTruck';

interface Props {
  vehicleId: VehicleId;
  actionState?: 'idle' | 'driving' | 'dumping' | 'digging' | 'spinning' | 'stop' | 'celebrate';
  isAnimated?: boolean;
  className?: string;
  showRocks?: boolean;
}

export const VehicleRenderer: React.FC<Props> = ({
  vehicleId,
  actionState = 'idle',
  isAnimated = false,
  className = 'w-full max-w-xl h-auto',
  showRocks = true,
}) => {
  switch (vehicleId) {
    case 'truk-merah':
      return (
        <RedDumpTruck
          actionState={actionState === 'stop' ? 'stop' : actionState === 'driving' ? 'driving' : 'idle'}
          isAnimated={isAnimated}
          className={className}
        />
      );
    case 'ekskavator':
      return (
        <OrangeExcavator
          actionState={actionState === 'digging' ? 'digging' : 'idle'}
          isAnimated={isAnimated}
          className={className}
        />
      );
    case 'truk-molen':
      return (
        <CementMixerTruck
          actionState={actionState === 'spinning' ? 'spinning' : 'idle'}
          isAnimated={isAnimated}
          className={className}
        />
      );
    case 'truk-kuning':
    default:
      return (
        <YellowDumpTruck
          actionState={actionState === 'dumping' ? 'dumping' : actionState === 'driving' ? 'driving' : 'idle'}
          isAnimated={isAnimated}
          className={className}
          showRocks={showRocks}
        />
      );
  }
};
