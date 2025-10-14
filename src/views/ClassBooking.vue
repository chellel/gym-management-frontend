<template>
  <div class="space-y-6">
      <!-- 页面标题 -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">课程预约</h1>
          <p class="mt-1 text-sm text-gray-600">查看和预约健身课程，管理课程安排。</p>
        </div>
        <el-button
          @click="showAddClassModal = true"
          type="primary"
          class="inline-flex items-center"
        >
          <el-icon class="w-5 h-5 mr-2">
            <Plus />
          </el-icon>
          添加课程
        </el-button>
      </div>

      <!-- 日期选择器 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex-1">
            <label for="date-select" class="block text-sm font-medium text-gray-700 mb-2">
              选择日期
            </label>
            <el-date-picker
              v-model="selectedDate"
              @change="handleDateChange"
              type="date"
              placeholder="选择日期"
              class="w-full"
            />
          </div>
          <div class="flex items-end">
            <el-button
              @click="goToToday"
              type="default"
            >
              今天
            </el-button>
          </div>
        </div>
      </div>

      <!-- 课程列表 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>

        <div v-else-if="filteredClasses.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="classItem in filteredClasses"
            :key="classItem.id"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <el-icon class="h-6 w-6 text-primary-600">
                        <Calendar />
                      </el-icon>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="text-lg font-medium text-gray-900">{{ classItem.name }}</h3>
                        <div class="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <div class="flex items-center">
                            <el-icon class="h-4 w-4 mr-1">
                              <Clock />
                            </el-icon>
                            {{ classItem.start_time }} - {{ classItem.end_time }}
                          </div>
                          <div class="flex items-center">
                            <el-icon class="h-4 w-4 mr-1">
                              <LocationFilled />
                            </el-icon>
                            {{ classItem.location }}
                          </div>
                          <div class="flex items-center">
                            <el-icon class="h-4 w-4 mr-1">
                              <User />
                            </el-icon>
                            {{ classItem.instructor }}
                          </div>
                        </div>
                        <div class="mt-1 text-sm text-gray-600">
                          {{ classItem.description }}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm text-gray-500">
                          参与人数
                        </div>
                        <div class="text-lg font-medium" :class="getCapacityColor(classItem)">
                          {{ classItem.current_participants || 0 }} / {{ classItem.max_participants }}
                        </div>
                        <div class="mt-1">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getStatusClass(classItem)"
                          >
                            {{ getStatusText(classItem) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="ml-6 flex items-center space-x-2">
                <el-button
                  v-if="canBook(classItem)"
                  @click="bookClass(classItem)"
                  type="success"
                  size="small"
                >
                  <el-icon class="h-4 w-4 mr-1">
                    <Calendar />
                  </el-icon>
                  预约
                </el-button>
                <el-button
                  @click="editClass(classItem)"
                  type="primary"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Edit />
                  </el-icon>
                </el-button>
                <el-button
                  @click="deleteClass(classItem.id, classItem.name)"
                  type="danger"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6 text-center text-gray-500">
          <el-icon class="mx-auto h-12 w-12 text-gray-400">
            <Calendar />
          </el-icon>
          <h3 class="mt-2 text-sm font-medium text-gray-900">暂无课程安排</h3>
          <p class="mt-1 text-sm text-gray-500">{{ selectedDate }}暂无课程安排，请选择其他日期或添加新课程。</p>
        </div>
      </div>

      <!-- 我的预约 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">我的预约</h3>
        </div>
        <div class="px-6 py-4">
          <div v-if="myBookings.length > 0" class="space-y-4">
            <div
              v-for="booking in myBookings"
              :key="booking.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h4 class="text-sm font-medium text-gray-900">{{ booking.classes?.name }}</h4>
                <p class="text-sm text-gray-500">
                  {{ formatDate(booking.classes?.date) }} 
                  {{ booking.classes?.start_time }} - {{ booking.classes?.end_time }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ booking.classes?.instructor }} · {{ booking.classes?.location }}
                </p>
              </div>
              <el-button
                @click="cancelBooking(booking.class_id)"
                type="danger"
                size="small"
              >
                取消预约
              </el-button>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            <p>暂无预约记录</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑课程模态框 -->
    <div v-if="showAddClassModal || showEditClassModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showAddClassModal ? '添加课程' : '编辑课程' }}
            </h3>
            <el-button
              @click="closeModal"
              type="text"
              class="text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-6 w-6">
                <Close />
              </el-icon>
            </el-button>
          </div>

          <el-form @submit.prevent="showAddClassModal ? handleAddClass() : handleUpdateClass()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-form-item label="课程名称" required>
                <el-input
                  v-model="classForm.name"
                  placeholder="请输入课程名称"
                  clearable
                />
              </el-form-item>

              <el-form-item label="教练" required>
                <el-input
                  v-model="classForm.instructor"
                  placeholder="请输入教练姓名"
                  clearable
                />
              </el-form-item>

              <el-form-item label="课程日期" required>
                <el-date-picker
                  v-model="classForm.date"
                  type="date"
                  placeholder="选择课程日期"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="上课地点" required>
                <el-input
                  v-model="classForm.location"
                  placeholder="请输入上课地点"
                  clearable
                />
              </el-form-item>

              <el-form-item label="开始时间" required>
                <el-time-picker
                  v-model="classForm.start_time"
                  placeholder="选择开始时间"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="结束时间" required>
                <el-time-picker
                  v-model="classForm.end_time"
                  placeholder="选择结束时间"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="最大参与人数" required>
                <el-input-number
                  v-model="classForm.max_participants"
                  :min="1"
                  placeholder="请输入最大参与人数"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="课程描述" class="md:col-span-2">
                <el-input
                  v-model="classForm.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入课程描述"
                />
              </el-form-item>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <el-button
                @click="closeModal"
                type="default"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                native-type="submit"
              >
                {{ showAddClassModal ? '添加' : '保存' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { classService, mockClasses } from '../services/classService'
import { useAuth } from '../composables/useAuth'
import Swal from 'sweetalert2'
// Element Plus 图标已全局注册，无需导入

// 响应式数据
const classes = ref([])
const myBookings = ref([])
const loading = ref(false)
const selectedDate = ref(new Date().toISOString().split('T')[0])

// 模态框状态
const showAddClassModal = ref(false)
const showEditClassModal = ref(false)
const editingClass = ref(null)

// 课程表单
const classForm = reactive({
  name: '',
  instructor: '',
  date: '',
  start_time: '',
  end_time: '',
  location: '',
  max_participants: 20,
  description: ''
})

// 当前用户
const currentUser = ref(null)

// 计算属性
const filteredClasses = computed(() => {
  return classes.value.filter(classItem => classItem.date === selectedDate.value)
})

// 初始化
onMounted(async () => {
  const { getCurrentUser } = useAuth()
  currentUser.value = getCurrentUser()
  await fetchClasses()
  await fetchMyBookings()
})

// 获取课程列表
const fetchClasses = async () => {
  loading.value = true
  try {
    const data = await classService.getClasses()
    classes.value = data || []
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    // 使用模拟数据
    classes.value = mockClasses
  } finally {
    loading.value = false
  }
}

// 获取我的预约
const fetchMyBookings = async () => {
  if (!currentUser.value) return
  
  try {
    const data = await classService.getMemberBookings(currentUser.value.id)
    myBookings.value = data || []
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    myBookings.value = []
  }
}

// 日期变化处理
const handleDateChange = () => {
  // 可以在这里添加额外的逻辑
}

// 跳转到今天
const goToToday = () => {
  selectedDate.value = new Date().toISOString().split('T')[0]
}

// 检查是否可以预约
const canBook = (classItem) => {
  const now = new Date()
  const classDate = new Date(`${classItem.date}T${classItem.start_time}`)
  const currentParticipants = classItem.current_participants || 0
  
  return classDate > now && currentParticipants < classItem.max_participants
}

// 获取容量颜色
const getCapacityColor = (classItem) => {
  const ratio = (classItem.current_participants || 0) / classItem.max_participants
  if (ratio >= 1) return 'text-red-600'
  if (ratio >= 0.8) return 'text-yellow-600'
  return 'text-green-600'
}

// 获取状态样式
const getStatusClass = (classItem) => {
  const now = new Date()
  const classDate = new Date(`${classItem.date}T${classItem.start_time}`)
  const currentParticipants = classItem.current_participants || 0
  
  if (classDate <= now) {
    return 'bg-gray-100 text-gray-800'
  } else if (currentParticipants >= classItem.max_participants) {
    return 'bg-red-100 text-red-800'
  } else if (currentParticipants >= classItem.max_participants * 0.8) {
    return 'bg-yellow-100 text-yellow-800'
  } else {
    return 'bg-green-100 text-green-800'
  }
}

// 获取状态文本
const getStatusText = (classItem) => {
  const now = new Date()
  const classDate = new Date(`${classItem.date}T${classItem.start_time}`)
  const currentParticipants = classItem.current_participants || 0
  
  if (classDate <= now) {
    return '已结束'
  } else if (currentParticipants >= classItem.max_participants) {
    return '已满员'
  } else if (currentParticipants >= classItem.max_participants * 0.8) {
    return '即将满员'
  } else {
    return '可预约'
  }
}

// 预约课程
const bookClass = async (classItem) => {
  if (!currentUser.value) {
    await Swal.fire({
      title: '请先登录',
      text: '需要登录后才能预约课程',
      icon: 'warning'
    })
    return
  }

  try {
    await classService.bookClass(classItem.id, currentUser.value.id)
    await Swal.fire({
      title: '预约成功',
      text: `已成功预约课程"${classItem.name}"`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    await fetchClasses()
    await fetchMyBookings()
  } catch (error) {
    console.error('Failed to book class:', error)
    await Swal.fire({
      title: '预约失败',
      text: '预约课程失败，请重试',
      icon: 'error'
    })
  }
}

// 取消预约
const cancelBooking = async (classId) => {
  const result = await Swal.fire({
    title: '确认取消',
    text: '确定要取消预约吗？',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '取消预约',
    cancelButtonText: '保留'
  })

  if (result.isConfirmed) {
    try {
      await classService.cancelBooking(classId, currentUser.value.id)
      await Swal.fire({
        title: '已取消',
        text: '预约已成功取消',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await fetchClasses()
      await fetchMyBookings()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      await Swal.fire({
        title: '取消失败',
        text: '取消预约失败，请重试',
        icon: 'error'
      })
    }
  }
}

// 删除课程
const deleteClass = async (id, name) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: `确定要删除课程"${name}"吗？此操作不可恢复！`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })

  if (result.isConfirmed) {
    try {
      await classService.deleteClass(id)
      await Swal.fire({
        title: '已删除',
        text: '课程删除成功！',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await fetchClasses()
    } catch (error) {
      console.error('Failed to delete class:', error)
      await Swal.fire({
        title: '删除失败',
        text: '删除课程失败，请重试',
        icon: 'error'
      })
    }
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(classForm, {
    name: '',
    instructor: '',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: 20,
    description: ''
  })
}

// 关闭模态框
const closeModal = () => {
  showAddClassModal.value = false
  showEditClassModal.value = false
  editingClass.value = null
  resetForm()
}

// 编辑课程
const editClass = (classItem) => {
  editingClass.value = classItem
  Object.assign(classForm, {
    name: classItem.name,
    instructor: classItem.instructor,
    date: classItem.date,
    start_time: classItem.start_time,
    end_time: classItem.end_time,
    location: classItem.location,
    max_participants: classItem.max_participants,
    description: classItem.description || ''
  })
  showEditClassModal.value = true
}

// 添加课程
const handleAddClass = async () => {
  try {
    await classService.addClass({
      ...classForm,
      current_participants: 0
    })
    await Swal.fire({
      title: '添加成功',
      text: '课程添加成功！',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    await fetchClasses()
    closeModal()
  } catch (error) {
    console.error('Failed to add class:', error)
    await Swal.fire({
      title: '添加失败',
      text: '添加课程失败，请重试',
      icon: 'error'
    })
  }
}

// 更新课程
const handleUpdateClass = async () => {
  try {
    await classService.updateClass(editingClass.value.id, classForm)
    await Swal.fire({
      title: '更新成功',
      text: '课程信息更新成功！',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    await fetchClasses()
    closeModal()
  } catch (error) {
    console.error('Failed to update class:', error)
    await Swal.fire({
      title: '更新失败',
      text: '更新课程信息失败，请重试',
      icon: 'error'
    })
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}
</script>
