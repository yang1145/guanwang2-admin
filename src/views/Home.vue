<template>
  <div class="dashboard-container">
    <!-- 顶部欢迎区 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h2 class="welcome-title">{{ greeting }}，管理员</h2>
        <p class="welcome-desc">{{ currentDate }} · 今天是 {{ weekDay }}</p>
      </div>
      <div class="header-right">
        <div class="api-status" :class="{ 'is-online': apiOnline, 'is-offline': !apiOnline }">
          <span class="status-dot"></span>
          <span class="status-text">{{ apiOnline ? '系统运行正常' : '连接异常' }}</span>
        </div>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="24" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card-item" v-loading="loading">
          <div class="stat-card-header">
            <span class="stat-card-title">{{ item.title }}</span>
            <el-tag :type="item.trendType" size="small" effect="plain" v-if="item.trend">
              {{ item.trend }}
            </el-tag>
          </div>
          <div class="stat-card-body">
            <div class="stat-card-value">{{ item.value }}</div>
            <div class="stat-card-icon" :class="item.iconClass">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
          </div>
          <div class="stat-card-footer">
            <span>{{ item.footerLabel }}</span>
            <span class="footer-value">{{ item.total }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口与待办提醒 -->
    <el-row :gutter="24" class="main-content">
      <!-- 左侧内容 -->
      <el-col :xs="24" :lg="16">
        <!-- 快捷导航 -->
        <el-card shadow="hover" class="mb-24 nav-card">
          <template #header>
            <div class="card-header">
              <span>快捷导航</span>
            </div>
          </template>
          <div class="quick-nav">
            <div class="nav-item" @click="$router.push('/admin/products')">
              <div class="nav-icon bg-blue"><el-icon><Box /></el-icon></div>
              <span>产品管理</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/news')">
              <div class="nav-icon bg-green"><el-icon><Document /></el-icon></div>
              <span>新闻发布</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/users')">
              <div class="nav-icon bg-orange"><el-icon><User /></el-icon></div>
              <span>用户管理</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/contacts')">
              <div class="nav-icon bg-purple"><el-icon><ChatDotRound /></el-icon></div>
              <span>留言查看</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/site-settings')">
              <div class="nav-icon bg-cyan"><el-icon><Setting /></el-icon></div>
              <span>系统设置</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/categories')">
              <div class="nav-icon bg-pink"><el-icon><Files /></el-icon></div>
              <span>分类管理</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/ai-chat')">
              <div class="nav-icon bg-purple"><el-icon><ChatDotRound /></el-icon></div>
              <span>AI 聊天控制</span>
            </div>
            <div class="nav-item" @click="$router.push('/admin/ai-chat-test')">
              <div class="nav-icon bg-indigo"><el-icon><ChatLineRound /></el-icon></div>
              <span>AI 聊天测试</span>
            </div>
          </div>
        </el-card>

        <!-- 数据分布 -->
        <el-card shadow="hover" class="mb-24">
          <template #header>
            <div class="card-header">
              <span>数据概览</span>
              <span class="card-subtitle">各模块数据汇总</span>
            </div>
          </template>
          <div class="overview-list">
            <div class="overview-item" v-for="(item, index) in overviewItems" :key="index">
              <div class="overview-info">
                <div class="overview-title">{{ item.title }}</div>
                <div class="overview-desc">{{ item.desc }}</div>
              </div>
              <div class="overview-value" :class="item.valueClass">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :lg="8">
        <!-- 待办提醒 -->
        <el-card shadow="hover" class="mb-24">
          <template #header>
            <div class="card-header">
              <span>待办提醒</span>
              <el-tag v-if="pendingTotal > 0" type="danger" size="small">{{ pendingTotal }} 项</el-tag>
            </div>
          </template>
          <div class="todo-list">
            <div class="todo-item" v-for="(todo, index) in todoList" :key="index" @click="$router.push(todo.path)">
              <div class="todo-icon" :class="todo.iconClass">
                <el-icon><component :is="todo.icon" /></el-icon>
              </div>
              <div class="todo-content">
                <div class="todo-title">{{ todo.title }}</div>
                <div class="todo-desc">{{ todo.desc }}</div>
              </div>
              <el-tag :type="todo.tagType" size="small" class="todo-tag">{{ todo.count }}</el-tag>
            </div>
            <el-empty v-if="pendingTotal === 0" description="暂无待办事项" :image-size="60" />
          </div>
        </el-card>

        <!-- 帮助文档 -->
        <el-card shadow="hover" class="mb-24">
          <template #header>
            <div class="card-header">
              <span>帮助文档</span>
            </div>
          </template>
          <div class="help-list">
            <a class="help-item" @click="$router.push('/admin/help?section=products')">
              <el-icon><QuestionFilled /></el-icon>
              <span>如何发布新产品？</span>
            </a>
            <a class="help-item" @click="$router.push('/admin/help?section=users')">
              <el-icon><QuestionFilled /></el-icon>
              <span>如何管理用户权限？</span>
            </a>
            <a class="help-item" @click="$router.push('/admin/help?section=settings')">
              <el-icon><QuestionFilled /></el-icon>
              <span>系统配置说明</span>
            </a>
          </div>
        </el-card>

        <!-- 版本信息 -->
        <el-card shadow="hover" class="version-card">
          <div class="version-info">
            <img src="@/assets/vue.svg" alt="Vue" class="version-logo" />
            <div class="version-text">
              <h3>GuanWang Admin</h3>
              <p>当前版本 v1.0.0</p>
            </div>
          </div>
          <el-divider />
          <div class="tech-stack">
            <el-tag size="small">Vue 3</el-tag>
            <el-tag size="small" type="success">Vite</el-tag>
            <el-tag size="small" type="warning">Element Plus</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { 
  User, Document, Box, ChatDotRound, ChatLineRound, Setting, Files,
  QuestionFilled
} from '@element-plus/icons-vue'
import { getProducts } from '@/api/products'
import { getNews } from '@/api/news'
import { getContactMessages } from '@/api/contact'
import { getUserCount } from '@/api/users'

const loading = ref(true)
const apiOnline = ref(false)

// 待处理数据
const pendingData = reactive({
  contacts: 0,
  unreadContacts: 0
})

// 实时数据
const dashboardData = reactive({
  users: 0,
  products: 0,
  news: 0,
  contacts: 0
})

// 统计卡片数据
const statCards = reactive([
  {
    title: '用户数',
    value: '0',
    total: '0',
    footerLabel: '总用户数',
    trend: '',
    trendType: 'warning',
    icon: User,
    iconClass: 'text-purple'
  },
  {
    title: '产品数',
    value: '0',
    total: '0',
    footerLabel: '总产品数',
    trend: '',
    trendType: 'primary',
    icon: Box,
    iconClass: 'text-orange'
  },
  {
    title: '新闻数',
    value: '0',
    total: '0',
    footerLabel: '总新闻数',
    trend: '',
    trendType: 'success',
    icon: Document,
    iconClass: 'text-green'
  },
  {
    title: '留言数',
    value: '0',
    total: '0',
    footerLabel: '总留言数',
    trend: '',
    trendType: 'success',
    icon: ChatDotRound,
    iconClass: 'text-blue'
  }
])

// 数据概览
const overviewItems = computed(() => [
  {
    title: '内容总量',
    desc: '产品 + 新闻',
    value: dashboardData.products + dashboardData.news,
    valueClass: 'text-primary'
  },
  {
    title: '用户互动',
    desc: '留言总数',
    value: dashboardData.contacts,
    valueClass: 'text-success'
  },
  {
    title: '注册用户',
    desc: '后台用户',
    value: dashboardData.users,
    valueClass: 'text-warning'
  },
  {
    title: '待处理留言',
    desc: '需尽快回复',
    value: pendingData.unreadContacts,
    valueClass: pendingData.unreadContacts > 0 ? 'text-danger' : 'text-secondary'
  }
])

// 待办列表
const todoList = computed(() => [
  {
    title: '未处理留言',
    desc: '等待回复的客户咨询',
    count: pendingData.unreadContacts,
    icon: ChatDotRound,
    iconClass: 'bg-purple',
    tagType: pendingData.unreadContacts > 0 ? 'danger' : 'info',
    path: '/admin/contacts'
  }
])

const pendingTotal = computed(() => {
  return todoList.value.reduce((sum, item) => sum + item.count, 0)
})

// 当前日期和问候语
const now = new Date()
const currentDate = ref(now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }))
const weekDay = ref(now.toLocaleDateString('zh-CN', { weekday: 'long' }))
const hour = now.getHours()
const greeting = computed(() => {
  if (hour < 6) return '夜深了'
  if (hour < 11) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 加载真实数据
const loadData = async () => {
  loading.value = true
  try {
    const [products, news, contacts, users] = await Promise.all([
      getProducts(),
      getNews(),
      getContactMessages(),
      getUserCount()
    ])
    
    apiOnline.value = true
    
    // 更新统计数据
    const userCount = users.data?.data?.count || 0
    const productList = products.data?.data || []
    const newsList = news.data?.data || []
    const contactList = contacts.data?.data || []
    
    dashboardData.users = userCount
    dashboardData.products = productList.length
    dashboardData.news = newsList.length
    dashboardData.contacts = contactList.length
    
    statCards[0].value = userCount
    statCards[0].total = userCount
    
    statCards[1].value = productList.length
    statCards[1].total = productList.length
    
    statCards[2].value = newsList.length
    statCards[2].total = newsList.length
    
    statCards[3].value = contactList.length
    statCards[3].total = contactList.length
    
    // 计算未处理留言（根据 status 字段）
    pendingData.unreadContacts = contactList.filter(item => 
      !item.status || item.status === 'unread' || item.status === 'pending'
    ).length
    
  } catch (error) {
    console.error('加载数据失败', error)
    apiOnline.value = false
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dashboard-container {
  /* padding 由 AdminLayout 控制，这里不需要额外 padding */
}

/* 顶部欢迎区 */
.dashboard-header {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: var(--shadow-sm);
}

.welcome-title {
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: 8px;
  font-weight: 500;
}

.welcome-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.api-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.api-status.is-online {
  color: #52C41A;
  background: #F6FFED;
}

.api-status.is-offline {
  color: #F5222D;
  background: #FFF1F0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* 统计卡片 */
.stat-cards {
  margin-bottom: 24px;
}

.stat-card-item {
  height: 100%;
  border: none;
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-card-title {
  color: var(--text-secondary);
  font-size: 14px;
}

.stat-card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-card-value {
  font-size: 30px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-card-footer {
  border-top: 1px solid var(--border-lighter);
  padding-top: 12px;
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
}

.footer-value {
  color: var(--text-primary);
  font-weight: 500;
}

/* 颜色工具类 */
.text-blue { color: #1890FF; background: #E6F7FF; }
.text-purple { color: #722ED1; background: #F9F0FF; }
.text-orange { color: #FA8C16; background: #FFF7E6; }
.text-green { color: #52C41A; background: #F6FFED; }

.text-primary { color: var(--primary-color); }
.text-success { color: #52C41A; }
.text-warning { color: #FA8C16; }
.text-danger { color: #F5222D; }
.text-secondary { color: var(--text-secondary); }

.bg-blue { background: #1890FF; }
.bg-green { background: #52C41A; }
.bg-orange { background: #FA8C16; }
.bg-purple { background: #722ED1; }
.bg-cyan { background: #13C2C2; }
.bg-pink { background: #EB2F96; }
.bg-indigo { background: #4F46E5; }

/* 快捷导航 */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 16px;
  border-radius: 8px;
}

.nav-item:hover {
  background: var(--bg-page);
}

.nav-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: #fff;
  font-size: 24px;
}

.nav-item span {
  font-size: 14px;
  color: var(--text-primary);
}

/* 数据概览 */
.overview-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-page);
}

.overview-item:hover {
  background: #f0f5ff;
}

.overview-title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.overview-desc {
  font-size: 12px;
  color: var(--text-placeholder);
}

.overview-value {
  font-size: 24px;
  font-weight: 600;
}

/* 待办提醒 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
}

.todo-item:hover {
  background: var(--bg-page);
}

.todo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.todo-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 帮助文档 */
.help-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-regular);
  font-size: 14px;
  cursor: pointer;
}

.help-item:hover {
  color: var(--primary-color);
}

/* 版本信息 */
.version-card {
  text-align: center;
}

.version-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.version-logo {
  width: 48px;
  height: 48px;
}

.version-text h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.version-text p {
  font-size: 12px;
  color: var(--text-secondary);
}

.tech-stack {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.mb-24 {
  margin-bottom: 24px;
}

.card-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: normal;
}

/* 响应式 */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-right {
    width: 100%;
  }
  
  .api-status {
    width: 100%;
    justify-content: center;
  }
  
  .overview-list {
    grid-template-columns: 1fr;
  }
}
</style>
