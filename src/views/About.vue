<template>
  <div class="about-page">
    <el-card class="about-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">关于</div>
        </div>
      </template>

      <div class="about-content">
        <h2 class="project-name">官网后台管理系统</h2>
        <p class="project-desc">
          本项目是一个面向企业官网内容管理的后台系统，支持产品、商品、新闻、分类、用户、留言等模块的管理，并集成了 AI 聊天功能。
        </p>

        <el-divider content-position="left">技术栈</el-divider>
        <div class="tech-stack">
          <el-tag type="primary" size="large">Vue 3</el-tag>
          <el-tag type="success" size="large">Vite</el-tag>
          <el-tag type="warning" size="large">Element Plus</el-tag>
          <el-tag type="danger" size="large">Node.js</el-tag>
          <el-tag type="info" size="large">Express</el-tag>
          <el-tag type="primary" size="large">MySQL</el-tag>
        </div>

        <el-divider content-position="left">版本信息</el-divider>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
          <el-descriptions-item label="最后更新">2026-07-09</el-descriptions-item>
          <el-descriptions-item label="维护团队">技术部</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">帮助</el-divider>
        <p class="help-text">
          如需查看操作说明，请前往
          <el-button link type="primary" @click="$router.push('/admin/help')">帮助文档</el-button>
          页面。
        </p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 关于页无需复杂逻辑
</script>

<style scoped>
.about-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.about-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.about-content {
  padding: 8px 0;
}

.project-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.project-desc {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 24px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.help-text {
  font-size: 14px;
  color: var(--text-regular);
}
</style>
