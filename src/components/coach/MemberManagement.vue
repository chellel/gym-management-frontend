<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">学员管理</h2>
      <div class="flex items-center space-x-4">
        <el-input
          v-model="memberSearchQuery"
          placeholder="搜索学员姓名或电话"
          class="w-64"
          clearable
        >
          <template #prefix>
            <el-icon class="text-gray-400">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button @click="refreshMembers" type="default" size="small" :loading="isLoadingMembers">
          <el-icon class="w-4 h-4 mr-1">
            <Refresh />
          </el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 学员统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-blue-50 rounded-lg p-4">
        <div class="flex items-center">
          <el-icon class="h-8 w-8 text-blue-600">
            <User />
          </el-icon>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-600">总学员数</p>
            <p class="text-2xl font-bold text-blue-900">{{ totalMembers }}</p>
          </div>
        </div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <div class="flex items-center">
          <el-icon class="h-8 w-8 text-green-600">
            <Check />
          </el-icon>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-600">活跃学员</p>
            <p class="text-2xl font-bold text-green-900">{{ activeMembers }}</p>
          </div>
        </div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4">
        <div class="flex items-center">
          <el-icon class="h-8 w-8 text-yellow-600">
            <Warning />
          </el-icon>
          <div class="ml-3">
            <p class="text-sm font-medium text-yellow-600">新学员</p>
            <p class="text-2xl font-bold text-yellow-900">{{ newMembers }}</p>
          </div>
        </div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4">
        <div class="flex items-center">
          <el-icon class="h-8 w-8 text-purple-600">
            <Star />
          </el-icon>
          <div class="ml-3">
            <p class="text-sm font-medium text-purple-600">VIP学员</p>
            <p class="text-2xl font-bold text-purple-900">{{ vipMembers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 学员列表 -->
    <div class="bg-white rounded-lg shadow relative">
      <!-- 加载状态覆盖层 -->
      <div v-if="isLoadingMembers" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <div class="text-center">
          <el-icon class="text-4xl text-blue-500 mb-2">
            <Loading />
          </el-icon>
          <p class="text-gray-600">正在加载学员数据...</p>
        </div>
      </div>
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">学员列表</h3>
          <div class="flex items-center space-x-2">
            <el-select v-model="memberFilter" placeholder="筛选类型" size="small" class="w-32">
              <el-option label="全部" value="all" />
              <el-option label="VIP" value="vip" />
              <el-option label="普通" value="normal" />
              <el-option label="新学员" value="new" />
            </el-select>
            <el-select v-model="memberSortBy" placeholder="排序方式" size="small" class="w-32">
              <el-option label="姓名" value="name" />
              <el-option label="加入时间" value="joinDate" />
              <el-option label="最后上课" value="lastClass" />
            </el-select>
          </div>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                学员信息
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                会员类型
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                加入时间
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后上课
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                上课次数
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="member in filteredMembers" 
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-600">{{ member.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                    <div class="text-sm text-gray-500">{{ member.phone }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="member.membership_type === 'VIP' ? 'warning' : 'default'">
                  {{ member.membership_type }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(member.join_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ member.last_class_date ? formatDate(member.last_class_date) : '未上课' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ member.class_count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <el-tag :type="member.status === 'active' ? 'success' : 'danger'">
                  {{ member.status === 'active' ? '活跃' : '非活跃' }}
                </el-tag>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <el-button 
                    @click="viewMemberDetails(member)"
                    type="primary" 
                    size="small"
                  >
                    详情
                  </el-button>
                  <el-button 
                    @click="viewMemberHistory(member)"
                    type="default" 
                    size="small"
                  >
                    历史
                  </el-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 学员详情模态框 -->
    <el-dialog
      v-model="showMemberDetailsModal"
      title="学员详情"
      width="700px"
    >
      <div v-if="selectedMember" class="space-y-6">
        <!-- 基本信息 -->
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-2xl font-medium text-gray-600">{{ selectedMember.name.charAt(0) }}</span>
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ selectedMember.name }}</h3>
            <p class="text-gray-500">{{ selectedMember.phone }} • {{ selectedMember.email }}</p>
            <div class="flex items-center space-x-2 mt-1">
              <el-tag :type="selectedMember.membership_type === 'VIP' ? 'warning' : 'default'">
                {{ selectedMember.membership_type }}
              </el-tag>
              <el-tag :type="selectedMember.status === 'active' ? 'success' : 'danger'">
                {{ selectedMember.status === 'active' ? '活跃' : '非活跃' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-3">基本信息</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">加入时间:</span>
                <span class="text-gray-900">{{ formatDate(selectedMember.join_date) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">最后上课:</span>
                <span class="text-gray-900">{{ selectedMember.last_class_date ? formatDate(selectedMember.last_class_date) : '未上课' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">总上课次数:</span>
                <span class="text-gray-900">{{ selectedMember.class_count }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">本月上课:</span>
                <span class="text-gray-900">{{ selectedMember.monthly_class_count }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 class="text-lg font-medium text-gray-900 mb-3">课程偏好</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">最常上课类型:</span>
                <span class="text-gray-900">{{ selectedMember.preferred_class_type || '无' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">偏好时间:</span>
                <span class="text-gray-900">{{ selectedMember.preferred_time || '无' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">健身目标:</span>
                <span class="text-gray-900">{{ selectedMember.fitness_goal || '无' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 备注 -->
        <div v-if="selectedMember.notes">
          <h4 class="text-lg font-medium text-gray-900 mb-2">备注</h4>
          <p class="text-gray-700 bg-gray-50 p-3 rounded-lg">{{ selectedMember.notes }}</p>
        </div>
      </div>
    </el-dialog>

    <!-- 学员历史记录模态框 -->
    <el-dialog
      v-model="showMemberHistoryModal"
      title="学员历史记录"
      width="900px"
    >
      <div v-if="selectedMember" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ selectedMember.name }} - 上课历史</h3>
          <div class="flex items-center space-x-2">
            <el-date-picker
              v-model="historyDateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            />
            <el-button @click="refreshMemberHistory" type="default" size="small">
              <el-icon class="w-4 h-4 mr-1">
                <Refresh />
              </el-icon>
              刷新
            </el-button>
          </div>
        </div>

        <div class="space-y-3">
          <div 
            v-for="record in memberHistoryData" 
            :key="record.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-4">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ record.class_name }}</h4>
                    <p class="text-sm text-gray-500">{{ record.location }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ record.date }}</div>
                    <div class="text-sm text-gray-500">{{ record.start_time }} - {{ record.end_time }}</div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <el-tag :type="record.attendance_status === 'present' ? 'success' : 'danger'">
                  {{ record.attendance_status === 'present' ? '已签到' : '未签到' }}
                </el-tag>
                <el-tag :type="record.rating ? 'warning' : 'default'">
                  {{ record.rating ? `${record.rating}星` : '未评价' }}
                </el-tag>
              </div>
            </div>
            <div v-if="record.feedback" class="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
              <strong>反馈:</strong> {{ record.feedback }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCoachService } from '@/composables/useCoachService'
import Swal from 'sweetalert2'

const {
  coachInfo,
  allMembers: allMembersData,
  memberHistory: memberHistoryData,
  getCoachMembers,
  getMemberHistory
} = useCoachService()

// 响应式数据
const memberSearchQuery = ref('')
const memberFilter = ref('all')
const memberSortBy = ref('name')
const historyDateRange = ref([])
const showMemberDetailsModal = ref(false)
const showMemberHistoryModal = ref(false)
const selectedMember = ref(null)
const isLoadingMembers = ref(false)
const retryCount = ref(0)
const maxRetries = 3

// 初始化数据
onMounted(async () => {
  await loadMembersWithRetry()
})

// 带重试机制的学员数据加载
const loadMembersWithRetry = async () => {
  isLoadingMembers.value = true
  
  try {
    if (coachInfo.value && coachInfo.value.id) {
      await getCoachMembers(coachInfo.value.id)
      retryCount.value = 0 // 重置重试计数
    } else {
      console.warn('教练信息未加载，等待教练信息加载完成')
      // 延迟重试
      setTimeout(async () => {
        if (coachInfo.value && coachInfo.value.id) {
          await getCoachMembers(coachInfo.value.id)
          retryCount.value = 0
        } else if (retryCount.value < maxRetries) {
          retryCount.value++
          await loadMembersWithRetry()
        } else {
          throw new Error('教练信息加载超时')
        }
      }, 1000)
    }
  } catch (error) {
    console.error('初始化学员数据失败:', error)
    
    if (retryCount.value < maxRetries) {
      retryCount.value++
      console.log(`重试第 ${retryCount.value} 次`)
      setTimeout(() => {
        loadMembersWithRetry()
      }, 2000)
    } else {
      Swal.fire({
        title: '初始化失败',
        text: '获取学员数据失败，请刷新页面重试',
        icon: 'error',
        confirmButtonText: '确定'
      })
    }
  } finally {
    isLoadingMembers.value = false
  }
}

// 计算属性
const totalMembers = computed(() => allMembersData.value.length)

const activeMembers = computed(() => 
  allMembersData.value.filter(member => member.status === 'active').length
)

const newMembers = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return allMembersData.value.filter(member => 
    new Date(member.join_date) >= thirtyDaysAgo
  ).length
})

const vipMembers = computed(() => 
  allMembersData.value.filter(member => member.membership_type === 'VIP').length
)

const filteredMembers = computed(() => {
  let filtered = allMembersData.value

  // 搜索过滤
  if (memberSearchQuery.value) {
    const query = memberSearchQuery.value.toLowerCase()
    filtered = filtered.filter(member => 
      member.name.toLowerCase().includes(query) ||
      member.phone.includes(query)
    )
  }

  // 类型过滤
  if (memberFilter.value !== 'all') {
    if (memberFilter.value === 'vip') {
      filtered = filtered.filter(member => member.membership_type === 'VIP')
    } else if (memberFilter.value === 'normal') {
      filtered = filtered.filter(member => member.membership_type === '普通')
    } else if (memberFilter.value === 'new') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      filtered = filtered.filter(member => 
        new Date(member.join_date) >= thirtyDaysAgo
      )
    }
  }

  // 排序
  if (memberSortBy.value === 'name') {
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (memberSortBy.value === 'joinDate') {
    filtered = filtered.sort((a, b) => new Date(b.join_date) - new Date(a.join_date))
  } else if (memberSortBy.value === 'lastClass') {
    filtered = filtered.sort((a, b) => {
      if (!a.last_class_date && !b.last_class_date) return 0
      if (!a.last_class_date) return 1
      if (!b.last_class_date) return -1
      return new Date(b.last_class_date) - new Date(a.last_class_date)
    })
  }

  return filtered
})

// 工具函数
const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

// 事件处理函数
const refreshMembers = async () => {
  retryCount.value = 0 // 重置重试计数
  await loadMembersWithRetry()
}

const viewMemberDetails = (member) => {
  selectedMember.value = member
  showMemberDetailsModal.value = true
}

const viewMemberHistory = async (member) => {
  try {
    selectedMember.value = member
    await getMemberHistory(member.id)
    showMemberHistoryModal.value = true
  } catch (error) {
    console.error('获取学员历史记录失败:', error)
    Swal.fire({
      title: '错误',
      text: '获取学员历史记录失败，请重试',
      icon: 'error'
    })
  }
}

const refreshMemberHistory = async () => {
  if (selectedMember.value) {
    try {
      await getMemberHistory(selectedMember.value.id, historyDateRange.value)
      Swal.fire({
        title: '刷新成功',
        text: '历史记录已更新',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('刷新历史记录失败:', error)
      Swal.fire({
        title: '刷新失败',
        text: '刷新历史记录失败，请重试',
        icon: 'error'
      })
    }
  }
}
</script>
