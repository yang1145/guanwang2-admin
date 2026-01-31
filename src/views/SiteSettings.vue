<template>
  <div class="site-settings">
    <div class="page-header">
      <h2 class="page-title">网站设置</h2>
      <div class="page-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="saveSettings" :loading="saving">保存更改</el-button>
      </div>
    </div>

    <el-card class="settings-card" shadow="never">
      <el-tabs v-model="activeTab" class="settings-tabs">
        <!-- 基础配置 -->
        <el-tab-pane label="基础配置" name="basic">
          <el-form 
            :model="siteConfig" 
            :rules="rules" 
            ref="basicFormRef" 
            label-position="top"
            class="settings-form"
          >
            <el-row :gutter="40">
              <el-col :span="24">
                <div class="form-section-title">站点信息</div>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="网站标题" prop="site_title">
                  <el-input v-model="siteConfig.site_title" placeholder="请输入网站标题" />
                  <div class="form-tip">显示在浏览器标签页上的标题</div>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="网站地址 (URL)" prop="site_url">
                  <el-input v-model="siteConfig.site_url" placeholder="例如：https://www.example.com" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="公司名称" prop="company_name">
                  <el-input v-model="siteConfig.company_name" placeholder="请输入公司全称" />
                </el-form-item>
              </el-col>
              
              <el-col :span="24">
                <el-divider border-style="dashed" />
                <div class="form-section-title">备案与版权</div>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="ICP 备案号" prop="icp_number">
                  <el-input v-model="siteConfig.icp_number" placeholder="例如：京ICP备12345678号" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="公安备案号" prop="police_number">
                  <el-input v-model="siteConfig.police_number" placeholder="例如：京公网安备12345678号" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="版权信息" prop="copyright_info">
                  <el-input 
                    v-model="siteConfig.copyright_info" 
                    placeholder="例如：© 2023 Company Name. All Rights Reserved." 
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <!-- SEO 设置 -->
        <el-tab-pane label="SEO 设置" name="seo">
          <el-form 
            :model="siteConfig" 
            ref="seoFormRef" 
            label-position="top"
            class="settings-form"
          >
            <el-form-item label="SEO 关键词 (Keywords)">
              <el-input 
                v-model="siteConfig.seo_keywords" 
                placeholder="多个关键词用英文逗号分隔" 
                type="textarea"
                :rows="2"
              />
              <div class="form-tip">关键词之间请使用英文逗号 "," 分隔，建议不超过 5 个核心词</div>
            </el-form-item>
            
            <el-form-item label="站点描述 (Description)">
              <el-input 
                v-model="siteConfig.company_description" 
                placeholder="请输入简短的公司介绍，将用于搜索引擎的搜索结果描述" 
                type="textarea"
                :rows="6"
                show-word-limit
                maxlength="200"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 友情链接 -->
        <el-tab-pane label="友情链接" name="links">
          <div class="links-header">
            <div class="links-tip">管理网站底部的友情链接展示</div>
            <el-button type="primary" plain icon="Plus" @click="addFriendLink">新增链接</el-button>
          </div>
          
          <div v-if="siteConfig.friend_links.length === 0" class="empty-state">
            <el-icon class="empty-icon"><Link /></el-icon>
            <p>暂无友情链接</p>
          </div>

          <div v-else class="links-list">
            <div v-for="(link, index) in siteConfig.friend_links" :key="index" class="link-item">
              <div class="link-drag-handle">
                <el-icon><Rank /></el-icon>
              </div>
              <div class="link-inputs">
                <el-input v-model="link.name" placeholder="网站名称" class="link-name-input">
                  <template #prepend>名称</template>
                </el-input>
                <el-input v-model="link.url" placeholder="https://" class="link-url-input">
                  <template #prepend>网址</template>
                </el-input>
              </div>
              <el-button type="danger" circle plain icon="Delete" @click="removeFriendLink(index)"></el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSiteConfig, updateSiteConfig } from '@/api/siteConfig.js'
import { Plus, Delete, Link, Rank } from '@element-plus/icons-vue'

const activeTab = ref('basic')
const basicFormRef = ref(null)
const loading = ref(false)
const saving = ref(false)

const siteConfig = reactive({
  company_name: '',
  site_url: '',
  icp_number: '',
  police_number: '',
  copyright_info: '',
  company_description: '',
  seo_keywords: '',
  site_title: '',
  friend_links: []
})

const rules = {
  company_name: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  site_url: [
    { required: true, message: '请输入网站URL', trigger: 'blur' }
  ],
  site_title: [
    { required: true, message: '请输入网站标题', trigger: 'blur' }
  ]
}

// 获取网站配置信息
const fetchSiteConfig = async () => {
  loading.value = true
  try {
    const response = await getSiteConfig()
    const data = response.data.data
    
    Object.keys(data).forEach(key => {
      if (key === 'friend_links') {
        siteConfig.friend_links = Array.isArray(data.friend_links) ? data.friend_links : []
      } else if (siteConfig.hasOwnProperty(key)) {
        siteConfig[key] = data[key] || ''
      }
    })
  } catch (error) {
    ElMessage.error('获取网站配置失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 保存设置
const saveSettings = async () => {
  // 验证基础表单
  if (basicFormRef.value) {
    const valid = await basicFormRef.value.validate().catch(() => false)
    if (!valid) {
      activeTab.value = 'basic'
      return
    }
  }
  
  saving.value = true
  try {
    const submitData = {
      ...siteConfig,
      friend_links: siteConfig.friend_links.filter(link => link.name && link.url)
    }
    
    await updateSiteConfig(submitData)
    ElMessage.success('网站设置保存成功')
  } catch (error) {
    ElMessage.error('保存网站设置失败: ' + (error.message || '未知错误'))
  } finally {
    saving.value = false
  }
}

const addFriendLink = () => {
  siteConfig.friend_links.push({ name: '', url: '' })
}

const removeFriendLink = (index) => {
  siteConfig.friend_links.splice(index, 1)
}

const resetForm = () => {
  if (basicFormRef.value) basicFormRef.value.resetFields()
  fetchSiteConfig()
}

onMounted(() => {
  fetchSiteConfig()
})
</script>

<style scoped>
.site-settings {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-card {
  border: none;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.settings-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: var(--border-light);
}

.settings-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  height: 48px;
  line-height: 48px;
  color: var(--text-regular);
}

.settings-tabs :deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
  font-weight: 600;
}

.settings-tabs :deep(.el-tab-pane) {
  padding: 24px 0 0;
}

.settings-form {
  max-width: 800px;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-left: 10px;
  border-left: 3px solid var(--primary-color);
}

.form-tip {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
  line-height: 1.4;
}

/* 友情链接样式 */
.links-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.links-tip {
  color: var(--text-secondary);
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: var(--bg-page);
  border-radius: 8px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  transition: all 0.3s;
}

.link-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.link-drag-handle {
  cursor: move;
  color: var(--text-secondary);
  padding: 4px;
}

.link-inputs {
  flex: 1;
  display: flex;
  gap: 12px;
}

.link-name-input {
  flex: 1;
  max-width: 200px;
}

.link-url-input {
  flex: 2;
}

@media (max-width: 768px) {
  .link-item {
    flex-wrap: wrap;
  }
  
  .link-inputs {
    flex-direction: column;
    width: 100%;
  }
  
  .link-name-input, .link-url-input {
    max-width: 100%;
  }
}
</style>
