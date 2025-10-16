<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 欢迎区域 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            欢迎回来，{{ user?.name || '会员' }}！
          </h1>
          <p class="text-xl text-gray-600 mb-6">
            开始您的健康之旅，让我们一起打造更好的自己。
          </p>
          <div class="text-sm text-gray-500">
            登录时间：{{ formatTime(new Date()) }}
          </div>
        </div>
      </div>

      <!-- 快速操作面板 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('checkin')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">签到打卡</h3>
              <p class="text-gray-600 text-sm">记录您的健身时光</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('booking')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">课程预约</h3>
              <p class="text-gray-600 text-sm">预约您喜欢的课程</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('courses')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">课程中心</h3>
              <p class="text-gray-600 text-sm">浏览所有可用课程</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('profile')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">个人中心</h3>
              <p class="text-gray-600 text-sm">管理您的个人信息</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日概览 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 今日统计 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">今日健身数据</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">今日签到次数</span>
              <span class="text-2xl font-bold text-green-600">{{ todayCheckins }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">已预约课程</span>
              <span class="text-2xl font-bold text-blue-600">{{ bookedClasses }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">本月健身天数</span>
              <span class="text-2xl font-bold text-purple-600">{{ monthlyWorkoutDays }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">连续签到天数</span>
              <span class="text-2xl font-bold text-yellow-600">{{ consecutiveDays }}</span>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">您已成功签到健身房</span>
              <span class="text-gray-400 text-xs">刚刚</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">预约了明天的瑜伽课程</span>
              <span class="text-gray-400 text-xs">2小时前</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">完成了力量训练课程</span>
              <span class="text-gray-400 text-xs">昨天</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">更新了个人健身目标</span>
              <span class="text-gray-400 text-xs">3天前</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 健身小贴士 -->
      <div class="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 class="text-lg font-semibold">今日健身小贴士</h3>
        </div>
        <p class="text-blue-100">
          坚持每天运动30分钟，不仅能增强体质，还能提高工作效率。记住，健身是一个长期的过程，保持耐心和坚持是最重要的！
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user } = useAuth()

// 模拟数据
const todayCheckins = ref(1)
const bookedClasses = ref(3)
const monthlyWorkoutDays = ref(15)
const consecutiveDays = ref(7)

const navigateTo = (section) => {
  const routes = {
    checkin: '/member/checkin',
    booking: '/member/booking',
    courses: '/member/courses',
    profile: '/member'
  }
  
  const route = routes[section]
  if (route) {
    router.push(route)
  }
}

const formatTime = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化数据
onMounted(() => {
  // 这里可以加载用户的真实数据
  console.log('Member welcome page loaded for user:', user.value)
})
</script>
