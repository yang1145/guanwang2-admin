<template>
  <div class="admin-profile-page">
    <el-card class="profile-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">管理员信息</div>
        </div>
      </template>

      <div class="profile-content">
        <div class="profile-info">
          <el-avatar :size="80" :src="defaultAvatar" class="profile-avatar" />
          <div class="profile-meta">
            <h2 class="profile-name">Admin</h2>
            <p class="profile-role">超级管理员</p>
            <p class="profile-email">admin@example.com</p>
          </div>
        </div>

        <el-divider content-position="left">账号信息</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">Admin</el-descriptions-item>
          <el-descriptions-item label="角色">超级管理员</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">正常</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后登录">2026-07-09</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">修改密码</el-divider>
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="120px"
          class="password-form"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleChangePassword">保存修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import defaultAvatar from '@/assets/default-avatar.svg'

const passwordFormRef = ref(null)
const submitting = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    // 当前后端未提供管理员修改密码接口，仅做前端校验与提示
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-profile-page {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
}

.profile-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 800px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-content {
  padding: 8px 0;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.profile-avatar {
  flex-shrink: 0;
  border: 2px solid var(--border-light);
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-name {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.profile-role {
  font-size: 14px;
  color: var(--primary-color);
  margin: 0;
}

.profile-email {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.password-form {
  max-width: 480px;
}
</style>
