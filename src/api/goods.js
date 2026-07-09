import authRequest from '@/utils/authRequest'

// 获取所有商品
export const getGoods = () => {
  return authRequest.get('/goods')
}

// 获取特定商品详情
export const getGoodById = (id) => {
  return authRequest.get(`/goods/${id}`)
}

// 创建新商品
export const createGood = (data) => {
  return authRequest.post('/goods', data)
}

// 更新商品
export const updateGood = (id, data) => {
  return authRequest.put(`/goods/${id}`, data)
}

// 删除商品
export const deleteGood = (id) => {
  return authRequest.delete(`/goods/${id}`)
}
