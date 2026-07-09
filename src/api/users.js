import authRequest from '@/utils/authRequest'

// 获取用户列表
export const getUsers = () => {
  return authRequest.get('/users')
}

// 获取用户总数
export const getUserCount = () => {
  return authRequest.get('/users/count')
}

// 获取特定用户信息
export const getUserById = (id) => {
  return authRequest.get(`/users/${id}`)
}

// 更新用户信息
export const updateUser = (id, data) => {
  return authRequest.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id) => {
  return authRequest.delete(`/users/${id}`)
}

export const createUser = (data) => {
  return authRequest.post('/users/register', data)
}