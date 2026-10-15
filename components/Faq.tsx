import React from 'react';
import { ChevronDown } from 'lucide-react';
import { IS_LIVE } from '../config';
import type { ContentData } from '../types';
import LinkedText from './LinkedText';
import CjkText from './CjkText';
import Reveal from './Reveal';

const Faq: React.FC<{ content: ContentData }> = ({ content }) => {
  const { faq } = content;
  const items = [IS_LIVE ? faq.firstLive : faq.firstPre, ...faq.items];

  return (
    <section id="faq" aria-labelledby="faq-title" className="section band">
      <div className="wrap">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 id="faq-title" className="t-h2 text-center text-ink">
              <CjkText text={faq.title} tail={false} />
            </h2>
          </Reveal>

          <div className="mt-10 border-t border-line md:mt-14">
            {items.map((item) => (
              <details key={item.q} className="faq-item border-b border-line">
                <summary className="text-ink">
                  <span>
                    <CjkText text={item.q} />
                  </span>
                  <ChevronDown size={20} className="faq-chevron" aria-hidden="true" />
                </summary>
                <p className="faq-answer">
                  <LinkedText text={item.a} link={item.link} />
                </p>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center text-[15px] text-ink-2">
            <CjkText text={faq.more} tail={false} />{' '}
            <a href={`mailto:${faq.email}`} className="link-inline">
              {faq.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faq;
