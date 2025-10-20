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

// 当前周
const currentWeek = ref(new Date())

// 计算属性 - 周日期
const weekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentWeek.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push({
      name: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][i],
      date: day.toISOString().split("T")[0],
    })
  }

  return days
})

// 初始化数据
onMounted(async () => {
  await loadScheduleData()
})

// 加载排班数据
const loadScheduleData = async () => {
  if (!currentUser.value?.id) {
    console.error('用户未登录')
    return
  }

  try {
    loading.value = true
    
    const startOfWeek = new Date(currentWeek.value)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const response = await getScheduleList({
      coachId: currentUser.value.id,
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      page: 1,
      pageSize: 100,
      isDeleted: 0
    })
    
    // 直接使用接口返回的数据，无需转换
    schedules.value = response.rows || []
  } catch (error) {
    console.error('Failed to load schedules:', error)
    // 如果API失败，使用模拟数据作为后备
    loadMockSchedules()
  } finally {
    loading.value = false
  }
}


// 加载模拟排班数据（作为后备）
const loadMockSchedules = () => {
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  schedules.value = [
    {
      id: 1,
      courseId: 1,
      coachId: currentUser.value?.id || 1,
      coachName: currentUser.value?.name || "当前教练",
      courseName: "瑜伽基础",
      startTime: new Date(weekStart.getTime() + 7 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(weekStart.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      location: "瑜伽室A",
      maxCapacity: 20,
      status: "waiting",
      remark: "适合初学者",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 2,
      courseId: 2,
      coachId: currentUser.value?.id || 1,
      coachName: currentUser.value?.name || "当前教练",
      courseName: "普拉提核心",
      startTime: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(),
      location: "瑜伽室B",
      maxCapacity: 15,
      status: "waiting",
      remark: "核心训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 3,
      courseId: 3,
      coachId: currentUser.value?.id || 1,
      coachName: currentUser.value?.name || "当前教练",
      courseName: "冥想瑜伽",
      startTime: new Date(weekStart.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(weekStart.getTime() + 48 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000).toISOString(),
      location: "冥想室",
      maxCapacity: 10,
      status: "waiting",
      remark: "心灵净化",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 4,
      courseId: 4,
      coachId: currentUser.value?.id || 1,
      coachName: currentUser.value?.name || "当前教练",
      courseName: "高温瑜伽",
      startTime: new Date(weekStart.getTime() + 72 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(weekStart.getTime() + 72 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000).toISOString(),
      location: "高温瑜伽室",
      maxCapacity: 12,
      status: "waiting",
      remark: "深度排毒",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 5,
      courseId: 5,
      coachId: currentUser.value?.id || 1,
      coachName: currentUser.value?.name || "当前教练",
      courseName: "夜间瑜伽",
      startTime: new Date(weekStart.getTime() + 96 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(weekStart.getTime() + 96 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
      location: "瑜伽室A",
      maxCapacity: 15,
      status: "waiting",
      remark: "改善睡眠",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    }
  ]
}

// 事件处理函数
const refreshSchedule = async () => {
  try {
    await loadScheduleData()
    Swal.fire({
      title: '刷新成功',
      text: '课程数据已更新',
      icon: 'success',
      timer: 1500,
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
