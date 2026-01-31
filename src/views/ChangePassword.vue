<template>
  <div class="change-password-container">
    <el-card class="password-card" shadow="never">
      <div class="card-content">
        <div class="header-section">
          <div class="icon-wrapper">
            <el-icon><Lock /></el-icon>
          </div>
          <h2 class="title">修改密码</h2>
          <p class="subtitle">为了您的账户安全，建议定期更换密码</p>
        </div>
        
        <el-form 
          :model="passwordForm" 
          :rules="rules" 
          ref="passwordFormRef" 
          label-position="top"
          class="password-form"
          size="large"
        >
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input 
              v-model="passwordForm.currentPassword" 
              type="password" 
              show-password
              placeholder="请输入当前使用的密码"
              prefix-icon="Key"
            />
          </el-form-item>
          
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="passwordForm.newPassword" 
              type="password" 
              show-password
              placeholder="请输入新密码（至少6位）"
              prefix-icon="Lock"
            />
          </el-form-item>
          
          <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input 
              v-model="passwordForm.confirmNewPassword" 
              type="password" 
              show-password
              placeholder="请再次输入新密码"
              prefix-icon="Check"
            />
          </el-form-item>
          
          <el-form-item class="form-actions">
            <el-button type="primary" @click="submitForm" :loading="loading" class="submit-btn">
              确认修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { changeAdminPassword } from '@/api/admin'
import { Lock, Key, Check } from '@element-plus/icons-vue'

const loading = ref(false)
const passwordFormRef = ref(null)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

// 表单验证规则
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmNewPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 提交表单
const submitForm = async () => {
  try {
    await passwordFormRef.value.validate()
    loading.value = true
    
    const requestData = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmNewPassword: passwordForm.confirmNewPassword
    }
    
    await changeAdminPassword(requestData)
    ElMessage.success('密码修改成功，请重新登录')
    
    // 清空表单
    passwordFormRef.value.resetFields()
    
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      ElMessage.error('修改失败: ' + error.response.data.error)
    } else {
      ElMessage.error('修改失败: ' + (error.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}

.password-card {
  width: 100%;
  max-width: 480px;
  border: none;
  box-shadow: var(--shadow-sm);
}

.card-content {
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  background-color: #e6f7ff;
  color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
}

.title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.password-form {
  margin-top: 24px;
}

.submit-btn {
  width: 100%;
  margin-top: 12px;
}

.form-actions {
  margin-bottom: 0;
}

@media (max-width: 576px) {
  .change-password-container {
    padding-top: 0;
  }
  
  .password-card {
    box-shadow: none;
  }
}
</style>
