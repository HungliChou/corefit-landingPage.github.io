/* Tailwind Play CDN 共用設定（index.html 與 en/index.html 都載入這份）。
 * 色彩同步定義在 index.css 的 :root 變數；全站只有深色。 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        bg: '#070912',
        surface: '#0E1220',
        'surface-2': '#151A2C',
        line: 'rgba(255,255,255,.08)',
        'line-strong': 'rgba(255,255,255,.16)',
        ink: '#F4F6FB',
        'ink-2': '#B4BBCC',
        'ink-3': '#8A92A6',
        blue: '#2F6BFF',
        'blue-2': '#1A75FF',
        violet: '#7C4DFF',
        'violet-2': '#614FFF',
        focus: '#8FB0FF',
        chip: '#C9D7FF',
      },
      fontFamily: {
        sans: ['"Mona Sans"', '"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Mona Sans"', '"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
};
