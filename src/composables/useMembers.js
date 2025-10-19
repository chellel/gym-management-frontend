import { ref, reactive, onMounted } from 'vue'
import { memberService } from '@/services/memberService'
import Swal from 'sweetalert2'

export const useMembers = () => {
  const members = ref([])
  const loading = ref(false)
  const error = ref(null)
  const stats = reactive({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    newMembers: 0
  })
  
  const pagination = reactive({
    start: 0,
    end: 9,
    total: 0,
    pageSize: 10,
    currentPage: 1
  })

  const filters = reactive({
    search: '',
    status: 'all'
  })

  // 获取会员列表
  const fetchMembers = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, count } = await memberService.getMembers(
        pagination.start,
        pagination.end,
        filters.search,
        filters.status
      )
      
      members.value = data || []
      pagination.total = count || 0
      
      // 如果数据为空且没有错误，显示提示信息
      if (members.value.length === 0 && !filters.search && filters.status === 'all') {
        error.value = '暂无会员数据'
      }
    } catch (err) {
      members.value = []
      pagination.total = 0
      error.value = err.message || '获取会员数据失败，请检查网络连接'
    } finally {
      loading.value = false
    }
  }

  const resetList = () => {
    pagination.total = 0
    pagination.currentPage = 1
    pagination.start = 0
    pagination.end = pagination.pageSize - 1
    fetchMembers()
  }

  // 获取统计信息
  const fetchStats = async () => {
    try {
      const memberStats = await memberService.getMemberStats()
      Object.assign(stats, memberStats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      // 重置统计信息
      Object.assign(stats, {
        totalMembers: 0,
        activeMembers: 0,
        expiredMembers: 0,
        newMembers: 0
      })
    }
  }

  // 添加会员
  const addMember = async (memberData) => {
    try {
      await memberService.addMember(memberData)
      await Swal.fire({
        title: '成功',
        text: '会员添加成功！',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await fetchMembers()
      await fetchStats()
    } catch (err) {
      await Swal.fire({
        title: '错误',
        text: '添加会员失败，请重试',
        icon: 'error'
      })
    }
  }

  // 更新会员
  const updateMember = async (id, memberData) => {
    try {
      await memberService.updateMember(id, memberData)
      await Swal.fire({
        title: '成功',
        text: '会员信息更新成功！',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      await fetchMembers()
    } catch (err) {
      await Swal.fire({
        title: '错误',
        text: '更新会员信息失败，请重试',
        icon: 'error'
      })
    }
  }

  // 禁用会员
  const stopMember = async (id, memberName) => {
    const result = await Swal.fire({
      title: '确认禁用',
      text: `确定要禁用会员"${memberName}"吗？禁用后会员将无法使用健身房服务！`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '禁用',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        await memberService.updateMember(id, { status: 'inactive' })
        await Swal.fire({
          title: '已禁用',
          text: '会员禁用成功！',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await fetchMembers()
        await fetchStats()
      } catch (err) {
        await Swal.fire({
          title: '错误',
          text: '禁用会员失败，请重试',
          icon: 'error'
        })
      }
    }
  }

  // 搜索会员
  const searchMembers = (searchTerm) => {
    filters.search = searchTerm
    pagination.currentPage = 1
    pagination.start = 0
    pagination.end = pagination.pageSize - 1
    fetchMembers()
  }

  // 筛选会员状态
  const filterByStatus = (status) => {
    filters.status = status
    pagination.currentPage = 1
    pagination.start = 0
    pagination.end = pagination.pageSize - 1
    fetchMembers()
  }

  // 分页
  const goToPage = (page) => {
    pagination.currentPage = page
    pagination.start = (page - 1) * pagination.pageSize
    pagination.end = pagination.start + pagination.pageSize - 1
    fetchMembers()
  }

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  // 检查会员状态
  const getMemberStatus = (member) => {
    // 优先使用API返回的状态
    if (member.userStatus) {
      return member.userStatus
    }
    
    // 如果有剩余天数信息，使用剩余天数判断
    if (member.remainingDays !== undefined) {
      if (member.remainingDays > 30) {
        return 'active'
      } else if (member.remainingDays > 0) {
        return 'expiring'
      } else {
        return 'expired'
      }
    }
    
    // 回退到使用到期日期计算
    if (!member.membershipExpireDate) return 'unknown'
    const now = new Date()
    const expire = new Date(member.membershipExpireDate)
    
    if (expire >= now) {
      // 检查是否即将过期（30天内）
      const daysUntilExpire = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
      if (daysUntilExpire <= 30) {
        return 'expiring'
      }
      return 'active'
    }
    return 'expired'
  }

  // 获取状态显示文本
  const getStatusText = (status) => {
    const statusMap = {
      active: '正常',
      expired: '已过期',
      expiring: '即将过期',
      leave: '请假中',
      inactive: '停用',
      unknown: '未知'
    }
    return statusMap[status] || '未知'
  }

  // 获取状态样式
  const getStatusClass = (status) => {
    const classMap = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      expiring: 'bg-yellow-100 text-yellow-800',
      leave: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800',
      unknown: 'bg-gray-100 text-gray-800'
    }
    return classMap[status] || 'bg-gray-100 text-gray-800'
  }

  // 初始化加载
  onMounted(() => {
    fetchMembers()
    fetchStats()
  })

  return {
    members,
    loading,
    error,
    stats,
    pagination,
    filters,
    fetchMembers,
    fetchStats,
    addMember,
    updateMember,
    stopMember,
    searchMembers,
    filterByStatus,
    goToPage,
    formatDate,
    getMemberStatus,
    getStatusText,
    getStatusClass
  }
}
