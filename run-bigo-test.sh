#!/bin/bash

# 使用本地构建的最新 eskill
ESKILL="node $(pwd)/packages/eskill/bin/eskill.mjs"

echo -e "\033[0;34m[测试开始] 正在连接私有 GitLab 仓库...\033[0m"
echo -e "\033[0;32mURL: https://git.sysop.bigo.sg/fed-activity/bigolive/bigolive-skills/-/tree/main\033[0m"
echo -e "----------------------------------------------------------------"

# 执行安装
# 它将自动识别 /-/tree/main 分支，并扫描子目录中的 SKILL.md
$ESKILL install https://git.sysop.bigo.sg/fed-activity/bigolive/bigolive-skills/-/tree/main

echo -e "----------------------------------------------------------------"
echo -e "\033[0;34m[测试结束] 您可以运行 'eskill list' 检查安装结果。\033[0m"
