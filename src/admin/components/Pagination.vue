<template>
  <div v-if="total > 0" class="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-lg shadow">
    <!-- 显示总记录数 -->
    <div class="text-sm text-gray-700">
      共 <span class="font-medium">{{ total }}</span> 条记录
    </div>
    
    <!-- Element Plus 分页组件 -->
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50, 100]"
      layout="prev, pager, next, sizes"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
const props = withDefaults(defineProps<{
  total: number
  currentPage?: number
  pageSize?: number
}>(), {
  currentPage: 1,
  pageSize: 20
})

// Emits
const emit = defineEmits<{
  'page-change': [page: number]
  'size-change': [size: number]
  'update:current-page': [page: number]
  'update:page-size': [size: number]
}>()

// 响应式数据
const currentPage = ref(props.currentPage)
const pageSize = ref(props.pageSize)

// 监听props变化
watch(() => props.currentPage, (newVal) => {
  currentPage.value = newVal
})

watch(() => props.pageSize, (newVal) => {
  pageSize.value = newVal
})

// 处理分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
  emit('update:current-page', page)
}

// 处理每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
  emit('size-change', size)
  emit('update:page-size', size)
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>
