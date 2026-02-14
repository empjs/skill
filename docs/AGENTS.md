# EMP Agent Integration Guide - Agent 适配与集成指南

本文档详细定义了 EMP 平台如何与各种 AI Agent 进行交互，以及在企业级环境下如何管理这些集成。

## 1. Agent 适配原理

EMP 平台的核心哲学是 **"Write Once, Run Everywhere"**。所有的技能都遵循标准的 `SKILL.md` 规范，通过文件系统链接（Symlink/Copy）的方式挂载到各 Agent 的配置目录中。

### 1.1 目录结构标准

```
~/.emp-agent/
├── skills/                  # 技能统一存储区 (Source of Truth)
│   └── company-deploy/     # 示例技能
│       ├── SKILL.md
│       └── scripts/
└── config.json             # 全局配置
```

### 1.2 挂载机制

不同 Agent 对技能的读取方式不同，EMP 采用适配器模式处理差异：

| Agent 类型 | 典型代表 | 挂载方式 | 路径示例 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **原生支持** | Claude Code | Symlink | `~/.claude/skills/` | 原生支持 `SKILL.md` |
| **文件读取型** | Cursor | Copy | `~/.cursor/skills/` | Cursor 不支持软链，需物理复制 |
| **配置注入型** | VSCode Copilot | JSON Config | `.vscode/settings.json` | 需通过配置指定上下文路径 |
| **自定义扩展** | Windsurf | Symlink | `~/.windsurf/skills/` | 类似 Claude |

## 2. 支持的 Agent 列表 (Supported Agents)

目前 EMP CLI (`eskill`) 已内置以下 Agent 的自动探测与适配逻辑：

### 2.1 Tier 1: 完美支持 (官方推荐)

*   **Claude Code**
    *   **配置路径**: `~/.claude/skills`
    *   **特性**: 支持完整 Markdown 渲染，支持 MCP 工具调用。
    *   **企业配置**: 建议通过统一的分发脚本预置 `~/.claude/config.json`。

*   **Cursor**
    *   **配置路径**: `~/.cursor/skills` (实际为 `Agent Decides` 规则)
    *   **特性**: 强大的代码库感知能力。
    *   **注意**: 必须使用 `copy` 模式，且更新技能后需要重新加载窗口。

### 2.2 Tier 2: 兼容支持

*   **Windsurf / Codeium**
    *   **配置路径**: `~/.windsurf/skills`
*   **Gemini CLI**
    *   **配置路径**: `~/.gemini/skills`
*   **GitHub Copilot CLI**
    *   **配置路径**: `~/.copilot/skills`

### 2.3 Tier 3: 实验性支持

*   **OpenCode**
*   **Roo Code**
*   **Cline**

## 3. 企业级 Agent 管控 (Enterprise Control)

在企业内部，管理员可能希望统一控制员工 Agent 的行为。

### 3.1 强制技能分发 (Mandatory Skills)
管理员可以定义一组“基线技能”（例如：`security-check`, `license-audit`），要求所有员工终端必须安装。

**实现方案**:
1.  在项目根目录放置 `.emp/recommended-skills.json`。
2.  员工运行 `eskill install` 时，自动检测并提示安装缺失的基线技能。

### 3.2 敏感技能隔离
对于包含敏感逻辑（如：生产环境数据库操作）的技能，可以通过配置限制其只能在特定 Agent（如：堡垒机上的 Claude Code）上运行，而禁止在本地 VSCode 中运行。

## 4. 自定义 Agent 适配

如果企业使用自研的 Agent 或 Web UI，可以通过以下方式适配 EMP：

### 4.1 标准接入
只需让你的 Agent 监听 `~/.emp-agent/skills` 目录的变化，并解析其中的 `SKILL.md` 文件即可。

### 4.2 Webhook 集成 (规划中)
EMP Server 可以提供 Webhook，当技能更新时通知 Agent 刷新上下文。
