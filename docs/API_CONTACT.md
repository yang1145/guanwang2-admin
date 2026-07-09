# 联系表单 API 文档

## 提交联系表单

```
POST /api/contact
```

> 公开接口，无需认证

**请求体**:

```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800001111",
  "message": "我想了解你们的产品"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | |
| email | string | 是 | |
| phone | string | 否 | |
| message | string | 是 | |

**成功响应** (201): `{ "message": "留言提交成功", "data": { "id": 1 } }`

---

## 获取所有联系信息

```
GET /api/contact
```

> 需要管理员 JWT

**成功响应** (200):

```json
{
  "message": "联系信息获取成功",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "phone": "13800001111",
      "message": "我想了解你们的产品",
      "created_at": "..."
    }
  ]
}
```

---

## 获取特定联系信息

```
GET /api/contact/:id
```

> 需要管理员 JWT
