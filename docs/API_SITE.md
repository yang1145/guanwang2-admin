# 网站配置与分类管理 API 文档

---

## 网站配置

### 获取网站配置

```
GET /api/site-config
```

> 公开接口

**成功响应** (200):

```json
{
  "message": "网站配置信息获取成功",
  "data": {
    "id": 1,
    "company_name": "公司名称",
    "site_url": "https://www.example.com",
    "icp_number": "京ICP备12345678号",
    "police_number": "京公网安备12345678901234号",
    "copyright_info": "版权所有 © 2024 公司名称",
    "company_description": "公司介绍内容",
    "seo_keywords": "关键词1,关键词2,关键词3",
    "site_title": "网站标题",
    "friend_links": [
      { "name": "友情链接1", "url": "https://www.link1.com" }
    ],
    "created_at": "...",
    "updated_at": "..."
  }
}
```

### 更新网站配置

```
PUT /api/site-config
```

> 需要管理员 JWT

请求体格式同获取响应中的 data 字段（所有字段可选），更新后返回更新后的完整配置。

---

## 分类管理

### 获取所有分类

```
GET /api/categories
```

> 公开接口

### 获取特定分类

```
GET /api/categories/:id
```

> 公开接口

### 创建分类

```
POST /api/categories
```

> 需要管理员 JWT

**请求体**:

```json
{
  "name": "安全",
  "description": "安全服务相关产品"
}
```

### 更新分类

```
PUT /api/categories/:id
```

> 需要管理员 JWT

### 批量更新分类列表

```
PUT /api/categories
```

> 需要管理员 JWT
> 替换整个分类列表

**请求体**:

```json
{
  "categories": [
    { "name": "计算", "description": "计算服务相关产品" },
    { "name": "存储", "description": "存储服务相关产品" }
  ]
}
```

### 同步分类表

```
POST /api/categories/sync
```

> 需要管理员 JWT
> 根据现有产品和商品数据自动同步分类表

**成功响应** (200):

```json
{
  "message": "分类表同步成功",
  "data": {
    "updatedCount": 5,
    "categories": ["计算", "存储", "网络", "数据库", "容器"]
  }
}
```

### 删除分类

```
DELETE /api/categories/:id
```

> 需要管理员 JWT
