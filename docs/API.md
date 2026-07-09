# 科技企业官网后端 API 文档

基于 Node.js + Express 构建，支持 SQLite / MySQL / PostgreSQL 三种数据库。

- **基础 URL**: `http://localhost:3001/api`
- **认证方式**: 用户 JWT（`/api/users/login`）、管理员 JWT（`/api/admin/login`）

---

## 文档索引

| 文档 | 说明 |
|------|------|
| [API_USERS.md](API_USERS.md) | 用户接口：注册、登录、管理 |
| [API_PRODUCTS.md](API_PRODUCTS.md) | 产品管理：CRUD + 分类筛选 |
| [API_GOODS.md](API_GOODS.md) | 商品管理：CRUD + 分类筛选 |
| [API_NEWS.md](API_NEWS.md) | 新闻管理：CRUD + 分页 + 热门 |
| [API_CONTACT.md](API_CONTACT.md) | 联系表单：提交 + 管理端查看 |
| [API_SITE.md](API_SITE.md) | 网站配置 + 分类管理 |
| [API_AUTH.md](API_AUTH.md) | 管理员认证、账户管理、权限与角色 |
| [API_TICKET.md](API_TICKET.md) | 工单系统：用户提交、管理员受理、回复、转交、关闭 |

---

## 通用接口

### 服务状态检查

```
GET /api
```

**响应**: `{ "message": "欢迎使用科技企业官网API" }`
