import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useUserinfoStore } from '@/stores/userinfo'

// 管理员认证服务
const adminAuthService = {
  // 管理员登录
  async login(email, password) {
    // 模拟管理员验证 - 从admin表查询
    if (email === 'admin' && password === 'admin') {
      const admin = { 
        id: 1, 
        email: 'admin', 
        name: '系统管理员',
        role: 'admin',
        permissions: ['user_management', 'system_config', 'data_export'],
        avatar: null,
        login_time: new Date().toISOString()
      }
      return { user: admin, error: null }
    }
    else {
      return { user: null, error: '管理员账号或密码错误' }
    }
  }
}

export const useAdminAuth = () => {
  const router = useRouter()
  const userinfoStore = useUserinfoStore()
  
  const loading = ref(false)
  const error = ref('')

  const loginForm = reactive({
    username: '',
    password: ''
  })

  // 管理员登录
  const login = async () => {
    if (!loginForm.username || !loginForm.password) {
      error.value = '请填写用户名和密码'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const { user: loggedInUser, error: loginError } = await adminAuthService.login(
        loginForm.username,
        loginForm.password
      )

      if (loginError) {
        error.value = loginError
      } else {
        // 使用store设置用户信息
        userinfoStore.setUserinfo(loggedInUser)
        
        await Swal.fire({
          title: '登录成功',
          text: `欢迎回来，${loggedInUser.name}！`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        // 管理员登录成功后跳转到管理后台
        await router.push('/admin')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      error.value = '登录失败，请重试'
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    const result = await Swal.fire({
      title: '确认退出',
      text: '确定要退出管理后台吗？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        // 使用store清除用户信息
        userinfoStore.clearUserinfo()
        
        await Swal.fire({
          title: '已退出',
          text: '您已成功退出管理后台',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await router.push('/admin/login')
      } catch (err) {
        console.error('Admin logout error:', err)
        await Swal.fire({
          title: '错误',
          text: '退出登录失败，请重试',
          icon: 'error'
        })
      }
    }
  }

  // 清除错误信息
  const clearError = () => {
    error.value = ''
  }

  // 重置登录表单
  const resetForm = () => {
    loginForm.username = ''
    loginForm.password = ''
    error.value = ''
  }

  return {
    // 从store获取的状态
    user: computed(() => userinfoStore.userinfo),
    isAuthenticated: computed(() => userinfoStore.isAuthenticated),
    getUserRole: () => userinfoStore.userRole,
    isAdmin: () => userinfoStore.isAdmin,
    
    // 管理员权限相关
    hasPermission: (permission) => userinfoStore.checkPermission(permission),
    hasAnyPermission: (permissions) => userinfoStore.checkAnyPermission(permissions),
    
    // 本地状态和方法
    loading,
    error,
    loginForm,
    login,
    logout,
    clearError,
    resetForm,
    
    // 便捷方法
    getCurrentUser: () => userinfoStore.userinfo
  }
}
