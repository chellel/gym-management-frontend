<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- 返回首页链接 -->
      <div class="text-center">
        <router-link
          :to="backTo"
          class="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ backText }}
        </router-link>
      </div>

      <!-- 登录卡片 -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4"
          >
            <svg
              class="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">{{ title }}</h2>
          <p class="text-gray-600 mt-2">{{ subtitle }}</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          :label-width="80"
          @submit.prevent="handleLogin"
          class="space-y-6"
        >
          <el-form-item label="用户名" required>
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" required>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              clearable
            />
          </el-form-item>

          <!-- 错误信息 -->
          <el-alert
            v-if="error"
            :title="error"
            type="error"
            show-icon
            :closable="false"
          />

          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="w-full"
            size="large"
          >
            {{ loading ? "登录中..." : "登录" }}
          </el-button>
        </el-form>

        <!-- 测试账号信息插槽 -->
        <div v-if="showTestAccounts" class="mt-6">
          <slot name="test-accounts">
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
                  <div v-for="account in testAccounts" :key="account.role" class="mb-1">
                    <p><span class="font-medium">{{ account.label }}：</span>{{ account.username }} / {{ account.password }}</p>
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </div>

        <!-- 注册链接插槽 -->
        <div v-if="showRegisterLink" class="mt-6">
          <slot name="register-link">
            <div class="text-center">
              <p class="text-sm text-gray-600">
                还没有账号？
                <router-link
                  :to="registerPath"
                  class="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {{ registerText }}
                </router-link>
              </p>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '系统登录'
  },
  subtitle: {
    type: String,
    default: '请输入您的登录信息'
  },
  backTo: {
    type: String,
    default: '/'
  },
  backText: {
    type: String,
    default: '返回首页'
  },
  showTestAccounts: {
    type: Boolean,
    default: true
  },
  showRegisterLink: {
    type: Boolean,
    default: true
  },
  registerPath: {
    type: String,
    default: '/register'
  },
  registerText: {
    type: String,
    default: '立即注册会员'
  },
  testAccounts: {
    type: Array,
    default: () => [
      { role: 'admin', label: '管理员', username: 'admin', password: 'admin' },
      { role: 'coach', label: '教练', username: 'coach', password: 'coach' },
      { role: 'member', label: '会员', username: 'member', password: 'member' }
    ]
  }
})

// Emits
const emit = defineEmits(['login-success', 'login-error'])

// 使用认证服务
const { loginForm, loading, error, login } = useAuth()

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 处理登录
const handleLogin = async () => {
  // 同步表单数据到认证服务
  loginForm.username = form.username
  loginForm.password = form.password
  
  try {
    await login()
    emit('login-success')
  } catch (err) {
    emit('login-error', err)
  }
}
</script>
