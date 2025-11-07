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
import dayjs from "dayjs";
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
  // 使用 dayjs 获取周的开始日期（周日）
  const startOfWeek = dayjs(currentWeek.value).startOf('week');

  for (let i = 0; i < 7; i++) {
    const day = startOfWeek.add(i, 'day');
    days.push({
      name: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][i],
      date: day.format('YYYY-MM-DD'),
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
    // 使用 dayjs 获取周的开始和结束日期
    const startOfWeek = dayjs(currentWeek.value).startOf('week');
    const endOfWeek = startOfWeek.add(6, 'day');

    const params = {
      startDate: startOfWeek.format('YYYY-MM-DD'),
      endDate: endOfWeek.format('YYYY-MM-DD'),
      page: 1,
      pageSize: 10000,
      isDeleted: 0,
    };

    const response = await getScheduleList({
      ...params,
    });
    schedules.value = response.rows || [];
  } catch (error) {
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

const previousWeek = () => {
  currentWeek.value = dayjs(currentWeek.value).subtract(7, 'day').toDate();
  getData(); // 重新加载排班数据
};

const nextWeek = () => {
  currentWeek.value = dayjs(currentWeek.value).add(7, 'day').toDate();
  getData(); // 重新加载排班数据
};

const goToCurrentWeek = () => {
  currentWeek.value = dayjs().toDate();
  getData(); // 重新加载排班数据
};

// 格式化周范围
const formatWeekRange = (date) => {
  const startOfWeek = dayjs(date).startOf('week');
  const endOfWeek = startOfWeek.add(6, 'day');

  return `${startOfWeek.format('MM/DD')} - ${endOfWeek.format('MM/DD')}`;
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
