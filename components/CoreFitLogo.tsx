import React from 'react';
import logoImage from '../logo-384.webp';

interface LogoProps {
  className?: string;
  /** 顯示尺寸（px），同時寫入 width/height 避免版面位移。 */
  size?: number;
  /** 裝飾用或旁邊已有品牌文字時保持空字串。 */
  alt?: string;
}

const CoreFitLogo: React.FC<LogoProps> = ({ className = 'w-10 h-10', size = 40, alt = '' }) => {
  return <img src={logoImage} alt={alt} width={size} height={size} decoding="async" className={className} />;
};

export default CoreFitLogo;
