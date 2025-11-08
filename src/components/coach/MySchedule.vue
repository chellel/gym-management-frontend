<template>
  <div class="p-6">
    <!-- 使用排班日历组件 -->
    <ScheduleCalendar
      :schedules="schedules"
      title="我的课表"
      :show-view-toggle="true"
      :show-refresh="true"
      default-view-mode="week"
      @schedule-click="viewClassDetails"
      @refresh="refreshSchedule"
      @date-change="handleDateChange"
      @view-mode-change="handleViewModeChange"
    />

    <!-- 课程详情模态框 -->
    <el-dialog
      v-model="showClassDetailsModal"
      title="课程详情"
      width="600px"
    >
      <div v-if="selectedClass" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">课程名称</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.courseName }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">地点</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.location }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">日期</label>
            <p class="text-lg font-medium text-gray-900">{{ formatDate(selectedClass.startTime) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">时间</label>
            <p class="text-lg font-medium text-gray-900">{{ formatTime(selectedClass.startTime) }} - {{ formatTime(selectedClass.endTime) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">容量</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.maxCapacity }}人</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">状态</label>
            <el-tag :type="getStatusType(selectedClass.status)">
              {{ getStatusText(selectedClass.status) }}
            </el-tag>
          </div>
        </div>
        <div v-if="selectedClass.remark">
          <label class="text-sm font-medium text-gray-500">备注</label>
          <p class="text-gray-900">{{ selectedClass.remark }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import { useAuth } from '@/composables/useAuth'
import { getScheduleList } from '@/api/schedule'
import ScheduleCalendar from '@/admin/components/ScheduleCalendar.vue'
import Swal from 'sweetalert2'

// 认证相关
const { currentUser } = useAuth()

// 响应式数据
const schedules = ref([])
const showClassDetailsModal = ref(false)
const selectedClass = ref(null)
const loading = ref(false)

// 当前日期和视图模式
const currentDate = ref(new Date())
const viewMode = ref('week')

// 计算属性 - 周日期
const weekDays = computed(() => {
  const days = []
  // 使用 dayjs 获取本周的开始日期（星期日）
  const startOfWeek = dayjs(currentWeek.value).startOf('week')

  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.add(i, 'day')
    days.push({
      name: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][i],
      date: day.format('YYYY-MM-DD'),
    })
  }

  return days
})

// 初始化数据
onMounted(async () => {
  await loadScheduleData()
})

// 加载排班数据
const loadScheduleData = async (date, mode) => {
  if (!currentUser.value?.id) {
    console.error('用户未登录')
    return
  }

  try {
    loading.value = true
    
    const targetDate = date || currentDate.value
    const targetMode = mode || viewMode.value
    
    let startDate
    let endDate
    
    if (targetMode === 'month') {
      // 月视图：获取整个月的日期范围
      const firstDay = dayjs(targetDate).startOf('month')
      const lastDay = dayjs(targetDate).endOf('month')
      startDate = firstDay.format('YYYY-MM-DD')
      endDate = lastDay.format('YYYY-MM-DD')
    } else {
      // 周视图：获取本周的开始和结束日期
      const dayOfWeek = dayjs(targetDate).day()
      const startOfWeek = dayjs(targetDate).subtract(dayOfWeek, 'day')
      const endOfWeek = startOfWeek.add(6, 'day')
      startDate = startOfWeek.format('YYYY-MM-DD')
      endDate = endOfWeek.format('YYYY-MM-DD')
    }
    
    const response = await getScheduleList({
      coachId: currentUser.value.id,
      startDate: startDate,
      endDate: endDate,
      page: 1,
      pageSize: 100,
      isDeleted: 0
    })
    
    // 直接使用接口返回的数据，无需转换
    schedules.value = response.rows || []
  } catch (error) {
    console.error('Failed to load schedules:', error)
  } finally {
    loading.value = false
  }
}


// 事件处理函数
const refreshSchedule = async () => {
  try {
    await loadScheduleData()
    Swal.fire({
      title: '刷新成功',
      text: '课程数据已更新',
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新课程数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新课程数据失败，请重试',
      icon: 'error'
    })
  }
}

// 处理日期变化
const handleDateChange = (date, mode) => {
  currentDate.value = date
  viewMode.value = mode
  loadScheduleData(date, mode)
}

// 处理视图模式变化
const handleViewModeChange = (mode, date) => {
  viewMode.value = mode
  currentDate.value = date
  loadScheduleData(date, mode)
}

const viewClassDetails = (classItem) => {
  selectedClass.value = classItem
  showClassDetailsModal.value = true
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ""
  if (typeof date === "string") {
    date = new Date(date)
  }
  return date.toLocaleDateString("zh-CN", { 
    year: "numeric",
    month: "2-digit", 
    day: "2-digit" 
  })
}

// 格式化时间
const formatTime = (datetime) => {
  if (!datetime) return ""
  const date = new Date(datetime)
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'waiting':
      return 'warning'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'waiting':
      return '待开始'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return '未知'
  }
}
</script>
