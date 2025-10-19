<template>
    <div class="min-h-screen bg-gray-50">
      <!-- 顶部导航栏 -->
      <nav 
        class="bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm"
        :class="{ 
          'shadow-xl bg-white/95': isScrolled,
          'shadow-lg': !isScrolled
        }"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <!-- 左侧Logo和导航 -->
            <div class="flex items-center">
              <div class="flex-shrink-0 flex items-center">
                <el-icon class="h-8 w-8 text-primary-600" size="32">
                  <Lightning />
                </el-icon>
                <h1 class="ml-2 text-xl font-bold text-gray-900">GymSys</h1>
              </div>
              
              <!-- 桌面端导航菜单 -->
              <div class="hidden md:ml-10 md:flex md:space-x-8">
                <router-link
                  v-for="item in navigation"
                  :key="item.name"
                  :to="item.href"
                  class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
                  :class="{
                    'border-primary-500 text-primary-600': $route.path === item.href
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
              <!-- 通知按钮 -->
              <!-- <el-button
                type="text"
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <el-icon class="h-6 w-6">
                  <Bell />
                </el-icon>
              </el-button>
   -->
              <!-- 用户信息 -->
              <div class="relative">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <span class="text-sm font-medium text-white">
                        {{ user?.name?.charAt(0) || 'A' }}
                      </span>
                    </div>
                  </div>
                  <div class="hidden md:block">
                    <div class="text-sm font-medium text-gray-900">{{ user?.name || '管理员' }}</div>
                    <div class="text-xs text-gray-500">{{ user?.email || 'admin' }}</div>
                  </div>
                </div>
              </div>
  
              <!-- 退出按钮 -->
              <el-button
                @click="handleLogout"
                type="danger"
                class="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md transition-colors duration-200"
              >
                <el-icon class="w-4 h-4 mr-1">
                  <SwitchButton />
                </el-icon>
                退出
              </el-button>
  
              <!-- 移动端菜单按钮 -->
              <div class="md:hidden">
                <el-button
                  @click="mobileMenuOpen = !mobileMenuOpen"
                  type="text"
                  class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
          <div class="pt-2 pb-3 space-y-1 bg-gray-50 border-t border-gray-200 shadow-lg">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              @click="mobileMenuOpen = false"
              class="border-transparent text-gray-600 hover:bg-gray-100 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
              :class="{
                'bg-primary-50 border-primary-500 text-primary-700': $route.path === item.href
              }"
                        >
              <div class="flex items-center">
                <el-icon class="w-5 h-5 mr-3">
                  <component :is="item.icon" />
                </el-icon>
                {{ item.name }}
              </div>
            </router-link>
          </div>
        </div>
      </nav>
  
      <!-- 主要内容区域 -->
      <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <router-view />
      </main>
  
      <!-- 页脚 -->
      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">
              © 2024 GymSys 健身房管理系统. 保留所有权利.
            </div>
            <div class="text-sm text-gray-500">
              版本 v1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserinfoStore } from '@/stores/userinfo'
  
const router = useRouter()
const userinfoStore = useUserinfoStore()

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

// 滚动监听 - 添加节流优化
let scrollTimer = null
const handleScroll = () => {
  if (scrollTimer) return
  
  scrollTimer = setTimeout(() => {
    isScrolled.value = window.scrollY > 10
    scrollTimer = null
  }, 10)
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 获取用户信息
const user = computed(() => userinfoStore.userinfo)

// 登出方法
const logout = async () => {
  userinfoStore.clearUserinfo()
  await router.push('/admin/login')
}

// 导航菜单 - 根据角色显示不同菜单
const navigation = computed(() => {
  const baseMenu = [
    { name: '首页', href: '/admin', icon: 'House' },
    { name: '会员管理', href: '/admin/member', icon: 'User' },
    { name: '教练管理', href: '/admin/coach', icon: 'User' },
    { name: '排班管理', href: '/admin/schedules', icon: 'Clock' },
    // { name: '财务管理', href: '/admin/finance', icon: 'Money' },
    { name: '数据看板', href: '/admin/reports', icon: 'DataAnalysis' }
  ]
  
  return baseMenu
})
  
  // 退出登录
  const handleLogout = async () => {
    await logout()
  }
  </script>
  