<template>
  <div class="news-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>新闻管理</span>
          <el-button type="primary" @click="showCreateDialog">添加新闻</el-button>
        </div>
      </template>
      
      <!-- 新闻列表 -->
      <el-table :data="newsList" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="author" label="作者" width="120"></el-table-column>
        <el-table-column prop="views" label="浏览量" width="100"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeNews(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>
    
    <!-- 新闻编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="currentNews" :rules="rules" ref="newsForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="currentNews.title"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="currentNews.author"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="currentNews.content" type="textarea" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="image_url">
          <el-input v-model="currentNews.image_url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveNews">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNews, createNews, updateNews, deleteNews } from '@/api/news'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditing = ref(false)

// 表格数据
const newsList = ref([])

// 分页信息
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// 当前编辑的新闻
const currentNews = reactive({
  id: null,
  title: '',
  author: '',
  content: '',
  image_url: ''
})

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }]
}

// 表单引用
const newsForm = ref(null)

// 加载新闻列表
const loadNews = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit
    }
    const response = await getNews(params)
    newsList.value = response.data.data
    Object.assign(pagination, response.data.pagination)
  } catch (error) {
    ElMessage.error('加载新闻列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogTitle.value = '添加新闻'
  isEditing.value = false
  Object.assign(currentNews, {
    id: null,
    title: '',
    author: '',
    content: '',
    image_url: ''
  })
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (news) => {
  dialogTitle.value = '编辑新闻'
  isEditing.value = true
  Object.assign(currentNews, { ...news })
  dialogVisible.value = true
}

// 保存新闻
const saveNews = async () => {
  try {
    await newsForm.value.validate()
    
    if (isEditing.value) {
      // 更新新闻
      await updateNews(currentNews.id, currentNews)
      ElMessage.success('新闻更新成功')
    } else {
      // 创建新闻
      await createNews(currentNews)
      ElMessage.success('新闻创建成功')
    }
    
    dialogVisible.value = false
    loadNews()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      ElMessage.error('操作失败: ' + error.response.data.error)
    } else {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

// 删除新闻
const handleDeleteNews = async (id) => {
  try {
    await deleteNews(id)
    ElMessage.success('新闻删除成功')
    loadNews()
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const removeNews = (id) => {
  ElMessageBox.confirm('确定要删除这条新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteNews(id)
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  pagination.page = page
  loadNews()
}

// 初始化加载
onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.news-management {
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

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #7c8ef0 0%, #8a5bb8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-bottom: 2px solid #e4e7ed;
  padding: 20px 24px;
  border-radius: 12px 12px 0 0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  transition: all 0.3s;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-textarea__inner) {
  border-radius: 6px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .news-management {
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