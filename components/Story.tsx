import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery, usePrefersReducedMotion } from '../hooks';
import type { Chapter, ContentData, Lang, UiShot } from '../types';
import CjkText from './CjkText';
import PlanBadge from './PlanBadge';
import Reveal from './Reveal';

interface StoryProps {
  content: ContentData;
  lang: Lang;
}

/**
 * App 介面裁圖（public/media/ui-{lang}-<name>.webp，1x 寬 400px、@2x 寬 800px）的 1x 高度。
 * 來源與裁切範圍見 README「媒體素材」；重新裁圖時要一起更新這裡。
 */
const UI_W = 400;
const UI_H: Record<Lang, Record<UiShot, number>> = {
  zh: { setup: 230, plan: 223, checkin: 278, smartfill: 192, logging: 315, fatigue: 342, demo: 232, metrics: 261, calendar: 206 },
  en: { setup: 230, plan: 223, checkin: 278, smartfill: 204, logging: 315, fatigue: 342, demo: 232, metrics: 261, calendar: 206 },
};

/** 卡片舞台光暈：前段藍、中段藍紫、後段紫（沿用原本章節的色彩節奏）。 */
function glowColor(index: number) {
  if (index <= 2) return '47, 107, 255';
  if (index <= 5) return '85, 96, 255';
  return '124, 77, 255';
}

const UiImage: React.FC<{ lang: Lang; name: UiShot; alt: string; className: string; sizes: string }> = ({
  lang,
  name,
  alt,
  className,
  sizes,
}) => {
  const base = `/media/ui-${lang}-${name}`;
  return (
    <img
      src={`${base}.webp`}
      srcSet={`${base}.webp ${UI_W}w, ${base}@2x.webp ${UI_W * 2}w`}
      sizes={sizes}
      width={UI_W}
      height={UI_H[lang][name]}
      loading="lazy"
      decoding="async"
      alt={alt}
      className={className}
    />
  );
};

/**
 * 卡片上方的 App 畫面：裁好的介面卡片從舞台上緣露出，下緣淡出到卡片底色。
 * 大卡（wide，≥1024 的 AI 教練）：舞台裡上下排兩張完整的介面——上方是計畫設定（計畫長度、每週訓練日），
 * 下方是計畫週期卡，兩張不重疊。
 * `demo`（白底 3D 示範影片框）整張縮在淡出帶上方，避免淡出漸層蓋在白底上變成一片灰。
 */
const FeatureStage: React.FC<{ lang: Lang; chapter: Chapter; index: number; wide: boolean }> = ({
  lang,
  chapter,
  index,
  wide,
}) => {
  const [main, back] = chapter.ui;
  return (
    <div className="feat__stage" style={{ '--glow': glowColor(index) } as React.CSSProperties}>
      {wide && back && (
        <UiImage lang={lang} name={back} alt="" className="feat__ui feat__ui--back" sizes="(min-width:1280px) 340px, 260px" />
      )}
      <UiImage
        lang={lang}
        name={main}
        alt={chapter.alt}
        className={`feat__ui feat__ui--${main}${wide && back ? ' feat__ui--front' : ''}`}
        sizes={
          wide && back
            ? '(min-width:1280px) 420px, 300px'
            : main === 'demo'
              ? '260px'
              : '(min-width:1280px) 340px, (min-width:1024px) 290px, min(76vw, 300px)'
        }
      />
    </div>
  );
};

const FeatureText: React.FC<{ chapter: Chapter; content: ContentData; wide: boolean }> = ({ chapter, content, wide }) => (
  <div className="feat__body">
    <div className="feat__meta flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
      <p className="eyebrow">
        <CjkText text={chapter.eyebrow} tail={false} />
      </p>
      <span className="feat__tags">
        {chapter.tags.map((tag) => (
          <PlanBadge key={tag} tag={tag} label={content.tags[tag]} />
        ))}
      </span>
    </div>
    <h3 className={`${wide ? 'feat__title feat__title--lg' : 'feat__title'} mt-2.5 text-ink`}>
      <CjkText text={chapter.title} />
    </h3>
    <p className="feat__copy mt-2">
      <CjkText text={chapter.body} />
    </p>
    {chapter.bullets.length > 0 && (
      <ul className="bullets mt-3 space-y-1.5">
        {chapter.bullets.map((b) => (
          <li key={b} className="feat__bullet">
            <span className="dot mt-[0.62em]" aria-hidden="true" />
            <span>
              <CjkText text={b} />
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/** ≥1024：三欄 bento。第一張（AI 教練）是橫跨兩欄的大卡，文字在左、畫面在右。 */
const FeatureGrid: React.FC<StoryProps> = ({ content, lang }) => (
  <ol className="feat-grid mt-10 xl:mt-12">
    {content.features.chapters.map((chapter, i) => {
      const wide = i === 0;
      return (
        <Reveal
          key={chapter.eyebrow}
          as="li"
          amount={0.2}
          y={16}
          delay={wide ? 0 : ((i - 1) % 3) * 0.05}
          className={`feat ${wide ? 'feat--wide' : ''}`}
        >
          <FeatureStage lang={lang} chapter={chapter} index={i} wide={wide} />
          <FeatureText chapter={chapter} content={content} wide={wide} />
        </Reveal>
      );
    })}
  </ol>
);

/** 滑動列每張卡片的間距（卡寬＋gap）。 */
function stride(rail: HTMLElement): number {
  const first = rail.firstElementChild as HTMLElement | null;
  const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
  return first ? first.offsetWidth + gap : rail.clientWidth;
}

/** 可捲到的停靠點數：平板寬度一次看得到兩張以上，最後一個停靠點之後就捲不動了，點數要比卡片少。 */
function snapStops(rail: HTMLElement): number {
  const count = rail.children.length;
  const max = rail.scrollWidth - rail.clientWidth;
  if (max <= 4) return 1;
  return Math.min(count, Math.ceil((max - 4) / stride(rail)) + 1);
}

/** <1024：橫向滑動列（scroll-snap），下方有進度點與上一個／下一個按鈕。進度點一個對應一個停靠點。 */
const FeatureRail: React.FC<StoryProps> = ({ content, lang }) => {
  const { features } = content;
  const reduced = usePrefersReducedMotion();
  const chapters = features.chapters;
  const railRef = useRef<HTMLOListElement | null>(null);
  const [active, setActive] = useState(0);
  const [stops, setStops] = useState(chapters.length);
  const [edge, setEdge] = useState({ start: true, end: false });

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const total = snapStops(rail);
    const left = rail.scrollLeft;
    const atEnd = left >= rail.scrollWidth - rail.clientWidth - 4;
    setStops(total);
    setActive(atEnd ? total - 1 : Math.min(total - 1, Math.round(left / stride(rail))));
    setEdge({ start: left <= 4, end: atEnd });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };
    sync();
    rail.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      rail.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sync]);

  const step = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * stride(rail), behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className="mt-8 md:mt-10">
      <ol ref={railRef} className="feat-rail" tabIndex={0} aria-label={features.listLabel}>
        {chapters.map((chapter, i) => (
          <li key={chapter.eyebrow} className="feat">
            <FeatureStage lang={lang} chapter={chapter} index={i} wide={false} />
            <FeatureText chapter={chapter} content={content} wide={false} />
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="feat-dots shrink-0" aria-hidden="true">
            {chapters.slice(0, stops).map((c, i) => (
              <span key={c.eyebrow} className={i === active ? 'is-active' : ''} />
            ))}
          </div>
          {/* Below 360px the row cannot fit dots + hint + both buttons; the arrows and dots already say "swipe". */}
          <p className="fine truncate max-[359px]:hidden">{features.swipeHint}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="icon-btn icon-btn--sm" aria-label={features.prev} disabled={edge.start} onClick={() => step(-1)}>
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn icon-btn--sm" aria-label={features.next} disabled={edge.end} onClick={() => step(1)}>
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Story: React.FC<StoryProps> = ({ content, lang }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { features } = content;

  return (
    <section id="features" aria-labelledby="features-title" className="section section--features">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{features.eyebrow}</p>
          <h2 id="features-title" className="t-h2 mt-4 text-ink">
            <CjkText text={features.title} />
          </h2>
          <p className="copy copy-wide mx-auto mt-4">
            <CjkText text={features.sub} />
          </p>
        </Reveal>

        {isDesktop ? <FeatureGrid content={content} lang={lang} /> : <FeatureRail content={content} lang={lang} />}
      </div>
    </section>
  );
};

export default Story;
