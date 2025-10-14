<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">会员中心</h1>
            <p class="text-gray-600 mt-1">管理您的个人信息和健身记录</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">会员ID</div>
            <div class="text-lg font-semibold text-gray-900">{{ memberInfo.member_id || 'M001' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 会员信息卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 个人信息 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">个人信息</h2>
              <el-button @click="editProfile" type="primary" size="small">
                <el-icon class="w-4 h-4 mr-1">
                  <Edit />
                </el-icon>
                编辑
              </el-button>
            </div>

            <div v-if="loading" class="text-center py-8">
              <el-icon class="w-8 h-8 text-gray-400 animate-spin">
                <Loading />
              </el-icon>
              <p class="text-gray-500 mt-2">加载中...</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.name || '张三' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.phone || '138****8001' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.email || 'zhangsan@example.com' }}</div>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">会员类型</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.membership_type || '年度会员' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">入会日期</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.join_date || '2024-01-15' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">到期日期</label>
                  <div class="text-lg text-gray-900">{{ memberInfo.expire_date || '2024-12-15' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 会员状态 -->
        <div class="space-y-6">
          <!-- 会员状态卡片 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">会员状态</h3>
              <el-icon class="w-6 h-6 text-green-500">
                <CircleCheck />
              </el-icon>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600 mb-2">有效</div>
              <div class="text-sm text-gray-600">剩余 {{ remainingDays }} 天</div>
            </div>
          </div>

          <!-- 健身统计 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">本月健身</h3>
              <el-icon class="w-6 h-6 text-blue-500">
                <DataAnalysis />
              </el-icon>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">签到次数</span>
                <span class="font-semibold">{{ monthlyStats.checkins }} 次</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">课程参与</span>
                <span class="font-semibold">{{ monthlyStats.classes }} 次</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">健身时长</span>
                <span class="font-semibold">{{ monthlyStats.hours }} 小时</span>
              </div>
            </div>
          </div>

          <!-- 积分余额 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">积分余额</h3>
              <el-icon class="w-6 h-6 text-yellow-500">
                <Star />
              </el-icon>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-600 mb-2">{{ memberInfo.points || 1250 }}</div>
              <div class="text-sm text-gray-600">积分</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能导航 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          @click="$router.push('/member/checkin')"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-blue-600">
                <Check />
              </el-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">签到</h3>
              <p class="text-sm text-gray-600">每日签到</p>
            </div>
          </div>
        </div>

        <div 
          @click="$router.push('/member/booking')"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-green-600">
                <Calendar />
              </el-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">课程预约</h3>
              <p class="text-sm text-gray-600">预约课程</p>
            </div>
          </div>
        </div>

        <div 
          @click="$router.push('/member/courses')"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-purple-600">
                <Search />
              </el-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">课程查询</h3>
              <p class="text-sm text-gray-600">查看课程</p>
            </div>
          </div>
        </div>

        <div 
          @click="viewBookingHistory"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <el-icon class="w-6 h-6 text-orange-600">
                <Document />
              </el-icon>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">预约记录</h3>
              <p class="text-sm text-gray-600">查看历史</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 最近签到记录 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">最近签到</h3>
            <el-button @click="refreshCheckins" :loading="loading" type="text">
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

          <div v-else-if="recentCheckins.length === 0" class="text-center py-8">
            <el-icon class="w-12 h-12 text-gray-300 mb-4">
              <Calendar />
            </el-icon>
            <p class="text-gray-500">暂无签到记录</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="checkin in recentCheckins.slice(0, 5)"
              :key="checkin.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <el-icon class="w-4 h-4 text-green-600">
                    <Check />
                  </el-icon>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ formatDate(checkin.date) }}</div>
                  <div class="text-sm text-gray-500">{{ checkin.checkin_time }}</div>
                </div>
              </div>
              <div class="text-sm text-green-600 font-medium">已签到</div>
            </div>
          </div>
        </div>

        <!-- 最近预约记录 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">最近预约</h3>
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

          <div v-else-if="recentBookings.length === 0" class="text-center py-8">
            <el-icon class="w-12 h-12 text-gray-300 mb-4">
              <Calendar />
            </el-icon>
            <p class="text-gray-500">暂无预约记录</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="booking in recentBookings.slice(0, 5)"
              :key="booking.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <el-icon class="w-4 h-4 text-blue-600">
                    <Calendar />
                  </el-icon>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ booking.classes?.name || '课程' }}</div>
                  <div class="text-sm text-gray-500">{{ formatDate(booking.classes?.date) }} {{ booking.classes?.start_time }}</div>
                </div>
              </div>
              <div class="text-sm text-blue-600 font-medium">{{ booking.status === 'confirmed' ? '已确认' : '待确认' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑个人信息对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑个人信息" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button @click="saveProfile" type="primary">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { checkinService } from '@/services/checkinService'
import { classService } from '@/services/classService'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const { getCurrentUser } = useAuth()

// 响应式数据
const loading = ref(false)
const editDialogVisible = ref(false)
const memberInfo = ref({
  name: '张三',
  phone: '138****8001',
  email: 'zhangsan@example.com',
  member_id: 'M001',
  membership_type: '年度会员',
  join_date: '2024-01-15',
  expire_date: '2024-12-15',
  points: 1250
})

const editForm = ref({
  name: '',
  phone: '',
  email: ''
})

const recentCheckins = ref([])
const recentBookings = ref([])
const monthlyStats = ref({
  checkins: 15,
  classes: 8,
  hours: 24
})

// 计算属性
const remainingDays = computed(() => {
  const expireDate = dayjs(memberInfo.value.expire_date)
  const today = dayjs()
  const diff = expireDate.diff(today, 'day')
  return diff > 0 ? diff : 0
})

// 初始化
onMounted(async () => {
  await loadMemberData()
})

// 加载会员数据
const loadMemberData = async () => {
  loading.value = true
  try {
    const user = getCurrentUser()
    if (!user) return

    // 加载签到记录
    const checkins = await checkinService.getMemberCheckins(user.id, 7)
    recentCheckins.value = checkins

    // 加载预约记录
    const bookings = await classService.getMemberBookings(user.id)
    recentBookings.value = bookings

    // 这里可以添加更多数据加载逻辑
  } catch (error) {
    console.error('Error loading member data:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 编辑个人信息
const editProfile = () => {
  editForm.value = {
    name: memberInfo.value.name,
    phone: memberInfo.value.phone,
    email: memberInfo.value.email
  }
  editDialogVisible.value = true
}

// 保存个人信息
const saveProfile = async () => {
  try {
    // 这里应该调用API保存数据
    memberInfo.value = {
      ...memberInfo.value,
      ...editForm.value
    }
    
    editDialogVisible.value = false
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('Error saving profile:', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 查看预约记录
const viewBookingHistory = () => {
  router.push('/member/booking')
}

// 刷新签到记录
const refreshCheckins = async () => {
  const user = getCurrentUser()
  if (user) {
    const checkins = await checkinService.getMemberCheckins(user.id, 7)
    recentCheckins.value = checkins
  }
}

// 刷新预约记录
const refreshBookings = async () => {
  const user = getCurrentUser()
  if (user) {
    const bookings = await classService.getMemberBookings(user.id)
    recentBookings.value = bookings
  }
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('MM月DD日')
}
</script>

<style scoped>
/* 自定义样式 */
</style>
