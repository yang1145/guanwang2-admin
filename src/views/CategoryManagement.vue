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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>