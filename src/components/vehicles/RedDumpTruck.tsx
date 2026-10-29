import React from 'react';

interface Props {
  actionState?: 'idle' | 'driving' | 'stop' | 'celebrate';
  isAnimated?: boolean;
  className?: string;
}

export const RedDumpTruck: React.FC<Props> = ({
  actionState = 'idle',
  isAnimated = false,
  className = 'w-full h-auto max-w-lg',
}) => {
  const isDriving = actionState === 'driving' || isAnimated;
  const isStopped = actionState === 'stop';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="redCab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="redBed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="sandMound" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="redWindow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0FDF4" />
            <stop offset="100%" stopColor="#BBF7D0" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="270" cy="295" rx="225" ry="16" fill="#0F172A" opacity="0.22" />

        {/* Chassis */}
        <rect x="70" y="215" width="375" height="32" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="4" />
        <rect x="180" y="222" width="60" height="18" rx="6" fill="#475569" />

        {/* Chrome Exhaust Pipe */}
        <path d="M 395 110 L 395 190 L 380 190 L 380 110 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="3" />
        <ellipse cx="387" cy="106" rx="14" ry="6" fill="#CBD5E1" />
        {isDriving && (
          <g className="animate-pulse">
            <circle cx="387" cy="85" r="10" fill="#CBD5E1" opacity="0.6" />
            <circle cx="395" cy="62" r="15" fill="#E2E8F0" opacity="0.5" />
          </g>
        )}

        {/* Sand Bed and Sand Mound */}
        <g id="sand-load">
          {/* Mound of Golden Sand */}
          <path
            d="M 90 120 Q 140 70 200 75 Q 260 70 300 120 Z"
            fill="url(#sandMound)"
            stroke="#B45309"
            strokeWidth="3.5"
          />
          {/* Sand grains / speckles */}
          <circle cx="160" cy="95" r="3" fill="#92400E" />
          <circle cx="210" cy="90" r="3.5" fill="#92400E" />
          <circle cx="240" cy="100" r="2.5" fill="#92400E" />
          <circle cx="180" cy="105" r="3" fill="#92400E" />

          {/* Dump Bed Box */}
          <path
            d="M 80 120 L 305 120 L 315 220 L 85 220 Z"
            fill="url(#redBed)"
            stroke="#991B1B"
            strokeWidth="5"
          />
          <rect x="76" y="112" width="234" height="14" rx="4" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="3" />
          <line x1="140" y1="125" x2="145" y2="215" stroke="#7F1D1D" strokeWidth="6" strokeLinecap="round" />
          <line x1="200" y1="125" x2="205" y2="215" stroke="#7F1D1D" strokeWidth="6" strokeLinecap="round" />
          <line x1="260" y1="125" x2="265" y2="215" stroke="#7F1D1D" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Cab Front */}
        <g id="red-truck-cab">
          <path
            d="M 320 220 L 320 120 L 390 120 Q 430 120 450 155 L 478 205 Q 482 220 460 220 Z"
            fill="url(#redCab)"
            stroke="#991B1B"
            strokeWidth="5"
          />

          {/* Windshield */}
          <path
            d="M 335 132 L 385 132 Q 415 132 432 160 L 448 190 L 335 190 Z"
            fill="url(#redWindow)"
            stroke="#16A34A"
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
          <ellipse cx="350" cy="178" rx="8" ry="4" fill="#FECDD3" />
          <ellipse cx="420" cy="178" rx="8" ry="4" fill="#FECDD3" />

          {/* Bumper with cute smile */}
          <rect x="448" y="208" width="40" height="24" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
          <path d="M 456 218 Q 468 228 480 218" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Headlights */}
          <circle cx="468" cy="195" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="468" cy="195" r="6" fill="#FDE047" />

          {/* Stop / Brake light badge if stopped */}
          {isStopped && (
            <g className="animate-bounce">
              <circle cx="70" cy="150" r="16" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
              <text x="70" y="155" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">STOP</text>
            </g>
          )}

          {/* Roof siren bar */}
          <rect x="350" y="110" width="38" height="10" rx="5" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
        </g>

        {/* Wheels */}
        <g className={isDriving ? 'animate-spin origin-[130px_250px]' : ''} style={{ transformOrigin: '130px 250px' }}>
          <circle cx="130" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="130" cy="250" r="26" fill="#94A3B8" stroke="#475569" strokeWidth="4" />
          <circle cx="130" cy="250" r="10" fill="#E2E8F0" />
        </g>

        <g className={isDriving ? 'animate-spin origin-[225px_250px]' : ''} style={{ transformOrigin: '225px 250px' }}>
          <circle cx="225" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="225" cy="250" r="26" fill="#94A3B8" stroke="#475569" strokeWidth="4" />
          <circle cx="225" cy="250" r="10" fill="#E2E8F0" />
        </g>

        <g className={isDriving ? 'animate-spin origin-[410px_250px]' : ''} style={{ transformOrigin: '410px 250px' }}>
          <circle cx="410" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="410" cy="250" r="26" fill="#94A3B8" stroke="#475569" strokeWidth="4" />
          <circle cx="410" cy="250" r="10" fill="#E2E8F0" />
        </g>
      </svg>
    </div>
  );
};
