<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">教练排班表</h3>
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
          <tr v-for="coach in coachs" :key="coach.id">
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
                    {{ coach.specialty }}
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
                  @click="$emit('edit-schedule', schedule)"
                >
                  {{ formatTime(schedule.start_datetime) }} -
                  {{ formatTime(schedule.end_datetime) }}
                  <br />
                  {{ schedule.location }}
                  <div
                    v-if="canDeleteSchedule(schedule)"
                    class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="$emit('delete-schedule', schedule)"
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
</template>

<script setup>
import { computed } from "vue";

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
const emit = defineEmits(["edit-schedule", "delete-schedule"]);

// 获取教练的排班
const getCoachSchedules = (coachId, date) => {
  return props.schedules.filter((schedule) => {
    // 检查教练ID匹配
    if (schedule.coach_id !== coachId) return false;

    // 检查日期匹配 - 从start_datetime中提取日期
    const scheduleDate = schedule.start_datetime.split("T")[0];
    return scheduleDate === date;
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
</script>
