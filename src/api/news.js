import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 获取所有新闻
export const getNews = (params) => {
  return apiClient.get('/news', { params })
}

// 获取特定新闻详情
export const getNewsById = (id) => {
  return apiClient.get(`/news/${id}`)
}

// 获取热门新闻
export const getPopularNews = () => {
  return apiClient.get('/news/popular')
}

// 创建新闻
export const createNews = (data) => {
  return apiClient.post('/news', data)
}

// 更新新闻
export const updateNews = (id, data) => {
  return apiClient.put(`/news/${id}`, data)
}

// 删除新闻
export const deleteNews = (id) => {
  return apiClient.delete(`/news/${id}`)
}