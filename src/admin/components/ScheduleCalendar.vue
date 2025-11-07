<template>
  <div class="bg-white rounded-lg border">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="flex items-center space-x-2">
          <el-button-group v-if="showViewToggle">
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
          <el-button @click="refreshSchedule" type="default" size="small" v-if="showRefresh">
            <el-icon class="w-4 h-4 mr-1">
              <Refresh />
            </el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 周视图 -->
    <div v-if="viewMode === 'week'" class="p-4">
      <div class="flex items-center justify-between mb-4">
        <el-button @click="previousWeek" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowLeft />
          </el-icon>
        </el-button>
        <h4 class="text-lg font-medium">{{ formatWeekRange(currentWeek) }}</h4>
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
              v-for="schedule in getScheduleForDate(day.date)"
              :key="schedule.id"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-blue-200"
              @click="handleScheduleClick(schedule)"
            >
              <div class="font-medium">{{ formatTime(schedule.startTime) }}</div>
              <div class="truncate">{{ schedule.courseName }}</div>
              <div class="text-blue-600">{{ schedule.location }}</div>
              <div class="text-xs text-blue-500">
                {{ schedule.bookingCount }}/{{ schedule.maxCapacity }}人
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月视图 -->
    <div v-else class="p-4">
      <div class="flex items-center justify-between mb-4">
        <el-button @click="previousMonth" type="text" class="p-2">
          <el-icon class="h-5 w-5">
            <ArrowLeft />
          </el-icon>
        </el-button>
        <h4 class="text-lg font-medium">{{ formatMonth(currentMonth) }}</h4>
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
              v-for="schedule in getScheduleForDate(day.date)"
              :key="schedule.id"
              class="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs cursor-pointer hover:bg-blue-200"
              @click="handleScheduleClick(schedule)"
            >
              {{ formatTime(schedule.startTime) }} {{ schedule.courseName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowLeft, ArrowRight, Refresh } from '@element-plus/icons-vue'
import type { Schedule } from '@/api/schedule'

// Props
const props = withDefaults(defineProps<{
  schedules: Schedule[]
  title?: string
  showViewToggle?: boolean
  showRefresh?: boolean
  defaultViewMode?: 'week' | 'month'
}>(), {
  title: '排班日历',
  showViewToggle: true,
  showRefresh: false,
  defaultViewMode: 'week'
})

// Emits
const emit = defineEmits<{
  'schedule-click': [schedule: Schedule]
  'date-change': [date: Date]
  'refresh': []
}>()

// 响应式数据
const viewMode = ref(props.defaultViewMode)
const currentWeek = ref(new Date())
const currentMonth = ref(new Date())

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
const formatWeekRange = (date: Date) => {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
}

const formatMonth = (date: Date) => {
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
}

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const formatTime = (datetime: string) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const isToday = (date: string) => {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

// 获取指定日期的排班
const getScheduleForDate = (date: string) => {
  return props.schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.startTime).toISOString().split('T')[0]
    return scheduleDate === date
  })
}

// 处理排班点击
const handleScheduleClick = (schedule: Schedule) => {
  emit('schedule-click', schedule)
}

// 刷新排班
const refreshSchedule = () => {
  emit('refresh')
}

// 周/月导航
const previousWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() - 7)
  currentWeek.value = newWeek
  emit('date-change', newWeek)
}

const nextWeek = () => {
  const newWeek = new Date(currentWeek.value)
  newWeek.setDate(newWeek.getDate() + 7)
  currentWeek.value = newWeek
  emit('date-change', newWeek)
}

const previousMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() - 1)
  currentMonth.value = newMonth
  emit('date-change', newMonth)
}

const nextMonth = () => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + 1)
  currentMonth.value = newMonth
  emit('date-change', newMonth)
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
