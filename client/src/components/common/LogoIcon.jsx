import React from 'react';

export default function LogoIcon({ size = 32, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="shieldGradOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo */}
          <stop offset="100%" stopColor="#7C3AED" /> {/* Violet */}
        </linearGradient>
        <linearGradient id="shieldGradInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Glow */}
      <path 
        d="M50 8 L90 23 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 23 Z" 
        fill="url(#shieldGradOuter)" 
        opacity="0.25"
        filter="url(#glow)"
      />

      {/* Outer Shield Area */}
      <path 
        d="M50 5 L88 20 L88 50 C88 75 50 93 50 93 C50 93 12 75 12 50 L12 20 Z" 
        fill="url(#shieldGradOuter)" 
      />

      {/* Inner Shield Overlay */}
      <path 
        d="M50 15 L78 26 L78 50 C78 68 50 82 50 82 C50 82 22 68 22 50 L22 26 Z" 
        fill="url(#shieldGradInner)" 
      />

      {/* Network / Tech Nodes Pattern overlay */}
      <circle cx="50" cy="45" r="14" fill="white" opacity="0.15" />
      <path d="M50 25 L50 65" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M35 45 L65 45" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <circle cx="50" cy="45" r="7" fill="white" />
      <circle cx="50" cy="45" r="3" fill="#4F46E5" />
      
      {/* Outer tech dots */}
      <circle cx="35" cy="45" r="2.5" fill="white" />
      <circle cx="65" cy="45" r="2.5" fill="white" />
      <circle cx="50" cy="25" r="2.5" fill="white" />
      <circle cx="50" cy="65" r="2.5" fill="white" />
      <circle cx="50" cy="15" r="2" fill="white" opacity="0.8" />
    </svg>
  );
}
