import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 5000
})

// 获取网站配置信息
export const getSiteConfig = () => {
  return apiClient.get('/site-config')
}

// 更新网站配置信息
export const updateSiteConfig = (data) => {
  return apiClient.put('/site-config', data)
}