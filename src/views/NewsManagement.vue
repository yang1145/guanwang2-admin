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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>