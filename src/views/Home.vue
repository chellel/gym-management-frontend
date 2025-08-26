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
          <div class="flex items-center">
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
          专业的
          <span class="text-primary-600">健身房管理</span>
          系统
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          现代化的健身房管理解决方案，帮助您高效管理会员、课程、教练和设备，提升运营效率。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/login" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200">
            立即开始
            <svg class="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
          <button class="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
            了解更多
          </button>
        </div>
      </div>

      <!-- 功能特性 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">会员管理</h3>
          <p class="text-gray-600">完整的会员信息管理，包括注册、续费、课程预约等功能。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">课程安排</h3>
          <p class="text-gray-600">灵活的课程安排系统，支持团体课、私教课等多种课程类型。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">数据分析</h3>
          <p class="text-gray-600">详细的数据统计和分析，帮助您了解业务状况和发展趋势。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">财务管理</h3>
          <p class="text-gray-600">完整的财务管理功能，包括收费、退费、财务报表等。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">设备管理</h3>
          <p class="text-gray-600">健身设备的维护记录、使用统计和故障报修管理。</p>
        </div>

        <div class="card hover:shadow-lg transition-shadow duration-200">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">教练管理</h3>
          <p class="text-gray-600">教练信息管理、排班安排和业绩统计功能。</p>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">1000+</div>
            <div class="text-gray-600">活跃会员</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div class="text-gray-600">专业教练</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">24/7</div>
            <div class="text-gray-600">营业时间</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
            <div class="text-gray-600">系统稳定性</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-4">健身房管理系统</h3>
          <p class="text-gray-400">© 2024 健身房管理系统. 保留所有权利.</p>
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
