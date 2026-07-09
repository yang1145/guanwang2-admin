# 商品管理 API 文档

## 获取所有商品

```
GET /api/goods
```

> 公开接口

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 按分类筛选 |

**成功响应** (200):

```json
{
  "message": "商品获取成功",
  "data": [
    {
      "id": 1,
      "name": "商品名称",
      "price": 99.90,
      "currency": "CNY",
      "description": "商品描述",
      "category": "分类",
      "image_url": "https://example.com/img.png",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

## 获取商品详情

```
GET /api/goods/:id
```

> 公开接口

## 创建商品

```
POST /api/goods
```

> 需要管理员 JWT

**请求体**:

```json
{
  "name": "商品名称",
  "price": 99.90,
  "currency": "CNY",
  "description": "商品描述",
  "category": "分类",
  "image_url": "https://example.com/img.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | |
| price | number | 是 | |
| currency | string | 否 | 默认 CNY，可选 USD/EUR 等 |
| description | string | 是 | |
| category | string | 是 | |
| image_url | string | 否 | |

**成功响应** (201): `{ "message": "商品创建成功", "data": { "id": 1 } }`

## 更新商品

```
PUT /api/goods/:id
```

> 需要管理员 JWT

请求体格式同创建。

## 删除商品

```
DELETE /api/goods/:id
```

> 需要管理员 JWT

**成功响应** (200): `{ "message": "商品删除成功", "data": { "id": 1 } }`
