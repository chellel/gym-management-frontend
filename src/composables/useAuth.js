import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useUserinfoStore } from "@/stores/userinfo";

// 会员认证服务（教练和会员都使用member表）
const memberAuthService = {
  // 会员登录（包括教练和普通会员）
  async login(email, password) {
    // 教练验证 - 从member表查询，role为coach
    if (email === "coach" && password === "123456") {
      const user = {
        id: 2,
        email: "coach",
        name: "李教练",
        role: "coach",
        member_type: "coach",
        specialty: "瑜伽/普拉提/冥想",
        phone: "13800138002",
        avatar: null,
        login_time: new Date().toISOString(),
      };
      return { user, message: "", success: true };
    }
    // 会员验证 - 从member表查询，role为member
    else if (email === "member" && password === "123456") {
      const user = {
        id: 3,
        email: "member",
        name: "张三",
        role: "member",
        member_type: "member",
        membership_type: "VIP",
        phone: "13800138003",
        expire_date: "2024-12-31",
        avatar: null,
        login_time: new Date().toISOString(),
      };
      return { user, success: true };
    } else {
      return { user: null, message: "用户名或密码错误", success: false };
    }
  },
};

export const useAuth = () => {
  const router = useRouter();
  const userinfoStore = useUserinfoStore();

  const error = ref("");

  // 登录
  const login = async (params) => {

    try {
      const res = await memberAuthService.login(
        params.username,
        params.password
      );
      if (res.success) {
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
          timer: 2000,
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
    isAuthenticated: computed(() => userinfoStore.isAuthenticated),
    getUserRole: () => userinfoStore.userRole,
    isCoach: computed(() => userinfoStore.isCoach),
    isMember: computed(() => userinfoStore.isMember),

    // 会员相关方法
    getMembershipType: () => userinfoStore.membershipType,
    isVipMember: () => userinfoStore.isVipMember,
    getExpireDate: () => userinfoStore.expireDate,
    isMembershipExpired: () => userinfoStore.isMembershipExpired,

    login,
    logout,

    // 便捷方法
    getCurrentUser: () => userinfoStore.userinfo,
    getMembershipInfo: () => userinfoStore.getMembershipInfo(),
    getCoachInfo: () => userinfoStore.getCoachInfo(),
  };
};
