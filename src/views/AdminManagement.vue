<template>
  <div class="admin-management">
    <el-card class="management-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">管理员管理</div>
          <div class="header-actions">
            <el-button type="primary" @click="handleAdd">新增管理员</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" min-width="120"></el-table-column>
        <el-table-column prop="role_name" label="所属角色" min-width="140">
          <template #default="{ row }">
            <el-tag v-if="row.role_name" size="small">{{ row.role_name }}</el-tag>
            <span v-else style="color: #999">未分配</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑管理员' : '新增管理员'"
      width="420px"
      :close-on-click-modal="false"
      @close="handleCloseDialog"
    >
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formModel.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '请输入密码'"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="formModel.roleId" placeholder="请选择角色" style="width: 100%" clearable>
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/api/adminAccounts'
import { getRoles } from '@/api/roles'

const loading = ref(false)
const tableData = ref([])
const roleList = ref([])

// 弹窗
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const formModel = ref({
  username: '',
  password: '',
  roleId: null
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名至少3位', trigger: 'blur' }
  ],
  password: []
}

const loadData = async () => {
  loading.value = true
  try {
    const res = await getAdmins()
    tableData.value = res.data?.data || []
  } catch (error) {
    ElMessage.error('加载管理员列表失败: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const res = await getRoles()
    roleList.value = res.data?.data || []
  } catch (error) {
    // 角色加载失败不影响主流程
  }
}

const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  formModel.value = { username: '', password: '', roleId: null }
  rules.password = [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码至少6位', trigger: 'blur' }]
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editingId.value = row.id
  formModel.value = {
    username: row.username,
    password: '',
    roleId: row.role_id || null
  }
  rules.password = []
  dialogVisible.value = true
}

const handleCloseDialog = () => {
  dialogVisible.value = false
  formRef.value?.resetFields()
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const payload = {
        username: formModel.value.username,
        roleId: formModel.value.roleId || undefined
      }
      if (formModel.value.password) {
        payload.password = formModel.value.password
      }
      if (isEdit.value) {
        await updateAdmin(editingId.value, payload)
        ElMessage.success('管理员更新成功')
      } else {
        await createAdmin(payload)
        ElMessage.success('管理员创建成功')
      }
      handleCloseDialog()
      loadData()
    } catch (error) {
      ElMessage.error('操作失败: ' + (error.response?.data?.error || error.message))
    }
  })
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该管理员吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAdmin(id)
      ElMessage.success('管理员删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败: ' + (error.response?.data?.error || error.message))
    }
  }).catch(() => {})
}

onMounted(() => {
  loadData()
  loadRoles()
})
</script>

<style scoped>
.admin-management { }

.management-card {
  border: none;
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
</style>
