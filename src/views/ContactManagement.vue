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
  padding: 24px;
  background-color: #f5f7fa;
  min-height: 100%;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.management-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  border: none;
  transition: all 0.3s;
}

.management-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.management-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 2px solid #e4e7ed;
  padding: 20px 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 16px;
}

.card-header span::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.management-card :deep(.el-card__body) {
  padding: 24px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
  font-size: 14px;
}

:deep(.el-table th) {
  background: linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%);
  color: #606266;
  font-weight: 600;
  border-bottom: 2px solid #e4e7ed;
}

:deep(.el-table td) {
  padding: 16px 0;
}

:deep(.el-table tr) {
  transition: all 0.3s;
}

:deep(.el-table tr:hover) {
  background-color: #f5f7fa;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f5f7fa !important;
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

:deep(.el-button--small) {
  padding: 8px 16px;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #f56c6c 0%, #ff7e7e 100%);
  border: none;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #ff7e7e 0%, #ff9090 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
}

/* 分页样式 */
.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  font-weight: 500;
}

:deep(.el-pagination .el-pager li) {
  border-radius: 6px;
  margin: 0 4px;
  transition: all 0.3s;
  font-weight: 500;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #409eff;
  transform: translateY(-2px);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

:deep(.el-pagination button) {
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.el-pagination button:hover) {
  color: #409eff;
  transform: scale(1.1);
}

/* 留言预览样式 */
.message-preview {
  cursor: pointer;
  color: #409eff;
  transition: all 0.3s;
  display: inline-block;
}

.message-preview:hover {
  color: #66b1ff;
  transform: translateX(2px);
}

/* Tooltip样式优化 */
:deep(.el-tooltip__popper) {
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式优化 */
@media (max-width: 768px) {
  .contact-management {
    padding: 16px;
  }
  
  .management-card :deep(.el-card__header) {
    padding: 16px;
  }
  
  .management-card :deep(.el-card__body) {
    padding: 16px;
  }
  
  .card-header span {
    font-size: 16px;
  }
  
  :deep(.el-table) {
    font-size: 13px;
  }
  
  :deep(.el-table td) {
    padding: 12px 0;
  }
}
</style>