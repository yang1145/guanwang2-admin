# 工单系统 API 文档

## 概述

- **基础 URL**: `http://localhost:3001/api`
- **认证方式**: 用户端使用 JWT (通过 `/api/users/login` 获取)，管理端使用管理员 JWT (通过 `/api/admin/login` 获取)

---

## 1. 工单部门

### 1.1 获取部门列表（公开）

```
GET /api/admin/ticket-departments/public
```

用户端提交工单时获取可选部门，无需认证。

**成功响应** (200):

```json
{
  "message": "获取部门列表成功",
  "data": [
    { "id": 1, "name": "技术支持", "description": "技术问题、系统故障、功能咨询", "created_at": "..." },
    { "id": 2, "name": "售后服务", "description": "退换货、维修、服务投诉", "created_at": "..." }
  ]
}
```

### 1.2 管理端部门 CRUD

> 需要管理员 JWT

```
GET    /api/admin/ticket-departments           # 列表
GET    /api/admin/ticket-departments/:id       # 详情
POST   /api/admin/ticket-departments           # 创建 { "name": "...", "description": "..." }
PUT    /api/admin/ticket-departments/:id       # 更新
DELETE /api/admin/ticket-departments/:id       # 删除
```

---

## 2. 用户端 API

> 所有接口需要 `Authorization: Bearer <user_token>`（通过 `/api/users/login` 获取）

### 2.1 提交工单

```
POST /api/tickets
```

**请求体**:

```json
{
  "departmentId": 1,
  "urgency": "high",
  "title": "网站无法访问",
  "content": "打开网站一直显示502错误，已经持续半小时了"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| departmentId | number | 是 | 部门ID，通过部门列表接口获取 |
| urgency | string | 是 | `low` / `medium` / `high` / `urgent` |
| title | string | 是 | 工单标题 |
| content | string | 是 | 详细内容 |

**成功响应** (201):

```json
{
  "message": "工单提交成功",
  "data": {
    "ticket": {
      "id": 1,
      "user_id": 1,
      "department_id": 1,
      "department_name": "技术支持",
      "urgency": "high",
      "title": "网站无法访问",
      "content": "...",
      "status": "pending",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    },
    "replies": []
  }
}
```

### 2.2 获取我的工单列表

```
GET /api/tickets?page=1&limit=20&status=pending
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认20 |
| status | string | 否 | `pending` / `replied` / `closed` |

**成功响应** (200):

```json
{
  "message": "获取工单列表成功",
  "rows": [
    {
      "id": 1,
      "department_name": "技术支持",
      "urgency": "high",
      "title": "网站无法访问",
      "status": "pending",
      "reply_count": 0,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 2.3 获取工单详情

```
GET /api/tickets/:id
```

**成功响应** (200):

```json
{
  "message": "获取工单详情成功",
  "data": {
    "ticket": {
      "id": 1,
      "department_name": "技术支持",
      "urgency": "high",
      "title": "网站无法访问",
      "content": "详细描述...",
      "status": "replied",
      "created_at": "...",
      "updated_at": "..."
    },
    "replies": [
      {
        "id": 1,
        "reply_type": "admin",
        "admin_username": "admin",
        "content": "我们正在排查，请稍候",
        "created_at": "..."
      },
      {
        "id": 2,
        "reply_type": "user",
        "user_phone": "138****1111",
        "content": "好的，谢谢",
        "created_at": "..."
      }
    ]
  }
}
```

**错误响应**:
- `403` - 无权查看（非本人提交）
- `404` - 工单不存在

### 2.4 回复工单

```
POST /api/tickets/:id/reply
```

**请求体**:

```json
{
  "content": "补充一些信息..."
}
```

**成功响应** (200):

```json
{
  "message": "回复成功",
  "data": {
    "ticket": { "id": 1, "status": "replied", ... },
    "replies": [...]
  }
}
```

**错误响应**:
- `400` - 内容不能为空 / 工单已关闭
- `403` - 无权操作（非本人）
- `404` - 工单不存在

### 2.5 关闭工单

```
PUT /api/tickets/:id/close
```

**成功响应** (200): `{ "message": "工单已关闭" }`

**错误响应**:
- `400` - 工单已关闭
- `403` - 无权操作（非本人）

---

## 3. 管理端 API

> 所有接口需要 `Authorization: Bearer <admin_token>`（通过 `/api/admin/login` 获取）

### 3.1 获取工单列表

```
GET /api/admin/tickets?page=1&limit=20&status=pending&departmentId=1&urgency=high&search=关键词
```

| 参数 | 类型 | 说明 |
|------|------|------|
| page | number | 页码，默认1 |
| limit | number | 每页数量，默认20 |
| status | string | `pending` / `replied` / `closed` |
| departmentId | number | 部门ID筛选 |
| urgency | string | `low` / `medium` / `high` / `urgent` |
| search | string | 标题/内容关键词搜索 |

> **权限控制**：拥有 `tickets.manage` 权限 → 查看所有部门；否则仅查看 `admin_departments` 表分配的部门。

**成功响应** (200):

```json
{
  "message": "获取工单列表成功",
  "rows": [
    {
      "id": 1,
      "user_id": 1,
      "user_phone": "13800001111",
      "user_email": "test@test.com",
      "department_id": 1,
      "department_name": "技术支持",
      "urgency": "high",
      "urgency_order": 3,
      "title": "网站无法访问",
      "content": "...",
      "status": "pending",
      "assigned_admin_id": null,
      "assigned_admin_name": null,
      "reply_count": 0,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### 3.2 获取工单详情

```
GET /api/admin/tickets/:id
```

**成功响应** (200):

```json
{
  "message": "获取工单详情成功",
  "data": {
    "ticket": { "id": 1, "user_phone": "13800001111", "user_email": "test@test.com", "assigned_admin_name": "admin", ... },
    "replies": [...],
    "transfers": [
      {
        "id": 1,
        "from_department_name": "技术支持",
        "to_department_name": "商务合作",
        "from_admin_name": "admin",
        "reason": "属于商务合作范畴",
        "created_at": "..."
      }
    ]
  }
}
```

### 3.3 回复工单

```
POST /api/admin/tickets/:id/reply
```

**请求体**: `{ "content": "我们正在处理您的问题" }`

> 管理员首次回复时，系统自动将 `assigned_admin_id` 设置为该管理员（即自动接手）。

### 3.4 接手工单

```
PUT /api/admin/tickets/:id/assign
```

将当前登录管理员设为工单负责人。无请求体。

**成功响应**: `{ "message": "已接手工单", "data": { "ticket": {...} } }`

### 3.5 转交工单

```
PUT /api/admin/tickets/:id/transfer
```

**请求体**:

```json
{
  "departmentId": 3,
  "assignedAdminId": 5,
  "reason": "该问题属于商务合作部门处理范畴"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| departmentId | number | 否 | 目标部门ID |
| assignedAdminId | number | 否 | 目标管理员ID |
| reason | string | 否 | 转交原因 |

> `departmentId` 和 `assignedAdminId` 至少提供一个。转交记录会写入 `ticket_transfers` 表。

### 3.6 关闭工单

```
PUT /api/admin/tickets/:id/close
```

**成功响应**: `{ "message": "工单已关闭" }`

### 3.7 工单统计

```
GET /api/admin/tickets/stats
```

**成功响应** (200):

```json
{
  "message": "获取工单统计成功",
  "data": [
    { "status": "pending", "count": 3 },
    { "status": "replied", "count": 5 },
    { "status": "closed", "count": 12 }
  ]
}
```

---

## 4. 状态流转

```
用户提交 → [pending 待受理]
    ↓ 管理员首次回复
 [replied 已回复] ←→ 用户/管理员可继续回复
    ↓ 任一方关闭
 [closed 已关闭] （不可再回复）
```

| 状态 | 含义 | 可回复 | 可关闭 |
|------|------|--------|--------|
| `pending` | 待受理，尚无管理员回复 | 用户/管理员 | 用户/管理员 |
| `replied` | 已回复，对话进行中 | 用户/管理员 | 用户/管理员 |
| `closed` | 已关闭 | 否 | 否 |

---

## 5. 部门权限模型

管理员能查看/操作哪些工单由两个维度决定：

| 条件 | 可见范围 |
|------|----------|
| 拥有 `tickets.manage` 权限 | 所有部门 |
| `admin_departments` 表中有部门分配 | 仅已分配部门 |
| 两者都无 | 无可操作工单 |

**示例**：创建"技术支持专员"角色，不赋 `tickets.manage` 权限，将该管理员添加到 `admin_departments` 的 `department_id=1`，则其只能处理技术支持部门的工单。
