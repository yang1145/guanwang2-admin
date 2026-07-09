<template>
  <div class="role-management">
    <el-card class="management-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">权限组管理</div>
          <div class="header-actions">
            <el-button type="primary" @click="handleAdd">新增权限组</el-button>
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
        <el-table-column prop="name" label="权限组名称" min-width="140"></el-table-column>
        <el-table-column prop="description" label="描述" min-width="200">
          <template #default="{ row }">
            <span style="color: #999">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleAssignPermission(row)">分配权限</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑权限组' : '新增权限组'"
      width="420px"
      :close-on-click-modal="false"
      @close="handleCloseDialog"
    >
      <el-form ref="formRef" :model="formModel" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入权限组名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formModel.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配权限弹窗 -->
    <el-dialog
      v-model="permDialogVisible"
      title="分配权限"
      width="520px"
      :close-on-click-modal="false"
      @close="handleClosePermDialog"
    >
      <el-checkbox-group v-model="selectedPermIds">
        <div v-for="perm in allPermissions" :key="perm.id" class="perm-item">
          <el-checkbox :label="perm.id" :value="perm.id">
            <span class="perm-name">{{ perm.name }}</span>
            <span class="perm-code">{{ perm.code }}</span>
          </el-checkbox>
        </div>
      </el-checkbox-group>
      <el-empty v-if="allPermissions.length === 0" description="暂无可用权限" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClosePermDialog">取消</el-button>
          <el-button type="primary" @click="submitPermissions">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoles, createRole, updateRole, deleteRole, getRoleById, assignPermissions } from '@/api/roles'
import { getPermissions } from '@/api/permissions'

const loading = ref(false)
const tableData = ref([])

// 新增/编辑弹窗
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const formRef = ref(null)
const formModel = ref({ name: '', description: '' })
const rules = {
  name: [{ required: true, message: '请输入权限组名称', trigger: 'blur' }]
}

// 分配权限弹窗
const permDialogVisible = ref(false)
const currentRoleId = ref(null)
const allPermissions = ref([])
const selectedPermIds = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await getRoles()
    tableData.value = res.data?.data || []
  } catch (error) {
    ElMessage.error('加载权限组列表失败: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const loadAllPermissions = async () => {
  try {
    const res = await getPermissions()
    allPermissions.value = res.data?.data || []
  } catch (error) {
    // 权限加载失败不影响主流程
  }
}

const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  formModel.value = { name: '', description: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editingId.value = row.id
  formModel.value = { name: row.name, description: row.description || '' }
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
        name: formModel.value.name,
        description: formModel.value.description || undefined
      }
      if (isEdit.value) {
        await updateRole(editingId.value, payload)
        ElMessage.success('权限组更新成功')
      } else {
        await createRole(payload)
        ElMessage.success('权限组创建成功')
      }
      handleCloseDialog()
      loadData()
    } catch (error) {
      ElMessage.error('操作失败: ' + (error.response?.data?.error || error.message))
    }
  })
}

const handleAssignPermission = async (row) => {
  currentRoleId.value = row.id
  try {
    const res = await getRoleById(row.id)
    const perms = res.data?.data?.permissions || []
    selectedPermIds.value = perms.map(p => p.id)
  } catch (error) {
    selectedPermIds.value = []
  }
  permDialogVisible.value = true
}

const handleClosePermDialog = () => {
  permDialogVisible.value = false
  currentRoleId.value = null
  selectedPermIds.value = []
}

const submitPermissions = async () => {
  try {
    await assignPermissions(currentRoleId.value, selectedPermIds.value)
    ElMessage.success('权限分配成功')
    handleClosePermDialog()
    loadData()
  } catch (error) {
    ElMessage.error('权限分配失败: ' + (error.response?.data?.error || error.message))
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该权限组吗？关联的管理员角色将被解除。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRole(id)
      ElMessage.success('权限组删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败: ' + (error.response?.data?.error || error.message))
    }
  }).catch(() => {})
}

onMounted(() => {
  loadData()
  loadAllPermissions()
})
</script>

<style scoped>
.role-management { }

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

.perm-item {
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.perm-item:last-child {
  border-bottom: none;
}

.perm-name {
  margin-right: 8px;
}

.perm-code {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}
</style>
