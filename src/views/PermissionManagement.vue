<template>
  <div class="permission-management">
    <el-card class="management-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">权限管理</div>
          <span class="header-tip">系统预置权限列表，由后端定义</span>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="name" label="权限名称" min-width="160"></el-table-column>
        <el-table-column prop="code" label="权限代码" min-width="200">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ row.code }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="260">
          <template #default="{ row }">
            <span style="color: #999">{{ row.description || '-' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPermissions } from '@/api/permissions'

const loading = ref(false)
const tableData = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await getPermissions()
    tableData.value = res.data?.data || []
  } catch (error) {
    ElMessage.error('加载权限列表失败: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.permission-management { }

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

.header-tip {
  font-size: 13px;
  color: #999;
}
</style>
