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
            <p><span class="font-medium">管理员：</span>admin / 123456</p>
          </div>
        </div>
      </div>
    </template>
  </LoginForm>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import LoginForm from "@/components/common/LoginForm.vue";
import { useAdminAuth } from "@/composables/useAdminAuth";
import Swal from "sweetalert2";
const router = useRouter();
const { login } = useAdminAuth();

const handleLogin = async (loginForm) => {
  try {
    const params = {
      username: loginForm.username,
      password: loginForm.password,
    };
    const res = await login(params);
    if(res.code !== 0){
      Swal.fire({
        text: res.msg,
        icon: "error",
      });
      return;
    }
    router.push("/admin");
  } catch (error) {
    console.error("Login error:", error);
  }
};
</script>
