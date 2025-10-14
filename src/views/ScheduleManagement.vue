<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">排班管理</h1>
        <p class="mt-1 text-sm text-gray-600">管理教练排班和场地预约安排。</p>
      </div>
      <button
        @click="showAddScheduleModal = true"
        class="btn-primary inline-flex items-center"
      >
        <el-icon class="w-5 h-5 mr-2">
          <Plus />
        </el-icon>
        添加排班
      </button>
    </div>

    <!-- 视图切换和日期选择 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div
        class="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
      >
        <!-- 视图切换 -->
        <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            v-for="view in views"
            :key="view.key"
            @click="currentView = view.key"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="
              currentView === view.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            {{ view.name }}
          </button>
        </div>

        <!-- 日期选择 -->
        <div class="flex items-center space-x-4">
          <button
            @click="previousWeek"
            class="p-2 text-gray-400 hover:text-gray-600"
          >
            <el-icon class="h-5 w-5">
              <ArrowLeft />
            </el-icon>
          </button>
          <div class="text-lg font-medium text-gray-900">
            {{ formatWeekRange(currentWeek) }}
          </div>
          <button
            @click="nextWeek"
            class="p-2 text-gray-400 hover:text-gray-600"
          >
            <el-icon class="h-5 w-5">
              <ArrowRight />
            </el-icon>
          </button>
          <button @click="goToCurrentWeek" class="btn-secondary text-sm">
            本周
          </button>
        </div>
      </div>
    </div>

    <!-- 教练排班视图 -->
    <div
      v-if="currentView === 'trainers'"
      class="bg-white shadow overflow-hidden sm:rounded-lg"
    >
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
            <tr v-for="trainer in trainers" :key="trainer.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-primary-600">
                        {{ trainer.name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ trainer.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ trainer.specialty }}
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
                    v-for="schedule in getTrainerSchedules(
                      trainer.id,
                      day.date
                    )"
                    :key="schedule.id"
                    class="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-primary-200"
                    @click="editSchedule(schedule)"
                  >
                    {{ schedule.start_time }} - {{ schedule.end_time }}
                    <br />
                    {{ schedule.location }}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 场地预约视图 -->
    <div
      v-if="currentView === 'locations'"
      class="bg-white shadow overflow-hidden sm:rounded-lg"
    >
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
                  v-for="schedule in getLocationSchedules(
                    location.id,
                    timeSlot
                  )"
                  :key="schedule.id"
                  class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-green-200"
                  @click="editSchedule(schedule)"
                >
                  {{ schedule.trainer_name }}
                  <br />
                  {{ schedule.activity }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-gray-400">
                <UserFilled />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  总教练数
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ trainers.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-gray-400">
                <LocationFilled />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  总场地数
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ locations.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-gray-400">
                <Clock />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  本周排班
                </dt>
                <dd class="text-lg font-medium text-gray-900">
                  {{ weekSchedules.length }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 添加/编辑排班模态框 -->
  <div
    v-if="showAddScheduleModal || showEditScheduleModal"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
    >
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ showAddScheduleModal ? "添加排班" : "编辑排班" }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </button>
        </div>

        <form
          @submit.prevent="
            showAddScheduleModal ? handleAddSchedule() : handleUpdateSchedule()
          "
          class="space-y-4"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                for="trainer"
                class="block text-sm font-medium text-gray-700"
                >教练 *</label
              >
              <select
                id="trainer"
                v-model="scheduleForm.trainer_id"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">请选择教练</option>
                <option
                  v-for="trainer in trainers"
                  :key="trainer.id"
                  :value="trainer.id"
                >
                  {{ trainer.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="location"
                class="block text-sm font-medium text-gray-700"
                >场地 *</label
              >
              <select
                id="location"
                v-model="scheduleForm.location_id"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">请选择场地</option>
                <option
                  v-for="location in locations"
                  :key="location.id"
                  :value="location.id"
                >
                  {{ location.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                for="schedule-date"
                class="block text-sm font-medium text-gray-700"
                >日期 *</label
              >
              <input
                id="schedule-date"
                v-model="scheduleForm.date"
                type="date"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                for="activity"
                class="block text-sm font-medium text-gray-700"
                >活动内容 *</label
              >
              <input
                id="activity"
                v-model="scheduleForm.activity"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                for="schedule-start-time"
                class="block text-sm font-medium text-gray-700"
                >开始时间 *</label
              >
              <input
                id="schedule-start-time"
                v-model="scheduleForm.start_time"
                type="time"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label
                for="schedule-end-time"
                class="block text-sm font-medium text-gray-700"
                >结束时间 *</label
              >
              <input
                id="schedule-end-time"
                v-model="scheduleForm.end_time"
                type="time"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div class="md:col-span-2">
              <label for="notes" class="block text-sm font-medium text-gray-700"
                >备注</label
              >
              <textarea
                id="notes"
                v-model="scheduleForm.notes"
                rows="3"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {{ showAddScheduleModal ? "添加" : "保存" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Swal from "sweetalert2";
// Element Plus 图标已全局注册，无需导入

// 响应式数据
const currentView = ref("trainers");
const currentWeek = ref(new Date());
const schedules = ref([]);
const trainers = ref([]);
const locations = ref([]);

// 模态框状态
const showAddScheduleModal = ref(false);
const showEditScheduleModal = ref(false);
const editingSchedule = ref(null);

// 排班表单
const scheduleForm = reactive({
  trainer_id: "",
  location_id: "",
  date: "",
  start_time: "",
  end_time: "",
  activity: "",
  notes: "",
});

// 视图选项
const views = [
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

const weekSchedules = computed(() => {
  const weekStart = weekDays.value[0].date;
  const weekEnd = weekDays.value[6].date;

  return schedules.value.filter(
    (schedule) => schedule.date >= weekStart && schedule.date <= weekEnd
  );
});

// 初始化
onMounted(() => {
  initializeMockData();
});

// 初始化模拟数据
const initializeMockData = () => {
  // 模拟教练数据
  trainers.value = [
    { id: 1, name: "李教练", specialty: "瑜伽/普拉提" },
    { id: 2, name: "王教练", specialty: "动感单车" },
    { id: 3, name: "张教练", specialty: "力量训练" },
    { id: 4, name: "陈教练", specialty: "有氧运动" },
  ];

  // 模拟场地数据
  locations.value = [
    { id: 1, name: "瑜伽室A" },
    { id: 2, name: "瑜伽室B" },
    { id: 3, name: "单车房" },
    { id: 4, name: "器械区" },
    { id: 5, name: "有氧区" },
  ];

  // 模拟排班数据
  schedules.value = [
    {
      id: 1,
      trainer_id: 1,
      trainer_name: "李教练",
      location_id: 1,
      location: "瑜伽室A",
      date: weekDays.value[1].date,
      start_time: "09:00",
      end_time: "10:00",
      activity: "初级瑜伽",
      notes: "适合初学者",
    },
    {
      id: 2,
      trainer_id: 2,
      trainer_name: "王教练",
      location_id: 3,
      location: "单车房",
      date: weekDays.value[1].date,
      start_time: "19:00",
      end_time: "20:00",
      activity: "动感单车",
      notes: "高强度训练",
    },
    {
      id: 3,
      trainer_id: 3,
      trainer_name: "张教练",
      location_id: 4,
      location: "器械区",
      date: weekDays.value[2].date,
      start_time: "10:00",
      end_time: "11:30",
      activity: "力量训练",
      notes: "专业指导",
    },
  ];
};

// 获取教练的排班
const getTrainerSchedules = (trainerId, date) => {
  return schedules.value.filter(
    (schedule) => schedule.trainer_id === trainerId && schedule.date === date
  );
};

// 获取场地的排班
const getLocationSchedules = (locationId, timeSlot) => {
  const [startTime] = timeSlot.split("-");
  return schedules.value.filter(
    (schedule) =>
      schedule.location_id === locationId &&
      schedule.start_time.startsWith(startTime.slice(0, 2))
  );
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

  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

// 格式化日期
const formatDate = (date) => {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
};

// 重置表单
const resetForm = () => {
  Object.assign(scheduleForm, {
    trainer_id: "",
    location_id: "",
    date: "",
    start_time: "",
    end_time: "",
    activity: "",
    notes: "",
  });
};

// 关闭模态框
const closeModal = () => {
  showAddScheduleModal.value = false;
  showEditScheduleModal.value = false;
  editingSchedule.value = null;
  resetForm();
};

// 编辑排班
const editSchedule = (schedule) => {
  editingSchedule.value = schedule;
  Object.assign(scheduleForm, {
    trainer_id: schedule.trainer_id,
    location_id: schedule.location_id,
    date: schedule.date,
    start_time: schedule.start_time,
    end_time: schedule.end_time,
    activity: schedule.activity,
    notes: schedule.notes || "",
  });
  showEditScheduleModal.value = true;
};

// 添加排班
const handleAddSchedule = async () => {
  try {
    const newSchedule = {
      id: Date.now(),
      ...scheduleForm,
      trainer_name: trainers.value.find((t) => t.id == scheduleForm.trainer_id)
        ?.name,
      location: locations.value.find((l) => l.id == scheduleForm.location_id)
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

    closeModal();
  } catch (error) {
    console.error("Failed to add schedule:", error);
    await Swal.fire({
      title: "添加失败",
      text: "添加排班失败，请重试",
      icon: "error",
    });
  }
};

// 更新排班
const handleUpdateSchedule = async () => {
  try {
    const index = schedules.value.findIndex(
      (s) => s.id === editingSchedule.value.id
    );
    if (index !== -1) {
      schedules.value[index] = {
        ...editingSchedule.value,
        ...scheduleForm,
        trainer_name: trainers.value.find(
          (t) => t.id == scheduleForm.trainer_id
        )?.name,
        location: locations.value.find((l) => l.id == scheduleForm.location_id)
          ?.name,
      };
    }

    await Swal.fire({
      title: "更新成功",
      text: "排班信息更新成功！",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    closeModal();
  } catch (error) {
    console.error("Failed to update schedule:", error);
    await Swal.fire({
      title: "更新失败",
      text: "更新排班信息失败，请重试",
      icon: "error",
    });
  }
};
</script>
