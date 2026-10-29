import React from 'react';

interface Props {
  actionState?: 'idle' | 'driving' | 'dumping' | 'celebrate';
  isAnimated?: boolean;
  className?: string;
  showRocks?: boolean;
}

export const YellowDumpTruck: React.FC<Props> = ({
  actionState = 'idle',
  isAnimated = false,
  className = 'w-full h-auto max-w-lg',
  showRocks = true,
}) => {
  const isDumping = actionState === 'dumping';
  const isDriving = actionState === 'driving' || isAnimated;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="yellowCab" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>
          <linearGradient id="yellowBed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="windowGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Shadow on ground */}
        <ellipse cx="270" cy="295" rx="220" ry="16" fill="#0F172A" opacity="0.2" />

        {/* Chassis / Underframe */}
        <rect x="70" y="215" width="370" height="32" rx="10" fill="#334155" stroke="#1E293B" strokeWidth="4" />
        <rect x="180" y="222" width="70" height="18" rx="6" fill="#64748B" />
        <rect x="270" y="222" width="50" height="18" rx="6" fill="#64748B" />

        {/* Exhaust Pipe & gentle puffs */}
        <path d="M 390 120 L 390 190 L 375 190 L 375 120 Z" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
        <ellipse cx="382" cy="115" rx="14" ry="6" fill="#64748B" />
        {isDriving && (
          <g className="animate-pulse">
            <circle cx="382" cy="95" r="9" fill="#CBD5E1" opacity="0.6" />
            <circle cx="390" cy="72" r="14" fill="#E2E8F0" opacity="0.5" />
            <circle cx="378" cy="46" r="18" fill="#F1F5F9" opacity="0.4" />
          </g>
        )}

        {/* Tipping Bed & Rocks Group */}
        <g
          className={`transition-transform duration-700 origin-[110px_220px] ${
            isDumping ? '-rotate-35' : 'rotate-0'
          }`}
          style={{ transformOrigin: '100px 220px' }}
        >
          {/* Rocks inside bed */}
          {showRocks && (
            <g id="rocks-cluster">
              <path
                d="M 120 115 Q 145 80 175 105 Q 205 75 235 98 Q 260 85 285 115 Z"
                fill="#78716C"
                stroke="#44403C"
                strokeWidth="3"
              />
              <circle cx="150" cy="110" r="16" fill="#A8A29E" stroke="#57534E" strokeWidth="3" />
              <circle cx="195" cy="100" r="20" fill="#78716C" stroke="#44403C" strokeWidth="3" />
              <circle cx="245" cy="112" r="18" fill="#A8A29E" stroke="#57534E" strokeWidth="3" />
              <circle cx="220" cy="122" r="12" fill="#D6D3D1" />
              <circle cx="165" cy="118" r="10" fill="#E7E5E4" />
            </g>
          )}

          {/* Dump Bed Body */}
          <path
            d="M 80 120 L 305 120 L 315 220 L 85 220 Z"
            fill="url(#yellowBed)"
            stroke="#854D0E"
            strokeWidth="5"
          />
          {/* Bed Ribs */}
          <line x1="135" y1="125" x2="140" y2="215" stroke="#A16207" strokeWidth="6" strokeLinecap="round" />
          <line x1="195" y1="125" x2="200" y2="215" stroke="#A16207" strokeWidth="6" strokeLinecap="round" />
          <line x1="255" y1="125" x2="260" y2="215" stroke="#A16207" strokeWidth="6" strokeLinecap="round" />

          {/* Upper reinforcement rim */}
          <rect x="75" y="112" width="235" height="14" rx="4" fill="#CA8A04" stroke="#854D0E" strokeWidth="4" />

          {/* If dumping, falling rocks */}
          {isDumping && (
            <g className="animate-bounce">
              <circle cx="45" cy="245" r="14" fill="#78716C" stroke="#44403C" strokeWidth="3" />
              <circle cx="20" cy="265" r="18" fill="#A8A29E" stroke="#57534E" strokeWidth="3" />
              <circle cx="55" cy="280" r="12" fill="#57534E" stroke="#292524" strokeWidth="3" />
            </g>
          )}
        </g>

        {/* Cab Front */}
        <g id="truck-cab">
          {/* Main Cab shell */}
          <path
            d="M 320 220 L 320 120 L 385 120 Q 425 120 445 155 L 475 205 Q 480 220 460 220 Z"
            fill="url(#yellowCab)"
            stroke="#854D0E"
            strokeWidth="5"
          />

          {/* Windshield / Window */}
          <path
            d="M 335 132 L 380 132 Q 410 132 428 160 L 445 190 L 335 190 Z"
            fill="url(#windowGlass)"
            stroke="#0284C7"
            strokeWidth="3.5"
          />

          {/* Friendly Friendly Big Toddler Eyes in Windshield */}
          <g>
            {/* Left Eye */}
            <circle cx="365" cy="162" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <circle cx="367" cy="162" r="8" fill="#1E293B" />
            <circle cx="370" cy="158" r="3.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="405" cy="162" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <circle cx="407" cy="162" r="8" fill="#1E293B" />
            <circle cx="410" cy="158" r="3.5" fill="#FFFFFF" />

            {/* Rosy Cheeks */}
            <ellipse cx="348" cy="178" rx="8" ry="4" fill="#F43F5E" opacity="0.6" />
            <ellipse cx="422" cy="178" rx="8" ry="4" fill="#F43F5E" opacity="0.6" />
          </g>

          {/* Friendly Front Bumper & Smile Grill */}
          <rect x="445" y="208" width="42" height="24" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
          {/* Smile curve */}
          <path d="M 452 216 Q 466 226 480 216" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Headlight (Warm Amber Glow) */}
          <circle cx="465" cy="195" r="11" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="465" cy="195" r="6" fill="#FDE047" />

          {/* Roof Light Beacons */}
          <rect x="345" y="110" width="18" height="10" rx="4" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          <rect x="375" y="110" width="18" height="10" rx="4" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
        </g>

        {/* Wheels Group (Front and Back pairs) */}
        {/* Rear Wheel 1 */}
        <g className={isDriving ? 'animate-spin origin-[130px_250px]' : ''} style={{ transformOrigin: '130px 250px' }}>
          <circle cx="130" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="130" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="130" cy="250" r="10" fill="#CBD5E1" />
          {/* Wheel treads */}
          <line x1="130" y1="212" x2="130" y2="224" stroke="#475569" strokeWidth="4" />
          <line x1="130" y1="276" x2="130" y2="288" stroke="#475569" strokeWidth="4" />
          <line x1="92" y1="250" x2="104" y2="250" stroke="#475569" strokeWidth="4" />
          <line x1="156" y1="250" x2="168" y2="250" stroke="#475569" strokeWidth="4" />
        </g>

        {/* Rear Wheel 2 */}
        <g className={isDriving ? 'animate-spin origin-[225px_250px]' : ''} style={{ transformOrigin: '225px 250px' }}>
          <circle cx="225" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="225" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="225" cy="250" r="10" fill="#CBD5E1" />
          <line x1="225" y1="212" x2="225" y2="224" stroke="#475569" strokeWidth="4" />
          <line x1="225" y1="276" x2="225" y2="288" stroke="#475569" strokeWidth="4" />
          <line x1="187" y1="250" x2="199" y2="250" stroke="#475569" strokeWidth="4" />
          <line x1="251" y1="250" x2="263" y2="250" stroke="#475569" strokeWidth="4" />
        </g>

        {/* Front Wheel */}
        <g className={isDriving ? 'animate-spin origin-[410px_250px]' : ''} style={{ transformOrigin: '410px 250px' }}>
          <circle cx="410" cy="250" r="42" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          <circle cx="410" cy="250" r="26" fill="#64748B" stroke="#334155" strokeWidth="4" />
          <circle cx="410" cy="250" r="10" fill="#CBD5E1" />
          <line x1="410" y1="212" x2="410" y2="224" stroke="#475569" strokeWidth="4" />
          <line x1="410" y1="276" x2="410" y2="288" stroke="#475569" strokeWidth="4" />
          <line x1="372" y1="250" x2="384" y2="250" stroke="#475569" strokeWidth="4" />
          <line x1="436" y1="250" x2="448" y2="250" stroke="#475569" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
};
