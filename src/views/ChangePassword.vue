<template>
  <div class="change-password">
    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>
      
      <el-form 
        :model="passwordForm" 
        :rules="rules" 
        ref="passwordFormRef" 
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            show-password
            placeholder="请输入当前密码"
          />
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input 
            v-model="passwordForm.confirmNewPassword" 
            type="password" 
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading">
            {{ loading ? '提交中...' : '确认修改' }}
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { changeAdminPassword } from '@/api/admin'

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
    ElMessage.success('密码修改成功')
    resetForm()
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

// 重置表单
const resetForm = () => {
  passwordFormRef.value.resetFields()
}
</script>

<style scoped>
.change-password {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100%;
  box-sizing: border-box;
}

.password-card {
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 18px;
  font-weight: 500;
}

.password-form {
  margin-top: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>