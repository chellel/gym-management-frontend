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
        <el-button
          v-if="canAddSchedule"
          @click="openAddScheduleDialog"
          type="primary"
          class="inline-flex items-center"
        >
          <el-icon class="w-5 h-5 mr-2">
            <Plus />
          </el-icon>
          添加排班
        </el-button>
      </div>
    </div>

    <!-- 教练排班视图 -->
    <TrainerSchedule
      v-if="currentView === 'trainers'"
      :trainers="trainers"
      :schedules="schedules"
      :week-days="weekDays"
      :can-delete-schedule="canDeleteSchedule"
      @edit-schedule="editSchedule"
      @delete-schedule="deleteSchedule"
    />

    <!-- 课程管理视图 -->
    <CourseManagement
      v-if="currentView === 'courses'"
    />

    <!-- 场地预约视图 -->
    <LocationSchedule
      v-if="currentView === 'locations'"
      :locations="locations"
      :schedules="schedules"
      :time-slots="timeSlots"
      @edit-schedule="editSchedule"
    />
  </div>

  <!-- 排班表单对话框 -->
  <ScheduleFormDialog
    v-model="showScheduleDialog"
    :is-edit="isEditMode"
    :schedule-data="editingSchedule"
    :courses="courses"
    :trainers="trainers"
    :current-user="currentUser"
    @submit="handleScheduleSubmit"
    @close="closeScheduleDialog"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useAuth } from "@/composables/useAuth";
import { useAdminAuth } from "@/composables/useAdminAuth";
import TrainerSchedule from "./TrainerSchedule.vue";
import LocationSchedule from "./LocationSchedule.vue";
import CourseManagement from "./CourseManagement.vue";
import ScheduleFormDialog from "./ScheduleFormDialog.vue";
import { generateMockCourses } from "@/api/course";

// 认证相关
const { isCoach, currentUser } = useAuth();
const { isAdmin } = useAdminAuth();

// 响应式数据
const currentView = ref("trainers");
const currentWeek = ref(new Date());
const schedules = ref([]);
const trainers = ref([]);
const courses = ref([]);
const locations = ref([]);

// 模态框状态
const showScheduleDialog = ref(false);
const isEditMode = ref(false);
const editingSchedule = ref(null);


// 权限控制计算属性
const canAddSchedule = computed(() => {
  return isAdmin.value || isCoach.value;
});

const canEditSchedule = computed(() => {
  return (schedule) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      return schedule.coach_id === currentUser.value?.id;
    }
    return false;
  };
});

const canDeleteSchedule = computed(() => {
  return (schedule) => {
    if (isAdmin.value) return true;
    if (isCoach.value) {
      return schedule.coach_id === currentUser.value?.id;
    }
    return false;
  };
});


// 视图选项
const views = [
  { key: "courses", name: "课程管理" },
  { key: "trainers", name: "教练排班" },
  { key: "locations", name: "场地预约" },
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
  initializeMockData();
});

// 初始化模拟数据
const initializeMockData = () => {
  // 模拟课程数据
  courses.value = generateMockCourses(15);

  // 模拟教练数据
  trainers.value = [
    { id: 1, name: "李教练", specialty: "瑜伽/普拉提/冥想" },
    { id: 2, name: "王教练", specialty: "动感单车/杠铃操" },
    { id: 3, name: "张教练", specialty: "力量训练/HIIT/CrossFit" },
    { id: 4, name: "陈教练", specialty: "普拉提/拉伸放松" },
    { id: 5, name: "刘教练", specialty: "跑步/有氧运动" },
    { id: 6, name: "赵教练", specialty: "拳击/泰拳" },
    { id: 7, name: "孙教练", specialty: "舞蹈/Zumba" },
    { id: 8, name: "周教练", specialty: "游泳/水中健身" },
    { id: 9, name: "吴教练", specialty: "太极/传统武术" },
  ];

  // 模拟场地数据
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

  // 模拟排班数据 - 本周的排班安排
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  // 生成示例排班数据
  const generateScheduleData = () => {
    const scheduleData = [];
    let scheduleId = 1;
    
    // 为本周的每一天生成排班
    for (let day = 0; day < 7; day++) {
      const currentDay = new Date(weekStart.getTime() + day * 24 * 60 * 60 * 1000);
      
      // 每天生成3-5个排班
      const dailySchedules = Math.floor(Math.random() * 3) + 3; // 3-5个排班
      
      for (let i = 0; i < dailySchedules; i++) {
        const course = courses.value[Math.floor(Math.random() * courses.value.length)];
        const coach = trainers.value[Math.floor(Math.random() * trainers.value.length)];
        const location = locations.value[Math.floor(Math.random() * locations.value.length)];
        
        // 生成不同的时间段
        const timeSlots = [
          { hour: 7, minute: 0 },   // 早上7点
          { hour: 9, minute: 0 },   // 上午9点
          { hour: 14, minute: 0 },  // 下午2点
          { hour: 16, minute: 0 },   // 下午4点
          { hour: 18, minute: 0 },  // 晚上6点
          { hour: 19, minute: 30 }, // 晚上7:30
          { hour: 20, minute: 0 },  // 晚上8点
        ];
        
        const timeSlot = timeSlots[i % timeSlots.length];
        const startTime = new Date(currentDay.getTime() + timeSlot.hour * 60 * 60 * 1000 + timeSlot.minute * 60 * 1000);
        const endTime = new Date(startTime.getTime() + course.duration_minutes * 60000);
        
        // 随机状态
        const statuses = ["waiting", "waiting", "waiting", "completed", "cancelled"]; // 大部分是等待状态
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        scheduleData.push({
          id: scheduleId++,
          course_id: course.id,
          coach_id: coach.id,
          coach_name: coach.name,
          start_datetime: startTime.toISOString().slice(0, 16),
          end_datetime: endTime.toISOString().slice(0, 16),
          location: location.name,
          max_capacity: Math.floor(Math.random() * 25) + 10, // 10-35人
          status: status,
          remark: `${course.name} - ${getStatusRemark(status)}`,
        });
      }
    }
    
    return scheduleData;
  };
  
  // 获取状态备注
  const getStatusRemark = (status) => {
    const remarks = {
      waiting: "等待开始",
      completed: "已完成",
      cancelled: "已取消"
    };
    return remarks[status] || "正常";
  };

  schedules.value = generateScheduleData();
};


// 周导航
const previousWeek = () => {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() - 7);
  currentWeek.value = newWeek;
};

const nextWeek = () => {
  const newWeek = new Date(currentWeek.value);
  newWeek.setDate(newWeek.getDate() + 7);
  currentWeek.value = newWeek;
};

const goToCurrentWeek = () => {
  currentWeek.value = new Date();
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
    return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
  };

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};


// 打开添加排班对话框
const openAddScheduleDialog = () => {
  isEditMode.value = false;
  editingSchedule.value = null;
  showScheduleDialog.value = true;
};

// 关闭排班对话框
const closeScheduleDialog = () => {
  showScheduleDialog.value = false;
  isEditMode.value = false;
  editingSchedule.value = null;
};

// 编辑排班
const editSchedule = (schedule) => {
  // 检查权限
  if (!canEditSchedule.value(schedule)) {
    Swal.fire({
      title: "权限不足",
      text: "您没有权限编辑此排班",
      icon: "warning",
    });
    return;
  }

  isEditMode.value = true;
  editingSchedule.value = schedule;
  showScheduleDialog.value = true;
};

// 处理排班提交
const handleScheduleSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      // 更新排班
      const index = schedules.value.findIndex(
        (s) => s.id === editingSchedule.value.id
      );
      if (index !== -1) {
        schedules.value[index] = {
          ...editingSchedule.value,
          ...formData,
          coach_name: trainers.value.find(
            (t) => t.id == formData.coach_id
          )?.name,
        };
      }

      await Swal.fire({
        title: "更新成功",
        text: "排班信息更新成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // 添加排班
      const newSchedule = {
        id: Date.now(),
        ...formData,
        coach_name: trainers.value.find((t) => t.id == formData.coach_id)
          ?.name,
      };

      schedules.value.push(newSchedule);

      await Swal.fire({
        title: "添加成功",
        text: "排班添加成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    closeScheduleDialog();
  } catch (error) {
    console.error("Failed to handle schedule:", error);
    await Swal.fire({
      title: isEditMode.value ? "更新失败" : "添加失败",
      text: isEditMode.value ? "更新排班信息失败，请重试" : "添加排班失败，请重试",
      icon: "error",
    });
  }
};

// 删除排班
const deleteSchedule = async (schedule) => {
  const result = await Swal.fire({
    title: "确认删除",
    text: `确定要删除 ${schedule.coach_name} 在 ${schedule.start_datetime} 的排班吗？`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    try {
      const index = schedules.value.findIndex((s) => s.id === schedule.id);
      if (index !== -1) {
        schedules.value.splice(index, 1);
      }

      await Swal.fire({
        title: "删除成功",
        text: "排班删除成功！",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      await Swal.fire({
        title: "删除失败",
        text: "删除排班失败，请重试",
        icon: "error",
      });
    }
  }
};
</script>
