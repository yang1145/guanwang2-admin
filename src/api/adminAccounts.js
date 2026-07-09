import authRequest from '@/utils/authRequest'

// 获取所有管理员
export const getAdmins = () => {
  return authRequest.get('/admin/accounts')
}

// 获取单个管理员
export const getAdminById = (id) => {
  return authRequest.get(`/admin/accounts/${id}`)
}

// 创建管理员
export const createAdmin = (data) => {
  return authRequest.post('/admin/accounts', data)
}

// 更新管理员
export const updateAdmin = (id, data) => {
  return authRequest.put(`/admin/accounts/${id}`, data)
}

// 删除管理员
export const deleteAdmin = (id) => {
  return authRequest.delete(`/admin/accounts/${id}`)
}
