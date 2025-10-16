<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">可用时间管理</h2>
      <el-button @click="showAddAvailabilityModal = true" type="primary">
        <el-icon class="w-4 h-4 mr-1">
          <Plus />
        </el-icon>
        添加可用时间
      </el-button>
    </div>

    <div class="space-y-4">
      <div 
        v-for="availability in coachAvailability" 
        :key="availability.id"
        class="border rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ availability.date }}</h3>
            <p class="text-sm text-gray-500">{{ availability.start_time }} - {{ availability.end_time }}</p>
            <p class="text-sm text-gray-500">{{ availability.notes || '无备注' }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <el-tag :type="availability.status === 'available' ? 'success' : 'warning'">
              {{ availability.status === 'available' ? '可用' : '已占用' }}
            </el-tag>
            <el-button @click="editAvailability(availability)" type="text" size="small">
              编辑
            </el-button>
            <el-button @click="deleteAvailability(availability)" type="text" size="small" class="text-red-600">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加可用时间模态框 -->
    <el-dialog
      v-model="showAddAvailabilityModal"
      title="添加可用时间"
      width="500px"
    >
      <el-form :model="availabilityForm" label-width="100px">
        <el-form-item label="日期" required>
          <el-date-picker
            v-model="availabilityForm.date"
            type="date"
            placeholder="选择日期"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-time-picker
            v-model="availabilityForm.start_time"
            placeholder="选择开始时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-time-picker
            v-model="availabilityForm.end_time"
            placeholder="选择结束时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="availabilityForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddAvailabilityModal = false">取消</el-button>
          <el-button type="primary" @click="addAvailability">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCoachService } from '@/composables/useCoachService'
import Swal from 'sweetalert2'

const {
  coachInfo,
  coachAvailability,
  getCoachAvailability,
  addAvailability: addAvailabilityService,
  updateAvailability,
  deleteAvailability: deleteAvailabilityService
} = useCoachService()

// 响应式数据
const showAddAvailabilityModal = ref(false)

// 表单数据
const availabilityForm = reactive({
  date: '',
  start_time: '',
  end_time: '',
  notes: ''
})

// 初始化数据
onMounted(async () => {
  await getCoachAvailability(coachInfo.value.id)
})

// 事件处理函数
const addAvailability = async () => {
  try {
    await addAvailabilityService(availabilityForm)
    showAddAvailabilityModal.value = false
    
    // 重置表单
    Object.assign(availabilityForm, {
      date: '',
      start_time: '',
      end_time: '',
      notes: ''
    })
    
    Swal.fire({
      title: '添加成功',
      text: '可用时间已添加',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('添加可用时间失败:', error)
    Swal.fire({
      title: '添加失败',
      text: '添加可用时间失败，请重试',
      icon: 'error'
    })
  }
}

const editAvailability = (availability) => {
  Object.assign(availabilityForm, {
    date: availability.date,
    start_time: availability.start_time,
    end_time: availability.end_time,
    notes: availability.notes
  })
  showAddAvailabilityModal.value = true
}

const deleteAvailability = async (availability) => {
  const result = await Swal.fire({
    title: '确认删除',
    text: '确定要删除这个可用时间吗？',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  
  if (result.isConfirmed) {
    try {
      await deleteAvailabilityService(availability.id)
      Swal.fire({
        title: '删除成功',
        text: '可用时间已删除',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('删除可用时间失败:', error)
      Swal.fire({
        title: '删除失败',
        text: '删除可用时间失败，请重试',
        icon: 'error'
      })
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
