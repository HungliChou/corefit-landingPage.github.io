import React from 'react';
import { m } from 'framer-motion';
import { EASE_OUT, usePrefersReducedMotion } from '../hooks';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** 位移距離（px）。 */
  y?: number;
  as?: 'div' | 'li' | 'article';
  amount?: number;
}

/** 捲動進入畫面時淡入上移一次；reduced-motion 時直接顯示最終狀態。 */
const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, y = 24, as = 'div', amount = 0.3 }) => {
  const reduced = usePrefersReducedMotion();
  const Comp = as === 'li' ? m.li : as === 'article' ? m.article : m.div;
  if (reduced) {
    return <Comp className={className}>{children}</Comp>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  );
};

export default Reveal;
