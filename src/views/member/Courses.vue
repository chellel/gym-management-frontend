<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">课程查询</h1>
            <p class="text-gray-600 mt-1">浏览所有可用的健身课程，找到最适合您的课程</p>
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
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <el-option label="拳击" value="拳击" />
              <el-option label="普拉提" value="普拉提" />
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
              <el-option label="刘教练" value="刘教练" />
              <el-option label="赵教练" value="赵教练" />
              <el-option label="孙教练" value="孙教练" />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">时间段</label>
            <el-select v-model="selectedTimeSlot" placeholder="全部时间" @change="handleFilterChange" class="w-full">
              <el-option label="全部时间" value="" />
              <el-option label="早晨 (06:00-12:00)" value="morning" />
              <el-option label="下午 (12:00-18:00)" value="afternoon" />
              <el-option label="晚上 (18:00-24:00)" value="evening" />
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

      <!-- 课程统计 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-blue-600">
                <Calendar />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ totalClasses }}</div>
              <div class="text-sm text-gray-600">总课程数</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-green-600">
                <User />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ availableClasses }}</div>
              <div class="text-sm text-gray-600">可预约课程</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-purple-600">
                <Clock />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ instructors.length }}</div>
              <div class="text-sm text-gray-600">活跃教练</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-orange-600">
                <Location />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ locations.length }}</div>
              <div class="text-sm text-gray-600">训练场地</div>
            </div>
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
                    <el-tag 
                      v-if="isToday(classItem.date)" 
                      type="success" 
                      size="small" 
                      class="ml-2"
                    >
                      今日课程
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
                    <div class="flex items-center space-x-6">
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
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-purple-500">
                          <Timer />
                        </el-icon>
                        <span>{{ getDuration(classItem) }} 分钟</span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-3">
                      <!-- 课程状态 -->
                      <div class="flex items-center">
                        <el-tag :type="getClassStatusType(classItem)" size="small">
                          {{ getClassStatusText(classItem) }}
                        </el-tag>
                      </div>
                      
                      <!-- 查看详情按钮 -->
                      <el-button @click="viewClassDetails(classItem)" type="primary" size="small">
                        <el-icon class="w-4 h-4 mr-1">
                          <View />
                        </el-icon>
                        查看详情
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredClasses.length > 0" class="mt-8 flex justify-center">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredClasses.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 课程详情对话框 -->
    <el-dialog v-model="detailsDialogVisible" title="课程详情" width="600px">
      <div v-if="selectedClass" class="space-y-6">
        <!-- 课程基本信息 -->
        <div class="text-center">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedClass.name }}</h3>
          <p class="text-gray-600">{{ selectedClass.description }}</p>
        </div>
        
        <!-- 详细信息 -->
        <div class="bg-gray-50 rounded-lg p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">教练</label>
              <div class="text-lg text-gray-900">{{ selectedClass.instructor }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">课程类型</label>
              <div class="text-lg text-gray-900">{{ getClassType(selectedClass.name) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <div class="text-lg text-gray-900">{{ formatDate(selectedClass.date) }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">时间</label>
              <div class="text-lg text-gray-900">{{ selectedClass.start_time }} - {{ selectedClass.end_time }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">地点</label>
              <div class="text-lg text-gray-900">{{ selectedClass.location }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">时长</label>
              <div class="text-lg text-gray-900">{{ getDuration(selectedClass) }} 分钟</div>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <div class="flex justify-between items-center">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">参与人数</label>
                <div class="text-lg text-gray-900">{{ selectedClass.current_participants }}/{{ selectedClass.max_participants }} 人</div>
              </div>
              <div class="text-right">
                <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <el-tag :type="getClassStatusType(selectedClass)" size="large">
                  {{ getClassStatusText(selectedClass) }}
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
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
        <el-button @click="goToBooking" type="primary">
          <el-icon class="w-4 h-4 mr-1">
            <Calendar />
          </el-icon>
          立即预约
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { classService } from '@/services/classService'
import dayjs from 'dayjs'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const currentTime = ref('')
const selectedDate = ref('')
const selectedType = ref('')
const selectedInstructor = ref('')
const selectedTimeSlot = ref('')
const searchKeyword = ref('')
const classes = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const detailsDialogVisible = ref(false)
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
    const classData = await classService.getClasses()
    classes.value = classData
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    loading.value = false
  }
}

// 筛选后的课程
const filteredClasses = computed(() => {
  let filtered = classes.value

  // 按日期筛选
  if (selectedDate.value) {
    filtered = filtered.filter(cls => cls.date === selectedDate.value)
  }

  // 按类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(cls => cls.name.includes(selectedType.value))
  }

  // 按教练筛选
  if (selectedInstructor.value) {
    filtered = filtered.filter(cls => cls.instructor === selectedInstructor.value)
  }

  // 按时间段筛选
  if (selectedTimeSlot.value) {
    filtered = filtered.filter(cls => {
      const hour = parseInt(cls.start_time.split(':')[0])
      switch (selectedTimeSlot.value) {
        case 'morning':
          return hour >= 6 && hour < 12
        case 'afternoon':
          return hour >= 12 && hour < 18
        case 'evening':
          return hour >= 18 && hour < 24
        default:
          return true
      }
    })
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(cls => 
      cls.name.toLowerCase().includes(keyword) ||
      cls.description.toLowerCase().includes(keyword) ||
      cls.instructor.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 分页后的课程
const paginatedClasses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredClasses.value.slice(start, end)
})

// 统计数据
const totalClasses = computed(() => filteredClasses.value.length)
const availableClasses = computed(() => 
  filteredClasses.value.filter(cls => {
    const now = dayjs()
    const classDateTime = dayjs(`${cls.date} ${cls.start_time}`)
    return now.isBefore(classDateTime) && cls.current_participants < cls.max_participants
  }).length
)

const instructors = computed(() => {
  const instructorSet = new Set(filteredClasses.value.map(cls => cls.instructor))
  return Array.from(instructorSet)
})

const locations = computed(() => {
  const locationSet = new Set(filteredClasses.value.map(cls => cls.location))
  return Array.from(locationSet)
})

// 处理日期变化
const handleDateChange = () => {
  currentPage.value = 1
}

// 处理筛选变化
const handleFilterChange = () => {
  currentPage.value = 1
}

// 处理分页变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 查看课程详情
const viewClassDetails = (classItem) => {
  selectedClass.value = classItem
  detailsDialogVisible.value = true
}

// 跳转到预约页面
const goToBooking = () => {
  detailsDialogVisible.value = false
  router.push('/member/booking')
}

// 获取课程类型
const getClassType = (name) => {
  if (name.includes('瑜伽')) return '瑜伽'
  if (name.includes('力量')) return '力量训练'
  if (name.includes('单车') || name.includes('舞蹈') || name.includes('有氧')) return '有氧运动'
  if (name.includes('游泳')) return '游泳'
  if (name.includes('拳击') || name.includes('泰拳')) return '拳击'
  if (name.includes('普拉提')) return '普拉提'
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
    '拳击': 'danger',
    '普拉提': 'success',
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

// 获取课程状态类型
const getClassStatusType = (classItem) => {
  const now = dayjs()
  const classDateTime = dayjs(`${classItem.date} ${classItem.start_time}`)
  
  if (now.isAfter(classDateTime)) {
    return 'info' // 已结束
  }
  
  if (classItem.current_participants >= classItem.max_participants) {
    return 'warning' // 已满员
  }
  
  return 'success' // 可预约
}

// 获取课程状态文本
const getClassStatusText = (classItem) => {
  const now = dayjs()
  const classDateTime = dayjs(`${classItem.date} ${classItem.start_time}`)
  
  if (now.isAfter(classDateTime)) {
    return '已结束'
  }
  
  if (classItem.current_participants >= classItem.max_participants) {
    return '已满员'
  }
  
  return '可预约'
}

// 获取课程时长
const getDuration = (classItem) => {
  const start = dayjs(`${classItem.date} ${classItem.start_time}`)
  const end = dayjs(`${classItem.date} ${classItem.end_time}`)
  return end.diff(start, 'minute')
}

// 检查是否是今天
const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day')
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('MM月DD日 dddd')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
