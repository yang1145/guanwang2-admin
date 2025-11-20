import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 获取所有产品
export const getProducts = () => {
  return apiClient.get('/products')
}

// 获取特定产品详情
export const getProductById = (id) => {
  return apiClient.get(`/products/${id}`)
}

// 创建新产品
export const createProduct = (data) => {
  return apiClient.post('/products', data)
}

// 更新产品
export const updateProduct = (id, data) => {
  return apiClient.put(`/products/${id}`, data)
}

// 删除产品
export const deleteProduct = (id) => {
  return apiClient.delete(`/products/${id}`)
}