# 快速部署到 Cloudflare Pages

## 一键部署

```bash
cd website
pnpm deploy
```

## 首次部署步骤

1. **登录 Cloudflare**（首次需要）：
```bash
npx wrangler login
```

2. **部署**：
```bash
pnpm deploy
```

## 部署命令说明

- `pnpm deploy` - 构建并部署到 Cloudflare Pages
- `pnpm build` - 仅构建项目（不部署）

## 注意事项

- 首次部署会提示你选择或创建 Cloudflare Pages 项目
- 部署后会在终端显示网站 URL
- 后续部署会自动更新现有项目

## 查看部署状态

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages 查看部署历史和状态。
