<template>
  <div class="dashboard-container">
    <!-- 顶部欢迎区 -->
    <div class="dashboard-header">
      <div class="header-left">
        <h2 class="welcome-title">早安，管理员，祝你开心每一天！</h2>
        <p class="welcome-desc">今日晴，20℃ - 32℃，天气不错，记得多喝水。</p>
      </div>
      <div class="header-right">
        <div class="stat-box">
          <span class="stat-label">待办事项</span>
          <span class="stat-value">8/24</span>
        </div>
        <div class="stat-box">
          <span class="stat-label">本周访问</span>
          <span class="stat-value">1,234</span>
        </div>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="24" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in statCards" :key="index">
        <el-card shadow="hover" class="stat-card-item">
          <div class="stat-card-header">
            <span class="stat-card-title">{{ item.title }}</span>
            <el-tag :type="item.trendType" size="small" effect="plain">
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
            <span>总{{ item.title }}</span>
            <span class="footer-value">{{ item.total }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主要内容区 -->
    <el-row :gutter="24">
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
          </div>
        </el-card>

        <!-- 最新动态 -->
        <el-card shadow="hover" class="mb-24">
          <template #header>
            <div class="card-header">
              <span>最新动态</span>
              <el-button link type="primary">查看全部</el-button>
            </div>
          </template>
          <div class="activity-list">
            <div class="activity-item" v-for="(activity, index) in activities" :key="index">
              <div class="activity-avatar" :class="activity.type">
                <el-icon><component :is="activity.icon" /></el-icon>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :lg="8">
        <!-- 系统公告 -->
        <el-card shadow="hover" class="mb-24">
          <template #header>
            <div class="card-header">
              <span>系统公告</span>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item" v-for="(notice, index) in notices" :key="index">
              <el-tag size="small" :type="notice.type" class="notice-tag">{{ notice.tag }}</el-tag>
              <span class="notice-text">{{ notice.content }}</span>
            </div>
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
            <a href="#" class="help-item">
              <el-icon><QuestionFilled /></el-icon>
              <span>如何发布新产品？</span>
            </a>
            <a href="#" class="help-item">
              <el-icon><QuestionFilled /></el-icon>
              <span>如何管理用户权限？</span>
            </a>
            <a href="#" class="help-item">
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
import { reactive, onMounted } from 'vue'
import { 
  User, Document, Box, ChatDotRound, Setting, Files,
  TrendCharts, Bell, QuestionFilled
} from '@element-plus/icons-vue'
import { getProducts } from '@/api/products'
import { getNews } from '@/api/news'
import { getContactMessages } from '@/api/contact'
import { getUserCount } from '@/api/users'

// 统计卡片数据
const statCards = reactive([
  {
    title: '访问量',
    value: '8,846',
    total: '120,000',
    trend: '+12%',
    trendType: 'success',
    icon: TrendCharts,
    iconClass: 'text-blue'
  },
  {
    title: '用户数',
    value: '0',
    total: '0',
    trend: '+5%',
    trendType: 'warning',
    icon: User,
    iconClass: 'text-purple'
  },
  {
    title: '产品数',
    value: '0',
    total: '0',
    trend: '+2%',
    trendType: 'primary',
    icon: Box,
    iconClass: 'text-orange'
  },
  {
    title: '留言数',
    value: '0',
    total: '0',
    trend: '+8%',
    trendType: 'success',
    icon: ChatDotRound,
    iconClass: 'text-green'
  }
])

// 最新动态模拟数据
const activities = reactive([
  { title: '管理员 发布了新产品 "智能手表 X1"', time: '10分钟前', icon: Box, type: 'bg-blue' },
  { title: '新用户 "张三" 注册了账号', time: '30分钟前', icon: User, type: 'bg-green' },
  { title: '收到一条新的留言咨询', time: '1小时前', icon: ChatDotRound, type: 'bg-purple' },
  { title: '系统完成了每日数据备份', time: '2小时前', icon: Setting, type: 'bg-orange' },
  { title: '管理员 更新了 "关于我们" 页面', time: '5小时前', icon: Document, type: 'bg-cyan' }
])

// 公告模拟数据
const notices = reactive([
  { tag: '通知', type: 'primary', content: '系统将于本周六凌晨进行维护升级' },
  { tag: '活动', type: 'success', content: '双十一促销活动配置指南' },
  { tag: '警告', type: 'danger', content: '请及时处理待回复的客户留言' }
])

// 加载真实数据
const loadData = async () => {
  try {
    const [products, news, contacts, users] = await Promise.all([
      getProducts(),
      getNews(),
      getContactMessages(),
      getUserCount()
    ])
    
    // 更新统计数据
    statCards[1].value = users.data.data.count || 0
    statCards[1].total = users.data.data.count || 0
    
    statCards[2].value = products.data.data.length || 0
    statCards[2].total = products.data.data.length || 0
    
    statCards[3].value = contacts.data.data.length || 0
    statCards[3].total = contacts.data.data.length || 0
    
  } catch (error) {
    console.error('加载数据失败', error)
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

.header-right {
  display: flex;
  gap: 32px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  color: var(--text-primary);
}

/* 统计卡片 */
.stat-cards {
  margin-bottom: 24px;
}

.stat-card-item {
  height: 100%;
  border: none;
  transition: all 0.3s;
}

.stat-card-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-base) !important;
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

.bg-blue { background: #1890FF; }
.bg-green { background: #52C41A; }
.bg-orange { background: #FA8C16; }
.bg-purple { background: #722ED1; }
.bg-cyan { background: #13C2C2; }
.bg-pink { background: #EB2F96; }

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
  transition: all 0.3s;
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
  transition: transform 0.3s;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-item span {
  font-size: 14px;
  color: var(--text-primary);
}

/* 最新动态 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.activity-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 系统公告 */
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notice-text {
  font-size: 14px;
  color: var(--text-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  transition: color 0.3s;
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

/* 响应式 */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .stat-box {
    align-items: flex-start;
  }
}
</style>
