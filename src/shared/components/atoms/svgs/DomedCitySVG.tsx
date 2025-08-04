import React from 'react';

interface DomedCitySVGProps {
  color: string;
  width?: number | string;
  height?: number | string;
}

// Diseño 4: Ciudad con torres y cúpulas
const DomedCitySVG: React.FC<DomedCitySVGProps> = ({ color, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Torre con cúpula central */}
    <rect x="10" y="10" width="4" height="12" fill={color} />
    <ellipse cx="12" cy="10" rx="2.5" ry="3" fill={color} />
    <circle cx="12" cy="7" r="0.5" fill={color} />
    {/* Torres laterales */}
    <rect x="5" y="15" width="2.5" height="7" fill={color} />
    <ellipse cx="6.25" cy="15" rx="1.5" ry="2" fill={color} />
    <rect x="16.5" y="13" width="2.5" height="9" fill={color} />
    <ellipse cx="17.75" cy="13" rx="1.5" ry="2" fill={color} />
    {/* Edificios pequeños */}
    <rect x="2" y="18" width="2" height="4" fill={color} />
    <rect x="20" y="17" width="2" height="5" fill={color} />
    {/* Detalles ornamentales */}
    <circle cx="12" cy="15" r="0.4" fill="rgba(255,255,255,0.8)" />
    <circle cx="6.25" cy="18" r="0.3" fill="rgba(255,255,255,0.8)" />
    <circle cx="17.75" cy="16" r="0.3" fill="rgba(255,255,255,0.8)" />
    {/* Base */}
    <line x1="1" y1="22" x2="23" y2="22" stroke={color} strokeWidth="1" />
  </svg>
);

export default DomedCitySVG;
