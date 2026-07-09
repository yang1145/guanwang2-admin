import axios from 'axios'
import authRequest from '@/utils/authRequest'

const guestClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000
})

// 获取 AI 配置
export const getAIConfig = () => {
  return authRequest.get('/ai-chat/admin/config')
}

// 更新 AI 配置
export const updateAIConfig = (data) => {
  return authRequest.put('/ai-chat/admin/config', data)
}

// 立即清理聊天记录
export const cleanupChatRecords = () => {
  return authRequest.post('/ai-chat/admin/cleanup')
}

// 获取所有会话
export const getSessions = (params) => {
  return authRequest.get('/ai-chat/admin/sessions', { params })
}

// 获取某会话消息
export const getSessionMessages = (id) => {
  return authRequest.get(`/ai-chat/admin/sessions/${id}/messages`)
}

// 删除会话
export const deleteSession = (id) => {
  return authRequest.delete(`/ai-chat/admin/sessions/${id}`)
}

// 删除单条消息
export const deleteMessage = (id) => {
  return authRequest.delete(`/ai-chat/admin/messages/${id}`)
}

// 获取用户配额
export const getUserQuota = (userId) => {
  return authRequest.get(`/ai-chat/admin/quotas/${userId}`)
}

// 设置用户配额
export const setUserQuota = (userId, data) => {
  return authRequest.put(`/ai-chat/admin/quotas/${userId}`, data)
}

// 创建访客会话（无需 admin token）
export const createGuestSession = () => {
  return guestClient.post('/ai-chat/guest/sessions')
}

// 获取访客会话消息（使用 guest token）
export const getGuestSessionMessages = (id, guestToken) => {
  return guestClient.get(`/ai-chat/guest/sessions/${id}/messages`, {
    headers: {
      Authorization: `Bearer ${guestToken}`
    }
  })
}

// 访客发送消息（AI 响应可能较慢，单独设置较长超时）
export const sendGuestMessage = (id, content, guestToken) => {
  return guestClient.post(
    `/ai-chat/guest/sessions/${id}/messages`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${guestToken}`
      },
      timeout: 120000
    }
  )
}
