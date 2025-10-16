<template>
  <LoginForm
    title="管理后台登录"
    subtitle="管理员专用登录入口"
    back-to="/"
    back-text="返回前台"
    :show-register-link="false"
    @login-success="handleLoginSuccess"
    @login-error="handleLoginError"
  >
    <template #test-accounts>
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-red-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="text-red-700 text-sm">
            <p class="font-medium mb-1">管理员测试账号</p>
            <p><span class="font-medium">管理员：</span>admin / admin</p>
          </div>
        </div>
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
  // 登录成功后跳转到管理后台首页
  router.push('/admin')
}

// 登录错误处理
const handleLoginError = (error) => {
  console.error('Admin login error:', error)
}
</script>
