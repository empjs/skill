# EMP Skill Platform - 贡献指南

## 🤝 欢迎贡献

我们非常欢迎社区贡献！无论是代码、文档、设计还是想法，都能帮助 EMP Skill Platform 变得更好。

## 📋 贡献方式

### 1. 代码贡献

#### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/emp/skill.git
cd emp-skill

# 安装依赖
pnpm install

# 启动开发
pnpm --filter @empjs/skill dev  # CLI 开发
pnpm --filter web dev           # Web 平台开发
```

#### 开发流程

1. **选择任务**
   - 查看 [GitHub Issues](https://github.com/emp/skill/issues)
   - 选择适合自己的任务
   - 或者提出新功能建议

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/issue-number
   ```

3. **编写代码**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

5. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 填写详细描述
   - 等待代码审查

### 2. 问题报告

#### Bug 报告

请使用 [Bug Report 模板](.github/ISSUE_TEMPLATE/bug_report.md)：

```markdown
**Bug 描述**
简洁清晰地描述问题

**复现步骤**
1. 访问 '...'
2. 点击 '...'
3. 出现错误

**期望行为**
应该发生什么

**截图**
如果适用，添加截图

**环境信息**
- OS: [e.g. macOS 12.1]
- Browser: [e.g. Chrome 100.0]
- Version: [e.g. v1.0.0]
```

#### 功能建议

请使用 [Feature Request 模板](.github/ISSUE_TEMPLATE/feature_request.md)：

```markdown
**功能描述**
简洁清晰地描述新功能

**使用场景**
为什么需要这个功能

**实现建议**
可选的实现方式

**其他信息**
任何相关信息
```

### 3. 文档贡献

#### 更新文档

```bash
# 编辑文档
vim docs/README.md

# 提交更改
git add docs/README.md
git commit -m "docs: update README"
```

#### 添加新文档

```bash
# 创建新文档
vim docs/NEW_FEATURE.md

# 更新文档索引
vim docs/README.md
```

### 4. 设计贡献

#### UI/UX 改进

- 分享设计灵感
- 提出界面改进建议
- 贡献图标或图片资源

#### 设计资源

- Figma 文件
- Sketch 文件
- 设计规范文档

## 🎯 代码规范

### TypeScript 规范

#### 类型定义
```typescript
// ✅ 推荐
interface User {
  id: string
  name: string
  email?: string
  createdAt: Date
}

// ❌ 避免
type User = {
  id: string
  name: string
  email?: string
  created_at: Date
}
```

#### 函数签名
```typescript
// ✅ 推荐
function getUserById(id: string): Promise<User | null> {
  // implementation
}

// ❌ 避免
async function getUser(id: string) {
  // implementation
}
```

### React 规范

#### 组件命名
```typescript
// ✅ 推荐
function SkillCard({ skill }: SkillCardProps) {
  return <div>...</div>
}

// ❌ 避免
const skillCard = ({ skill }) => <div>...</div>
```

#### Hooks 使用
```typescript
// ✅ 推荐
function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    fetchSkills().then(setSkills)
  }, [])

  return skills
}

// ❌ 避免
function useSkills() {
  const [skills, setSkills] = useState([])
  // 缺少类型注解
}
```

### CSS 规范

#### Tailwind 类排序
```typescript
// ✅ 推荐
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ❌ 避免
<div className="p-4 bg-white flex items-center shadow-md justify-between rounded-lg">
```

#### 响应式设计
```typescript
// ✅ 推荐
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ 避免
<div className="flex flex-col md:flex-row">
```

## 🧪 测试规范

### 单元测试

```typescript
// CLI 测试示例
describe('install command', () => {
  it('should install skill from GitHub', async () => {
    const result = await installCommand('vercel-labs/agent-skills')
    expect(result.success).toBe(true)
    expect(result.skill).toBeDefined()
  })
})
```

### 集成测试

```typescript
// API 测试示例
describe('skills API', () => {
  it('should return skills list', async () => {
    const response = await request(app)
      .get('/api/skills')
      .expect(200)

    expect(Array.isArray(response.body.skills)).toBe(true)
  })
})
```

### E2E 测试

```typescript
// Playwright 测试示例
test('user can browse skills', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="skill-card"]')
  await expect(page).toHaveURL(/\/skills\/.+/)
})
```

## 📝 提交规范

### Commit 消息格式

```
type(scope): description

[optional body]

[optional footer]
```

#### Type 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

#### 示例
```bash
git commit -m "feat: add skill search functionality

- Add search input component
- Implement fuzzy search algorithm
- Add search result highlighting

Closes #123"
```

### 分支命名

```
feature/feature-name          # 新功能
fix/issue-number             # 修复问题
docs/update-readme           # 文档更新
refactor/cleanup-code        # 代码重构
```

## 🔍 代码审查

### 审查清单

#### 功能完整性
- [ ] 功能是否按需求实现
- [ ] 边界情况是否处理
- [ ] 错误处理是否完善

#### 代码质量
- [ ] 代码是否符合规范
- [ ] 是否有必要的注释
- [ ] 是否存在安全漏洞
- [ ] 性能是否优化

#### 测试覆盖
- [ ] 是否有单元测试
- [ ] 是否有集成测试
- [ ] 边界情况是否覆盖

#### 文档更新
- [ ] API 文档是否更新
- [ ] README 是否更新
- [ ] 变更日志是否更新

### 审查流程

1. **自动化检查**
   - CI/CD 运行测试
   - 代码格式检查
   - 类型检查

2. **人工审查**
   - 代码逻辑审查
   - 性能和安全检查
   - 用户体验评估

3. **合并代码**
   - 所有检查通过
   - 至少一个 approve
   - 解决所有讨论

## 🌟 贡献者奖励

### 贡献等级

#### 🏆 Core Contributor
- 重大功能贡献
- 架构设计改进
- 长期维护贡献

#### ⭐ Active Contributor
- 多个功能贡献
- 活跃的 Issue 处理
- 文档完善

#### 🌱 New Contributor
- 首次代码贡献
- 小型功能或修复
- 文档改进

### 认可方式

- **GitHub Contributors**: 显示在仓库贡献者列表
- **Discord 角色**: 特殊身份标识
- **项目 Credits**: 在文档中列出
- **社区活动**: 邀请参与核心讨论

## 📜 行为准则

### 我们的承诺

在 EMP Skill 社区，我们致力于为所有人提供一个无骚扰的体验，无论年龄、体型、身体残疾、民族、性别认同和表达、经验水平、教育背景、社会经济地位、国籍、个人外貌、种族、宗教或性身份和取向。

### 期望行为

- 使用欢迎和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有益的事
- 对其他社区成员表示同理心

### 不被接受的行为

- 使用带有性暗示的语言或图像
- 进行人身攻击或政治攻击
- 公开或私下骚扰
- 发布他人的私人信息
- 其他道德上不可接受的行为

### 责任和后果

社区维护者负责澄清和执行可接受行为的标准，并将采取适当和公平的纠正措施来应对任何不可接受行为。

## 📄 许可证

通过贡献代码，你同意你的贡献将根据项目的 MIT 许可证进行许可。

---

**贡献 = 让 EMP Skill Platform 变得更好！** 🚀