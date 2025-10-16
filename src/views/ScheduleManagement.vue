<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">排班管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理教练排班和场地预约安排。</p>
      </div>
    </div>

    <Schedule />
  </div>
</template>

<script setup>
import Schedule from "@/components/schedule/index.vue";
</script>
