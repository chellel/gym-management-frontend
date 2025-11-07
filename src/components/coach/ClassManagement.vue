<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-900">课程管理</h2>
      <el-button @click="refreshClasses" type="default" size="small">
        <el-icon class="w-4 h-4 mr-1">
          <Refresh />
        </el-icon>
        刷新
      </el-button>
    </div>

    <div class="space-y-4">
      <div
        v-for="classItem in upcomingClasses"
        :key="classItem.id"
        class="border rounded-lg p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ classItem.courseName || classItem.activity }}
                </h3>
                <p class="text-sm text-gray-500">{{ classItem.location }}</p>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatDate(classItem.startTime) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ formatTime(classItem.startTime) }} - {{ formatTime(classItem.endTime) }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <el-button
              @click="viewClassMembers(classItem)"
              type="primary"
              size="small"
            >
              查看学员
            </el-button>
            <el-tooltip
              content="课程开始前30分钟内可以开始签到"
              placement="top"
              :disabled="canStartAttendance(classItem)"
            >
              <el-button
                @click="startAttendance(classItem)"
                type="success"
                size="small"
                :disabled="!canStartAttendance(classItem)"
              >
                开始签到
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- 学员名单模态框 -->
    <el-dialog v-model="showMembersModal" title="学员名单" width="800px">
      <div v-if="selectedClass" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">
            {{ selectedClass.courseName || selectedClass.activity }} - 学员名单
          </h3>
          <el-button @click="exportMembers" type="primary" size="small">
            <el-icon class="w-4 h-4 mr-1">
              <Download />
            </el-icon>
            导出名单
          </el-button>
        </div>

        <div class="space-y-2">
          <div
            v-for="member in classMembers"
            :key="member.id"
            class="flex items-center justify-between p-3 border rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <span class="text-sm font-medium text-gray-600">{{
                  (member.memberName || member.name || '').charAt(0)
                }}</span>
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ member.memberName || member.name }}</p>
                <p class="text-sm text-gray-500">{{ member.memberPhone || member.phone }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <el-tag
                :type="
                  member.checkinTime ? 'success' : 'default'
                "
              >
                {{
                  member.checkinTime ? "已签到" : "未签到"
                }}
              </el-tag>
              <el-button
                v-if="!member.checkinTime"
                @click="markAttendance(member)"
                type="primary"
                size="small"
              >
                签到
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Refresh, Download } from "@element-plus/icons-vue";
import { useCoachService } from "@/composables/useCoachService";
import { useAuth } from "@/composables/useAuth";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const { currentUser } = useAuth();

const {
  coachInfo,
  coachClasses,
  classMembers,
  getCoachClasses,
  getClassMembers,
  markAttendance: markAttendanceService,
  exportClassMembers,
} = useCoachService();

// 响应式数据
const showMembersModal = ref(false);
const selectedClass = ref(null);

// 初始化数据
onMounted(async () => {
  if (currentUser.value?.id) {
    await getCoachClasses(currentUser.value.id);
  }
});

// 计算属性
const upcomingClasses = computed(() => {
  const today = dayjs().startOf('day');
  return coachClasses.value
    .filter((cls) => {
      if (!cls.startTime) return false;
      const classDate = dayjs(cls.startTime).startOf('day');
      return classDate.isSameOrAfter(today);
    })
    .sort((a, b) => {
      return dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf();
    })
    .slice(0, 10);
});

// 事件处理函数
const refreshClasses = async () => {
  try {
    if (currentUser.value?.id) {
      await getCoachClasses(currentUser.value.id);
    }
    Swal.fire({
      title: "刷新成功",
      text: "课程管理数据已更新",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("刷新课程管理数据失败:", error);
    Swal.fire({
      title: "刷新失败",
      text: "刷新课程管理数据失败，请重试",
      icon: "error",
    });
  }
};

const viewClassMembers = async (classItem) => {
  try {
    selectedClass.value = classItem;
    await getClassMembers(classItem.id);
    showMembersModal.value = true;
  } catch (error) {
    console.error("获取学员名单失败:", error);
    Swal.fire({
      title: "错误",
      text: "获取学员名单失败，请重试",
      icon: "error",
    });
  }
};

const startAttendance = (classItem) => {
  Swal.fire({
    title: "开始签到",
    text: `确定要开始 ${classItem.courseName || classItem.activity} 的签到吗？`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "开始",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "签到已开始",
        text: "学员可以开始签到了",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  });
};

const canStartAttendance = (classItem) => {
  if (!classItem.startTime) return false;
  const now = dayjs();
  const classTime = dayjs(classItem.startTime);
  const timeDiff = classTime.diff(now, 'minute');
  // 课程开始前30分钟内可以开始签到，且课程未开始
  return timeDiff <= 30 && timeDiff >= 0;
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return "";
  return dayjs(date).format('YYYY-MM-DD');
};

// 格式化时间
const formatTime = (datetime) => {
  if (!datetime) return "";
  return dayjs(datetime).format('HH:mm');
};

const markAttendance = async (member) => {
  try {
    await markAttendanceService(selectedClass.value.id, member.id, "present");
    // 刷新学员名单
    await getClassMembers(selectedClass.value.id);
    Swal.fire({
      title: "签到成功",
      text: `${member.memberName || member.name} 已签到`,
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("签到失败:", error);
    Swal.fire({
      title: "签到失败",
      text: error.msg || error.message || "签到失败，请重试",
      icon: "error",
    });
  }
};

const exportMembers = async () => {
  try {
    await exportClassMembers(selectedClass.value.id);
    Swal.fire({
      title: "导出成功",
      text: "学员名单已导出",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("导出失败:", error);
    Swal.fire({
      title: "导出失败",
      text: "导出学员名单失败，请重试",
      icon: "error",
    });
  }
};
</script>
