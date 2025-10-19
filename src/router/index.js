import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layout/index.vue";
import AdminLayout from "@/layout/admin.vue";
import Login from "@/views/Login/index.vue";
import AdminLogin from "@/admin/views/Login/index.vue";
import { useUserinfoStore } from "@/stores/userinfo";

// 认证和角色检查函数
const isAuthenticated = () => {
  const store = useUserinfoStore();
  return store.isAuthenticated;
};

const getUserRole = () => {
  const store = useUserinfoStore();
  return store.userRole;
};

// 根据路径前缀获取所需角色
const getRequiredRoleByPath = (path) => {
  if (path.startsWith("/admin")) {
    return "admin";
  } else if (path.startsWith("/coach")) {
    return "coach";
  } else if (path.startsWith("/member")) {
    return "member";
  }
  return null; // 公共路径不需要特定角色
};

// 检查用户是否有权限访问指定路径
const hasPathPermission = (path, userRole) => {
  return true;
  const requiredRole = getRequiredRoleByPath(path);
  if (!requiredRole) {
    return true; // 公共路径，无需权限检查
  }
  return userRole === requiredRole;
};

// 根据用户角色获取对应的首页路径
const getHomePathByRole = (userRole) => {
  switch (userRole) {
    case "admin":
      return "/admin";
    case "coach":
      return "/coach";
    case "member":
      return "/member";
    default:
      return "/welcome";
  }
};

// 根据用户角色重定向到对应首页
const redirectToHomeByRole = (next, userRole) => {
  const homePath = getHomePathByRole(userRole);
  next(homePath);
};

const routes = [
  {
    path: "/",
    name: "Root",
    redirect: (to) => {
      // 根据用户角色重定向到对应的首页
      const userRole = getUserRole();
      return getHomePathByRole(userRole);
    },
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: () => import("@/views/Welcome/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: AdminLogin,
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Login/Registor.vue"),
  },
  // 前台会员功能
  {
    path: "/member",
    name: "MemberFrontend",
    component: Layout,
    children: [
      {
        path: "",
        name: "MemberCenter",
        component: () => import("@/views/Member/Welcome.vue"),
      },
      {
        path: "center",
        name: "MemberCenterPage",
        component: () => import("@/views/Member/Center.vue"),
      },
      {
        path: "checkin",
        name: "MemberCheckin",
        component: () => import("@/views/Member/Checkin.vue"),
      },
      {
        path: "booking",
        name: "MemberBooking",
        component: () => import("@/views/Member/Booking.vue"),
      },
      {
        path: "courses",
        name: "MemberCourses",
        component: () => import("@/views/Member/Courses.vue"),
      },
    ],
  },
  // 后台管理功能
  {
    path: "/admin",
    name: "admin",
    component: AdminLayout,
    children: [
      {
        path: "",
        name: "AdminHome",
        component: () => import("@/admin/views/Home/index.vue"),
      },
      {
        path: "member",
        name: "MemberManagement",
        component: () => import("@/admin/views/Member/index.vue"),
      },
      {
        path: "coach",
        name: "CoachManagement",
        component: () => import("@/admin/views/Coach/index.vue"),
      },
      {
        path: "schedules",
        name: "ScheduleManagement",
        component: () => import("@/views/ScheduleManagement.vue"),
      },
      {
        path: "reports",
        name: "Reports",
        component: () => import("@/views/Reports.vue"),
      },
      // {
      //   path: "finance",
      //   name: "Finance",
      //   component: () => import("@/admin/views/Finance/index.vue"),
      // },
    ],
  },
  // 教练工作台
  {
    path: "/coach",
    name: "coach",
    component: Layout,
    children: [
      {
        path: "",
        name: "CoachWorkbench",
        component: () => import("@/views/Coach/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const userIsAuthenticated = isAuthenticated.value;
  const userRole = getUserRole();
  const targetRouteName = to.name;
  const targetPath = to.path;

  // 公共路径（登录、注册等）无需权限检查
  const publicRouteNames = ["Login", "Register", "AdminLogin", "Welcome"];
  if (publicRouteNames.includes(targetRouteName)) {
    // 如果已登录用户访问登录页面，重定向到合适的首页
    if (
      (targetRouteName === "Login" || targetRouteName === "AdminLogin") &&
      userIsAuthenticated
    ) {
      redirectToHomeByRole(next, userRole);
      return;
    }
    next();
    return;
  }
  // 检查是否需要认证（非公共路径都需要认证）
  if (!userIsAuthenticated) {
    const role = getRequiredRoleByPath(targetPath);
    if (role === "admin") {
      next("/admin/login");
      return;
    }
    next("/login");
    return;
  }

  // 检查角色权限
  if (!hasPathPermission(targetPath, userRole)) {
    // 根据用户角色重定向到合适的页面
    redirectToHomeByRole(next, userRole);
    return;
  }

  next();
});

export default router;
