<template>
  <div class="user-management">
    <el-card class="management-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">用户管理</div>
          <div class="header-actions">
            <el-button type="primary" icon="Plus">新增用户</el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索/筛选区域 (可选，预留位置) -->
      <div class="filter-container">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户..."
          style="width: 240px"
          prefix-icon="Search"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" plain @click="handleSearch">搜索</el-button>
      </div>
      
      <!-- 用户列表 -->
      <el-table 
        :data="users" 
        v-loading="loading" 
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#606266' }"
      >
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180"></el-table-column>
        <el-table-column prop="created_at" label="注册时间" min-width="180"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button link type="danger" size="small" @click="removeUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :background="true"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, deleteUser } from '@/api/users'
import { Search, Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const searchQuery = ref('')

// 表格数据
const users = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    const response = await getUsers()
    users.value = response.data.data
    total.value = users.value.length
  } catch (error) {
    ElMessage.error('加载用户列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // 实现搜索逻辑
  loadUsers()
}

const editUser = (row) => {
  console.log('Edit user', row)
}

// 删除用户
const handleDeleteUser = async (id) => {
  try {
    await deleteUser(id)
    ElMessage.success('用户删除成功')
    loadUsers()
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const removeUser = (id) => {
  ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteUser(id)
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadUsers()
}

// 初始化加载
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-management {
  /* 移除 padding，由 AdminLayout 统一管理 */
}

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

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
