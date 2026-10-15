import React from 'react';
import { IS_LIVE } from '../config';
import type { ContentData } from '../types';
import CoreFitLogo from './CoreFitLogo';
import CjkText from './CjkText';
import Reveal from './Reveal';
import StoreCta from './StoreCta';

const DownloadCta: React.FC<{ content: ContentData }> = ({ content }) => {
  const { download, status } = content;
  return (
    <section id="download" aria-labelledby="download-title" className="section">
      <div className="wrap">
        <Reveal className="grad-frame mx-auto max-w-[960px] rounded-[32px]">
          <div className="relative isolate overflow-hidden rounded-[31px] bg-surface px-5 py-14 text-center sm:px-10 lg:py-24">
            <div className="cta-glow -z-10" aria-hidden="true" />
            <CoreFitLogo size={64} className="mx-auto h-16 w-16 rounded-[18px]" />
            <h2 id="download-title" className="t-h2 mx-auto mt-7 max-w-[16em] text-ink">
              <CjkText text={download.title} />
            </h2>
            <p className="copy mx-auto mt-5">
              <CjkText text={IS_LIVE ? download.subLive : download.subPre} />
            </p>
            <div className="mt-9">
              <StoreCta variant="final" status={status} secondary={{ label: download.secondary, href: '#film' }} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default DownloadCta;
