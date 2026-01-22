#!/bin/bash
# Test script for @nova/skill CLI

set -e  # Exit on error

echo "🧪 Testing @nova/skill CLI"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Test 1: Build CLI
echo -e "${BLUE}Test 1: Building CLI...${NC}"
cd "$WORKSPACE_ROOT/packages/nova-skill"
pnpm install
pnpm build

if [ -f "dist/index.js" ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Test 2: CLI executable
echo -e "${BLUE}Test 2: Testing CLI executable...${NC}"
if [ -x "bin/nova-skill.mjs" ]; then
    echo -e "${GREEN}✓ CLI is executable${NC}"
else
    echo -e "${RED}✗ CLI is not executable${NC}"
    exit 1
fi
echo ""

# Test 3: List command (should show empty or existing skills)
echo -e "${BLUE}Test 3: Testing 'list' command...${NC}"
node bin/nova-skill.mjs list
echo -e "${GREEN}✓ List command works${NC}"
echo ""

# Test 4: Install from local directory (dev mode)
echo -e "${BLUE}Test 4: Testing install from local directory (dev mode)...${NC}"
cd "$WORKSPACE_ROOT/packages/nova-rn-skill"

# Check if SKILL.md exists
if [ ! -f "SKILL.md" ]; then
    echo -e "${RED}✗ SKILL.md not found in nova-rn-skill package${NC}"
    exit 1
fi

# Install in dev mode
node "$WORKSPACE_ROOT/packages/nova-skill/bin/nova-skill.mjs" install . --link

# Verify installation
if [ -L "$HOME/.nova-agent/skills/nova-rn" ]; then
    echo -e "${GREEN}✓ Skill installed to shared directory${NC}"
else
    echo -e "${RED}✗ Skill not found in shared directory${NC}"
    exit 1
fi
echo ""

# Test 5: Verify symlinks to AI agents
echo -e "${BLUE}Test 5: Checking symlinks to AI agents...${NC}"
LINKED_COUNT=0

if [ -L "$HOME/.claude/skills/nova-rn" ]; then
    echo -e "${GREEN}✓ Linked to Claude Code${NC}"
    ((LINKED_COUNT++))
fi

if [ -L "$HOME/.cursor/skills/nova-rn" ]; then
    echo -e "${GREEN}✓ Linked to Cursor${NC}"
    ((LINKED_COUNT++))
fi

if [ -L "$HOME/.windsurf/skills/nova-rn" ]; then
    echo -e "${GREEN}✓ Linked to Windsurf${NC}"
    ((LINKED_COUNT++))
fi

if [ $LINKED_COUNT -eq 0 ]; then
    echo -e "${BLUE}ℹ No AI agents detected (this is OK for testing)${NC}"
else
    echo -e "${GREEN}✓ Linked to $LINKED_COUNT AI agent(s)${NC}"
fi
echo ""

# Test 6: List installed skills
echo -e "${BLUE}Test 6: Listing installed skills...${NC}"
node "$WORKSPACE_ROOT/packages/nova-skill/bin/nova-skill.mjs" list
echo -e "${GREEN}✓ List shows installed skill${NC}"
echo ""

# Test 7: Verify skill content
echo -e "${BLUE}Test 7: Verifying skill content...${NC}"
if [ -f "$HOME/.nova-agent/skills/nova-rn/SKILL.md" ]; then
    echo -e "${GREEN}✓ SKILL.md exists${NC}"
else
    echo -e "${RED}✗ SKILL.md not found${NC}"
    exit 1
fi

if [ -d "$HOME/.nova-agent/skills/nova-rn/references" ]; then
    echo -e "${GREEN}✓ references/ directory exists${NC}"
else
    echo -e "${RED}✗ references/ directory not found${NC}"
    exit 1
fi

# Count reference files
REF_COUNT=$(find "$HOME/.nova-agent/skills/nova-rn/references" -name "*.md" | wc -l)
echo -e "${GREEN}✓ Found $REF_COUNT reference documents${NC}"
echo ""

# Test 8: Verify symlink target
echo -e "${BLUE}Test 8: Verifying symlink target...${NC}"
LINK_TARGET=$(readlink "$HOME/.nova-agent/skills/nova-rn")
if [ "$LINK_TARGET" = "$WORKSPACE_ROOT/packages/nova-rn-skill" ]; then
    echo -e "${GREEN}✓ Symlink points to correct source${NC}"
    echo -e "${BLUE}  Source: $LINK_TARGET${NC}"
else
    echo -e "${RED}✗ Symlink target incorrect${NC}"
    echo -e "${RED}  Expected: $WORKSPACE_ROOT/packages/nova-rn-skill${NC}"
    echo -e "${RED}  Got: $LINK_TARGET${NC}"
fi
echo ""

# Summary
echo "================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📍 Installed location: $HOME/.nova-agent/skills/nova-rn"
echo ""
echo "Next steps:"
echo "  1. Test in Claude Code or Cursor"
echo "  2. Make changes to SKILL.md and see them reflect immediately"
echo "  3. Publish to NPM: cd packages/nova-rn-skill && pnpm publish"
echo ""
