import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Pause, Play } from 'lucide-react';

interface LoopVideoProps {
  /**
   * ambient：Hero 用。靜音循環，等頁面 load + idle 後才載入；離開畫面或分頁隱藏時暫停；
   *          reduced-motion／省流量／慢速網路時只顯示 poster，點了才播。
   * click：Film 用。只顯示封面＋播放鈕，使用者點擊後才載入並有聲播放。
   */
  mode: 'ambient' | 'click';
  poster: string;
  /** H.264 MP4（所有瀏覽器都能播，不另外提供 WebM）。 */
  mp4: string;
  describedById?: string;
  labels: { play: string; pause?: string; video?: string };
  /** 第一次 loadedmetadata 時跳到的秒數（和 poster 同一格）。 */
  startAt?: number;
  cardClassName?: string;
  /** 首屏 poster 用 high，其餘 lazy。 */
  priority?: boolean;
}

type ConnectionLike = { saveData?: boolean; effectiveType?: string };

/** 是否允許自動載入並播放背景影片。所有判斷都包 try/catch，讀不到就當作允許。 */
function canAutoplay(): boolean {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  } catch {
    /* ignore */
  }
  try {
    const conn = (navigator as Navigator & { connection?: ConnectionLike }).connection;
    if (conn?.saveData === true) return false;
    if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return false;
  } catch {
    /* ignore */
  }
  return true;
}

/** 等 window load（已完成就立即），再等瀏覽器空閒。 */
function afterLoadAndIdle(cb: () => void): () => void {
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const w = window as Window & {
    requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const schedule = () => {
    if (cancelled) return;
    if (typeof w.requestIdleCallback === 'function') {
      idleId = w.requestIdleCallback(() => !cancelled && cb(), { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(() => !cancelled && cb(), 1200);
    }
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener('load', schedule);
    if (idleId !== undefined && typeof w.cancelIdleCallback === 'function') w.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}

const AmbientVideo: React.FC<LoopVideoProps> = ({
  poster,
  mp4,
  describedById,
  labels,
  startAt,
  cardClassName = '',
  priority,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // null = 還在等 load/idle；true = 自動播放；false = 只顯示 poster，點了才播
  const [auto, setAuto] = useState<boolean | null>(null);
  const [requested, setRequested] = useState(false); // 是否已掛上 <source> 並 load()
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false); // 影片第一次 playing 後才淡入，蓋過 poster
  const [blocked, setBlocked] = useState(false); // 自動播放被瀏覽器拒絕
  const [userPaused, setUserPaused] = useState(false); // 使用者手動暫停後不再自動恢復
  const userPausedRef = useRef(false);
  const inViewRef = useRef(true);
  const autoPausedRef = useRef(false); // 因離開畫面／分頁隱藏而暫停，回來時要恢復
  const seekedRef = useRef(false);
  const userPlayRef = useRef(false); // 使用者按過播放：之後的播放都視為使用者要求，不受離開畫面規則影響
  const wantPlayRef = useRef(false); // load/idle 後決定自動播放，交給「掛上 source」的 effect 處理
  const loadedRef = useRef(false); // 已開始載入掛上的 <source>
  // 決定要自動播放時卡片不在畫面內（例如帶 /#faq 進站）：先不掛 <source>，第一次進入畫面才開始下載。
  const pendingRequestRef = useRef(false);

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === 'function') {
      p.catch((err: unknown) => {
        // 播放還在等資料時被使用者按了暫停，play() 會以 AbortError 結束；這不是瀏覽器擋自動播放，
        // 不能切成手動模式。
        if ((err as { name?: string } | null)?.name === 'AbortError') return;
        setBlocked(true);
        setPlaying(false);
      });
    }
  }, []);

  // iOS 只有在 muted 屬性存在時才允許自動播放，React 不會輸出 muted 屬性，所以在 ref 上補設。
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');
  }, []);

  // 等 load + idle 再決定要不要自動載入
  useEffect(() => {
    return afterLoadAndIdle(() => {
      const ok = canAutoplay();
      setAuto(ok);
      // 使用者在這之前已手動播放過（loadedRef 為 true）就不必再排自動播放
      if (ok && !userPausedRef.current && !loadedRef.current) {
        wantPlayRef.current = true;
        if (inViewRef.current) setRequested(true);
        else pendingRequestRef.current = true;
      }
    });
  }, []);

  // 掛上 source 之後開始載入（使用者點擊時已在 handlePlay 內同步 load 過的就跳過）。
  // 插入 <source> 本身就會啟動瀏覽器的資源選擇並開始下載（networkState 不再是 NETWORK_EMPTY），
  // 這時再呼叫 load() 會中止那次請求、重抓一次，所以只有還沒開始時才補呼叫 load()。
  // iOS／WebKit：<video> 本身是 muted + playsInline + autoplay + loop，先把 preload 設成 auto，
  // 然後直接 play()，不等 loadedmetadata（WebKit 在 preload 較保守時 loadedmetadata 可能永遠不會來）。
  // autoplay 屬性是第二道保險；play() 被拒絕（例如 iOS 低耗電模式）時改顯示手動播放鈕。
  useEffect(() => {
    if (!requested || loadedRef.current) return;
    const el = videoRef.current;
    if (!el) return;
    loadedRef.current = true;
    el.preload = 'auto';
    if (el.networkState === HTMLMediaElement.NETWORK_EMPTY) el.load();
    if (wantPlayRef.current) {
      wantPlayRef.current = false;
      if (inViewRef.current && document.visibilityState !== 'hidden') tryPlay();
      else autoPausedRef.current = true; // 回到畫面時由 resumeIfAutoPaused 開始播放
    }
  }, [requested, tryPlay]);

  // 影片事件
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onMeta = () => {
      if (!seekedRef.current) {
        seekedRef.current = true;
        if (startAt && el.duration && startAt < el.duration) {
          try {
            el.currentTime = startAt;
          } catch {
            /* ignore */
          }
        }
      }
    };
    const onPlaying = () => {
      // autoplay 屬性可能在卡片已捲出畫面（或分頁隱藏）時才開始播放；這種自動播放先暫停，回到畫面再繼續。
      if (!userPlayRef.current && (!inViewRef.current || document.visibilityState === 'hidden')) {
        autoPausedRef.current = true;
        el.pause();
        return;
      }
      setPlaying(true);
      setShown(true);
      setBlocked(false);
    };
    const onPause = () => setPlaying(false);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onPause);
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onPause);
    };
  }, [startAt, tryPlay]);

  // 離開畫面暫停、回來恢復；分頁隱藏時也暫停
  useEffect(() => {
    const el = videoRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    const pauseForAuto = () => {
      if (!el.paused) {
        autoPausedRef.current = true;
        el.pause();
      }
    };
    const resumeIfAutoPaused = () => {
      if (autoPausedRef.current && !userPausedRef.current && inViewRef.current && document.visibilityState !== 'hidden') {
        autoPausedRef.current = false;
        tryPlay();
      }
    };

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            inViewRef.current = entry.isIntersecting;
            if (entry.isIntersecting) {
              if (pendingRequestRef.current) {
                pendingRequestRef.current = false;
                if (!userPausedRef.current && !loadedRef.current) setRequested(true);
              }
              resumeIfAutoPaused();
            } else pauseForAuto();
          }
        },
        // 只要有任何一個像素在畫面內就算「在畫面內」：手機首屏（例如 375×553 的 Safari 可視區）
        // 卡片常常只露出不到 25%，用較高門檻會讓影片進站時不播、捲回頂端時被暫停。
        { threshold: 0 }
      );
      io.observe(card);
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') pauseForAuto();
      else resumeIfAutoPaused();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tryPlay]);

  const manual = auto === false || blocked;
  // 控制鈕顯示的動作：預設會自動播放（還在等載入）時顯示「暫停」，讓使用者可以先擋下來。
  const showPause = playing || (!userPaused && !blocked && auto !== false && !shown);

  const handlePlay = () => {
    userPlayRef.current = true;
    userPausedRef.current = false;
    setUserPaused(false);
    autoPausedRef.current = false;
    pendingRequestRef.current = false;
    const el = videoRef.current;
    if (!el) return;
    if (!requested) {
      // 在點擊事件內同步掛上 <source>、load() 並 play()：iOS 低耗電模式只允許「使用者手勢內」的播放，
      // 若等 loadedmetadata 再 play() 會被拒絕，使用者得再點一次。
      wantPlayRef.current = false;
      flushSync(() => setRequested(true));
      if (!loadedRef.current) {
        loadedRef.current = true;
        el.preload = 'auto';
        el.load();
      }
      tryPlay();
      return;
    }
    // 還沒拿到 metadata 也直接 play()（Safari 要靠 play() 才會開始載入）
    tryPlay();
  };

  const handlePause = () => {
    userPausedRef.current = true;
    setUserPaused(true);
    autoPausedRef.current = false;
    wantPlayRef.current = false;
    pendingRequestRef.current = false;
    videoRef.current?.pause();
  };

  const toggle = () => (showPause ? handlePause() : handlePlay());

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${cardClassName}`}>
        <div className="video-glow" aria-hidden="true" />
        <div ref={cardRef} className="video-card">
          <img
            src={poster}
            width={720}
            height={1280}
            alt=""
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
          />
          <video
            ref={videoRef}
            muted
            playsInline
            loop={auto !== false}
            autoPlay={auto === true && !userPaused}
            preload="metadata"
            aria-describedby={describedById}
            className={`fade ${shown ? '' : 'is-hidden'}`}
          >
            {requested && <source src={mp4} type="video/mp4" />}
          </video>
          {manual && !playing && (
            <button type="button" className="video-center-play" aria-label={labels.play} onClick={handlePlay}>
              <Play size={26} fill="currentColor" strokeWidth={0} aria-hidden="true" style={{ marginLeft: 3 }} />
            </button>
          )}
        </div>
      </div>
      {/* 手動模式且尚未播放時，卡片中央已有播放鈕，下方這顆先隱藏（保留位置避免版面跳動），開始播放後才出現以便暫停。 */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className={`icon-btn ${manual && !playing ? 'invisible' : ''}`}
          aria-label={showPause ? labels.pause : labels.play}
          aria-hidden={manual && !playing ? true : undefined}
          tabIndex={manual && !playing ? -1 : undefined}
          onClick={toggle}
        >
          {showPause ? (
            <Pause size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
          ) : (
            <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" style={{ marginLeft: 2 }} />
          )}
        </button>
      </div>
    </div>
  );
};

const ClickVideo: React.FC<LoopVideoProps> = ({ poster, mp4, labels, cardClassName = '' }) => {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 在點擊事件內同步掛上 <video> 並 play()：iOS Safari 只允許「使用者手勢內」開始有聲播放，
  // 若留到 effect 才 play() 可能已不在手勢範圍內而被拒絕。controls 讓使用者在被拒絕時仍能手動播放。
  const start = () => {
    flushSync(() => setActive(true));
    const el = videoRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => undefined);
  };

  return (
    <div className={`relative ${cardClassName}`}>
      <div className="video-glow" aria-hidden="true" />
      <div className="video-card video-card--film">
        {active ? (
          <video
            ref={videoRef}
            controls
            playsInline
            autoPlay
            preload="auto"
            poster={poster}
            aria-label={labels.video}
          >
            <source src={mp4} type="video/mp4" />
          </video>
        ) : (
          <>
            <img src={poster} width={720} height={1280} alt="" loading="lazy" decoding="async" />
            <button type="button" className="film-cover" aria-label={labels.play} onClick={start}>
              <span className="film-cover__disc" aria-hidden="true">
                <Play size={30} fill="currentColor" strokeWidth={0} style={{ marginLeft: 4 }} />
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const LoopVideo: React.FC<LoopVideoProps> = (props) =>
  props.mode === 'click' ? <ClickVideo {...props} /> : <AmbientVideo {...props} />;

export default LoopVideo;
