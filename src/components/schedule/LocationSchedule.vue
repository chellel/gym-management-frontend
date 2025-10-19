<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">场地预约表</h3>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              时间
            </th>
            <th
              v-for="location in locations"
              :key="location.id"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ location.name }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="timeSlot in timeSlots" :key="timeSlot">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ timeSlot }}
            </td>
            <td
              v-for="location in locations"
              :key="location.id"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <div
                v-for="schedule in getLocationSchedules(location.id, timeSlot)"
                :key="schedule.id"
                class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-green-200"
                @click="$emit('edit-schedule', schedule)"
              >
                {{ schedule.coach_name }}
                <br />
                {{ schedule.location }}
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
  locations: {
    type: Array,
    required: true,
  },
  schedules: {
    type: Array,
    required: true,
  },
  timeSlots: {
    type: Array,
    required: true,
  },
});

// Emits
const emit = defineEmits(["edit-schedule"]);

// 获取场地的排班
const getLocationSchedules = (locationId, timeSlot) => {
  const [startTime] = timeSlot.split("-");
  const location = props.locations.find(l => l.id === locationId);
  
  return props.schedules.filter((schedule) => {
    // 检查场地匹配
    if (schedule.location !== location?.name) return false;
    
    // 检查时间匹配 - 从start_time中提取小时
    const scheduleHour = schedule.start_time.split('T')[1]?.split(':')[0];
    const slotHour = startTime.slice(0, 2);
    
    return scheduleHour === slotHour;
  });
};
</script>
