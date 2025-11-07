<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">教练排班表</h3>
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
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              教练
            </th>
            <th
              v-for="day in weekDays"
              :key="day.date"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div>{{ day.name }}</div>
              <div class="text-gray-400 font-normal">
                {{ formatDate(day.date) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="coach in sortedCoachs" :key="coach.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div
                    class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                  >
                    <span class="text-sm font-medium text-primary-600">
                      {{ coach.name.charAt(0) }}
                    </span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ coach.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ coach.remark }}
                  </div>
                </div>
              </div>
            </td>
            <td
              v-for="day in weekDays"
              :key="day.date"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <div class="space-y-1">
                <div
                  v-for="schedule in getCoachSchedules(coach.id, day.date)"
                  :key="schedule.id"
                  class="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-primary-200 relative group"
                  @click="handleEditSchedule(schedule)"
                >
                  {{ formatTime(schedule.startTime) }} -
                  {{ formatTime(schedule.endTime) }}
                  <br />
                  {{ schedule.location }}
                  <div
                    v-if="canDeleteSchedule(schedule)"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="handleDeleteSchedule(schedule)"
                  >
                    ×
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 排班表单对话框 -->
  <ScheduleFormDialog
    v-model="showScheduleDialog"
    :is-edit="isEditMode"
    :schedule-data="editingSchedule"
    :coachs="coachs"
    :current-user="currentUser"
    @submit="handleScheduleSubmit"
    @close="closeScheduleDialog"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useAuth } from "@/composables/useAuth";
import { useAdminAuth } from "@/composables/useAdminAuth";
import ScheduleFormDialog from "./ScheduleFormDialog.vue";
import { 
  createSchedule, 
  updateSchedule, 
  deleteSchedule
} from "@/api/schedule";

// Props
const props = defineProps({
  coachs: {
    type: Array,
    required: true,
  },
  schedules: {
    type: Array,
    required: true,
  },
  weekDays: {
    type: Array,
    required: true,
  },
  canDeleteSchedule: {
    type: Function,
    required: true,
  },
});

// Emits
const emit = defineEmits(["edit-schedule", "delete-schedule", "schedule-added", "schedule-updated", "schedule-deleted"]);

// 认证相关
const { isCoach, currentUser } = useAuth();
const { isAdmin } = useAdminAuth();

// 权限控制计算属性
const canAddSchedule = computed(() => {
  return isAdmin.value || isCoach.value;
});

// 按排班数量排序的教练列表
const sortedCoachs = computed(() => {
  return [...props.coachs].sort((a, b) => {
    // 计算每个教练的总排班数量
    const aScheduleCount = props.schedules.filter(schedule => schedule.coachId === a.id).length;
    const bScheduleCount = props.schedules.filter(schedule => schedule.coachId === b.id).length;
    
    // 按排班数量降序排列（排班多的在前）
    return bScheduleCount - aScheduleCount;
  });
});

// 模态框状态
const showScheduleDialog = ref(false);
const isEditMode = ref(false);
const editingSchedule = ref(null);

// 获取教练的排班
const getCoachSchedules = (coachId, date) => {
  return props.schedules
    .filter((schedule) => {
      // 检查教练ID匹配
      if (schedule.coachId !== coachId) return false;

      // 检查日期匹配 - 从startTime中提取日期
      const scheduleDate = dayjs(schedule.startTime).format("YYYY-MM-DD");
      return scheduleDate === date;
    })
    .sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
};

// 格式化日期
const formatDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
};

// 格式化时间
const formatTime = (datetime) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

// 打开添加排班对话框
const openAddScheduleDialog = () => {
  isEditMode.value = false;
  editingSchedule.value = null;
  showScheduleDialog.value = true;
};

// 处理编辑排班
const handleEditSchedule = (schedule) => {
  // 检查权限
  if (!canEditSchedule(schedule)) {
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

// 处理删除排班
const handleDeleteSchedule = async (schedule) => {
  const result = await Swal.fire({
    title: "确认删除",
    text: `确定要删除 ${schedule.coachName} 在 ${schedule.startTime} 的排班吗？`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "删除",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    try {
      await deleteSchedule(schedule.id);
      await Swal.fire({
        title: "删除成功",
        text: "排班删除成功！",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
      emit("schedule-deleted");
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

const canEditSchedule = (schedule) => {
  return true;
  if (isAdmin.value) return true;
  if (isCoach.value) {
    return schedule.coachId === currentUser.value?.id;
  }
  return false;
};

// 关闭排班对话框
const closeScheduleDialog = () => {
  showScheduleDialog.value = false;
  isEditMode.value = false;
  editingSchedule.value = null;
};

// 处理排班提交
const handleScheduleSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      // 更新排班
      await updateSchedule({
        id: editingSchedule.value.id,
        ...formData
      });

      await Swal.fire({
        title: "更新成功",
        text: "排班信息更新成功！",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      emit("schedule-updated");
    } else {
      // 添加排班
      const response = await createSchedule(formData);
      
      await Swal.fire({
        title: "添加成功",
        text: "排班添加成功！",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      emit("schedule-added");
    }

    closeScheduleDialog();
  } catch (error) {
    console.error("Failed to handle schedule:", error);
    await Swal.fire({
      title: isEditMode.value ? "更新失败" : "添加失败",
      text: error.msg,
      icon: "error",
    });
  }
};
</script>
