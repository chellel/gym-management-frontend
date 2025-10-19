<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- 页面标题 -->
    <PageHeader
      title="课程查询"
      subtitle="浏览所有可用的健身课程，找到最适合您的课程"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索和筛选 -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >选择日期</label
            >
            <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >课程</label
            >
            <el-select
              v-model="searchParams.courseId"
              placeholder="全部课程"
              @change="handleFilterChange"
              class="w-full"
            >
              <el-option
                v-for="course in courses"
                :key="course.id"
                :label="course.name"
                :value="course.id"
              />
            </el-select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >教练</label
            >
            <el-select
              v-model="searchParams.coachId"
              placeholder="全部教练"
              @change="handleFilterChange"
              class="w-full"
            >
              <el-option label="全部教练" value="" />
              <el-option
                v-for="coach in coachs"
                :key="coach.id"
                :label="coach.name"
                :value="coach.id"
              />
            </el-select>
          </div>
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >时间段</label
            >
            <el-select
              v-model="searchParams.timeSlot"
              placeholder="全部时间"
              @change="handleFilterChange"
              class="w-full"
            >
              <el-option label="全部时间" value="" />
              <el-option label="早晨 (06:00-12:00)" value="morning" />
              <el-option label="下午 (12:00-18:00)" value="afternoon" />
              <el-option label="晚上 (18:00-24:00)" value="evening" />
            </el-select>
          </div> -->
        </div>
      </div>

      <!-- 课程统计 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4"
            >
              <el-icon class="w-6 h-6 text-blue-600">
                <Calendar />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">
                {{ totalClasses }}
              </div>
              <div class="text-sm text-gray-600">总课程数</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4"
            >
              <el-icon class="w-6 h-6 text-green-600">
                <Clock />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">
                {{ availableClasses }}
              </div>
              <div class="text-sm text-gray-600">可预约课程</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4"
            >
              <el-icon class="w-6 h-6 text-purple-600">
                <UserFilled />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">
                {{ coachs.length }}
              </div>
              <div class="text-sm text-gray-600">教练数量</div>
            </div>
          </div>
        </div>

        <!-- <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div
              class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4"
            >
              <el-icon class="w-6 h-6 text-orange-600">
                <Location />
              </el-icon>
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">
              </div>
              <div class="text-sm text-gray-600">训练场地</div>
            </div>
          </div>
        </div> -->
      </div>

      <!-- 课程列表 -->
      <div class="space-y-6">
        <div v-if="loading" class="text-center py-12">
          <el-icon class="w-12 h-12 text-gray-400 animate-spin">
            <Loading />
          </el-icon>
          <p class="text-gray-500 mt-4">加载课程中...</p>
        </div>

        <div v-else-if="schedules.length === 0" class="text-center py-12">
          <el-icon class="w-16 h-16 text-gray-300 mb-4">
            <Calendar />
          </el-icon>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无课程</h3>
          <p class="text-gray-500">当前筛选条件下没有找到课程</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="classItem in schedules"
            :key="classItem.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-4">
                    <h3 class="text-xl font-bold text-gray-900 mr-4">
                      {{ getCourseName(classItem.courseId) }}
                    </h3>
                    <el-tag
                      v-if="isToday(classItem.startTime)"
                      type="success"
                      size="small"
                      class="ml-2"
                    >
                      今日课程
                    </el-tag>
                  </div>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
                  >
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-blue-500">
                        <User />
                      </el-icon>
                      <span>{{ getCoachName(classItem.coachId) }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-green-500">
                        <Calendar />
                      </el-icon>
                      <span>{{ formatDate(classItem.startTime) }}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-purple-500">
                        <Clock />
                      </el-icon>
                      <span
                        >{{ formatTime(classItem.startTime) }} -
                        {{ formatTime(classItem.endTime) }}</span
                      >
                    </div>
                    <div class="flex items-center text-gray-600">
                      <el-icon class="w-5 h-5 mr-2 text-orange-500">
                        <Location />
                      </el-icon>
                      <span>{{ classItem.location }}</span>
                    </div>
                  </div>

                  <p class="text-gray-600 mb-4">
                    {{ getCourseDescription(classItem.courseId) }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-6">
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-blue-500">
                          <UserFilled />
                        </el-icon>
                        <span
                          >{{ classItem.bookingCount }}/{{
                            classItem.maxCapacity
                          }}
                          人</span
                        >
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-green-500">
                          <CircleCheck />
                        </el-icon>
                        <span>{{ getAvailabilityText(classItem) }}</span>
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <el-icon class="w-4 h-4 mr-1 text-purple-500">
                          <Timer />
                        </el-icon>
                        <span>{{ getDuration(classItem) }} 分钟</span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-3">
                      <!-- 课程状态 -->
                      <div class="flex items-center">
                        <el-tag
                          :type="getClassStatusType(classItem)"
                          size="small"
                        >
                          {{ getClassStatusText(classItem) }}
                        </el-tag>
                      </div>

                      <!-- 操作按钮 -->
                      <div class="flex gap-2">
                        <!-- 查看详情按钮 -->
                        <el-button
                          @click="viewClassDetails(classItem)"
                          type="primary"
                          size="small"
                        >
                          <el-icon class="w-4 h-4 mr-1">
                            <View />
                          </el-icon>
                          查看详情
                        </el-button>

                        <!-- 预约/取消按钮 -->
                        <el-button
                          v-if="!isBooked(classItem)"
                          @click="bookClass(classItem)"
                          type="success"
                          size="small"
                          :disabled="
                            getCurrentParticipants(classItem) >=
                            classItem.maxCapacity
                          "
                        >
                          <el-icon class="w-4 h-4 mr-1">
                            <Calendar />
                          </el-icon>
                          {{
                            getCurrentParticipants(classItem) >=
                            classItem.maxCapacity
                              ? "已满"
                              : "立即预约"
                          }}
                        </el-button>

                        <el-button
                          v-else
                          @click="cancelClassBooking(classItem)"
                          type="danger"
                          size="small"
                        >
                          <el-icon class="w-4 h-4 mr-1">
                            <Close />
                          </el-icon>
                          取消预约
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="schedules.length > 0" class="mt-8 flex justify-center">
        <Pagination
          :total="pagination.total"
          :current-page="pagination.currentPage"
          :page-size="pagination.pageSize"
          @page-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 课程详情对话框 -->
    <CourseDetailDialog
      v-model="detailsDialogVisible"
      :schedule="selectedClass"
      :courses="courses"
      :coaches="coaches"
      :bookings="bookings"
      @book="handleBookFromDialog"
      @cancel="handleCancelFromDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getScheduleList } from "@/api/schedule";
import { getCourseList } from "@/api/course";
import { getCoachList } from "@/api/coach";
import {
  getBookingList,
  getBookingDetail,
  createBooking,
  cancelBooking,
  getBookingByScheduleId,
} from "@/api/booking";
import { useAuth } from "@/composables/useAuth";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import {
  View,
  Calendar,
  Close,
  Clock,
  User,
  Location,
} from "@element-plus/icons-vue";
import CourseDetailDialog from "@/components/common/CourseDetailDialog.vue";
import PageHeader from "@/components/common/PageHeader.vue";

const { currentUser } = useAuth();

// 响应式数据
const loading = ref(false);
const selectedDate = ref("");
const searchParams = ref({
  courseId: "",
  coachId: "",
  // timeSlot: "",
});

const schedules = ref([]);
const courses = ref([]);
const coaches = ref([]);
const bookings = ref([]);
const detailsDialogVisible = ref(false);
const selectedClass = ref(null);

// 初始化
onMounted(async () => {
  getCoachData();
  getCourseData();
  loadData();
});

const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20,
});
const handlePageChange = (page) => {
  pagination.value.currentPage = page;
  getScheduleData();
};
const handleSizeChange = (size) => {
  pagination.value.pageSize = size;
  getScheduleData();
};
const getScheduleData = async () => {
  const res = await getScheduleList({
    page: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    ...searchParams.value,
  });
  if (res.code !== 0) {
    return;
  }
  schedules.value = res.rows || [];
};

const getBookingData = async () => {
  const res = await getBookingList({
    page: 1,
    pageSize: 1000,
  });
  if (res.code !== 0) {
    return;
  }
  bookings.value = res.rows || [];
};
const coachs = ref([]);
const getCoachData = async () => {
  const res = await getCoachList({
    page: 1,
    pageSize: 1000,
  });
  if (res.code !== 0) {
    return;
  }
  coachs.value = res.rows || [];
};

const getCourseData = async () => {
  const res = await getCourseList({
    page: 1,
    pageSize: 1000,
  });
  if (res.code !== 0) {
    return;
  }
  courses.value = res.rows || [];
};
// 加载数据
const loadData = () => {
  getBookingData();
  getScheduleData();
};

// 筛选后的课程（基于排班数据）
// const filteredClasses = computed(() => {
//   let filtered = schedules.value;

//   // 按日期筛选
//   if (selectedDate.value) {
//     filtered = filtered.filter((schedule) => {
//       const scheduleDate = dayjs(schedule.startTime).format("YYYY-MM-DD");
//       return scheduleDate === selectedDate.value;
//     });
//   }

//   // 按时间段筛选
//   if (searchParams.value.timeSlot) {
//     filtered = filtered.filter((schedule) => {
//       const hour = dayjs(schedule.startTime).hour();
//       switch (searchParams.value.timeSlot) {
//         case "morning":
//           return hour >= 6 && hour < 12;
//         case "afternoon":
//           return hour >= 12 && hour < 18;
//         case "evening":
//           return hour >= 18 && hour < 24;
//         default:
//           return true;
//       }
//     });
//   }

//   return filtered;
// });

// 统计数据
const totalClasses = computed(() => schedules.value.length);
const availableClasses = computed(
  () =>
  schedules.value.filter((schedule) => schedule.maxCapacity > schedule.bookingCount).length
);

// 处理日期变化
const handleDateChange = () => {
  pagination.value.currentPage = 1;
  loadData(); // 重新加载数据
};

// 处理筛选变化
const handleFilterChange = () => {
  pagination.value.currentPage = 1;
  getScheduleData();
};

// 查看课程详情
const viewClassDetails = (classItem) => {
  selectedClass.value = classItem;
  detailsDialogVisible.value = true;
};

// 处理对话框中的预约事件
const handleBookFromDialog = (schedule) => {
  bookClass(schedule);
};

// 处理对话框中的取消预约事件
const handleCancelFromDialog = (schedule) => {
  cancelClassBooking(schedule);
};

// 预约课程
const bookClass = async (schedule) => {
  try {
    // 创建预约
    await createBooking({
      scheduleId: schedule.id,
      memberId: currentUser.value.id,
    });

    await Swal.fire({
      title: "预约成功",
      text: "课程预约成功！",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    // 重新加载数据
    await loadData();
  } catch (error) {
    await Swal.fire({
      title: "预约失败",
      text: error.message || "预约课程失败，请重试",
      icon: "error",
    });
  }
};

// 取消预约
const cancelClassBooking = async (schedule) => {
  const userId = currentUser.value.id;
  const res = await getBookingByScheduleId({
    scheduleId: schedule.id,
    memberId: userId,
  });
  if (res.code !== 0) return;
  const bookingList = res.data || [];

  const result = await Swal.fire({
    title: "确认取消",
    text: `确定要取消 ${getCourseName(schedule.courseId)} 的预约吗？`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "取消预约",
    cancelButtonText: "保留预约",
  });

  if (result.isConfirmed) {
    try {
      const bookingInfo = bookingList.find(
        (booking) => booking.memberId === userId
      );
      await cancelBooking(bookingInfo.id);

      await Swal.fire({
        title: "取消成功",
        text: "课程预约已取消！",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // 重新加载数据
      await loadData();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      await Swal.fire({
        title: "取消失败",
        text: "取消预约失败，请重试",
        icon: "error",
      });
    }
  }
};

// 获取课程名称
const getCourseName = (courseId) => {
  const course = courses.value.find((c) => c.id === courseId);
  return course ? course.name : "未知课程";
};

// 获取课程描述
const getCourseDescription = (courseId) => {
  const course = courses.value.find((c) => c.id === courseId);
  return course ? course.description : "";
};

// 获取教练名称
const getCoachName = (coachId) => {
  const coach = coaches.value.find((c) => c.id === coachId);
  return coach ? coach.name : "未知教练";
};

// 获取当前参与人数（基于实际预约数据）
const getCurrentParticipants = (schedule) => {
  const scheduleBookings = bookings.value.filter(
    (booking) => booking.scheduleId === schedule.id && !booking.isDeleted
  );
  return scheduleBookings.length;
};

// 检查是否已预约
const isBooked = (schedule) => {
  return bookings.value.some(
    (booking) => booking.scheduleId === schedule.id && !booking.isDeleted
  );
};

// 格式化时间
const formatTime = (datetime) => {
  return dayjs(datetime).format("HH:mm");
};

// 获取可用性文本
const getAvailabilityText = (schedule) => {
  const remaining = schedule.maxCapacity - schedule.bookingCount;
  if (remaining <= 0) return "已满员";
  if (remaining <= 3) return `仅剩${remaining}个名额`;
  return "可预约";
};

// 获取课程状态类型
const getClassStatusType = (schedule) => {
  const now = dayjs();
  const classDateTime = dayjs(schedule.startTime);

  if (now.isAfter(classDateTime)) {
    return "info"; // 已结束
  }

  if (getCurrentParticipants(schedule) >= schedule.maxCapacity) {
    return "warning"; // 已满员
  }

  return "success"; // 可预约
};

// 获取课程状态文本
const getClassStatusText = (schedule) => {
  const now = dayjs();
  const classDateTime = dayjs(schedule.startTime);

  if (now.isAfter(classDateTime)) {
    return "已结束";
  }

  if (getCurrentParticipants(schedule) >= schedule.maxCapacity) {
    return "已满员";
  }

  return "可预约";
};

// 获取课程时长
const getDuration = (schedule) => {
  const start = dayjs(schedule.startTime);
  const end = dayjs(schedule.endTime);
  return end.diff(start, "minute");
};

// 检查是否是今天
const isToday = (datetime) => {
  return dayjs(datetime).isSame(dayjs(), "day");
};

// 格式化日期
const formatDate = (datetime) => {
  return dayjs(datetime).format("MM月DD日 dddd");
};
</script>

<style scoped>
/* 自定义样式 */
</style>
