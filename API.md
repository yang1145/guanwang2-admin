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

### 2. 用户接口

#### 用户注册
- **URL**: `POST /api/users/register`
- **描述**: 用户通过手机号和邮箱进行注册
- **请求体**:
  ```json
  {
    "phone": "手机号",
    "email": "邮箱",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "message": "注册成功",
    "data": {
      "user": {
        "id": 1,
        "phone": "手机号",
        "email": "邮箱"
      }
    }
  }
  ```

#### 用户登录
- **URL**: `POST /api/users/login`
- **描述**: 用户通过手机号和密码进行登录
- **请求体**:
  ```json
  {
    "phone": "手机号",
    "password": "密码"
  }
  ```
- **响应**:
  ```json
  {
    "message": "登录成功",
    "data": {
      "user": {
        "id": 1,
        "phone": "手机号",
        "email": "邮箱"
      },
      "token": "JWT令牌"
    }
  }
  ```

#### 获取用户列表
- **URL**: `GET /api/users`
- **描述**: 管理员获取所有用户列表
- **响应**:
  ```json
  {
    "message": "用户列表获取成功",
    "data": [
      {
        "id": 1,
        "phone": "手机号",
        "email": "邮箱",
        "created_at": "创建时间"
      }
    ]
  }
  ```

#### 获取特定用户信息
- **URL**: `GET /api/users/:id`
- **描述**: 管理员获取特定用户的详细信息
- **路径参数**:
  - `id`: 用户ID
- **响应**:
  ```json
  {
    "message": "用户信息获取成功",
    "data": {
      "id": 1,
      "phone": "手机号",
      "email": "邮箱",
      "created_at": "创建时间"
    }
  }
  ```

#### 更新用户信息
- **URL**: `PUT /api/users/:id`
- **描述**: 管理员更新指定用户的信息
- **路径参数**:
  - `id`: 用户ID
- **请求体**:
  ```json
  {
    "phone": "手机号",
    "email": "邮箱"
  }
  ```
- **响应**:
  ```json
  {
    "message": "用户信息更新成功",
    "data": {
      "id": 1,
      "phone": "手机号",
      "email": "邮箱",
      "created_at": "创建时间"
    }
  }
  ```

#### 删除用户
- **URL**: `DELETE /api/users/:id`
- **描述**: 管理员删除指定用户
- **路径参数**:
  - `id`: 用户ID
- **响应**:
  ```json
  {
    "message": "用户删除成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 获取用户总数
- **URL**: `GET /api/users/count`
- **描述**: 管理员获取用户总数
- **响应**:
  ```json
  {
    "message": "用户总数获取成功",
    "data": {
      "count": 100
    }
  }
  ```

### 3. 产品管理接口

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

### 4. 新闻管理接口

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
- **描述**: 获取浏览量最高的热门新闻
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
- **描述**: 更新指定ID的新闻
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

### 5. 联系表单接口

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

### 6. 管理员接口

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

### 6. 商品管理接口

#### 获取所有商品
- **URL**: `GET /api/goods`
- **描述**: 获取所有商品列表，支持按分类筛选
- **查询参数**:
  - `category` (可选): 商品分类筛选
- **响应**:
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
        "category": "商品分类",
        "image_url": "图片链接",
        "created_at": "创建时间"
      }
    ]
  }
  ```

#### 获取特定商品详情
- **URL**: `GET /api/goods/:id`
- **描述**: 根据ID获取特定商品的详细信息
- **路径参数**:
  - `id`: 商品ID
- **响应**:
  ```json
  {
    "message": "商品详情获取成功",
    "data": {
      "id": 1,
      "name": "商品名称",
      "price": 99.90,
      "currency": "CNY",
      "description": "商品描述",
      "category": "商品分类",
      "image_url": "图片链接",
      "created_at": "创建时间"
    }
  }
  ```

#### 创建新商品
- **URL**: `POST /api/goods`
- **描述**: 创建一个新的商品
- **请求体**:
  ```json
  {
    "name": "商品名称",
    "price": 99.90,
    "currency": "CNY", // 货币类型，如 CNY(人民币)、USD(美元)等
    "description": "商品描述",
    "category": "商品分类",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "商品创建成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 更新商品
- **URL**: `PUT /api/goods/:id`
- **描述**: 更新指定ID的商品信息
- **路径参数**:
  - `id`: 商品ID
- **请求体**:
  ```json
  {
    "name": "商品名称",
    "price": 99.90,
    "currency": "CNY",
    "description": "商品描述",
    "category": "商品分类",
    "image_url": "图片链接（可选）"
  }
  ```
- **响应**:
  ```json
  {
    "message": "商品更新成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 删除商品
- **URL**: `DELETE /api/goods/:id`
- **描述**: 删除指定ID的商品
- **路径参数**:
  - `id`: 商品ID
- **响应**:
  ```json
  {
    "message": "商品删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 7. 网站管理接口

#### 获取网站配置信息
- **URL**: `GET /api/site-config`
- **描述**: 获取网站配置信息
- **响应**:
  ```json
  {
    "message": "网站配置信息获取成功",
    "data": {
      "id": 1,
      "company_name": "公司名称",
      "site_url": "https://www.example.com",
      "icp_number": "京ICP备12345678号",
      "police_number": "京公网安备12345678901234号",
      "copyright_info": "版权所有 © 2023 公司名称",
      "company_description": "公司介绍内容",
      "seo_keywords": "关键词1,关键词2,关键词3",
      "site_title": "网站标题",
      "friend_links": [
        {
          "name": "友情链接1",
          "url": "https://www.link1.com"
        }
      ],
      "created_at": "创建时间",
      "updated_at": "更新时间"
    }
  }
  ```

### 8. 分类管理接口

#### 获取所有分类
- **URL**: `GET /api/categories`
- **描述**: 获取所有分类列表
- **响应**:
  ```json
  {
    "message": "分类列表获取成功",
    "data": [
      {
        "id": 1,
        "name": "计算",
        "description": "计算服务相关产品",
        "created_at": "创建时间",
        "updated_at": "更新时间"
      },
      {
        "id": 2,
        "name": "存储",
        "description": "存储服务相关产品",
        "created_at": "创建时间",
        "updated_at": "更新时间"
      }
    ]
  }
  ```

#### 获取特定分类
- **URL**: `GET /api/categories/:id`
- **描述**: 根据ID获取特定分类
- **路径参数**:
  - `id`: 分类ID
- **响应**:
  ```json
  {
    "message": "分类获取成功",
    "data": {
      "id": 1,
      "name": "计算",
      "description": "计算服务相关产品",
      "created_at": "创建时间",
      "updated_at": "更新时间"
    }
  }
  ```

#### 创建分类
- **URL**: `POST /api/categories`
- **描述**: 创建新分类
- **请求体**:
  ```json
  {
    "name": "安全",
    "description": "安全服务相关产品"
  }
  ```
- **响应**:
  ```json
  {
    "message": "分类创建成功",
    "data": {
      "id": 3
    }
  }
  ```

#### 更新分类
- **URL**: `PUT /api/categories/:id`
- **描述**: 更新特定分类
- **路径参数**:
  - `id`: 分类ID
- **请求体**:
  ```json
  {
    "name": "网络安全",
    "description": "网络安全服务相关产品"
  }
  ```
- **响应**:
  ```json
  {
    "message": "分类更新成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 更新分类列表
- **URL**: `PUT /api/categories`
- **描述**: 更新分类列表（替换整个分类列表）
- **请求体**:
  ```json
  {
    "categories": [
      {
        "name": "计算",
        "description": "计算服务相关产品"
      },
      {
        "name": "存储",
        "description": "存储服务相关产品"
      },
      {
        "name": "网络",
        "description": "网络服务相关产品"
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "message": "分类列表更新成功",
    "data": {
      "updatedCount": 3
    }
  }
  ```

#### 同步分类表
- **URL**: `POST /api/categories/sync`
- **描述**: 根据现有产品和商品数据同步分类表
- **响应**:
  ```json
  {
    "message": "分类表同步成功",
    "data": {
      "updatedCount": 5,
      "categories": ["计算", "存储", "网络", "数据库", "容器"]
    }
  }
  ```

#### 删除分类
- **URL**: `DELETE /api/categories/:id`
- **描述**: 删除特定分类
- **路径参数**:
  - `id`: 分类ID
- **响应**:
  ```json
  {
    "message": "分类删除成功",
    "data": {
      "id": 1
    }
  }
  ```

#### 更新网站配置信息
- **URL**: `PUT /api/site-config`
- **描述**: 管理员更新网站配置信息
- **请求体**:
  ```json
  {
    "company_name": "公司名称",
    "site_url": "https://www.example.com",
    "icp_number": "京ICP备12345678号",
    "police_number": "京公网安备12345678901234号",
    "copyright_info": "版权所有 © 2023 公司名称",
    "company_description": "公司介绍内容",
    "seo_keywords": "关键词1,关键词2,关键词3",
    "site_title": "网站标题",
    "friend_links": [
      {
        "name": "友情链接1",
        "url": "https://www.link1.com"
      }
    ]
  }
  ```
- **响应**:
  ```json
  {
    "message": "网站配置信息更新成功",
    "data": {
      "id": 1,
      "company_name": "公司名称",
      "site_url": "https://www.example.com",
      "icp_number": "京ICP备12345678号",
      "police_number": "京公网安备12345678901234号",
      "copyright_info": "版权所有 © 2023 公司名称",
      "company_description": "公司介绍内容",
      "seo_keywords": "关键词1,关键词2,关键词3",
      "site_title": "网站标题",
      "friend_links": [
        {
          "name": "友情链接1",
          "url": "https://www.link1.com"
        }
      ],
      "created_at": "创建时间",
      "updated_at": "更新时间"
    }
  }
  ```