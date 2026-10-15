import { useEffect, useState } from 'react';
import type { Lang } from './types';

function readMatch(query: string): boolean {
  try {
    return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/** matchMedia + change listener；初始值同步讀取，避免第一次 render 閃一下。 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => readMatch(query));

  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(query);
    } catch {
      return;
    }
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/** 語言只由 <html lang> 決定（/ 為中文、/en/ 為英文），不讀 navigator.language、不寫 localStorage。 */
export function readLang(): Lang {
  return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

export function useLang(): Lang {
  const [lang] = useState<Lang>(readLang);
  return lang;
}

/** 進場動畫統一 easing。 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
