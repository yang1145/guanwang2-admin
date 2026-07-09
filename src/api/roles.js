import authRequest from '@/utils/authRequest'

// 获取所有角色
export const getRoles = () => {
  return authRequest.get('/admin/roles')
}

// 获取角色详情（含权限）
export const getRoleById = (id) => {
  return authRequest.get(`/admin/roles/${id}`)
}

// 创建角色
export const createRole = (data) => {
  return authRequest.post('/admin/roles', data)
}

// 更新角色
export const updateRole = (id, data) => {
  return authRequest.put(`/admin/roles/${id}`, data)
}

// 删除角色
export const deleteRole = (id) => {
  return authRequest.delete(`/admin/roles/${id}`)
}

// 为角色分配权限
export const assignPermissions = (id, permissionIds) => {
  return authRequest.put(`/admin/roles/${id}/permissions`, { permissionIds })
}
