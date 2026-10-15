import React from 'react';
import { Check, Coins } from 'lucide-react';
import type { ContentData, Plan } from '../types';
import CjkText from './CjkText';
import Reveal from './Reveal';

const PlanCard: React.FC<{ plan: Plan; recommended: string }> = ({ plan, recommended }) => {
  const body = (
    <article
      className={`flex h-full flex-col rounded-[24px] p-7 ${
        plan.highlight ? 'plan-card--highlight' : 'border border-line bg-surface'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="t-plan text-ink">{plan.name}</h3>
        {plan.highlight && <span className="plan-label">{recommended}</span>}
      </div>
      <p className="mt-2 text-[15px] leading-[1.6] text-ink-2">
        <CjkText text={plan.lead} />
      </p>
      <div className="my-6 h-px bg-line" aria-hidden="true" />
      <ul className="plan-items space-y-3.5">
        {plan.items.map((item) => (
          <li key={item} className="flex gap-3 text-[15px] leading-[1.6] text-ink-2">
            <Check size={16} strokeWidth={2.5} className="mt-[0.28em] flex-none text-focus" aria-hidden="true" />
            <span>
              <CjkText text={item} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
  if (!plan.highlight) return body;
  return <div className="grad-frame h-full rounded-[25px] shadow-[0_30px_80px_-40px_rgba(47,107,255,0.6)]">{body}</div>;
};

const Plans: React.FC<{ content: ContentData }> = ({ content }) => {
  const { plans } = content;
  return (
    <section id="plans" aria-labelledby="plans-title" className="section">
      <div className="wrap">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <p className="eyebrow">{plans.eyebrow}</p>
          <h2 id="plans-title" className="t-h2 mt-4 text-ink">
            <CjkText text={plans.title} />
          </h2>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-[560px] gap-4 md:mt-16 lg:max-w-none lg:grid-cols-3 lg:gap-5">
          {plans.plans.map((plan, i) => (
            <Reveal key={plan.name} as="li" delay={i * 0.06} amount={0.2}>
              <PlanCard plan={plan} recommended={plans.recommended} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mx-auto mt-6 max-w-[560px] lg:max-w-none">
          <div className="flex flex-col gap-4 rounded-[20px] border border-line bg-surface p-6 sm:flex-row sm:gap-5">
            <span className="icon-tile flex-none" aria-hidden="true">
              <Coins size={24} strokeWidth={2} />
            </span>
            <div>
              <h3 className="t-h4 text-ink">
                <CjkText text={plans.pointsTitle} tail={false} />
              </h3>
              <p className="mt-2 text-[15px] leading-[1.7] text-ink-2 lg:max-w-[880px]">
                <CjkText text={plans.pointsBody} />
              </p>
            </div>
          </div>
        </Reveal>

        <p className="balance-en mx-auto mt-8 max-w-[760px] text-center text-[14px] leading-[1.7] text-ink-3">
          <CjkText text={plans.fine} />
        </p>
      </div>
    </section>
  );
};

export default Plans;
