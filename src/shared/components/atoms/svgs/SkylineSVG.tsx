import React from 'react';

interface SkylineSVGProps {
  color: string;
  width?: number | string;
  height?: number | string;
}
// Diseño 1: Skyline moderno con edificios altos
const SkylineSVG: React.FC<SkylineSVGProps> = ({ color, width = 48, height = 48 }) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Edificio principal alto */}
    <rect x="10" y="4" width="4" height="18" fill={color} stroke={color} strokeWidth="0.5" />
    {/* Edificio mediano izquierdo */}
    <rect x="6" y="8" width="3" height="14" fill={color} stroke={color} strokeWidth="0.5" />
    {/* Edificio bajo izquierdo */}
    <rect x="2" y="14" width="3" height="8" fill={color} stroke={color} strokeWidth="0.5" />
    {/* Edificio mediano derecho */}
    <rect x="15" y="10" width="3" height="12" fill={color} stroke={color} strokeWidth="0.5" />
    {/* Edificio bajo derecho */}
    <rect x="19" y="16" width="3" height="6" fill={color} stroke={color} strokeWidth="0.5" />

    {/* Ventanas edificio principal */}
    <rect x="11" y="6" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />
    <rect x="12.2" y="6" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />
    <rect x="11" y="8" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />
    <rect x="12.2" y="8" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />
    <rect x="11" y="10" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />
    <rect x="12.2" y="10" width="0.8" height="0.8" fill="rgba(255,255,255,0.8)" />

    {/* Ventanas edificio izquierdo */}
    <rect x="6.5" y="10" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="7.4" y="10" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="6.5" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="7.4" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />

    {/* Ventanas edificio derecho */}
    <rect x="15.5" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="16.4" y="12" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="15.5" y="14" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />
    <rect x="16.4" y="14" width="0.6" height="0.6" fill="rgba(255,255,255,0.8)" />

    {/* Antena en edificio principal */}
    <line x1="12" y1="4" x2="12" y2="2" stroke={color} strokeWidth="0.8" />
    <circle cx="12" cy="2" r="0.5" fill={color} />

    {/* Base/suelo */}
    <line x1="1" y1="22" x2="23" y2="22" stroke={color} strokeWidth="1" />
  </svg>
);

export default SkylineSVG;
