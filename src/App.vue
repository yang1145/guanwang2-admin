<script setup>
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Element Plus 消息框样式优化 */
:deep(.el-message) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  padding: 15px 20px;
  min-width: 300px;
}

:deep(.el-message-box) {
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
}

:deep(.el-message-box__header) {
  padding: 20px 24px 16px;
}

:deep(.el-message-box__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-message-box__content) {
  padding: 16px 24px;
  color: #606266;
}

:deep(.el-message-box__btns) {
  padding: 16px 24px 20px;
}

:deep(.el-message-box__btns .el-button) {
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
}

/* Notification 通知样式优化 */
:deep(.el-notification) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: none;
}

/* Drawer 抽屉样式优化 */
:deep(.el-drawer) {
  border-radius: 12px 0 0 12px;
}

:deep(.el-drawer__header) {
  padding: 20px 24px;
  border-bottom: 2px solid #e4e7ed;
}

/* Popover 弹出框样式优化 */
:deep(.el-popover) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Select 下拉框样式优化 */
:deep(.el-select-dropdown) {
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: none;
}

:deep(.el-select-dropdown__item) {
  padding: 10px 16px;
  transition: all 0.3s;
}

:deep(.el-select-dropdown__item.is-selected) {
  background-color: #f5f7fa;
  color: #409eff;
  font-weight: 500;
}
</style>