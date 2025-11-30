import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // GitHub Pages base path
    // 如果仓库名是 username.github.io，使用 '/'，否则使用仓库名作为路径
    const base = process.env.GITHUB_REPOSITORY 
      ? (process.env.GITHUB_REPOSITORY.endsWith('.github.io') ? '/' : `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`)
      : '/corefit-landingPage.github.io/';
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
