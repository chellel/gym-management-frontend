<template>
  <LoginForm
    title="系统登录"
    subtitle="请输入您的登录信息"
    back-to="/"
    back-text="返回首页"
    @login-success="handleLoginSuccess"
    @login-error="handleLoginError"
  >
    <template #test-accounts>
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-blue-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-blue-700 text-sm">
            <p class="font-medium mb-1">测试账号</p>
            <p><span class="font-medium">管理员：</span>admin / admin</p>
            <p><span class="font-medium">教练：</span>coach / coach</p>
            <p><span class="font-medium">会员：</span>member / member</p>
          </div>
        </div>
      </div>
    </template>

    <template #register-link>
      <div class="text-center">
        <p class="text-sm text-gray-600">
          还没有账号？
          <router-link
            to="/register"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            立即注册会员
          </router-link>
        </p>
      </div>
    </template>
  </LoginForm>
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '@/components/common/LoginForm.vue'

const router = useRouter()

// 登录成功处理
const handleLoginSuccess = () => {
  // 登录成功后的跳转逻辑已经在 useAuth 中处理
  console.log('Login successful')
}

// 登录错误处理
const handleLoginError = (error) => {
  console.error('Login error:', error)
}
</script>
  