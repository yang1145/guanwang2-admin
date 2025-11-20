<template>
  <div class="goods-management">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="showCreateDialog">添加商品</el-button>
        </div>
      </template>
      

      
      <!-- 商品列表 -->
      <el-table :data="goods" v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="price" label="价格" width="120">
          <template #default="scope">
            {{ formatPrice(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="currency" label="货币" width="80"></el-table-column>
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
            <el-button size="small" type="danger" @click="removeGood(scope.row.id)">删除</el-button>
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
    
    <!-- 商品编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="currentGood" :rules="rules" ref="goodForm" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="currentGood.name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="currentGood.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="货币" prop="currency">
          <el-select v-model="currentGood.currency" placeholder="请选择货币" style="width: 100%">
            <el-option label="人民币 (CNY)" value="CNY"></el-option>
            <el-option label="美元 (USD)" value="USD"></el-option>
            <el-option label="欧元 (EUR)" value="EUR"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="currentGood.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="currentGood.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="图片链接" prop="image_url">
          <el-input v-model="currentGood.image_url"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveGood">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGoods, createGood, updateGood, deleteGood } from '@/api/goods'
import { getCategories } from '@/api/categories'

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditing = ref(false)

// 表格数据
const goods = ref([])
const categories = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 当前编辑的商品
const currentGood = reactive({
  id: null,
  name: '',
  price: 0,
  currency: 'CNY',
  category: '',
  description: '',
  image_url: ''
})

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', message: '价格必须为数字', trigger: 'blur' }
  ],
  currency: [{ required: true, message: '请选择货币类型', trigger: 'change' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
}

// 表单引用
const goodForm = ref(null)

// 加载分类列表
const loadCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.data.data
  } catch (error) {
    ElMessage.error('加载分类列表失败: ' + (error.message || '未知错误'))
  }
}

// 加载商品列表
const loadGoods = async () => {
  loading.value = true
  try {
    const response = await getGoods()
    goods.value = response.data.data
    total.value = goods.value.length
  } catch (error) {
    ElMessage.error('加载商品列表失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 格式化价格显示
const formatPrice = (good) => {
  return `${good.currency} ${good.price}`
}

// 获取分类标签类型
const getCategoryTagType = (category) => {
  const typeMap = {
    hardware: 'primary',
    software: 'success',
    service: 'warning'
  }
  return typeMap[category] || 'info'
}

// 获取分类显示文本
const getCategoryLabel = (category) => {
  // 查找分类名称对应的完整分类对象
  const categoryObj = categories.value.find(cat => cat.name === category)
  return categoryObj ? categoryObj.name : category
}

// 显示创建对话框
const showCreateDialog = () => {
  dialogTitle.value = '添加商品'
  isEditing.value = false
  Object.assign(currentGood, {
    id: null,
    name: '',
    price: 0,
    currency: 'CNY',
    category: '',
    description: '',
    image_url: ''
  })
  dialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = (good) => {
  dialogTitle.value = '编辑商品'
  isEditing.value = true
  Object.assign(currentGood, { ...good })
  dialogVisible.value = true
}

// 保存商品
const saveGood = async () => {
  try {
    await goodForm.value.validate()
    
    if (isEditing.value) {
      // 更新商品
      await updateGood(currentGood.id, currentGood)
      ElMessage.success('商品更新成功')
    } else {
      // 创建商品
      await createGood(currentGood)
      ElMessage.success('商品创建成功')
    }
    
    dialogVisible.value = false
    loadGoods()
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      ElMessage.error('操作失败: ' + error.response.data.error)
    } else {
      ElMessage.error('操作失败: ' + (error.message || '未知错误'))
    }
  }
}

// 删除商品
const handleDeleteGood = async (id) => {
  try {
    await deleteGood(id)
    ElMessage.success('商品删除成功')
    loadGoods()
  } catch (error) {
    ElMessage.error('删除失败: ' + (error.message || '未知错误'))
  }
}

const removeGood = (id) => {
  ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDeleteGood(id)
  }).catch(() => {
    // 用户取消删除
  })
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadGoods()
}

// 初始化加载
onMounted(() => {
  loadGoods()
  loadCategories()
})
</script>

<style scoped>
.goods-management {
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