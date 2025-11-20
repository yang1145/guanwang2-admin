<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="welcome-card">
          <h1>企业官网管理系统</h1>
          <p>欢迎使用后台管理系统，您可以在这里管理网站的所有内容</p>
          <div class="welcome-stats">
            <span class="stat-item">
              <i class="el-icon-user"></i>
              用户数: {{ statsData.userCount }}
            </span>
            <span class="stat-item">
              <i class="el-icon-news"></i>
              新闻数: {{ statsData.newsCount }}
            </span>
            <span class="stat-item">
              <i class="el-icon-box"></i>
              产品数: {{ statsData.productCount }}
            </span>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon orders">
            <i class="el-icon-shopping-cart"></i>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ statsData.newsCount }}</p>
            <p class="stat-label">新闻总数</p>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon revenue">
            <i class="el-icon-money"></i>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ statsData.productCount }}</p>
            <p class="stat-label">产品总数</p>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon products">
            <i class="el-icon-box"></i>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ statsData.contactCount }}</p>
            <p class="stat-label">留言总数</p>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon users">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-info">
            <p class="stat-number">{{ statsData.userCount }}</p>
            <p class="stat-label">用户总数</p>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12">
        <div class="chart-card">
          <div class="card-header">
            <h3>最新产品</h3>
            <el-button link type="primary" @click="$router.push('/admin/products')">查看更多</el-button>
          </div>
          <el-table :data="latestProducts" style="width: 100%" max-height="250">
            <el-table-column prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="category" label="分类" width="100"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="160"></el-table-column>
          </el-table>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12">
        <div class="chart-card">
          <div class="card-header">
            <h3>最新留言</h3>
            <el-button link type="primary" @click="$router.push('/admin/contacts')">查看更多</el-button>
          </div>
          <el-table :data="latestContacts" style="width: 100%" max-height="250">
            <el-table-column prop="name" label="姓名" width="80"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="created_at" label="提交时间" width="160"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getProducts } from '@/api/products'
import { getNews } from '@/api/news'
import { getContactMessages } from '@/api/contact'
import { ElMessage } from 'element-plus'

const statsData = reactive({
  userCount: 0,
  newsCount: 0,
  productCount: 0,
  contactCount: 0
})

const latestProducts = reactive([])

const latestContacts = reactive([])

// 加载统计数据
const loadStatsData = async () => {
  try {
    // 获取产品统计
    const productResponse = await getProducts()
    statsData.productCount = productResponse.data.data.length
    
    // 获取新闻统计
    const newsResponse = await getNews()
    statsData.newsCount = newsResponse.data.data.length
    
    // 获取联系信息统计
    const contactResponse = await getContactMessages()
    statsData.contactCount = contactResponse.data.data.length
    
    // 用户数我们暂时用固定值，实际项目中可以从用户管理API获取
    statsData.userCount = 128
  } catch (error) {
    ElMessage.error('加载统计数据失败: ' + (error.message || '未知错误'))
  }
}

// 加载最新产品
const loadLatestProducts = async () => {
  try {
    const response = await getProducts()
    // 获取最新的5个产品
    latestProducts.splice(0, latestProducts.length, ...response.data.data.slice(0, 5))
  } catch (error) {
    ElMessage.error('加载产品数据失败: ' + (error.message || '未知错误'))
  }
}

// 加载最新留言
const loadLatestContacts = async () => {
  try {
    const response = await getContactMessages()
    // 获取最新的5个留言
    latestContacts.splice(0, latestContacts.length, ...response.data.data.slice(0, 5))
  } catch (error) {
    ElMessage.error('加载留言数据失败: ' + (error.message || '未知错误'))
  }
}

// 加载所有数据
const loadData = async () => {
  await Promise.all([
    loadStatsData(),
    loadLatestProducts(),
    loadLatestContacts()
  ])
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  max-width: 100vw;
  overflow-x: hidden;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 30px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.welcome-card h1 {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 500;
}

.welcome-card p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 20px;
}

.welcome-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  opacity: 0.9;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 120px;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.users {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.orders {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.revenue {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.products {
  background: linear-gradient(135deg, #a8c8ec 0%, #7ea7e4 100%);
}

.stat-info {
  flex: 1;
  overflow: hidden;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 500;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px dashed #ddd;
}

.system-status {
  margin-top: 15px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .home-container {
    padding: 15px;
  }
  
  .welcome-card {
    padding: 20px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .welcome-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
  }
  
  .stat-number {
    font-size: 20px;
  }
}
</style>