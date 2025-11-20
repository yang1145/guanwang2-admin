import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 管理员登录
export const adminLogin = (data) => {
  return apiClient.post('/admin/login', data)
}

// 获取管理员信息
export const getAdminInfo = (username) => {
  return apiClient.get(`/admin/info/${username}`)
}

// 修改管理员密码
export const changeAdminPassword = (data) => {
  return apiClient.put('/admin/change-password', data)
}