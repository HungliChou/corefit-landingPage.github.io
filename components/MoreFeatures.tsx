import React from 'react';
import type { ContentData } from '../types';
import LinkedText from './LinkedText';
import CjkText from './CjkText';
import PlanBadge from './PlanBadge';
import Reveal from './Reveal';

/** 次要功能：安靜的清單（≥768 兩欄），不做成一排排卡片，避免和主要功能搶焦點。 */
const MoreFeatures: React.FC<{ content: ContentData }> = ({ content }) => {
  const { more, tags } = content;
  return (
    <section id="more" aria-labelledby="more-title" className="section pt-0 md:pt-0 xl:pt-0">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{more.eyebrow}</p>
          <h2 id="more-title" className="t-h2 mt-4 text-ink">
            <CjkText text={more.title} />
          </h2>
        </Reveal>
        <ul className="mx-auto mt-10 grid max-w-[980px] md:mt-14 md:grid-cols-2 md:gap-x-14">
          {more.items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} as="li" delay={(i % 2) * 0.06} amount={0.3} y={12} className="more-item">
                <Icon size={20} strokeWidth={2} className="more-item__icon" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="t-h4 text-ink">
                      <CjkText text={item.title} tail={false} />
                    </h3>
                    {item.tag && <PlanBadge tag={item.tag} label={tags[item.tag]} />}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-[1.7] text-ink-2">
                    <LinkedText text={item.body} link={item.link} />
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default MoreFeatures;
