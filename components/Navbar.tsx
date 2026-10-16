import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { APP_STORE_URL, IS_LIVE } from '../config';
import type { ContentData } from '../types';
import CoreFitLogo from './CoreFitLogo';

interface NavbarProps {
  content: ContentData;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

/**
 * 語言切換是整頁導覽，並停在「目前正在看的區塊」的同一相對位置。
 * 不用 location.hash：它只記得最後一次點導覽列的錨點，使用者自己捲動後就過時了（例如一直帶著 #film）。
 * 做法：在視窗 35% 高度處找出所在的區塊與在區塊內的比例，錨點帶區塊 id，比例存 sessionStorage，
 * 新頁面由 App.tsx 的 useInitialHashScroll 還原（兩種語言的區塊高度不同，所以存比例而不是像素）。
 */
export const LANG_POS_KEY = 'cf-lang-pos';
export const LANG_PROBE = 0.35;
const SECTION_IDS = ['top', 'features', 'more', 'how', 'film', 'plans', 'faq', 'download'];

function switchLanguage(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  const href = e.currentTarget.getAttribute('href') ?? '/';
  const probe = window.innerHeight * LANG_PROBE;
  let id = '';
  let ratio = 0;
  if (window.scrollY > 8) {
    for (const sid of SECTION_IDS) {
      const r = document.getElementById(sid)?.getBoundingClientRect();
      if (r && r.top <= probe && r.bottom > probe) {
        id = sid;
        ratio = (probe - r.top) / r.height;
        break;
      }
    }
  }
  try {
    if (id) sessionStorage.setItem(LANG_POS_KEY, JSON.stringify({ id, ratio }));
    else sessionStorage.removeItem(LANG_POS_KEY);
  } catch {
    /* 無痕模式等情況存不了：只回到區塊開頭 */
  }
  window.location.assign(href + (id && id !== 'top' ? `#${id}` : ''));
}

const Navbar: React.FC<NavbarProps> = ({ content, menuOpen, setMenuOpen }) => {
  const { a11y, nav, status, brand } = content;
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 選單展開：鎖住背景捲動、Esc 關閉並把 focus 還給漢堡鈕
  useEffect(() => {
    if (!menuOpen) return;
    document.body.classList.add('menu-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, setMenuOpen]);

  // 視窗放大到桌機寬度時自動收起手機選單
  useEffect(() => {
    if (!menuOpen) return;
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia('(min-width: 768px)');
    } catch {
      return;
    }
    const onChange = () => mql.matches && setMenuOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [menuOpen, setMenuOpen]);

  const langLink = (className: string) => (
    <a
      href={a11y.langHref}
      hrefLang={a11y.langCode}
      lang={a11y.langCode}
      aria-label={a11y.langLabel}
      onClick={switchLanguage}
      className={className}
    >
      {a11y.langSwitch}
    </a>
  );

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`}>
      <nav aria-label={a11y.navLabel} className="wrap flex h-14 items-center justify-between gap-4 md:h-16">
        {/* 選單展開時點 logo 也要收起選單（和選單內的連結一致），否則捲到 #top 後 <main> 仍是 inert。 */}
        <a
          href="#top"
          aria-label={a11y.home}
          onClick={() => setMenuOpen(false)}
          className="-ml-1 flex items-center gap-2.5 rounded-lg px-1 py-1"
        >
          <CoreFitLogo size={28} className="h-7 w-7" />
          <span className="text-[20px] font-extrabold tracking-[-0.01em] text-ink" style={{ fontFamily: '"Mona Sans", system-ui, sans-serif' }}>
            {brand}
          </span>
        </a>

        {/* ≥768：橫排連結 */}
        <div className="hidden items-center gap-7 md:flex">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[15px] font-medium text-ink-2 transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="h-5 w-px bg-line-strong" aria-hidden="true" />
          {langLink(
            'inline-flex h-9 items-center rounded-full border border-line-strong px-3.5 text-[13px] font-semibold text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink'
          )}
          {IS_LIVE && (
            <a href={APP_STORE_URL} target="_blank" rel="noopener" className="btn btn-primary btn-sm">
              {status.navDownload}
            </a>
          )}
        </div>

        {/* <768：語言切換 + 漢堡鈕 */}
        <div className="flex items-center gap-1 md:hidden">
          {langLink(
            'inline-flex h-11 min-w-[44px] items-center justify-center rounded-full px-3 text-[14px] font-semibold text-ink-2'
          )}
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink"
            aria-label={menuOpen ? a11y.menuClose : a11y.menuOpen}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        {/* 手機選單面板放在同一個 <nav> 地標內；定位相對於 header（nav 本身沒有 position）。 */}
        <div id="mobile-nav" className="mobile-nav md:hidden" hidden={!menuOpen}>
          <ul className="wrap py-2">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex h-[52px] items-center text-[17px] font-semibold text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
            {IS_LIVE && (
              <li className="pb-3 pt-4">
                <a href={APP_STORE_URL} target="_blank" rel="noopener" className="btn btn-primary w-full">
                  {status.navDownload}
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* 選單展開時蓋住底下（已 inert）的頁面：調暗＋模糊，點一下就關閉選單。 */}
      {menuOpen && <div className="mobile-scrim md:hidden" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
    </header>
  );
};

export default Navbar;
