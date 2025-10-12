import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// 简单的认证服务
const authService = {
  // 模拟登录
  async login(email, password) {
    // 简单的admin验证
    if (email === 'admin' && password === 'admin') {
      const user = { id: 1, email: 'admin', name: '管理员' }
      localStorage.setItem('user', JSON.stringify(user))
      return { user, error: null }
    } else {
      return { user: null, error: '用户名或密码错误' }
    }
  },
  
  async logout() {
    localStorage.removeItem('user')
    return { error: null }
  },
  
  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
  
  isAuthenticated() {
    return !!this.getCurrentUser()
  }
}

export const useAuth = () => {
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')

  const loginForm = reactive({
    username: '',
    password: ''
  })

  // 初始化检查用户状态
  onMounted(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
    }
  })

  // 登录
  const login = async () => {
    if (!loginForm.username || !loginForm.password) {
      error.value = '请填写用户名和密码'
      return
    }

    loading.value = true
    error.value = ''

    try {
      const { user: loggedInUser, error: loginError } = await authService.login(
        loginForm.username,
        loginForm.password
      )

      if (loginError) {
        error.value = loginError
      } else {
        user.value = loggedInUser
        await Swal.fire({
          title: '登录成功',
          text: `欢迎回来，${loggedInUser.name}！`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await router.push('/welcome')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = '登录失败，请重试'
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    const result = await Swal.fire({
      title: '确认退出',
      text: '确定要退出登录吗？',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })

    if (result.isConfirmed) {
      try {
        await authService.logout()
        user.value = null
        await Swal.fire({
          title: '已退出',
          text: '您已成功退出登录',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        await router.push('/login')
      } catch (err) {
        console.error('Logout error:', err)
        await Swal.fire({
          title: '错误',
          text: '退出登录失败，请重试',
          icon: 'error'
        })
      }
    }
  }

  // 检查是否已登录
  const isAuthenticated = () => {
    return authService.isAuthenticated()
  }

  // 获取当前用户
  const getCurrentUser = () => {
    return authService.getCurrentUser()
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
    user,
    loading,
    error,
    loginForm,
    login,
    logout,
    isAuthenticated,
    getCurrentUser,
    clearError,
    resetForm
  }
}
