<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <div class="login-bg-content">
          <img src="@/assets/vue.svg" alt="Logo" class="login-logo-large" />
          <h1 class="login-title-large">管理后台系统</h1>
          <p class="login-desc">简洁、高效、专业的管理平台</p>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <h2>欢迎登录</h2>
            <p>请输入您的账号和密码</p>
          </div>
          
          <el-form 
            ref="loginFormRef" 
            :model="loginForm" 
            :rules="loginRules" 
            class="login-form"
            @submit.prevent="handleLogin"
            size="large"
          >
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="用户名" 
                prefix-icon="User"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="密码" 
                prefix-icon="Lock"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                class="login-button"
                :loading="loading"
                @click="handleLogin"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adminLogin } from '@/api/admin.js'
import { useRouter } from 'vue-router'

const loginFormRef = ref()
const loading = ref(false)
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const response = await adminLogin({
          username: loginForm.username,
          password: loginForm.password
        })
        
        ElMessage.success('登录成功')
        router.push('/admin')
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error(error.response?.data?.error || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content {
  width: 1000px;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1890FF 0%, #36cfc9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* 装饰背景圆圈 */
.login-left::before {
  content: '';
  position: absolute;
  top: -20%;
  left: -20%;
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.login-left::after {
  content: '';
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 50%;
  height: 50%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.login-bg-content {
  text-align: center;
  color: #fff;
  z-index: 1;
}

.login-logo-large {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
}

.login-title-large {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  letter-spacing: 2px;
}

.login-desc {
  font-size: 16px;
  opacity: 0.9;
  letter-spacing: 1px;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-box {
  width: 100%;
  max-width: 360px;
}

.login-header {
  margin-bottom: 40px;
  text-align: left;
}

.login-header h2 {
  font-size: 28px;
  color: #1f2d3d;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: #909399;
  font-size: 14px;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  background-color: #fff;
  transition: all 0.3s;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 16px;
  letter-spacing: 2px;
}

@media (max-width: 992px) {
  .login-content {
    width: 90%;
    height: auto;
    min-height: 500px;
  }
  
  .login-left {
    display: none;
  }
  
  .login-right {
    padding: 60px 40px;
  }
}
</style>
