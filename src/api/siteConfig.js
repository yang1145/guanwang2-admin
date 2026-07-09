import authRequest from '@/utils/authRequest'

// 获取网站配置信息
export const getSiteConfig = () => {
  return authRequest.get('/site-config')
}

// 更新网站配置信息
export const updateSiteConfig = (data) => {
  return authRequest.put('/site-config', data)
}
