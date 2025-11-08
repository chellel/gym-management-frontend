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
            <el-avatar :size="60" :alt="coach.name">
              {{ coach.name.charAt(0) }}
            </el-avatar>
            <div>
              <h3 class="text-xl font-bold">{{ coach.name }}</h3>
              <p class="text-blue-100">{{ coach.experience }}</p>
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
        @view-mode-change="handleViewModeChange"
      />

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
import { getCoachSchedule, addCoachSchedule, updateCoachSchedule, type Coach, type CoachSchedule } from '@/api/coach'
import ScheduleFormDialog from '@/components/schedule/ScheduleFormDialog.vue'
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
const editingSchedule = ref<CoachSchedule | null>(null)
const showAddScheduleDialog = ref(false)
const viewMode = ref<'week' | 'month'>('week')

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

// 监听教练变化
watch(() => props.coach, (newCoach) => {
  if (newCoach) {
    loadSchedule()
  }
}, { immediate: true })

// 加载排班数据
const loadSchedule = async (date?: Date, mode?: 'week' | 'month') => {
  if (!props.coach) return

  try {
    loading.value = true
    const targetDate = date || selectedDate.value
    const targetMode = mode || viewMode.value
    
    // 模拟数据
    const mockSchedules = generateMockSchedules(props.coach.id)
    schedules.value = mockSchedules
    updateStats()

    // 实际API调用 - 根据视图模式计算日期范围
    // let startDate: string
    // let endDate: string
    // 
    // if (targetMode === 'month') {
    //   const firstDay = dayjs(targetDate).startOf('month')
    //   const lastDay = dayjs(targetDate).endOf('month')
    //   startDate = firstDay.format('YYYY-MM-DD')
    //   endDate = lastDay.format('YYYY-MM-DD')
    // } else {
    //   const dayOfWeek = dayjs(targetDate).day()
    //   const startOfWeek = dayjs(targetDate).subtract(dayOfWeek, 'day')
    //   const endOfWeek = startOfWeek.add(6, 'day')
    //   startDate = startOfWeek.format('YYYY-MM-DD')
    //   endDate = endOfWeek.format('YYYY-MM-DD')
    // }
    // 
    // const response = await getCoachSchedule(props.coach.id, {
    //   start_date: startDate,
    //   end_date: endDate
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

// 处理日期变化
const handleDateChange = (date: Date, mode: 'week' | 'month') => {
  selectedDate.value = date
  viewMode.value = mode
  loadSchedule(date, mode)
}

// 处理视图模式变化
const handleViewModeChange = (mode: 'week' | 'month', date: Date) => {
  viewMode.value = mode
  selectedDate.value = date
  loadSchedule(date, mode)
}

// 编辑排班
const editSchedule = (schedule: CoachSchedule) => {
  editingSchedule.value = schedule
  showAddScheduleDialog.value = true
}


// 排班表单成功回调
const handleScheduleSuccess = () => {
  showAddScheduleDialog.value = false
  editingSchedule.value = null
  loadSchedule()
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


