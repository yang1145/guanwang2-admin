<template>
  <div class="site-settings">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>网站设置</span>
        </div>
      </template>
      
      <el-form 
        :model="siteConfig" 
        :rules="rules" 
        ref="formRef" 
        label-width="120px"
        v-loading="loading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company_name">
              <el-input v-model="siteConfig.company_name" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站URL" prop="site_url">
              <el-input v-model="siteConfig.site_url" placeholder="请输入网站URL" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="ICP备案号" prop="icp_number">
              <el-input v-model="siteConfig.icp_number" placeholder="请输入ICP备案号" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="公安备案号" prop="police_number">
              <el-input v-model="siteConfig.police_number" placeholder="请输入公安备案号" />
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="版权信息" prop="copyright_info">
              <el-input 
                v-model="siteConfig.copyright_info" 
                placeholder="请输入版权信息" 
                type="textarea"
                :rows="2"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="公司介绍" prop="company_description">
              <el-input 
                v-model="siteConfig.company_description" 
                placeholder="请输入公司介绍" 
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="SEO关键词" prop="seo_keywords">
              <el-input 
                v-model="siteConfig.seo_keywords" 
                placeholder="请输入SEO关键词，多个关键词用逗号分隔" 
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="网站标题" prop="site_title">
              <el-input v-model="siteConfig.site_title" placeholder="请输入网站标题" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-divider>友情链接</el-divider>
        
        <el-form-item>
          <el-button type="primary" @click="addFriendLink">添加友情链接</el-button>
        </el-form-item>
        
        <el-form-item v-for="(link, index) in siteConfig.friend_links" :key="index" :label="`链接${index+1}`">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input v-model="link.name" placeholder="链接名称"></el-input>
            </el-col>
            <el-col :span="10">
              <el-input v-model="link.url" placeholder="链接地址"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="removeFriendLink(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveSettings" :loading="saving">保存设置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSiteConfig, updateSiteConfig } from '@/api/siteConfig.js'

const formRef = ref(null)
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
    
    // 更新表单数据
    Object.keys(data).forEach(key => {
      if (key === 'friend_links') {
        // 处理友情链接数组
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
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }
  
  saving.value = true
  try {
    // 准备提交数据，过滤掉空链接
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

// 添加友情链接
const addFriendLink = () => {
  siteConfig.friend_links.push({ name: '', url: '' })
}

// 删除友情链接
const removeFriendLink = (index) => {
  siteConfig.friend_links.splice(index, 1)
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  fetchSiteConfig()
}

onMounted(() => {
  fetchSiteConfig()
})
</script>

<style scoped>
.site-settings {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.settings-card {
  width: 100%;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.el-divider {
  margin: 30px 0;
}
</style>