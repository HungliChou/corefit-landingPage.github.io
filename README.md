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
| `ui-{zh,en}-<name>.webp`、`@2x`（1x 寬 400px、@2x 寬 800px，WebP q82） | `~/Desktop/CoreFit_Store_Screenshots/raw_v9/{zh,en}/`（模擬器原圖）；`fatigue`、`smartfill` 與中文 `metrics` 取自 `v5_final/raw_{zh,en}/`（raw_v9 的示範帳號資料過期：疲勞度人體圖全灰、智能填重建議與原重量相同；raw_v9 中文 1RM 圖的 Y 軸「200」「190」疊在一起） | 功能區塊的 App 介面裁圖，只放純 App 介面、不含狀態列、動態島與人物，上下緣都落在元素之間的空隙，不切到按鈕或文字。裁切範圍（1320×2868 原圖座標，[x, y, 寬, 高]）：`plan`＝evolving_home [40,392,1200,670]（只到「第 1 週／第 12 週」那一列；下方階段說明的中文最後一行只剩「礎。」，不放）、`setup`＝evolving_setup 中文 [30,1072,1260,726]、英文 [30,1234,1260,726]（只取「計畫長度」與「每週訓練日」兩塊，桌機大卡上方那張）、`checkin`＝checkin [26,880,1268,880]（睡眠品質＋肌肉痠痛兩塊）、`smartfill`＝smart_fill_result 中文 [26,1630,1268,610]（第 3、4 個動作：保加利亞分腿蹲、槓桿臥腿彎舉；前兩個動作的示範建議值是原重量的 2–3 倍，不放上官網）、英文 [26,982,1268,648]（前兩個動作），都只取兩個完整的動作列、`logging`＝set_logging [26,975,1268,1000]、`fatigue`＝fatigue 中文 [40,690,1240,1060]、英文 [40,755,1240,1060]（到「前面／背面」標籤為止）、`demo`＝exercise_instruction [107,310,1105,640]（只取白底 3D 示範影片框，四周留 12–20px 深色邊）、`metrics`＝metrics [26,2040,1268,828]、`calendar`＝student_calendar [0,672,1320,680]（從星期列到第二週的課程標籤，不含上方按鈕列與提示列；目前沒有卡片使用，保留備用）、`matrix`（第 8 張卡「夥伴・教練版」）取自 `~/Desktop/CoreFit_Store_Screenshots/raw_v11/{zh,en}/*_asg_matrix_right.png`：中文 [0,1396,1320,1192]、英文 [0,1390,1320,1192]（從欄位標題列「D6…D11」到最後一位學員那列，**不含**上方「完成矩陣」標題列與右側提示文字；raw_v11 英文提示是過時的殘句 "Tap a cell for details or to mark"，不能放）。1x 高度寫在 `Story.tsx` 的 `UI_H`，重新裁圖時要一起更新 |
| `flow-{zh,en}.mp4`（H.264，只提供 MP4，720×1280，CRF 26） | `~/Desktop/CoreFit_Launch_Videos/03_FLOW_dark_v2/instagram/CoreFit_FLOW_dark_{zh,en}_1080x1920.mp4` | 首屏靜音循環：**只取 0–27.2 秒**（`-t 27.2`，輸出 816 格、最後一格約 27.17 秒；原片第 817 格＝27.23 秒起有 App Store 下載徽章），並移除音軌。開場 2.6–4.0 秒的底欄仍是舊名稱「社群」（原片如此，待重錄開場） |
| `flow-{zh,en}-poster.webp` | 舊版 `03_FLOW_dark/instagram/`，第 7.6 秒 | 首屏封面；這格在 v2 沒有改動的開場段（PSNR 約 41 dB），沿用 |
| `showcase-{zh,en}.mp4`（H.264＋AAC 128k，只提供 MP4，720×1560，CRF 26） | `~/Desktop/CoreFit_Showcase_Video/v3_coach_update/appstore/CoreFit_AppPreview_{zh-Hant,en-US}_886x1920.mp4`（App Store 版：網站版 `website/` 有 AI 生成運動員，不用） | 介紹影片（有聲）：**只取 0–28.7 秒**（`-t 28.7`，輸出 861 格、最後一格約 28.67 秒；原片第 862 格＝28.73 秒起有下載徽章），音訊 28.0 秒起淡出 0.7 秒。英文版第 22.5–25 秒的標題本身已是「Progress you can see.」，不需要再補丁 |
| `showcase-{zh,en}-poster.webp` | 舊版 `v3_30s_120bpm/website/` 第 10.3 秒（等同 `v3_coach_update/appstore/` 第 9.5 秒） | 影片封面（每週回顧畫面）。與新影片 9.5 秒那格比對 PSNR 約 38.6–38.8 dB（只差 WebP 壓縮），沿用；日後重做請改取 App Store 版第 9.5 秒 |
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
