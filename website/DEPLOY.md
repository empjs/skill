# Cloudflare Pages 部署指南

## 前置要求

1. 安装 Cloudflare Wrangler CLI（如果还没有安装）：
```bash
npm install -g wrangler
# 或
pnpm add -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler login
```

## 部署步骤

### 方法 1: 使用命令行部署（推荐）

1. 安装依赖：
```bash
cd website
pnpm install
```

2. 构建项目：
```bash
pnpm build
```

3. 部署到 Cloudflare Pages：
```bash
pnpm deploy
# 或使用完整命令
pnpm deploy:prod
```

### 方法 2: 通过 Cloudflare Dashboard

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 "Pages" → "Create a project"
3. 连接你的 Git 仓库（GitHub/GitLab）
4. 配置构建设置：
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `website`
5. 点击 "Save and Deploy"

### 方法 3: 使用 GitHub Actions（自动部署）

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
    paths:
      - 'website/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
        working-directory: ./website
      
      - name: Build
        run: pnpm build
        working-directory: ./website
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: emp-skill-website
          directory: ./website/dist
```

## 环境变量

如果需要设置环境变量，可以通过以下方式：

1. **命令行方式**：
```bash
wrangler pages secret put VARIABLE_NAME
```

2. **Dashboard 方式**：
   - 在 Cloudflare Dashboard → Pages → Settings → Environment Variables 中添加

## 自定义域名

1. 在 Cloudflare Dashboard → Pages → 你的项目 → Custom domains
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 故障排除

- 如果部署失败，检查构建日志
- 确保 `dist` 目录在构建后存在
- 检查 `wrangler.toml` 配置是否正确
- 确保已正确登录 Cloudflare：`wrangler whoami`
