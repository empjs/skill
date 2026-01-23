# 测试说明

## 运行测试

```bash
# 运行所有测试
pnpm test

# 运行 Git URL 解析测试
pnpm test:git

# 运行 Registry 测试
pnpm test:registry
```

## 测试文件

### `git.test.ts`
Git URL 解析功能的单元测试，包括：
- GitHub URL 解析（各种格式）
- GitLab URL 解析
- SSH URL 解析
- URL 检测功能
- 边界情况处理

### `git-install.test.ts`
Git URL 安装功能的集成测试，包括：
- URL 解析验证
- Git URL 检测
- 真实场景测试
- 错误处理测试

### `registry.test.ts`
Registry 配置功能的测试，包括：
- 公共 NPM Registry 连接测试
- 私有 Registry 连接测试
- NPM 安装验证

## 测试要求

- **Bun**: 测试框架使用 Bun
- **Git**: Git URL 安装功能需要系统安装 Git
- **网络**: 某些集成测试需要网络连接

## 跳过网络测试

如果需要在无网络环境下运行测试，可以设置环境变量：

```bash
SKIP_NETWORK_TESTS=true pnpm test
```

## 测试覆盖率

当前测试覆盖：
- ✅ Git URL 解析（GitHub、GitLab）
- ✅ URL 格式检测
- ✅ 边界情况处理
- ✅ Registry 配置
- ⚠️ 实际 Git 克隆（需要网络，可选）
