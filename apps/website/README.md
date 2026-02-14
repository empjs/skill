# @empjs/skill Website

This repository contains the official website for [@empjs/skill](https://github.com/empjs/skill) - the Unified Distribution Hub for AI Agent Skills.

## Project Overview

`@empjs/skill` (CLI command: `eskill`) is an enterprise-grade distribution hub that securely bridges internal engineering standards with AI Agents. It allows teams to manage, distribute, and trace skills across 18+ AI platforms with private repository support.

### Key Features

- **Unified Registry**: Centralized skill management in `~/.emp-agent/skills/`.
- **Smart Distribution**: Auto-detects 18+ agents (Claude, Cursor, Windsurf, Trae, etc.) and injects skills with zero manual path configuration.
- **Private Repo Support**: Zero-config private GitLab/GitHub support with smart in-line token prompting and SSH fallback.
- **B2B On-demand**: Monorepo support for interactive multi-select skill installation.
- **Agent Traceability**: Clearly visualize which skills are linked to which AI Agents.
- **Project-Local Support**: Install skills to `./.agent/skills` for project-level isolation.

## Website Development

The website is built with modern web technologies for a fast, responsive, and beautiful experience.

### Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) (using `rolldown-vite`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **i18n**: Custom lightweight i18n implementation (supporting EN/ZH)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## Design System

The project follows the **Nova Skill** design system. Detailed specifications including color palette, typography, spacing, and component rules can be found in [design-system/nova-skill/MASTER.md](./design-system/nova-skill/MASTER.md).

### Design Principles

- **Mood**: Developer-focused, precise, functional.
- **Style**: Vibrant & Block-based.
- **Typography**: JetBrains Mono (Headings) and IBM Plex Sans (Body).

## Getting Started

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   pnpm dev
   ```

3. **Build for Production**:
   ```bash
   pnpm build
   ```

4. **Preview Production Build**:
   ```bash
   pnpm preview
   ```

## Deployment

The website is deployed to Cloudflare Pages.

### Manual Deployment

```bash
pnpm deploy
```

### Production Deployment

```bash
pnpm deploy:prod
```

For more details, see [DEPLOY.md](./DEPLOY.md).

## Official Links

- **Repository**: [https://github.com/empjs/skill](https://github.com/empjs/skill)
- **Website**: [https://github.com/empjs/skill](https://github.com/empjs/skill) (hosted on Cloudflare Pages)

## License

© 2026 EMP Team. MIT License.
