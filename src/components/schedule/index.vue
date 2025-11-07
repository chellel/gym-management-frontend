<template>
  <div class="space-y-6">
    <!-- 视图切换和日期选择 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
      >
        <div class="flex items-center space-x-4">
          <!-- 视图切换 -->
          <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <el-button
              v-for="view in views"
              :key="view.key"
              @click="currentView = view.key"
              :type="currentView === view.key ? 'primary' : 'default'"
              class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            >
              {{ view.name }}
            </el-button>
          </div>

          <!-- 日期选择 -->
          <div class="flex items-center space-x-4">
            <el-button
              @click="previousWeek"
              type="text"
              class="p-2 text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-5 w-5">
                <ArrowLeft />
              </el-icon>
            </el-button>
            <div class="text-lg font-medium text-gray-900">
              {{ formatWeekRange(currentWeek) }}
            </div>
            <el-button
              @click="nextWeek"
              type="text"
              class="p-2 text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-5 w-5">
                <ArrowRight />
              </el-icon>
            </el-button>
            <el-button @click="goToCurrentWeek" type="default" size="small">
              本周
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 教练排班视图 -->
    <CoachSchedule
      v-if="currentView === 'coachs'"
      :coachs="coachs"
      :schedules="schedules"
      :week-days="weekDays"
      :can-delete-schedule="canDeleteSchedule"
      @schedule-added="handleScheduleAdded"
      @schedule-updated="handleScheduleUpdated"
      @schedule-deleted="handleScheduleDeleted"
    />

    <!-- 课程管理视图 -->
    <CourseManagement v-if="currentView === 'courses'" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "@/composables/useAuth";
import { useAdminAuth } from "@/composables/useAdminAuth";
import CoachSchedule from "./CoachSchedule.vue";
import CourseManagement from "./CourseManagement.vue";
import { getScheduleList } from "@/api/schedule";
import { getCoachList } from "@/api/coach";
// 认证相关
const { isCoach, currentUser } = useAuth();
const { isAdmin } = useAdminAuth();

// 响应式数据
const currentView = ref("coachs");
const currentWeek = ref(new Date());
const schedules = ref([]);
const coachs = ref([]);
const locations = ref([]);

// 权限控制计算属性
const canEditSchedule = computed(() => {
  return (schedule) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      return schedule.coachId === currentUser.value?.id;
    }
    return false;
  };
});

const canDeleteSchedule = computed(() => {
  return (schedule) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      return schedule.coachId === currentUser.value?.id;
    }
    return false;
  };
});

// 视图选项
const views = [
  { key: "courses", name: "课程管理" },
  { key: "coachs", name: "教练排班" },
  // { key: "locations", name: "场地预约" },
];

// 时间段
const timeSlots = [
  "06:00-08:00",
  "08:00-10:00",
  "10:00-12:00",
  "12:00-14:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "20:00-22:00",
];

// 计算属性
const weekDays = computed(() => {
  const days = [];
  const startOfWeek = new Date(currentWeek.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push({
      name: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][i],
      date: day.toISOString().split("T")[0],
    });
  }

  return days;
});

// 初始化
onMounted(() => {
  initializeData();
});

// 初始化数据
const initializeData = async () => {
  try {
    await Promise.all([getData(), getCoachData(), loadLocations()]);
  } catch (error) {
    console.error("Failed to initialize data:", error);
    Swal.fire({
      title: "初始化失败",
      text: "加载数据失败，请刷新页面重试",
      icon: "error",
    });
  }
};

// 加载排班数据
const getData = async () => {
  try {
    const startOfWeek = new Date(currentWeek.value);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const params = {
      startDate: startOfWeek.toISOString().split("T")[0],
      endDate: endOfWeek.toISOString().split("T")[0],
      page: 1,
      pageSize: 10000,
      isDeleted: 0,
    };

    const response = await getScheduleList({
      ...params,
    });
    schedules.value = response.rows || [];
  } catch (error) {
    console.error("Failed to load schedules:", error);
    // 如果API失败，使用模拟数据作为后备
    loadMockSchedules();
  }
};

// 加载教练数据
const getCoachData = async () => {
  const response = await getCoachList({
    page: 1,
    pageSize: 10000,
    status: "active",
  });
  coachs.value = response.rows || [];
};

// 加载场地数据
const loadLocations = async () => {
  // TODO: 实现场地API调用
  // 暂时使用模拟数据
  locations.value = [
    { id: 1, name: "瑜伽室A" },
    { id: 2, name: "瑜伽室B" },
    { id: 3, name: "单车房" },
    { id: 4, name: "器械区" },
    { id: 5, name: "有氧区" },
    { id: 6, name: "高温瑜伽室" },
    { id: 7, name: "拳击台" },
    { id: 8, name: "舞蹈室" },
    { id: 9, name: "游泳池" },
    { id: 10, name: "多功能训练区" },
    { id: 11, name: "泰拳训练区" },
    { id: 12, name: "冥想室" },
    { id: 13, name: "CrossFit训练区" },
    { id: 14, name: "太极练习区" },
    { id: 15, name: "户外跑道" },
  ];
};

// 加载模拟排班数据（作为后备）
const loadMockSchedules = () => {
  // 模拟排班数据 - 本周的排班安排
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  schedules.value = [
    // 周一
    {
      id: 1,
      courseId: 1,
      coachId: 1,
      coachName: "李教练",
      courseName: "瑜伽基础",
      startTime: new Date(weekStart.getTime() + 7 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      endTime: new Date(weekStart.getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      location: "瑜伽室A",
      maxCapacity: 20,
      status: "waiting",
      remark: "适合初学者",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 2,
      courseId: 2,
      coachId: 2,
      coachName: "王教练",
      courseName: "动感单车",
      startTime: new Date(weekStart.getTime() + 19 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      endTime: new Date(weekStart.getTime() + 20 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      location: "单车房",
      maxCapacity: 25,
      status: "waiting",
      remark: "高强度训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周二
    {
      id: 3,
      courseId: 3,
      coachId: 3,
      coachName: "张教练",
      courseName: "力量训练",
      startTime: new Date(
        weekStart.getTime() + 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 24 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "器械区",
      maxCapacity: 15,
      status: "waiting",
      remark: "专业指导",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 4,
      courseId: 4,
      coachId: 4,
      coachName: "陈教练",
      courseName: "普拉提",
      startTime: new Date(
        weekStart.getTime() + 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 24 * 60 * 60 * 1000 + 21 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "瑜伽室B",
      maxCapacity: 20,
      status: "waiting",
      remark: "核心训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周三
    {
      id: 5,
      courseId: 5,
      coachId: 5,
      coachName: "刘教练",
      courseName: "跑步训练",
      startTime: new Date(
        weekStart.getTime() + 48 * 60 * 60 * 1000 + 6.5 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 48 * 60 * 60 * 1000 + 7.5 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "户外跑道",
      maxCapacity: 30,
      status: "waiting",
      remark: "户外运动",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 6,
      courseId: 6,
      coachId: 6,
      coachName: "赵教练",
      courseName: "拳击训练",
      startTime: new Date(
        weekStart.getTime() + 48 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 48 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "拳击台",
      maxCapacity: 12,
      status: "waiting",
      remark: "拳击基础训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周四
    {
      id: 7,
      courseId: 7,
      coachId: 7,
      coachName: "孙教练",
      courseName: "Zumba舞蹈",
      startTime: new Date(
        weekStart.getTime() + 72 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 72 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "舞蹈室",
      maxCapacity: 25,
      status: "waiting",
      remark: "Zumba舞蹈",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 8,
      courseId: 8,
      coachId: 8,
      coachName: "周教练",
      courseName: "游泳训练",
      startTime: new Date(
        weekStart.getTime() + 72 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 72 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "游泳池",
      maxCapacity: 20,
      status: "waiting",
      remark: "游泳技巧指导",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周五
    {
      id: 9,
      courseId: 9,
      coachId: 9,
      coachName: "吴教练",
      courseName: "太极晨练",
      startTime: new Date(
        weekStart.getTime() + 96 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 96 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "太极练习区",
      maxCapacity: 15,
      status: "waiting",
      remark: "太极晨练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 10,
      courseId: 1,
      coachId: 1,
      coachName: "李教练",
      courseName: "瑜伽基础",
      startTime: new Date(
        weekStart.getTime() + 96 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 96 * 60 * 60 * 1000 + 19 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "瑜伽室A",
      maxCapacity: 20,
      status: "completed",
      remark: "瑜伽放松",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周六
    {
      id: 11,
      courseId: 2,
      coachId: 2,
      coachName: "王教练",
      courseName: "动感单车",
      startTime: new Date(
        weekStart.getTime() + 120 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 120 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "单车房",
      maxCapacity: 25,
      status: "waiting",
      remark: "周末动感单车",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 12,
      courseId: 3,
      coachId: 3,
      coachName: "张教练",
      courseName: "力量训练",
      startTime: new Date(
        weekStart.getTime() + 120 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 120 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "CrossFit训练区",
      maxCapacity: 18,
      status: "waiting",
      remark: "CrossFit训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    // 周日
    {
      id: 13,
      courseId: 4,
      coachId: 4,
      coachName: "陈教练",
      courseName: "普拉提",
      startTime: new Date(
        weekStart.getTime() + 144 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 144 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "瑜伽室B",
      maxCapacity: 20,
      status: "waiting",
      remark: "普拉提训练",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
    {
      id: 14,
      courseId: 5,
      coachId: 5,
      coachName: "刘教练",
      courseName: "跑步训练",
      startTime: new Date(
        weekStart.getTime() + 144 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      endTime: new Date(
        weekStart.getTime() + 144 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 16),
      location: "有氧区",
      maxCapacity: 30,
      status: "cancelled",
      remark: "有氧运动（已取消）",
      createBy: "admin",
      createTime: "2025-10-19 15:55:57",
      updateBy: "admin",
      updateTime: "2025-10-19 15:55:57",
      isDeleted: 0,
      deleteTime: null,
    },
  ];
};

// 周导航
const previousWeek = () => {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() - 7);
  currentWeek.value = newWeek;
  getData(); // 重新加载排班数据
};

const nextWeek = () => {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() + 7);
  currentWeek.value = newWeek;
  getData(); // 重新加载排班数据
};

const goToCurrentWeek = () => {
  currentWeek.value = new Date();
  getData(); // 重新加载排班数据
};

// 格式化周范围
const formatWeekRange = (date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const formatDate = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return date.toLocaleDateString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

// 处理排班添加事件
const handleScheduleAdded = () => {
  getData(); // 重新加载排班数据
};

// 处理排班更新事件
const handleScheduleUpdated = () => {
  getData(); // 重新加载排班数据
};

// 处理排班删除事件
const handleScheduleDeleted = () => {
  getData(); // 重新加载排班数据
};

// 初始化数据
onMounted(() => {
  getData();
  getCoachData();
  loadLocations();
});
</script>
