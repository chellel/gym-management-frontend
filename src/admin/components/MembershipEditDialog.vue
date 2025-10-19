<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑会籍信息"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="space-y-4"
    >
      <!-- 会员基本信息（只读） -->
      <div class="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-2">会员基本信息</h4>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">姓名：</span>
            <span class="font-medium">{{ member?.userName }}</span>
          </div>
          <div>
            <span class="text-gray-500">会员号：</span>
            <span class="font-medium">{{ member?.userCode }}</span>
          </div>
          <div>
            <span class="text-gray-500">手机：</span>
            <span class="font-medium">{{ member?.phone }}</span>
          </div>
          <div>
            <span class="text-gray-500">邮箱：</span>
            <span class="font-medium">{{ member?.email || '未设置' }}</span>
          </div>
        </div>
      </div>

      <!-- 会籍信息（可编辑） -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-700 border-b pb-2">会籍信息</h4>
        
        <el-form-item label="会籍类型" prop="membership_type">
          <el-select v-model="form.membership_type" placeholder="请选择会籍类型" class="w-full">
            <el-option label="月度会员" value="月度会员" />
            <el-option label="季度会员" value="季度会员" />
            <el-option label="半年会员" value="半年会员" />
            <el-option label="年度会员" value="年度会员" />
            <el-option label="终身会员" value="终身会员" />
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="date"
            placeholder="选择开始日期"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="到期日期" prop="expire_date">
          <el-date-picker
            v-model="form.expire_date"
            type="date"
            placeholder="选择到期日期"
            class="w-full"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">正常</el-radio>
            <el-radio label="inactive">停用</el-radio>
            <el-radio label="expired">过期</el-radio>
            <el-radio label="leave">请假</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          更新会籍
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { updateMember } from '@/api/member'

// Props
const props = defineProps<{
  visible: boolean
  member?: any
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
  membership_type: '',
  start_date: '',
  expire_date: '',
  status: 'active',
  remark: ''
})

// 表单验证规则
const rules = {
  membership_type: [
    { required: true, message: '请选择会籍类型', trigger: 'change' }
  ],
  start_date: [
    { required: true, message: '请选择开始日期', trigger: 'change' }
  ],
  expire_date: [
    { required: true, message: '请选择到期日期', trigger: 'change' }
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

// 监听会员数据变化
watch(
  () => props.member,
  (newMember) => {
    if (newMember) {
      Object.assign(form, {
        membership_type: newMember.membershipType || '',
        start_date: newMember.membershipStartDate || '',
        expire_date: newMember.membershipExpireDate || '',
        status: newMember.membershipStatus || 'active',
        remark: newMember.remark || ''
      })
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    const params = {
      membership_type: form.membership_type,
      start_date: form.start_date,
      expire_date: form.expire_date,
      status: form.status,
      remark: form.remark
    }

    await updateMember(props.member?.userId, params)
    ElMessage.success('会籍信息更新成功')
    
    emit('success')
    handleClose()
  } catch (error) {
    console.error('更新会籍信息失败:', error)
    ElMessage.error('更新会籍信息失败')
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  // 重置表单
  Object.assign(form, {
    membership_type: '',
    start_date: '',
    expire_date: '',
    status: 'active',
    remark: ''
  })
  formRef.value?.clearValidate()
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 16px;
}
</style>
