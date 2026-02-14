#!/bin/bash

# EMP Skill Enterprise - Visual Demo Script
# This script creates a mock environment to demonstrate new B2B features.

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

ESKILL="node $(pwd)/packages/eskill/bin/eskill.mjs"
DEMO_DIR="$(pwd)/demo-env"
MOCK_REPO="$DEMO_DIR/mock-enterprise-repo"

echo -e "${BLUE}${BOLD}======================================================"
echo -e "      EMP Skill Enterprise - 可视化功能演示"
echo -e "======================================================${NC}"

# Cleanup and setup
rm -rf "$DEMO_DIR"
mkdir -p "$MOCK_REPO/skill-ui-logic"
mkdir -p "$MOCK_REPO/skill-api-gateway"
mkdir -p "$DEMO_DIR/mock-home/.claude/skills"
mkdir -p "$DEMO_DIR/mock-project/.agent/skills"

# Create Mock Skills
cat > "$MOCK_REPO/skill-ui-logic/SKILL.md" <<EOF
---
name: enterprise-ui
description: "企业标准 UI 交互规范与动画库"
version: "2.1.0"
---
# UI Logic Skill
EOF

cat > "$MOCK_REPO/skill-api-gateway/SKILL.md" <<EOF
---
name: internal-api
description: "核心业务服务接口定义 (Internal Only)"
version: "1.0.5"
---
# API Skill
EOF

echo -e "
${YELLOW}1. 演示：智能列表展示 (链路追踪)${NC}"
echo -e "当前尚未安装任何技能，运行 eskill list:"
$ESKILL list

echo -e "
${YELLOW}2. 演示：交互式多选安装 (Monorepo 发现)${NC}"
echo -e "我们将从模拟的企业仓库 [mock-enterprise-repo] 安装技能。"
echo -e "${GREEN}提示：接下来的交互中，请使用 [空格] 勾选, [回车] 确认${NC}"
sleep 2

# Run interactive install
$ESKILL install "$MOCK_REPO"

echo -e "
${YELLOW}3. 演示：精细化列表与脱敏路径${NC}"
echo -e "安装完成后，再次运行 eskill list 观察视觉变化:"
$ESKILL list

echo -e "
${YELLOW}4. 演示：智能鉴权逻辑 (模拟)${NC}"
echo -e "尝试安装一个不存在的私有域链接，观察自动弹出 Token 输入框的逻辑:"
echo -e "${RED}提示：在弹出 'Please enter Access Token' 时，您可以输入任意字符或按 Ctrl+C 退出演示${NC}"
sleep 2
$ESKILL install https://git.internal.corp/secret-skills

echo -e "
${BLUE}${BOLD}======================================================"
echo -e "              演示结束！感谢体验。"
echo -e "======================================================${NC}"
