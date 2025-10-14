<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">课程预约</h1>
            <p class="text-gray-600 mt-1">预约您喜欢的健身课程，开始您的健身之旅</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">当前时间</div>
            <div class="text-lg font-semibold text-gray-900">{{ currentTime }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">选择日期</label>
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">课程类型</label>
            <el-select v-model="selectedType" placeholder="全部类型" @change="handleFilterChange" class="w-full">
              <el-option label="全部类型" value="" />
              <el-option label="瑜伽" value="瑜伽" />
              <el-option label="力量训练" value="力量训练" />
              <el-option label="有氧运动" value="有氧运动" />
              <el-option label="舞蹈" value="舞蹈" />
              <el-option label="游泳" value="游泳" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">教练</label>
            <el-select v-model="selectedInstructor" placeholder="全部教练" @change="handleFilterChange" class="w-full">
              <el-option label="全部教练" value="" />
              <el-option label="李教练" value="李教练" />
              <el-option label="王教练" value="王教练" />
              <el-option label="张教练" value="张教练" />
              <el-option label="陈教练" value="陈教练" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">搜索课程</label>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索课程名称"
              @input="handleFilterChange"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="space-y-6">
        <div v-if="loading" class="text-center py-12">
          <el-icon class="w-12 h-12 text-gray-400 animate-spin">
            <Loading />
          </el-icon>
          <p class="text-gray-500 mt-4">加载课程中...</p>
        </div>

        <div v-else-if="filteredClasses.length === 0" class="text-center py-12">
          <el-icon class="w-16 h-16 text-gray-300 mb-4">
            <Calendar />
          </el-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
          <p class="text-gray-500">当前筛选条件下没有找到课程</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="classItem in filteredClasses"
            :key="classItem.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-900 mr-4">{{ classItem.name }}</h3>
                    <el-tag :type="getClassTypeColor(classItem.name)" size="small">
                      {{ getClassType(classItem.name) }}
                    </el-tag>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-blue-500">
                        <User />
                      </el-icon>
                      <span>{{ classItem.instructor }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-green-500">
                        <Calendar />
                      </el-icon>
                      <span>{{ formatDate(classItem.date) }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-purple-500">
                        <Clock />
                      </el-icon>
                      <span>{{ classItem.start_time }} - {{ classItem.end_time }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-orange-500">
                        <Location />
                      </el-icon>
                      <span>{{ classItem.location }}</span>
                    </div>
                  </div>

                  <p class="text-gray-600 mb-4">{{ classItem.description }}</p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-blue-500">
                          <UserFilled />
                        </el-icon>
                        <span>{{ classItem.current_participants }}/{{ classItem.max_participants }} 人</span>
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-green-500">
                          <CircleCheck />
                        </el-icon>
                        <span>{{ getAvailabilityText(classItem) }}</span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-3">
                      <!-- 预约状态显示 -->
                      <div v-if="isBooked(classItem.id)" class="flex items-center text-green-600">
                        <el-icon class="w-5 h-5 mr-1">
                          <Check />
                        </el-icon>
                        <span class="font-medium">已预约</span>
                      </div>
                      
                      <!-- 预约按钮 -->
                      <el-button
                        v-else-if="canBook(classItem)"
                        @click="handleBooking(classItem)"
                        :loading="bookingLoading[classItem.id]"
                        type="primary"
                        size="large"
                      >
                        <el-icon class="w-5 h-5 mr-1">
                          <Calendar />
                        </el-icon>
                        立即预约
                      </el-button>
                      
                      <!-- 不可预约状态 -->
                      <el-button
                        v-else
                        disabled
                        type="info"
                        size="large"
                      >
                        {{ getBookingDisabledReason(classItem) }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的预约记录 -->
      <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
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
                  {{ booking.classes?.name || '课程' }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(booking.classes?.date) }} {{ booking.classes?.start_time }} - {{ booking.classes?.end_time }}
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <el-tag :type="getBookingStatusType(booking.status)" size="small">
                {{ getBookingStatusText(booking.status) }}
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

    <!-- 预约确认对话框 -->
    <el-dialog v-model="bookingDialogVisible" title="确认预约" width="500px">
      <div v-if="selectedClass" class="space-y-4">
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ selectedClass.name }}</h3>
          <p class="text-gray-600">{{ selectedClass.description }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">教练：</span>
            <span class="font-medium">{{ selectedClass.instructor }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">时间：</span>
            <span class="font-medium">{{ formatDate(selectedClass.date) }} {{ selectedClass.start_time }} - {{ selectedClass.end_time }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">地点：</span>
            <span class="font-medium">{{ selectedClass.location }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">参与人数：</span>
            <span class="font-medium">{{ selectedClass.current_participants }}/{{ selectedClass.max_participants }}</span>
          </div>
        </div>

        <div class="text-sm text-gray-500">
          <p>• 预约成功后请按时参加课程</p>
          <p>• 如需取消预约，请提前2小时操作</p>
          <p>• 连续3次无故缺席将影响后续预约权限</p>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="bookingDialogVisible = false">取消</el-button>
        <el-button @click="confirmBooking" type="primary" :loading="confirmingBooking">
          确认预约
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { classService } from '@/services/classService'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const { getCurrentUser } = useAuth()

// 响应式数据
const loading = ref(false)
const currentTime = ref('')
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedType = ref('')
const selectedInstructor = ref('')
const searchKeyword = ref('')
const classes = ref([])
const myBookings = ref([])
const bookingLoading = ref({})
const cancelingBooking = ref({})
const confirmingBooking = ref(false)
const bookingDialogVisible = ref(false)
const selectedClass = ref(null)

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
    const user = getCurrentUser()
    if (!user) return

    // 加载课程数据
    const classData = await classService.getClasses(selectedDate.value)
    classes.value = classData

    // 加载我的预约记录
    const bookings = await classService.getMemberBookings(user.id)
    myBookings.value = bookings
  } catch (error) {
    console.error('Error loading data:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 筛选后的课程
const filteredClasses = computed(() => {
  let filtered = classes.value

  // 按类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(cls => cls.name.includes(selectedType.value))
  }

  // 按教练筛选
  if (selectedInstructor.value) {
    filtered = filtered.filter(cls => cls.instructor === selectedInstructor.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(cls => 
      cls.name.toLowerCase().includes(keyword) ||
      cls.description.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 处理日期变化
const handleDateChange = async () => {
  await loadData()
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑在computed中处理
}

// 检查是否已预约
const isBooked = (classId) => {
  return myBookings.value.some(booking => 
    booking.class_id === classId && booking.status === 'confirmed'
  )
}

// 检查是否可以预约
const canBook = (classItem) => {
  const now = dayjs()
  const classDateTime = dayjs(`${classItem.date} ${classItem.start_time}`)
  
  // 课程已开始或已结束
  if (now.isAfter(classDateTime)) {
    return false
  }
  
  // 课程已满员
  if (classItem.current_participants >= classItem.max_participants) {
    return false
  }
  
  return true
}

// 获取预约禁用原因
const getBookingDisabledReason = (classItem) => {
  const now = dayjs()
  const classDateTime = dayjs(`${classItem.date} ${classItem.start_time}`)
  
  if (now.isAfter(classDateTime)) {
    return '课程已结束'
  }
  
  if (classItem.current_participants >= classItem.max_participants) {
    return '课程已满'
  }
  
  return '不可预约'
}

// 处理预约
const handleBooking = (classItem) => {
  selectedClass.value = classItem
  bookingDialogVisible.value = true
}

// 确认预约
const confirmBooking = async () => {
  if (!selectedClass.value) return

  confirmingBooking.value = true
  try {
    const user = getCurrentUser()
    if (!user) {
      ElMessage.error('请先登录')
      return
    }

    await classService.bookClass(selectedClass.value.id, user.id)
    
    ElMessage.success('预约成功！')
    bookingDialogVisible.value = false
    
    // 刷新数据
    await loadData()
  } catch (error) {
    console.error('Error booking class:', error)
    ElMessage.error('预约失败，请重试')
  } finally {
    confirmingBooking.value = false
  }
}

// 检查是否可以取消预约
const canCancelBooking = (booking) => {
  const now = dayjs()
  const classDateTime = dayjs(`${booking.classes?.date} ${booking.classes?.start_time}`)
  
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

    const user = getCurrentUser()
    if (!user) return

    await classService.cancelBooking(booking.class_id, user.id)
    
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

// 获取课程类型
const getClassType = (name) => {
  if (name.includes('瑜伽')) return '瑜伽'
  if (name.includes('力量')) return '力量训练'
  if (name.includes('单车') || name.includes('舞蹈') || name.includes('有氧')) return '有氧运动'
  if (name.includes('游泳')) return '游泳'
  return '其他'
}

// 获取课程类型颜色
const getClassTypeColor = (name) => {
  const type = getClassType(name)
  const colorMap = {
    '瑜伽': 'success',
    '力量训练': 'warning',
    '有氧运动': 'primary',
    '游泳': 'info',
    '其他': 'default'
  }
  return colorMap[type] || 'default'
}

// 获取可用性文本
const getAvailabilityText = (classItem) => {
  const remaining = classItem.max_participants - classItem.current_participants
  if (remaining <= 0) return '已满员'
  if (remaining <= 3) return `仅剩${remaining}个名额`
  return '可预约'
}

// 获取预约状态类型
const getBookingStatusType = (status) => {
  const typeMap = {
    'confirmed': 'success',
    'pending': 'warning',
    'cancelled': 'danger'
  }
  return typeMap[status] || 'default'
}

// 获取预约状态文本
const getBookingStatusText = (status) => {
  const textMap = {
    'confirmed': '已确认',
    'pending': '待确认',
    'cancelled': '已取消'
  }
  return textMap[status] || '未知'
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('MM月DD日 dddd')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
