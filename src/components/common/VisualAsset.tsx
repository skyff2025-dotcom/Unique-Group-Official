import React from 'react';

interface VisualAssetProps {
  type: 'hero' | 'realty' | 'insurance' | 'finance' | 'villa' | 'commercial' | 'land' | 'office' | 'estate' | 'meeting' | 'handshake';
  className?: string;
  alt?: string;
}

export const VisualAsset: React.FC<VisualAssetProps> = ({ type, className = '', alt = 'Unique Group Visual' }) => {
  return (
    <div className={`relative overflow-hidden w-full h-full select-none ${className}`} role="img" aria-label={alt}>
      {type === 'hero' && (
        <svg viewBox="0 0 1600 900" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="heroSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#040914" />
              <stop offset="45%" stopColor="#0a192f" />
              <stop offset="75%" stopColor="#142c4c" />
              <stop offset="100%" stopColor="#243854" />
            </linearGradient>
            <linearGradient id="heroBuilding" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d1f38" />
              <stop offset="50%" stopColor="#152e50" />
              <stop offset="100%" stopColor="#0b1b31" />
            </linearGradient>
            <linearGradient id="warmWindow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#faecd0" />
              <stop offset="50%" stopColor="#e2c98d" />
              <stop offset="100%" stopColor="#c5a059" />
            </linearGradient>
            <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4b46c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#c5a059" stopOpacity="0.0" />
            </linearGradient>
            <radialGradient id="twilightSun" cx="65%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c5a059" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#1b355a" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0a192f" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep Navy Twilight Sky */}
          <rect width="1600" height="900" fill="url(#heroSky)" />
          <rect width="1600" height="900" fill="url(#twilightSun)" />

          {/* Subtle architectural grid lines */}
          <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="1">
            <line x1="200" y1="0" x2="200" y2="900" />
            <line x1="400" y1="0" x2="400" y2="900" />
            <line x1="600" y1="0" x2="600" y2="900" />
            <line x1="800" y1="0" x2="800" y2="900" />
            <line x1="1000" y1="0" x2="1000" y2="900" />
            <line x1="1200" y1="0" x2="1200" y2="900" />
            <line x1="1400" y1="0" x2="1400" y2="900" />
          </g>

          {/* Distant Hills / Narmada Horizon */}
          <path d="M0,620 Q 300,560 650,600 T 1200,580 T 1600,610 L 1600,900 L 0,900 Z" fill="#081426" opacity="0.8" />
          <path d="M0,660 Q 400,610 850,640 T 1600,630 L 1600,900 L 0,900 Z" fill="#0b1d36" opacity="0.9" />

          {/* Contemporary Villa Silhouette & Architecture (Right Hand Side) */}
          <g transform="translate(680, 240)">
            {/* Main Structure Base */}
            <rect x="180" y="160" width="620" height="420" rx="4" fill="url(#heroBuilding)" stroke="#2b4970" strokeWidth="1.5" />
            {/* Cantilever Upper Floor */}
            <rect x="80" y="80" width="540" height="200" rx="2" fill="#152b47" stroke="#365b8a" strokeWidth="1.5" />
            
            {/* Roof Slab & Architectural Pergola */}
            <rect x="60" y="60" width="680" height="20" rx="2" fill="#c5a059" opacity="0.8" />
            <line x1="120" y1="60" x2="120" y2="20" stroke="#c5a059" strokeWidth="3" opacity="0.6" />
            <line x1="180" y1="60" x2="180" y2="20" stroke="#c5a059" strokeWidth="3" opacity="0.6" />
            <line x1="240" y1="60" x2="240" y2="20" stroke="#c5a059" strokeWidth="3" opacity="0.6" />
            <line x1="300" y1="60" x2="300" y2="20" stroke="#c5a059" strokeWidth="3" opacity="0.6" />
            <line x1="360" y1="60" x2="360" y2="20" stroke="#c5a059" strokeWidth="3" opacity="0.6" />

            {/* Illuminated Panoramic Windows (Warm Glow) */}
            <rect x="110" y="105" width="220" height="150" fill="url(#warmWindow)" opacity="0.9" rx="2" />
            <line x1="220" y1="105" x2="220" y2="255" stroke="#0a192f" strokeWidth="4" />
            <line x1="110" y1="180" x2="330" y2="180" stroke="#0a192f" strokeWidth="3" />

            {/* Upper Balcony Glass Railing */}
            <rect x="360" y="130" width="230" height="120" fill="url(#warmWindow)" opacity="0.75" rx="2" />
            <line x1="475" y1="130" x2="475" y2="250" stroke="#0a192f" strokeWidth="4" />

            {/* Ground Level Expansive Glazing */}
            <rect x="220" y="320" width="400" height="240" fill="url(#warmWindow)" opacity="0.85" rx="2" />
            <line x1="320" y1="320" x2="320" y2="560" stroke="#0a192f" strokeWidth="4" />
            <line x1="420" y1="320" x2="420" y2="560" stroke="#0a192f" strokeWidth="4" />
            <line x1="520" y1="320" x2="520" y2="560" stroke="#0a192f" strokeWidth="4" />

            {/* Warm Interior Silhouettes */}
            <circle cx="280" cy="400" r="16" fill="#0d1b2e" opacity="0.7" />
            <path d="M260,450 C260,425 300,425 300,450 Z" fill="#0d1b2e" opacity="0.7" />

            {/* Gold Edge Highlights */}
            <line x1="80" y1="80" x2="620" y2="80" stroke="#d4b46c" strokeWidth="2" opacity="0.7" />
            <line x1="180" y1="280" x2="800" y2="280" stroke="#d4b46c" strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* Foreground Lawn, Terrace & Reflecting Water */}
          <polygon points="0,740 1600,680 1600,900 0,900" fill="#060e18" />
          <polygon points="650,720 1550,680 1600,900 550,900" fill="#0a1626" />
          {/* Reflecting Pool with Gold Shimmer */}
          <polygon points="750,750 1450,710 1520,860 700,880" fill="#0e233d" stroke="#c5a059" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="800" y1="780" x2="1350" y2="745" stroke="#c5a059" strokeWidth="2" opacity="0.3" />
          <line x1="820" y1="820" x2="1400" y2="785" stroke="#c5a059" strokeWidth="2" opacity="0.2" />

          {/* Tropical Landscaping Silhouettes (Gujarat style Royal Palms & Frangipani) */}
          <g fill="#040a12" opacity="0.95">
            {/* Tall Palm 1 */}
            <path d="M520,780 Q 535,520 540,320 L 544,320 Q 541,520 528,780 Z" />
            <path d="M540,320 Q 460,280 410,340 Q 470,300 540,320 Z" />
            <path d="M540,320 Q 480,240 450,230 Q 500,260 540,320 Z" />
            <path d="M540,320 Q 545,210 560,200 Q 555,250 540,320 Z" />
            <path d="M540,320 Q 610,240 640,260 Q 590,275 540,320 Z" />
            <path d="M540,320 Q 620,310 650,360 Q 590,330 540,320 Z" />

            {/* Tall Palm 2 */}
            <path d="M600,770 Q 615,550 625,380 L 629,380 Q 620,550 608,770 Z" />
            <path d="M625,380 Q 560,320 530,360 Q 580,335 625,380 Z" />
            <path d="M625,380 Q 640,290 660,280 Q 645,330 625,380 Z" />
            <path d="M625,380 Q 690,320 720,350 Q 670,350 625,380 Z" />
          </g>

          {/* Architectural Light Cones */}
          <polygon points="900,560 840,780 960,780" fill="url(#goldBeam)" />
          <polygon points="1100,560 1040,780 1160,780" fill="url(#goldBeam)" />
        </svg>
      )}

      {type === 'realty' && (
        <svg viewBox="0 0 800 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="realtySky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1b355a" />
              <stop offset="60%" stopColor="#2c5282" />
              <stop offset="100%" stopColor="#e2c98d" />
            </linearGradient>
            <linearGradient id="facadeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f223d" />
              <stop offset="100%" stopColor="#1c3b63" />
            </linearGradient>
            <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#e2c98d" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#realtySky)" />
          {/* Architectural High-Rise / Showroom Geometry */}
          <polygon points="120,600 120,180 340,120 340,600" fill="url(#facadeGrad)" stroke="#c5a059" strokeWidth="1" />
          {/* Glass Panels */}
          <g fill="#faecd0" opacity="0.4">
            <rect x="145" y="160" width="70" height="40" />
            <rect x="235" y="145" width="75" height="40" />
            <rect x="145" y="220" width="70" height="45" />
            <rect x="235" y="205" width="75" height="45" />
            <rect x="145" y="285" width="70" height="50" />
            <rect x="235" y="270" width="75" height="50" />
            <rect x="145" y="355" width="70" height="55" />
            <rect x="235" y="340" width="75" height="55" />
            <rect x="145" y="430" width="70" height="60" />
            <rect x="235" y="415" width="75" height="60" />
          </g>
          {/* Second Tower */}
          <polygon points="340,600 340,80 620,140 620,600" fill="#0a192f" stroke="#e2c98d" strokeWidth="1.5" />
          <line x1="340" y1="80" x2="620" y2="140" stroke="url(#goldAcc)" strokeWidth="4" />
          <g fill="#c5a059" opacity="0.3">
            <rect x="370" y="130" width="95" height="65" />
            <rect x="490" y="155" width="105" height="65" />
            <rect x="370" y="220" width="95" height="70" />
            <rect x="490" y="245" width="105" height="70" />
            <rect x="370" y="315" width="95" height="75" />
            <rect x="490" y="340" width="105" height="75" />
            <rect x="370" y="415" width="95" height="80" />
            <rect x="490" y="440" width="105" height="80" />
          </g>
          {/* Ground Boulevard */}
          <polygon points="0,520 800,500 800,600 0,600" fill="#050e1a" />
          <line x1="0" y1="520" x2="800" y2="500" stroke="#c5a059" strokeWidth="2" opacity="0.6" />
        </svg>
      )}

      {type === 'insurance' && (
        <svg viewBox="0 0 800 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="insSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#081528" />
              <stop offset="50%" stopColor="#122a4d" />
              <stop offset="100%" stopColor="#1f4270" />
            </linearGradient>
            <radialGradient id="shieldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c5a059" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#081528" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="600" fill="url(#insSky)" />
          <circle cx="400" cy="300" r="280" fill="url(#shieldGlow)" />

          {/* Protective Emblem Crest Geometry */}
          <g transform="translate(400, 270)">
            {/* Concentric rings */}
            <circle cx="0" cy="0" r="160" fill="none" stroke="#c5a059" strokeWidth="1" strokeDasharray="6 6" opacity="0.4" />
            <circle cx="0" cy="0" r="130" fill="none" stroke="#e2c98d" strokeWidth="1.5" opacity="0.6" />
            
            {/* Majestic Shield */}
            <path d="M0,-100 L70,-60 L70,30 Q70,95 0,135 Q-70,95 -70,30 L-70,-60 Z" fill="#0b1e38" stroke="#c5a059" strokeWidth="3" />
            <path d="M0,-85 L55,-50 L55,25 Q55,80 0,115 Q-55,80 -55,25 L-55,-50 Z" fill="none" stroke="#d4b46c" strokeWidth="1" opacity="0.7" />

            {/* Inner Crest Icon: Family Tree / Protective Bloom */}
            <circle cx="0" cy="-20" r="12" fill="#c5a059" />
            <path d="M-22,25 C-22,0 22,0 22,25 Z" fill="#c5a059" />
            <circle cx="-28" cy="2" r="9" fill="#e2c98d" />
            <path d="M-44,38 C-44,20 -12,20 -12,38 Z" fill="#e2c98d" />
            <circle cx="28" cy="2" r="9" fill="#e2c98d" />
            <path d="M12,38 C12,20 44,20 44,38 Z" fill="#e2c98d" />

            {/* Golden Star Accent on Top */}
            <polygon points="0,-125 5,-110 20,-110 8,-100 12,-85 0,-95 -12,-85 -8,-100 -20,-110 -5,-110" fill="#f7f3e9" />
          </g>

          {/* Modern Architectural Border Flourish */}
          <line x1="80" y1="520" x2="720" y2="520" stroke="#c5a059" strokeWidth="1" opacity="0.3" />
          <circle cx="400" cy="520" r="4" fill="#c5a059" />
        </svg>
      )}

      {type === 'finance' && (
        <svg viewBox="0 0 800 600" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="finSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#061222" />
              <stop offset="50%" stopColor="#0e2340" />
              <stop offset="100%" stopColor="#18365f" />
            </linearGradient>
            <linearGradient id="goldFin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3e5c0" />
              <stop offset="50%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#8c6e2e" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#finSky)" />
          
          {/* Blueprint Grid Architecture */}
          <g stroke="#244570" strokeWidth="0.8" opacity="0.5">
            <line x1="100" y1="0" x2="100" y2="600" />
            <line x1="200" y1="0" x2="200" y2="600" />
            <line x1="300" y1="0" x2="300" y2="600" />
            <line x1="400" y1="0" x2="400" y2="600" />
            <line x1="500" y1="0" x2="500" y2="600" />
            <line x1="600" y1="0" x2="600" y2="600" />
            <line x1="700" y1="0" x2="700" y2="600" />
            <line x1="0" y1="150" x2="800" y2="150" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="0" y1="450" x2="800" y2="450" />
          </g>

          {/* Pillars of Financial Growth / Rising Architecture */}
          <g transform="translate(180, 180)">
            {/* Pillar 1 */}
            <rect x="40" y="240" width="60" height="160" rx="4" fill="#132c4e" stroke="#c5a059" strokeWidth="1.5" />
            <line x1="40" y1="260" x2="100" y2="260" stroke="#c5a059" strokeWidth="1" />
            
            {/* Pillar 2 */}
            <rect x="140" y="170" width="60" height="230" rx="4" fill="#18365f" stroke="#c5a059" strokeWidth="1.5" />
            <line x1="140" y1="190" x2="200" y2="190" stroke="#c5a059" strokeWidth="1" />

            {/* Pillar 3 */}
            <rect x="240" y="100" width="60" height="300" rx="4" fill="#204576" stroke="#e2c98d" strokeWidth="1.5" />
            <line x1="240" y1="120" x2="300" y2="120" stroke="#e2c98d" strokeWidth="1" />

            {/* Pillar 4 (Apex) */}
            <rect x="340" y="30" width="60" height="370" rx="4" fill="url(#goldFin)" />
            <line x1="340" y1="50" x2="400" y2="50" stroke="#0a192f" strokeWidth="2" />

            {/* Upward Growth Ascent Trajectory */}
            <path d="M60,220 Q 200,120 370,15" fill="none" stroke="#faecd0" strokeWidth="3" strokeDasharray="6 4" />
            <polygon points="370,15 350,15 365,35" fill="#faecd0" />
          </g>
        </svg>
      )}

      {type === 'villa' && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c1d35" />
              <stop offset="60%" stopColor="#1a3860" />
              <stop offset="100%" stopColor="#325078" />
            </linearGradient>
            <linearGradient id="vGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7e6c4" />
              <stop offset="100%" stopColor="#c5a059" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#vSky)" />
          {/* Villa facade */}
          <rect x="100" y="140" width="400" height="200" rx="3" fill="#0f2647" stroke="#254a7c" strokeWidth="1.5" />
          <rect x="140" y="90" width="320" height="100" rx="2" fill="#14325a" stroke="#c5a059" strokeWidth="1" />
          <rect x="120" y="80" width="360" height="12" fill="#c5a059" />
          {/* Warm lit windows */}
          <rect x="160" y="115" width="120" height="60" rx="2" fill="url(#vGlow)" opacity="0.9" />
          <line x1="220" y1="115" x2="220" y2="175" stroke="#0f2647" strokeWidth="3" />
          <rect x="310" y="115" width="120" height="60" rx="2" fill="url(#vGlow)" opacity="0.85" />
          <line x1="370" y1="115" x2="370" y2="175" stroke="#0f2647" strokeWidth="3" />
          <rect x="140" y="220" width="220" height="120" rx="2" fill="url(#vGlow)" opacity="0.95" />
          <line x1="250" y1="220" x2="250" y2="340" stroke="#0f2647" strokeWidth="4" />
          <rect x="380" y="240" width="100" height="100" rx="2" fill="#071324" stroke="#c5a059" strokeWidth="2" />
          {/* Garden foreground */}
          <polygon points="0,330 600,310 600,400 0,400" fill="#071322" />
          <circle cx="90" cy="310" r="30" fill="#0a1d33" />
          <circle cx="510" cy="300" r="35" fill="#0a1d33" />
        </svg>
      )}

      {type === 'commercial' && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#102542" />
              <stop offset="100%" stopColor="#214470" />
            </linearGradient>
            <linearGradient id="cGlass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f3e1b7" />
              <stop offset="50%" stopColor="#e2c98d" />
              <stop offset="100%" stopColor="#faecd0" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#cSky)" />
          {/* Modern Showroom Facade */}
          <rect x="60" y="80" width="480" height="280" rx="2" fill="#0a1a30" stroke="#c5a059" strokeWidth="1.5" />
          {/* Upper Office Floor */}
          <rect x="80" y="100" width="440" height="80" fill="#132c4e" />
          <line x1="160" y1="100" x2="160" y2="180" stroke="#254e80" strokeWidth="2" />
          <line x1="240" y1="100" x2="240" y2="180" stroke="#254e80" strokeWidth="2" />
          <line x1="320" y1="100" x2="320" y2="180" stroke="#254e80" strokeWidth="2" />
          <line x1="400" y1="100" x2="400" y2="180" stroke="#254e80" strokeWidth="2" />
          <line x1="480" y1="100" x2="480" y2="180" stroke="#254e80" strokeWidth="2" />
          {/* Ground Showroom Full Glazing */}
          <rect x="80" y="200" width="440" height="150" fill="url(#cGlass)" opacity="0.9" />
          <line x1="200" y1="200" x2="200" y2="350" stroke="#0a1a30" strokeWidth="5" />
          <line x1="320" y1="200" x2="320" y2="350" stroke="#0a1a30" strokeWidth="5" />
          <line x1="440" y1="200" x2="440" y2="350" stroke="#0a1a30" strokeWidth="5" />
          {/* Gold header fascia */}
          <rect x="60" y="65" width="480" height="15" fill="#c5a059" />
          {/* Road */}
          <rect x="0" y="360" width="600" height="40" fill="#050e1a" />
          <line x1="0" y1="360" x2="600" y2="360" stroke="#c5a059" strokeWidth="2" opacity="0.6" />
        </svg>
      )}

      {type === 'land' && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a3a60" />
              <stop offset="60%" stopColor="#2d5e96" />
              <stop offset="100%" stopColor="#e8cf96" />
            </linearGradient>
            <linearGradient id="lField" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#183625" />
              <stop offset="50%" stopColor="#214932" />
              <stop offset="100%" stopColor="#11291b" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#lSky)" />
          {/* Soft rolling hills */}
          <path d="M0,220 Q 150,180 320,205 T 600,190 L 600,400 L 0,400 Z" fill="#0f2638" />
          <path d="M0,250 Q 220,210 420,240 T 600,230 L 600,400 L 0,400 Z" fill="url(#lField)" />
          
          {/* Golden Demarcation Boundary Lines (NA Plot Grid) */}
          <polygon points="120,380 480,350 420,270 180,285" fill="#c5a059" fillOpacity="0.15" stroke="#c5a059" strokeWidth="2" strokeDasharray="6 4" />
          {/* Corner Marker Pegs */}
          <circle cx="120" cy="380" r="5" fill="#e2c98d" stroke="#0a192f" strokeWidth="1.5" />
          <circle cx="480" cy="350" r="5" fill="#e2c98d" stroke="#0a192f" strokeWidth="1.5" />
          <circle cx="420" cy="270" r="5" fill="#e2c98d" stroke="#0a192f" strokeWidth="1.5" />
          <circle cx="180" cy="285" r="5" fill="#e2c98d" stroke="#0a192f" strokeWidth="1.5" />
        </svg>
      )}

      {type === 'office' && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#08182d" />
              <stop offset="100%" stopColor="#153258" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#oSky)" />
          {/* Panoramic Office Window */}
          <rect x="80" y="40" width="440" height="240" fill="#1b3963" stroke="#c5a059" strokeWidth="1" />
          <line x1="220" y1="40" x2="220" y2="280" stroke="#0b1e38" strokeWidth="6" />
          <line x1="360" y1="40" x2="360" y2="280" stroke="#0b1e38" strokeWidth="6" />
          {/* Executive Desk */}
          <polygon points="120,380 480,380 440,290 160,290" fill="#0b192c" stroke="#c5a059" strokeWidth="1.5" />
          <rect x="180" y="270" width="240" height="20" rx="3" fill="#c5a059" opacity="0.9" />
          {/* Modern office chair silhouette */}
          <rect x="270" y="230" width="60" height="60" rx="6" fill="#07111e" stroke="#254a7c" strokeWidth="1" />
        </svg>
      )}

      {type === 'estate' && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="eSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10263f" />
              <stop offset="70%" stopColor="#254f7c" />
              <stop offset="100%" stopColor="#d4b46c" />
            </linearGradient>
          </defs>
          <rect width="600" height="400" fill="url(#eSky)" />
          {/* Mountain Ridge */}
          <path d="M0,200 Q 180,140 320,180 T 600,160 L 600,400 L 0,400 Z" fill="#0c1f33" />
          <path d="M0,240 Q 240,200 460,230 T 600,220 L 600,400 L 0,400 Z" fill="#132e48" />
          {/* Country Cottage structure */}
          <polygon points="260,250 340,250 300,210" fill="#c5a059" />
          <rect x="260" y="250" width="80" height="60" fill="#0b1b2d" stroke="#c5a059" strokeWidth="1" />
          <rect x="290" y="270" width="20" height="40" fill="#faecd0" opacity="0.9" />
          {/* Fruit orchard trees */}
          <circle cx="160" cy="270" r="28" fill="#091b12" />
          <circle cx="210" cy="280" r="24" fill="#0d2419" />
          <circle cx="410" cy="275" r="26" fill="#0d2419" />
          <circle cx="470" cy="265" r="30" fill="#091b12" />
          {/* Foreground field */}
          <polygon points="0,320 600,310 600,400 0,400" fill="#08140e" />
        </svg>
      )}

      {/* Fallback default */}
      {(type === 'meeting' || type === 'handshake') && (
        <svg viewBox="0 0 600 400" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="400" fill="#0a192f" />
          <circle cx="300" cy="200" r="120" fill="none" stroke="#c5a059" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
          <path d="M220,200 L280,240 L380,160" fill="none" stroke="#c5a059" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};
