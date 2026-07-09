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
      
      <el-menu-item index="tickets">
        <el-icon><Tickets /></el-icon>
        <template #title>工单管理</template>
      </el-menu-item>

      <el-menu-item index="users">
        <el-icon><User /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>

      <el-sub-menu index="permission-group">
        <template #title>
          <el-icon><Lock /></el-icon>
          <span>权限管理</span>
        </template>
        <el-menu-item index="admins">管理员管理</el-menu-item>
        <el-menu-item index="roles">权限组管理</el-menu-item>
        <el-menu-item index="permissions">权限管理</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="system">
        <template #title>
          <el-icon><Setting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="site-settings">网站设置</el-menu-item>
        <el-menu-item index="help">帮助文档</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="ai-group">
        <template #title>
          <el-icon><Cpu /></el-icon>
          <span>AI 管理</span>
        </template>
        <el-menu-item index="ai-chat">AI 聊天控制</el-menu-item>
        <el-menu-item index="ai-chat-test">AI 聊天测试</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="analytics">
        <el-icon><DataAnalysis /></el-icon>
        <template #title>数据分析</template>
      </el-menu-item>
      
      <el-menu-item index="about">
        <el-icon><InfoFilled /></el-icon>
        <template #title>关于</template>
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
  Tickets,
  User,
  Lock,
  Cpu,
  DataAnalysis,
  InfoFilled,
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
    case 'admins': router.push('/admin/admins'); break;
    case 'roles': router.push('/admin/roles'); break;
    case 'permissions': router.push('/admin/permissions'); break;
    case 'tickets': router.push('/admin/tickets'); break;
    case 'site-settings': router.push('/admin/site-settings'); break;
    case 'analytics': router.push('/admin/analytics'); break;
    case 'categories': router.push('/admin/categories'); break;
    case 'help': router.push('/admin/help'); break;
    case 'ai-chat': router.push('/admin/ai-chat'); break;
    case 'ai-chat-test': router.push('/admin/ai-chat-test'); break;
    case 'about': router.push('/admin/about'); break;
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
    '/admin/admins': 'admins',
    '/admin/roles': 'roles',
    '/admin/permissions': 'permissions',
    '/admin/tickets': 'tickets',
    '/admin/site-settings': 'site-settings',
    '/admin/analytics': 'analytics',
    '/admin/categories': 'categories',
    '/admin/help': 'help',
    '/admin/ai-chat': 'ai-chat',
    '/admin/ai-chat-test': 'ai-chat-test',
    '/admin/about': 'about'
  }
  activeIndex.value = routeMap[route.path] || 'home'
})
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--sidebar-bg);
}

.menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 覆盖 Element Plus 菜单样式 */
:deep(.el-menu) {
  background-color: var(--sidebar-bg);
  border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: var(--text-regular);
  height: 44px;
  line-height: 44px;
  margin: 4px 12px;
  border-radius: 6px;
  font-size: 14px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  color: var(--primary-color);
  background-color: #f5f7fa;
}

:deep(.el-menu-item.is-active) {
  color: var(--primary-color);
  background-color: var(--sidebar-active-bg);
  font-weight: 600;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--primary-color);
  font-weight: 600;
}

/* 图标样式 */
:deep(.el-icon) {
  font-size: 18px;
  margin-right: 4px;
}

/* 折叠状态下图标居中 */
:deep(.el-menu--collapse) {
  width: 64px;
}

:deep(.el-menu--collapse .el-menu-item),
:deep(.el-menu--collapse .el-sub-menu__title) {
  margin: 4px 0;
  padding: 0 !important;
  justify-content: center;
}

:deep(.el-menu--collapse .el-icon) {
  margin-right: 0;
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
  transition: color 0.2s;
}

.toggle-button:hover {
  color: var(--primary-color);
}
</style>
