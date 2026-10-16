import React, { useEffect, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { CONTENT } from './constants';
import { useLang } from './hooks';

import SkipLink from './components/SkipLink';
import Navbar, { LANG_POS_KEY, LANG_PROBE } from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import MoreFeatures from './components/MoreFeatures';
import HowItWorks from './components/HowItWorks';
import Film from './components/Film';
import Plans from './components/Plans';
import Faq from './components/Faq';
import DownloadCta from './components/DownloadCta';
import Footer from './components/Footer';

/**
 * 帶錨點進站（/#plans、/en/#faq、切換語言後的 /en/#plans）時捲到該區塊；切換語言時還會還原在區塊內的相對位置。
 * index.html 的靜態 fallback 沒有這些 id，瀏覽器自己的錨點捲動在 React 渲染前就跑完了，所以要補做。
 * - 用 requestAnimationFrame：Tailwind Play CDN 以 MutationObserver 產生 class，要等它跑完版面才正確。
 * - 一律瞬間跳轉（不走 html 的 smooth scroll），並沿用 CSS 的 scroll-margin-top。
 * - 已經不在頂端（瀏覽器還原了捲動位置）就不動；字型載入後版面若有位移、且使用者還沒捲動，再對齊一次。
 */
function useInitialHashScroll() {
  useEffect(() => {
    let id = '';
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    // 切換語言時存下的「在區塊內的比例」（見 Navbar.tsx switchLanguage），只用一次。
    let ratio: number | null = null;
    try {
      const saved = JSON.parse(sessionStorage.getItem(LANG_POS_KEY) ?? 'null') as { id?: string; ratio?: number } | null;
      sessionStorage.removeItem(LANG_POS_KEY);
      if (saved && saved.id === id && typeof saved.ratio === 'number') ratio = Math.min(Math.max(saved.ratio, 0), 1);
    } catch {
      /* 忽略 */
    }
    if (!id || (ratio === null && window.scrollY > 0)) return;

    let cancelled = false;
    let landedAt = -1;
    const jump = () => {
      const el = document.getElementById(id);
      if (!el) return;
      if (ratio === null) {
        el.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
      } else {
        const r = el.getBoundingClientRect();
        const y = window.scrollY + r.top + r.height * ratio - window.innerHeight * LANG_PROBE;
        window.scrollTo({ top: Math.max(0, y), behavior: 'instant' as ScrollBehavior });
      }
      landedAt = window.scrollY;
    };
    const raf = requestAnimationFrame(() => {
      if (!cancelled) jump();
    });
    // 字型 swap 可能讓上方區塊高度改變；只有在使用者沒動過捲軸時才重新對齊。
    const realign = () => {
      requestAnimationFrame(() => {
        if (!cancelled && landedAt >= 0 && Math.abs(window.scrollY - landedAt) < 2) jump();
      });
    };
    document.fonts?.ready.then(realign).catch(() => undefined);
    if (document.readyState !== 'complete') window.addEventListener('load', realign, { once: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('load', realign);
    };
  }, []);
}

const App: React.FC = () => {
  useInitialHashScroll();

  // 語言由 <html lang> 決定：/ 為中文、/en/ 為英文（切換語言是整頁導覽）。
  const lang = useLang();
  const content = CONTENT[lang];
  // 手機選單展開時，略過連結、<main> 與 <footer> 設為 inert。
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SkipLink label={content.a11y.skip} inert={menuOpen} />
        <Navbar content={content} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main id="main" tabIndex={-1} inert={menuOpen} className="outline-none">
          <Hero content={content} lang={lang} />
          <Story content={content} lang={lang} />
          <MoreFeatures content={content} />
          <HowItWorks content={content} />
          <Film content={content} lang={lang} />
          <Plans content={content} />
          <Faq content={content} />
          <DownloadCta content={content} />
        </main>
        <Footer content={content} inert={menuOpen} />
      </MotionConfig>
    </LazyMotion>
  );
};

export default App;
