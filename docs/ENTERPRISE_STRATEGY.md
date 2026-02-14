# EMP Enterprise Strategy - 私有化 Agent 技能平台战略

> **核心定位**：连接企业内部代码仓库与 AI Agent 的安全桥梁。

## 1. 产品愿景 (Vision)

与 `skills.sh` 侧重于公开、开源社区的技能分享不同，**EMP Enterprise** 专注于解决企业内部 AI 落地面临的“最后一公里”问题：

*   **数据安全**：技能代码不离开内网，通过企业内部 GitLab/GitHub Enterprise 分发。
*   **知识沉淀**：将企业内部的工程规范、部署流程、业务逻辑封装为 Skill，让 AI "懂" 公司业务。
*   **权限管控**：复用现有的代码仓库权限体系，确保只有授权人员能使用特定技能。

## 2. 核心架构 (Architecture)

### 2.1 总体架构图 (Decentralized Mode)

```mermaid
graph TD
    User[开发者] -->|CLI命令| CLI[eskill CLI]
    
    subgraph "客户端能力 (Local)"
        CLI -->|API查询| Scanner[Source Scanner]
        CLI -->|缓存| Cache[本地索引缓存 (~/.emp/cache)]
        CLI -->|Git Clone| Installer[技能安装器]
    end
    
    subgraph "企业基础设施 (Existing)"
        Scanner -.->|GitLab API| GitAPI[GitLab/GitHub API]
        Installer -.->|SSH/HTTPS| GitRepo[私有代码仓库]
    end
    
    User -->|使用| Agent[本地 Agent]
    Agent -.->|加载| LocalSkills[~/.emp-agent/skills]
```

### 2.2 关键组件

1.  **Serverless Registry (去中心化索引)**
    *   **理念**：不建立中心化数据库，**Git 仓库即索引**。
    *   **实现方式**：
        *   CLI 通过 API 扫描指定的 **Git Group/Organization**（如 `my-company/skills`）。
        *   自动发现带有 `SKILL.md` 或特定 Topic（如 `emp-skill`）的仓库。
        *   在本地构建临时索引 (`registry.json`) 并缓存，避免频繁请求 API。

2.  **Enhanced CLI (`eskill`)**
    *   **Provider 适配器**：内置 GitLab/GitHub/Gitea 的 API 客户端。
    *   **智能缓存**：`eskill update` 命令负责刷新远程列表，平时操作读取本地缓存。
    *   **配置化源**：
        ```bash
        # 配置扫描源
        eskill source add --provider gitlab --url https://gitlab.company.com --group agent-skills
        ```

3.  **Skill as Code (技能即代码)**
    *   技能即 Git 仓库。
    *   版本管理、Code Review、CI/CD 均复用现有 Git 流程。

## 3. 功能规划 (Feature Roadmap)

### Phase 1: 基础设施适配 (Foundation) - ✅ 已完成
*   **目标**：打通私有 Git 仓库的拉取链路。
*   **核心功能**：
    *   [x] CLI 支持 SSH URL (`git@gitlab.company.com:group/repo.git`)。
    *   [x] CLI 自动识别非 GitHub/GitLab 的私有 Git 域名。
    *   [x] 基础的 `git clone` 鉴权 (支持通过 `eskill auth` 注入 Token)。

### Phase 2: 去中心化发现与按需分发 (Discovery & On-demand) - ✅ 已完成
*   **目标**：实现 Monorepo 技能集识别与按需安装。
*   **核心功能**：
    *   [x] **Collection Scanner**：递归扫描子目录中的 `SKILL.md`，识别技能集。
    *   [x] **Interactive UI**：基于 `enquirer` 的交互式多选界面。
    *   [x] **Auth Gateway**：`eskill auth` 命令管理各域名 Access Token。
    *   [x] **Agent Traceability**：`eskill list` 清晰展示技能在不同 Agent 中的链接状态。

### Phase 3: 企业级管控与标准化 (Enterprise Control) - 🏗️ 进行中
*   **目标**：安全、合规与标准化。
*   **核心功能**：
    *   [ ] **Skill Templates**：提供符合公司规范的技能脚手架。
    *   [ ] **Usage Audit**：审计谁安装了什么技能（CLI 上报日志）。
    *   [ ] **RBAC**：基于 Git 权限的安装控制。

## 5. 风险与挑战 (Risks & Mitigation)

### 5.1 性能风险
*   **问题**：当企业内部 Skill 仓库数量达到千级时，CLI 实时调用 GitLab API 扫描会导致显著延迟 (Latency) 甚至超时。
*   **缓解策略**：
    *   **增量更新**：利用 Git 的 `last_activity_at` 字段，只获取最近更新的仓库。
    *   **本地索引持久化**：将扫描结果存为 `~/.emp/registry.json`，设置 TTL (如 24h)，避免每次运行 `eskill list` 都请求 API。
    *   **Lazy Loading**：仅在搜索时进行模糊匹配，而不是一次性拉取所有元数据。

### 5.2 API Rate Limit
*   **问题**：大规模并发使用时（如 CI/CD 流水线中批量安装），可能触发 GitLab/GitHub 的 API 速率限制。
*   **缓解策略**：
    *   **Token 轮换**：支持配置多个 Access Token。
    *   **CI 专用缓存**：在 CI 环境中提供预构建的 `registry.json` 镜像，避免实时扫描。

### 5.3 数据一致性
*   **问题**：去中心化模式下，不同用户的本地索引可能不一致，导致 A 用户能搜到的技能 B 用户搜不到。
*   **缓解策略**：
    *   **强制刷新**：`eskill update --force` 强制同步最新状态。
    *   **版本锁定**：支持 `eskill install skill@hash` 精确锁定版本，确保可复现。

## 6. 未来演进 (Evolution Path)

### 6.1 Hybrid Mode (混合架构)
当企业规模极其庞大（数万研发），纯客户端扫描变得不可行时，可以平滑引入一个 **"Lightweight Indexer"**。
*   **演进方式**：部署一个极简的定时任务 (CronJob)，每小时扫描一次 GitLab，生成静态的 `registry.json` 文件并发布到内部对象存储 (S3/MinIO)。
*   **客户端变更**：`eskill` 只需将 Source URL 从 GitLab API 地址切换为 S3 静态文件地址，无需升级代码。

### 6.2 Agent-Native Integration
*   **当前**：通过文件系统挂载 (Symlink) "欺骗" Agent。
*   **未来**：推动 Agent 厂商 (如 Anthropic, Cursor) 提供标准的 **Remote Skill Protocol**。
    *   `eskill` 变身为一个本地的 LSP Server 或 MCP Server。
    *   Agent 直接通过协议查询可用技能，实现"即用即装" (Just-in-Time Installation)。

### 6.3 Skill 互操作性标准
*   与 `skills.sh` 社区合作，推动 `SKILL.md` 标准的扩展，增加 `enterprise` 字段（如：兼容性声明、所需权限声明），建立企业级技能的元数据标准。
