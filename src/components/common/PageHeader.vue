<template>
  <div class="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {{ title }}
            </h1>
            <p class="text-gray-600 mt-1 text-sm">
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div v-if="showTime" class="text-right bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
          <div class="text-sm text-gray-500 font-medium">当前时间</div>
          <div class="text-lg font-bold text-gray-900 font-mono">
            {{ currentTime }}
          </div>
        </div>
        <div v-if="$slots.actions" class="flex items-center space-x-3">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showTime: {
    type: Boolean,
    default: true
  }
})

// 响应式数据
const currentTime = ref('')

// 定时器
let timeInterval = null

// 生命周期
onMounted(() => {
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
</script>

<style scoped>
/* 组件样式 */
</style>
