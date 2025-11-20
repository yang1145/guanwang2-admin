# 科技企业官网后端API文档

这是一个基于 Node.js + Express + MySQL 构建的后端系统，为科技企业官网提供API接口。

## 基础信息

- **基础URL**: `http://localhost:3001/api`
- **认证方式**: 管理员接口需要通过认证中间件

## API接口列表

### 1. 通用接口

#### 获取API状态
- **URL**: `GET /api`
- **描述**: 检查API服务是否正常运行
- **响应**: 
  ```json
  {
    "message": "欢迎使用科技企业官网API"
  }
  ```

### 2. 产品管理接口

#### 获取所有产品
- **URL**: `GET /api/products`
- **描述**: 获取所有产品列表，支持按分类筛选
- **查询参数**:
  - `category` (可选): 产品分类筛选
- **响应**:
  ```json
  {
    "message": "产品获取成功",
    "data": [
      {
        "id": 1,
        "name": "产品名称",
        "description": "产品描述",
        "category": "产品分类",
        "image_url": "图片链接",
        "created_at": "创建时间"
      }
    ]
  }
  ```

#### 获取特定产品详情
- **URL**: `GET /api/products/:id`
- **描述**: 根据ID获取特定产品的详细信息
- **路径参数**:
  - `id`: 产品ID
- **响应**:
  ```json
  {
    "message": "产品详情获取成功",
    "data": {
      "id": 1,
      "name": "产品名称",
      "description": "产品描述",
      "category": "产品分类",
      "image_url": "图片链接",
      "created_at": "创建时间"
    }
  }
  ```

#### 创建新产品
- **URL**: `POST /api/products`
- **描述**: 创建一个新的产品
- **请求体**:
  ```json
  {
    "name": "产品名称",
    "description": "产品描述",
    "category": "产品分类",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "产品创建成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 更新产品
- **URL**: `PUT /api/products/:id`
- **描述**: 更新指定ID的产品信息
- **路径参数**:
  - `id`: 产品ID
- **请求体**:
  ```json
  {
    "name": "产品名称",
    "description": "产品描述",
    "category": "产品分类",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "产品更新成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 删除产品
- **URL**: `DELETE /api/products/:id`
- **描述**: 删除指定ID的产品
- **路径参数**:
  - `id`: 产品ID
- **响应**:
  ```json
  {
    "message": "产品删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 3. 新闻管理接口

#### 获取所有新闻
- **URL**: `GET /api/news`
- **描述**: 分页获取所有新闻列表
- **查询参数**:
  - `page` (可选，默认1): 页码
  - `limit` (可选，默认10): 每页数量
- **响应**:
  ```json
  {
    "message": "新闻获取成功",
    "data": [
      {
        "id": 1,
        "title": "新闻标题",
        "content": "新闻内容",
        "author": "作者",
        "image_url": "图片链接",
        "views": 0,
        "created_at": "创建时间"
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

#### 获取特定新闻详情
- **URL**: `GET /api/news/:id`
- **描述**: 根据ID获取特定新闻的详细信息，并增加浏览量
- **路径参数**:
  - `id`: 新闻ID
- **响应**:
  ```json
  {
    "message": "新闻详情获取成功",
    "data": {
      "id": 1,
      "title": "新闻标题",
      "content": "新闻内容",
      "author": "作者",
      "image_url": "图片链接",
      "views": 1,
      "created_at": "创建时间"
    }
  }
  ```

#### 获取热门新闻
- **URL**: `GET /api/news/popular`
- **描述**: 获取浏览量最高的热门新闻（默认5条）
- **响应**:
  ```json
  {
    "message": "热门新闻获取成功",
    "data": [
      {
        "id": 1,
        "title": "新闻标题",
        "content": "新闻内容",
        "author": "作者",
        "image_url": "图片链接",
        "views": 100,
        "created_at": "创建时间"
      }
    ]
  }
  ```

#### 创建新闻
- **URL**: `POST /api/news`
- **描述**: 创建一条新的新闻
- **请求体**:
  ```json
  {
    "title": "新闻标题",
    "content": "新闻内容",
    "author": "作者",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "新闻创建成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 更新新闻
- **URL**: `PUT /api/news/:id`
- **描述**: 更新指定ID的新闻信息
- **路径参数**:
  - `id`: 新闻ID
- **请求体**:
  ```json
  {
    "title": "新闻标题",
    "content": "新闻内容",
    "author": "作者",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "新闻更新成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 删除新闻
- **URL**: `DELETE /api/news/:id`
- **描述**: 删除指定ID的新闻
- **路径参数**:
  - `id`: 新闻ID
- **响应**:
  ```json
  {
    "message": "新闻删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 4. 联系表单接口

#### 提交联系表单
- **URL**: `POST /api/contact`
- **描述**: 用户提交联系表单
- **请求体**:
  ```json
  {
    "name": "姓名",
    "email": "邮箱",
    "phone": "电话（可选）",
    "message": "留言内容"
  }
  ```
- **响应**:
  ```json
  {
    "message": "留言提交成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 获取所有联系信息
- **URL**: `GET /api/contact`
- **描述**: 管理员获取所有用户的联系信息
- **响应**:
  ```json
  {
    "message": "联系信息获取成功",
    "data": [
      {
        "id": 1,
        "name": "姓名",
        "email": "邮箱",
        "phone": "电话",
        "message": "留言内容",
        "created_at": "创建时间"
      }
    ]
  }
  ```

#### 获取特定联系信息
- **URL**: `GET /api/contact/:id`
- **描述**: 管理员获取特定联系信息
- **路径参数**:
  - `id`: 联系信息ID
- **响应**:
  ```json
  {
    "message": "联系信息获取成功",
    "data": {
      "id": 1,
      "name": "姓名",
      "email": "邮箱",
      "phone": "电话",
      "message": "留言内容",
      "created_at": "创建时间"
    }
  }
  ```

### 5. 管理员接口

#### 管理员登录
- **URL**: `POST /api/admin/login`
- **描述**: 管理员登录验证
- **请求体**:
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "message": "登录成功",
    "data": {
      "admin": {
        "id": 1,
        "username": "用户名"
      }
    }
  }
  ```

#### 获取管理员信息
- **URL**: `GET /api/admin/info/:username`
- **描述**: 获取指定管理员的信息（测试用）
- **路径参数**:
  - `username`: 管理员用户名
- **响应**:
  ```json
  {
    "data": {
      "id": 1,
      "username": "用户名",
      "created_at": "创建时间"
    }
  }
  ```

#### 修改管理员密码
- **URL**: `PUT /api/admin/change-password`
- **描述**: 管理员修改密码
- **请求体**:
  ```json
  {
    "currentPassword": "当前密码",
    "newPassword": "新密码",
    "confirmNewPassword": "确认新密码"
  }
  ```
- **响应**:
  ```json
  {
    "message": "密码修改成功"
  }
  ```

## 错误响应格式

所有错误响应遵循统一格式：
```json
{
  "error": "错误信息"
}
```

常见HTTP状态码：
- `400`: 请求参数错误
- `401`: 认证失败
- `404`: 资源未找到
- `500`: 服务器内部错误