import type { LucideIcon } from 'lucide-react';

export type Lang = 'zh' | 'en';

export type PlanTag = 'free' | 'points' | 'pro' | 'coach';

export interface InlineLink {
  /** 必須是所屬段落文字裡的一段原文；元件會把它包成 <a>。 */
  text: string;
  href: string;
}

/** 功能卡片用的 App 介面裁圖（public/media/ui-{zh,en}-<name>.webp）。 */
export type UiShot = 'plan' | 'setup' | 'checkin' | 'smartfill' | 'logging' | 'fatigue' | 'demo' | 'metrics' | 'calendar';

export interface Chapter {
  /** 卡片配圖：第一張是主圖；第二張只在桌機大卡上疊在主圖後方。 */
  ui: [UiShot] | [UiShot, UiShot];
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  tags: PlanTag[];
  alt: string;
}

export interface MoreItem {
  icon: LucideIcon;
  title: string;
  body: string;
  tag?: PlanTag;
  link?: InlineLink;
}

export interface Step {
  title: string;
  body: string;
}

export interface Plan {
  name: string;
  lead: string;
  items: string[];
  highlight?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
  link?: InlineLink;
}

export interface TextPart {
  text: string;
  /** 外語片段的 BCP 47 語言碼，例如中文頁裡的 "en"。 */
  lang?: string;
}

export interface ContentData {
  brand: string;
  a11y: {
    skip: string;
    navLabel: string;
    home: string;
    menuOpen: string;
    menuClose: string;
    /** 語言切換連結上顯示的文字（EN／中文）。 */
    langSwitch: string;
    langHref: string;
    /** 語言切換連結的 aria-label（須包含 langSwitch 的可見文字，WCAG 2.5.3）。 */
    langLabel: string;
    /** 切換目標語言的語言碼（hreflang 與 lang）。 */
    langCode: string;
    pause: string;
    play: string;
    heroVideoDesc: string;
    filmPlay: string;
    filmVideoLabel: string;
  };
  tags: Record<PlanTag, string>;
  status: { comingSoon: string; badgeAlt: string; badgeSrc: string; navDownload: string };
  nav: { href: string; label: string }[];
  hero: {
    eyebrow: string;
    h1a: string;
    h1b: string;
    sub: string;
    cta: string;
    /** 首屏說明列：每個 item 是不換行的一組；只在 item 之間（分隔符號後）換行。 */
    meta: { sep: string; gap: string; items: TextPart[][] };
  };
  features: {
    eyebrow: string;
    title: string;
    sub: string;
    chapters: Chapter[];
    /** <1024 橫向滑動列：可見的滑動提示、捲動區塊的 aria-label、上一個／下一個按鈕的 aria-label。 */
    swipeHint: string;
    listLabel: string;
    prev: string;
    next: string;
  };
  more: { eyebrow: string; title: string; items: MoreItem[] };
  how: { eyebrow: string; title: string; steps: Step[]; note: string };
  film: { eyebrow: string; title: string; body: string; closing: string; disclosure: string };
  plans: {
    eyebrow: string;
    title: string;
    plans: Plan[];
    /** 推薦方案（highlight）上的小標籤。 */
    recommended: string;
    pointsTitle: string;
    pointsBody: string;
    fine: string;
  };
  faq: { title: string; firstPre: FaqItem; firstLive: FaqItem; items: FaqItem[]; more: string; email: string };
  download: { title: string; subPre: string; subLive: string; secondary: string };
  footer: {
    tagline: string;
    contact: string;
    support: string;
    partner: string;
    supportEmail: string;
    partnerEmail: string;
    legal: string;
    links: { label: string; href: string }[];
    follow: string;
    trademark: string;
    copyright: string;
  };
}
