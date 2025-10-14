<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <h1 class="ml-2 text-xl font-bold text-gray-900">健身房管理系统</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">欢迎，{{ user?.name || '管理员' }}</span>
            <button
              @click="handleLogout"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 欢迎区域 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <svg class="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-10h8m-6 0h8M9 6h8" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-4">
            欢迎使用健身房管理系统！
          </h1>
          <p class="text-xl text-gray-600 mb-6">
            您已成功登录系统，现在可以开始管理您的健身房业务。
          </p>
          <div class="text-sm text-gray-500">
            登录时间：{{ formatTime(new Date()) }}
          </div>
        </div>
      </div>

      <!-- 快速操作面板 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('members')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">会员管理</h3>
              <p class="text-gray-600 text-sm">管理会员信息</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('classes')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">课程管理</h3>
              <p class="text-gray-600 text-sm">安排和管理课程</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('trainers')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">教练管理</h3>
              <p class="text-gray-600 text-sm">管理教练信息</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer" @click="navigateTo('reports')">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">数据报表</h3>
              <p class="text-gray-600 text-sm">查看业务数据</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日概览 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 今日统计 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">今日统计</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">新增会员</span>
              <span class="text-2xl font-bold text-green-600">12</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">课程签到</span>
              <span class="text-2xl font-bold text-blue-600">89</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">营业收入</span>
              <span class="text-2xl font-bold text-primary-600">¥15,680</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">在馆人数</span>
              <span class="text-2xl font-bold text-purple-600">156</span>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">张三购买了年度会员套餐</span>
              <span class="text-gray-400 text-xs">5分钟前</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">瑜伽课程已开始，20人参与</span>
              <span class="text-gray-400 text-xs">15分钟前</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">李教练更新了今日课程安排</span>
              <span class="text-gray-400 text-xs">30分钟前</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span class="text-gray-600 text-sm">会员王五完成了私教课程</span>
              <span class="text-gray-400 text-xs">1小时前</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  name: 'Welcome',
  setup() {
    const router = useRouter()
    const { user, logout } = useAuth()

    const handleLogout = async () => {
      await logout()
    }

    const navigateTo = (section) => {
      const routes = {
        members: '/admin/members',
        classes: '/admin/classes',
        trainers: '/admin/schedules',
        reports: '/admin/reports'
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

    return {
      user,
      handleLogout,
      navigateTo,
      formatTime
    }
  }
}
</script>
