import React from 'react';
import type { ContentData, Lang } from '../types';
import LoopVideo from './LoopVideo';
import CjkText from './CjkText';
import Reveal from './Reveal';

/**
 * Showcase 影片：點了才載入、有聲播放（淺色封面當影片縮圖，不會自動播放）。
 * 手機：文字 → 影片 → 結語；桌機：左欄文字＋結語、右欄影片。
 */
const Film: React.FC<{ content: ContentData; lang: Lang }> = ({ content, lang }) => {
  const { film, a11y } = content;
  return (
    <section id="film" aria-labelledby="film-title" className="section film-bg">
      <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-10">
        <Reveal className="text-center lg:col-span-6 lg:row-start-1 lg:self-end lg:pr-6 lg:text-left">
          <p className="eyebrow">{film.eyebrow}</p>
          <h2 id="film-title" className="t-h2 mt-4 text-ink">
            <CjkText text={film.title} tail={false} />
          </h2>
          <p className="copy film-copy mx-auto mt-5 lg:mx-0">
            <CjkText text={film.body} />
          </p>
        </Reveal>

        <div className="flex justify-center lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
          <LoopVideo
            mode="click"
            poster={`/media/showcase-${lang}-poster.webp`}
            mp4={`/media/showcase-${lang}.mp4`}
            labels={{ play: a11y.filmPlay, video: a11y.filmVideoLabel }}
            cardClassName="film-video"
          />
        </div>

        <div className="text-center lg:col-span-6 lg:row-start-2 lg:self-start lg:text-left">
          <p className="film-closing text-grad">
            <CjkText text={film.closing} tail={false} />
          </p>
          <p className="fine balance-en mt-3">
            <CjkText text={film.disclosure} />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Film;
