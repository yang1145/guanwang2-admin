import authRequest from '@/utils/authRequest'

// 获取部门列表
export const getTicketDepartments = () => {
  return authRequest.get('/admin/ticket-departments')
}

// 获取工单列表
export const getTickets = (params) => {
  return authRequest.get('/admin/tickets', { params })
}

// 获取工单详情
export const getTicketById = (id) => {
  return authRequest.get(`/admin/tickets/${id}`)
}

// 回复工单
export const replyTicket = (id, content) => {
  return authRequest.post(`/admin/tickets/${id}/reply`, { content })
}

// 接手工单
export const assignTicket = (id) => {
  return authRequest.put(`/admin/tickets/${id}/assign`)
}

// 转交工单
export const transferTicket = (id, data) => {
  return authRequest.put(`/admin/tickets/${id}/transfer`, data)
}

// 关闭工单
export const closeTicket = (id) => {
  return authRequest.put(`/admin/tickets/${id}/close`)
}

// 工单统计
export const getTicketStats = () => {
  return authRequest.get('/admin/tickets/stats')
}
