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
          <el-button size="small" @click="loadRecentClasses">
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
import {
  getCoachStats,
  getCoachSchedule,
  generateMockCoachStats,
  type Coach,
  type CoachStats,
} from "@/api/coach";

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
    // 加载统计数据
    const mockStats = generateMockCoachStats(coachId);
    Object.assign(stats, mockStats);

    // 加载最近课程
    loadRecentClasses();

    // 实际API调用
    // const [statsRes, classesRes] = await Promise.all([
    //   getCoachStats(),
    //   getCoachSchedule(coachId, { start_date: getDateRange().start, end_date: getDateRange().end })
    // ])
    // Object.assign(stats, statsRes.data)
    // recentClasses.value = classesRes.data.slice(0, 5)
    // reviews.value = reviewsRes.data.slice(0, 5)
  } catch (error) {
    console.error("加载教练数据失败:", error);
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
const loadRecentClasses = async () => {
  try {
    // 模拟数据
    recentClasses.value = [
      {
        id: 1,
        activity: "晨间瑜伽",
        location: "瑜伽室A",
        date: "2024-01-15",
        start_time: "07:00",
        end_time: "08:00",
        max_capacity: 20,
        current_bookings: 15,
      },
      {
        id: 2,
        activity: "普拉提核心",
        location: "瑜伽室B",
        date: "2024-01-14",
        start_time: "09:00",
        end_time: "10:00",
        max_capacity: 15,
        current_bookings: 12,
      },
    ];
  } catch (error) {
    console.error("加载最近课程失败:", error);
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
  return new Date(date).toLocaleDateString("zh-CN");
};

const getDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};
</script>

<style scoped>
.el-rate {
  --el-rate-font-size: 14px;
}
</style>
