# 🚀 AI Agent Skills Guide

This project provides a unified hub for managing AI Agent skills. Skills are stored in the `skills/` directory and can be installed via the `eskill` CLI.

## 📂 Skill Directory Structure

Skills should be organized within the `skills/` folder:

```
skills/
├── your-skill-name/
│   ├── SKILL.md          # Core skill definition
│   └── ...               # Supporting files
└── TEMPLATE.md           # Template for new skills
```

## 📝 Defining a Skill

A skill is defined by a `SKILL.md` file with frontmatter metadata:

```markdown
---
name: my-awesome-skill
description: "Does something amazing"
version: "1.0.0"
---

# My Awesome Skill

Detailed instructions for the AI Agent...
```

## 🛠️ Usage

To install a skill locally for development:

```bash
eskill install ./skills/your-skill-name --link
```

To install a skill from the repository:

```bash
eskill install https://github.com/empjs/skill/tree/main/skills/your-skill-name
```

## 🌟 Best Practices

- Keep skill definitions focused and concise.
- Provide clear examples of how the agent should use the skill.
- Use versioning to manage changes.
- Test your skills across multiple agents (Claude, Cursor, Windsurf, etc.).
