<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- 左侧Logo和导航 -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <el-icon class="h-6 w-6 text-white" size="24">
                  <Lightning />
                </el-icon>
              </div>
              <h1 class="ml-3 text-xl font-bold text-gray-900">健身俱乐部</h1>
            </div>
            
            <!-- 桌面端导航菜单 -->
            <div class="hidden md:ml-10 md:flex md:space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="border-transparent text-gray-600 hover:border-blue-300 hover:text-blue-700 inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors duration-200 rounded-t-lg"
                :class="{
                  'border-blue-500 text-blue-600 bg-blue-50': $route.path === item.href
                }"
              >
                <el-icon class="w-4 h-4 mr-2">
                  <component :is="item.icon" />
                </el-icon>
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- 右侧用户信息和操作 -->
          <div class="flex items-center space-x-4">
            <!-- 签到状态指示器 -->
            <div v-if="checkinStatus" class="hidden md:flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <el-icon class="w-4 h-4 mr-1">
                <Check />
              </el-icon>
              今日已签到
            </div>

            <!-- 通知按钮 -->
            <el-button
              type="text"
              class="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <el-icon class="h-5 w-5">
                <Bell />
              </el-icon>
            </el-button>

            <!-- 用户信息下拉菜单 -->
            <el-dropdown @command="handleUserCommand" trigger="click">
              <div class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span class="text-sm font-medium text-white">
                      {{ user?.name?.charAt(0) || 'M' }}
                    </span>
                  </div>
                </div>
                <div class="hidden md:block">
                  <div class="text-sm font-medium text-gray-900">{{ user?.name || '会员' }}</div>
                  <div class="text-xs text-gray-500">{{ user?.email || 'member@gym.com' }}</div>
                </div>
                <el-icon class="w-4 h-4 text-gray-400">
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon class="w-4 h-4 mr-2">
                      <User />
                    </el-icon>
                    个人资料
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon class="w-4 h-4 mr-2">
                      <SwitchButton />
                    </el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- 移动端菜单按钮 -->
            <div class="md:hidden">
              <el-button
                @click="mobileMenuOpen = !mobileMenuOpen"
                type="text"
                class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span class="sr-only">打开主菜单</span>
                <el-icon v-if="!mobileMenuOpen" class="block h-6 w-6">
                  <Operation />
                </el-icon>
                <el-icon v-else class="block h-6 w-6">
                  <Close />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-show="mobileMenuOpen" class="md:hidden">
        <div class="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200 shadow-lg">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            @click="mobileMenuOpen = false"
            class="border-transparent text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 block pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-colors duration-200"
            :class="{
              'bg-blue-50 border-blue-500 text-blue-700': $route.path === item.href
            }"
          >
            <div class="flex items-center">
              <el-icon class="w-5 h-5 mr-3">
                <component :is="item.icon" />
              </el-icon>
              {{ item.name }}
            </div>
          </router-link>
          
          <!-- 移动端签到状态 -->
          <div v-if="checkinStatus" class="px-4 py-2 bg-green-50 border-l-4 border-green-500">
            <div class="flex items-center text-green-800 text-sm">
              <el-icon class="w-4 h-4 mr-2">
                <Check />
              </el-icon>
              今日已签到
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- 公司信息 -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <el-icon class="h-5 w-5 text-white">
                  <Lightning />
                </el-icon>
              </div>
              <h3 class="text-lg font-bold text-gray-900">健身俱乐部</h3>
            </div>
            <p class="text-gray-600 text-sm mb-4">
              专业的健身管理平台，为您提供全方位的健身服务体验。
            </p>
            <div class="text-sm text-gray-500">
              © 2025 健身俱乐部管理系统. 保留所有权利.
            </div>
          </div>

          <!-- 快速链接 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">快速链接</h4>
            <ul class="space-y-2">
              <li>
                <router-link to="/member/checkin" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  每日签到
                </router-link>
              </li>
              <li>
                <router-link to="/member/booking" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  课程预约
                </router-link>
              </li>
              <li>
                <router-link to="/member/courses" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  课程查询
                </router-link>
              </li>
              <li>
                <router-link to="/member/center" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  会员中心
                </router-link>
              </li>
            </ul>
          </div>

          <!-- 联系信息 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">联系我们</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li class="flex items-center">
                <el-icon class="w-4 h-4 mr-2 text-gray-400">
                  <Phone />
                </el-icon>
              888-888-8888
              </li>
              <li class="flex items-center">
                <el-icon class="w-4 h-4 mr-2 text-gray-400">
                  <Message />
                </el-icon>
                support@gym.com
              </li>
              <li class="flex items-center">
                <el-icon class="w-4 h-4 mr-2 text-gray-400">
                  <Location />
                </el-icon>
                营业时间：6:00-22:00
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { checkinService } from '@/services/checkinService'

const router = useRouter()
const { user, logout, getCurrentUser, isCoach } = useAuth()

const mobileMenuOpen = ref(false)
const checkinStatus = ref(false)

// 导航菜单 - 会员专用菜单
const navigation = computed(() => {
  if(isCoach()) {
    return [
      { name: '教练工作台', href: '/coach/workbench', icon: 'UserFilled' },
      { name: '我的课表', href: '/coach/schedule', icon: 'Calendar' },
      { name: '课堂管理', href: '/coach/classes', icon: 'UserFilled' },
      { name: '学员管理', href: '/coach/members', icon: 'User' },
      { name: '可用时间', href: '/coach/availability', icon: 'Clock' },
      { name: '全局课表', href: '/coach/global', icon: 'DataAnalysis' }
    ]
  }
  return [
    { name: '会员中心', href: '/member/center', icon: 'User' },
    { name: '签到', href: '/member/checkin', icon: 'Check' },
    { name: '课程预约', href: '/member/booking', icon: 'Calendar' },
    { name: '课程查询', href: '/member/courses', icon: 'Search' }
  ]
})

// 检查签到状态
const checkCheckinStatus = async () => {
  try {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const isCheckedIn = await checkinService.isCheckedInToday(currentUser.id)
      checkinStatus.value = isCheckedIn
    }
  } catch (error) {
    console.error('Error checking checkin status:', error)
  }
}

// 处理用户下拉菜单命令
const handleUserCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/member/center')
      break
    case 'settings':
      // 可以跳转到设置页面
      console.log('跳转到设置页面')
      break
    case 'logout':
      await logout()
      break
  }
}

// 退出登录
const handleLogout = async () => {
  await logout()
}

// 初始化
onMounted(() => {
  checkCheckinStatus()
})
</script>

<style scoped>
/* 自定义样式 */
.router-link-active {
  @apply border-blue-500 text-blue-600 bg-blue-50;
}

/* 渐变背景动画 */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
