import React from 'react';
import { m } from 'framer-motion';
import { EASE_OUT, usePrefersReducedMotion } from '../hooks';
import type { ContentData } from '../types';
import CjkText from './CjkText';
import Reveal from './Reveal';

const HowItWorks: React.FC<{ content: ContentData }> = ({ content }) => {
  const { how } = content;
  const reduced = usePrefersReducedMotion();
  const last = how.steps.length - 1;

  return (
    <section id="how" aria-labelledby="how-title" className="section band">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{how.eyebrow}</p>
          <h2 id="how-title" className="t-h2 mt-4 text-ink">
            <CjkText text={how.title} />
          </h2>
        </Reveal>

        {/* 768–1023 的版心只有 720–975px，三欄每欄不到 300px 太擠；平板維持直排時間軸，桌機（≥1024）才排成三欄。 */}
        <ol className="mx-auto mt-12 grid max-w-[560px] md:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {how.steps.map((step, i) => (
            <Reveal
              key={step.title}
              as="li"
              delay={i * 0.08}
              className={`relative flex gap-5 lg:block ${i < last ? 'pb-10 lg:pb-0' : ''}`}
            >
              {i < last && (
                <>
                  {/* 手機／平板：直線連到下一步 */}
                  <span className="step-line left-[23px] top-14 bottom-2 w-[2px] lg:hidden" aria-hidden="true" />
                  {/* 桌機：水平線連到下一欄的圓圈 */}
                  <m.span
                    className="step-line hidden h-[2px] origin-left lg:block"
                    style={{ left: 60, top: 23, width: 'calc(100% - 40px)' }}
                    aria-hidden="true"
                    {...(reduced
                      ? {}
                      : {
                          initial: { scaleX: 0 },
                          whileInView: { scaleX: 1 },
                          viewport: { once: true, amount: 0.6 },
                          transition: { duration: 0.7, ease: EASE_OUT, delay: 0.2 + i * 0.15 },
                        })}
                  />
                </>
              )}
              <div className="step-num" aria-hidden="true">
                <span>{i + 1}</span>
              </div>
              <div className="lg:mt-6 lg:pr-4">
                <h3 className="t-h4 pt-2.5 text-ink lg:pt-0">
                  <CjkText text={step.title} tail={false} />
                </h3>
                <p className="mt-2 text-[15px] leading-[1.7] text-ink-2 md:text-base">
                  <CjkText text={step.body} />
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <p className="balance-en mx-auto mt-12 max-w-[640px] text-center text-[14px] leading-[1.7] text-ink-3 md:mt-16">
          <CjkText text={how.note} />
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
