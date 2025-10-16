<template>
  <LoginForm
    title="管理后台登录"
    subtitle="管理员专用登录入口"
    back-to="/"
    back-text="返回前台"
    :show-register-link="false"
    @login="handleLogin"
  >
    <template #bottom>
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-blue-400 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          ></svg>
          <div class="text-blue-700 text-sm">
            <p class="font-medium mb-1">测试账号</p>
            <p><span class="font-medium">管理员：</span>admin / admin</p>
          </div>
        </div>
      </div>
    </template>
  </LoginForm>
</template>

<script setup>
import { useRouter } from "vue-router";
import LoginForm from "@/components/common/LoginForm.vue";
import { useAdminAuth } from "@/composables/useAdminAuth";
const router = useRouter();
const { login } = useAdminAuth();
// 登录成功处理
const handleLogin = async (loginForm) => {
  const params = {
    username: loginForm.username,
    password: loginForm.password,
  };
  try {
    await login(params);
    router.push("/admin");
  } catch (error) {
    console.error("Admin login error:", error);
  }
};
</script>
