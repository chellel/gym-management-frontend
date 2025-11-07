<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <PageHeader
      title="课程签到"
      subtitle="选择您已预约的课程进行签到，开始您的健身课程"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 签到状态卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 签到按钮卡片 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-8 text-center">
            <div class="mb-6">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
                <el-icon class="w-10 h-10 text-primary-600" size="40">
                  <Check />
                </el-icon>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">课程签到</h2>
              <p class="text-gray-600">选择已预约的课程进行签到</p>
            </div>

            <!-- 签到状态 -->
            <div v-if="isCheckedIn" class="mb-6">
              <div class="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <el-icon class="w-4 h-4 mr-2">
                  <SuccessFilled />
                </el-icon>
                今日已签到
              </div>
              <p class="text-gray-600 mt-2">签到时间：{{ todayCheckinTime }}</p>
            </div>

            <!-- 课程签到选择 -->
            <div v-else-if="todayBookings.length > 0" class="mb-6">
              <div class="mb-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">选择要签到的课程</h3>
                <div class="space-y-3">
                  <div
                    v-for="booking in todayBookings"
                    :key="booking.id"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    :class="{ 'ring-2 ring-primary-500 bg-primary-50': selectedBookingId === booking.id }"
                    @click="selectBooking(booking.id)"
                  >
                    <div class="flex-1">
                      <div class="font-medium text-gray-900">{{ booking.courseName }}</div>
                      <div class="text-sm text-gray-600">
                        <span class="mr-4">教练：{{ booking.coachName }}</span>
                        <span class="mr-4">时间：{{ booking.startTime }} - {{ booking.endTime }}</span>
                        <span>地点：{{ booking.location }}</span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <el-radio :value="selectedBookingId" :label="booking.id" />
                    </div>
                  </div>
                </div>
              </div>
              
              <el-button
                @click="handleCheckIn"
                :loading="checkinLoading"
                :disabled="!selectedBookingId"
                type="primary"
                size="large"
                class="px-8 py-3 text-lg font-semibold"
              >
                <el-icon class="w-6 h-6 mr-2">
                  <Check />
                </el-icon>
                课程签到
              </el-button>
            </div>

            <!-- 无预约课程 -->
            <div v-else class="mb-6">
              <div class="text-center py-8">
                <el-icon class="w-12 h-12 text-gray-300 mb-4">
                  <Calendar />
                </el-icon>
                <p class="text-gray-500 mb-2">今日暂无预约课程</p>
                <p class="text-sm text-gray-400">请先预约课程后再进行签到</p>
              </div>
            </div>

            <!-- 签到提示 -->
            <div class="text-sm text-gray-500">
              <p>• 只能对已预约的课程进行签到</p>
              <p>• 每节课程只能签到一次</p>
              <p>• 签到后可参与课程活动</p>
            </div>
          </div>
        </div>

        <!-- 签到统计卡片 -->
        <div class="space-y-6">
          <!-- 连续签到 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">连续签到</h3>
              <el-icon class="w-6 h-6 text-orange-500">
                <Trophy />
              </el-icon>
            </div>
            <div class="text-3xl font-bold text-orange-600 mb-2">
              {{ checkinStats.consecutiveDays }}
            </div>
            <div class="text-sm text-gray-600">天</div>
          </div>

          <!-- 本周签到 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">本周签到</h3>
              <el-icon class="w-6 h-6 text-blue-500">
                <Calendar />
              </el-icon>
            </div>
            <div class="text-3xl font-bold text-blue-600 mb-2">
              {{ checkinStats.thisWeekCheckins }}
            </div>
            <div class="text-sm text-gray-600">次</div>
          </div>

          <!-- 总签到次数 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">总签到次数</h3>
              <el-icon class="w-6 h-6 text-green-500">
                <DataAnalysis />
              </el-icon>
            </div>
            <div class="text-3xl font-bold text-green-600 mb-2">
              {{ checkinStats.totalCheckins }}
            </div>
            <div class="text-sm text-gray-600">次</div>
          </div>
        </div>
      </div>

      <!-- 最近签到记录 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">最近课程签到记录</h3>
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
          <p class="text-gray-500">暂无课程签到记录</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="checkin in recentCheckins"
            :key="checkin.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                <el-icon class="w-5 h-5 text-primary-600">
                  <Check />
                </el-icon>
              </div>
              <div>
                <div class="font-medium text-gray-900">
                  {{ checkin.courseName }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatDate(checkin.date) }} {{ checkin.checkin_time }}
                </div>
                <div class="text-xs text-gray-400">
                  教练：{{ checkin.coachName }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-green-600">已签到</div>
              <div class="text-xs text-gray-400">
                {{ formatRelativeTime(checkin.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { checkinService } from '@/services/checkinService'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import PageHeader from '@/components/common/PageHeader.vue'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { getCurrentUser } = useAuth()

// 响应式数据
const isCheckedIn = ref(false)
const todayCheckinTime = ref('')
const checkinLoading = ref(false)
const loading = ref(false)
const recentCheckins = ref([])
const todayBookings = ref([])
const selectedBookingId = ref(null)
const checkinStats = ref({
  totalCheckins: 0,
  thisWeekCheckins: 0,
  consecutiveDays: 0,
  lastCheckin: null
})

// 初始化
onMounted(async () => {
  await loadCheckinData()
});

// 加载签到数据
const loadCheckinData = async () => {
  loading.value = true
  try {
    const user = getCurrentUser()
    if (!user) return

    // 检查今日签到状态
    const checkedInToday = await checkinService.isCheckedInToday(user.id)
    isCheckedIn.value = checkedInToday

    // 获取签到统计
    const stats = await checkinService.getCheckinStats(user.id)
    checkinStats.value = stats

    // 获取最近签到记录
    const checkins = await checkinService.getMemberCheckins(user.id, 7)
    recentCheckins.value = checkins

    // 获取今天可签到的课程
    const bookings = await checkinService.getTodayBookings(user.id)
    todayBookings.value = bookings

    // 如果有今日签到，显示签到时间
    if (checkedInToday && checkins.length > 0) {
      const todayCheckin = checkins.find(checkin => 
        checkin.date === dayjs().format('YYYY-MM-DD')
      )
      if (todayCheckin) {
        todayCheckinTime.value = todayCheckin.checkin_time
      }
    }
  } catch (error) {
    console.error('Error loading checkin data:', error)
    ElMessage.error('加载签到数据失败')
  } finally {
    loading.value = false
  }
}

// 处理签到
const handleCheckIn = async () => {
  checkinLoading.value = true
  try {
    const user = getCurrentUser()
    if (!user) {
      ElMessage.error('请先登录')
      return
    }

    if (!selectedBookingId.value) {
      ElMessage.warning('请选择要签到的课程')
      return
    }

    const result = await checkinService.checkIn(user.id, selectedBookingId.value)
    
    if (result.success) {
      ElMessage.success(result.message)
      isCheckedIn.value = true
      todayCheckinTime.value = result.checkin.checkinTime
      
      // 刷新数据
      await loadCheckinData()
    } else {
      ElMessage.warning(result.message)
    }
  } catch (error) {
    console.error('Error checking in:', error)
    ElMessage.error('签到失败，请重试')
  } finally {
    checkinLoading.value = false
  }
}

// 选择预约课程
const selectBooking = (bookingId) => {
  selectedBookingId.value = bookingId
}

// 刷新签到记录
const refreshCheckins = async () => {
  await loadCheckinData()
}

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('MM月DD日 dddd')
}

// 格式化相对时间
const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow()
}
</script>

<style scoped>
/* 自定义样式 */
</style>
