<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`${coach?.name} - 排班管理`"
    width="1200px"
    :close-on-click-modal="false"
  >
    <div v-if="coach" class="space-y-6">
      <!-- 教练信息概览 -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <el-avatar :size="60" :src="coach.avatar" :alt="coach.name">
              {{ coach.name.charAt(0) }}
            </el-avatar>
            <div>
              <h3 class="text-xl font-bold">{{ coach.name }}</h3>
              <p class="text-blue-100">{{ coach.specialty.join('、') }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold">{{ todaySchedule.length }}</div>
            <div class="text-sm text-blue-200">今日课程</div>
          </div>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            @change="loadSchedule"
          />
          <el-button @click="loadSchedule" :loading="loading">
            <el-icon class="mr-1"><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div class="flex space-x-2">
          <el-button type="primary" @click="showAddScheduleDialog = true">
            <el-icon class="mr-1"><Plus /></el-icon>
            添加排班
          </el-button>
        </div>
      </div>

      <!-- 排班日历视图 -->
      <ScheduleCalendar
        :schedules="schedules"
        @schedule-click="editSchedule"
        @date-change="handleDateChange"
      />

      <!-- 排班列表 -->
      <div class="bg-white rounded-lg border">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">排班列表</h3>
            <div class="flex items-center space-x-2">
              <el-select v-model="statusFilter" placeholder="筛选状态" clearable @change="filterSchedule">
                <el-option label="全部" value="" />
                <el-option label="已确认" value="confirmed" />
                <el-option label="已取消" value="cancelled" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <el-table :data="filteredSchedules" v-loading="loading">
            <el-table-column label="日期" width="120">
              <template #default="{ row }">
                {{ formatDate(row.date) }}
              </template>
            </el-table-column>
            <el-table-column label="时间" width="150">
              <template #default="{ row }">
                {{ row.start_time }} - {{ row.end_time }}
              </template>
            </el-table-column>
            <el-table-column label="课程" prop="activity" min-width="120" />
            <el-table-column label="地点" prop="location" min-width="120" />
            <el-table-column label="容量" width="100">
              <template #default="{ row }">
                {{ row.current_bookings }}/{{ row.max_capacity }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getScheduleStatusType(row.status)" size="small">
                  {{ getScheduleStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="notes" min-width="150" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <div class="flex space-x-2">
                  <el-button size="small" @click="editSchedule(row)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button size="small" @click="viewScheduleDetails(row)">
                    <el-icon><View /></el-icon>
                  </el-button>
                  <el-button size="small" type="danger" @click="deleteSchedule(row)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ scheduleStats.totalClasses }}</div>
          <div class="text-sm text-gray-500">总课程数</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ scheduleStats.completedClasses }}</div>
          <div class="text-sm text-gray-500">已完成</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ scheduleStats.upcomingClasses }}</div>
          <div class="text-sm text-gray-500">待进行</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-red-600">{{ scheduleStats.cancelledClasses }}</div>
          <div class="text-sm text-gray-500">已取消</div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑排班对话框 -->
    <ScheduleFormDialog
      v-model:visible="showAddScheduleDialog"
      :coach="coach"
      :schedule="editingSchedule"
      @success="handleScheduleSuccess"
    />

    <!-- 排班详情对话框 -->
    <ScheduleDetailDialog
      v-model:visible="showDetailDialog"
      :schedule="viewingSchedule"
    />

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { coachApi, type Coach, type CoachSchedule } from '@/api/coach'
import ScheduleFormDialog from './ScheduleFormDialog.vue'
import ScheduleDetailDialog from './ScheduleDetailDialog.vue'
import ScheduleCalendar from '@/admin/components/ScheduleCalendar.vue'

// Props
const props = defineProps<{
  visible: boolean
  coach?: Coach | null
}>()

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

// 响应式数据
const loading = ref(false)
const schedules = ref<CoachSchedule[]>([])
const selectedDate = ref(new Date())
const statusFilter = ref('')
const editingSchedule = ref<CoachSchedule | null>(null)
const viewingSchedule = ref<CoachSchedule | null>(null)
const showAddScheduleDialog = ref(false)
const showDetailDialog = ref(false)

// 统计数据
const scheduleStats = reactive({
  totalClasses: 0,
  completedClasses: 0,
  upcomingClasses: 0,
  cancelledClasses: 0
})

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const todaySchedule = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return schedules.value.filter(schedule => schedule.date === today)
})

const filteredSchedules = computed(() => {
  if (!statusFilter.value) return schedules.value
  return schedules.value.filter(schedule => schedule.status === statusFilter.value)
})

// 监听教练变化
watch(() => props.coach, (newCoach) => {
  if (newCoach) {
    loadSchedule()
  }
}, { immediate: true })

// 加载排班数据
const loadSchedule = async () => {
  if (!props.coach) return

  try {
    loading.value = true
    // 模拟数据
    const mockSchedules = generateMockSchedules(props.coach.id)
    schedules.value = mockSchedules
    updateStats()

    // 实际API调用
    // const response = await coachApi.getCoachSchedule(props.coach.id, {
    //   start: getDateRange().start,
    //   end: getDateRange().end
    // })
    // schedules.value = response.data
    // updateStats()
  } catch (error) {
    console.error('加载排班数据失败:', error)
    ElMessage.error('加载排班数据失败')
  } finally {
    loading.value = false
  }
}

// 更新统计数据
const updateStats = () => {
  scheduleStats.totalClasses = schedules.value.length
  scheduleStats.completedClasses = schedules.value.filter(s => s.status === 'completed').length
  scheduleStats.upcomingClasses = schedules.value.filter(s => s.status === 'confirmed').length
  scheduleStats.cancelledClasses = schedules.value.filter(s => s.status === 'cancelled').length
}

// 筛选排班
const filterSchedule = () => {
  // 筛选逻辑在计算属性中处理
}

// 处理日期变化
const handleDateChange = (date: Date) => {
  selectedDate.value = date
}

// 编辑排班
const editSchedule = (schedule: CoachSchedule) => {
  editingSchedule.value = schedule
  showAddScheduleDialog.value = true
}

// 查看排班详情
const viewScheduleDetails = (schedule: CoachSchedule) => {
  viewingSchedule.value = schedule
  showDetailDialog.value = true
}

// 删除排班
const deleteSchedule = async (schedule: CoachSchedule) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 "${schedule.activity}" 课程吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 模拟API调用
    schedules.value = schedules.value.filter(s => s.id !== schedule.id)
    updateStats()
    ElMessage.success('删除成功')

    // 实际API调用
    // await coachApi.deleteCoachSchedule(props.coach!.id, schedule.id)
    // ElMessage.success('删除成功')
    // loadSchedule()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除排班失败:', error)
      ElMessage.error('删除失败')
    }
  }
}


// 排班表单成功回调
const handleScheduleSuccess = () => {
  showAddScheduleDialog.value = false
  editingSchedule.value = null
  loadSchedule()
}

// 生成模拟排班数据
const generateMockSchedules = (coachId: number): CoachSchedule[] => {
  const today = new Date()
  const schedules = []
  
  for (let i = -7; i <= 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    // 随机生成1-3个课程
    const classCount = Math.floor(Math.random() * 3) + 1
    for (let j = 0; j < classCount; j++) {
      const activities = ['晨间瑜伽', '普拉提核心', '力量训练', '有氧运动', '游泳课', '拳击课']
      const locations = ['瑜伽室A', '瑜伽室B', '器械区', '游泳池', '拳击台', '有氧区']
      const times = [
        { start: '07:00', end: '08:00' },
        { start: '09:00', end: '10:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' },
        { start: '20:00', end: '21:00' }
      ]
      
      const activity = activities[Math.floor(Math.random() * activities.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const time = times[Math.floor(Math.random() * times.length)]
      const statuses = ['confirmed', 'completed', 'cancelled']
      const status = i < 0 ? 'completed' : i === 0 ? 'confirmed' : statuses[Math.floor(Math.random() * statuses.length)]
      
      schedules.push({
        id: schedules.length + 1,
        coach_id: coachId,
        activity,
        location,
        date: dateStr,
        start_time: time.start,
        end_time: time.end,
        max_capacity: Math.floor(Math.random() * 20) + 10,
        current_bookings: Math.floor(Math.random() * 15) + 5,
        status: status as 'confirmed' | 'cancelled' | 'completed',
        notes: Math.random() > 0.7 ? '特殊说明' : undefined
      })
    }
  }
  
  return schedules
}

// 工具函数
const getScheduleStatusType = (status: string) => {
  const statusMap = {
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getScheduleStatusText = (status: string) => {
  const statusMap = {
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const getDateRange = () => {
  const end = new Date()
  const start = new Date()
  start.setMonth(start.getMonth() - 1)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}
</script>


