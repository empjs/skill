# @empjs/skill - Unified AI Agent Skill Hub

[![NPM Version](https://img.shields.io/npm/v/@empjs/skill.svg)](https://www.npmjs.com/package/@empjs/skill)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Enterprise Distribution Hub for AI Agent Skills. Securely bridge your internal engineering standards with AI Agents (Claude, Cursor, Windsurf, and more).

## 🚀 Overview

`@empjs/skill` is a unified CLI tool and platform designed to manage, distribute, and trace AI agent skills across multiple platforms. It solves the fragmentation of skill management by providing a centralized hub for all your agent extensions.

- **Unified Registry**: Centralized skill management in `~/.emp-agent/skills/`.
- **18+ Agents Supported**: Auto-detects and links to Claude Code, Cursor, Windsurf, Trae, Gemini, and more.
- **Smart Distribution**: Zero manual path configuration.
- **Private Repo Support**: Seamless integration with private GitLab/GitHub repositories.
- **B2B On-demand**: Monorepo support for project-specific skill installation.

## 📦 Supported AI Agents

The platform automatically detects and supports:

- **Claude Code** (`~/.claude/skills/`)
- **Cursor** (`~/.cursor/skills/`)
- **Windsurf** (`~/.windsurf/skills/`)
- **Trae** (`~/.trae/skills/`)
- **Gemini** (`~/.gemini/skills/`)
- **Cline**, **Roo Code**, **Goose**, **AMP**, and many more.

## 🛠️ Installation

```bash
# Using pnpm (recommended)
pnpm add -g @empjs/skill

# Using npm
npm install -g @empjs/skill
```

## 📖 Quick Start

### Install a Skill
```bash
# Install from NPM
eskill install @empjs/skill-example

# Install from Git URL (GitHub/GitLab)
eskill install https://github.com/empjs/skill/tree/main/packages/yapi-mock-data
```

### List Skills
```bash
eskill list
```

### Dev Mode
```bash
cd path/to/your-skill
eskill install . --link
```

## 📁 Project Structure

- `apps/website`: The official website (built with Vite + Tailwind).
- `packages/eskill`: The core CLI tool.
- `packages/yapi-mock-data`: An example skill package.
- `docs/`: Comprehensive documentation.
- `skills/`: Skill definitions and templates.

## 📚 Documentation

For more detailed information, please refer to our documentation:

- [Documentation Index](./DOCUMENTATION_INDEX.md)
- [CLI Guide](./docs/CLI_GUIDE.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Web Platform](./docs/WEB_PLATFORM.md)
- [Deployment](./docs/DEPLOYMENT.md)
- [Contribution Guide](./docs/CONTRIBUTION.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTION.md) for more details.

## 📄 License

© 2026 EMP Team. Licensed under the [MIT License](./LICENSE).

## 🔗 Links

- **Repository**: [https://github.com/empjs/skill](https://github.com/empjs/skill)
- **Website**: [https://skill.empjs.dev](https://skill.empjs.dev) (Hosted on Cloudflare)
