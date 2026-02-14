import { $ } from "bun";
import path from "node:path";

// ANSI Colors
const BLUE = "\033[0;34m";
const GREEN = "\033[0;32m";
const NC = "\033[0m";

const eskillPath = path.join(process.cwd(), "packages/eskill/bin/eskill.mjs");
const targetUrl = "https://git.sysop.bigo.sg/fed-activity/bigolive/bigolive-skills/-/tree/main";

console.log(`${BLUE}[测试开始] 正在连接私有 GitLab 仓库...${NC}`);
console.log(`${GREEN}URL: ${targetUrl}${NC}`);
console.log("----------------------------------------------------------------");

try {
  // Execute using Bun's shell ($) which inherits stdio for interactive prompts
  await $`node ${eskillPath} install ${targetUrl}`;
  
  console.log("----------------------------------------------------------------");
  console.log(`${BLUE}[测试结束] 您可以运行 'eskill list' 检查安装结果。${NC}`);
} catch (error) {
  console.error("
❌ 测试过程中发生错误");
  process.exit(1);
}
