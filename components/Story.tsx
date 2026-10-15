import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../hooks';
import type { Chapter, ContentData, Lang } from '../types';
import CjkText from './CjkText';
import PlanBadge from './PlanBadge';
import Reveal from './Reveal';

interface StoryProps {
  content: ContentData;
  lang: Lang;
}

const SIZES = '(min-width:1024px) 330px, (min-width:768px) 280px, min(78vw, 300px)';

/**
 * 截圖 660w 版的高度。01、08 裁掉了商店海報上方的大標（01 與首屏主標重複、08 是數字型標語），
 * 並在上方補回約 75px 的海報底色，讓第一個元素不會貼著卡片圓角；其餘為完整海報。
 */
const FULL_H = 1434;
const CROPPED_H: Record<Lang, Partial<Record<Chapter['shot'], number>>> = {
  zh: { '01': 1146, '08': 1078 },
  en: { '01': 1197, '08': 1133 },
};

function shotHeight(lang: Lang, shot: Chapter['shot']) {
  return CROPPED_H[lang][shot] ?? FULL_H;
}

function shotSrc(lang: Lang, shot: Chapter['shot']) {
  const base = `/media/shot-${lang}-${shot}`;
  return { src: `${base}.webp`, srcSet: `${base}.webp 660w, ${base}@2x.webp 1320w` };
}

/** 舞台光暈色：第 1–3 章藍、第 4–6 章藍紫、第 7–8 章紫。 */
function glowColor(index: number) {
  if (index <= 2) return '#2F6BFF';
  if (index <= 5) return '#5560FF';
  return '#7C4DFF';
}

/** 商店截圖：完整海報，不裁切、不調暗。 */
/** load=false 時先不給 src（桌機舞台只載入目前章節 ±1 的截圖）。 */
const ShotImage: React.FC<{ lang: Lang; chapter: Chapter; alt: string; className?: string; load?: boolean }> = ({
  lang,
  chapter,
  alt,
  className,
  load = true,
}) => {
  const { src, srcSet } = shotSrc(lang, chapter.shot);
  return (
    <img
      src={load ? src : undefined}
      srcSet={load ? srcSet : undefined}
      sizes={SIZES}
      width={660}
      height={shotHeight(lang, chapter.shot)}
      loading="lazy"
      decoding="async"
      alt={alt}
      className={className}
    />
  );
};

const ChapterText: React.FC<{ chapter: Chapter; content: ContentData; srAlt?: boolean }> = ({ chapter, content, srAlt }) => (
  <div>
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p className="eyebrow">
        <CjkText text={chapter.eyebrow} tail={false} />
      </p>
      <div className="flex flex-wrap gap-1.5">
        {chapter.tags.map((tag) => (
          <PlanBadge key={tag} tag={tag} label={content.tags[tag]} />
        ))}
      </div>
    </div>
    <h3 className="t-h3 mt-4 text-ink">
      <CjkText text={chapter.title} />
    </h3>
    <p className="copy mt-4">
      <CjkText text={chapter.body} />
    </p>
    {chapter.bullets.length > 0 && (
      <ul className="bullets mt-6 space-y-3">
        {chapter.bullets.map((b) => (
          <li key={b} className="flex gap-3 text-[15px] leading-[1.65] text-ink-2">
            <span className="dot mt-[0.6em]" aria-hidden="true" />
            <span>
              <CjkText text={b} />
            </span>
          </li>
        ))}
      </ul>
    )}
    {srAlt && <span className="sr-only">{chapter.alt}</span>}
  </div>
);

const ShotCard: React.FC<{ lang: Lang; chapter: Chapter; index: number; className?: string }> = ({
  lang,
  chapter,
  index,
  className = '',
}) => (
  <div className={`relative ${className}`}>
    <div className="shot-glow" style={{ backgroundColor: glowColor(index) }} aria-hidden="true" />
    <div className="shot-card" style={{ aspectRatio: `660 / ${shotHeight(lang, chapter.shot)}` }}>
      <ShotImage lang={lang} chapter={chapter} alt={chapter.alt} />
    </div>
  </div>
);

/** <1024：每章文字＋截圖（手機直排、平板兩欄交錯）。 */
const StackedStory: React.FC<StoryProps> = ({ content, lang }) => (
  <ol className="mt-16 space-y-[88px] md:mt-20 md:space-y-28">
    {content.features.chapters.map((chapter, i) => {
      const flip = i % 2 === 1;
      return (
        <Reveal
          key={chapter.shot}
          as="li"
          amount={0.2}
          className={`md:grid md:items-center md:justify-between md:gap-10 ${
            flip ? 'md:grid-cols-[280px_minmax(0,360px)]' : 'md:grid-cols-[minmax(0,360px)_280px]'
          }`}
        >
          <div className={flip ? 'md:order-2' : ''}>
            <ChapterText chapter={chapter} content={content} />
          </div>
          <ShotCard
            lang={lang}
            chapter={chapter}
            index={i}
            className={`mx-auto mt-7 w-[min(78vw,300px)] md:mt-0 md:w-[280px] ${flip ? 'md:order-1' : ''}`}
          />
        </Reveal>
      );
    })}
  </ol>
);

/** ≥1024：左側章節文字捲動，右側 sticky 舞台切換截圖。 */
const StageStory: React.FC<StoryProps> = ({ content, lang }) => {
  const chapters = content.features.chapters;
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const blockRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [chapters.length]);

  // 只載入目前章節 ±1 的截圖；已載入的保留
  useEffect(() => {
    setLoaded((prev) => {
      const want = [active - 1, active, active + 1].filter((n) => n >= 0 && n < chapters.length);
      if (want.every((n) => prev.has(n))) return prev;
      const next = new Set(prev);
      want.forEach((n) => next.add(n));
      return next;
    });
  }, [active, chapters.length]);

  return (
    <div className="mt-12 grid grid-cols-12 gap-8">
      <ol className="col-span-6">
        {chapters.map((chapter, i) => (
          <li
            key={chapter.shot}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            data-index={i}
            className={`story-chapter flex min-h-[72vh] items-center ${i === active ? '' : 'is-dim'}`}
          >
            <ChapterText chapter={chapter} content={content} srAlt />
          </li>
        ))}
      </ol>

      <div className="col-span-5 col-start-8" aria-hidden="true">
        <div className="story-stage">
          <div className="story-stage__frame">
            <div className="story-stage__glow" style={{ backgroundColor: glowColor(active) }} />
            <div
              className="shot-card story-stage__card"
              style={{ aspectRatio: `660 / ${shotHeight(lang, chapters[active].shot)}` }}
            >
              {chapters.map((chapter, i) => (
                <ShotImage
                  key={chapter.shot}
                  lang={lang}
                  chapter={chapter}
                  alt=""
                  load={loaded.has(i)}
                  className={`story-stage__img ${i === active ? 'is-active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Story: React.FC<StoryProps> = ({ content, lang }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { features } = content;

  return (
    <section id="features" aria-labelledby="features-title" className="section">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{features.eyebrow}</p>
          <h2 id="features-title" className="t-h2 mt-4 text-ink">
            <CjkText text={features.title} />
          </h2>
          <p className="copy copy-wide mx-auto mt-5">
            <CjkText text={features.sub} />
          </p>
        </Reveal>

        {isDesktop ? <StageStory content={content} lang={lang} /> : <StackedStory content={content} lang={lang} />}

        <p className="fine balance-en mt-12 text-center">
          <CjkText text={features.disclosure} />
        </p>
      </div>
    </section>
  );
};

export default Story;
