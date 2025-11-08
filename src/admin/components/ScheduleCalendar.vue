<template>
  <div class="bg-white rounded-lg border">
    <div class="p-4 border-b">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <div class="flex items-center space-x-2">
          <el-button-group v-if="showViewToggle">
            <el-button 
              :type="viewMode === 'week' ? 'primary' : 'default'"
              @click="handleViewModeChange('week')"
              size="small"
            >
              周视图
            </el-button>
            <el-button 
              :type="viewMode === 'month' ? 'primary' : 'default'"
              @click="handleViewModeChange('month')"
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
          :class="{ 'bg-green-50 border-green-200': isToday(day.date) }"
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
import dayjs from 'dayjs'

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
  'date-change': [date: Date, viewMode: 'week' | 'month']
  'refresh': []
  'view-mode-change': [viewMode: 'week' | 'month', date: Date]
}>()

// 响应式数据
const viewMode = ref(props.defaultViewMode)
const currentWeek = ref(new Date())
const currentMonth = ref(new Date())

// 计算属性
const weekDays = computed(() => {
  const days = []
  // 使用 dayjs 获取本周的开始日期（星期日）
  // 通过减去当前日期的星期几来获取本周的星期日
  const currentDate = dayjs(currentWeek.value)
  const dayOfWeek = currentDate.day() // 0=周日, 1=周一, ..., 6=周六
  const startOfWeek = currentDate.subtract(dayOfWeek, 'day')

  const weekDayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  
  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.add(i, 'day')
    const actualDayOfWeek = day.day() // 获取实际的星期几
    days.push({
      name: weekDayNames[actualDayOfWeek],
      date: day.format('YYYY-MM-DD')
    })
  }
  return days
})

const monthDays = computed(() => {
  const days = []
  // 使用 dayjs 获取月份的第一天和该周的开始日期（星期日）
  const firstDay = dayjs(currentMonth.value).startOf('month')
  const dayOfWeek = firstDay.day() // 0=周日, 1=周一, ..., 6=周六
  const startDate = firstDay.subtract(dayOfWeek, 'day')
  
  for (let i = 0; i < 42; i++) {
    const day = startDate.add(i, 'day')
    days.push({
      date: day.format('YYYY-MM-DD'),
      day: day.date(),
      isCurrentMonth: day.month() === firstDay.month()
    })
  }
  return days
})

// 工具函数
const formatWeekRange = (date: Date) => {
  // 使用 dayjs 获取本周的开始和结束日期（星期日到星期六）
  const currentDate = dayjs(date)
  const dayOfWeek = currentDate.day() // 0=周日, 1=周一, ..., 6=周六
  const startOfWeek = currentDate.subtract(dayOfWeek, 'day')
  const endOfWeek = startOfWeek.add(6, 'day')
  return `${formatDate(startOfWeek.toDate())} - ${formatDate(endOfWeek.toDate())}`
}

const formatMonth = (date: Date) => {
  return dayjs(date).format('YYYY年MM月')
}

const formatDate = (date: Date | string) => {
  return dayjs(date).format('MM/DD')
}

const formatTime = (datetime: string) => {
  if (!datetime) return ''
  return dayjs(datetime).format('HH:mm')
}

const isToday = (date: string) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

// 获取指定日期的排班
const getScheduleForDate = (date: string) => {
  return props.schedules
    .filter(schedule => {
      // 使用 dayjs 比较日期，避免时区问题
      return dayjs(schedule.startTime).isSame(dayjs(date), 'day')
    })
    .sort((a, b) => {
      return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf()
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

// 处理视图模式切换
const handleViewModeChange = (mode: 'week' | 'month') => {
  viewMode.value = mode
  const currentDate = mode === 'week' ? currentWeek.value : currentMonth.value
  emit('view-mode-change', mode, currentDate)
  emit('date-change', currentDate, mode)
}

// 周/月导航
const previousWeek = () => {
  const newWeek = dayjs(currentWeek.value).subtract(1, 'week').toDate()
  currentWeek.value = newWeek
  emit('date-change', newWeek, 'week')
}

const nextWeek = () => {
  const newWeek = dayjs(currentWeek.value).add(1, 'week').toDate()
  currentWeek.value = newWeek
  emit('date-change', newWeek, 'week')
}

const previousMonth = () => {
  const newMonth = dayjs(currentMonth.value).subtract(1, 'month').toDate()
  currentMonth.value = newMonth
  emit('date-change', newMonth, 'month')
}

const nextMonth = () => {
  const newMonth = dayjs(currentMonth.value).add(1, 'month').toDate()
  currentMonth.value = newMonth
  emit('date-change', newMonth, 'month')
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
