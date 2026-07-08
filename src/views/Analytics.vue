<template>
  <div class="analytics-page">
    <el-card class="page-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>数据分析</span>
        </div>
      </template>

      <!-- 核心指标 -->
      <el-row :gutter="16" class="stat-row">
        <el-col :xs="12" :sm="8" :md="4" v-for="item in stats" :key="item.label">
          <div class="stat-box">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 分类分布 -->
      <el-row :gutter="24" class="section-row">
        <el-col :xs="24" :lg="12">
          <h3 class="section-title">产品分类分布</h3>
          <div v-if="productCategoryStats.length" class="distribution-list">
            <div v-for="item in productCategoryStats" :key="item.name" class="distribution-item">
              <span class="distribution-label">{{ item.name || '未分类' }}</span>
              <el-progress
                :percentage="item.percentage"
                :stroke-width="10"
                :show-text="false"
                class="distribution-progress"
              />
              <span class="distribution-count">{{ item.count }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无产品数据" />
        </el-col>

        <el-col :xs="24" :lg="12">
          <h3 class="section-title">商品分类分布</h3>
          <div v-if="goodsCategoryStats.length" class="distribution-list">
            <div v-for="item in goodsCategoryStats" :key="item.name" class="distribution-item">
              <span class="distribution-label">{{ item.name || '未分类' }}</span>
              <el-progress
                :percentage="item.percentage"
                :stroke-width="10"
                :show-text="false"
                class="distribution-progress"
              />
              <span class="distribution-count">{{ item.count }}</span>
            </div>
          </div>
          <el-empty v-else description="暂无商品数据" />
        </el-col>
      </el-row>

      <!-- 留言状态 -->
      <div class="section">
        <h3 class="section-title">留言状态</h3>
        <el-row :gutter="16">
          <el-col :xs="12" :sm="8" :md="4">
            <div class="stat-box stat-box-muted">
              <div class="stat-value">{{ contactStats.total }}</div>
              <div class="stat-label">留言总数</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="4">
            <div class="stat-box stat-box-muted">
              <div class="stat-value">{{ contactStats.pending }}</div>
              <div class="stat-label">待处理</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="8" :md="4">
            <div class="stat-box stat-box-muted">
              <div class="stat-value">{{ contactStats.replied }}</div>
              <div class="stat-label">已回复</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 近 7 天新增趋势 -->
      <div class="section">
        <h3 class="section-title">近 7 天新增趋势</h3>
        <div v-if="trendData.length" class="trend-chart">
          <div
            v-for="item in trendData"
            :key="item.date"
            class="trend-column"
          >
            <div class="trend-bar-wrapper">
              <div class="trend-bar" :style="{ height: item.height + '%' }"></div>
            </div>
            <div class="trend-count">{{ item.count }}</div>
            <div class="trend-date">{{ item.label }}</div>
          </div>
        </div>
        <el-empty v-else description="暂无趋势数据" />
      </div>

      <!-- 热门新闻 -->
      <div class="section">
        <h3 class="section-title">热门新闻 Top 5</h3>
        <el-table :data="topNews" size="small" v-if="topNews.length">
          <el-table-column prop="title" label="标题" show-overflow-tooltip />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="views" label="浏览量" width="100" sortable />
          <el-table-column prop="created_at" label="发布时间" width="160" />
        </el-table>
        <el-empty v-else description="暂无新闻数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProducts } from '@/api/products'
import { getGoods } from '@/api/goods'
import { getNews } from '@/api/news'
import { getContactMessages } from '@/api/contact'
import { getUsers } from '@/api/users'
import { getCategories } from '@/api/categories'

const loading = ref(false)
const products = ref([])
const goods = ref([])
const news = ref([])
const contacts = ref([])
const users = ref([])
const categories = ref([])

const stats = computed(() => [
  { label: '用户总数', value: users.value.length },
  { label: '产品总数', value: products.value.length },
  { label: '商品总数', value: goods.value.length },
  { label: '新闻总数', value: news.value.length },
  { label: '留言总数', value: contacts.value.length },
  { label: '分类总数', value: categories.value.length }
])

function buildCategoryStats(list) {
  const map = {}
  list.forEach(item => {
    const key = item.category || '未分类'
    map[key] = (map[key] || 0) + 1
  })
  const total = list.length
  return Object.entries(map)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
}

const productCategoryStats = computed(() => buildCategoryStats(products.value))
const goodsCategoryStats = computed(() => buildCategoryStats(goods.value))

const contactStats = computed(() => {
  const total = contacts.value.length
  const pending = contacts.value.filter(
    item => !item.status || item.status === 'unread' || item.status === 'pending'
  ).length
  return {
    total,
    pending,
    replied: total - pending
  }
})

function formatDate(date) {
  const d = new Date(date)
  const month = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${month}-${day}`
}

function getStartOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const trendData = computed(() => {
  const days = 7
  const result = []
  const today = getStartOfDay(new Date())
  const allItems = [
    ...products.value,
    ...goods.value,
    ...news.value,
    ...contacts.value
  ]

  for (let i = days - 1; i >= 0; i--) {
    const dayTime = today - i * 24 * 60 * 60 * 1000
    const count = allItems.filter(item => {
      if (!item.created_at) return false
      return getStartOfDay(item.created_at) === dayTime
    }).length
    result.push({
      date: dayTime,
      count,
      label: formatDate(dayTime),
      height: 0
    })
  }

  const max = Math.max(...result.map(item => item.count), 1)
  result.forEach(item => {
    item.height = Math.max((item.count / max) * 100, item.count > 0 ? 4 : 0)
  })

  return result
})

const topNews = computed(() => {
  return [...news.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

const loadData = async () => {
  loading.value = true
  try {
    const [
      productsRes,
      goodsRes,
      newsRes,
      contactsRes,
      usersRes,
      categoriesRes
    ] = await Promise.all([
      getProducts(),
      getGoods(),
      getNews(),
      getContactMessages(),
      getUsers(),
      getCategories()
    ])

    products.value = productsRes.data?.data || []
    goods.value = goodsRes.data?.data || []
    news.value = newsRes.data?.data || []
    contacts.value = contactsRes.data?.data || []
    users.value = usersRes.data?.data || []
    categories.value = categoriesRes.data?.data || []
  } catch (error) {
    console.error('加载分析数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.analytics-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.page-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
}

.page-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 2px solid #e4e7ed;
  padding: 20px 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 16px;
}

.card-header span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.page-card :deep(.el-card__body) {
  padding: 24px;
}

.stat-row {
  margin-bottom: 24px;
}

.stat-box {
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--primary-color);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.stat-box-muted .stat-value {
  color: var(--text-primary);
}

.section {
  margin-top: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.distribution-label {
  width: 80px;
  font-size: 13px;
  color: var(--text-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.distribution-progress {
  flex: 1;
}

.distribution-count {
  width: 36px;
  text-align: right;
  font-size: 13px;
  color: var(--text-secondary);
}

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  height: 180px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: 8px;
}

.trend-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.trend-bar-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.trend-bar {
  width: 24px;
  background-color: var(--primary-color);
  border-radius: 4px 4px 0 0;
  opacity: 0.85;
}

.trend-count {
  font-size: 12px;
  color: var(--text-primary);
  font-weight: 500;
}

.trend-date {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 16px;
  }

  .page-card :deep(.el-card__body) {
    padding: 16px;
  }

  .trend-bar {
    width: 16px;
  }
}
</style>
