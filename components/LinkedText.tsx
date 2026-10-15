import React from 'react';
import type { InlineLink } from '../types';
import { cjkNodes } from './CjkText';

const HAN_START = /^[\u3400-\u9fff\uf900-\ufaff]/;
const HAN_END = /[\u3400-\u9fff\uf900-\ufaff]$/;

/** 把段落裡的 link.text 這段原文包成行內連結；找不到時把連結接在段落後面。中文換行規則見 CjkText。 */
const LinkedText: React.FC<{ text: string; link?: InlineLink }> = ({ text, link }) => {
  if (!link) return <>{cjkNodes(text)}</>;
  const anchor = (
    <a href={link.href} className="link-inline">
      {link.text}
    </a>
  );
  const index = text.indexOf(link.text);
  if (index < 0) {
    return (
      <>
        {cjkNodes(text, false)} {anchor}
      </>
    );
  }
  const before = text.slice(0, index);
  const after = text.slice(index + link.text.length);
  // 前後段各自包在 keep-all 的 span 裡；漢字直接接著連結時，補一個詞間斷點。
  const visibleBefore = before.replace(/[{}]/g, '');
  const visibleAfter = after.replace(/[{}]/g, '');
  return (
    <>
      {cjkNodes(before, false)}
      {HAN_END.test(visibleBefore) && HAN_START.test(link.text) && <wbr />}
      {anchor}
      {HAN_END.test(link.text) && HAN_START.test(visibleAfter) && <wbr />}
      {cjkNodes(after)}
    </>
  );
};

export default LinkedText;
