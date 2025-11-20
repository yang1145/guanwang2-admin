import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 获取所有分类
export const getCategories = () => {
  return apiClient.get('/categories')
}

// 获取特定分类
export const getCategoryById = (id) => {
  return apiClient.get(`/categories/${id}`)
}

// 创建分类
export const createCategory = (data) => {
  return apiClient.post('/categories', data)
}

// 更新分类
export const updateCategory = (id, data) => {
  return apiClient.put(`/categories/${id}`, data)
}

// 更新分类列表
export const updateCategories = (data) => {
  return apiClient.put('/categories', data)
}

// 删除分类
export const deleteCategory = (id) => {
  return apiClient.delete(`/categories/${id}`)
}

// 同步分类
export const syncCategories = () => {
  return apiClient.post('/categories/sync')
}