import React from 'react';

/**
 * 中文換行（不影響英文）：
 * 1. 只在「詞與詞之間」換行：用 Intl.Segmenter 斷詞，在兩個漢字詞之間插入 <wbr>，
 *    外層用 word-break: keep-all 禁止漢字之間的預設斷點，所以「決定」「看看」這類詞不會被拆到兩行。
 *    標點後、空白處照常可以換行。
 * 2. 文案裡用 {…} 標出不可拆開的詞組，例如「到{跟夥伴一起練}」；大括號不會顯示。
 * 3. 段落最後的幾個詞黏成一組（至少 3 個漢字、最多 8 個字），避免最後一行只剩 1–2 個字。
 * 不支援 Intl.Segmenter 的瀏覽器退回瀏覽器預設的逐字換行（不加 keep-all，避免整段無法換行而溢出）。
 * 英文字串不含漢字，原樣輸出（只去掉 {…} 標記）。
 */
const HAN = /[\u3400-\u9fff\uf900-\ufaff]/;
const HAN_START = /^[\u3400-\u9fff\uf900-\ufaff]/;
const HAN_END = /[\u3400-\u9fff\uf900-\ufaff]$/;
/** 只由漢字與全形標點組成（可以黏進句尾那一組）。 */
const TAIL_TOKEN = /^[\u3400-\u9fff\uf900-\ufaff，。、！？：；「」『』（）…]+$/;
const TAIL_MIN_HAN = 3;
const TAIL_MAX_CHARS = 8;
/**
 * 全形標點後（，。、：）、全形左括號前可以換行。Chrome 在 keep-all 下本來就允許，
 * 但 Safari（WebKit）的 keep-all 會連標點旁的斷點一起拿掉：整句「練了什麼，再排好下一週。今天…」
 * 變成一個拆不開的長字串，min-content 撐寬容器（首屏手機版影片因此偏右），窄欄只能靠 break-word 從詞中間硬拆。
 * 這裡明確補上 <wbr>，讓兩個瀏覽器的斷行一致。
 */
const BREAK_AFTER = /[，。、！？；：」』）…＞]$/;
const OPEN_START = /^[（「『]/;
/** 這些字元前面不能斷行（句讀、右括號、間隔號）。 */
const NO_BREAK_BEFORE = /^[，。、！？；：」』）…・]/;

const segmenter: Intl.Segmenter | null = (() => {
  try {
    return typeof Intl !== 'undefined' && 'Segmenter' in Intl ? new Intl.Segmenter('zh-Hant', { granularity: 'word' }) : null;
  } catch {
    return null;
  }
})();

interface Token {
  text: string;
  /** {…} 詞組：整組不換行。 */
  group: boolean;
}

/**
 * 斷詞字典切不準的產品用語與複合詞（例如會切成「智能填｜重」），一律當成一個詞。
 * 新文案若出現被拆開的專有名詞，加在這裡或在文案中用 {…} 標出。
 */
const TERMS = [
  '總訓練量',
  '每一週',
  '每一組',
  '下一週',
  '週中',
  '智能填重',
  '肌肉疲勞度',
  '演進計畫',
  '動作庫',
  '超級組',
  '教練版',
  '新手引導',
  '計畫藍圖',
  '週期化',
  '解鎖',
  '扣點',
  '點數包',
  '席位包',
  '訓練量',
  '訓練紀錄',
  '重置',
  '物理治療師',
];
const TERM_RE = new RegExp(`(${TERMS.join('|')})`);

/**
 * 數字和前後的漢字（以及「iOS 15.6」這類英文＋版本號）之間用不換行空白，避免「300｜點」「第｜1 週」被拆到兩行。
 * 英文詞和後面緊接的漢字詞也黏在一起（「AI｜教練」「YouTube｜影片」「Pro｜每月」），斷點留在英文詞前面的空白。
 */
function glueNumbers(s: string): string {
  return s
    .replace(/(\d[\d.,+]*) (?=[\u3400-\u9fff])/g, '$1\u00a0')
    .replace(/([\u3400-\u9fff]) (?=\d)/g, '$1\u00a0')
    .replace(/([A-Za-z]) (?=\d)/g, '$1\u00a0')
    .replace(/([A-Za-z]) (?=[\u3400-\u9fff])/g, '$1\u00a0');
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  for (const part of glueNumbers(text).split(/(\{[^{}]+\})/)) {
    if (!part) continue;
    if (part.startsWith('{') && part.endsWith('}')) {
      tokens.push({ text: part.slice(1, -1), group: true });
    } else if (segmenter) {
      for (const piece of part.split(TERM_RE)) {
        if (!piece) continue;
        if (TERMS.includes(piece)) tokens.push({ text: piece, group: false });
        else for (const s of segmenter.segment(piece)) tokens.push({ text: s.segment, group: false });
      }
    } else {
      tokens.push({ text: part, group: false });
    }
  }
  return tokens;
}

function countHan(s: string): number {
  let n = 0;
  for (const ch of s) if (HAN.test(ch)) n += 1;
  return n;
}

/** 句尾要黏在一起的 token 起點（index）；不需要時回傳 tokens.length。 */
function tailStart(tokens: Token[]): number {
  let han = 0;
  let chars = 0;
  let i = tokens.length;
  while (i > 0 && han < TAIL_MIN_HAN) {
    const t = tokens[i - 1];
    if (!TAIL_TOKEN.test(t.text)) break;
    const len = [...t.text].length;
    if (chars + len > TAIL_MAX_CHARS) break;
    chars += len;
    han += countHan(t.text);
    i -= 1;
  }
  // 沒湊到足夠的漢字，或整段都被黏住（段落太短），就不處理
  if (han < TAIL_MIN_HAN || i === 0) return tokens.length;
  return i;
}

/**
 * 兩個 token 之間要不要補 <wbr>：「漢字｜漢字」之間（keep-all 會把這裡的預設斷點拿掉）、
 * 全形標點與選單路徑的「＞」後面、全形左括號前面。前一個 token 以空白結尾時本來就能換行，不必補。
 */
function breakBetween(prev: string, next: string): boolean {
  if (NO_BREAK_BEFORE.test(next) || /\s$/.test(prev)) return false;
  return (HAN_END.test(prev) && HAN_START.test(next)) || BREAK_AFTER.test(prev) || (OPEN_START.test(next) && !OPEN_START.test(prev.slice(-1)));
}

function renderTokens(tokens: Token[], keyPrefix: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  tokens.forEach((t, i) => {
    const prev = tokens[i - 1];
    if (segmenter && prev && breakBetween(prev.text, t.text)) {
      out.push(<wbr key={`${keyPrefix}w${i}`} />);
    }
    out.push(
      t.group ? (
        <span key={`${keyPrefix}g${i}`} className="whitespace-nowrap">
          {t.text}
        </span>
      ) : (
        t.text
      )
    );
  });
  return out;
}

export function cjkNodes(text: string, tail = true): React.ReactNode[] {
  if (!HAN.test(text)) return [text.replace(/[{}]/g, '')];
  const tokens = tokenize(text);
  const cut = tail ? tailStart(tokens) : tokens.length;
  const body = renderTokens(tokens.slice(0, cut), 'b');
  if (cut < tokens.length) {
    const last = tokens.slice(cut);
    const prev = tokens[cut - 1];
    if (segmenter && prev && breakBetween(prev.text, last[0].text)) body.push(<wbr key="tw" />);
    body.push(
      <span key="tail" className="whitespace-nowrap">
        {last.map((t) => t.text).join('')}
      </span>
    );
  }
  if (!segmenter) return body;
  return [
    <span key="kw" className="cjk-kw">
      {body}
    </span>,
  ];
}

const CjkText: React.FC<{ text: string; tail?: boolean }> = ({ text, tail = true }) => <>{cjkNodes(text, tail)}</>;

export default CjkText;
