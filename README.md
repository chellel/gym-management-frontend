# 健身房管理系统

一个基于Vue3 + TailwindCSS + Supabase的现代化健身房管理系统前端应用。

## 功能特性

- 🎨 精美的用户界面设计
- 🔐 安全的用户认证系统
- 📱 响应式设计，支持移动端
- ⚡ 基于Vue3 + Vite的快速开发体验
- 🎯 使用TailwindCSS的现代化样式
- 🔧 集成Supabase后端服务

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **样式框架**: TailwindCSS
- **路由**: Vue Router 4
- **后端服务**: Supabase
- **开发语言**: JavaScript

## 快速开始

### 安装依赖

```bash
npm install
# 或者
yarn
```

### 启动开发服务器

```bash
npm run dev
# 或者
yarn dev
```

项目将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
# 或者
yarn build
```

## 登录信息

**测试账号**
- 用户名: admin
- 密码: admin

## 项目结构

```
src/
├── components/          # 可复用组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── Login.vue       # 登录页
│   └── Welcome.vue     # 欢迎页（登录后）
├── router/             # 路由配置
├── composables/        # 组合式函数
├── style.css          # 全局样式
├── main.js            # 应用入口
├── App.vue            # 根组件
└── supabase.js        # Supabase配置
```

## 页面功能

### 首页 (/)
- 展示健身房管理系统的介绍
- 精美的Landing Page设计
- 包含功能特性展示
- 登录系统入口

### 登录页 (/login)
- 用户登录界面
- 表单验证
- 错误提示
- 支持admin/admin测试账号

### 欢迎页 (/welcome)
- 登录后的主控制台
- 快速操作面板
- 今日统计数据
- 最近活动记录
- 退出登录功能

## 开发说明

本项目使用Vue3的Composition API进行开发，配合TailwindCSS实现响应式设计。路由使用Vue Router 4，包含导航守卫来保护需要认证的页面。

Supabase集成预留了接口，当前使用本地存储模拟用户认证，可以根据实际需求替换为真实的Supabase认证服务。

## 后续开发

- [ ] 会员管理功能
- [ ] 课程管理功能  
- [ ] 教练管理功能
- [ ] 财务管理功能
- [ ] 数据报表功能
- [ ] 设备管理功能
