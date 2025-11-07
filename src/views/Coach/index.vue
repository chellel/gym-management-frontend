<template>
  <div class="space-y-6">
    <!-- 页面标题和欢迎信息 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">教练工作台</h1>
          <p class="mt-2 text-blue-100">欢迎回来，{{ userinfo.name }}！今天是 {{ currentDate }}</p>
          <p class="text-sm text-blue-200">{{ coachInfo.specialty }}</p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold">{{ todayClasses.length }}</div>
          <div class="text-sm text-blue-200">今日课程</div>
        </div>
      </div>
    </div>

    <!-- 功能导航卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="feature in features" 
        :key="feature.key"
        @click="activeTab = feature.key"
        class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4"
        :class="{
          'border-blue-500 bg-blue-50': activeTab === feature.key,
          'border-gray-200': activeTab !== feature.key
        }"
      >
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <el-icon class="h-8 w-8 text-gray-600" :class="{ 'text-blue-600': activeTab === feature.key }">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-medium text-gray-900">{{ feature.name }}</h3>
            <p class="text-sm text-gray-500">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="bg-white rounded-lg shadow-md">
      <!-- 我的课表 -->
      <MySchedule v-if="activeTab === 'schedule'" />

      <!-- 课程管理 -->
      <ClassManagement v-if="activeTab === 'management'" />



      <!-- 排班管理 -->
      <div v-if="activeTab === 'schedule-management'" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">排班管理</h2>
        </div>
        <Schedule />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCoachService } from '@/composables/useCoachService'
import { getScheduleList } from '@/api/schedule'
import Swal from 'sweetalert2'
import Schedule from '@/components/schedule/index.vue'
import dayjs from 'dayjs'
// 导入子组件
import MySchedule from '@/components/coach/MySchedule.vue'
import ClassManagement from '@/components/coach/ClassManagement.vue'

const { user, currentUser } = useAuth()
const {
  coachInfo,
  coachClasses,
  getCoachClasses
} = useCoachService()

import { useUserinfoStore } from "@/stores/userinfo";
const userinfoStore = useUserinfoStore()
const userinfo = computed(() => userinfoStore.userinfo)

// 响应式数据
const activeTab = ref('schedule')
const todaySchedules = ref([])

// 功能导航
const features = [
  {
    key: 'schedule',
    name: '我的课表',
    description: '查看个人课程安排',
    icon: 'Calendar'
  },
  {
    key: 'management',
    name: '课程管理',
    description: '管理课程和学员',
    icon: 'UserFilled'
  },
  {
    key: 'schedule-management',
    name: '排班管理',
    description: '管理个人排班安排',
    icon: 'DataAnalysis'
  }
]

// 计算属性
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const todayClasses = computed(() => {
  return todaySchedules.value
})

// 初始化
onMounted(async () => {
  await initializeData()
})

// 获取今日课程
const loadTodayClasses = async () => {
  if (!userinfo.value?.id) {
    return
  }

  try {
    const todayStr = dayjs(new Date()).format('YYYY-MM-DD')
    
    const response = await getScheduleList({
      coachId: userinfo.value.id,
      startDate: todayStr,
      endDate: todayStr,
      page: 1,
      pageSize: 100,
      isDeleted: 0
    })
    
    todaySchedules.value = response.rows || []
  } catch (error) {
    console.error('获取今日课程失败:', error)
    todaySchedules.value = []
  }
}

// 初始化数据
const initializeData = async () => {
  try {
    await Promise.all([
      getCoachClasses(userinfo.value.id),
      loadTodayClasses()
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
    Swal.fire({
      title: '错误',
      text: '初始化数据失败，请刷新页面重试',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
