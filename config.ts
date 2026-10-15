// 上架狀態開關：上架當天把 APP_STATUS 改成 'live'；HTML <head>、JSON-LD、/download 等其餘步驟見 README.md「上架當天切換清單」。
// prelaunch 時不顯示 Apple 徽章、不連到 App Store。
export type AppStatus = 'prelaunch' | 'live';
export const APP_STATUS: AppStatus = 'prelaunch';
export const IS_LIVE: boolean = (APP_STATUS as AppStatus) === 'live';
export const APP_STORE_URL = 'https://apps.apple.com/app/id6757706921';
export const HERO_POSTER_TIME = 7.6; // flow-*-poster.webp 取格秒數
// 社群帳號：建立後把 href 換成正式網址即可（目前為佔位 '#'，點了不會跳轉）
export type SocialId = 'instagram' | 'facebook' | 'x';
export const SOCIAL_LINKS: { id: SocialId; label: string; href: string }[] = [
  { id: 'instagram', label: 'Instagram', href: '#' },
  { id: 'facebook', label: 'Facebook', href: '#' },
  { id: 'x', label: 'X', href: '#' },
];
