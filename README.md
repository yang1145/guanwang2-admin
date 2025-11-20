# 官网后台管理系统

这是一个基于 Vue 3 + Vite 构建的后台管理系统，用于管理官网的内容和配置。

## 功能模块

- 管理员登录认证
- 产品分类管理
- 产品信息管理
- 新闻资讯管理
- 用户留言管理
- 注册用户管理
- 网站配置管理
- 管理员密码修改

## 技术栈

- [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 新一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
- [Vue Router](https://router.vuejs.org/) - Vue.js 的官方路由管理器
- [Pinia](https://pinia.vuejs.org/) - Vue 的轻量级状态管理库
- [Axios](https://axios-http.com/) - 基于 promise 的 HTTP 库

## 项目结构

```
src/
├── api/                 # API 接口封装
├── components/          # 公共组件
├── router/              # 路由配置
├── views/               # 页面视图
├── App.vue             # 根组件
├── main.js             # 入口文件
└── style.css           # 全局样式
```

## 页面功能说明

### 登录页面 (/login)
管理员登录入口，提供用户名和密码验证功能。

### 管理首页 (/admin)
登录后的主界面，包含侧边栏菜单和顶部导航。

### 分类管理 (/admin/categories)
管理产品分类信息：
- 查看所有分类列表
- 添加新的分类
- 编辑现有分类
- 删除分类

### 产品管理 (/admin/products)
管理产品信息：
- 查看所有产品列表
- 添加新产品
- 编辑产品信息
- 删除产品

### 新闻管理 (/admin/news)
管理新闻资讯：
- 查看新闻列表（带分页）
- 添加新闻
- 编辑新闻内容
- 删除新闻

### 联系信息管理 (/admin/contact)
管理用户提交的联系信息：
- 查看所有留言信息
- 删除不需要的留言

### 用户管理 (/admin/users)
管理注册用户：
- 查看所有注册用户
- 删除违规用户

### 网站设置 (/admin/settings)
管理网站基本配置：
- 公司基本信息设置
- SEO优化配置
- 备案信息维护
- 友情链接管理

### 修改密码 (/admin/change-password)
修改管理员账户密码：
- 输入当前密码
- 设置新密码并确认

## 开发环境搭建

### 环境要求

- Node.js >= 16.0
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

## 环境变量配置

项目支持通过环境变量配置 API 接口地址：

- `VITE_API_BASE_URL`: API 接口基础地址

环境变量文件：
- `.env.local`: 本地开发环境配置
- `.env.production`: 生产环境配置

## Vercel 部署支持

项目已添加 Vercel 部署支持，配置文件为 `vercel.json`。

部署到 Vercel 时，请确保在项目设置中配置环境变量：
- `VITE_API_BASE_URL`: 生产环境的 API 地址

## API 接口

本项目通过 Axios 与后端进行数据交互，接口定义在 `src/api/` 目录下：

- 管理员相关：`src/api/admin.js`
- 分类管理：`src/api/categories.js`
- 联系信息：`src/api/contact.js`
- 商品管理：`src/api/goods.js`
- 新闻管理：`src/api/news.js`
- 产品管理：`src/api/products.js`
- 网站配置：`src/api/siteConfig.js`
- 用户管理：`src/api/users.js`

## 注意事项

1. 本项目需配合后端服务使用，不能独立运行
2. 所有数据均从真实后端接口获取，不使用模拟数据
3. 系统采用响应式设计，适配不同屏幕尺寸
4. 使用 Element Plus 组件库保证界面的一致性和美观性

## 浏览器支持

- Chrome >= 80
- Firefox >= 70
- Safari >= 13
- Edge >= 80