<template>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <router-link to="/" class="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </router-link>
        </div>
  
        <!-- 注册卡片 -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-900">会员注册</h2>
            <p class="text-gray-600 mt-2">快速注册，开启您的健身之旅</p>
          </div>
  
          <!-- 注册表单 -->
          <el-form 
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            :label-width="80"
            @submit.prevent="handleRegister" 
            class="space-y-6"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
  
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="registerForm.phone"
                placeholder="请输入手机号"
                clearable
                maxlength="11"
              />
            </el-form-item>
  
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
              />
            </el-form-item>
  
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                clearable
              />
            </el-form-item>
  
            <!-- 协议确认 -->
            <el-form-item prop="agreement">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意
                <el-link type="primary" @click="showAgreement = true">《会员协议》</el-link>
                和
                <el-link type="primary" @click="showPrivacy = true">《隐私政策》</el-link>
              </el-checkbox>
            </el-form-item>
  
            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="w-full"
              size="large"
            >
              {{ loading ? '注册中...' : '注册会员' }}
            </el-button>
          </el-form>
  
          <!-- 登录链接 -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              已有账号？
              <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
                立即登录
              </router-link>
            </p>
          </div>
        </div>
      </div>
  
      <!-- 会员协议弹窗 -->
      <el-dialog
        v-model="showAgreement"
        title="会员协议"
        width="80%"
        :before-close="() => showAgreement = false"
      >
        <div class="max-h-96 overflow-y-auto">
          <h4 class="font-semibold mb-2">1. 会员权利</h4>
          <p class="mb-4 text-sm text-gray-600">
            会员享有使用健身房设施的权利，包括器械使用、课程参与等。会员应遵守健身房的相关规定。
          </p>
          
          <h4 class="font-semibold mb-2">2. 会员义务</h4>
          <p class="mb-4 text-sm text-gray-600">
            会员应按时缴纳会费，遵守健身房规章制度，爱护设施设备，保持环境卫生。
          </p>
          
          <h4 class="font-semibold mb-2">3. 安全责任</h4>
          <p class="mb-4 text-sm text-gray-600">
            会员在使用设施时应确保自身安全，如有身体不适应立即停止运动并寻求帮助。
          </p>
          
          <h4 class="font-semibold mb-2">4. 退费政策</h4>
          <p class="mb-4 text-sm text-gray-600">
            会员在特定条件下可申请退费，具体退费政策请咨询前台工作人员。
          </p>
        </div>
      </el-dialog>
  
      <!-- 隐私政策弹窗 -->
      <el-dialog
        v-model="showPrivacy"
        title="隐私政策"
        width="80%"
        :before-close="() => showPrivacy = false"
      >
        <div class="max-h-96 overflow-y-auto">
          <h4 class="font-semibold mb-2">1. 信息收集</h4>
          <p class="mb-4 text-sm text-gray-600">
            我们收集您的个人信息仅用于提供健身服务，包括姓名、联系方式、健康信息等。
          </p>
          
          <h4 class="font-semibold mb-2">2. 信息使用</h4>
          <p class="mb-4 text-sm text-gray-600">
            您的个人信息将用于会员管理、服务提供、健康指导等合法用途。
          </p>
          
          <h4 class="font-semibold mb-2">3. 信息保护</h4>
          <p class="mb-4 text-sm text-gray-600">
            我们采取严格的安全措施保护您的个人信息，不会向第三方泄露。
          </p>
          
          <h4 class="font-semibold mb-2">4. 您的权利</h4>
          <p class="mb-4 text-sm text-gray-600">
            您有权查看、修改、删除您的个人信息，如有疑问请联系我们。
          </p>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { post } from '@/composables/request'
  
  const router = useRouter()
  
  // 表单引用
  const registerFormRef = ref()
  
  // 加载状态
  const loading = ref(false)
  
  // 弹窗状态
  const showAgreement = ref(false)
  const showPrivacy = ref(false)
  
  // 注册表单数据
  const registerForm = reactive({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreement: false
  })
  
  // 表单验证规则
  const registerRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '用户名长度应在2-20个字符之间', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '请确认密码', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== registerForm.password) {
            callback(new Error('两次输入的密码不一致'))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    agreement: [
      { required: true, message: '请同意会员协议和隐私政策', trigger: 'change' }
    ]
  }
  
  // 重置表单
  const resetForm = () => {
    registerFormRef.value?.resetFields()
    Object.assign(registerForm, {
      username: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreement: false
    })
  }
  
  // 处理注册
  const handleRegister = async () => {
    try {
      // 验证表单
      await registerFormRef.value?.validate()
      
      loading.value = true
      
      // 准备注册数据
      const registerData = {
        username: registerForm.username,
        phone: registerForm.phone,
        password: registerForm.password
      }
      
      // 调用注册API
      await post('/auth/register', registerData)
      
      ElMessage.success('注册成功！')
      
      // 显示注册成功信息
      await ElMessageBox.alert(
        `恭喜您注册成功！\n\n用户名：${registerData.username}\n手机号：${registerData.phone}\n\n请使用用户名和密码登录系统，登录后可在会员中心完善个人信息。`,
        '注册成功',
        {
          confirmButtonText: '确定',
          type: 'success'
        }
      )
      
      // 跳转到登录页面
      router.push('/login')
      
    } catch (error) {
      console.error('注册失败:', error)
      ElMessage.error(error.message || '注册失败，请重试')
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  /* 与登录页面保持一致的样式 */
  .el-form-item {
    margin-bottom: 24px;
  }
  
  .el-form-item__label {
    font-weight: 500;
    color: #374151;
  }
  
  .el-input {
    height: 40px;
  }
  
  .el-button {
    height: 40px;
    font-weight: 500;
  }
  
  /* 协议链接样式 */
  .el-checkbox {
    align-items: flex-start;
  }
  
  .el-checkbox__label {
    line-height: 1.5;
  }
  </style>
  