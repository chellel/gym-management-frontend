<template>
    <div
      class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <!-- 返回首页链接 -->
        <div class="text-center">
          <router-link
            to="/"
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
            返回首页
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
            <h2 class="text-3xl font-bold text-gray-900">系统登录</h2>
            <p class="text-gray-600 mt-2">请输入您的登录信息</p>
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
  
          <!-- 提示信息 -->
          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
                <p>用户名：admin</p>
                <p>密码：admin</p>
              </div>
            </div>
          </div>
  
          <!-- 注册链接 -->
          <div class="mt-6 text-center">
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
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuth } from "@/composables/useAuth";
  
  export default {
    name: "Login",
    setup() {
      const router = useRouter();
      const { loginForm, loading, error, login } = useAuth();
  
      const handleLogin = async () => {
        await login();
      };
  
      return {
        form: loginForm,
        loading,
        error,
        handleLogin,
      };
    },
  };
  </script>
  