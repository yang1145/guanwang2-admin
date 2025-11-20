<template>
  <div class="user-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>
      
      <!-- 用户列表 -->
      <el-table :data="users" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, deleteUser } from '@/api/users'

const loading = ref(false)

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
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100%;
  box-sizing: border-box;
}

.management-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>