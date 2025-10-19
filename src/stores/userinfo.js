import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserinfoStore = defineStore('userinfo', () => {
  // 状态
  const userinfo = ref(null)
  const loading = ref(false)
  const error = ref('')

  // 计算属性
  const isAuthenticated = computed(() => !!userinfo.value)
  const isLogin = computed(() => !!userinfo.value)
  const userRole = computed(() => userinfo.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isCoach = computed(() => userRole.value === 'coach')
  const isMember = computed(() => userRole.value === 'member')
  const userName = computed(() => userinfo.value?.name || '')
  const userEmail = computed(() => userinfo.value?.email || '')
  const userAvatar = computed(() => userinfo.value?.avatar || null)

  // 会员相关计算属性
  const membershipType = computed(() => userinfo.value?.membership_type || null)
  const isVipMember = computed(() => membershipType.value === 'VIP')
  const expireDate = computed(() => userinfo.value?.expire_date || null)
  const isMembershipExpired = computed(() => {
    if (!expireDate.value) return false
    return new Date(expireDate.value) < new Date()
  })
  const memberType = computed(() => userinfo.value?.member_type || null)
  const specialty = computed(() => userinfo.value?.specialty || null)
  const phone = computed(() => userinfo.value?.phone || null)

  // Actions
  const setUserinfo = (user) => {
    userinfo.value = user
    if (user) {
      localStorage.setItem('userinfo', JSON.stringify(user))
    } else {
      localStorage.removeItem('userinfo')
    }
  }

  const loadUserinfo = () => {
    try {
      const stored = localStorage.getItem('userinfo')
      if (stored) {
        userinfo.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load userinfo from localStorage:', error)
      localStorage.removeItem('userinfo')
      userinfo.value = null
    }
  }

  const clearUserinfo = () => {
    userinfo.value = null
    localStorage.removeItem('userinfo')
    error.value = ''
  }

  const setLoading = (value) => {
    loading.value = value
  }

  const setError = (message) => {
    error.value = message
  }

  const clearError = () => {
    error.value = ''
  }

 


  // 会员相关方法
  const getMembershipInfo = () => {
    if (!isMember.value) return null
    return {
      type: membershipType.value,
      isVip: isVipMember.value,
      expireDate: expireDate.value,
      isExpired: isMembershipExpired.value
    }
  }

  const getCoachInfo = () => {
    if (!isCoach.value) return null
    return {
      specialty: specialty.value,
      phone: phone.value,
      memberType: memberType.value
    }
  }

  // 初始化时加载用户信息
  loadUserinfo()

  return {
    // 状态
    userinfo,
    loading,
    error,
    isLogin,
    // 计算属性
    isAuthenticated,
    userRole,
    isAdmin,
    isCoach,
    isMember,
    userName,
    userEmail,
    userAvatar,
    
    // 会员相关
    membershipType,
    isVipMember,
    expireDate,
    isMembershipExpired,
    memberType,
    specialty,
    phone,
    
    // Actions
    setUserinfo,
    loadUserinfo,
    clearUserinfo,
    setLoading,
    setError,
    clearError,
    
    getMembershipInfo,
    getCoachInfo
  }
})
