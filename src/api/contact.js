import authRequest from '@/utils/authRequest'

// 提交联系表单
export const submitContactForm = (data) => {
  return authRequest.post('/contact', data)
}

// 获取所有联系信息
export const getContactMessages = () => {
  return authRequest.get('/contact')
}

// 获取特定联系信息
export const getContactMessageById = (id) => {
  return authRequest.get(`/contact/${id}`)
}

// 删除联系信息
export const deleteContactMessage = (id) => {
  return authRequest.delete(`/contact/${id}`)
}
