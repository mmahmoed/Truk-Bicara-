import React from 'react';

interface Props {
  actionState?: 'idle' | 'digging' | 'celebrate';
  isAnimated?: boolean;
  className?: string;
}

export const OrangeExcavator: React.FC<Props> = ({
  actionState = 'idle',
  isAnimated = false,
  className = 'w-full h-auto max-w-lg',
}) => {
  const isDigging = actionState === 'digging' || isAnimated;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xl select-none"
      >
        <defs>
          <linearGradient id="excavatorOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="excavatorDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="excavatorWindow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="100%" stopColor="#7DD3FC" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="270" cy="295" rx="210" ry="16" fill="#0F172A" opacity="0.22" />

        {/* Caterpillar Tracks (Underneath) */}
        <g id="crawler-tracks">
          {/* Track Belt Outer Pill */}
          <rect x="80" y="235" width="280" height="52" rx="26" fill="#1E293B" stroke="#0F172A" strokeWidth="6" />
          {/* Inner track loop */}
          <rect x="98" y="247" width="244" height="28" rx="14" fill="#334155" />

          {/* 4 Track Idler / Road Wheels */}
          {[125, 185, 245, 305].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="261" r="18" fill="#475569" stroke="#1E293B" strokeWidth="3" />
              <circle cx={cx} cy="261" r="7" fill="#CBD5E1" />
            </g>
          ))}
          {/* Small top rollers */}
          <circle cx="155" cy="242" r="5" fill="#64748B" />
          <circle cx="275" cy="242" r="5" fill="#64748B" />
        </g>

        {/* Turntable / Slew Ring Base */}
        <rect x="180" y="222" width="90" height="16" rx="4" fill="#64748B" stroke="#334155" strokeWidth="3" />

        {/* Main Excavator Body / Cabin */}
        <g id="excavator-cab">
          {/* Body shell */}
          <path
            d="M 120 222 L 120 145 Q 120 130 135 130 L 250 130 Q 265 130 270 145 L 290 190 Q 295 222 280 222 Z"
            fill="url(#excavatorOrange)"
            stroke="#9A3412"
            strokeWidth="5"
          />

          {/* Counterweight at the back */}
          <path
            d="M 115 160 L 140 160 L 140 222 L 115 222 Z"
            fill="#475569"
            stroke="#1E293B"
            strokeWidth="3.5"
          />
          <line x1="122" y1="170" x2="122" y2="212" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <line x1="132" y1="170" x2="132" y2="212" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

          {/* Large Panoramic Cabin Window */}
          <path
            d="M 215 140 L 250 140 Q 262 140 268 152 L 282 195 L 215 195 Z"
            fill="url(#excavatorWindow)"
            stroke="#0284C7"
            strokeWidth="3.5"
          />

          {/* Friendly Eyes in Window */}
          <circle cx="238" cy="165" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <circle cx="240" cy="165" r="7" fill="#1E293B" />
          <circle cx="242" cy="162" r="3" fill="#FFFFFF" />

          <circle cx="265" cy="165" r="13" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <circle cx="267" cy="165" r="7" fill="#1E293B" />
          <circle cx="269" cy="162" r="3" fill="#FFFFFF" />

          {/* Rosy Cheek */}
          <ellipse cx="250" cy="180" rx="9" ry="4" fill="#F43F5E" opacity="0.5" />

          {/* Safety Roof Siren */}
          <rect x="235" y="122" width="22" height="9" rx="4" fill="#FACC15" stroke="#A16207" strokeWidth="2" />
        </g>

        {/* Articulated Digging Boom Arm + Dipper Stick + Bucket */}
        <g
          className={`origin-[280px_205px] transition-transform duration-700 ${
            isDigging ? 'rotate-12' : 'rotate-0'
          }`}
          style={{ transformOrigin: '280px 205px' }}
        >
          {/* Main Boom Arm (Segment 1) */}
          <path
            d="M 275 210 L 375 100 L 400 115 L 295 220 Z"
            fill="url(#excavatorOrange)"
            stroke="#9A3412"
            strokeWidth="4"
          />
          {/* Boom Pivot Pin */}
          <circle cx="285" cy="212" r="9" fill="#475569" stroke="#1E293B" strokeWidth="3" />
          <circle cx="285" cy="212" r="4" fill="#CBD5E1" />

          {/* Hydraulic Cylinder */}
          <line x1="295" y1="185" x2="355" y2="125" stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round" />
          <line x1="290" y1="190" x2="330" y2="150" stroke="#334155" strokeWidth="11" strokeLinecap="round" />

          {/* Dipper Stick (Segment 2) */}
          <g
            className={`origin-[385px_108px] transition-transform duration-700 ${
              isDigging ? '-rotate-25' : 'rotate-0'
            }`}
            style={{ transformOrigin: '385px 108px' }}
          >
            <path
              d="M 380 100 L 460 170 L 445 185 L 365 115 Z"
              fill="url(#excavatorOrange)"
              stroke="#9A3412"
              strokeWidth="4"
            />
            {/* Elbow joint pin */}
            <circle cx="385" cy="108" r="8" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
            <circle cx="385" cy="108" r="3" fill="#CBD5E1" />

            {/* Digging Bucket with sharp scoops */}
            <g
              className={`origin-[452px_178px] transition-transform duration-700 ${
                isDigging ? '-rotate-35' : 'rotate-0'
              }`}
              style={{ transformOrigin: '452px 178px' }}
            >
              <path
                d="M 445 170 Q 480 190 495 240 L 460 255 Q 430 215 440 180 Z"
                fill="#475569"
                stroke="#1E293B"
                strokeWidth="4"
              />
              {/* Bucket Teeth */}
              <polygon points="495,240 508,245 490,250" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
              <polygon points="488,246 501,251 483,256" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
              <polygon points="480,252 492,258 475,262" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />

              {/* Sand scooped in bucket */}
              <path d="M 452 210 Q 470 215 475 240 Q 450 235 445 215 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
            </g>
          </g>
        </g>

        {/* Sand mound on ground being dug */}
        <path
          d="M 430 295 Q 465 240 500 295 Z"
          fill="#FDE68A"
          stroke="#D97706"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};
