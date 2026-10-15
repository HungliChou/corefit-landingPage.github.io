import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 網站部署在自訂網域根目錄（www.corefit-ai.com），所以 base 為 '/'。
// 兩個 HTML 入口：/ 為繁體中文、/en/ 為英文；兩者共用同一份 React 程式，語言由 <html lang> 決定。
export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        en: path.resolve(__dirname, 'en/index.html'),
      },
    },
  },
});
