<template>
  <div>
    <div class="space-y-6">
      <!-- 页面标题和操作栏 -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">会员管理</h1>
          <p class="mt-1 text-sm text-gray-600">管理健身房会员信息，包括新增、编辑和查看会员详情。</p>
        </div>
        <el-button
          @click="showAddMemberModal = true"
          type="primary"
          class="inline-flex items-center"
        >
          <el-icon class="w-5 h-5 mr-2">
            <Plus />
          </el-icon>
          新增会员
        </el-button>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <el-icon class="h-6 w-6 text-gray-400">
                  <User />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总会员数</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalMembers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <el-icon class="h-6 w-6 text-green-400">
                  <CircleCheckFilled />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">活跃会员</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeMembers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <el-icon class="h-6 w-6 text-red-400">
                  <WarningFilled />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">过期会员</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.expiredMembers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <el-icon class="h-6 w-6 text-blue-400">
                  <UserFilled />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">本月新增</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.newMembers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索和筛选栏 -->
      <div class="bg-white shadow rounded-lg">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 搜索框 -->
            <div class="md:col-span-2">
              <label for="search" class="sr-only">搜索会员</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <el-icon class="h-5 w-5 text-gray-400">
                    <Search />
                  </el-icon>
                </div>
                <el-input
                  v-model="searchForm.searchTerm"
                  @input="handleSearch"
                  placeholder="搜索会员姓名、会员号或手机号..."
                  clearable
                  prefix-icon="Search"
                />
              </div>
            </div>

            <!-- 状态筛选 -->
            <div>
              <label for="status-filter" class="sr-only">状态筛选</label>
              <el-select
                v-model="searchForm.selectedStatus"
                @change="handleStatusFilter"
                placeholder="选择状态"
                class="w-full"
              >
                <el-option label="全部状态" value="all" />
                <el-option label="正常" value="active" />
                <el-option label="请假" value="leave" />
                <el-option label="过期" value="expired" />
                <el-option label="停用" value="inactive" />
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <!-- 会员列表 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="p-6 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            加载中...
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-else-if="error && members.length === 0" class="p-6 text-center">
          <el-icon class="mx-auto h-12 w-12 text-red-400">
            <WarningFilled />
          </el-icon>
          <h3 class="mt-2 text-sm font-medium text-gray-900">加载失败</h3>
          <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
          <div class="mt-4">
            <el-button
              @click="fetchMembers"
              type="primary"
              size="small"
            >
              重新加载
            </el-button>
          </div>
        </div>

        <ul v-else-if="members.length > 0" class="divide-y divide-gray-200">
          <li v-for="member in members" :key="member.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12">
                  <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">
                      {{ member.userName.charAt(0) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ member.userName }}</div>
                    <span
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(getMemberStatus(member))"
                    >
                      {{ getStatusText(getMemberStatus(member)) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    会员号：{{ member.userCode }} | 手机：{{ member.phone }}
                  </div>
                  <div class="text-sm text-gray-500">
                    类型：{{ member.membershipType }} | 到期：{{ formatDate(member.membershipExpireDate) }}
                  </div>
                  <div v-if="member.remainingDays !== undefined" class="text-sm text-gray-500">
                    剩余天数：{{ member.remainingDays > 0 ? member.remainingDays + '天' : '已过期' }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <el-button
                  @click="editMember(member)"
                  type="primary"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Edit />
                  </el-icon>
                </el-button>
                <el-button
                  v-if="member.userStatus === 'active'"
                  @click="showLeaveModal(member)"
                  type="warning"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Calendar />
                  </el-icon>
                </el-button>
                <el-button
                  v-if="member.userStatus === 'leave'"
                  @click="returnFromLeave(member)"
                  type="success"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Check />
                  </el-icon>
                </el-button>
                <el-button
                  @click="deleteMember(member.id, member.userName)"
                  type="danger"
                  size="small"
                  circle
                >
                  <el-icon class="h-4 w-4">
                    <Delete />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="p-6 text-center text-gray-500">
          <el-icon class="mx-auto h-12 w-12 text-gray-400">
            <User />
          </el-icon>
          <h3 class="mt-2 text-sm font-medium text-gray-900">暂无会员数据</h3>
          <p class="mt-1 text-sm text-gray-500">开始添加会员来管理您的健身房业务。</p>
        </div>
      </div>

      <!-- 分页 -->
      <Pagination
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        @page-change="goToPage"
      />
    </div>

    <!-- 新增/编辑会员模态框 -->
    <div v-if="showAddMemberModal || showEditMemberModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showAddMemberModal ? '新增会员' : '编辑会员' }}
            </h3>
            <el-button
              @click="closeModal"
              type="text"
              class="text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-6 w-6">
                <Close />
              </el-icon>
            </el-button>
          </div>

          <el-form @submit.prevent="showAddMemberModal ? handleAddMember() : handleUpdateMember()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-form-item label="姓名" required>
                <el-input
                  v-model="memberForm.name"
                  placeholder="请输入姓名"
                  clearable
                />
              </el-form-item>

              <el-form-item label="会员号" required>
                <el-input
                  v-model="memberForm.member_id"
                  placeholder="请输入会员号"
                  clearable
                />
              </el-form-item>

              <el-form-item label="手机号" required>
                <el-input
                  v-model="memberForm.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  clearable
                />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input
                  v-model="memberForm.email"
                  type="email"
                  placeholder="请输入邮箱"
                  clearable
                />
              </el-form-item>

              <el-form-item label="会员类型" required>
                <el-select
                  v-model="memberForm.membership_type"
                  placeholder="请选择会员类型"
                  class="w-full"
                >
                  <el-option label="月度会员" value="月度会员" />
                  <el-option label="季度会员" value="季度会员" />
                  <el-option label="半年会员" value="半年会员" />
                  <el-option label="年度会员" value="年度会员" />
                  <el-option label="终身会员" value="终身会员" />
                </el-select>
              </el-form-item>

              <el-form-item label="到期日期" required>
                <el-date-picker
                  v-model="memberForm.expire_date"
                  type="date"
                  placeholder="选择到期日期"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="性别">
                <el-select
                  v-model="memberForm.gender"
                  placeholder="请选择性别"
                  class="w-full"
                >
                  <el-option label="男" :value="1" />
                  <el-option label="女" :value="0" />
                </el-select>
              </el-form-item>

              <el-form-item label="出生日期">
                <el-date-picker
                  v-model="memberForm.birth_date"
                  type="date"
                  placeholder="选择出生日期"
                  class="w-full"
                />
              </el-form-item>

              <el-form-item label="会员状态">
                <el-select
                  v-model="memberForm.status"
                  placeholder="请选择会员状态"
                  class="w-full"
                >
                  <el-option label="正常" value="active" />
                  <el-option label="请假" value="leave" />
                  <el-option label="停用" value="inactive" />
                  <el-option label="过期" value="expired" />
                </el-select>
              </el-form-item>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <el-button
                @click="closeModal"
                type="default"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                native-type="submit"
              >
                {{ showAddMemberModal ? '添加' : '保存' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 请假弹窗组件 -->
    <MemberLeaveModal
      :visible="showLeaveModalFlag"
      :member="currentLeaveMember"
      :loading="leaveLoading"
      @close="closeLeaveModal"
      @submit="handleLeaveMember"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMembers } from '@/composables/useMembers'
import { ElMessage, ElMessageBox } from 'element-plus'
import MemberLeaveModal from '@/admin/components/MemberLeaveModal.vue'
import Pagination from '@/admin/components/Pagination.vue'

const {
  members,
  loading,
  error,
  stats,
  pagination,
  fetchMembers,
  addMember,
  updateMember,
  deleteMember,
  searchMembers,
  filterByStatus,
  goToPage,
  formatDate,
  getMemberStatus,
  getStatusText,
  getStatusClass
} = useMembers()

const searchForm = reactive({
  searchTerm: '',
  selectedStatus: 'all'
})    
// 模态框状态
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const showLeaveModalFlag = ref(false)
const editingMember = ref(null)
const currentLeaveMember = ref(null)
const leaveLoading = ref(false)

// 会员表单
const memberForm = reactive({
  name: '',
  member_id: '',
  phone: '',
  email: '',
  membership_type: '',
  expire_date: '',
  status: 'active',
  gender: 1,
  birth_date: ''
})


// 搜索处理
const handleSearch = () => {
  searchMembers(searchForm.searchTerm)
}

// 状态筛选处理
const handleStatusFilter = () => {
  filterByStatus(searchForm.selectedStatus)
}

// 重置表单
const resetForm = () => {
  Object.assign(memberForm, {
    name: '',
    member_id: '',
    phone: '',
    email: '',
    membership_type: '',
    expire_date: '',
    status: 'active',
    gender: 1,
    birth_date: ''
  })
}

// 关闭模态框
const closeModal = () => {
  showAddMemberModal.value = false
  showEditMemberModal.value = false
  editingMember.value = null
  resetForm()
}

// 显示请假模态框
const showLeaveModal = (member) => {
  currentLeaveMember.value = member
  showLeaveModalFlag.value = true
}

// 关闭请假模态框
const closeLeaveModal = () => {
  showLeaveModalFlag.value = false
  currentLeaveMember.value = null
  leaveLoading.value = false
}

// 编辑会员
const editMember = (member) => {
  editingMember.value = member
  Object.assign(memberForm, {
    name: member.userName,
    member_id: member.userCode,
    phone: member.phone,
    email: member.email || '',
    membership_type: member.membershipType,
    expire_date: member.membershipExpireDate,
    status: member.userStatus || 'active',
    gender: member.gender || 1,
    birth_date: member.birthDate || ''
  })
  showEditMemberModal.value = true
}

// 添加会员
const handleAddMember = async () => {
  await addMember({
    ...memberForm,
    join_date: new Date().toISOString().split('T')[0]
  })
  closeModal()
}

// 更新会员
const handleUpdateMember = async () => {
  await updateMember(editingMember.value.id, memberForm)
  closeModal()
}

// 处理会员请假
const handleLeaveMember = async (leaveData) => {
  try {
    leaveLoading.value = true

    // 调用请假API
    await updateMember(currentLeaveMember.value.id, {
      status: 'leave',
      leaveType: leaveData.leaveType,
      leaveReason: leaveData.reason,
      leaveStartDate: leaveData.startDate,
      leaveEndDate: leaveData.endDate
    })

    ElMessage.success('请假申请已提交')
    closeLeaveModal()
    await fetchMembers()
  } catch (error) {
    console.error('请假失败:', error)
    ElMessage.error('请假申请失败，请重试')
  } finally {
    leaveLoading.value = false
  }
}

// 处理会员复课
const returnFromLeave = async (member) => {
  try {
    await ElMessageBox.confirm(
      `确定要恢复会员"${member.userName}"的正常状态吗？`,
      '确认复课',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    await updateMember(member.id, {
      status: 'active',
      leaveType: '',
      leaveReason: '',
      leaveStartDate: '',
      leaveEndDate: ''
    })

    ElMessage.success('会员已恢复正常状态')
    await fetchMembers()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('复课失败:', error)
      ElMessage.error('复课操作失败，请重试')
    }
  }
}
</script>
