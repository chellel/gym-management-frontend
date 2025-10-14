<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- 导航栏 -->
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
            <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
              注册会员
            </router-link>
            <router-link to="/login" class="btn-primary">
              登录系统
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- 英雄区域 -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          会员专属
          <span class="text-primary-600">健身服务</span>
          平台
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          为会员提供便捷的健身服务，包括课程预约、签到打卡、个人中心等功能，让您的健身之旅更加轻松。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/register" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200">
            注册会员
            <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
          <router-link to="/login" class="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            会员登录
            <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">课程预约</h3>
          <p class="text-gray-600">轻松预约各类健身课程，包括团体课、私教课等，合理安排您的健身时间。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">签到打卡</h3>
          <p class="text-gray-600">快速签到打卡，记录您的健身历程，让每一次锻炼都有迹可循。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">个人中心</h3>
          <p class="text-gray-600">查看个人信息、健身记录、课程历史等，全面了解您的健身状态。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">健身中心</h3>
          <p class="text-gray-600">浏览健身中心信息、设备状态、开放时间等，让您更好地规划健身计划。</p>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div class="text-gray-600">专业教练</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">100+</div>
            <div class="text-gray-600">精品课程</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">24/7</div>
            <div class="text-gray-600">营业时间</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">100%</div>
            <div class="text-gray-600">会员满意度</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-4">会员健身服务平台</h3>
          <p class="text-gray-400">© 2024 会员健身服务平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
