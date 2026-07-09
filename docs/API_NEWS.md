# 新闻管理 API 文档

## 获取新闻列表

```
GET /api/news
```

> 公开接口，支持分页

**查询参数**:

| 参数 | 类型 | 默认 | 说明 |
|------|------|------|------|
| page | number | 1 | 页码 |
| limit | number | 10 | 每页数量 |

**成功响应** (200):

```json
{
  "message": "新闻获取成功",
  "data": [
    {
      "id": 1,
      "title": "新闻标题",
      "content": "新闻内容",
      "author": "作者",
      "image_url": "https://example.com/img.png",
      "views": 100,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 获取新闻详情

```
GET /api/news/:id
```

> 公开接口，访问后自动增加浏览量

## 获取热门新闻

```
GET /api/news/popular
```

> 公开接口，返回浏览量最高的新闻

## 创建新闻

```
POST /api/news
```

> 需要管理员 JWT

**请求体**:

```json
{
  "title": "新闻标题",
  "content": "新闻内容",
  "author": "作者",
  "image_url": "https://example.com/img.png"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | |
| content | string | 是 | |
| author | string | 是 | |
| image_url | string | 否 | |

**成功响应** (201): `{ "message": "新闻创建成功", "data": { "id": 1 } }`

## 更新新闻

```
PUT /api/news/:id
```

> 需要管理员 JWT

请求体格式同创建。

## 删除新闻

```
DELETE /api/news/:id
```

> 需要管理员 JWT

**成功响应** (200): `{ "message": "新闻删除成功", "data": { "id": 1 } }`
