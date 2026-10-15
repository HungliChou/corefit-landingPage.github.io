# CoreFit 官網

CoreFit（iPhone AI 健身課表 App）的官網，網址 <https://www.corefit-ai.com/>（`/` 繁體中文、`/en/` 英文）。

- 技術：Vite + React 19，樣式用 Tailwind Play CDN（設定在 `public/tw-config.js`）＋ `index.css`。
- 文案全部集中在 `constants.tsx`（中英兩份），元件內不寫死文字。
- 法律頁面（`public/privacy`、`public/terms`、`public/delete-account` 與 `public/en/*`）是獨立的靜態 HTML，網址不可更動。
- `download/` 是 App 分享卡片與 QR code 使用的 `/download/` 導轉頁（部署時由 workflow 複製到 `dist/`），網址不可更動。

## 本機開發

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 輸出到 dist/
npm run preview  # 預覽 build 結果
```

本機預覽法律頁面與 `/download/` 前，要先手動做一次 workflow 的複製步驟（`vite build` 不會輸出這些檔案，少了會看到 logo 破圖、`/download/` 404；正式站由 CI 補上，不受影響）：

```bash
npm run build && cp -r download dist/ && cp logo.png logo-384.webp dist/ && npm run preview
```

## 部署

推送到 `main` 後，GitHub Actions（`.github/workflows/deploy.yml`）會自動 build 並部署到 GitHub Pages（自訂網域 www.corefit-ai.com）。

## 媒體素材

`public/media/` 內的檔案由原始素材轉出：

| 檔案 | 來源 | 備註 |
|---|---|---|
| `shot-{zh,en}-NN.webp`、`@2x` | `~/Desktop/CoreFit_Store_Screenshots/v8_final/` | 01、08 裁掉海報上方的大標（01 與首屏主標重複；08 是數字型標語），再以裁切線那一列的海報底色往上補到第一個元素（膠囊／手機）上方留 150px（@2x）；高度寫在 `Story.tsx` 的 `CROPPED_H` |
| `flow-{zh,en}.mp4`（H.264，只提供 MP4） | `~/Desktop/CoreFit_Launch_Videos/03_FLOW_dark/instagram/` | 首屏靜音循環：**只取 0–27.2 秒**（結尾 27.3 秒起有 App Store 下載徽章），並移除音軌 |
| `showcase-{zh,en}.mp4`（H.264＋AAC，只提供 MP4） | `~/Desktop/CoreFit_Showcase_Video/v3_30s_120bpm/website/` | 介紹影片（有聲）：**只取 0–28.7 秒**（28.8 秒起有下載徽章），結尾 0.7 秒音訊淡出 |
| `showcase-en.mp4` 的標題修正 | 同上（英文版） | 原片第 22.5–25.0 秒的標題「Your gains, in numbers.」是數字型標語，已換成「Progress, you can see.」（與 FLOW_dark 相同）。做法：用 `showcase_v3.html` 只改 `COPY.en.progress` 重新渲染該段，再把「新舊渲染的差異」疊回原片的第 660–764 幀，其餘畫面與音軌不變。**桌面的原始檔 `source/showcase_v3.html` 與 `website/` 成品仍是舊字樣**，日後重新輸出或換回含徽章的完整版時，要先把該字串改掉。 |
| `showcase-{zh,en}-poster.webp` | 同上，第 10.3 秒 | 影片封面（每週回顧畫面） |
| `og-{zh,en}.jpg`（1200×630） | `v8_final/` 截圖 01（目標／計畫長度／訓練日設定卡）與 02（每週狀況回報卡） | 社群分享圖：只用純 App 介面卡片，**不放任何 AI 生成的人物**；卡片完整落在畫面內（四邊至少留 48px），不貼邊、不出血 |

上架前不可在影片或頁面上出現 App Store 徽章（Apple 只允許已上架的 App 使用）。

## 上架當天切換清單

1. `config.ts`：`APP_STATUS` 改成 `'live'`（React 頁面會改顯示 App Store 徽章與下載按鈕、FAQ 第一題換成「可以下載了嗎？」、頁尾顯示 Apple 商標聲明）。
2. `index.html` 與 `en/index.html` 的 `<head>`，把「即將上架」/「Coming soon」改掉：
   - `<meta name="description">`
   - `og:description`、`twitter:description`
   - `<main>` 裡靜態 fallback 的 `<p>`（JS 載入前與搜尋引擎看到的內容）
3. JSON-LD：上架後再於兩個 HTML 的 `@graph` 加回 `MobileApplication` 節點（含 `offers`：`{"@type":"Offer","price":"0","priceCurrency":"USD"}`）。評分只能用 App Store 的真實資料，不可自行填寫。
4. `download/index.html`：`IOS_APPSTORE_URL` 填 `https://apps.apple.com/app/id6757706921`。
5. （可選）首屏與介紹影片換回含下載徽章的完整版：依上表來源重新轉檔，不再截尾。
6. `public/sitemap.xml`：首頁兩筆的 `<lastmod>` 改成上架日期。

## 已知取捨

- **Tailwind Play CDN**：瀏覽器端即時產生 CSS，會在 console 出現 “should not be used in production” 警告，且是 `<head>` 裡的同步腳本（約 123 KB gzip／407 KB），會延後首次繪製，是目前頁面最大的效能成本。改成 build 時編譯需要新增 `tailwindcss@3`／`postcss`／`autoprefixer` 三個 devDependencies（不會增加送到瀏覽器的程式）：把 `public/tw-config.js` 搬成 `tailwind.config.js`（content 含 `./index.html`、`./en/index.html`、`./**/*.tsx`），在 `index.css` 開頭加 `@tailwind base/components/utilities`，再刪掉兩個 HTML 的 CDN `<script>` 與 `public/tw-config.js`。待決定後再改。
- **Google Fonts**：字型 CSS 以 `preload` + `onload` 非阻塞載入（附 `<noscript>` 後備），首屏會先用系統字型、字型到位後替換（`display=swap`）。英文頁只載入 Mona Sans，Noto Sans TC 用 `text=` 只取「繁體中文」四個字。
- **法律頁面**仍有 Google Play／Android 相關描述，但目前沒有 Android 版；需另外做法律審閱，本次改版未更動法律內文。
