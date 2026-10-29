import React from 'react';

interface Props {
  actionState?: 'idle' | 'spinning' | 'celebrate';
  isAnimated?: boolean;
  className?: string;
}

export const CementMixerTruck: React.FC<Props> = ({
  actionState = 'idle',
  isAnimated = false,
  className = 'w-full h-auto max-w-lg',
}) => {
  const isSpinning = actionState === 'spinning' || isAnimated;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="mixerCab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="mixerDrum" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="mixerWindow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#BFDBFE" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="270" cy="295" rx="220" ry="16" fill="#0F172A" opacity="0.2" />

        {/* Chassis */}
        <rect x="75" y="215" width="370" height="32" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="4" />
        <rect x="230" y="222" width="60" height="18" rx="6" fill="#64748B" />

        {/* Dispensing Chute at rear */}
        <g id="chute">
          <path d="M 70 170 L 105 190 L 95 210 L 60 190 Z" fill="#64748B" stroke="#334155" strokeWidth="3" />
          <path d="M 50 185 L 75 225 L 60 230 L 35 190 Z" fill="#94A3B8" stroke="#475569" strokeWidth="2.5" />
          {/* Concrete drip */}
          <circle cx="48" cy="240" r="5" fill="#64748B" />
        </g>

        {/* Rotating Concrete Mixer Drum */}
        <g
          className={`origin-[200px_165px] transition-transform ${
            isSpinning ? 'animate-pulse' : ''
          }`}
        >
          {/* Drum Pedestal Support */}
          <polygon points="120,215 140,165 170,215" fill="#475569" stroke="#1E293B" strokeWidth="3" />
          <polygon points="260,215 280,175 300,215" fill="#475569" stroke="#1E293B" strokeWidth="3" />

          {/* Drum Ellipsoidal Barrel */}
          <g>
            {/* Drum base polygon (cone + cylinder combo) */}
            <path
              d="M 100 170 L 170 115 Q 260 100 310 145 L 320 185 Q 260 230 170 215 L 100 170 Z"
              fill="url(#mixerDrum)"
              stroke="#047857"
              strokeWidth="5"
            />

            {/* Spiral Stripes across the drum */}
            <path
              d="M 125 155 Q 180 120 220 180 Q 250 215 285 160"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M 155 175 Q 210 135 250 175 Q 275 205 305 170"
              stroke="#FDE047"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 110 165 Q 150 140 180 185 Q 210 215 240 170"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Front drum collar */}
            <ellipse cx="315" cy="165" rx="14" ry="24" fill="#047857" stroke="#064E3B" strokeWidth="3" />
          </g>

          {/* Swirl rotation arrows when active */}
          {isSpinning && (
            <g className="animate-spin origin-[210px_165px]" style={{ transformOrigin: '210px 165px' }}>
              <circle cx="210" cy="165" r="32" stroke="#FEF08A" strokeWidth="4" strokeDasharray="16 16" fill="none" />
            </g>
          )}
        </g>

        {/* Cab Front */}
        <g id="mixer-cab">
          <path
            d="M 320 220 L 320 120 L 385 120 Q 425 120 445 155 L 475 205 Q 480 220 460 220 Z"
            fill="url(#mixerCab)"
            stroke="#0369A1"
            strokeWidth="5"
          />

          {/* Windshield */}
          <path
            d="M 335 132 L 380 132 Q 410 132 428 160 L 445 190 L 335 190 Z"
            fill="url(#mixerWindow)"
            stroke="#0284C7"
            strokeWidth="3.5"
          />

          {/* Friendly Eyes */}
          <circle cx="365" cy="162" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <circle cx="367" cy="162" r="8" fill="#1E293B" />
          <circle cx="370" cy="158" r="3.5" fill="#FFFFFF" />

          <circle cx="405" cy="162" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <circle cx="407" cy="162" r="8" fill="#1E293B" />
          <circle cx="410" cy="158" r="3.5" fill="#FFFFFF" />

          {/* Cheeks */}
          <ellipse cx="348" cy="178" rx="8" ry="4" fill="#F43F5E" opacity="0.6" />
          <ellipse cx="422" cy="178" rx="8" ry="4" fill="#F43F5E" opacity="0.6" />

          {/* Bumper */}
          <rect x="445" y="208" width="42" height="24" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
          <path d="M 452 216 Q 466 226 480 216" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Headlights */}
          <circle cx="465" cy="195" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="465" cy="195" r="6" fill="#FDE047" />

          {/* Roof Light */}
          <rect x="355" y="110" width="30" height="10" rx="5" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
        </g>

        {/* Wheels */}
        <g className={isSpinning ? 'animate-spin origin-[130px_250px]' : ''} style={{ transformOrigin: '130px 250px' }}>
          <circle cx="130" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="130" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="130" cy="250" r="10" fill="#CBD5E1" />
        </g>

        <g className={isSpinning ? 'animate-spin origin-[225px_250px]' : ''} style={{ transformOrigin: '225px 250px' }}>
          <circle cx="225" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="225" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="225" cy="250" r="10" fill="#CBD5E1" />
        </g>

        <g className={isSpinning ? 'animate-spin origin-[410px_250px]' : ''} style={{ transformOrigin: '410px 250px' }}>
          <circle cx="410" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="410" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="410" cy="250" r="10" fill="#CBD5E1" />
        </g>
      </svg>
    </div>
  );
};
