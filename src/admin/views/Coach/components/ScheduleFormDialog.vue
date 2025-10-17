<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑排班' : '添加排班'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="space-y-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="课程名称" prop="activity">
          <el-input v-model="form.activity" placeholder="请输入课程名称" />
        </el-form-item> 

        <el-form-item label="地点" prop="location">
          <el-select v-model="form.location" placeholder="选择地点" style="width: 100%">
            <el-option label="瑜伽室A" value="瑜伽室A" />
            <el-option label="瑜伽室B" value="瑜伽室B" />
            <el-option label="器械区" value="器械区" />
            <el-option label="游泳池" value="游泳池" />
            <el-option label="拳击台" value="拳击台" />
            <el-option label="有氧区" value="有氧区" />
            <el-option label="舞蹈室" value="舞蹈室" />
            <el-option label="多功能厅" value="多功能厅" />
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :disabled-date="disabledDate"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="选择状态" style="width: 100%">
            <el-option label="已确认" value="confirmed" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始时间" prop="start_time">
          <el-time-picker
            v-model="form.start_time"
            placeholder="选择开始时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>

        <el-form-item label="结束时间" prop="end_time">
          <el-time-picker
            v-model="form.end_time"
            placeholder="选择结束时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>

        <el-form-item label="最大容量" prop="max_capacity">
          <el-input-number
            v-model="form.max_capacity"
            :min="1"
            :max="50"
            placeholder="请输入最大容量"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="当前预约" prop="current_bookings">
          <el-input-number
            v-model="form.current_bookings"
            :min="0"
            :max="form.max_capacity"
            placeholder="请输入当前预约数"
            style="width: 100%"
          />
        </el-form-item>
      </div>

      <el-form-item label="备注" prop="notes">
        <el-input
          v-model="form.notes"
          type="textarea"
          :rows="3"
          placeholder="请输入备注信息"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { coachApi, type Coach, type CoachSchedule } from '@/api/coach'

// Props
const props = defineProps<{
  visible: boolean
  coach?: Coach | null
  schedule?: CoachSchedule | null
}>()

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'success': []
}>()

// 响应式数据
const formRef = ref()
const loading = ref(false)
const form = reactive({
  activity: '',
  location: '',
  date: '',
  start_time: '',
  end_time: '',
  max_capacity: 20,
  current_bookings: 0,
  status: 'confirmed',
  notes: ''
})

// 表单验证规则
const rules = {
  activity: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 2, max: 50, message: '课程名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请选择地点', trigger: 'change' }
  ],
  date: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ],
  start_time: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  max_capacity: [
    { required: true, message: '请输入最大容量', trigger: 'blur' },
    { type: 'number', min: 1, max: 50, message: '容量必须在 1 到 50 之间', trigger: 'blur' }
  ],
  current_bookings: [
    { required: true, message: '请输入当前预约数', trigger: 'blur' },
    { type: 'number', min: 0, message: '预约数不能小于 0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isEdit = computed(() => !!props.schedule)
// 重置表单
const resetForm = () => {
  Object.assign(form, {
    activity: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    max_capacity: 20,
    current_bookings: 0,
    status: 'confirmed',
    notes: ''
  })
  formRef.value?.clearValidate()
}
// 监听排班数据变化
watch(() => props.schedule, (newSchedule) => {
  if (newSchedule) {
    Object.assign(form, {
      activity: newSchedule.activity,
      location: newSchedule.location,
      date: newSchedule.date,
      start_time: newSchedule.start_time,
      end_time: newSchedule.end_time,
      max_capacity: newSchedule.max_capacity,
      current_bookings: newSchedule.current_bookings,
      status: newSchedule.status,
      notes: newSchedule.notes || ''
    })
  } else {
    resetForm()
  }
}, { immediate: true })



// 禁用日期（只能选择今天及以后的日期）
const disabledDate = (time: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return time.getTime() < today.getTime()
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    // 验证时间逻辑
    if (form.start_time && form.end_time) {
      const startTime = new Date(`2000-01-01 ${form.start_time}`)
      const endTime = new Date(`2000-01-01 ${form.end_time}`)
      if (startTime >= endTime) {
        ElMessage.error('结束时间必须晚于开始时间')
        return
      }
    }

    // 验证预约数不能超过容量
    if (form.current_bookings > form.max_capacity) {
      ElMessage.error('当前预约数不能超过最大容量')
      return
    }

    loading.value = true

    if (isEdit.value && props.schedule && props.coach) {
      // 更新排班
      const updateData = { ...form }
      await coachApi.updateCoachSchedule(props.coach.id, props.schedule.id, updateData)
      ElMessage.success('更新成功')
    } else if (props.coach) {
      // 创建排班
      const createData = { ...form }
      await coachApi.addCoachSchedule(props.coach.id, createData)
      ElMessage.success('创建成功')
    }

    emit('success')
    handleClose()
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败')
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}
</style>

