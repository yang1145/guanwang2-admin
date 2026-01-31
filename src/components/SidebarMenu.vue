<template>
  <div class="sidebar-menu">
    <el-menu
      :default-active="activeIndex"
      class="menu"
      :collapse="isCollapse"
      @select="handleSelect"
      :collapse-transition="false"
      unique-opened
    >
      <el-menu-item index="home">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
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
        <template #title>数据分析</template>
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

defineExpose({
  isCollapse
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleSelect = (index) => {
  activeIndex.value = index
  switch(index) {
    case 'home': router.push('/admin'); break;
    case 'products': router.push('/admin/products'); break;
    case 'goods': router.push('/admin/goods'); break;
    case 'news': router.push('/admin/news'); break;
    case 'contacts': router.push('/admin/contacts'); break;
    case 'users': router.push('/admin/users'); break;
    case 'site-settings': router.push('/admin/site-settings'); break;
    case 'analytics': router.push('/admin/analytics'); break;
    case 'categories': router.push('/admin/categories'); break;
    default: router.push('/admin');
  }
}

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
  height: calc(100% - 64px); /* 减去logo高度 */
  display: flex;
  flex-direction: column;
  background-color: var(--sidebar-bg);
}

.menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

/* 覆盖 Element Plus 菜单样式以适应蓝白主题 */
:deep(.el-menu) {
  background-color: var(--sidebar-bg);
  border-right: none;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  color: var(--text-regular);
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 4px;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  color: var(--primary-color);
  background-color: rgba(24, 144, 255, 0.05);
}

:deep(.el-menu-item.is-active) {
  color: var(--primary-color);
  background-color: var(--sidebar-active-bg);
  font-weight: 500;
}

:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: var(--text-primary);
  font-weight: 500;
}

/* 图标样式 */
:deep(.el-icon) {
  font-size: 18px;
  margin-right: 4px;
}

/* 折叠按钮 */
.toggle-button {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: 1px solid var(--border-light);
  color: var(--text-secondary);
  transition: all 0.3s;
}

.toggle-button:hover {
  color: var(--primary-color);
  background-color: rgba(0, 0, 0, 0.025);
}
</style>
