<template>
  <div class="ai-chat-control">
    <el-card class="management-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="card-header">
          <div class="header-title">AI 聊天控制</div>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="border-card">
        <!-- 配置管理 -->
        <el-tab-pane label="配置管理" name="config">
          <el-form
            ref="configFormRef"
            :model="configForm"
            label-width="150px"
            class="config-form"
          >
            <el-row :gutter="24">
              <el-col :xs="24" :md="12">
                <el-form-item label="服务商">
                  <el-input v-model="configForm.provider" placeholder="openai / custom" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="模型">
                  <el-input v-model="configForm.model" placeholder="gpt-3.5-turbo" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="API Key">
              <el-input
                v-model="configForm.api_key"
                type="password"
                placeholder="留空表示不修改"
                show-password
              />
            </el-form-item>

            <el-form-item label="API Base URL">
              <el-input v-model="configForm.api_base_url" placeholder="https://api.openai.com/v1" />
            </el-form-item>

            <el-form-item label="系统提示词">
              <el-input
                v-model="configForm.system_prompt"
                type="textarea"
                :rows="3"
                placeholder="请输入系统提示词"
              />
            </el-form-item>

            <el-row :gutter="24">
              <el-col :xs="24" :md="12">
                <el-form-item label="最大上下文消息数">
                  <el-input-number v-model="configForm.max_context_messages" :min="0" :max="100" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="每日全局限额">
                  <el-input-number v-model="configForm.daily_global_limit" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :xs="24" :md="12">
                <el-form-item label="保留天数">
                  <el-input-number v-model="configForm.retention_days" :min="1" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="启用状态">
                  <el-switch
                    v-model="configForm.enabled"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :xs="24" :md="12">
                <el-form-item label="允许访客使用">
                  <el-switch
                    v-model="configForm.guest_allowed"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="允许"
                    inactive-text="禁止"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="访客每日限额">
                  <el-input-number v-model="configForm.guest_daily_limit" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :xs="24" :md="8">
                <el-form-item label="默认日限额">
                  <el-input-number v-model="configForm.default_daily_limit" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="8">
                <el-form-item label="默认月限额">
                  <el-input-number v-model="configForm.default_monthly_limit" :min="0" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="8">
                <el-form-item label="默认总限额">
                  <el-input-number v-model="configForm.default_total_limit" :min="0" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <el-col :xs="24" :md="12">
                <el-form-item label="Temperature">
                  <el-input-number v-model="configForm.temperature" :min="0" :max="2" :step="0.1" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-form-item label="Max Tokens">
                  <el-input-number v-model="configForm.max_tokens" :min="1" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存配置</el-button>
              <el-button @click="loadConfig">重置</el-button>
              <el-button type="warning" plain @click="handleCleanup">立即清理记录</el-button>
            </el-form-item>
          </el-form>

          <el-alert
            v-if="cleanupResult"
            :title="`清理完成：删除消息 ${cleanupResult.deletedMessages} 条，删除空会话 ${cleanupResult.deletedSessions} 个`"
            type="success"
            :closable="false"
            class="cleanup-alert"
          />
        </el-tab-pane>

        <!-- 会话管理 -->
        <el-tab-pane label="会话管理" name="sessions">
          <el-table :data="sessions" style="width: 100%" size="small">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="user_id" label="用户 ID" width="90" />
            <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
            <el-table-column prop="created_at" label="创建时间" width="170" />
            <el-table-column prop="updated_at" label="更新时间" width="170" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewMessages(scope.row)">查看消息</el-button>
                <el-button link type="danger" size="small" @click="removeSession(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              v-model:current-page="sessionPage"
              :page-size="sessionLimit"
              :total="sessionTotal"
              :background="true"
              layout="total, prev, pager, next, jumper"
              @current-change="loadSessions"
            />
          </div>
        </el-tab-pane>

        <!-- 配额管理 -->
        <el-tab-pane label="配额管理" name="quota">
          <div class="quota-search">
            <el-input-number v-model="quotaUserId" :min="1" placeholder="用户 ID" />
            <el-button type="primary" @click="loadQuota">查询配额</el-button>
          </div>

          <el-empty v-if="!quota" description="请先查询用户配额" />

          <div v-else class="quota-detail">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="日限额">{{ quota.daily_limit }}</el-descriptions-item>
              <el-descriptions-item label="今日已用">{{ quota.used_today }}</el-descriptions-item>
              <el-descriptions-item label="月限额">{{ quota.monthly_limit }}</el-descriptions-item>
              <el-descriptions-item label="本月已用">{{ quota.used_month }}</el-descriptions-item>
              <el-descriptions-item label="总限额">{{ quota.total_limit || '不限制' }}</el-descriptions-item>
              <el-descriptions-item label="总计已用">{{ quota.used_total }}</el-descriptions-item>
              <el-descriptions-item label="上次重置日期">{{ quota.last_reset_date }}</el-descriptions-item>
              <el-descriptions-item label="上次重置月份">{{ quota.last_reset_month }}</el-descriptions-item>
            </el-descriptions>

            <el-divider content-position="left">修改配额</el-divider>

            <el-form :model="quotaForm" label-width="100px" class="quota-form">
              <el-row :gutter="24">
                <el-col :xs="24" :md="8">
                  <el-form-item label="日限额">
                    <el-input-number v-model="quotaForm.daily_limit" :min="0" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="8">
                  <el-form-item label="月限额">
                    <el-input-number v-model="quotaForm.monthly_limit" :min="0" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="8">
                  <el-form-item label="总限额">
                    <el-input-number v-model="quotaForm.total_limit" :min="0" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="updateQuota">保存配额</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 会话消息弹窗 -->
    <el-dialog
      v-model="messageDialogVisible"
      :title="`会话消息 - ${currentSession?.title || ''}`"
      width="760px"
      :close-on-click-modal="false"
    >
      <el-table :data="messages" size="small" max-height="400">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="role" label="角色" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'user' ? 'primary' : 'success'" size="small">
              {{ scope.row.role === 'user' ? '用户' : '助手' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="created_at" label="时间" width="160" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-button link type="danger" size="small" @click="removeMessage(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAIConfig,
  updateAIConfig,
  cleanupChatRecords,
  getSessions,
  getSessionMessages,
  deleteSession,
  deleteMessage,
  getUserQuota,
  setUserQuota
} from '@/api/aiChat'

const loading = ref(false)
const activeTab = ref('config')

// 配置管理
const configFormRef = ref(null)
const defaultConfig = {
  provider: 'openai',
  api_key: '',
  api_base_url: '',
  model: '',
  system_prompt: '',
  max_context_messages: 10,
  daily_global_limit: 100,
  retention_days: 30,
  enabled: 1,
  guest_allowed: 1,
  guest_daily_limit: 20,
  default_daily_limit: 50,
  default_monthly_limit: 500,
  default_total_limit: 0,
  temperature: 0.7,
  max_tokens: 2048
}
const configForm = ref({ ...defaultConfig })
const cleanupResult = ref(null)

const loadConfig = async () => {
  loading.value = true
  try {
    const res = await getAIConfig()
    const data = res.data?.data || {}
    configForm.value = { ...defaultConfig, ...data }
    if (configForm.value.api_key && configForm.value.api_key.includes('****')) {
      configForm.value.api_key = ''
    }
  } catch (error) {
    ElMessage.error('加载 AI 配置失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const saveConfig = async () => {
  const payload = { ...configForm.value }
  if (!payload.api_key || payload.api_key.includes('****')) {
    delete payload.api_key
  }
  loading.value = true
  try {
    await updateAIConfig(payload)
    ElMessage.success('AI 配置保存成功')
    await loadConfig()
  } catch (error) {
    ElMessage.error('保存 AI 配置失败: ' + (error.response?.data?.error || error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const handleCleanup = async () => {
  try {
    await ElMessageBox.confirm('确定要立即清理过期聊天记录吗？', '提示', { type: 'warning' })
    loading.value = true
    const res = await cleanupChatRecords()
    cleanupResult.value = res.data?.data || null
    ElMessage.success('清理完成')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清理失败: ' + (error.response?.data?.error || error.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

// 会话管理
const sessions = ref([])
const sessionPage = ref(1)
const sessionLimit = ref(20)
const sessionTotal = ref(0)

const loadSessions = async () => {
  loading.value = true
  try {
    const res = await getSessions({ page: sessionPage.value, limit: sessionLimit.value })
    sessions.value = res.data?.data || []
    const pagination = res.data?.pagination || {}
    sessionTotal.value = pagination.total || 0
  } catch (error) {
    ElMessage.error('加载会话列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const messageDialogVisible = ref(false)
const currentSession = ref(null)
const messages = ref([])

const viewMessages = async (row) => {
  currentSession.value = row
  loading.value = true
  try {
    const res = await getSessionMessages(row.id)
    messages.value = res.data?.data?.messages || []
    messageDialogVisible.value = true
  } catch (error) {
    ElMessage.error('加载会话消息失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const removeSession = async (row) => {
  try {
    await ElMessageBox.confirm('删除会话将同时删除其下所有消息，是否继续？', '提示', { type: 'warning' })
    await deleteSession(row.id)
    ElMessage.success('会话删除成功')
    loadSessions()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败: ' + (error.response?.data?.error || error.message || '未知错误'))
    }
  }
}

const removeMessage = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除这条消息吗？', '提示', { type: 'warning' })
    await deleteMessage(row.id)
    ElMessage.success('消息删除成功')
    if (currentSession.value) {
      const res = await getSessionMessages(currentSession.value.id)
      messages.value = res.data?.data?.messages || []
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败: ' + (error.response?.data?.error || error.message || '未知错误'))
    }
  }
}

// 配额管理
const quotaUserId = ref(null)
const quota = ref(null)
const quotaForm = ref({
  daily_limit: 0,
  monthly_limit: 0,
  total_limit: 0
})

const loadQuota = async () => {
  if (!quotaUserId.value) {
    ElMessage.warning('请输入用户 ID')
    return
  }
  loading.value = true
  try {
    const res = await getUserQuota(quotaUserId.value)
    quota.value = res.data?.data || null
    if (quota.value) {
      quotaForm.value = {
        daily_limit: quota.value.daily_limit,
        monthly_limit: quota.value.monthly_limit,
        total_limit: quota.value.total_limit
      }
    }
  } catch (error) {
    ElMessage.error('加载配额失败: ' + (error.response?.data?.error || error.message || '未知错误'))
    quota.value = null
  } finally {
    loading.value = false
  }
}

const updateQuota = async () => {
  if (!quotaUserId.value) {
    ElMessage.warning('请先查询用户配额')
    return
  }
  loading.value = true
  try {
    await setUserQuota(quotaUserId.value, quotaForm.value)
    ElMessage.success('配额设置成功')
    await loadQuota()
  } catch (error) {
    ElMessage.error('设置配额失败: ' + (error.response?.data?.error || error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadConfig()
  loadSessions()
})
</script>

<style scoped>
.ai-chat-control {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.management-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

.config-form {
  max-width: 900px;
}

.cleanup-alert {
  margin-top: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.quota-search {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.quota-detail {
  max-width: 800px;
}

.quota-form {
  margin-top: 16px;
}

:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
