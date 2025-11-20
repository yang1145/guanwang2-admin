import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 获取用户列表
export const getUsers = () => {
  return apiClient.get('/users')
}

// 获取特定用户信息
export const getUserById = (id) => {
  return apiClient.get(`/users/${id}`)
}

// 更新用户信息
export const updateUser = (id, data) => {
  return apiClient.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`)
}