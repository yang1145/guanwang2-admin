# AI 聊天功能 API 文档

本文档描述 guanwang1-backend 项目中 AI 聊天功能的后端接口，包括管理员接口和普通用户接口。

## 基础信息

- **基础 URL**: `http://localhost:3001/api/ai-chat`
- **用户接口认证方式**: `Authorization: Bearer <JWT Token>`（通过 `/api/users/login` 获取）
- **管理员接口认证方式**: 复用项目现有 `adminAuth` 中间件（当前为模拟实现，固定通过）
- **内容类型**: 所有请求体均为 `application/json`

## 默认配置

首次运行 `npm run init-db` 后，数据库会自动写入一条默认 AI 配置：

| 字段 | 默认值 |
|---|---|
| provider | `openai` |
| api_base_url | `https://api.openai.com/v1` |
| model | `gpt-3.5-turbo` |
| system_prompt | `你是一个 helpful 的助手。` |
| max_context_messages | `10` |
| daily_global_limit | `100` |
| retention_days | `30` |
| enabled | `1` |
| guest_allowed | `1` |
| guest_daily_limit | `20` |
| default_daily_limit | `50` |
| default_monthly_limit | `500` |
| default_total_limit | `0`（0 表示不限制） |
| temperature | `0.7` |
| max_tokens | `2048` |

## 错误码说明

| HTTP 状态码 | 说明 |
|---|---|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或令牌无效/过期 |
| 403 | 无权访问该资源 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁或配额已用完 |
| 500 | 服务器内部错误 |
| 503 | AI 服务调用失败 |

---

## 管理员接口

### 1. 获取 AI 配置

- **URL**: `GET /api/ai-chat/admin/config`
- **认证**: 管理员
- **响应示例**:
  ```json
  {
    "message": "AI 配置获取成功",
    "data": {
      "id": 1,
      "provider": "openai",
      "api_key": "sk-12****3456",
      "api_base_url": "https://api.openai.com/v1",
      "model": "gpt-3.5-turbo",
      "system_prompt": "你是一个 helpful 的助手。",
      "max_context_messages": 10,
      "daily_global_limit": 100,
      "retention_days": 30,
      "enabled": 1,
      "default_daily_limit": 50,
      "default_monthly_limit": 500,
      "default_total_limit": 0,
      "temperature": 0.7,
      "max_tokens": 2048,
      "created_at": "2026-07-08T00:00:00.000Z",
      "updated_at": "2026-07-08T00:00:00.000Z"
    }
  }
  ```

### 2. 更新 AI 配置

- **URL**: `PUT /api/ai-chat/admin/config`
- **认证**: 管理员
- **请求体**（以下字段均可按需部分更新）:
  ```json
  {
    "provider": "custom",
    "api_key": "your-api-key",
    "api_base_url": "https://api.deepseek.com/v1",
    "model": "deepseek-chat",
    "system_prompt": "你是科技公司的智能客服助手。",
    "max_context_messages": 10,
    "daily_global_limit": 100,
    "retention_days": 30,
    "enabled": 1,
    "guest_allowed": 1,
    "guest_daily_limit": 20,
    "default_daily_limit": 50,
    "default_monthly_limit": 500,
    "default_total_limit": 0,
    "temperature": 0.7,
    "max_tokens": 2048
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "AI 配置更新成功",
    "data": { /* 更新后的完整配置对象 */ }
  }
  ```

### 3. 立即清理聊天记录

- **URL**: `POST /api/ai-chat/admin/cleanup`
- **认证**: 管理员
- **描述**: 根据当前 `retention_days` 配置，立即删除过期消息和空会话。
- **响应示例**:
  ```json
  {
    "message": "聊天记录清理完成",
    "data": {
      "deletedMessages": 120,
      "deletedSessions": 5,
      "retentionDays": 30
    }
  }
  ```

### 4. 获取所有会话

- **URL**: `GET /api/ai-chat/admin/sessions?page=1&limit=20`
- **认证**: 管理员
- **查询参数**:
  - `page` (可选，默认 1): 页码
  - `limit` (可选，默认 20): 每页数量
- **响应示例**:
  ```json
  {
    "message": "会话列表获取成功",
    "data": [
      {
        "id": 1,
        "user_id": 2,
        "title": "产品咨询",
        "created_at": "2026-07-08T10:00:00.000Z",
        "updated_at": "2026-07-08T10:05:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
  ```

### 5. 获取某会话消息

- **URL**: `GET /api/ai-chat/admin/sessions/:id/messages`
- **认证**: 管理员
- **路径参数**:
  - `id`: 会话 ID
- **响应示例**:
  ```json
  {
    "message": "会话消息获取成功",
    "data": {
      "session": { /* 会话对象 */ },
      "messages": [
        {
          "id": 1,
          "session_id": 1,
          "user_id": 2,
          "role": "user",
          "content": "你好",
          "created_at": "2026-07-08T10:00:00.000Z"
        },
        {
          "id": 2,
          "session_id": 1,
          "user_id": 2,
          "role": "assistant",
          "content": "您好！有什么可以帮助您的？",
          "created_at": "2026-07-08T10:00:05.000Z"
        }
      ]
    }
  }
  ```

### 6. 删除会话

- **URL**: `DELETE /api/ai-chat/admin/sessions/:id`
- **认证**: 管理员
- **描述**: 删除指定会话及其下所有消息。
- **响应示例**:
  ```json
  {
    "message": "会话删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 7. 删除单条消息

- **URL**: `DELETE /api/ai-chat/admin/messages/:id`
- **认证**: 管理员
- **响应示例**:
  ```json
  {
    "message": "消息删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 8. 获取用户配额

- **URL**: `GET /api/ai-chat/admin/quotas/:userId`
- **认证**: 管理员
- **响应示例**:
  ```json
  {
    "message": "用户配额获取成功",
    "data": {
      "id": 1,
      "user_id": 2,
      "daily_limit": 50,
      "monthly_limit": 500,
      "total_limit": 0,
      "used_today": 5,
      "used_month": 20,
      "used_total": 100,
      "last_reset_date": "2026-07-08",
      "last_reset_month": "2026-07",
      "created_at": "2026-07-08T00:00:00.000Z",
      "updated_at": "2026-07-08T10:00:00.000Z"
    }
  }
  ```

### 9. 设置用户配额

- **URL**: `PUT /api/ai-chat/admin/quotas/:userId`
- **认证**: 管理员
- **请求体**（以下字段均可按需部分更新，0 表示不限制）:
  ```json
  {
    "daily_limit": 100,
    "monthly_limit": 1000,
    "total_limit": 0
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "用户配额设置成功",
    "data": { /* 更新后的配额对象 */ }
  }
  ```

---

## 用户接口

### 1. 创建会话

- **URL**: `POST /api/ai-chat/sessions`
- **认证**: 用户 JWT
- **请求体**:
  ```json
  {
    "title": "产品咨询"
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "会话创建成功",
    "data": {
      "id": 1,
      "user_id": 2,
      "title": "产品咨询"
    }
  }
  ```

### 2. 获取当前用户会话列表

- **URL**: `GET /api/ai-chat/sessions`
- **认证**: 用户 JWT
- **响应示例**:
  ```json
  {
    "message": "会话列表获取成功",
    "data": [
      {
        "id": 1,
        "user_id": 2,
        "title": "产品咨询",
        "created_at": "2026-07-08T10:00:00.000Z",
        "updated_at": "2026-07-08T10:05:00.000Z"
      }
    ]
  }
  ```

### 3. 获取当前用户某会话消息

- **URL**: `GET /api/ai-chat/sessions/:id/messages`
- **认证**: 用户 JWT
- **响应示例**:
  ```json
  {
    "message": "会话消息获取成功",
    "data": {
      "session": { /* 会话对象 */ },
      "messages": [
        {
          "id": 1,
          "role": "user",
          "content": "你好",
          "created_at": "2026-07-08T10:00:00.000Z"
        },
        {
          "id": 2,
          "role": "assistant",
          "content": "您好！有什么可以帮助您的？",
          "created_at": "2026-07-08T10:00:05.000Z"
        }
      ]
    }
  }
  ```

### 4. 发送消息

- **URL**: `POST /api/ai-chat/sessions/:id/messages`
- **认证**: 用户 JWT
- **限流**: 每用户每分钟最多 30 次
- **请求体**:
  ```json
  {
    "content": "介绍一下你们的产品"
  }
  ```
- **响应示例**:
  ```json
  {
    "message": "消息发送成功",
    "data": {
      "user_message": {
        "id": 3,
        "role": "user",
        "content": "介绍一下你们的产品"
      },
      "assistant_message": {
        "id": 4,
        "role": "assistant",
        "content": "我们提供云计算、存储、网络安全等多种产品..."
      }
    }
  }
  ```

### 5. 删除当前用户会话

- **URL**: `DELETE /api/ai-chat/sessions/:id`
- **认证**: 用户 JWT
- **响应示例**:
  ```json
  {
    "message": "会话删除成功",
    "data": {
      "id": 1
    }
  }
  ```

### 6. 获取当前用户配额

- **URL**: `GET /api/ai-chat/quota`
- **认证**: 用户 JWT
- **响应示例**:
  ```json
  {
    "message": "配额信息获取成功",
    "data": {
      "id": 1,
      "user_id": 2,
      "daily_limit": 50,
      "monthly_limit": 500,
      "total_limit": 0,
      "used_today": 5,
      "used_month": 20,
      "used_total": 100,
      "last_reset_date": "2026-07-08",
      "last_reset_month": "2026-07"
    }
  }
  ```

---

## 访客接口

访客接口允许未登录用户直接使用 AI 聊天。首次调用创建会话后会返回 `guest_token`，后续操作需要携带该令牌。

### 1. 创建访客会话

- **URL**: `POST /api/ai-chat/guest/sessions`
- **认证**: 无需认证
- **响应示例**:
  ```json
  {
    "message": "访客会话创建成功",
    "data": {
      "session_id": 1,
      "guest_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 2. 获取访客会话消息

- **URL**: `GET /api/ai-chat/guest/sessions/:id/messages`
- **认证**: `Authorization: Bearer <guest_token>`
- **说明**: 只能访问令牌对应的会话，无法访问其他会话。
- **响应示例**: 同用户接口 `/api/ai-chat/sessions/:id/messages`

### 3. 访客发送消息

- **URL**: `POST /api/ai-chat/guest/sessions/:id/messages`
- **认证**: `Authorization: Bearer <guest_token>`
- **限流**: 每会话每分钟最多 10 次
- **请求体**:
  ```json
  {
    "content": "介绍一下你们的产品"
  }
  ```
- **响应示例**: 同用户接口 `/api/ai-chat/sessions/:id/messages`

---

## 配额说明

- 用户首次调用 AI 接口时，系统会根据 `ai_config` 中的 `default_daily_limit`、`default_monthly_limit`、`default_total_limit` 自动创建配额记录。
- `daily_limit`、`monthly_limit`、`total_limit` 为 0 时表示不限制。
- 系统会自动检测日期/月份变化，并在需要时重置 `used_today` 或 `used_month`。
- 每次成功的 AI 调用会同时增加 `used_today`、`used_month`、`used_total` 三个计数器。
- 访客（未登录用户）使用单独的 `guest_daily_limit` 作为全站访客每日调用上限，不占用登录用户的 `daily_global_limit`。

## 自动清理说明

- 服务启动时会自动执行一次清理。
- 之后每 24 小时执行一次清理。
- 清理逻辑：删除 `created_at` 早于 `retention_days` 天的消息；删除 `updated_at` 早于 `retention_days` 天且没有关联消息的空会话。
- 管理员也可通过 `POST /api/ai-chat/admin/cleanup` 手动触发清理。

## 接入 AI 服务说明

- 默认支持 OpenAI 兼容的 Chat Completions 接口。
- 通过 `PUT /api/ai-chat/admin/config` 修改 `api_base_url`、`api_key`、`model` 即可切换到其他兼容服务（如 DeepSeek、Moonshot 等）。
- 请求路径固定为 `${api_base_url}/chat/completions`。
