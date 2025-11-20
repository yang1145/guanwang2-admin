<template>
  <div class="product-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>产品管理</span>
          <el-button type="primary" @click="showCreateDialog">添加产品</el-button>
        </div>
      </template>
      
      <!-- 产品筛选 -->
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部分类" value=""></el-option>
            <el-option label="硬件产品" value="hardware"></el-option>
            <el-option label="软件产品" value="software"></el-option>
            <el-option label="解决方案" value="solution"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadProducts">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 产品列表 -->
      <el-table :data="products" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="产品名称"></el-table-column>
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryTagType(scope.row.category)">
              {{ getCategoryLabel(scope.row.category) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="removeProduct(scope.row.id)">删除</el-button>
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
    
    <!-- 产品编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="currentProduct" :rules="rules" ref="productForm" label-width="80px">
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="currentProduct.name"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="currentProduct.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="硬件产品" value="hardware"></el-option>
            <el-option label="软件产品" value="software"></el-option>
            <el-option label="解决方案" value="solution"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="currentProduct.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="image_url">
          <el-input v-model="currentProduct.image_url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProduct">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/products'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditing = ref(false)

// 表格数据
const products = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 筛选表单
const filterForm = reactive({
  category: ''
})

// 当前编辑的产品
const currentProduct = reactive({
  id: null,
  name: '',
  category: '',
  description: '',
  image_url: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入产品描述', trigger: 'blur' }]
}

// 表单引用
const productForm = ref(null)

// 加载产品列表
const loadProducts = async () => {
  loading.value = true
  try {
    const response = await getProducts(filterForm.category)
    products.value = response.data.data
    total.value = products.value.length
  } catch (error) {
    ElMessage.error('加载产品列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 重置筛选条件
const resetFilter = () => {
  filterForm.category = ''
  loadProducts()
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogTitle.value = '添加产品'
  isEditing.value = false
  Object.assign(currentProduct, {
    id: null,
    name: '',
    category: '',
    description: '',
    image_url: ''
  })
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (product) => {
  dialogTitle.value = '编辑产品'
  isEditing.value = true
  Object.assign(currentProduct, { ...product })
  dialogVisible.value = true
}

// 保存产品
const saveProduct = async () => {
  try {
    await productForm.value.validate()
    
    if (isEditing.value) {
      // 更新产品
      await updateProduct(currentProduct.id, currentProduct)
      ElMessage.success('产品更新成功')
    } else {
      // 创建产品
      await createProduct(currentProduct)
      ElMessage.success('产品创建成功')
    }
    
    dialogVisible.value = false
    loadProducts()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      ElMessage.error('操作失败: ' + error.response.data.error)
    } else {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

// 删除产品
const handleDeleteProduct = async (id) => {
  try {
    await deleteProduct(id)
    ElMessage.success('产品删除成功')
    loadProducts()
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const removeProduct = (id) => {
  ElMessageBox.confirm('确定要删除这个产品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteProduct(id)
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadProducts()
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  const typeMap = {
    hardware: 'primary',
    software: 'success',
    solution: 'warning'
  }
  return typeMap[category] || 'info'
}

// 获取分类显示文本
const getCategoryLabel = (category) => {
  const labelMap = {
    hardware: '硬件产品',
    software: '软件产品',
    solution: '解决方案'
  }
  return labelMap[category] || category
}

// 初始化加载
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-management {
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

.filter-form {
  margin-bottom: 20px;
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