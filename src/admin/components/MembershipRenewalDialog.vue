<template>
  <el-dialog
    v-model="visible"
    :title="isRenewal ? '会员续费' : '办理会籍'"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="member" class="space-y-6">
      <!-- 会员信息展示 -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-3">会员信息</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">姓名：</span>
            <span class="font-medium">{{ member.userName }}</span>
          </div>
          <div>
            <span class="text-gray-500">会员号：</span>
            <span class="font-medium">{{ member.userCode }}</span>
          </div>
          <div>
            <span class="text-gray-500">手机号：</span>
            <span class="font-medium">{{ member.phone }}</span>
          </div>
          <div>
            <span class="text-gray-500">当前套餐：</span>
            <span class="font-medium">{{ member.membershipType || '无' }}</span>
          </div>
          <div>
            <span class="text-gray-500">到期日期：</span>
            <span class="font-medium">{{ formatDate(member.membershipExpireDate) }}</span>
          </div>
          <div>
            <span class="text-gray-500">剩余天数：</span>
            <span class="font-medium" :class="getRemainingDaysClass(member.remainingDays)">
              {{ member.remainingDays > 0 ? member.remainingDays + '天' : '已过期' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 会籍办理表单 -->
      <el-form
        ref="formRef"
        :model="renewalForm"
        :rules="formRules"
        label-width="120px"
        class="space-y-4"
      >
        <!-- 套餐选择 -->
        <el-form-item label="选择套餐" prop="membershipTypeId">
          <el-select
            v-model="renewalForm.membershipTypeId"
            placeholder="请选择套餐类型"
            class="w-full"
            @change="handleMembershipTypeChange"
          >
            <el-option
              v-for="type in membershipTypes"
              :key="type.id"
              :label="`${type.typeName} - ¥${type.price}`"
              :value="type.id"
            >
              <div class="flex justify-between items-center">
                <span>{{ type.typeName }}</span>
                <div class="text-right">
                  <div class="text-sm font-medium">¥{{ type.price }}</div>
                  <div v-if="type.originalPrice && type.originalPrice > type.price" class="text-xs text-gray-500">
                    原价：¥{{ type.originalPrice }}
                  </div>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 套餐详情展示 -->
        <div v-if="selectedMembershipType" class="bg-blue-50 rounded-lg p-4">
          <h4 class="text-sm font-medium text-blue-900 mb-2">套餐详情</h4>
          <div class="grid grid-cols-2 gap-2 text-sm text-blue-800">
            <div>有效期：{{ selectedMembershipType.durationDays }}天</div>
            <div>价格：¥{{ selectedMembershipType.price }}</div>
            <div v-if="selectedMembershipType.originalPrice" class="col-span-2">
              优惠：¥{{ selectedMembershipType.originalPrice - selectedMembershipType.price }}
            </div>
            <div v-if="selectedMembershipType.description" class="col-span-2">
              说明：{{ selectedMembershipType.description }}
            </div>
          </div>
          <div v-if="selectedMembershipType.benefits" class="mt-2">
            <div class="text-sm font-medium text-blue-900 mb-1">会员权益：</div>
            <div class="text-xs text-blue-700">
              {{ formatBenefits(selectedMembershipType.benefits) }}
            </div>
          </div>
        </div>

        <!-- 会籍开始日期 -->
        <el-form-item label="会籍开始日期" prop="startDate">
          <el-date-picker
            v-model="renewalForm.startDate"
            type="date"
            :placeholder="isRenewal ? '默认为当前到期日期后' : '选择会籍开始日期'"
            class="w-full"
            :disabled-date="disabledDate"
            @change="handleStartDateChange"
          />
          <div class="text-xs text-gray-500 mt-1">
            {{ isRenewal ? '不选择则从当前到期日期后开始' : '会籍有效期将从所选日期开始计算' }}
          </div>
        </el-form-item>


        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input
            v-model="renewalForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <!-- 价格计算展示 -->
      <div v-if="priceCalculation" class="bg-green-50 rounded-lg p-4">
        <h4 class="text-sm font-medium text-green-900 mb-3">费用明细</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-green-700">套餐价格：</span>
            <span class="font-medium">¥{{ priceCalculation.originalPrice }}</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="text-green-900 font-medium">实付金额：</span>
            <span class="text-lg font-bold text-green-900">¥{{ priceCalculation.finalAmount }}</span>
          </div>
          <div class="text-xs text-green-700">
            {{ isRenewal ? '续费' : '办理' }}后到期日期：{{ formatDate(priceCalculation.newExpireDate) }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="handleClose">取消</el-button>
          <el-button
          type="primary"
          @click="handleSubmit"
          :loading="loading"
          :disabled="!canSubmit"
        >
          {{ isRenewal ? '确认续费' : '确认办理' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  getMembershipTypes, 
  getMemberMembership, 
  renewMembership, 
  calculateRenewalPrice
} from '@/api/member'
import dayjs from 'dayjs'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  member: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:visible', 'success'])

// 响应式数据
const loading = ref(false)
const membershipTypes = ref([])
const selectedMembershipType = ref(null)
const priceCalculation = ref(null)

// 表单引用
const formRef = ref()

// 会籍办理表单
const renewalForm = reactive({
  membershipTypeId: null,
  startDate: null,
  remark: ''
})

// 表单验证规则
const formRules = {
  membershipTypeId: [
    { required: true, message: '请选择套餐类型', trigger: 'change' }
  ]
}

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 判断是续费还是办理：剩余天数 > 0 说明有有效会籍，则为续费
const isRenewal = computed(() => {
  return props.member?.remainingDays > 0
})

const canSubmit = computed(() => {
  return renewalForm.membershipTypeId && 
         priceCalculation.value &&
         !loading.value
})

// 监听器
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadMembershipTypes()
    resetForm()
  }
})

watch(() => props.member, (newMember) => {
  if (newMember) {
    loadMemberMembership()
  }
})

// 方法
const loadMembershipTypes = async () => {
  try {
    const response = await getMembershipTypes({ status: 'active', sortOrder: true })
    membershipTypes.value = response.rows || response.data || []
  } catch (error) {
    console.error('加载套餐类型失败:', error)
    ElMessage.error('加载套餐类型失败')
  }
}

const loadMemberMembership = async () => {
  if (!props.member?.id) return
  
  try {
    const response = await getMemberMembership(props.member.id)
    // 根据当前会籍信息设置默认值
    if (response.data) {
      const membership = response.data
      // 设置默认续费开始日期为当前到期日期
      if (membership.expireDate) {
        renewalForm.startDate = membership.expireDate
      }
    }
  } catch (error) {
    console.error('加载会员会籍信息失败:', error)
  }
}

const handleMembershipTypeChange = () => {
  // 找到选中的套餐类型
  selectedMembershipType.value = membershipTypes.value.find(
    type => type.id === renewalForm.membershipTypeId
  ) || null
  
  // 计算价格
  calculatePrice()
}

const handleStartDateChange = () => {
  if (renewalForm.membershipTypeId) {
    calculatePrice()
  }
}


const calculatePrice = async () => {
  if (!props.member?.id || !renewalForm.membershipTypeId) return
  
  try {
    const response = await calculateRenewalPrice({
      memberId: props.member.id,
      membershipTypeId: renewalForm.membershipTypeId,
      startDate: renewalForm.startDate ? dayjs(renewalForm.startDate).format('YYYY-MM-DD') : undefined,
      discountAmount: 0
    })
    
    priceCalculation.value = response.data
  } catch (error) {
    console.error('计算价格失败:', error)
    ElMessage.error('计算价格失败')
  }
}

const disabledDate = (time) => {
  // 禁用过去的日期
  return time.getTime() < Date.now() - 8.64e7
}

const formatDate = (date) => {
  if (!date) return '无'
  return dayjs(date).format('YYYY-MM-DD')
}

const formatBenefits = (benefits) => {
  try {
    const benefitsArray = JSON.parse(benefits)
    return Array.isArray(benefitsArray) ? benefitsArray.join('、') : benefits
  } catch {
    return benefits
  }
}

const getRemainingDaysClass = (days) => {
  if (!days) return 'text-gray-500'
  if (days <= 0) return 'text-red-600'
  if (days <= 7) return 'text-orange-600'
  return 'text-green-600'
}

const resetForm = () => {
  Object.assign(renewalForm, {
    membershipTypeId: null,
    startDate: null,
    remark: ''
  })
  selectedMembershipType.value = null
  priceCalculation.value = null
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const action = isRenewal.value ? '续费' : '办理会籍'
    await ElMessageBox.confirm(
      `确认要为会员"${props.member?.userName}"${action}吗？\n实付金额：¥${priceCalculation.value?.finalAmount}`,
      `确认${action}`,
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.value = true
    
    const requestData = {
      memberId: props.member.id,
      membershipTypeId: renewalForm.membershipTypeId,
      startDate: renewalForm.startDate ? dayjs(renewalForm.startDate).format('YYYY-MM-DD') : undefined,
      discountAmount: 0,
      remark: renewalForm.remark
    }
    
    await renewMembership(requestData)
    
    ElMessage.success(isRenewal.value ? '续费成功' : '会籍办理成功')
    emit('success')
    handleClose()
    
  } catch (error) {
    if (error !== 'cancel') {
      const action = isRenewal.value ? '续费' : '办理会籍'
      console.error(`${action}失败:`, error)
      ElMessage.error(`${action}失败，请重试`)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.visible) {
    loadMembershipTypes()
  }
})
</script>
