# 本地开发指南

## 运行环境要求

| 工具     | 最低版本 |
| -------- | -------- |
| Node.js  | >= 20    |
| npm      | >= 9     |

> 建议使用 LTS 版本的 Node.js。可通过 `node -v` 和 `npm -v` 检查当前版本。

## 快速开始

### 1. 克隆项目

```bash
git clone <仓库地址>
cd bird-sighting-app
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

启动后访问 http://localhost:5101 即可查看应用。

### 4. 生产构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。构建过程包含类型检查（`vue-tsc`）和 Vite 打包两个阶段，任一阶段失败都会终止构建。

### 5. 预览生产构建

```bash
npm run preview
```

在本地启动一个静态服务器预览 `dist/` 目录中的构建产物。

## 常见问题

### 类型检查报错

确保所有 `.ts` 和 `.vue` 文件中的类型定义正确。本地可单独运行类型检查：

```bash
npx vue-tsc --noEmit
```

### 依赖安装失败

删除 `node_modules` 和 `package-lock.json` 后重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```
