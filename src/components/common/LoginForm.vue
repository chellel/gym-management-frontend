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
        <slot name="bottom">
         
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useAdminAuth } from '@/composables/useAdminAuth'

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
  authType: {
    type: String,
    default: 'member', // 'member' 或 'admin'
    validator: (value) => ['member', 'admin'].includes(value)
  },
  testAccounts: {
    type: Array,
    default: () => {
      return [
        { role: 'coach', label: '教练', username: 'coach', password: 'coach' },
        { role: 'member', label: '会员', username: 'member', password: 'member' }
      ]
    }
  }
})

const emit = defineEmits(['login'])

// 使用认证服务
const memberAuth = useAuth()
const adminAuth = useAdminAuth()

// 根据authType选择认证服务
const currentAuth = props.authType === 'admin' ? adminAuth : memberAuth

// 表单数据
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  emit('login', form)

}
</script>
