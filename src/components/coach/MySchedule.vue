<template>
  <div class="p-6">
    <!-- 使用排班日历组件 -->
    <ScheduleCalendar
      :schedules="coachClasses"
      title="我的课表"
      :show-view-toggle="true"
      :show-refresh="true"
      default-view-mode="week"
      @schedule-click="viewClassDetails"
      @refresh="refreshSchedule"
    />

    <!-- 课程详情模态框 -->
    <el-dialog
      v-model="showClassDetailsModal"
      title="课程详情"
      width="600px"
    >
      <div v-if="selectedClass" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">课程名称</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.activity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">地点</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.location }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">日期</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.date }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">时间</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.start_time }} - {{ selectedClass.end_time }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">容量</label>
            <p class="text-lg font-medium text-gray-900">{{ selectedClass.current_bookings }}/{{ selectedClass.max_capacity }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">状态</label>
            <el-tag :type="selectedClass.status === 'confirmed' ? 'success' : 'warning'">
              {{ selectedClass.status === 'confirmed' ? '已确认' : '待确认' }}
            </el-tag>
          </div>
        </div>
        <div v-if="selectedClass.notes">
          <label class="text-sm font-medium text-gray-500">备注</label>
          <p class="text-gray-900">{{ selectedClass.notes }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCoachService } from '@/composables/useCoachService'
import ScheduleCalendar from '@/admin/components/ScheduleCalendar.vue'
import Swal from 'sweetalert2'

const {
  coachInfo,
  coachClasses,
  getCoachClasses
} = useCoachService()

// 响应式数据
const showClassDetailsModal = ref(false)
const selectedClass = ref(null)

// 初始化数据
onMounted(async () => {
  await getCoachClasses(coachInfo.value.id)
})

// 事件处理函数
const refreshSchedule = async () => {
  try {
    await getCoachClasses(coachInfo.value.id)
    Swal.fire({
      title: '刷新成功',
      text: '课程数据已更新',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('刷新课程数据失败:', error)
    Swal.fire({
      title: '刷新失败',
      text: '刷新课程数据失败，请重试',
      icon: 'error'
    })
  }
}

const viewClassDetails = (classItem) => {
  selectedClass.value = classItem
  showClassDetailsModal.value = true
}
</script>
