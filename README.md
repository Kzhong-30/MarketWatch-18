# CSS 动画可视化生成工具

一款基于 React 18 + TypeScript 的 CSS 动画可视化生成工具，帮助开发者快速创建、预览和导出 CSS 动画。

## ✨ 功能特性

### 🎨 动画配置
- **预设动画**：淡入淡出、滑动、缩放、旋转、弹跳、摇晃等 14 种预设动画
- **自定义关键帧**：可添加、删除、编辑关键帧，自定义 CSS 属性
- **时序配置**：持续时间、延迟、缓动函数、循环次数、方向、填充模式

### 👁️ 实时预览
- 可视化预览动画效果
- 播放/暂停控制
- 一键重新播放
- 实时显示动画参数

### 💻 代码生成
- 实时生成 CSS 代码和 @keyframes 定义
- 一键复制到剪贴板
- 导出为 CSS 文件

### ❤️ 收藏管理
- 保存动画配置到收藏夹
- localStorage 本地持久化存储
- 快速加载已保存的动画

### 📚 模板库
- 加载触发动画预设
- 悬浮触发动画预设
- 点击触发动画预设
- 滚动触发动画预设

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 pnpm
pnpm dev
```

### 构建生产版本

```bash
# 使用 npm
npm run build

# 或使用 pnpm
pnpm build
```

## 📁 项目结构

```
src/
├── components/
│   ├── ConfigPanel.tsx      # 配置面板组件
│   ├── PreviewArea.tsx      # 预览区域组件
│   ├── CodeOutput.tsx       # 代码输出组件
│   ├── Favorites.tsx        # 收藏夹组件
│   └── TemplateLibrary.tsx  # 模板库组件
├── store/
│   └── useAnimationStore.ts # Zustand 状态管理
├── types/
│   └── animation.ts         # 类型定义
├── utils/
│   ├── presets.ts           # 动画预设库
│   ├── cssGenerator.ts      # CSS 代码生成工具
│   └── storage.ts           # localStorage 存储工具
├── App.tsx                  # 主应用组件
├── main.tsx                 # 应用入口
└── index.css                # 全局样式
```

## 🎯 预设动画类型

| 类型 | 描述 |
|------|------|
| fadeIn / fadeOut | 淡入 / 淡出 |
| slideInLeft / slideInRight | 左滑入 / 右滑入 |
| slideInUp / slideInDown | 上滑入 / 下滑入 |
| scaleIn / scaleOut | 缩放入 / 缩放出 |
| rotate | 旋转 |
| bounce | 弹跳 |
| shake | 摇晃 |
| pulse | 脉冲 |
| flip | 翻转 |
| custom | 自定义 |

## 🛠️ 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **TailwindCSS 3** - CSS 框架
- **Zustand** - 状态管理
- **Lucide React** - 图标库

## 📝 使用说明

1. **选择动画类型**：在左侧配置面板的"预设"标签中选择动画类型
2. **调整参数**：在"时序"标签中调整持续时间、延迟、缓动函数等参数
3. **自定义关键帧**：在"关键帧"标签中编辑关键帧属性
4. **预览效果**：在中间区域实时查看动画效果
5. **获取代码**：在右侧面板复制或导出 CSS 代码
6. **收藏动画**：点击代码区域的爱心按钮保存到收藏夹
7. **使用模板**：在底部模板库快速加载常用动画模板

## 📄 License

MIT
