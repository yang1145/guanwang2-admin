import authRequest from '@/utils/authRequest'

// 获取所有新闻
export const getNews = (params) => {
  return authRequest.get('/news', { params })
}

// 获取特定新闻详情
export const getNewsById = (id) => {
  return authRequest.get(`/news/${id}`)
}

// 获取热门新闻
export const getPopularNews = () => {
  return authRequest.get('/news/popular')
}

// 创建新闻
export const createNews = (data) => {
  return authRequest.post('/news', data)
}

// 更新新闻
export const updateNews = (id, data) => {
  return authRequest.put(`/news/${id}`, data)
}

// 删除新闻
export const deleteNews = (id) => {
  return authRequest.delete(`/news/${id}`)
}
