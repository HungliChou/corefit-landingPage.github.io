import React from 'react';
import { IS_LIVE, SOCIAL_LINKS } from '../config';
import type { ContentData } from '../types';
import CjkText from './CjkText';
import CoreFitLogo from './CoreFitLogo';
import { Facebook, Instagram } from 'lucide-react';

// X 的標誌（lucide 只有舊版 Twitter 小鳥，所以自己畫）
const XLogo: React.FC<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' }> = ({ size = 18 }) => (
  <svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_ICONS = { instagram: Instagram, facebook: Facebook, x: XLogo };

const Footer: React.FC<{ content: ContentData; inert?: boolean }> = ({ content, inert }) => {
  const { footer, brand } = content;
  const hasSocial = SOCIAL_LINKS.length > 0;

  return (
    <footer inert={inert} className="border-t border-line">
      <div className="wrap pb-10 pt-14 md:pt-16">
        {/* 平板起不等寬欄：品牌欄略寬、聯絡欄足以放下完整 email（不再 break-all 把 email 拆行） */}
        <div
          className={`grid gap-10 md:gap-8 ${
            hasSocial
              ? 'md:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr]'
              : 'md:grid-cols-[1.4fr_1.2fr_1fr]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2.5">
              <CoreFitLogo size={28} className="h-7 w-7" />
              <span className="text-[20px] font-extrabold tracking-[-0.01em] text-ink" style={{ fontFamily: '"Mona Sans", system-ui, sans-serif' }}>
                {brand}
              </span>
            </div>
            <p className="mt-4 text-[15px] text-ink-2">
              <CjkText text={footer.tagline} />
            </p>
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-ink">{footer.contact}</h2>
            <ul className="mt-4 space-y-4 text-[14px]">
              <li>
                <span className="block text-[13px] text-ink-3">{footer.support}</span>
                <a href={`mailto:${footer.supportEmail}`} className="link-quiet mt-1 inline-block whitespace-nowrap">
                  {footer.supportEmail}
                </a>
              </li>
              <li>
                <span className="block text-[13px] text-ink-3">{footer.partner}</span>
                <a href={`mailto:${footer.partnerEmail}`} className="link-quiet mt-1 inline-block whitespace-nowrap">
                  {footer.partnerEmail}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[14px] font-semibold text-ink">{footer.legal}</h2>
            <ul className="mt-4 space-y-3 text-[14px]">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-quiet">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {hasSocial && (
            <div>
              <h2 className="text-[14px] font-semibold text-ink">{footer.follow}</h2>
              <ul className="mt-4 flex gap-3">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  const placeholder = s.href === '#';
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        aria-label={s.label}
                        title={s.label}
                        {...(placeholder
                          ? { onClick: (e: React.MouseEvent) => e.preventDefault() }
                          : { target: '_blank', rel: 'noopener' })}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                      >
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-2 border-t border-line pt-6 text-[13px] text-ink-3">
          {IS_LIVE && (
            <p>
              <CjkText text={footer.trademark} />
            </p>
          )}
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
