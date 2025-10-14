# GymSys - 健身房管理系统

一个基于 Vue 3、Tailwind CSS 的现代化健身房管理系统前端应用，采用模块化架构设计，支持快速迭代和二次开发。

## 📋 项目概述

GymSys (Gym Management System) 是一个现代化的健身房管理系统，旨在为健身房提供智能化、数字化的运营管理解决方案。

### 核心特性

- 🎨 **现代化UI设计** - 响应式布局，Tailwind CSS 风格
- 🔐 **用户认证系统** - 基于 localStorage 的简单认证机制
- 🏋️ **会员管理模块** - 完整的会员 CRUD 操作
- 📅 **课程预约模块** - 在线课程预约和管理
- ⏰ **排班管理模块** - 教练排班和场地预约
- 📊 **数据可视化** - 统计信息展示和实时监控
- 🔍 **智能搜索** - 多字段搜索和筛选功能
- 📱 **移动端适配** - 完美支持移动设备访问

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.0 | 前端框架 |
| Vue Router | ^4.2.5 | 路由管理 |
| Tailwind CSS | ^3.4.0 | 样式设计 |
| Element Plus Icons | ^2.3.2 | 图标库 |
| SweetAlert2 | ^11.0.0 | 通知系统 |

## 📦 功能模块

### 1. 认证模块 (Authentication)
- **功能**: 用户登录验证
- **状态管理**: localStorage
- **测试账号**: admin/admin

### 2. 会员管理模块 (Member Management)
- **功能**:
  - 会员信息 CRUD 操作
  - 多字段搜索（姓名、会员ID、电话）
  - 会员状态筛选（活跃、过期）
  - 分页显示
  - 统计信息展示

### 3. 课程预约模块 (Class Booking)
- **功能**:
  - 展示课程列表
  - 在线课程预约
  - 查看已预约课程
  - 课程管理

### 4. 排班管理模块 (Schedule Management)
- **功能**:
  - 教练排班管理
  - 场地预约管理
  - 周视图展示

### 5. 数据报表模块 (Reports)
- **功能**:
  - 业务数据统计
  - 可视化图表展示
  - 数据导出功能

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn

### 安装和运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd gym-management-frontend

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 复制 env.example 为 .env 并填入实际值
cp env.example .env

# 4. 启动开发服务器
npm run dev

# 5. 构建生产版本
npm run build
```

### 开发规范

#### 1. 组件开发规范

- 组件文件命名：PascalCase
- 使用 `<script setup>` 语法
- 优先使用 Composition API
- 合理使用 Composables 复用逻辑

#### 2. 样式规范

- 使用 Tailwind CSS 类名
- 避免自定义 CSS，优先使用工具类
- 保持响应式设计

#### 3. API 调用规范

- 在 `services/` 目录下封装 API 调用
- 使用 try-catch 处理错误
- 提供模拟数据作为后备

## 🗄️ 数据库设计

### 主要数据表

1. **members** - 会员信息表
   - id, member_id, name, phone, email
   - join_date, expire_date, membership_type
   - created_at, updated_at

2. **classes** - 课程信息表
   - id, name, instructor, date, start_time, end_time
   - location, max_participants, current_participants
   - description, created_at

3. **bookings** - 预约记录表
   - id, class_id, member_id, booking_date
   - status, created_at

4. **schedules** - 排班信息表
   - id, trainer_id, location_id, date
   - start_time, end_time, activity, notes

## 🚀 部署指南

### 1. 环境变量配置

在 `.env` 文件中配置：

```
VITE_APP_NAME=GymSys 健身房管理系统
VITE_APP_VERSION=1.0.0
```

### 2. 构建部署

```bash
# 构建生产版本
npm run build

# 部署到静态服务器
# 将 dist/ 目录内容上传到服务器
```

## 🔧 二次开发指南

### 1. 添加新模块

1. 在 `src/views/` 下创建新的 Vue 组件
2. 在 `src/router/index.js` 中添加路由
3. 在 `src/components/Layout.vue` 中添加导航链接

### 2. 添加新数据库表

1. 创建对应的 service 文件
2. 创建对应的 composable
3. 封装 CRUD 操作

### 3. 自定义主题

修改 `tailwind.config.js` 文件中的颜色配置。

## 📊 性能优化建议

1. **代码分割** - 使用 Vue Router 的 Lazy Loading
2. **图片优化** - 使用适当的图片格式和尺寸
3. **缓存策略** - 合理设置缓存头

## 🔒 安全考虑

1. **数据验证** - 在前端和后端都进行数据验证
2. **错误处理** - 统一的错误处理机制
3. **权限控制** - 基于角色的访问控制

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 初始版本发布
- ✅ 用户认证系统
- ✅ 会员管理模块
- ✅ 课程预约模块
- ✅ 排班管理模块
- ✅ 数据报表模块
- ✅ 响应式设计
- ✅ Vue 3 + Tailwind CSS

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**GymSys 健身房管理系统** - 让健身房管理更智能 🚀