import React from 'react';

interface FuturisticCitySVGProps {
  color: string;
  width?: number | string;
  height?: number | string;
}

// Diseño 3: Ciudad futurista con formas geométricas
const FuturisticCitySVG: React.FC<FuturisticCitySVGProps> = ({ color, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Torre central */}
    <rect x="11" y="3" width="2" height="19" fill={color} rx="1" />
    {/* Edificios piramidales */}
    <polygon points="5,22 8,22 6.5,12" fill={color} opacity="0.9" />
    <polygon points="16,22 19,22 17.5,10" fill={color} opacity="0.9" />
    {/* Edificios cilíndricos */}
    <circle cx="4" cy="18" r="1.5" fill={color} />
    <rect x="2.5" y="18" width="3" height="4" fill={color} />
    <circle cx="20" cy="19" r="1" fill={color} />
    <rect x="19" y="19" width="2" height="3" fill={color} />
    {/* Luces/ventanas */}
    <circle cx="6.5" cy="15" r="0.3" fill="rgba(255,255,255,0.9)" />
    <circle cx="17.5" cy="13" r="0.3" fill="rgba(255,255,255,0.9)" />
    <circle cx="12" cy="8" r="0.3" fill="rgba(255,255,255,0.9)" />
    <circle cx="12" cy="12" r="0.3" fill="rgba(255,255,255,0.9)" />
    <circle cx="12" cy="16" r="0.3" fill="rgba(255,255,255,0.9)" />
    {/* Base */}
    <line x1="1" y1="22" x2="23" y2="22" stroke={color} strokeWidth="1.5" />
  </svg>
);

export default FuturisticCitySVG;
