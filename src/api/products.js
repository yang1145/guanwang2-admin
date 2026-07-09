import authRequest from '@/utils/authRequest'

// 获取所有产品
export const getProducts = () => {
  return authRequest.get('/products')
}

// 获取特定产品详情
export const getProductById = (id) => {
  return authRequest.get(`/products/${id}`)
}

// 创建新产品
export const createProduct = (data) => {
  return authRequest.post('/products', data)
}

// 更新产品
export const updateProduct = (id, data) => {
  return authRequest.put(`/products/${id}`, data)
}

// 删除产品
export const deleteProduct = (id) => {
  return authRequest.delete(`/products/${id}`)
}
