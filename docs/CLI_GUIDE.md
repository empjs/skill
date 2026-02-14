# EMP Skill Platform - CLI 使用指南

## 📦 CLI 安装

### 全局安装

```bash
# 使用 pnpm
pnpm add -g @empjs/skill

# 使用 npm
npm install -g @empjs/skill

# 使用 yarn
yarn global add @empjs/skill

# 使用 bun
bun install -g @empjs/skill
```

### 本地开发

```bash
# 克隆项目
git clone https://github.com/empjs/skill.git
cd emp-skill

# 安装依赖
pnpm install

# 构建 CLI
pnpm --filter @empjs/skill build

# 本地测试
node packages/eskill/dist/index.js --help
```

## 🚀 基本使用

### 查看帮助

```bash
eskill --help
eskill -h
```

### 安装技能

#### 从 GitHub 安装

```bash
# 直接使用仓库名
eskill install vercel-labs/agent-skills

# 使用完整 URL
eskill install https://github.com/vercel-labs/agent-skills

# 安装到特定 Agent
eskill install vercel-labs/agent-skills --agent claude
```

#### 从 NPM 安装

```bash
# 安装 NPM 包
eskill install @empjs/skill

# 安装作用域包
eskill install @vercel/react-best-practices
```

#### 本地开发模式

```bash
# 链接本地技能目录
cd my-skill-directory
eskill install . --link

# 开发时自动重载
eskill install . --link --watch
```

### 管理技能

#### 查看已安装技能

```bash
# 列出所有技能
eskill list
eskill ls

# 查看详细列表
eskill list --verbose

# 按 Agent 过滤
eskill list --agent claude
```

#### 移除技能

```bash
# 移除特定技能
eskill remove vercel-labs/agent-skills
eskill rm vercel-labs/agent-skills

# 统一移除
eskill uninstall vercel-labs/agent-skills

# 从特定 Agent 移除
eskill remove vercel-labs/agent-skills --agent claude
```

#### 更新技能

```bash
# 更新特定技能
eskill update vercel-labs/agent-skills

# 更新所有技能
eskill update --all

# 检查更新
eskill update --check
```

### 查看信息

#### 技能详情

```bash
# 查看技能信息
eskill info vercel-labs/agent-skills

# 查看兼容的 Agents
eskill info vercel-labs/agent-skills --agents
```

#### 支持的 Agents

```bash
# 列出所有支持的 Agent
eskill agents

# 详细列表
eskill agents --verbose

# 检查 Agent 状态
eskill agents --status
```

## 🔧 高级用法

### 搜索技能

```bash
# 搜索技能（需要网络连接）
eskill search react

# 按分类搜索
eskill search react --category frontend

# 按标签搜索
eskill search react --tag performance

# 限制结果数量
eskill search react --limit 10
```

### 批量与按需安装 (B2B 场景)

当从包含多个技能的仓库 (Monorepo) 安装时，CLI 会自动识别并开启交互式多选模式：

```bash
# 安装包含多个技能的企业级仓库
eskill install https://git.internal.corp/fed-team/skills-collection
```

**交互操作：**
- `Space`: 选择/取消选择技能
- `Enter`: 确认并开始安装
- `A`: 选择全部

### 鉴权管理 (Auth)

针对企业私有 GitLab/GitHub 仓库，使用 `auth` 命令管理访问令牌：

```bash
# 交互式添加 Token
eskill auth git.internal.corp

# 命令行直接设置
eskill auth git.internal.corp --token your_private_access_token

# 查看已配置的域名和 Token（脱敏显示）
eskill auth --list

# 移除特定域名的 Token
eskill auth --remove git.internal.corp
```

> **安全提示**: Token 将安全存储在本地 `~/.emp-agent/config.json` 中，仅用于克隆时的鉴权。

### 配置管理

#### 查看配置

```bash
# 显示当前配置
eskill config

# 显示配置位置
eskill config --path
```

#### 修改配置

```bash
# 设置默认 Agent
eskill config set default-agent claude

# 启用/禁用遥测
eskill config set telemetry true

# 设置缓存目录
eskill config set cache-dir ~/.emp-skill-cache
```

### 批量操作

```bash
# 批量安装
eskill install vercel-labs/agent-skills anthropics/skills

# 从文件安装
eskill install --file skills.txt

# 导出技能列表
eskill list --export skills.json
```

### 开发工具

#### 验证技能

```bash
# 验证技能配置
eskill validate my-skill-directory

# 验证并修复
eskill validate my-skill-directory --fix
```

#### 调试模式

```bash
# 启用调试输出
eskill --debug install vercel-labs/agent-skills

# 详细日志
eskill --verbose list
```

## 🎯 支持的 AI Agents

| Agent | 目录位置 | 状态 |
|-------|----------|------|
| Claude Code | `~/.claude/skills/` | ✅ 支持 |
| Cursor | `~/.cursor/skills/` | ✅ 支持 |
| Windsurf | `~/.windsurf/skills/` | ✅ 支持 |
| Cline | `~/.cline/skills/` | ✅ 支持 |
| Gemini Code | `~/.gemini/skills/` | ✅ 支持 |
| GitHub Copilot | `~/.copilot/skills/` | ✅ 支持 |
| OpenCode | `~/.opencode/skills/` | ✅ 支持 |
| Antigravity | `~/.gemini/antigravity/skills/` | ✅ 支持 |
| Kiro | `~/.kiro/skills/` | ✅ 支持 |
| Codex CLI | `~/.codex/skills/` | ✅ 支持 |
| Qoder | `~/.qoder/skills/` | ✅ 支持 |
| Roo Code | `~/.roo/skills/` | ✅ 支持 |
| Trae | `~/.trae/skills/` | ✅ 支持 |
| Continue | `~/.continue/skills/` | ✅ 支持 |

## 📁 目录结构

### 系统目录

```
~/.emp-agent/
├── skills/           # 共享技能目录
├── config.json       # CLI 配置
└── cache/            # 缓存目录
    ├── downloads/    # 下载缓存
    └── metadata/     # 元数据缓存
```

### Agent 特定目录

每个 AI Agent 都有自己的技能目录：

```
~/.claude/skills/     # Claude 技能
~/.cursor/skills/     # Cursor 技能
~/.windsurf/skills/   # Windsurf 技能
# ... 其他 Agents
```

## 🔐 隐私和安全

### 遥测数据

CLI 默认启用匿名遥测收集：

```bash
# 禁用遥测
export SKILLS_NO_TELEMETRY=1

# 或在配置中禁用
eskill config set telemetry false
```

遥测数据包括：
- ✅ 技能名称和版本
- ✅ 安装时间戳
- ✅ CLI 版本
- ❌ 用户标识信息
- ❌ 使用行为数据
- ❌ 个人文件内容

### 安全措施

- ✅ HTTPS 强制下载
- ✅ GitHub 仓库验证
- ✅ NPM 包签名验证
- ✅ 本地文件完整性检查
- ✅ 权限隔离（只写入指定目录）

## 🐛 故障排除

### 常见问题

#### 安装失败

```bash
# 检查网络连接
ping github.com

# 检查权限
ls -la ~/.claude/skills/

# 清理缓存
eskill cache clean

# 重新安装
eskill install vercel-labs/agent-skills --force
```

#### 技能不生效

```bash
# 检查技能是否正确安装
eskill list --agent claude

# 验证技能文件
ls -la ~/.claude/skills/vercel-labs-agent-skills/

# 重启 AI Agent
# Claude Code: 重启应用
# Cursor: 重启应用
```

#### 配置问题

```bash
# 重置配置
eskill config reset

# 检查配置语法
eskill config validate

# 查看详细日志
eskill --debug list
```

### 日志和调试

#### 查看日志

```bash
# CLI 日志位置
tail ~/.emp-agent/logs/cli.log

# 技能安装日志
eskill logs install vercel-labs/agent-skills
```

#### 启用调试

```bash
# 全局调试
export DEBUG=eskill:*

# 命令调试
eskill --debug install vercel-labs/agent-skills
```

## 📋 命令参考

### 全局选项

```bash
-h, --help          显示帮助信息
-V, --version       显示版本号
--debug            启用调试模式
--verbose          详细输出
--quiet            静默模式
```

### 安装命令选项

```bash
eskill install [options] <skill>

Options:
  -a, --agent <name>     指定目标 Agent
  -l, --link             链接本地目录（开发模式）
  -f, --force            强制重新安装
  -g, --global           全局安装（所有 Agents）
  --dry-run             预览安装而不执行
```

### 列表命令选项

```bash
eskill list [options]

Options:
  -a, --agent <name>     按 Agent 过滤
  -c, --category <name>  按分类过滤
  -v, --verbose          详细输出
  --export <file>       导出到文件
  --json                JSON 格式输出
```

### 移除命令选项

```bash
eskill remove [options] <skill>

Options:
  -a, --agent <name>     从指定 Agent 移除
  -f, --force            强制移除
  --all                  从所有 Agents 移除
```

## 🔄 版本管理

### 查看版本

```bash
eskill --version
eskill version
```

### 更新 CLI

```bash
# 使用包管理器更新
pnpm update -g @empjs/skill

# 或重新安装
pnpm add -g @empjs/skill@latest
```

### 兼容性

| CLI 版本 | Node.js | 支持的 Agents |
|----------|---------|---------------|
| 1.0.x | 18+ | 14+ |
| 1.1.x | 18+ | 15+ |
| 2.0.x | 20+ | 16+ |

## 🤝 贡献

### 开发 CLI

```bash
# 设置开发环境
cd packages/eskill
pnpm install

# 运行测试
pnpm test

# 构建
pnpm build

# 提交 PR
```

### 报告问题

```bash
# 生成调试信息
eskill doctor

# 创建问题报告
eskill bug-report
```

## 📞 支持

- **文档**: https://skill.empjs.dev/docs/cli
- **Issues**: https://github.com/empjs/skill/issues
- **Discord**: https://discord.gg/emp-skill

---

**CLI = 零门槛技能管理工具** 🚀