<template>
  <el-container class="layout-container">
    <el-aside class="layout-sidebar" :width="sidebarWidth">
      <SidebarMenu ref="sidebarRef" />
    </el-aside>
    
    <el-container>
      <el-header class="layout-header">
        <div class="header-content">
          <h2>管理系统</h2>
          <div class="header-actions">
            <el-dropdown @command="handleCommand">
              <el-avatar :size="32" icon="UserFilled" style="cursor: pointer;" />
              <template #dropdown>
                <el-dropdown-menu>
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
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SidebarMenu from '@/components/SidebarMenu.vue'

const router = useRouter()
const sidebarRef = ref(null)

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  if (sidebarRef.value) {
    return sidebarRef.value.isCollapse ? '64px' : '200px'
  }
  return '200px'
})

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      logout()
      break
    case 'profile':
      // 可以跳转到个人资料页面
      console.log('查看个人资料')
      break
    case 'changePassword':
      router.push('/admin/change-password')
      break
    case 'settings':
      // 可以跳转到系统设置页面
      console.log('系统设置')
      break
  }
}

const logout = () => {
  // 简单的退出登录操作，实际项目中可能需要清理token等
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.layout-sidebar {
  height: 100%;
  background-color: #545c64;
  transition: width 0.3s ease;
}

.layout-header {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.layout-main {
  background-color: #f5f5f5;
  padding: 0;
  min-height: calc(100vh - 60px);
  overflow: auto;
  margin: 0;
  width: 100%;
}

/* 确保主要内容区域占满剩余空间 */
:deep(.el-main) {
  min-height: calc(100vh - 60px) !important;
  padding: 0 !important;
  margin: 0 !important;
  background-color: #f5f5f5 !important;
  max-width: 100%;
  overflow-x: hidden;
}

/* 防止Element Plus的默认样式导致的滚动条 */
:deep(.el-container) {
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100vw;
  overflow-x: hidden;
}

:deep(.el-aside) {
  max-width: 100%;
  overflow-x: hidden;
}
</style>