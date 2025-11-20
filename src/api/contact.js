import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000
})

// 提交联系表单
export const submitContactForm = (data) => {
  return apiClient.post('/contact', data)
}

// 获取所有联系信息
export const getContactMessages = () => {
  return apiClient.get('/contact')
}

// 获取特定联系信息
export const getContactMessageById = (id) => {
  return apiClient.get(`/contact/${id}`)
}

// 删除联系信息
export const deleteContactMessage = (id) => {
  return apiClient.delete(`/contact/${id}`)
}