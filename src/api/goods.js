import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 获取所有商品
export const getGoods = () => {
  return apiClient.get('/goods')
}

// 获取特定商品详情
export const getGoodById = (id) => {
  return apiClient.get(`/goods/${id}`)
}

// 创建新商品
export const createGood = (data) => {
  return apiClient.post('/goods', data)
}

// 更新商品
export const updateGood = (id, data) => {
  return apiClient.put(`/goods/${id}`, data)
}

// 删除商品
export const deleteGood = (id) => {
  return apiClient.delete(`/goods/${id}`)
}