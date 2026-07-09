# 产品管理 API 文档

## 获取所有产品

```
GET /api/products
```

> 公开接口，无需认证

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 按分类筛选 |

**成功响应** (200):

```json
{
  "message": "产品获取成功",
  "data": [
    {
      "id": 1,
      "name": "产品名称",
      "description": "产品描述",
      "category": "分类",
      "image_url": "https://example.com/img.png",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

## 获取产品详情

```
GET /api/products/:id
```

> 公开接口

## 创建产品

```
POST /api/products
```

> 需要管理员 JWT

**请求体**:

```json
{
  "name": "产品名称",
  "description": "产品描述",
  "category": "分类",
  "image_url": "https://example.com/img.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | |
| description | string | 是 | |
| category | string | 是 | |
| image_url | string | 否 | 图片链接 |

**成功响应** (201): `{ "message": "产品创建成功", "data": { "id": 1 } }`

## 更新产品

```
PUT /api/products/:id
```

> 需要管理员 JWT

请求体格式同创建。

## 删除产品

```
DELETE /api/products/:id
```

> 需要管理员 JWT

**成功响应** (200): `{ "message": "产品删除成功", "data": { "id": 1 } }`
