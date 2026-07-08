<template>
  <div class="ai-chat-page">
    <el-card class="chat-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">AI 聊天测试</div>
          <div class="header-actions">
            <el-button size="small" @click="startNewChat">新对话</el-button>
            <el-button size="small" type="danger" plain @click="clearChat">清空</el-button>
          </div>
        </div>
      </template>

      <div class="chat-body">
        <div ref="messageListRef" class="message-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message-row"
            :class="msg.role === 'user' ? 'user-row' : 'assistant-row'"
          >
            <div class="message-bubble" :class="msg.role === 'user' ? 'user-bubble' : 'assistant-bubble'">
              <div class="message-role">{{ msg.role === 'user' ? '我' : 'AI' }}</div>
              <div class="message-content">{{ msg.content }}</div>
            </div>
          </div>

          <div v-if="aiLoading" class="message-row assistant-row">
            <div class="message-bubble assistant-bubble">
              <div class="message-role">AI</div>
              <div class="message-content loading-dots">思考中</div>
            </div>
          </div>

          <el-empty v-if="!messages.length && !aiLoading" description="开始一个新的对话吧" />
        </div>

        <div class="chat-input-area">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="2"
            placeholder="请输入消息，按 Ctrl + Enter 发送"
            resize="none"
            :disabled="aiLoading"
            @keydown.ctrl.enter.prevent="handleSend"
          />
          <el-button
            type="primary"
            :loading="aiLoading"
            :disabled="!inputMessage.trim()"
            @click="handleSend"
          >
            发送
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  createGuestSession,
  getGuestSessionMessages,
  sendGuestMessage
} from '@/api/aiChat'

const STORAGE_TOKEN_KEY = 'ai_guest_token'
const STORAGE_SESSION_KEY = 'ai_guest_session_id'

const messages = ref([])
const inputMessage = ref('')
const aiLoading = ref(false)
const guestToken = ref('')
const sessionId = ref(null)
const messageListRef = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    const el = messageListRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

const loadGuestSession = async () => {
  aiLoading.value = true
  try {
    const res = await createGuestSession()
    const data = res.data?.data || {}
    guestToken.value = data.guest_token
    sessionId.value = data.session_id
    localStorage.setItem(STORAGE_TOKEN_KEY, guestToken.value)
    localStorage.setItem(STORAGE_SESSION_KEY, String(sessionId.value))
    messages.value = []
  } catch (error) {
    ElMessage.error('创建会话失败: ' + (error.response?.data?.error || error.message || '未知错误'))
  } finally {
    aiLoading.value = false
  }
}

const restoreSession = async () => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY)
  const id = localStorage.getItem(STORAGE_SESSION_KEY)
  if (!token || !id) {
    return
  }
  guestToken.value = token
  sessionId.value = Number(id)
  aiLoading.value = true
  try {
    const res = await getGuestSessionMessages(sessionId.value, guestToken.value)
    const data = res.data?.data || {}
    const list = data.messages || []
    messages.value = list.map(item => ({
      role: item.role,
      content: item.content
    }))
    scrollToBottom()
  } catch (error) {
    // 会话已过期则重建
    localStorage.removeItem(STORAGE_TOKEN_KEY)
    localStorage.removeItem(STORAGE_SESSION_KEY)
    await loadGuestSession()
  } finally {
    aiLoading.value = false
  }
}

const startNewChat = async () => {
  localStorage.removeItem(STORAGE_TOKEN_KEY)
  localStorage.removeItem(STORAGE_SESSION_KEY)
  messages.value = []
  inputMessage.value = ''
  await loadGuestSession()
}

const clearChat = () => {
  messages.value = []
}

const handleSend = async () => {
  const content = inputMessage.value.trim()
  if (!content || aiLoading.value) return

  messages.value.push({ role: 'user', content })
  inputMessage.value = ''
  aiLoading.value = true
  scrollToBottom()

  try {
    if (!guestToken.value || !sessionId.value) {
      await loadGuestSession()
    }

    const res = await sendGuestMessage(sessionId.value, content, guestToken.value)
    const data = res.data?.data || {}
    const userMessage = data.user_message
    const assistantMessage = data.assistant_message

    if (userMessage && messages.value[messages.value.length - 1]?.role !== 'user') {
      messages.value.push({
        role: userMessage.role,
        content: userMessage.content
      })
    }

    if (assistantMessage) {
      messages.value.push({
        role: assistantMessage.role,
        content: assistantMessage.content
      })
    }
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: '发送失败：' + (error.response?.data?.error || error.message || '未知错误')
    })
  } finally {
    aiLoading.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  restoreSession()
})
</script>

<style scoped>
.ai-chat-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.chat-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 112px);
}

.chat-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
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

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fafafa;
}

.message-row {
  display: flex;
  margin-bottom: 16px;
}

.user-row {
  justify-content: flex-end;
}

.assistant-row {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 8px;
  line-height: 1.6;
  word-break: break-word;
}

.user-bubble {
  background-color: var(--primary-color);
  color: #fff;
}

.assistant-bubble {
  background-color: #fff;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.message-role {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  opacity: 0.85;
}

.message-content {
  font-size: 14px;
  white-space: pre-wrap;
}

.loading-dots::after {
  content: '...';
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.chat-input-area {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background-color: #fff;
  border-top: 1px solid var(--border-light);
}

.chat-input-area :deep(.el-textarea__inner) {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .ai-chat-page {
    padding: 16px;
  }

  .chat-card {
    height: calc(100vh - 96px);
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style>
