<template>
  <div class="ticket-management">
    <el-card class="management-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="header-title">工单处理</div>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-container">
        <el-select v-model="filter.status" placeholder="状态筛选" clearable style="width: 140px" @change="handleSearch">
          <el-option label="待受理" value="pending" />
          <el-option label="已回复" value="replied" />
          <el-option label="已关闭" value="closed" />
        </el-select>
        <el-select v-model="filter.urgency" placeholder="紧急程度" clearable style="width: 140px" @change="handleSearch">
          <el-option label="低" value="low" />
          <el-option label="中" value="medium" />
          <el-option label="高" value="high" />
          <el-option label="紧急" value="urgent" />
        </el-select>
        <el-select v-model="filter.departmentId" placeholder="部门筛选" clearable style="width: 160px" @change="handleSearch">
          <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
        </el-select>
        <el-input
          v-model="filter.search"
          placeholder="搜索标题/内容"
          style="width: 220px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" plain @click="handleSearch">搜索</el-button>
      </div>

      <!-- 工单列表 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', color: '#606266' }"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="ID" width="70" align="center"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="user_phone" label="用户" width="130"></el-table-column>
        <el-table-column prop="department_name" label="部门" width="100"></el-table-column>
        <el-table-column prop="urgency" label="紧急程度" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="urgencyType(row.urgency)" size="small">{{ urgencyLabel(row.urgency) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assigned_admin_name" label="负责人" width="100">
          <template #default="{ row }">
            {{ row.assigned_admin_name || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="reply_count" label="回复" width="70" align="center"></el-table-column>
        <el-table-column prop="created_at" label="提交时间" min-width="170"></el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click.stop="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status !== 'closed'"
              link
              type="danger"
              size="small"
              @click.stop="handleClose(row.id)"
            >关闭</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.limit"
          :total="pagination.total"
          :background="true"
          layout="total, prev, pager, next, jumper"
          @current-change="loadTickets"
        />
      </div>
    </el-card>

    <!-- 工单详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="工单详情"
      size="600px"
      @close="handleCloseDrawer"
    >
      <template v-if="currentTicket">
        <div class="ticket-detail">
          <!-- 基本信息 -->
          <div class="detail-section">
            <h4>{{ currentTicket.title }}</h4>
            <div class="detail-meta">
              <el-tag :type="urgencyType(currentTicket.urgency)" size="small">{{ urgencyLabel(currentTicket.urgency) }}</el-tag>
              <el-tag :type="statusType(currentTicket.status)" size="small">{{ statusLabel(currentTicket.status) }}</el-tag>
              <span class="meta-text">部门：{{ currentTicket.department_name }}</span>
              <span class="meta-text">用户：{{ currentTicket.user_phone || currentTicket.user_email }}</span>
              <span class="meta-text">负责人：{{ currentTicket.assigned_admin_name || '未分配' }}</span>
              <span class="meta-text">{{ currentTicket.created_at }}</span>
            </div>
          </div>

          <!-- 工单内容 -->
          <div class="detail-section">
            <div class="section-title">问题描述</div>
            <div class="content-box">{{ currentTicket.content }}</div>
          </div>

          <!-- 回复列表 -->
          <div class="detail-section" v-if="replies.length > 0">
            <div class="section-title">回复记录（{{ replies.length }}）</div>
            <div v-for="reply in replies" :key="reply.id" class="reply-item" :class="reply.reply_type">
              <div class="reply-header">
                <span class="reply-author">
                  {{ reply.reply_type === 'admin' ? (reply.admin_username || '管理员') : (reply.user_phone || '用户') }}
                </span>
                <span class="reply-time">{{ reply.created_at }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>

          <!-- 转交记录 -->
          <div class="detail-section" v-if="transfers && transfers.length > 0">
            <div class="section-title">转交记录</div>
            <div v-for="t in transfers" :key="t.id" class="transfer-item">
              <span>{{ t.from_department_name }} → {{ t.to_department_name }}</span>
              <span class="transfer-reason">原因：{{ t.reason || '-' }}</span>
              <span class="transfer-time">{{ t.created_at }}</span>
            </div>
          </div>

          <!-- 操作区域 -->
          <div class="detail-section" v-if="currentTicket.status !== 'closed'">
            <div class="section-title">回复工单</div>
            <el-input
              v-model="replyContent"
              type="textarea"
              :rows="3"
              placeholder="输入回复内容..."
            />
            <div class="action-buttons">
              <el-button type="primary" :loading="replying" @click="handleReply">回复</el-button>
              <el-button v-if="!currentTicket.assigned_admin_id" type="success" plain :loading="assigning" @click="handleAssign">接手工单</el-button>
              <el-button type="warning" plain @click="handleTransferDialog">转交工单</el-button>
            </div>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 转交弹窗 -->
    <el-dialog
      v-model="transferVisible"
      title="转交工单"
      width="420px"
      :close-on-click-modal="false"
      @close="handleCloseTransfer"
    >
      <el-form ref="transferFormRef" :model="transferForm" label-width="80px">
        <el-form-item label="目标部门">
          <el-select v-model="transferForm.departmentId" placeholder="请选择部门" style="width: 100%" clearable>
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="转交原因">
          <el-input v-model="transferForm.reason" type="textarea" :rows="2" placeholder="请输入转交原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseTransfer">取消</el-button>
          <el-button type="primary" :loading="transferring" @click="handleTransfer">确定转交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTickets,
  getTicketById,
  replyTicket,
  assignTicket,
  transferTicket,
  closeTicket,
  getTicketDepartments
} from '@/api/tickets'

const loading = ref(false)
const tableData = ref([])
const departments = ref([])

const pagination = reactive({ page: 1, limit: 20, total: 0 })

const filter = reactive({
  status: '',
  urgency: '',
  departmentId: null,
  search: ''
})

// 详情抽屉
const drawerVisible = ref(false)
const currentTicket = ref(null)
const replies = ref([])
const transfers = ref([])
const replyContent = ref('')
const replying = ref(false)
const assigning = ref(false)

// 转交
const transferVisible = ref(false)
const transferring = ref(false)
const transferFormRef = ref(null)
const transferForm = reactive({ departmentId: null, reason: '' })

const urgencyType = (v) => {
  const map = { low: 'info', medium: '', high: 'warning', urgent: 'danger' }
  return map[v] || 'info'
}

const urgencyLabel = (v) => {
  const map = { low: '低', medium: '中', high: '高', urgent: '紧急' }
  return map[v] || v
}

const statusType = (v) => {
  const map = { pending: 'warning', replied: 'success', closed: 'info' }
  return map[v] || 'info'
}

const statusLabel = (v) => {
  const map = { pending: '待受理', replied: '已回复', closed: '已关闭' }
  return map[v] || v
}

const loadDepartments = async () => {
  try {
    const res = await getTicketDepartments()
    departments.value = res.data?.data || []
  } catch (error) {
    // 部门加载失败不影响主流程
  }
}

const loadTickets = async () => {
  loading.value = true
  try {
    const params = { page: pagination.page, limit: pagination.limit }
    if (filter.status) params.status = filter.status
    if (filter.urgency) params.urgency = filter.urgency
    if (filter.departmentId) params.departmentId = filter.departmentId
    if (filter.search) params.search = filter.search
    const res = await getTickets(params)
    tableData.value = res.data?.rows || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    ElMessage.error('加载工单列表失败: ' + (error.response?.data?.error || error.message))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadTickets()
}

const handleRowClick = (row) => {
  handleView(row)
}

const handleView = async (row) => {
  try {
    const res = await getTicketById(row.id)
    const data = res.data?.data || {}
    currentTicket.value = data.ticket || row
    replies.value = data.replies || []
    transfers.value = data.transfers || []
    replyContent.value = ''
    drawerVisible.value = true
  } catch (error) {
    ElMessage.error('加载工单详情失败: ' + (error.response?.data?.error || error.message))
  }
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
  currentTicket.value = null
  replies.value = []
  transfers.value = []
  replyContent.value = ''
}

const handleReply = async () => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  replying.value = true
  try {
    await replyTicket(currentTicket.value.id, replyContent.value.trim())
    ElMessage.success('回复成功')
    replyContent.value = ''
    // 刷新详情
    handleView({ id: currentTicket.value.id })
    loadTickets()
  } catch (error) {
    ElMessage.error('回复失败: ' + (error.response?.data?.error || error.message))
  } finally {
    replying.value = false
  }
}

const handleAssign = async () => {
  assigning.value = true
  try {
    await assignTicket(currentTicket.value.id)
    ElMessage.success('已接手工单')
    handleView({ id: currentTicket.value.id })
    loadTickets()
  } catch (error) {
    ElMessage.error('接手失败: ' + (error.response?.data?.error || error.message))
  } finally {
    assigning.value = false
  }
}

const handleTransferDialog = () => {
  transferForm.departmentId = null
  transferForm.reason = ''
  transferVisible.value = true
}

const handleCloseTransfer = () => {
  transferVisible.value = false
}

const handleTransfer = async () => {
  transferring.value = true
  try {
    const payload = {}
    if (transferForm.departmentId) payload.departmentId = transferForm.departmentId
    if (transferForm.reason) payload.reason = transferForm.reason
    await transferTicket(currentTicket.value.id, payload)
    ElMessage.success('工单转交成功')
    handleCloseTransfer()
    handleCloseDrawer()
    loadTickets()
  } catch (error) {
    ElMessage.error('转交失败: ' + (error.response?.data?.error || error.message))
  } finally {
    transferring.value = false
  }
}

const handleClose = (id) => {
  ElMessageBox.confirm('确定要关闭该工单吗？关闭后不可再回复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await closeTicket(id)
      ElMessage.success('工单已关闭')
      loadTickets()
    } catch (error) {
      ElMessage.error('关闭失败: ' + (error.response?.data?.error || error.message))
    }
  }).catch(() => {})
}

onMounted(() => {
  loadDepartments()
  loadTickets()
})
</script>

<style scoped>
.ticket-management { }

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
  flex-wrap: wrap;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 工单详情 */
.ticket-detail {
  padding: 0 4px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--text-primary);
}

.detail-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.meta-text {
  font-size: 13px;
  color: #666;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.content-box {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  white-space: pre-wrap;
}

.reply-item {
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
}

.reply-item.admin {
  background: #ecf5ff;
}

.reply-item.user {
  background: #f0f9eb;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.reply-author {
  font-size: 13px;
  font-weight: 600;
}

.reply-time {
  font-size: 12px;
  color: #999;
}

.reply-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.transfer-item {
  display: flex;
  gap: 16px;
  padding: 6px 0;
  font-size: 13px;
  color: #666;
  border-bottom: 1px dashed #eee;
}

.transfer-reason {
  color: #e6a23c;
}

.transfer-time {
  margin-left: auto;
  color: #999;
}

.action-buttons {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}
</style>
