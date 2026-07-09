import authRequest from '@/utils/authRequest'

// 获取所有权限列表
export const getPermissions = () => {
  return authRequest.get('/admin/permissions')
}

// 获取当前管理员的权限
export const getMyPermissions = () => {
  return authRequest.get('/admin/permissions/mine')
}
