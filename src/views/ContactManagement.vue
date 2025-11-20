<template>
  <div class="contact-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>联系信息管理</span>
        </div>
      </template>
      
      <!-- 联系信息列表 -->
      <el-table :data="contactMessages" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="电话" width="150"></el-table-column>
        <el-table-column prop="message" label="留言内容">
          <template #default="scope">
            <el-tooltip :content="scope.row.message" placement="top">
              <span class="message-preview">{{ scope.row.message.substring(0, 50) }}{{ scope.row.message.length > 50 ? '...' : '' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="180"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="danger" @click="removeContactMessage(scope.row.id)">删除</el-button>
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
import { getContactMessages, deleteContactMessage } from '@/api/contact'

const loading = ref(false)

// 表格数据
const contactMessages = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载联系信息列表
const loadContactMessages = async () => {
  loading.value = true
  try {
    const response = await getContactMessages()
    contactMessages.value = response.data.data
    total.value = contactMessages.value.length
  } catch (error) {
    ElMessage.error('加载联系信息失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 删除联系信息
const handleDeleteContactMessage = async (id) => {
  try {
    await deleteContactMessage(id)
    ElMessage.success('联系信息删除成功')
    loadContactMessages()
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const removeContactMessage = (id) => {
  ElMessageBox.confirm('确定要删除这条联系信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteContactMessage(id)
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadContactMessages()
}

// 初始化加载
onMounted(() => {
  loadContactMessages()
})
</script>

<style scoped>
.contact-management {
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

.message-preview {
  cursor: pointer;
  color: #409eff;
}
</style>