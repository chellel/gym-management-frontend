<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">课程预约</h1>
            <p class="text-gray-600 mt-1">查看和管理您的课程预约记录</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">当前时间</div>
            <div class="text-lg font-semibold text-gray-900">{{ currentTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 我的预约记录 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">我的预约记录</h3>
          <el-button @click="refreshBookings" :loading="loading" type="text">
            <el-icon class="w-4 h-4 mr-1">
              <Refresh />
            </el-icon>
            刷新
          </el-button>
        </div>

        <div v-if="loading" class="text-center py-8">
          <el-icon class="w-8 h-8 text-gray-400 animate-spin">
            <Loading />
          </el-icon>
          <p class="text-gray-500 mt-2">加载中...</p>
        </div>

        <div v-else-if="myBookings.length === 0" class="text-center py-8">
          <el-icon class="w-12 h-12 text-gray-300 mb-4">
            <Calendar />
          </el-icon>
          <p class="text-gray-500">暂无预约记录</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="booking in myBookings"
            :key="booking.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <el-icon class="w-5 h-5 text-blue-600">
                  <Calendar />
                </el-icon>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ getCourseName(booking.scheduleId) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(getScheduleStartTime(booking.scheduleId)) }} {{ formatTime(getScheduleStartTime(booking.scheduleId)) }} - {{ formatTime(getScheduleEndTime(booking.scheduleId)) }}
                </div>
                <div class="text-sm text-gray-500">
                  教练：{{ getCoachName(booking.scheduleId) }} | 地点：{{ getScheduleLocation(booking.scheduleId) }}
                </div>
                <div class="text-sm text-gray-500">
                  预约时间：{{ formatDate(booking.bookingTime) }} {{ formatTime(booking.bookingTime) }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <el-tag :type="getBookingStatusType(booking)" size="small">
                {{ getBookingStatusText(booking) }}
              </el-tag>
              <el-button
                v-if="canCancelBooking(booking)"
                @click="handleCancelBooking(booking)"
                :loading="cancelingBooking[booking.id]"
                type="danger"
                size="small"
              >
                取消预约
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { getScheduleList } from '@/api/schedule'
import { getCourseList } from '@/api/course'
import { getCoachList } from '@/api/coach'
import { getBookingList, cancelBooking } from '@/api/booking'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { 
  Calendar, 
  Loading, 
  Refresh
} from '@element-plus/icons-vue'

const { currentUser } = useAuth()

// 响应式数据
const loading = ref(false)
const currentTime = ref('')
const schedules = ref([])
const courses = ref([])
const coaches = ref([])
const myBookings = ref([])
const cancelingBooking = ref({})

// 定时器
let timeInterval = null

// 初始化
onMounted(async () => {
  await loadData()
  startTimeUpdate()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// 更新时间
const startTimeUpdate = () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
}

const updateTime = () => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    if (!currentUser.value) return

    // 并行加载排班、课程、教练和预约数据
    const [scheduleResponse, courseResponse, coachResponse, bookingResponse] = await Promise.all([
      getScheduleList({
        page: 1,
        pageSize: 1000,
      }),
      getCourseList({
        page: 1,
        pageSize: 1000,
      }),
      getCoachList({
        page: 1,
        pageSize: 1000,
      }),
      getBookingList({
        page: 1,
        pageSize: 1000,
        memberId: currentUser.value.id,
        isDeleted: 0, // 只获取未删除的预约
      })
    ])
    
    schedules.value = scheduleResponse.rows || []
    courses.value = courseResponse.rows || []
    coaches.value = coachResponse.rows || []
    myBookings.value = bookingResponse.rows || []
  } catch (error) {
    console.error('Error loading data:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 检查是否可以取消预约
const canCancelBooking = (booking) => {
  const now = dayjs()
  const scheduleStartTime = getScheduleStartTime(booking.scheduleId)
  if (!scheduleStartTime) return false
  
  const classDateTime = dayjs(scheduleStartTime)
  
  // 课程开始前2小时可以取消
  return classDateTime.diff(now, 'hour') > 2
}

// 处理取消预约
const handleCancelBooking = async (booking) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消这个预约吗？',
      '取消预约',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await cancelBooking(booking.id)
    
    ElMessage.success('预约已取消')
    
    // 刷新数据
    await loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error canceling booking:', error)
      ElMessage.error('取消预约失败，请重试')
    }
  }
}

// 刷新预约记录
const refreshBookings = async () => {
  await loadData()
}

// 获取课程名称
const getCourseName = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (!schedule) return '未知课程'
  
  const course = courses.value.find(c => c.id === schedule.courseId)
  return course ? course.name : '未知课程'
}

// 获取教练名称
const getCoachName = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  if (!schedule) return '未知教练'
  
  const coach = coaches.value.find(c => c.id === schedule.coachId)
  return coach ? coach.name : '未知教练'
}

// 获取排班地点
const getScheduleLocation = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  return schedule ? schedule.location : '未知地点'
}

// 获取排班开始时间
const getScheduleStartTime = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  return schedule ? schedule.startTime : null
}

// 获取排班结束时间
const getScheduleEndTime = (scheduleId) => {
  const schedule = schedules.value.find(s => s.id === scheduleId)
  return schedule ? schedule.endTime : null
}

// 获取预约状态类型
const getBookingStatusType = (booking) => {
  if (booking.isDeleted) return 'danger'
  if (booking.checkinTime) return 'success'
  return 'warning'
}

// 获取预约状态文本
const getBookingStatusText = (booking) => {
  if (booking.isDeleted) return '已取消'
  if (booking.checkinTime) return '已签到'
  return '已预约'
}

// 格式化时间
const formatTime = (datetime) => {
  return dayjs(datetime).format('HH:mm')
}

// 格式化日期
const formatDate = (datetime) => {
  return dayjs(datetime).format('MM月DD日 dddd')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
