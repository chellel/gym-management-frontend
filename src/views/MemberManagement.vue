<template>
  <Layout>
    <div class="space-y-6">
      <!-- 页面标题和操作栏 -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">会员管理</h1>
          <p class="mt-1 text-sm text-gray-600">管理健身房会员信息，包括新增、编辑和查看会员详情。</p>
        </div>
        <button
          @click="showAddMemberModal = true"
          class="btn-primary inline-flex items-center"
        >
          <el-icon class="w-5 h-5 mr-2">
            <Plus />
          </el-icon>
          新增会员
        </button>
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
                <input
                  id="search"
                  v-model="searchTerm"
                  @input="handleSearch"
                  type="text"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="搜索会员姓名、会员号或手机号..."
                />
              </div>
            </div>

            <!-- 状态筛选 -->
            <div>
              <label for="status-filter" class="sr-only">状态筛选</label>
              <select
                id="status-filter"
                v-model="selectedStatus"
                @change="handleStatusFilter"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">全部状态</option>
                <option value="active">正常会员</option>
                <option value="expired">过期会员</option>
              </select>
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
            <button
              @click="fetchMembers"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              重新加载
            </button>
          </div>
        </div>

        <ul v-else-if="members.length > 0" class="divide-y divide-gray-200">
          <li v-for="member in members" :key="member.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12">
                  <div class="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-sm font-medium text-primary-600">
                      {{ member.name.charAt(0) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                    <span
                      class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(getMemberStatus(member.expire_date))"
                    >
                      {{ getStatusText(getMemberStatus(member.expire_date)) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500">
                    会员号：{{ member.member_id }} | 手机：{{ member.phone }}
                  </div>
                  <div class="text-sm text-gray-500">
                    类型：{{ member.membership_type }} | 到期：{{ formatDate(member.expire_date) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  @click="editMember(member)"
                  class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <el-icon class="h-4 w-4">
                    <Edit />
                  </el-icon>
                </button>
                <button
                  @click="deleteMember(member.id, member.name)"
                  class="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <el-icon class="h-4 w-4">
                    <Delete />
                  </el-icon>
                </button>
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
      <div v-if="pagination.total > pagination.pageSize" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示
              <span class="font-medium">{{ pagination.start + 1 }}</span>
              到
              <span class="font-medium">{{ Math.min(pagination.end + 1, pagination.total) }}</span>
              条，共
              <span class="font-medium">{{ pagination.total }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="goToPage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <el-icon class="h-5 w-5">
                  <ArrowLeft />
                </el-icon>
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                :class="page === pagination.currentPage
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button
                @click="goToPage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <el-icon class="h-5 w-5">
                  <ArrowRight />
                </el-icon>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑会员模态框 -->
    <div v-if="showAddMemberModal || showEditMemberModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showAddMemberModal ? '新增会员' : '编辑会员' }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-6 w-6">
                <Close />
              </el-icon>
            </button>
          </div>

          <form @submit.prevent="showAddMemberModal ? handleAddMember() : handleUpdateMember()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">姓名 *</label>
                <input
                  id="name"
                  v-model="memberForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label for="member_id" class="block text-sm font-medium text-gray-700">会员号 *</label>
                <input
                  id="member_id"
                  v-model="memberForm.member_id"
                  type="text"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">手机号 *</label>
                <input
                  id="phone"
                  v-model="memberForm.phone"
                  type="tel"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">邮箱</label>
                <input
                  id="email"
                  v-model="memberForm.email"
                  type="email"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label for="membership_type" class="block text-sm font-medium text-gray-700">会员类型 *</label>
                <select
                  id="membership_type"
                  v-model="memberForm.membership_type"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">请选择会员类型</option>
                  <option value="月度会员">月度会员</option>
                  <option value="季度会员">季度会员</option>
                  <option value="半年会员">半年会员</option>
                  <option value="年度会员">年度会员</option>
                  <option value="终身会员">终身会员</option>
                </select>
              </div>

              <div>
                <label for="expire_date" class="block text-sm font-medium text-gray-700">到期日期 *</label>
                <input
                  id="expire_date"
                  v-model="memberForm.expire_date"
                  type="date"
                  required
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {{ showAddMemberModal ? '添加' : '保存' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Layout from '../components/Layout.vue'
import { useMembers } from '../composables/useMembers'
import { getPlanList } from '@/api/member'

// 使用会员管理 composable
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

// 搜索和筛选
const searchTerm = ref('')
const selectedStatus = ref('all')

// 模态框状态
const showAddMemberModal = ref(false)
const showEditMemberModal = ref(false)
const editingMember = ref(null)

// 会员表单
const memberForm = reactive({
  name: '',
  member_id: '',
  phone: '',
  email: '',
  membership_type: '',
  expire_date: ''
})

// 计算属性
const totalPages = computed(() => Math.ceil(pagination.total / pagination.pageSize))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.currentPage - 2)
  const end = Math.min(totalPages.value, pagination.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 搜索处理
const handleSearch = () => {
  searchMembers(searchTerm.value)
}

// 状态筛选处理
const handleStatusFilter = () => {
  filterByStatus(selectedStatus.value)
}

// 重置表单
const resetForm = () => {
  Object.assign(memberForm, {
    name: '',
    member_id: '',
    phone: '',
    email: '',
    membership_type: '',
    expire_date: ''
  })
}

// 关闭模态框
const closeModal = () => {
  showAddMemberModal.value = false
  showEditMemberModal.value = false
  editingMember.value = null
  resetForm()
}

// 编辑会员
const editMember = (member) => {
  editingMember.value = member
  Object.assign(memberForm, {
    name: member.name,
    member_id: member.member_id,
    phone: member.phone,
    email: member.email || '',
    membership_type: member.membership_type,
    expire_date: member.expire_date
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
</script>
