# EMP Skill Platform - 完整文档索引

## 📁 项目结构总览

```
emp-skill/
├── docs/                          # 📚 系统文档（新建）
│   ├── README.md                  # 文档导航索引
│   ├── ARCHITECTURE.md           # 系统架构设计
│   ├── CLI_GUIDE.md             # CLI 使用指南
│   ├── WEB_PLATFORM.md          # Web 平台功能
│   ├── DEPLOYMENT.md            # 部署运维指南
│   ├── API_REFERENCE.md         # API 接口文档
│   └── CONTRIBUTION.md          # 贡献指南
├── packages/
│   └── eskill/                   # 🔧 CLI 工具
│       ├── src/
│       │   ├── commands/         # CLI 命令
│       │   ├── config/           # 配置
│       │   └── utils/            # 工具函数
│       ├── tests/                # 测试
│       └── README.md
├── apps/
│   ├── web/                     # 🌐 Web 平台
│   │   ├── src/
│   │   │   ├── components/     # UI 组件
│   │   │   ├── routes/         # 页面路由
│   │   │   ├── types/          # 类型定义
│   │   │   └── utils/          # 工具函数
│   │   ├── schema.sql          # 数据库结构
│   │   ├── wrangler.toml       # Cloudflare 配置
│   │   ├── README.md           # Web 平台文档
│   │   ├── IMPLEMENTATION.md   # 实现指南
│   │   └── PROJECT_SUMMARY.md  # 项目总结
│   └── website/                 # 📄 静态网站
├── skill-recomend.md            # 💡 技能推荐文档
├── DOCUMENTATION_INDEX.md       # 🗂️ 文档索引
├── README.md                    # 🏠 项目总览
├── package.json
└── pnpm-workspace.yaml
```

## 📋 文档分类索引

### 🚀 快速开始
| 文档 | 位置 | 说明 |
|------|------|------|
| 项目总览 | [README.md](./README.md) | 项目介绍、架构、快速开始 |
| Web 平台文档 | [apps/web/README.md](./apps/web/README.md) | Web 平台功能和开发指南 |
| CLI 文档 | [packages/eskill/README.md](./packages/eskill/README.md) | CLI 工具使用说明 |

### 📚 系统文档
| 文档 | 位置 | 说明 |
|------|------|------|
| 文档索引 | [docs/README.md](./docs/README.md) | 所有文档的导航索引 |
| 系统架构 | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | 整体架构设计和技术选型 |
| CLI 指南 | [docs/CLI_GUIDE.md](./docs/CLI_GUIDE.md) | CLI 工具使用指南 |
| Web 平台 | [docs/WEB_PLATFORM.md](./docs/WEB_PLATFORM.md) | Web 平台功能说明 |
| 部署运维 | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | 部署和运维指南 |
| API 文档 | [docs/API_REFERENCE.md](./docs/API_REFERENCE.md) | API 接口文档 |
| 贡献指南 | [docs/CONTRIBUTION.md](./docs/CONTRIBUTION.md) | 贡献规范和流程 |

### 🛠️ 实现文档
| 文档 | 位置 | 说明 |
|------|------|------|
| 实现指南 | [apps/web/IMPLEMENTATION.md](./apps/web/IMPLEMENTATION.md) | 详细实现步骤 |
| 项目总结 | [apps/web/PROJECT_SUMMARY.md](./apps/web/PROJECT_SUMMARY.md) | 项目架构总结 |
| 技能推荐 | [skill-recomend.md](./skill-recomend.md) | 技能推荐文档 |

## 🎯 按用户角色查找文档

### 👨‍💻 开发者
```
快速开始 → 项目总览 (README.md)
技术架构 → 系统架构 (docs/ARCHITECTURE.md)
API 接口 → API 文档 (docs/API_REFERENCE.md)
代码规范 → 贡献指南 (docs/CONTRIBUTION.md)
```

### 👤 终端用户
```
CLI 使用 → CLI 指南 (docs/CLI_GUIDE.md)
Web 浏览 → Web 平台 (docs/WEB_PLATFORM.md)
安装技能 → CLI 指南 (docs/CLI_GUIDE.md#安装)
```

### 🚀 运维人员
```
部署流程 → 部署运维 (docs/DEPLOYMENT.md)
系统架构 → 系统架构 (docs/ARCHITECTURE.md)
监控配置 → 部署运维 (docs/DEPLOYMENT.md#监控和分析)
```

### 🤝 贡献者
```
贡献流程 → 贡献指南 (docs/CONTRIBUTION.md)
代码规范 → 贡献指南 (docs/CONTRIBUTION.md#代码规范)
开发环境 → 实现指南 (apps/web/IMPLEMENTATION.md)
```

## 🔍 按功能查找文档

### CLI 相关
- 安装和配置 → [CLI_GUIDE.md](./docs/CLI_GUIDE.md#安装)
- 命令使用 → [CLI_GUIDE.md](./docs/CLI_GUIDE.md#基本使用)
- 故障排除 → [CLI_GUIDE.md](./docs/CLI_GUIDE.md#故障排除)
- 高级用法 → [CLI_GUIDE.md](./docs/CLI_GUIDE.md#高级用法)

### Web 平台相关
- 功能介绍 → [WEB_PLATFORM.md](./docs/WEB_PLATFORM.md#核心功能)
- 用户界面 → [WEB_PLATFORM.md](./docs/WEB_PLATFORM.md#用户界面设计)
- 社区互动 → [WEB_PLATFORM.md](./docs/WEB_PLATFORM.md#社区互动)
- 性能优化 → [WEB_PLATFORM.md](./docs/WEB_PLATFORM.md#性能优化)

### 开发相关
- 架构设计 → [ARCHITECTURE.md](./docs/ARCHITECTURE.md#整体架构)
- 数据库设计 → [ARCHITECTURE.md](./docs/ARCHITECTURE.md#数据库设计)
- API 接口 → [API_REFERENCE.md](./docs/API_REFERENCE.md#api-概述)
- 部署流程 → [DEPLOYMENT.md](./docs/DEPLOYMENT.md#部署概述)

### 运维相关
- 环境配置 → [DEPLOYMENT.md](./docs/DEPLOYMENT.md#部署前准备)
- 监控配置 → [DEPLOYMENT.md](./docs/DEPLOYMENT.md#监控和分析)
- 备份恢复 → [DEPLOYMENT.md](./docs/DEPLOYMENT.md#备份和恢复)
- 故障排除 → [DEPLOYMENT.md](./docs/DEPLOYMENT.md#故障排除)

## 📊 文档统计

| 分类 | 文档数量 | 主要内容 |
|------|----------|----------|
| 系统文档 | 7 个 | 架构、API、使用指南 |
| 实现文档 | 3 个 | 开发、部署、总结 |
| 项目文档 | 2 个 | 总览和导航 |
| 代码文档 | 1 个 | README 文件 |

## 🔄 文档维护

### 更新流程
1. **发现问题** → 创建 Issue
2. **修改文档** → 提交 Pull Request
3. **审查通过** → 合并到主分支
4. **自动部署** → 更新到网站

### 文档规范
- ✅ Markdown 格式
- ✅ 中英文对照
- ✅ 代码示例可运行
- ✅ 链接引用准确
- ✅ 定期更新

## 🤝 反馈渠道

### 文档问题
- **GitHub Issues**: https://github.com/emp/skill/issues
- **标签**: `documentation`

### 改进建议
- **GitHub Discussions**: https://github.com/emp/skill/discussions
- **分类**: `Documentation`

## 📞 联系我们

- **项目主页**: https://emp-skill.com
- **GitHub 仓库**: https://github.com/emp/skill
- **Discord 社区**: https://discord.gg/emp-skill
- **邮箱**: team@emp-skill.com

---

## 🎯 快速导航

**新手用户** → [CLI_GUIDE.md](./docs/CLI_GUIDE.md) | [WEB_PLATFORM.md](./docs/WEB_PLATFORM.md)

**开发者** → [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | [API_REFERENCE.md](./docs/API_REFERENCE.md)

**贡献者** → [CONTRIBUTION.md](./docs/CONTRIBUTION.md) | [IMPLEMENTATION.md](./apps/web/IMPLEMENTATION.md)

**运维人员** → [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

---

**完整的文档体系 = 用户和开发者的最佳体验！** 📚✨