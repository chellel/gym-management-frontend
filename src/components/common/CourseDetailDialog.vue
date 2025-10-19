<template>
  <el-dialog v-model="visible" title="课程详情" width="600px" @close="handleClose">
    <div v-if="schedule" class="space-y-6">
      <!-- 课程基本信息 -->
      <div class="text-center">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          {{ getCourseName(schedule.courseId) }}
        </h3>
        <p class="text-gray-600">
          {{ getCourseDescription(schedule.courseId) }}
        </p>
      </div>

      <!-- 详细信息 -->
      <div class="bg-gray-50 rounded-lg p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">教练</label>
            <div class="text-lg text-gray-900">
              {{ getCoachName(schedule.coachId) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">课程类型</label>
            <div class="text-lg text-gray-900">
              {{ getClassType(getCourseName(schedule.courseId)) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <div class="text-lg text-gray-900">
              {{ formatDate(schedule.startTime) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">时间</label>
            <div class="text-lg text-gray-900">
              {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">地点</label>
            <div class="text-lg text-gray-900">
              {{ schedule.location }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">时长</label>
            <div class="text-lg text-gray-900">
              {{ getDuration(schedule) }} 分钟
            </div>
          </div>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between items-center">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">参与人数</label>
              <div class="text-lg text-gray-900">
                {{ getCurrentParticipants(schedule) }}/{{ schedule.maxCapacity }} 人
              </div>
            </div>
            <div class="text-right">
              <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
              <el-tag :type="getClassStatusType(schedule)" size="large">
                {{ getClassStatusText(schedule) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程说明 -->
      <div class="bg-blue-50 rounded-lg p-4">
        <h4 class="font-semibold text-blue-900 mb-2">课程说明</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• 请提前10分钟到达训练场地</li>
          <li>• 请穿着合适的运动服装和鞋子</li>
          <li>• 如有身体不适，请及时告知教练</li>
          <li>• 课程期间请保持手机静音</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>

      <!-- 预约/取消按钮 -->
      <el-button
        v-if="!isBooked(schedule)"
        @click="handleBook"
        type="success"
        :disabled="getCurrentParticipants(schedule) >= schedule.maxCapacity"
      >
        <el-icon class="w-4 h-4 mr-1">
          <Calendar />
        </el-icon>
        {{
          getCurrentParticipants(schedule) >= schedule.maxCapacity
            ? "已满"
            : "立即预约"
        }}
      </el-button>

      <el-button
        v-else
        @click="handleCancel"
        type="danger"
      >
        <el-icon class="w-4 h-4 mr-1">
          <Close />
        </el-icon>
        取消预约
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, Close } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  schedule: {
    type: Object,
    default: null
  },
  courses: {
    type: Array,
    default: () => []
  },
  coaches: {
    type: Array,
    default: () => []
  },
  bookings: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'book', 'cancel'])

// Computed
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Methods
const handleClose = () => {
  visible.value = false
}

const handleBook = () => {
  emit('book', props.schedule)
}

const handleCancel = () => {
  emit('cancel', props.schedule)
}

// Helper functions
const getCourseName = (courseId) => {
  const course = props.courses.find(c => c.id === courseId)
  return course ? course.name : '未知课程'
}

const getCourseDescription = (courseId) => {
  const course = props.courses.find(c => c.id === courseId)
  return course ? course.description : ''
}

const getCoachName = (coachId) => {
  const coach = props.coaches.find(c => c.id === coachId)
  return coach ? coach.name : '未知教练'
}

const getCurrentParticipants = (schedule) => {
  const scheduleBookings = props.bookings.filter(
    booking => booking.scheduleId === schedule.id && !booking.isDeleted
  )
  return scheduleBookings.length
}

const isBooked = (schedule) => {
  return props.bookings.some(
    booking => booking.scheduleId === schedule.id && !booking.isDeleted
  )
}

const getClassType = (name) => {
  if (name.includes('瑜伽')) return '瑜伽'
  if (name.includes('力量')) return '力量训练'
  if (name.includes('单车') || name.includes('舞蹈') || name.includes('有氧'))
    return '有氧运动'
  if (name.includes('游泳')) return '游泳'
  if (name.includes('拳击') || name.includes('泰拳')) return '拳击'
  if (name.includes('普拉提')) return '普拉提'
  return '其他'
}

const getClassStatusType = (schedule) => {
  const now = dayjs()
  const classDateTime = dayjs(schedule.startTime)

  if (now.isAfter(classDateTime)) {
    return 'info' // 已结束
  }

  if (getCurrentParticipants(schedule) >= schedule.maxCapacity) {
    return 'warning' // 已满员
  }

  return 'success' // 可预约
}

const getClassStatusText = (schedule) => {
  const now = dayjs()
  const classDateTime = dayjs(schedule.startTime)

  if (now.isAfter(classDateTime)) {
    return '已结束'
  }

  if (getCurrentParticipants(schedule) >= schedule.maxCapacity) {
    return '已满员'
  }

  return '可预约'
}

const getDuration = (schedule) => {
  const start = dayjs(schedule.startTime)
  const end = dayjs(schedule.endTime)
  return end.diff(start, 'minute')
}

const formatTime = (datetime) => {
  return dayjs(datetime).format('HH:mm')
}

const formatDate = (datetime) => {
  return dayjs(datetime).format('MM月DD日 dddd')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
