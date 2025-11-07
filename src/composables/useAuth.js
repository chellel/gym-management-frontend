import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useUserinfoStore } from "@/stores/userinfo";
import { gymLogin } from "@/api/user";

export const useAuth = () => {
  const router = useRouter();
  const userinfoStore = useUserinfoStore();

  const loading = ref(false);

  // 登录
  const login = async (data) => {
    loading.value = true;
    const params = {
      username: data.username,
      password: data.password,
    };

    try {
      const res = await gymLogin(params);
      if (res.code === 0) {
        userinfoStore.setUserinfo(res.data);
        return { success: true, user: res.data };
      } else {
        return { success: false, message: res.msg || "登录失败" };
      }
    } catch (err) {
      Swal.fire({
        text: err.msg || err.message || "登录失败，请重试",
        icon: "error",
      });
      return Promise.reject(err);
    } finally {
      loading.value = false;
    }
  };

  // 登出
  const logout = async () => {
    const result = await Swal.fire({
      title: "确认退出",
      text: "确定要退出登录吗？",
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
          text: "您已成功退出登录",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        await router.push("/login");
      } catch (err) {
        console.error("Logout error:", err);
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
    currentUser: computed(() => userinfoStore.userinfo),
    isAuthenticated: computed(() => userinfoStore.isAuthenticated),
    getUserRole: () => userinfoStore.userRole,
    isCoach: computed(() => userinfoStore.isCoach),
    isMember: computed(() => userinfoStore.isMember),

    // 会员相关方法
    getMembershipType: () => userinfoStore.membershipType,
    isVipMember: () => userinfoStore.isVipMember,
    getExpireDate: () => userinfoStore.expireDate,
    isMembershipExpired: () => userinfoStore.isMembershipExpired,

    loading,
    login,
    logout,

    // 便捷方法
    getCurrentUser: () => userinfoStore.userinfo,
    getMembershipInfo: () => userinfoStore.getMembershipInfo(),
    getCoachInfo: () => userinfoStore.getCoachInfo(),
  };
};
