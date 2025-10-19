import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useUserinfoStore } from "@/stores/userinfo";

// 管理员认证服务
const adminAuthService = {
  // 管理员登录
  async login(email, password) {
    // 模拟管理员验证 - 从admin表查询
    if (email === "admin" && password === "123456") {
      const admin = {
        id: 1,
        email: "admin",
        name: "系统管理员",
        role: "admin",
        avatar: null,
        login_time: new Date().toISOString(),
      };
      return { user: admin, success: true };
    } else {
      return { user: null, success: false, message: "管理员账号或密码错误" };
    }
  },
};

export const useAdminAuth = () => {
  const router = useRouter();
  const userinfoStore = useUserinfoStore();

  const loading = ref(false);

  const login = async (params) => {
    loading.value = true;

    try {
      const res = await adminAuthService.login(
        params.username,
        params.password
      );
      if (res.user) {
        userinfoStore.setUserinfo(res.user);
      }
      return res;
    } catch (err) {
      return Promise.reject(err);
    } 
  };

  // 登出
  const logout = async () => {
    const result = await Swal.fire({
      title: "确认退出",
      text: "确定要退出管理后台吗？",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "退出",
      cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
      try {
        // 使用store清除用户信息
        userinfoStore.clearUserinfo();

        await Swal.fire({
          title: "已退出",
          text: "您已成功退出管理后台",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        await router.push("/admin/login");
      } catch (err) {
        await Swal.fire({
          title: "错误",
          text: "退出登录失败，请重试",
          icon: "error",
        });
      }
    }
  };

  return {
    // 从store获取的状态
    user: computed(() => userinfoStore.userinfo),
    isAuthenticated: computed(() => userinfoStore.isAuthenticated),
    getUserRole: () => userinfoStore.userRole,
    isAdmin: computed(() => userinfoStore.isAdmin),
    loading,
    login,
    logout,
  };
};
