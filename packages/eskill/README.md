# @empjs/skill

Unified CLI tool for managing AI agent skills across Claude Code, Cursor, Windsurf, and more.

## Features

- ✅ **Unified Storage**: All skills stored in `~/.emp-agent/skills/`
- ✅ **Multi-Agent Support**: Auto-detect and link to 18+ agents (AMP, Claude, Cursor, Windsurf, Cline, Gemini, etc.)
- ✅ **Symlink Distribution**: Skills symlinked to each AI agent's directory
- ✅ **Dev Mode**: Local development with instant updates
- ✅ **NPM Integration**: Install from public NPM registry or Git URL

## Installation

```bash
# Install CLI globally (choose your package manager)

# Using pnpm (recommended)
pnpm add -g @empjs/skill

# Using npm
npm install -g @empjs/skill

# Using yarn
yarn global add @empjs/skill

# Using bun
bun install -g @empjs/skill
```

## Usage

### Install a Skill

```bash
# Install from NPM (auto-detect all agents)
eskill install <skill-name>

# Install from Git URL
eskill install https://github.com/owner/repo/tree/main/path

# Install for specific agent
eskill install <skill-name> --agent claude
eskill install <skill-name> --agent cursor

# Force reinstall
eskill install <skill-name> --force
```

### Dev Mode (Local Development)

```bash
# Link from local directory (for skill developers)
cd path/to/your-skill
eskill install . --link

# Changes to source files will reflect immediately!
```

### List Installed Skills

```bash
# Show all installed skills
eskill list

# Output example:
# 📦 skill-name (v1.0.0)
#    → Linked to: Claude Code, Cursor, Windsurf
```

## Supported AI Agents

The CLI automatically detects and links to:

- **AMP** - `~/.config/agents/skills/`
- **Antigravity** - `~/.gemini/antigravity/skills/`
- **Claude Code** - `~/.claude/skills/`
- **ClawdBot** - `~/.openclaw/skills/` or `~/.clawdbot/skills/`
- **Cline** - `~/.cline/skills/`
- **Codex** - `~/.codex/skills/`
- **Cursor** - `~/.cursor/skills/`
- **Droid** - `~/.factory/skills/`
- **Gemini** - `~/.gemini/skills/`
- **GitHub Copilot** - `~/.copilot/skills/`
- **Goose** - `~/.config/goose/skills/`
- **Kilo Code** - `~/.kilocode/skills/`
- **Kiro CLI** - `~/.kiro/skills/`
- **OpenCode** - `~/.config/opencode/skills/`
- **Roo Code** - `~/.roo/skills/`
- **Trae** - `~/.trae/skills/`
- **Windsurf** - `~/.windsurf/skills/` or `~/.codeium/windsurf/skills/`

## Directory Structure

```
~/.emp-agent/
├── skills/                  # Unified storage
│   └── skill-name/         # Skill content
│       ├── SKILL.md
│       └── references/
├── config.json
└── cache/

# Symlinks to AI agents
~/.claude/skills/skill-name -> ~/.emp-agent/skills/skill-name
~/.cursor/skills/skill-name -> ~/.emp-agent/skills/skill-name
~/.windsurf/skills/skill-name -> ~/.emp-agent/skills/skill-name
```

## Options

### Install Options

- `-a, --agent <name>` - Install for specific agent (claude, cursor, windsurf, all)
- `-l, --link` - Dev mode: symlink from local directory
- `-f, --force` - Force reinstall if already exists

## Examples

### Team Member (First Time)

```bash
# 1. Install CLI (choose your package manager)
pnpm add -g @empjs/skill
# or
npm install -g @empjs/skill
# or
yarn global add @empjs/skill
# or
bun install -g @empjs/skill

# 2. Install skill
eskill install <skill-name>

# ✅ Auto-detects and links to all installed AI agents
```

### Skill Developer

```bash
# 1. Navigate to skill package
cd path/to/your-skill

# 2. Link for development
eskill install . --link

# 3. Edit files - changes reflect immediately!
vim SKILL.md

# 4. Verify
eskill list
```

### Install for Specific Agent Only

```bash
# Only install to Cursor
eskill install <skill-name> --agent cursor
```

## Development

```bash
# Clone repo
git clone <repository-url>
cd emp-skill

# Install dependencies
pnpm install

# Build
pnpm build

# Test locally
node bin/eskill.mjs list
```

## Publishing

```bash
# Build
pnpm build

# Publish to NPM
pnpm publish
```

## Troubleshooting

### Permission Denied Error (EACCES)

If you encounter `EACCES: permission denied` when installing skills, this is because npm is trying to access system directories. Here are solutions:

#### Solution 1: Configure npm to use user directory (Recommended)

```bash
# 1. Create npm global directory
mkdir -p ~/.npm-global

# 2. Configure npm
npm config set prefix '~/.npm-global'

# 3. Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH=~/.npm-global/bin:$PATH

# 4. Reload shell
source ~/.zshrc  # or source ~/.bash_profile
```

#### Solution 2: Use NVM (Node Version Manager)

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node.js (automatically handles npm paths)
nvm install --lts
nvm use --lts
```

#### Solution 3: Fix system directory permissions (Requires sudo)

```bash
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**Note:** System updates may reset these permissions.

### No agents detected

If you see "No AI agents detected", ensure you have at least one of the supported agents installed:

```bash
# Check supported agents
eskill agents

# Example directories
ls ~/.claude/skills   # Claude Code
ls ~/.cursor/skills   # Cursor
ls ~/.windsurf/skills # Windsurf
```

### Permission denied

If you get permission errors when creating symlinks:

```bash
# On macOS, grant Full Disk Access to Terminal
# System Preferences → Security & Privacy → Privacy → Full Disk Access
```

### Skill not updating

If using dev mode (`--link`) and changes aren't reflecting:

```bash
# Verify symlink
ls -la ~/.emp-agent/skills/
ls -la ~/.claude/skills/

# Should show symlink arrows (->)
```

## License

MIT License - EMP Team
