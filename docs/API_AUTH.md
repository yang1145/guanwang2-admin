# 管理员认证与权限管理 API 文档

## 概述

- **基础 URL**: `http://localhost:3001/api`
- **认证方式**: JWT (Bearer Token)，管理员登录后获取
- **默认管理员**: 用户名 `admin`，密码 `admin123`（首次初始化后建议修改）

---

## 1. 管理员认证

### 1.1 登录

```
POST /api/admin/login
```

**请求体**:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应** (200):

```json
{
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": 1,
      "username": "admin",
      "role_id": 1,
      "role_name": "超级管理员"
    },
    "permissions": [
      { "code": "admins.manage", "name": "管理员管理" },
      { "code": "tickets.manage", "name": "工单管理" }
    ]
  }
}
```

> token 有效期 24 小时。`permissions` 为当前管理员所属角色拥有的所有权限列表。

**错误响应**:
- `400` - 未提供用户名或密码
- `401` - 用户名或密码错误

### 1.2 获取当前管理员信息

```
GET /api/admin/info
```

**请求头**: `Authorization: Bearer <token>`

**成功响应** (200):

```json
{
  "message": "获取管理员信息成功",
  "data": {
    "admin": { "id": 1, "username": "admin", "role_id": 1, "role_name": "超级管理员" },
    "permissions": [...]
  }
}
```

### 1.3 修改密码

```
PUT /api/admin/change-password
```

**请求头**: `Authorization: Bearer <token>`

**请求体**:

```json
{
  "currentPassword": "admin123",
  "newPassword": "newPassword456",
  "confirmNewPassword": "newPassword456"
}
```

**错误响应**:
- `400` - 缺少字段 / 新密码不一致 / 密码不足6位 / 当前密码错误

---

## 2. 权限列表

> 所有认证管理员均可访问

### 2.1 获取所有权限

```
GET /api/admin/permissions
```

**成功响应** (200):

```json
{
  "message": "获取权限列表成功",
  "data": [
    { "id": 1, "code": "admins.manage", "name": "管理员管理", "description": "创建、编辑、删除管理员账户" },
    { "id": 2, "code": "aiChat.manage", "name": "AI聊天管理", "description": "管理AI聊天配置和会话" }
  ]
}
```

### 2.2 获取当前管理员的权限

```
GET /api/admin/permissions/mine
```

**成功响应** (200): 同上格式，仅返回当前管理员拥有的权限。

---

## 3. 管理员账户管理

> 需要 `admins.manage` 权限

### 3.1 获取所有管理员

```
GET /api/admin/accounts
```

**成功响应** (200):

```json
{
  "message": "获取管理员列表成功",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "role_id": 1,
      "role_name": "超级管理员",
      "created_at": "..."
    }
  ]
}
```

### 3.2 获取单个管理员

```
GET /api/admin/accounts/:id
```

### 3.3 创建管理员

```
POST /api/admin/accounts
```

**请求体**:

```json
{
  "username": "editor1",
  "password": "password123",
  "roleId": 2
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 唯一 |
| password | string | 是 | 至少6位 |
| roleId | number | 否 | 角色ID，不填则无角色 |

**成功响应** (201):

```json
{
  "message": "管理员创建成功",
  "data": {
    "id": 2,
    "username": "editor1",
    "role_id": 2,
    "role_name": "内容编辑",
    "created_at": "..."
  }
}
```

**错误响应**:
- `400` - 用户名/密码为空 / 密码长度不足 / 用户名已存在

### 3.4 更新管理员

```
PUT /api/admin/accounts/:id
```

**请求体** (所有字段可选):

```json
{
  "username": "newName",
  "password": "newPassword",
  "roleId": 3
}
```

> 不传的字段保持不变。密码为空则不修改密码。

### 3.5 删除管理员

```
DELETE /api/admin/accounts/:id
```

**错误响应**:
- `400` - 不能删除自己的账户
- `404` - 管理员不存在

---

## 4. 角色管理（权限组）

> 需要 `roles.manage` 权限

### 4.1 获取所有角色

```
GET /api/admin/roles
```

### 4.2 获取角色详情（含权限）

```
GET /api/admin/roles/:id
```

**成功响应** (200):

```json
{
  "message": "获取角色详情成功",
  "data": {
    "id": 1,
    "name": "超级管理员",
    "description": "拥有所有权限",
    "created_at": "...",
    "permissions": [
      { "id": 1, "code": "admins.manage", "name": "管理员管理" }
    ]
  }
}
```

### 4.3 创建角色

```
POST /api/admin/roles
```

**请求体**:

```json
{
  "name": "内容编辑",
  "description": "负责新闻和产品内容"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 唯一 |
| description | string | 否 | 角色描述 |

### 4.4 更新角色

```
PUT /api/admin/roles/:id
```

请求体同上，字段均可选。

### 4.5 删除角色

```
DELETE /api/admin/roles/:id
```

> 删除角色会同时解除该角色下所有管理员的角色关联（`role_id` 设为 NULL）。

### 4.6 为角色分配权限

```
PUT /api/admin/roles/:id/permissions
```

**请求体**:

```json
{
  "permissionIds": [3, 4, 5]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| permissionIds | number[] | 是 | 权限ID数组，**替换**该角色的所有现有权限 |

---

## 5. 系统预置权限

| 权限代码 | 名称 | 说明 |
|----------|------|------|
| `users.manage` | 用户管理 | 查看、创建、编辑、删除用户 |
| `products.manage` | 产品管理 | 查看、创建、编辑、删除产品 |
| `news.manage` | 新闻管理 | 查看、创建、编辑、删除新闻 |
| `contact.manage` | 联系我们管理 | 查看和管理联系表单消息 |
| `goods.manage` | 商品管理 | 查看、创建、编辑、删除商品 |
| `categories.manage` | 分类管理 | 查看、创建、编辑、删除分类 |
| `siteConfig.manage` | 网站配置管理 | 查看和修改网站配置 |
| `aiChat.manage` | AI聊天管理 | 管理AI聊天配置和会话 |
| `admins.manage` | 管理员管理 | 创建、编辑、删除管理员账户 |
| `roles.manage` | 角色与权限管理 | 管理角色和分配权限 |
| `tickets.manage` | 工单管理 | 管理所有部门工单（查看、回复、转交、关闭） |

---

## 6. 权限中间件用法

路由层可通过 `requirePermission` 做细粒度权限控制：

```javascript
const adminAuth = require('../middleware/adminAuth');
const { requirePermission } = require('../middleware/adminAuth');

// 仅拥有 admins.manage 权限的管理员可删除
router.delete('/:id', adminAuth, requirePermission('admins.manage'), deleteAdmin);
```

无权限时返回 `403`:

```json
{ "error": "没有操作权限" }
```
