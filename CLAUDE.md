# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目架构

这是一个基于 Next.js 16 的前端项目，使用了现代化的技术栈和架构设计：

### 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS v4 + shadcn/ui (New York style)
- **HTTP客户端**: Axios (封装了请求/响应拦截器)
- **图标**: Lucide React
- **包管理**: npm

### 目录结构

```
src/
├── app/              # Next.js App Router 页面
├── api/              # API 接口定义和类型
│   ├── types.ts      # 通用API类型定义
│   └── user/         # 用户相关API
├── components/
│   └── ui/           # shadcn/ui 组件
├── lib/
│   ├── request.ts    # Axios 实例封装
│   └── utils.ts      # 工具函数
└── hooks/            # 自定义 Hooks (别名配置)
```

### API 架构设计

- **统一响应格式**: 所有API响应遵循 `ApiResponse<T>` 结构
- **错误处理**: 自定义 `ApiError` 类统一处理API错误
- **请求拦截**: 自动添加 Authorization token (从 localStorage 读取)
- **响应拦截**: 自动剥离响应包装，直接返回 data 部分

### shadcn/ui 配置

- **风格**: New York
- **基础颜色**: Slate
- **组件别名**:
  - `@/components` → components
  - `@/lib/utils` → utils
  - `@/components/ui` → ui
  - `@/lib` → lib
  - `@/hooks` → hooks

## 开发命令

```bash
# 开发服务器 (使用 Webpack)
npm run dev

# 构建项目 (使用 Webpack)
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 自动修复代码检查问题
npm run lint:fix

# 代码格式化
npm run format

# 检查代码格式
npm run format:check

# 类型检查
npm run type-check
```

## 代码规范

### ESLint 配置

- 使用 Next.js TypeScript 和 Core Web Vitals 配置
- 集成 Prettier 进行代码格式化
- Prettier 格式错误会作为 ESLint 错误显示
- 自动忽略 `.next/`, `out/`, `build/` 等构建目录

### Git Hooks

- 使用 Husky 和 lint-staged
- 提交前自动运行 ESLint 修复和 Prettier 格式化

## 环境变量

- `NEXT_PUBLIC_API_URL`: API 基础URL (在 request.ts 中使用)

## 开发注意事项

### API 开发

- 所有 API 调用应使用 `src/lib/request.ts` 中的 axios 实例
- 新增 API 时需要定义相应的 TypeScript 类型
- 遵循统一的响应格式和错误处理机制

### 组件开发

- 使用 shadcn/ui 作为基础组件库
- 新增组件: `npx shadcn@latest add [component-name]`
- 所有组件都应该是 `.tsx` 格式

### 样式规范

- 使用 Tailwind CSS v4 语法
- 遵循 shadcn/ui 的设计系统
- CSS 变量已启用，支持主题定制

### TypeScript 严格模式

- 项目启用了严格的类型检查
- 所有代码必须通过类型检查
- 禁止使用 `any` 类型
