import authRequest from '@/utils/authRequest'

// 获取所有分类
export const getCategories = () => {
  return authRequest.get('/categories')
}

// 获取特定分类
export const getCategoryById = (id) => {
  return authRequest.get(`/categories/${id}`)
}

// 创建分类
export const createCategory = (data) => {
  return authRequest.post('/categories', data)
}

// 更新分类
export const updateCategory = (id, data) => {
  return authRequest.put(`/categories/${id}`, data)
}

// 更新分类列表
export const updateCategories = (data) => {
  return authRequest.put('/categories', data)
}

// 删除分类
export const deleteCategory = (id) => {
  return authRequest.delete(`/categories/${id}`)
}

// 同步分类
export const syncCategories = () => {
  return authRequest.post('/categories/sync')
}
