# 用户接口 API 文档

## 注册

```
POST /api/users/register
```

用户通过手机号和邮箱进行注册。无需认证。

**请求体**:

```json
{
  "phone": "13800001111",
  "email": "user@example.com",
  "password": "yourPassword"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 唯一 |
| email | string | 是 | 唯一 |
| password | string | 是 | 至少6位 |

**成功响应** (201):

```json
{
  "message": "注册成功",
  "data": {
    "user": { "id": 1, "phone": "13800001111", "email": "user@example.com" }
  }
}
```

---

## 登录

```
POST /api/users/login
```

**请求体**:

```json
{
  "phone": "13800001111",
  "password": "yourPassword"
}
```

**成功响应** (200):

```json
{
  "message": "登录成功",
  "data": {
    "user": { "id": 1, "phone": "13800001111", "email": "user@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> token 用于需要认证的接口，通过 `Authorization: Bearer <token>` 传递。

---

## 获取用户列表

```
GET /api/users
```

> 需要管理员 JWT

**成功响应** (200):

```json
{
  "message": "用户列表获取成功",
  "data": [
    { "id": 1, "phone": "13800001111", "email": "user@example.com", "created_at": "..." }
  ]
}
```

---

## 获取特定用户

```
GET /api/users/:id
```

> 需要管理员 JWT

---

## 更新用户

```
PUT /api/users/:id
```

> 需要管理员 JWT

**请求体**:

```json
{
  "phone": "13900002222",
  "email": "new@example.com"
}
```

---

## 删除用户

```
DELETE /api/users/:id
```

> 需要管理员 JWT

**成功响应** (200): `{ "message": "用户删除成功", "data": { "id": 1 } }`

---

## 获取用户总数

```
GET /api/users/count
```

> 需要管理员 JWT

**成功响应** (200): `{ "message": "用户总数获取成功", "data": { "count": 100 } }`
