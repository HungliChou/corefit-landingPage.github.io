import React from 'react';
import logoImage from '../logo-384.webp';

interface LogoProps {
  className?: string;
}

const CoreFitLogo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => {
  return (
    <img
      src={logoImage}
      alt="CoreFit Logo"
      className={className}
    />
  );
};

export default CoreFitLogo;