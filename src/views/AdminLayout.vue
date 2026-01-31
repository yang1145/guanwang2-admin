<template>
  <el-container class="layout-container">
    <el-aside class="layout-sidebar" :width="sidebarWidth">
      <div class="logo-container">
        <img src="@/assets/vue.svg" alt="Logo" class="logo" />
        <span v-if="!isCollapse" class="title">管理后台</span>
      </div>
      <SidebarMenu ref="sidebarRef" />
    </el-aside>
    
    <el-container>
      <el-header class="layout-header">
        <div class="header-content">
          <div class="header-left">
            <!-- 面包屑或其他左侧内容 -->
            <span class="welcome-text">欢迎回来，管理员</span>
          </div>
          <div class="header-actions">
            <el-dropdown @command="handleCommand" trigger="click">
              <div class="avatar-container">
                <el-avatar :size="32" icon="UserFilled" class="user-avatar" />
                <span class="username">Admin</span>
                <el-icon><CaretBottom /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'
import SidebarMenu from '@/components/SidebarMenu.vue'

const router = useRouter()
const sidebarRef = ref(null)

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  if (sidebarRef.value) {
    return sidebarRef.value.isCollapse ? '64px' : '220px'
  }
  return '220px'
})

const isCollapse = computed(() => sidebarRef.value?.isCollapse || false)

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      logout()
      break
    case 'profile':
      console.log('查看个人资料')
      break
    case 'changePassword':
      router.push('/admin/change-password')
      break
    case 'settings':
      console.log('系统设置')
      break
  }
}

const logout = () => {
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  width: 100%;
}

.layout-sidebar {
  height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--border-light);
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
}

.logo-container {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-light);
  overflow: hidden;
}

.logo {
  width: 32px;
  height: 32px;
}

.title {
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
}

.layout-header {
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-light);
  padding: 0 24px;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.welcome-text {
  color: var(--text-regular);
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.avatar-container:hover {
  background-color: rgba(0, 0, 0, 0.025);
}

.user-avatar {
  background-color: var(--primary-color);
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: var(--text-primary);
}

.layout-main {
  background-color: var(--bg-page);
  padding: 24px;
  min-height: calc(100vh - 64px);
  overflow-x: hidden;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .layout-header {
    padding: 0 16px;
  }
  
  .layout-main {
    padding: 16px;
  }
  
  .username {
    display: none;
  }
}
</style>
