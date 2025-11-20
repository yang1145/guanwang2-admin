<template>
  <div class="sidebar-menu">
    <el-menu
      :default-active="activeIndex"
      class="menu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <el-menu-item index="home">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      
      <el-sub-menu index="content">
        <template #title>
          <el-icon><Document /></el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="products">产品管理</el-menu-item>
        <el-menu-item index="goods">商品管理</el-menu-item>
        <el-menu-item index="news">新闻管理</el-menu-item>
        <el-menu-item index="contacts">联系信息</el-menu-item>
        <el-menu-item index="categories">分类管理</el-menu-item>
      </el-sub-menu>
      
      <el-sub-menu index="system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="users">用户管理</el-menu-item>
        <el-menu-item index="site-settings">网站设置</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="analytics">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据分析</span>
      </el-menu-item>
    </el-menu>
    
    <div class="toggle-button" @click="toggleCollapse">
      <el-icon v-if="isCollapse"><Expand /></el-icon>
      <el-icon v-else><Fold /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  House,
  Setting,
  Document,
  DataAnalysis,
  Expand,
  Fold
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const activeIndex = ref('home')

// 定义暴露给父组件的属性和方法
defineExpose({
  isCollapse
})

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理菜单选择
const handleSelect = (index) => {
  activeIndex.value = index
  // 这里可以根据index进行路由跳转
  switch(index) {
    case 'home':
      router.push('/admin')
      break
    case 'products':
      router.push('/admin/products')
      break
    case 'goods':
      router.push('/admin/goods')
      break
    case 'news':
      router.push('/admin/news')
      break
    case 'contacts':
      router.push('/admin/contacts')
      break
    case 'users':
      router.push('/admin/users')
      break
    case 'site-settings':
      router.push('/admin/site-settings')
      break
    case 'analytics':
      router.push('/admin/analytics')
      break
    case 'categories':
      router.push('/admin/categories')
      break
    default:
      router.push('/admin')
  }
}

// 根据当前路由设置激活菜单项
onMounted(() => {
  const routeMap = {
    '/admin': 'home',
    '/admin/products': 'products',
    '/admin/goods': 'goods',
    '/admin/news': 'news',
    '/admin/contacts': 'contacts',
    '/admin/users': 'users',
    '/admin/site-settings': 'site-settings',
    '/admin/analytics': 'analytics',
    '/admin/categories': 'categories'
  }
  
  activeIndex.value = routeMap[route.path] || 'home'
})
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #545c64;
  position: relative;
  transition: all 0.3s ease;
  min-height: 100%;
  max-height: 100vh;
}

.menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 40px);
}

:deep(.el-menu--inline) {
  background-color: #434a50 !important;
}

:deep(.el-menu--inline .el-menu-item) {
  background-color: #434a50 !important;
  padding-left: 48px !important;
}

:deep(.el-menu--inline .el-menu-item:hover) {
  background-color: #32383e !important;
}

:deep(.el-menu-item:hover) {
  background-color: #434a50 !important;
}

.toggle-button {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #434a50;
  color: #fff;
  cursor: pointer;
  border-top: 1px solid #32383e;
}

.toggle-button:hover {
  background-color: #32383e;
}
</style>