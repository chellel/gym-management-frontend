<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">我的课表</h2>
      <div class="flex items-center space-x-4">
        <el-button-group>
          <el-button 
            :type="viewMode === 'week' ? 'primary' : 'default'"
            @click="viewMode = 'week'"
            size="small"
          >
            周视图
          </el-button>
          <el-button 
            :type="viewMode === 'month' ? 'primary' : 'default'"
            @click="viewMode = 'month'"
            size="small"
          >
            月视图
          </el-button>
        </el-button-group>
        <el-button @click="refreshSchedule" type="default" size="small">
          <el-icon class="w-4 h-4 mr-1">
            <Refresh />
          </el-icon>
          刷新
        </el-button>
      </div>
    </div>
    
    <!-- 周视图 -->
    <div v-if="viewMode === 'week'" class="space-y-4">
      <div class="flex items-center justify-between">
        <el-button @click="previousWeek" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowLeft />
          </el-icon>
        </el-button>
        <h3 class="text-lg font-medium">{{ formatWeekRange(currentWeek) }}</h3>
        <el-button @click="nextWeek" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
      
      <div class="grid grid-cols-7 gap-2">
        <div 
          v-for="day in weekDays" 
          :key="day.date"
          class="border rounded-lg p-3"
          :class="{ 'bg-blue-50 border-blue-200': isToday(day.date) }"
        >
          <div class="text-center">
            <div class="text-sm font-medium text-gray-900">{{ day.name }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(day.date) }}</div>
          </div>
          <div class="mt-2 space-y-1">
            <div 
              v-for="classItem in getDayClasses(day.date)"
              :key="classItem.id"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-200"
              @click="viewClassDetails(classItem)"
            >
              <div class="font-medium">{{ classItem.start_time }}</div>
              <div class="truncate">{{ classItem.activity }}</div>
              <div class="text-blue-600">{{ classItem.location }}</div>
              <div class="text-xs text-blue-500">{{ classItem.current_bookings }}/{{ classItem.max_capacity }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月视图 -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <el-button @click="previousMonth" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowLeft />
          </el-icon>
        </el-button>
        <h3 class="text-lg font-medium">{{ formatMonth(currentMonth) }}</h3>
        <el-button @click="nextMonth" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
      
      <div class="grid grid-cols-7 gap-1 text-center">
        <div class="p-2 text-sm font-medium text-gray-500">日</div>
        <div class="p-2 text-sm font-medium text-gray-500">一</div>
        <div class="p-2 text-sm font-medium text-gray-500">二</div>
        <div class="p-2 text-sm font-medium text-gray-500">三</div>
        <div class="p-2 text-sm font-medium text-gray-500">四</div>
        <div class="p-2 text-sm font-medium text-gray-500">五</div>
        <div class="p-2 text-sm font-medium text-gray-500">六</div>
        
        <div 
          v-for="day in monthDays" 
          :key="day.date"
          class="p-2 min-h-[80px] border border-gray-200"
          :class="{ 
            'bg-blue-50': isToday(day.date),
            'text-gray-400': !day.isCurrentMonth
          }"
        >
          <div class="text-sm font-medium">{{ day.day }}</div>
          <div class="mt-1 space-y-1">
            <div 
              v-for="classItem in getDayClasses(day.date)"
              :key="classItem.id"
              class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs cursor-pointer hover:bg-blue-200"
              @click="viewClassDetails(classItem)"
            >
              {{ classItem.start_time }} {{ classItem.activity }}
            </div>
          </div>
        </div>
      </div>
    </div>

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
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.activity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">地点</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.location }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">日期</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.date }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">时间</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.start_time }} - {{ selectedClass.end_time }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">容量</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.current_bookings }}/{{ selectedClass.max_capacity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">状态</label>
            <el-tag :type="selectedClass.status === 'confirmed' ? 'success' : 'warning'">
              {{ selectedClass.status === 'confirmed' ? '已确认' : '待确认' }}
            </el-tag>
          </div>
        </div>
        <div v-if="selectedClass.notes">
          <label class="text-sm font-medium text-gray-500">备注</label>
          <p class="text-gray-900">{{ selectedClass.notes }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoachService } from '@/composables/useCoachService'
import Swal from 'sweetalert2'

const {
  coachInfo,
  coachClasses,
  getCoachClasses
} = useCoachService()

// 响应式数据
const viewMode = ref('week')
const currentWeek = ref(new Date())
const currentMonth = ref(new Date())
const showClassDetailsModal = ref(false)
const selectedClass = ref(null)

// 初始化数据
onMounted(async () => {
  await getCoachClasses(coachInfo.value.id)
})

// 计算属性
const weekDays = computed(() => {
  const days = []
  const startOfWeek = new Date(currentWeek.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    days.push({
      name: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][i],
      date: day.toISOString().split('T')[0]
    })
  }
  return days
})

const monthDays = computed(() => {
  const days = []
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    days.push({
      date: day.toISOString().split('T')[0],
      day: day.getDate(),
      isCurrentMonth: day.getMonth() === month
    })
  }
  return days
})

// 工具函数
const formatWeekRange = (date) => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
}

const formatMonth = (date) => {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const isToday = (date) => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

const getDayClasses = (date) => {
  return coachClasses.value.filter(cls => cls.date === date)
}

// 事件处理函数
const refreshSchedule = async () => {
  try {
    await getCoachClasses(coachInfo.value.id)
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

// 周/月导航
const previousWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() - 7)
  currentWeek.value = newWeek
}

const nextWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() + 7)
  currentWeek.value = newWeek
}

const previousMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() - 1)
  currentMonth.value = newMonth
}

const nextMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + 1)
  currentMonth.value = newMonth
}
</script>
