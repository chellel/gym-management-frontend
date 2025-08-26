import { createClient } from '@supabase/supabase-js'

// 使用环境变量配置Supabase连接
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-ref.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 简单的认证状态管理
export const authService = {
  // 模拟登录（在实际项目中应该使用真正的Supabase认证）
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
