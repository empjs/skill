#!/bin/bash
# Quick test script - just test the basics

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "🚀 Quick CLI Test"
echo ""

# Build
echo "Building CLI..."
cd "$WORKSPACE_ROOT/packages/nova-skill"
pnpm install --silent 2>/dev/null || pnpm install
pnpm build

echo "✓ Build complete"
echo ""

# Test list
echo "Testing 'nova-skill list'..."
node bin/nova-skill.mjs list

echo ""
echo "Testing 'nova-skill install' (dev mode)..."
cd "$WORKSPACE_ROOT/packages/nova-rn-skill"
node "$WORKSPACE_ROOT/packages/nova-skill/bin/nova-skill.mjs" install . --link

echo ""
echo "✅ Quick test complete!"
echo ""
echo "Installed to: $HOME/.nova-agent/skills/nova-rn"
echo ""
