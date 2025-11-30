import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // GitHub Pages base path
    // 如果仓库名是 username.github.io（且用户名匹配），使用 '/'，否则使用仓库名作为路径
    const repository = process.env.GITHUB_REPOSITORY || 'HungliChou/corefit-landingPage.github.io';
    const [username, repoName] = repository.split('/');
    // 只有当仓库名是 username.github.io 格式时才使用根路径
    const isUserPage = repoName === `${username}.github.io`;
    const base = isUserPage ? '/' : `/${repoName}/`;
    
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
