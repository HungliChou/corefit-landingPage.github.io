import React from 'react';
import { m } from 'framer-motion';
import { HERO_POSTER_TIME } from '../config';
import { EASE_OUT, usePrefersReducedMotion } from '../hooks';
import type { ContentData, Lang } from '../types';
import LoopVideo from './LoopVideo';
import CjkText from './CjkText';
import StoreCta from './StoreCta';

interface HeroProps {
  content: ContentData;
  lang: Lang;
}

const Hero: React.FC<HeroProps> = ({ content, lang }) => {
  const { hero, a11y, status } = content;
  const reduced = usePrefersReducedMotion();

  // 文字依序進場（每項間隔 80ms）；reduced-motion 時直接顯示。
  // h1 與副標是 LCP 候選，只做位移、不從透明淡入（opacity 0 的元素不算 LCP，也會讓靜態 fallback 閃一下）。
  const item = (i: number, fade = true) =>
    reduced
      ? {}
      : {
          initial: fade ? { opacity: 0, y: 16 } : { y: 12 },
          animate: fade ? { opacity: 1, y: 0 } : { y: 0 },
          transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 * i },
        };
  const { meta } = hero;
  const lastMeta = meta.items.length - 1;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-x-clip">
      <div className="hero-glow -z-10" aria-hidden="true" />
      <div className="wrap hero-layout pb-16 pt-5 md:py-16 lg:py-12">
        {/* 手機版明確設成單欄 minmax(0,1fr)：沒有設欄寬時，隱含的 auto 欄會被文字的 min-content 撐寬
         * （Safari 曾因此把欄撐到 480px，影片在過寬的欄裡置中，看起來整個偏右）。兩個子項也加 min-w-0。 */}
        <div className="grid w-full grid-cols-[minmax(0,1fr)] items-center gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 md:max-w-[420px] lg:col-span-7 lg:max-w-none">
            <m.p className="eyebrow mb-3 md:mb-6" {...item(0)}>
              <CjkText text={hero.eyebrow} tail={false} />
            </m.p>
            {/* 主標兩行各自是一整行（中文 nowrap、字級依欄寬設上限，見 index.css），不經過 CjkText：
             * CjkText 會在詞間插入 <wbr>，而 Chrome 即使在 white-space: nowrap 下也會在 <wbr> 換行。 */}
            <m.h1 id="hero-title" className="t-h1 text-ink" {...item(1, false)}>
              <span className="block">{hero.h1a}</span>
              <span className="block text-grad">{hero.h1b}</span>
            </m.h1>
            <m.p className="copy mt-4 md:mt-7" {...item(2, false)}>
              <CjkText text={hero.sub} />
            </m.p>
            <m.div className="mt-6 md:mt-10" {...item(3)}>
              <StoreCta variant="hero" status={status} secondary={{ label: hero.cta, href: '#features' }} />
            </m.div>
            <m.p className="fine tnum mt-4 text-[13px] md:mt-6" {...item(4)}>
              {meta.items.map((parts, i) => (
                <React.Fragment key={i}>
                  <span className="whitespace-nowrap">
                    {parts.map((part, j) =>
                      part.lang ? (
                        <span key={j} lang={part.lang}>
                          {part.text}
                        </span>
                      ) : (
                        <React.Fragment key={j}>{part.text}</React.Fragment>
                      )
                    )}
                    {i < lastMeta && meta.sep}
                  </span>
                  {i < lastMeta && (meta.gap ? meta.gap : <wbr />)}
                </React.Fragment>
              ))}
            </m.p>
          </div>

          <m.div
            className="flex min-w-0 justify-center lg:col-span-5"
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.6, ease: EASE_OUT, delay: 0.15 },
                })}
          >
            <LoopVideo
              mode="ambient"
              poster={`/media/flow-${lang}-poster.webp`}
              mp4={`/media/flow-${lang}.mp4`}
              describedById="hero-video-desc"
              labels={{ play: a11y.play, pause: a11y.pause }}
              startAt={HERO_POSTER_TIME}
              cardClassName="hero-video"
              priority
            />
            <p id="hero-video-desc" className="sr-only">
              {a11y.heroVideoDesc}
            </p>
          </m.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
