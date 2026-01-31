<template>
  <div class="category-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <div>
            <el-button type="success" @click="syncCategoriesHandler">更新分类列表</el-button>
            <el-button type="primary" @click="showCreateDialog">添加分类</el-button>
          </div>
        </div>
      </template>

      <!-- 分类列表 -->
      <el-table :data="categories" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeCategory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分类编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="currentCategory" :rules="rules" ref="categoryForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="currentCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="currentCategory.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveCategory">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCategories, createCategory, updateCategory, deleteCategory, syncCategories } from '@/api/categories'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditing = ref(false)

// 表格数据
const categories = ref([])

// 当前编辑的分类
const currentCategory = reactive({
  id: null,
  name: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

// 表单引用
const categoryForm = ref(null)

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await getCategories()
    categories.value = response.data.data
  } catch (error) {
    ElMessage.error('加载分类列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 同步分类列表
const syncCategoriesHandler = async () => {
  try {
    loading.value = true
    const response = await syncCategories()
    ElMessage.success(response.data.message || '分类列表更新成功')
    loadCategories()
  } catch (error) {
    ElMessage.error('更新分类列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogTitle.value = '添加分类'
  isEditing.value = false
  Object.assign(currentCategory, {
    id: null,
    name: '',
    description: ''
  })
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (category) => {
  dialogTitle.value = '编辑分类'
  isEditing.value = true
  Object.assign(currentCategory, { ...category })
  dialogVisible.value = true
}

// 保存分类
const saveCategory = async () => {
  try {
    await categoryForm.value.validate()

    if (isEditing.value) {
      // 更新分类
      await updateCategory(currentCategory.id, {
        name: currentCategory.name,
        description: currentCategory.description
      })
      ElMessage.success('分类更新成功')
    } else {
      // 创建分类
      await createCategory({
        name: currentCategory.name,
        description: currentCategory.description
      })
      ElMessage.success('分类创建成功')
    }

    dialogVisible.value = false
    loadCategories()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      ElMessage.error('操作失败: ' + error.response.data.error)
    } else {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

// 删除分类
const removeCategory = (category) => {
  ElMessageBox.confirm(`确定要删除"${category.name}"这个分类吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCategory(category.id)
      ElMessage.success('分类删除成功')
      loadCategories()
    } catch (error) {
      ElMessage.error('删除失败: ' + (error.message || '未知错误'))
    }
  }).catch(() => {
    // 用户取消删除
  })
}

// 初始化加载
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-management {
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

.card-header > div {
  display: flex;
  gap: 12px;
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

:deep(.el-button--success) {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  border: none;
}

:deep(.el-button--success:hover) {
  background: linear-gradient(135deg, #85ce61 0%, #95d475 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
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
  .category-management {
    padding: 16px;
  }
  
  .management-card :deep(.el-card__header) {
    padding: 16px;
  }
  
  .management-card :deep(.el-card__body) {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
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