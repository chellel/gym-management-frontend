<template>
  <el-dialog
    v-model="dialogVisible"
    title="教练详情"
    width="900px"
    :close-on-click-modal="false"
  >
    <div v-if="coach" class="space-y-6">
      <!-- 基本信息卡片 -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-start space-x-6">
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <el-avatar :size="100" :alt="coach.name">
              {{ coach.name.charAt(0) }}
            </el-avatar>
          </div>

          <!-- 基本信息 -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-900">{{ coach.name }}</h2>
              <el-tag :type="getStatusType(coach.status)" size="large">
                {{ getStatusText(coach.status) }}
              </el-tag>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex items-center">
                  <el-icon class="w-5 h-5 text-gray-400 mr-2"
                    ><Message
                  /></el-icon>
                  <span class="text-gray-600">{{ coach.email }}</span>
                </div>
                <div class="flex items-center">
                  <el-icon class="w-5 h-5 text-gray-400 mr-2"
                    ><Phone
                  /></el-icon>
                  <span class="text-gray-600">{{ coach.phone }}</span>
                </div>
                <div class="flex items-center">
                  <el-icon class="w-5 h-5 text-gray-400 mr-2"
                    ><Calendar
                  /></el-icon>
                  <span class="text-gray-600"
                    >入职时间：{{ formatDate(coach.hireDate) }}</span
                  >
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex items-center">
                  <el-icon class="w-5 h-5 text-gray-400 mr-2"><Star /></el-icon>
                  <span class="text-gray-600"
                    >经验：{{ coach.experience }}</span
                  >
                </div>
              </div>
              <div class="space-y-4">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >个人简介</label
                >
                <p class="text-gray-600 leading-relaxed">
                  dd {{ coach.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="bg-white rounded-lg border p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">统计数据</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">
              {{ stats.total_classes }}
            </div>
            <div class="text-sm text-gray-500">总课程数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ stats.total_members }}
            </div>
            <div class="text-sm text-gray-500">总学员数</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">
              {{ stats.monthly_classes }}
            </div>
            <div class="text-sm text-gray-500">本月课程</div>
          </div>
        </div>
      </div>

      <!-- 最近课程 -->
      <div class="bg-white rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">最近课程</h3>
          <el-button size="small" @click="() => props.coach && loadRecentClasses(props.coach.id)">
            <el-icon class="mr-1"><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
        <div v-if="recentClasses.length > 0" class="space-y-3">
          <div
            v-for="classItem in recentClasses"
            :key="classItem.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <div class="font-medium text-gray-900">
                {{ classItem.activity }}
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(classItem.date) }} {{ classItem.start_time }} -
                {{ classItem.end_time }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">{{ classItem.location }}</div>
              <div class="text-sm text-gray-500">
                {{ classItem.current_bookings }}/{{ classItem.max_capacity }} 人
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">暂无课程记录</div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="editCoach">
          <el-icon class="mr-1"><Edit /></el-icon>
          编辑教练
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { Message, Phone, Calendar, Star, Refresh, Edit } from "@element-plus/icons-vue";
import {
  type Coach,
  type CoachStats,
} from "@/api/coach";
import { getScheduleList } from "@/api/schedule";
import { getBookingList } from "@/api/booking";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Props
const props = defineProps<{
  visible: boolean;
  coach?: Coach | null;
}>();

// Emits
const emit = defineEmits<{
  "update:visible": [value: boolean];
  edit: [coach: Coach];
}>();

// 响应式数据
const stats = reactive<CoachStats>({
  coach_id: 0,
  total_classes: 0,
  total_members: 0,
  monthly_classes: 0,
  monthly_members: 0,
});

const recentClasses = ref([]);

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

// 加载教练数据
const loadCoachData = async (coachId: number) => {
  try {
    // 加载统计数据和最近课程
    await Promise.all([
      loadCoachStats(coachId),
      loadRecentClasses(coachId)
    ]);
  } catch (error) {
    console.error("加载教练数据失败:", error);
  }
};

// 加载教练统计数据
const loadCoachStats = async (coachId: number) => {
  try {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    
    // 获取所有课程（用于统计）
    const allSchedulesResponse = await getScheduleList({
      coachId: coachId,
      page: 1,
      pageSize: 1000,
      isDeleted: 0
    });

    // 获取本月课程
    const monthlySchedulesResponse = await getScheduleList({
      coachId: coachId,
      startDate: startOfMonth.format('YYYY-MM-DD'),
      endDate: today.format('YYYY-MM-DD'),
      page: 1,
      pageSize: 1000,
      isDeleted: 0
    });

    const allSchedules = allSchedulesResponse.rows || [];
    const monthlySchedules = monthlySchedulesResponse.rows || [];

    // 获取所有预约记录以统计学员数
    const allBookingsResponse = await getBookingList({
      page: 1,
      pageSize: 1000,
      isDeleted: 0
    }) as any;

    const allBookings = (allBookingsResponse.rows || allBookingsResponse.data?.rows || []);
    const scheduleIds = allSchedules.map(s => s.id);
    const coachBookings = allBookings.filter(b => scheduleIds.includes(b.scheduleId));
    
    // 统计唯一学员数
    const uniqueMembers = new Set(coachBookings.map(b => b.memberId));
    
    // 获取本月预约
    const monthlyBookings = coachBookings.filter(b => {
      const bookingDate = dayjs(b.bookingTime);
      return bookingDate.isSameOrAfter(startOfMonth) && bookingDate.isSameOrBefore(today);
    });
    const monthlyUniqueMembers = new Set(monthlyBookings.map(b => b.memberId));

    // 更新统计数据
    Object.assign(stats, {
      coach_id: coachId,
      total_classes: allSchedules.length,
      total_members: uniqueMembers.size,
      monthly_classes: monthlySchedules.length,
      monthly_members: monthlyUniqueMembers.size
    });
  } catch (error) {
    console.error("加载教练统计数据失败:", error);
    // 设置默认值
    Object.assign(stats, {
      coach_id: coachId,
      total_classes: 0,
      total_members: 0,
      monthly_classes: 0,
      monthly_members: 0
    });
  }
};
// 监听教练变化
watch(
  () => props.coach,
  (newCoach) => {
    if (newCoach) {
      loadCoachData(newCoach.id);
    }
  },
  { immediate: true }
);
// 加载最近课程
const loadRecentClasses = async (coachId: number) => {
  try {
    if (!coachId) return;

    const today = dayjs().format('YYYY-MM-DD');
    const futureDate = dayjs().add(30, 'day').format('YYYY-MM-DD');

    // 获取最近的课程
    const response = await getScheduleList({
      coachId: coachId,
      startDate: today,
      endDate: futureDate,
      page: 1,
      pageSize: 5,
      isDeleted: 0
    });

    if (response.code === 0) {
      recentClasses.value = (response.rows || []).map(schedule => ({
        id: schedule.id,
        activity: schedule.courseName,
        courseName: schedule.courseName,
        location: schedule.location,
        date: dayjs(schedule.startTime).format('YYYY-MM-DD'),
        start_time: dayjs(schedule.startTime).format('HH:mm'),
        end_time: dayjs(schedule.endTime).format('HH:mm'),
        max_capacity: schedule.maxCapacity,
        current_bookings: schedule.bookingCount || 0,
      }));
    } else {
      recentClasses.value = [];
    }
  } catch (error) {
    console.error("加载最近课程失败:", error);
    recentClasses.value = [];
  }
};

// 编辑教练
const editCoach = () => {
  if (props.coach) {
    emit("edit", props.coach);
    dialogVisible.value = false;
  }
};

// 工具函数
const getStatusType = (status: string) => {
  const statusMap = {
    active: "success",
    inactive: "info",
    suspended: "warning",
  };
  return statusMap[status] || "info";
};

const getStatusText = (status: string) => {
  const statusMap = {
    active: "在职",
    inactive: "离职",
    suspended: "暂停",
  };
  return statusMap[status] || "未知";
};

const formatDate = (date: string) => {
  if (!date) return "";
  return dayjs(date).format('YYYY-MM-DD');
};

</script>

<style scoped>
.el-rate {
  --el-rate-font-size: 14px;
}
</style>
