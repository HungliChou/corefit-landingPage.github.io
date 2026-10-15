import React from 'react';
import { ArrowDown } from 'lucide-react';
import { APP_STORE_URL, IS_LIVE } from '../config';
import type { ContentData } from '../types';
import StatusChip from './StatusChip';

interface StoreCtaProps {
  variant: 'hero' | 'final';
  status: ContentData['status'];
  /** Hero：「看看有哪些功能」→ #features；收尾：「看介紹影片」→ #film。 */
  secondary?: { label: string; href: string };
}

/**
 * 依 APP_STATUS 輸出 CTA：
 * - prelaunch：不顯示 Apple 徽章、不連 App Store，只顯示狀態說明文字（+ 站內錨點按鈕）。
 * - live：Apple 官方徽章（依 Apple 識別規範不改色、不變形）。
 */
const StoreCta: React.FC<StoreCtaProps> = ({ variant, status, secondary }) => {
  if (IS_LIVE) {
    const badgeHeight = variant === 'hero' ? 52 : 56;
    return (
      <div className={`flex flex-wrap items-center gap-3 ${variant === 'final' ? 'justify-center' : ''}`}>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener"
          className="inline-block rounded-[12px]"
        >
          <img src={status.badgeSrc} alt={status.badgeAlt} height={badgeHeight} style={{ height: badgeHeight, width: 'auto' }} />
        </a>
        {variant === 'hero' && secondary && (
          <a href={secondary.href} className="btn btn-secondary">
            {secondary.label}
          </a>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {secondary && (
          <a href={secondary.href} className="btn btn-primary">
            {secondary.label}
            <ArrowDown size={18} strokeWidth={2.25} aria-hidden="true" />
          </a>
        )}
        <StatusChip label={status.comingSoon} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {secondary && (
        <a href={secondary.href} className="btn btn-secondary">
          {secondary.label}
        </a>
      )}
      <StatusChip label={status.comingSoon} />
    </div>
  );
};

export default StoreCta;
