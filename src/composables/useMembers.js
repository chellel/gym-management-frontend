import { ref, reactive, onMounted } from 'vue'
import { memberService, mockMembers } from '../services/memberService'
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
    status: 'all' // all, active, expired
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
    } catch (err) {
      console.error('Failed to fetch members:', err)
      // 如果Supabase不可用，使用模拟数据
      members.value = mockMembers.filter(member => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return (
            member.name.toLowerCase().includes(searchLower) ||
            member.member_id.toLowerCase().includes(searchLower) ||
            member.phone.includes(filters.search)
          )
        }
        return true
      }).filter(member => {
        if (filters.status === 'active') {
          return new Date(member.expire_date) >= new Date()
        } else if (filters.status === 'expired') {
          return new Date(member.expire_date) < new Date()
        }
        return true
      })
      pagination.total = members.value.length
      error.value = '使用模拟数据'
    } finally {
      loading.value = false
    }
  }

  // 获取统计信息
  const fetchStats = async () => {
    try {
      const memberStats = await memberService.getMemberStats()
      Object.assign(stats, memberStats)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      // 使用模拟数据计算统计
      const total = mockMembers.length
      const active = mockMembers.filter(m => new Date(m.expire_date) >= new Date()).length
      Object.assign(stats, {
        totalMembers: total,
        activeMembers: active,
        expiredMembers: total - active,
        newMembers: 12
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
      console.error('Failed to add member:', err)
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
      console.error('Failed to update member:', err)
      await Swal.fire({
        title: '错误',
        text: '更新会员信息失败，请重试',
        icon: 'error'
      })
    }
  }

  // 删除会员
  const deleteMember = async (id, memberName) => {
    const result = await Swal.fire({
      title: '确认删除',
      text: `确定要删除会员"${memberName}"吗？此操作不可恢复！`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        await memberService.deleteMember(id)
        await Swal.fire({
          title: '已删除',
          text: '会员删除成功！',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await fetchMembers()
        await fetchStats()
      } catch (err) {
        console.error('Failed to delete member:', err)
        await Swal.fire({
          title: '错误',
          text: '删除会员失败，请重试',
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
  const getMemberStatus = (expireDate) => {
    if (!expireDate) return 'unknown'
    const now = new Date()
    const expire = new Date(expireDate)
    
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
    deleteMember,
    searchMembers,
    filterByStatus,
    goToPage,
    formatDate,
    getMemberStatus,
    getStatusText,
    getStatusClass
  }
}
