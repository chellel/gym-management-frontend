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
            @click="showAddScheduleModal = true"
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
                      class="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs cursor-pointer hover:bg-primary-200 relative group"
                      @click="editSchedule(schedule)"
                    >
                      {{ schedule.start_time }} - {{ schedule.end_time }}
                      <br />
                      {{ schedule.location }}
                      <div
                        v-if="canDeleteSchedule(schedule)"
                        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        @click.stop="deleteSchedule(schedule)"
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
            <el-button
              @click="closeModal"
              type="text"
              class="text-gray-400 hover:text-gray-600"
            >
              <el-icon class="h-6 w-6">
                <Close />
              </el-icon>
            </el-button>
          </div>
  
          <el-form
            @submit.prevent="
              showAddScheduleModal ? handleAddSchedule() : handleUpdateSchedule()
            "
            class="space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <el-form-item label="教练" required>
                <el-select
                  v-model="scheduleForm.trainer_id"
                  placeholder="选择教练"
                  class="w-full"
                  :disabled="isCoach()"
                >
                  <el-option
                    v-for="trainer in availableTrainers"
                    :key="trainer.id"
                    :label="trainer.name"
                    :value="trainer.id"
                  />
                </el-select>
              </el-form-item>
  
              <el-form-item label="场地" required>
                <el-select
                  v-model="scheduleForm.location_id"
                  placeholder="选择场地"
                  class="w-full"
                >
                  <el-option
                    v-for="location in locations"
                    :key="location.id"
                    :label="location.name"
                    :value="location.id"
                  />
                </el-select>
              </el-form-item>
  
              <el-form-item label="日期" required>
                <el-date-picker
                  v-model="scheduleForm.date"
                  type="date"
                  placeholder="选择日期"
                  class="w-full"
                />
              </el-form-item>
  
              <el-form-item label="活动内容" required>
                <el-input
                  v-model="scheduleForm.activity"
                  placeholder="请输入活动内容"
                  clearable
                />
              </el-form-item>
  
              <el-form-item label="开始时间" required>
                <el-time-picker
                  v-model="scheduleForm.start_time"
                  placeholder="选择开始时间"
                  class="w-full"
                />
              </el-form-item>
  
              <el-form-item label="结束时间" required>
                <el-time-picker
                  v-model="scheduleForm.end_time"
                  placeholder="选择结束时间"
                  class="w-full"
                />
              </el-form-item>
  
              <el-form-item label="备注" class="md:col-span-2">
                <el-input
                  v-model="scheduleForm.notes"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </div>
  
            <div class="flex justify-end space-x-3 pt-4">
              <el-button @click="closeModal" type="default"> 取消 </el-button>
              <el-button type="primary" native-type="submit">
                {{ showAddScheduleModal ? "添加" : "保存" }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useUserinfoStore } from "@/stores/userinfo";
  // Element Plus 图标已全局注册，无需导入
  
// 认证相关
const userinfoStore = useUserinfoStore();

// 响应式数据
const currentView = ref("trainers");
const currentWeek = ref(new Date());
const schedules = ref([]);
const trainers = ref([]);
const locations = ref([]);

// 当前用户信息
const currentUser = computed(() => userinfoStore.userinfo);
const userRole = computed(() => userinfoStore.userRole);

// 检查是否为管理员
const isAdmin = () => {
  return userRole.value === 'admin';
};

// 检查是否为教练
const isCoach = () => {
  return userRole.value === 'coach';
};
  
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
  
  // 权限控制计算属性
  const canAddSchedule = computed(() => {
    return isAdmin() || isCoach();
  });
  
  const canEditSchedule = computed(() => {
    return (schedule) => {
      if (isAdmin()) return true;
      if (isCoach()) {
        return schedule.trainer_id === currentUser.value?.id;
      }
      return false;
    };
  });
  
  const canDeleteSchedule = computed(() => {
    return (schedule) => {
      if (isAdmin()) return true;
      if (isCoach()) {
        return schedule.trainer_id === currentUser.value?.id;
      }
      return false;
    };
  });
  
  // 获取可用的教练列表（教练只能看到自己，管理员可以看到所有）
  const availableTrainers = computed(() => {
    if (isAdmin()) {
      return trainers.value;
    } else if (isCoach()) {
      return trainers.value.filter(
        (trainer) => trainer.id === currentUser.value?.id
      );
    }
    return [];
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
    // 如果是教练，自动设置教练ID
    if (isCoach() && currentUser.value) {
      scheduleForm.trainer_id = currentUser.value.id;
    }
  });
  
  // 初始化模拟数据
  const initializeMockData = () => {
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
  
    schedules.value = [
      // 周一
      {
        id: 1,
        trainer_id: 1,
        trainer_name: "李教练",
        location_id: 1,
        location: "瑜伽室A",
        date: new Date(weekStart).toISOString().split("T")[0],
        start_time: "07:00",
        end_time: "08:00",
        activity: "晨间瑜伽",
        notes: "适合初学者",
      },
      {
        id: 2,
        trainer_id: 2,
        trainer_name: "王教练",
        location_id: 3,
        location: "单车房",
        date: new Date(weekStart).toISOString().split("T")[0],
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
        date: new Date(weekStart).toISOString().split("T")[0],
        start_time: "18:00",
        end_time: "19:00",
        activity: "力量训练基础",
        notes: "专业指导",
      },
      {
        id: 4,
        trainer_id: 4,
        trainer_name: "陈教练",
        location_id: 2,
        location: "瑜伽室B",
        date: new Date(weekStart).toISOString().split("T")[0],
        start_time: "20:00",
        end_time: "21:00",
        activity: "普拉提核心",
        notes: "核心训练",
      },
  
      // 周二
      {
        id: 5,
        trainer_id: 5,
        trainer_name: "刘教练",
        location_id: 15,
        location: "户外跑道",
        date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "06:30",
        end_time: "07:30",
        activity: "晨跑团",
        notes: "户外运动",
      },
      {
        id: 6,
        trainer_id: 1,
        trainer_name: "李教练",
        location_id: 6,
        location: "高温瑜伽室",
        date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "09:00",
        end_time: "10:00",
        activity: "高温瑜伽",
        notes: "深度排毒",
      },
      {
        id: 7,
        trainer_id: 6,
        trainer_name: "赵教练",
        location_id: 7,
        location: "拳击台",
        date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "19:30",
        end_time: "20:30",
        activity: "拳击训练",
        notes: "技巧训练",
      },
      {
        id: 8,
        trainer_id: 7,
        trainer_name: "孙教练",
        location_id: 8,
        location: "舞蹈室",
        date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "20:00",
        end_time: "21:00",
        activity: "有氧舞蹈",
        notes: "音乐节奏",
      },
  
      // 周三
      {
        id: 9,
        trainer_id: 8,
        trainer_name: "周教练",
        location_id: 9,
        location: "游泳池",
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "07:00",
        end_time: "08:00",
        activity: "游泳训练",
        notes: "技巧指导",
      },
      {
        id: 10,
        trainer_id: 3,
        trainer_name: "张教练",
        location_id: 10,
        location: "多功能训练区",
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "18:00",
        end_time: "19:00",
        activity: "HIIT高强度训练",
        notes: "燃脂塑形",
      },
      {
        id: 11,
        trainer_id: 1,
        trainer_name: "李教练",
        location_id: 1,
        location: "瑜伽室A",
        date: new Date(weekStart.getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "19:00",
        end_time: "20:00",
        activity: "瑜伽流",
        notes: "动作串联",
      },
  
      // 周四
      {
        id: 12,
        trainer_id: 6,
        trainer_name: "赵教练",
        location_id: 11,
        location: "泰拳训练区",
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "19:00",
        end_time: "20:00",
        activity: "泰拳训练",
        notes: "格斗技能",
      },
      {
        id: 13,
        trainer_id: 4,
        trainer_name: "陈教练",
        location_id: 2,
        location: "瑜伽室B",
        date: new Date(weekStart.getTime() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "21:00",
        end_time: "21:30",
        activity: "拉伸放松",
        notes: "肌肉恢复",
      },
  
      // 周五
      {
        id: 14,
        trainer_id: 2,
        trainer_name: "王教练",
        location_id: 4,
        location: "器械区",
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "18:30",
        end_time: "19:30",
        activity: "杠铃操",
        notes: "全身训练",
      },
      {
        id: 15,
        trainer_id: 7,
        trainer_name: "孙教练",
        location_id: 8,
        location: "舞蹈室",
        date: new Date(weekStart.getTime() + 4 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "20:00",
        end_time: "21:00",
        activity: "Zumba舞蹈",
        notes: "拉丁舞蹈",
      },
  
      // 周六
      {
        id: 16,
        trainer_id: 1,
        trainer_name: "李教练",
        location_id: 12,
        location: "冥想室",
        date: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "08:00",
        end_time: "09:00",
        activity: "冥想瑜伽",
        notes: "心灵净化",
      },
      {
        id: 17,
        trainer_id: 3,
        trainer_name: "张教练",
        location_id: 13,
        location: "CrossFit训练区",
        date: new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "19:00",
        end_time: "20:00",
        activity: "CrossFit训练",
        notes: "功能性训练",
      },
  
      // 周日
      {
        id: 18,
        trainer_id: 8,
        trainer_name: "周教练",
        location_id: 9,
        location: "游泳池",
        date: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "10:00",
        end_time: "11:00",
        activity: "水中健身",
        notes: "关节友好",
      },
      {
        id: 19,
        trainer_id: 9,
        trainer_name: "吴教练",
        location_id: 14,
        location: "太极练习区",
        date: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "09:00",
        end_time: "10:00",
        activity: "太极课程",
        notes: "修身养性",
      },
      {
        id: 20,
        trainer_id: 4,
        trainer_name: "陈教练",
        location_id: 1,
        location: "瑜伽室A",
        date: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        start_time: "21:00",
        end_time: "22:00",
        activity: "夜间瑜伽",
        notes: "改善睡眠",
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
      trainer_id: isCoach() && currentUser.value ? currentUser.value.id : "",
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
    // 检查权限
    if (!canEditSchedule.value(schedule)) {
      Swal.fire({
        title: "权限不足",
        text: "您没有权限编辑此排班",
        icon: "warning",
      });
      return;
    }
  
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
  
  // 删除排班
  const deleteSchedule = async (schedule) => {
    const result = await Swal.fire({
      title: "确认删除",
      text: `确定要删除 ${schedule.trainer_name} 在 ${schedule.date} ${schedule.start_time}-${schedule.end_time} 的排班吗？`,
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
  