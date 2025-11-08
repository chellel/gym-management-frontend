<template>
  <div v-if="visible" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            会员请假
          </h3>
          <el-button
            @click="handleClose"
            type="text"
            class="text-gray-400 hover:text-gray-600"
          >
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </el-button>
        </div>

        <el-form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <div class="text-sm text-gray-600">会员信息</div>
              <div class="font-medium">{{ member?.userName }}</div>
              <div class="text-sm text-gray-500">{{ member?.userCode }} | {{ member?.phone }}</div>
            </div>

            <el-form-item label="请假类型" required>
              <el-select
                v-model="form.leaveType"
                placeholder="请选择请假类型"
                class="w-full"
              >
                <el-option label="病假" value="sick" />
                <el-option label="事假" value="personal" />
                <el-option label="出差" value="travel" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>

            <el-form-item label="请假原因" required>
              <el-input
                v-model="form.reason"
                type="textarea"
                :rows="3"
                placeholder="请输入请假原因"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="请假日期范围" required>
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                class="w-full"
              />
            </el-form-item>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <el-button
              @click="handleClose"
              type="default"
            >
              取消
            </el-button>
            <el-button
              type="warning"
              native-type="submit"
              :loading="loading"
            >
              确认请假
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  member: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// 表单数据
const form = reactive({
  leaveType: '',
  reason: '',
  dateRange: null
})

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    leaveType: '',
    reason: '',
    dateRange: null
  })
}

// 关闭弹窗
const handleClose = () => {
  resetForm()
  emit('close')
}

// 提交表单
const handleSubmit = () => {
  // 验证表单
  if (!form.leaveType || !form.reason || !form.dateRange) {
    ElMessage.warning('请填写完整的请假信息')
    return
  }

  // 验证日期范围
  if (!Array.isArray(form.dateRange) || form.dateRange.length !== 2) {
    ElMessage.warning('请选择有效的日期范围')
    return
  }

  const [startDate, endDate] = form.dateRange
  if (new Date(startDate) >= new Date(endDate)) {
    ElMessage.warning('结束日期必须晚于开始日期')
    return
  }

  // 提交数据
  emit('submit', {
    leaveType: form.leaveType,
    reason: form.reason,
    startDate: startDate,
    endDate: endDate
  })
}

// 监听弹窗显示状态，重置表单
watch(() => props.visible, (newVal) => {
  if (newVal) {
    resetForm()
  }
})
</script>
