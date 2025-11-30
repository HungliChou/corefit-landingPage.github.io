# CoreFit Landing Page

CoreFit AI 健身管理应用的产品展示页面。

## 本地开发

**前置要求:** Node.js

1. 安装依赖:
   ```bash
   npm install
   ```

2. 运行开发服务器:
   ```bash
   npm run dev
   ```

3. 在浏览器中打开 `http://localhost:3000`

## 构建

构建生产版本:
```bash
npm run build
```

构建产物将输出到 `dist` 目录。

## GitHub Pages 部署

本项目已配置自动部署到 GitHub Pages。

### 自动部署（推荐）

1. 确保 GitHub Actions 已启用（Settings > Actions > General）
2. 推送代码到 `main` 分支
3. GitHub Actions 会自动构建并部署到 GitHub Pages

### 手动部署

如果需要手动部署：

1. 构建项目:
   ```bash
   npm run build
   ```

2. 将 `dist` 目录的内容推送到 `gh-pages` 分支

### 访问地址

部署后，网站将在以下地址可用：
- `https://HungliChou.github.io/corefit-landingPage.github.io/`

如果仓库名是 `username.github.io` 格式，则可以直接访问：
- `https://username.github.io/`
