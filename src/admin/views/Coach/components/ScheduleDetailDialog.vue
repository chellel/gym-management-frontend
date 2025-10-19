<template>
  <el-dialog
    v-model="dialogVisible"
    title="排班详情"
    width="700px"
    :close-on-click-modal="false"
  >
    <div v-if="schedule" class="space-y-6">
      <!-- 基本信息 -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">课程名称</label>
            <p class="text-gray-900 font-medium">{{ schedule.activity }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">地点</label>
            <p class="text-gray-900">{{ schedule.location }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <p class="text-gray-900">{{ formatDate(schedule.date) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">时间</label>
            <p class="text-gray-900">{{ schedule.start_time }} - {{ schedule.end_time }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">容量</label>
            <p class="text-gray-900">{{ schedule.current_bookings }}/{{ schedule.max_capacity }} 人</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <el-tag :type="getStatusType(schedule.status)" size="large">
              {{ getStatusText(schedule.status) }}
            </el-tag>
          </div>
        </div>
        <div v-if="schedule.notes" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <p class="text-gray-600">{{ schedule.notes }}</p>
        </div>
      </div>

      <!-- 学员列表 -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">学员列表</h3>
          <div class="flex space-x-2">
            <el-button size="small" @click="loadMembers" :loading="membersLoading">
              <el-icon class="mr-1"><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button size="small" @click="exportMembers">
              <el-icon class="mr-1"><Download /></el-icon>
              导出名单
            </el-button>
          </div>
        </div>
        
        <div v-if="members.length > 0" class="space-y-3">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <el-avatar :size="40" :src="member.avatar" :alt="member.name">
                {{ member.name.charAt(0) }}
              </el-avatar>
              <div>
                <div class="font-medium text-gray-900">{{ member.name }}</div>
                <div class="text-sm text-gray-500">{{ member.phone }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <el-tag
                :type="getAttendanceType(member.attendance_status)"
                size="small"
              >
                {{ getAttendanceText(member.attendance_status) }}
              </el-tag>
              <el-button size="small" @click="toggleAttendance(member)">
                {{ member.attendance_status === 'present' ? '取消签到' : '确认签到' }}
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          暂无学员预约
        </div>
      </div>

      <!-- 课程统计 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ members.length }}</div>
          <div class="text-sm text-gray-500">预约人数</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ presentCount }}</div>
          <div class="text-sm text-gray-500">已签到</div>
        </div>
        <div class="bg-white rounded-lg border p-4 text-center">
          <div class="text-2xl font-bold text-red-600">{{ absentCount }}</div>
          <div class="text-sm text-gray-500">未签到</div>
        </div>
      </div>

      <!-- 课程评价 -->
      <div v-if="reviews.length > 0" class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">课程评价</h3>
        <div class="space-y-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="border-l-4 border-blue-500 pl-4 py-2"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="font-medium text-gray-900">{{ review.member_name }}</div>
              <div class="flex items-center">
                <el-rate
                  v-model="review.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </div>
            </div>
            <p class="text-gray-600 text-sm">{{ review.comment }}</p>
            <div class="text-xs text-gray-400 mt-1">
              {{ formatDate(review.created_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editSchedule">
          <el-icon class="mr-1"><Edit /></el-icon>
          编辑排班
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { type CoachSchedule } from '@/api/coach'

// Props
const props = defineProps<{
  visible: boolean
  schedule?: CoachSchedule | null
}>()

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'edit': [schedule: CoachSchedule]
}>()

// 响应式数据
const members = ref([])
const reviews = ref([])
const membersLoading = ref(false)

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const presentCount = computed(() => {
  return members.value.filter(member => member.attendance_status === 'present').length
})

const absentCount = computed(() => {
  return members.value.filter(member => member.attendance_status === 'absent').length
})

// 监听排班变化
watch(() => props.schedule, (newSchedule) => {
  if (newSchedule) {
    loadMembers()
    loadReviews()
  }
}, { immediate: true })

// 加载学员列表
const loadMembers = async () => {
  if (!props.schedule) return

  try {
    membersLoading.value = true
    // 模拟数据
    members.value = [
      {
        id: 1,
        name: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        avatar: null,
        membership_type: 'VIP',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: new Date().toISOString()
      },
      {
        id: 2,
        name: '李四',
        phone: '13800138002',
        email: 'lisi@example.com',
        avatar: null,
        membership_type: '普通',
        attendance_status: 'present',
        attendance_time: new Date().toISOString(),
        booking_time: new Date().toISOString()
      },
      {
        id: 3,
        name: '王五',
        phone: '13800138003',
        email: 'wangwu@example.com',
        avatar: null,
        membership_type: 'VIP',
        attendance_status: 'absent',
        attendance_time: null,
        booking_time: new Date().toISOString()
      }
    ]

    // 实际API调用
    // const response = await coachApi.getClassMembers(props.schedule.id)
    // members.value = response.data
  } catch (error) {
    console.error('加载学员列表失败:', error)
    ElMessage.error('加载学员列表失败')
  } finally {
    membersLoading.value = false
  }
}

// 加载评价
const loadReviews = async () => {
  if (!props.schedule) return

  try {
    // 模拟数据
    reviews.value = [
      {
        id: 1,
        member_name: '张三',
        rating: 5,
        comment: '课程很棒，教练很专业！',
        created_at: '2024-01-15'
      },
      {
        id: 2,
        member_name: '李四',
        rating: 4,
        comment: '强度适中，很满意。',
        created_at: '2024-01-15'
      }
    ]

    // 实际API调用
    // const response = await coachApi.getClassReviews(props.schedule.id)
    // reviews.value = response.data
  } catch (error) {
    console.error('加载评价失败:', error)
  }
}

// 切换签到状态
const toggleAttendance = async (member: any) => {
  try {
    const newStatus = member.attendance_status === 'present' ? 'absent' : 'present'
    
    // 模拟API调用
    member.attendance_status = newStatus
    member.attendance_time = newStatus === 'present' ? new Date().toISOString() : null
    ElMessage.success(`${newStatus === 'present' ? '签到' : '取消签到'}成功`)

    // 实际API调用
    // await coachApi.markAttendance(props.schedule!.id, member.id, newStatus)
    // member.attendance_status = newStatus
    // member.attendance_time = newStatus === 'present' ? new Date().toISOString() : null
    // ElMessage.success(`${newStatus === 'present' ? '签到' : '取消签到'}成功`)
  } catch (error) {
    console.error('更新签到状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 导出学员名单
const exportMembers = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('导出成功')

    // 实际API调用
    // const response = await coachApi.exportClassMembers(props.schedule!.id)
    // const blob = new Blob([response.data])
    // const url = window.URL.createObjectURL(blob)
    // const link = document.createElement('a')
    // link.href = url
    // link.download = `${props.schedule!.activity}_学员名单_${new Date().toISOString().split('T')[0]}.csv`
    // link.click()
    // window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

// 编辑排班
const editSchedule = () => {
  if (props.schedule) {
    emit('edit', props.schedule)
    dialogVisible.value = false
  }
}

// 工具函数
const getStatusType = (status: string) => {
  const statusMap = {
    confirmed: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap = {
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || '未知'
}

const getAttendanceType = (status: string) => {
  const statusMap = {
    present: 'success',
    absent: 'danger',
    late: 'warning'
  }
  return statusMap[status] || 'info'
}

const getAttendanceText = (status: string) => {
  const statusMap = {
    present: '已签到',
    absent: '未签到',
    late: '迟到'
  }
  return statusMap[status] || '未知'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.el-rate {
  --el-rate-font-size: 14px;
}
</style>

