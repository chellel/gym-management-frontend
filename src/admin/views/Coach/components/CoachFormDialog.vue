<template>
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑教练' : '添加教练'"
    width="800px"
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
        <!-- 基本信息 -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">基本信息</h3>
          
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入教练姓名" />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱地址" />
          </el-form-item>

          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入电话号码" />
          </el-form-item>

          <el-form-item label="经验年限" prop="experience">
            <el-input v-model="form.experience" placeholder="如：5年" />
          </el-form-item>
        </div>

        <!-- 专业信息 -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b pb-2">专业信息</h3>
          
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="选择状态" style="width: 100%">
              <el-option label="在职" value="active" />
              <el-option label="离职" value="inactive" />
              <el-option label="暂停" value="suspended" />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">详细信息</h3>
        
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="4"
            placeholder="请输入个人简介，包括专业领域、认证证书、教学经验等信息"
          />
        </el-form-item>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="紧急联系人" prop="emergency_contact">
            <el-input v-model="form.emergency_contact" placeholder="请输入紧急联系人姓名" />
          </el-form-item>

          <el-form-item label="紧急联系电话" prop="emergency_phone">
            <el-input v-model="form.emergency_phone" placeholder="请输入紧急联系电话" />
          </el-form-item>
        </div>
      </div>

      <!-- 头像上传 -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 border-b pb-2">头像</h3>
        
        <el-form-item label="头像" prop="avatar">
          <div class="flex items-center space-x-4">
            <el-avatar
              :size="80"
              :src="form.avatar"
              :alt="form.name"
            >
              {{ form.name ? form.name.charAt(0) : 'A' }}
            </el-avatar>
            <div>
              <el-upload
                :show-file-list="false"
                :before-upload="handleAvatarUpload"
                accept="image/*"
              >
                <el-button size="small">上传头像</el-button>
              </el-upload>
              <p class="text-xs text-gray-500 mt-1">支持 JPG、PNG 格式，大小不超过 2MB</p>
            </div>
          </div>
        </el-form-item>
      </div>
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
import { coachApi, type Coach, type CreateCoachParams, type UpdateCoachParams } from '@/api/coach'

// Props
const props = defineProps<{
  visible: boolean
  coach?: Coach | null
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
  name: '',
  email: '',
  phone: '',
  experience: '',
  bio: '',
  emergency_contact: '',
  emergency_phone: '',
  status: 'active' as 'active' | 'inactive' | 'suspended',
  avatar: ''
})


// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入教练姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  experience: [
    { required: true, message: '请输入经验年限', trigger: 'blur' }
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

const isEdit = computed(() => !!props.coach)
// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    experience: '',
    bio: '',
    emergency_contact: '',
    emergency_phone: '',
    status: 'active',
    avatar: ''
  })
  formRef.value?.clearValidate()
}
// 监听教练数据变化
watch(() => props.coach, (newCoach) => {
  if (newCoach) {
    Object.assign(form, {
      name: newCoach.name,
      email: newCoach.email,
      phone: newCoach.phone,
      experience: newCoach.experience,
      bio: newCoach.bio || '',
      emergency_contact: newCoach.emergency_contact || '',
      emergency_phone: newCoach.emergency_phone || '',
      status: newCoach.status,
      avatar: newCoach.avatar || ''
    })
  } else {
    resetForm()
  }
}, { immediate: true })



// 处理头像上传
const handleAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }

  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    if (isEdit.value && props.coach) {
      // 更新教练
      const updateData: UpdateCoachParams = { ...form }
      await coachApi.updateCoach(props.coach.id, updateData)
      ElMessage.success('更新成功')
    } else {
      // 创建教练
      const createData: CreateCoachParams = { ...form }
      await coachApi.createCoach(createData)
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

.el-upload {
  display: inline-block;
}
</style>

