<template>
  <div class="space-y-6">
    <!-- 页面标题和操作栏 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">教练管理</h1>
        <p class="mt-1 text-sm text-gray-500">管理健身房的所有教练信息和排班安排</p>
      </div>
      <div class="flex space-x-3">
        <el-button type="primary" @click="addCoach">
          <el-icon class="mr-2"><Plus /></el-icon>
          添加教练
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <el-icon class="w-5 h-5 text-blue-600"><User /></el-icon>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">总教练数</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCoaches }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <el-icon class="w-5 h-5 text-green-600"><Check /></el-icon>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">在职教练</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.activeCoaches }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <el-icon class="w-5 h-5 text-yellow-600"><Clock /></el-icon>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">今日课程</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stats.todayClasses }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索教练</label>
          <el-input
            v-model="searchQuery"
            placeholder="输入姓名、邮箱或电话"
            clearable
            @input="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">状态筛选</label>
          <el-select v-model="statusFilter" placeholder="选择状态" clearable @change="handleFilter">
            <el-option label="全部" value="" />
            <el-option label="在职" value="active" />
            <el-option label="离职" value="inactive" />
            <el-option label="暂停" value="suspended" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 教练列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">教练列表</h3>
          <div class="flex items-center space-x-2">
            <el-button size="small" @click="refreshData" :loading="loading">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <el-table
          :data="coaches"
          v-loading="loading"
          :row-key="row => row.id"
        >
          
          <el-table-column label="头像" width="80">
            <template #default="{ row }">
              <div class="flex items-center">
                <el-avatar
                  :size="40"
                  :src="row.avatar"
                  :alt="row.name"
                >
                  {{ row.name.charAt(0) }}
                </el-avatar>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="基本信息" min-width="200">
            <template #default="{ row }">
              <div>
                <div class="font-medium text-gray-900">{{ row.name }}</div>
                <div class="text-sm text-gray-500">{{ row.email }}</div>
                <div class="text-sm text-gray-500">{{ row.phone }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                :type="getStatusType(row.status)"
                size="small"
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="入职时间" width="120">
            <template #default="{ row }">
              <span class="text-sm text-gray-900">{{ row.hireDate || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="flex space-x-2">
                <el-button size="small" @click="viewCoach(row)">
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button size="small" @click="editCoach(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button size="small" @click="manageSchedule(row)">
                  <el-icon><Calendar /></el-icon>
                </el-button>
                <el-button size="small" type="danger" @click="deleteCoach(row)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="px-6 py-4">
        <Pagination
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @page-change="handleCurrentChange"
        />
      </div>
    </div>


    <!-- 添加/编辑教练对话框 -->
    <CoachFormDialog
      v-model:visible="showEditDialog"
      :id="editingCoachId"
      @success="handleFormSuccess"
    />

    <!-- 教练详情对话框 -->
    <CoachDetailDialog
      v-model:visible="showDetailDialog"
      :coach="viewingCoach"
    />

    <!-- 排班管理对话框 -->
    <CoachScheduleDialog
      v-model:visible="showScheduleDialog"
      :coach="scheduleCoach"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCoachList } from '@/api/coach'
import CoachFormDialog from '@/admin/views/Coach/components/CoachFormDialog.vue'
import CoachDetailDialog from '@/admin/views/Coach/components/CoachDetailDialog.vue'
import CoachScheduleDialog from '@/admin/views/Coach/components/CoachScheduleDialog.vue'
import Pagination from '@/admin/components/Pagination.vue'
import Swal from 'sweetalert2'

// 响应式数据
const loading = ref(false)
const coaches = ref([])

// 分页数据
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 搜索和筛选
const searchQuery = ref('')
const statusFilter = ref('')

// 对话框状态
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const showScheduleDialog = ref(false)
const editingCoachId = ref(null)
const viewingCoach = ref(null)
const scheduleCoach = ref(null)

// 统计数据
const stats = reactive({
  totalCoaches: 0,
  activeCoaches: 0,
  todayClasses: 0
})

// 计算属性
const queryParams = computed(() => ({
  page: currentPage.value,
  limit: pageSize.value,
  search: searchQuery.value,
  status: statusFilter.value
}))

// 生命周期
onMounted(() => {
  loadCoaches()
  loadStats()
})

// 监听查询参数变化
watch(queryParams, () => {
  loadCoaches()
}, { deep: true })

// 加载教练列表
const loadCoaches = async () => {
  try {
    loading.value = true
    // 实际API调用
    const res = await getCoachList(queryParams.value)
    if(res.code !== 0) {
      Swal.fire({
        title: '错误',
        text: res.msg,
        icon: 'error'
      })
      return
    }
    coaches.value = res.rows
    total.value = res.total
  } catch (error) {
    console.error('加载教练列表失败:', error)
    ElMessage.error('加载教练列表失败')
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStats = async () => {
  try {
    // 模拟统计数据
    stats.totalCoaches = 25
    stats.activeCoaches = 20
    stats.todayClasses = 15
    
    // 实际API调用
    // const response = await getCoachStats()
    // Object.assign(stats, response.data)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadCoaches()
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  loadCoaches()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 刷新数据
const refreshData = () => {
  loadCoaches()
  loadStats()
}


// 添加教练
const addCoach = () => {
  editingCoachId.value = null
  showEditDialog.value = true
}

// 查看教练
const viewCoach = (coach) => {
  viewingCoach.value = coach
  showDetailDialog.value = true
}

// 编辑教练
const editCoach = (coach) => {
  editingCoachId.value = coach.id
  showEditDialog.value = true
}

// 管理排班
const manageSchedule = (coach) => {
  scheduleCoach.value = coach
  showScheduleDialog.value = true
}

// 删除教练
const deleteCoach = async (coach) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除教练 "${coach.name}" 吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 模拟API调用
    ElMessage.success('删除成功')
    loadCoaches()
    
    // 实际API调用
    // await deleteCoachApi(coach.id)
    // ElMessage.success('删除成功')
    // loadCoaches()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除教练失败:', error)
      ElMessage.error('删除失败')
    }
  }
}



// 表单成功回调
const handleFormSuccess = () => {
  showEditDialog.value = false
  editingCoachId.value = null 
  loadCoaches()
  loadStats()
}

// 工具函数
const getStatusType = (status) => {
  const statusMap = {
    active: 'success',
    inactive: 'info',
    suspended: 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    active: '在职',
    inactive: '离职',
    suspended: '暂停'
  }
  return statusMap[status] || '未知'
}

</script>

<style scoped>
.el-table {
  --el-table-border-color: #e5e7eb;
}

.el-table th {
  background-color: #f9fafb;
}
</style>

