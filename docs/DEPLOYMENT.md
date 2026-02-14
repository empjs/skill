# EMP Skill Platform - 部署和运维指南

## 🚀 部署概述

EMP Skill Platform 采用现代化的部署策略，结合 Cloudflare 的边缘计算能力，实现全球快速访问和高可用性。

## 🏗️ 架构组件

### 1. Cloudflare Pages
- **静态资源** - HTML、CSS、JS 文件
- **边缘部署** - 全球 200+ 个数据中心
- **自动 HTTPS** - 免费 SSL 证书
- **CDN 加速** - 智能缓存和压缩

### 2. Cloudflare D1
- **SQLite 数据库** - 分布式 SQL 数据库
- **全球同步** - 数据自动同步到边缘
- **RESTful API** - 标准 SQL 接口
- **免费额度** - 每月 500,000 行读取

### 3. Cloudflare KV
- **键值存储** - 高性能缓存
- **全球分布** - 低延迟访问
- **大容量** - 支持 TB 级数据
- **持久化** - 数据高可用

### 4. Cloudflare Workers
- **边缘计算** - 在边缘运行代码
- **API 处理** - RESTful API 实现
- **认证处理** - OAuth 流程处理
- **数据代理** - 数据库和缓存代理

## 📋 部署前准备

### 1. 注册 Cloudflare 账户

访问 https://cloudflare.com 创建账户：

```bash
# 安装 Wrangler CLI
pnpm add -g wrangler

# 登录 Cloudflare
wrangler login
```

### 2. 创建项目

```bash
# 创建 Cloudflare Pages 项目
npx wrangler pages project create emp-skill-platform

# 或在 Cloudflare Dashboard 创建
# https://dash.cloudflare.com/pages
```

### 3. 配置环境变量

在 Cloudflare Dashboard 或 wrangler.toml 中设置：

```toml
# wrangler.toml
[vars]
ENVIRONMENT = "production"
OAUTH_GITHUB_CLIENT_ID = "your-github-client-id"
OAUTH_GOOGLE_CLIENT_ID = "your-google-client-id"

# 密钥配置（在 Dashboard 设置）
# OAUTH_GITHUB_CLIENT_SECRET
# OAUTH_GOOGLE_CLIENT_SECRET
```

### 4. 设置 OAuth 应用

#### GitHub OAuth App
1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 配置：
   ```
   Application name: EMP Skill Platform
   Homepage URL: https://emp-skill-platform.pages.dev
   Authorization callback URL: https://emp-skill-platform.pages.dev/api/auth/callback/github
   ```
4. 保存并记录 Client ID 和 Client Secret

#### Google OAuth App
1. 访问 https://console.cloud.google.com
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 配置：
   ```
   应用类型: Web 应用
   名称: EMP Skill Platform
   授权来源:
     https://emp-skill-platform.pages.dev
   重定向 URI:
     https://emp-skill-platform.pages.dev/api/auth/callback/google
   ```

## 🗄️ 数据库设置

### 1. 创建 D1 数据库

```bash
# 创建数据库
npx wrangler d1 create emp-skill-db

# 输出类似：
# ✅ Successfully created D1 database 'emp-skill-db' in region US-WEST-2
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 2. 初始化数据库结构

```bash
# 执行 schema.sql
npx wrangler d1 execute emp-skill-db --file=schema.sql

# 验证数据库
npx wrangler d1 execute emp-skill-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 3. 配置数据库绑定

更新 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "emp-skill-db"
database_id = "your-database-id"
```

## 🗝️ KV 存储设置

### 1. 创建 KV 命名空间

```bash
# 创建命名空间
npx wrangler kv:namespace create "CACHE"

# 输出类似：
# ⛅️ wrangler kv:namespace create CACHE
# 🔧 Created namespace with ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 2. 配置 KV 绑定

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

## 🔧 构建和部署

### 1. 本地构建

```bash
# 安装依赖
pnpm install

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

### 2. 部署到 Cloudflare Pages

#### 方法一：Git 集成（推荐）

1. **连接 GitHub**
   - 在 Cloudflare Pages 项目中连接 GitHub 仓库
   - 设置构建命令：`pnpm build`
   - 设置构建输出目录：`.output/public`
   - 设置环境变量

2. **自动部署**
   - 推送代码到 main 分支自动触发部署
   - 查看部署状态和日志

#### 方法二：手动部署

```bash
# 构建项目
pnpm build

# 部署到 Cloudflare Pages
npx wrangler pages deploy .output/public --project-name emp-skill-platform

# 设置自定义域名（可选）
npx wrangler pages domain add emp-skill-platform skill.empjs.dev
```

### 3. 部署 Workers API

如果有独立的 API Workers：

```bash
# 部署 API Workers
npx wrangler deploy

# 绑定到 Pages 项目
# 在 Cloudflare Dashboard 中配置路由
```

## 📊 监控和分析

### 1. Cloudflare Analytics

访问 Cloudflare Dashboard 查看：

- **流量分析** - PV、UV、地理分布
- **性能监控** - 响应时间、错误率
- **安全监控** - 攻击拦截、威胁检测
- **缓存命中率** - CDN 性能指标

### 2. 自定义监控

#### 设置日志

```typescript
// 在 Worker 中添加日志
console.log('User login:', { userId, timestamp })

// 查看实时日志
npx wrangler tail
```

#### 性能监控

```typescript
// 添加性能监控
addEventListener('fetch', (event) => {
  const start = Date.now()

  event.respondWith(handleRequest(event.request).then(response => {
    const duration = Date.now() - start
    console.log(`Request took ${duration}ms`)
    return response
  }))
})
```

### 3. 错误跟踪

```typescript
// 全局错误处理
export default {
  async fetch(request: Request, env: Env) {
    try {
      return await handleRequest(request, env)
    } catch (error) {
      // 记录错误
      console.error('Request failed:', error)

      // 返回错误响应
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}
```

## 🔄 CI/CD 配置

### GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: emp-skill-platform
          directory: .output/public
```

## 🔒 安全配置

### 1. 访问控制

```toml
# wrangler.toml
[env.production]
routes = [
  { pattern = "https://skill.empjs.dev/*", zone_name = "skill.empjs.dev" }
]
```

### 2. CORS 配置

```typescript
// API 响应头
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://skill.empjs.dev',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function handleCORS(request: Request): Response {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  // 处理实际请求
}
```

### 3. 速率限制

```typescript
// 实现速率限制
const rateLimit = new Map()

function isRateLimited(identifier: string): boolean {
  const now = Date.now()
  const window = 60 * 1000 // 1 分钟窗口
  const maxRequests = 100 // 每分钟最大请求数

  const userRequests = rateLimit.get(identifier) || []
  const recentRequests = userRequests.filter(time => now - time < window)

  if (recentRequests.length >= maxRequests) {
    return true
  }

  recentRequests.push(now)
  rateLimit.set(identifier, recentRequests)

  return false
}
```

## 📈 性能优化

### 1. 缓存策略

#### KV 缓存

```typescript
// 缓存热门技能
async function getPopularSkills(env: Env) {
  const cacheKey = 'popular-skills'
  let skills = await env.CACHE.get(cacheKey, 'json')

  if (!skills) {
    skills = await env.DB.prepare('SELECT * FROM skills ORDER BY downloads DESC LIMIT 10').all()
    await env.CACHE.put(cacheKey, JSON.stringify(skills), { expirationTtl: 3600 })
  }

  return skills
}
```

#### 浏览器缓存

```typescript
// 设置缓存头
const cacheHeaders = {
  'Cache-Control': 'public, max-age=3600', // 1 小时
  'CDN-Cache-Control': 'max-age=86400',   // 24 小时
}

return new Response(data, {
  headers: {
    ...corsHeaders,
    ...cacheHeaders,
    'Content-Type': 'application/json',
  },
})
```

### 2. 数据库优化

#### 索引优化

```sql
-- 重要查询的索引
CREATE INDEX idx_skills_downloads ON skills(downloads DESC);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_likes_skill ON likes(skill_id);
CREATE INDEX idx_favorites_user ON favorites(user_id);
```

#### 查询优化

```typescript
// 分页查询
async function getSkills(page = 1, limit = 20) {
  const offset = (page - 1) * limit
  return await env.DB.prepare(`
    SELECT * FROM skills
    ORDER BY downloads DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all()
}
```

### 3. 资源优化

#### 图片优化

```typescript
// 使用 Cloudflare Images
const imageUrl = `https://images.skill.empjs.dev/cdn-cgi/image/format=webp,width=400/${originalUrl}`
```

#### 代码分割

```typescript
// 动态导入
const SkillDetail = lazy(() => import('./routes/skills.$slug'))
```

## 🔄 备份和恢复

### 数据库备份

```bash
# 创建数据库快照
npx wrangler d1 backup create emp-skill-db --name "backup-$(date +%Y%m%d)"

# 列出备份
npx wrangler d1 backup list emp-skill-db

# 从备份恢复
npx wrangler d1 backup restore emp-skill-db --backup-id <backup-id>
```

### 数据迁移

```typescript
// 导出数据
async function exportData(env: Env) {
  const users = await env.DB.prepare('SELECT * FROM users').all()
  const skills = await env.DB.prepare('SELECT * FROM skills').all()
  const likes = await env.DB.prepare('SELECT * FROM likes').all()
  const favorites = await env.DB.prepare('SELECT * FROM favorites').all()

  return {
    users: users.results,
    skills: skills.results,
    likes: likes.results,
    favorites: favorites.results,
    exported_at: new Date().toISOString(),
  }
}

// 导入数据
async function importData(env: Env, data: any) {
  // 批量插入数据
  for (const user of data.users) {
    await env.DB.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?)').bind(...Object.values(user)).run()
  }
  // ... 其他表
}
```

## 🚨 故障排除

### 常见问题

#### 1. 构建失败

```bash
# 检查 Node.js 版本
node --version

# 清理缓存
rm -rf node_modules .output
pnpm install

# 检查构建日志
pnpm build --verbose
```

#### 2. 数据库连接失败

```bash
# 检查数据库 ID
npx wrangler d1 list

# 验证数据库结构
npx wrangler d1 execute emp-skill-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### 3. OAuth 回调失败

```bash
# 检查回调 URL
# 确保与 OAuth 应用配置一致

# 检查环境变量
npx wrangler secret list

# 查看 Worker 日志
npx wrangler tail
```

#### 4. 性能问题

```bash
# 检查缓存命中率
npx wrangler tail --format=pretty

# 分析数据库查询
EXPLAIN QUERY PLAN SELECT * FROM skills WHERE category = 'frontend';
```

### 监控命令

```bash
# 查看部署状态
npx wrangler pages deployment list --project-name emp-skill-platform

# 查看 Worker 状态
npx wrangler deploy --dry-run

# 查看域名配置
npx wrangler pages domain list emp-skill-platform
```

## 📋 检查清单

### 部署前检查

- [ ] Cloudflare 账户已创建
- [ ] Wrangler CLI 已安装并登录
- [ ] Pages 项目已创建
- [ ] D1 数据库已创建并初始化
- [ ] KV 命名空间已创建
- [ ] OAuth 应用已配置
- [ ] 环境变量已设置
- [ ] 自定义域名已配置（可选）

### 部署后验证

- [ ] 网站可以正常访问
- [ ] HTTPS 证书有效
- [ ] 数据库连接正常
- [ ] OAuth 登录功能正常
- [ ] API 接口响应正常
- [ ] 性能指标正常
- [ ] 监控告警已配置

---

**部署 = 一次配置，全球可用** 🌍