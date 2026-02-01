# Playload

Android 调试容器，通过 URL 加载外部 RN Bundle。

## 架构

```
┌─────────────────┐
│   Playload App  │  ← 本项目 (Android)
├─────────────────┤
│ BundleLoader    │  ← 加载逻辑
├─────────────────┤
│ RN Engine       │  ← Hermes
└─────────────────┘
         ↓
    外部 RN Bundle  ← 独立仓库提供
```

## 模式

| 模式 | 说明 | 用途 |
|------|------|------|
| Dev | 从服务器实时加载 | 开发调试 |
| Release | 下载后加载 | 离线测试 |

## 输入项

| 字段 | 说明 |
|------|------|
| App Name | RN 应用名称，首次输入后保存 |
| Bundle URL | Bundle 地址 |
| Dev/Release 模式 | 切换加载方式 |

## 构建

```bash
cd apps/playload-android
./gradlew assembleDebug
```

APK 位置: `app/build/outputs/apk/debug/app-debug.apk`

## 安装

```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

## 使用

1. 安装 APK
2. 打开 Playload
3. 输入 App Name 和 Bundle URL
4. 选择模式，点击加载
