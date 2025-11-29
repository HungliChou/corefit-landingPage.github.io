import React from 'react';

interface LogoProps {
  className?: string;
}

const CoreFitLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="logo_gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1A75FF" />
          <stop offset="1" stopColor="#614FFF" />
        </linearGradient>
      </defs>
      
      {/* Background: Rounded Square with Gradient */}
      <rect width="100" height="100" rx="22" fill="url(#logo_gradient)" />
      
      {/* The "G" Shape: Hexagonal Geometry with Arrow */}
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M72 35.5L52.5 24.5C51 23.6 49 23.6 47.5 24.5L28 35.5C26.5 36.4 25.5 38 25.5 39.8V62.2C25.5 64 26.5 65.6 28 66.5L47.5 77.5C49 78.4 51 78.4 52.5 77.5L64.5 70.8C66 69.9 67 68.3 67 66.5V56L50 65.5L42.5 61.2V39.8L61.5 29V39L49 46.5L72 35.5Z" 
        fill="white"
      />
    </svg>
  );
};

export default CoreFitLogo;