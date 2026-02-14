# EMP Skill Platform - API 接口文档

## 📡 API 概述

EMP Skill Platform 提供 RESTful API，用于前端应用与后端服务的交互。所有 API 都通过 Cloudflare Workers 提供，支持全球边缘计算。

## 🔗 基础信息

### 基础 URL
```
https://skill.empjs.dev/api
```

### 请求格式
- **Content-Type**: `application/json`
- **认证**: Bearer Token (可选)
- **编码**: UTF-8

### 响应格式
```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}
```

### 错误响应
```typescript
interface ErrorResponse {
  success: false
  error: string
  code: string
  details?: any
  timestamp: string
}
```

## 🔐 认证

### Bearer Token 认证
```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### OAuth 流程
1. 重定向到 OAuth 提供商
2. 用户授权
3. 回调处理并返回 token
4. 使用 token 访问受保护资源

## 📚 技能 API

### 获取技能列表

**GET** `/api/skills`

获取技能列表，支持分页、筛选和排序。

#### 查询参数
```typescript
interface SkillsQuery {
  page?: number        // 页码，默认 1
  limit?: number       // 每页数量，默认 20
  category?: string    // 分类筛选
  search?: string      // 搜索关键词
  sort?: 'downloads' | 'likes' | 'created' | 'updated'  // 排序方式
  order?: 'asc' | 'desc'  // 排序方向
}
```

#### 响应
```typescript
interface SkillsResponse {
  skills: Skill[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
  filters: {
    categories: string[]
    totalCount: number
  }
}
```

#### 示例
```bash
# 获取热门技能
GET /api/skills?sort=downloads&order=desc

# 搜索 React 相关技能
GET /api/skills?search=react&category=frontend

# 分页获取
GET /api/skills?page=2&limit=10
```

### 获取技能详情

**GET** `/api/skills/{slug}`

获取单个技能的详细信息。

#### 路径参数
- `slug` (string): 技能的唯一标识符

#### 响应
```typescript
interface SkillDetailResponse {
  skill: Skill & {
    likedUsers: User[]  // 前 5 个点赞用户
    isLiked?: boolean   // 当前用户是否已点赞（需要认证）
    isFavorited?: boolean // 当前用户是否已收藏（需要认证）
  }
}
```

#### 示例
```bash
GET /api/skills/vercel-react-best-practices
```

### 获取技能分类

**GET** `/api/categories`

获取所有可用的技能分类。

#### 响应
```typescript
interface CategoriesResponse {
  categories: Array<{
    id: string
    name: string
    icon: string
    count: number  // 该分类的技能数量
  }>
}
```

## 👤 用户 API

### 获取当前用户信息

**GET** `/api/auth/me`

获取当前登录用户的信息。

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface UserResponse {
  user: User & {
    stats: {
      skillsLiked: number
      skillsFavorited: number
      joinedAt: string
    }
  }
}
```

### OAuth 登录发起

**GET** `/api/auth/{provider}`

发起 OAuth 登录流程。

#### 路径参数
- `provider` ('google' | 'github'): OAuth 提供商

#### 响应
重定向到 OAuth 提供商的授权页面。

### OAuth 回调处理

**GET** `/api/auth/callback/{provider}`

处理 OAuth 回调并创建/更新用户账户。

#### 查询参数
- `code`: OAuth 授权码
- `state`: CSRF 保护状态

#### 响应
重定向到前端应用并设置认证 token。

### 登出

**POST** `/api/auth/logout`

清除用户会话。

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface LogoutResponse {
  success: true
  message: 'Logged out successfully'
}
```

## ❤️ 互动 API

### 点赞技能

**POST** `/api/skills/{slug}/like`

为技能点赞。

#### 路径参数
- `slug` (string): 技能标识符

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface LikeResponse {
  success: true
  liked: boolean
  likesCount: number
}
```

### 取消点赞

**DELETE** `/api/skills/{slug}/like`

取消对技能的点赞。

#### 路径参数
- `slug` (string): 技能标识符

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface UnlikeResponse {
  success: true
  liked: false
  likesCount: number
}
```

### 收藏技能

**POST** `/api/skills/{slug}/favorite`

收藏技能。

#### 路径参数
- `slug` (string): 技能标识符

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface FavoriteResponse {
  success: true
  favorited: boolean
  favoritesCount: number
}
```

### 取消收藏

**DELETE** `/api/skills/{slug}/favorite`

取消收藏技能。

#### 路径参数
- `slug` (string): 技能标识符

#### 请求头
```
Authorization: Bearer <token>
```

#### 响应
```typescript
interface UnfavoriteResponse {
  success: true
  favorited: false
  favoritesCount: number
}
```

### 获取用户收藏

**GET** `/api/favorites`

获取当前用户的收藏列表。

#### 请求头
```
Authorization: Bearer <token>
```

#### 查询参数
```typescript
interface FavoritesQuery {
  page?: number
  limit?: number
  category?: string
}
```

#### 响应
```typescript
interface FavoritesResponse {
  skills: Skill[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}
```

## 🔍 搜索 API

### 全局搜索

**GET** `/api/search`

搜索技能，支持多字段搜索。

#### 查询参数
```typescript
interface SearchQuery {
  q: string          // 搜索关键词（必需）
  category?: string  // 分类筛选
  limit?: number     // 结果数量，默认 20
  type?: 'skills' | 'all'  // 搜索类型
}
```

#### 响应
```typescript
interface SearchResponse {
  results: Skill[]
  total: number
  query: string
  took: number  // 搜索耗时（毫秒）
  suggestions?: string[]  // 搜索建议
}
```

#### 示例
```bash
# 搜索 React 技能
GET /api/search?q=react&category=frontend

# 搜索所有类型
GET /api/search?q=performance&type=all
```

## 📊 统计 API

### 获取平台统计

**GET** `/api/stats`

获取平台整体统计数据。

#### 响应
```typescript
interface StatsResponse {
  totalSkills: number
  totalUsers: number
  totalLikes: number
  totalFavorites: number
  popularCategories: Array<{
    category: string
    count: number
  }>
  recentActivity: Array<{
    type: 'like' | 'favorite' | 'skill_added'
    skill: Skill
    user: User
    timestamp: string
  }>
}
```

### 获取技能统计

**GET** `/api/skills/{slug}/stats`

获取单个技能的详细统计。

#### 路径参数
- `slug` (string): 技能标识符

#### 响应
```typescript
interface SkillStatsResponse {
  skill: Skill
  stats: {
    dailyDownloads: Array<{ date: string, count: number }>
    monthlyDownloads: Array<{ month: string, count: number }>
    topRegions: Array<{ region: string, count: number }>
    referrerSources: Array<{ source: string, count: number }>
  }
}
```

## 🛡️ 安全和限制

### 速率限制

- **未认证用户**: 100 次/分钟
- **认证用户**: 1000 次/分钟
- **搜索 API**: 50 次/分钟

### 请求限制

```typescript
// 超出限制的响应
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60,  // 秒
  "timestamp": "2025-01-23T10:30:00Z"
}
```

### 输入验证

所有 API 都进行严格的输入验证：

- **SQL 注入防护**: 使用参数化查询
- **XSS 防护**: 自动转义 HTML 字符
- **类型验证**: Zod schema 验证
- **长度限制**: 防止过长输入

### CORS 配置

```typescript
// 允许的源
const allowedOrigins = [
  'https://skill.empjs.dev',
  'https://dev.skill.empjs.dev',
  'http://localhost:3000'  // 开发环境
]
```

## 📝 数据类型定义

### Skill
```typescript
interface Skill {
  id: string
  npm_package: string | null
  github_repo: string | null
  github_owner: string
  name: string
  slug: string
  description: string
  category: string | null
  tags: string | null  // JSON 字符串
  downloads: number
  github_stars: number
  likes_count: number
  favorites_count: number
  last_synced_at: string | null
  created_at: string
  updated_at: string
}
```

### User
```typescript
interface User {
  id: string
  name: string
  avatar: string | null
  provider: 'google' | 'github'
  provider_id: string
  created_at: string
}
```

### Like
```typescript
interface Like {
  user_id: string
  skill_id: string
  created_at: string
}
```

### Favorite
```typescript
interface Favorite {
  user_id: string
  skill_id: string
  created_at: string
}
```

## 🧪 测试

### 使用 cURL 测试

```bash
# 获取技能列表
curl -X GET "https://skill.empjs.dev/api/skills?page=1&limit=10"

# 搜索技能
curl -X GET "https://skill.empjs.dev/api/search?q=react"

# 获取技能详情
curl -X GET "https://skill.empjs.dev/api/skills/vercel-react-best-practices"
```

### 使用认证

```bash
# 获取用户信息
curl -X GET "https://skill.empjs.dev/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 点赞技能
curl -X POST "https://skill.empjs.dev/api/skills/vercel-react-best-practices/like" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📋 版本控制

### API 版本
- **v1**: 当前版本
- **Header**: `Accept: application/vnd.emp-skill.v1+json`

### 向后兼容
- 新版本 API 向后兼容
- 废弃功能提前 3 个月通知
- 迁移指南提供

### 变更日志
- 所有 API 变更记录
- 破坏性变更特别标记
- 迁移指南提供

## 🚨 错误处理

### HTTP 状态码

| 状态码 | 含义 | 示例 |
|--------|------|------|
| 200 | 成功 | 正常响应 |
| 201 | 已创建 | 资源创建成功 |
| 400 | 请求错误 | 参数验证失败 |
| 401 | 未授权 | 需要认证 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 未找到 | 资源不存在 |
| 429 | 请求过多 | 超出速率限制 |
| 500 | 服务器错误 | 内部错误 |

### 常见错误

```typescript
// 认证失败
{
  "success": false,
  "error": "Authentication required",
  "code": "AUTH_REQUIRED",
  "timestamp": "2025-01-23T10:30:00Z"
}

// 资源不存在
{
  "success": false,
  "error": "Skill not found",
  "code": "SKILL_NOT_FOUND",
  "timestamp": "2025-01-23T10:30:00Z"
}

// 验证错误
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  },
  "timestamp": "2025-01-23T10:30:00Z"
}
```

## 📞 支持

### 文档更新
API 文档会随着功能更新而更新。

### 问题反馈
- **GitHub Issues**: https://github.com/empjs/skill/issues
- **Discord**: https://discord.gg/emp-skill

---

**API = 连接前端和后端的数据桥梁** 🌉