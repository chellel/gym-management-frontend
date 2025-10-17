<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">数据看板</h1>
      <p class="mt-1 text-sm text-gray-600">
        健身房运营数据概览和关键指标监控。
      </p>
    </div>

    <!-- 时间范围选择 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div class="flex-1">
          <label for="date-range" class="block text-sm font-medium text-gray-700 mb-2">
            选择日期范围
          </label>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </div>
        <div class="flex items-end space-x-2">
          <el-button @click="setQuickRange('week')" type="default" size="small">
            本周
          </el-button>
          <el-button @click="setQuickRange('month')" type="default" size="small">
            本月
          </el-button>
          <el-button @click="refreshData" type="primary" size="small">
            刷新数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-blue-500">
                <User />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">总会员数</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ kpis.totalMembers }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    {{ kpis.memberGrowth }}%
                  </div>
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
              <el-icon class="h-6 w-6 text-green-500">
                <Money />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">本月收入</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    ¥{{ kpis.totalRevenue.toLocaleString() }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    {{ kpis.revenueGrowth }}%
                  </div>
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
              <el-icon class="h-6 w-6 text-purple-500">
                <Calendar />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">课程签到</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ kpis.totalCheckIns }}
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    {{ kpis.checkInGrowth }}%
                  </div>
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
              <el-icon class="h-6 w-6 text-orange-500">
                <Clock />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">活跃率</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ kpis.activityRate }}%
                  </div>
                  <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                    {{ kpis.activityGrowth }}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 会员增长趋势 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">会员增长趋势</h3>
        </div>
        <div class="p-6">
          <div class="h-64 sm:h-80">
            <MemberGrowthChart :data="memberGrowthData" />
          </div>
        </div>
      </div>

      <!-- 课程预约 Top 5 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">课程预约 Top 5</h3>
        </div>
        <div class="p-6">
          <div class="h-64 sm:h-80">
            <ClassBookingChart :data="classBookingData" />
          </div>
        </div>
      </div>
    </div>

    <!-- 训练高峰期 -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900">训练高峰期</h3>
      </div>
      <div class="p-6">
        <div class="h-64 sm:h-80">
          <PeakHoursChart :data="peakHoursData" />
        </div>
      </div>
    </div>

    <!-- 快速操作区域 -->
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h3 class="text-lg font-medium text-gray-900">详细分析</h3>
          <p class="mt-1 text-sm text-gray-600">查看更详细的财务数据和业务分析。</p>
        </div>
        <div class="flex space-x-3">
          <el-button
            @click="goToFinance"
            type="primary"
            class="inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            <el-icon class="w-4 h-4 mr-2">
              <Money />
            </el-icon>
            财务管理
          </el-button>
          <el-button
            @click="goToReports"
            type="default"
            class="inline-flex items-center px-4 py-2 text-sm font-medium"
          >
            <el-icon class="w-4 h-4 mr-2">
              <DataAnalysis />
            </el-icon>
            详细报表
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import {
  MemberGrowthChart,
  ClassBookingChart,
  PeakHoursChart
} from "@/components/charts";

const router = useRouter();

// 响应式数据
const dateRange = ref([
  new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0],
  new Date().toISOString().split("T")[0]
]);

// KPI数据
const kpis = reactive({
  totalMembers: 1256,
  memberGrowth: 12.5,
  totalRevenue: 158600,
  revenueGrowth: 8.3,
  totalCheckIns: 3420,
  checkInGrowth: 15.2,
  activityRate: 68.5,
  activityGrowth: 5.1,
});

// 图表数据
const memberGrowthData = ref([
  { date: "1月", newMembers: 45, totalMembers: 1200 },
  { date: "2月", newMembers: 52, totalMembers: 1252 },
  { date: "3月", newMembers: 38, totalMembers: 1290 },
  { date: "4月", newMembers: 67, totalMembers: 1357 },
  { date: "5月", newMembers: 43, totalMembers: 1400 },
  { date: "6月", newMembers: 56, totalMembers: 1456 },
  { date: "7月", newMembers: 48, totalMembers: 1504 },
  { date: "8月", newMembers: 61, totalMembers: 1565 },
  { date: "9月", newMembers: 39, totalMembers: 1604 },
  { date: "10月", newMembers: 52, totalMembers: 1656 },
  { date: "11月", newMembers: 44, totalMembers: 1700 },
  { date: "12月", newMembers: 58, totalMembers: 1758 }
]);

const classBookingData = ref([
  { name: "瑜伽课程", bookings: 456 },
  { name: "动感单车", bookings: 378 },
  { name: "力量训练", bookings: 234 },
  { name: "有氧运动", bookings: 189 },
  { name: "普拉提", bookings: 156 }
]);

const peakHoursData = ref({
  weekday: [
    { time: "06:00", activeUsers: 25 },
    { time: "07:00", activeUsers: 45 },
    { time: "08:00", activeUsers: 35 },
    { time: "09:00", activeUsers: 20 },
    { time: "10:00", activeUsers: 15 },
    { time: "11:00", activeUsers: 18 },
    { time: "12:00", activeUsers: 30 },
    { time: "13:00", activeUsers: 25 },
    { time: "14:00", activeUsers: 20 },
    { time: "15:00", activeUsers: 22 },
    { time: "16:00", activeUsers: 28 },
    { time: "17:00", activeUsers: 55 },
    { time: "18:00", activeUsers: 85 },
    { time: "19:00", activeUsers: 95 },
    { time: "20:00", activeUsers: 78 },
    { time: "21:00", activeUsers: 45 },
    { time: "22:00", activeUsers: 25 }
  ],
  weekend: [
    { time: "08:00", activeUsers: 15 },
    { time: "09:00", activeUsers: 25 },
    { time: "10:00", activeUsers: 35 },
    { time: "11:00", activeUsers: 45 },
    { time: "12:00", activeUsers: 40 },
    { time: "13:00", activeUsers: 30 },
    { time: "14:00", activeUsers: 35 },
    { time: "15:00", activeUsers: 50 },
    { time: "16:00", activeUsers: 65 },
    { time: "17:00", activeUsers: 70 },
    { time: "18:00", activeUsers: 60 },
    { time: "19:00", activeUsers: 45 },
    { time: "20:00", activeUsers: 30 },
    { time: "21:00", activeUsers: 20 }
  ],
  morning: [
    { time: "06:00", activeUsers: 25 },
    { time: "07:00", activeUsers: 45 },
    { time: "08:00", activeUsers: 35 },
    { time: "09:00", activeUsers: 20 },
    { time: "10:00", activeUsers: 15 },
    { time: "11:00", activeUsers: 18 }
  ],
  evening: [
    { time: "17:00", activeUsers: 55 },
    { time: "18:00", activeUsers: 85 },
    { time: "19:00", activeUsers: 95 },
    { time: "20:00", activeUsers: 78 },
    { time: "21:00", activeUsers: 45 },
    { time: "22:00", activeUsers: 25 }
  ]
});

// 初始化
onMounted(() => {
  refreshData();
});

// 设置快速时间范围
const setQuickRange = (range) => {
  const today = new Date();
  const start = new Date();

  switch (range) {
    case "week":
      start.setDate(today.getDate() - 7);
      break;
    case "month":
      start.setMonth(today.getMonth() - 1);
      break;
    default:
      start.setDate(today.getDate() - 30);
  }

  dateRange.value = [
    start.toISOString().split("T")[0],
    today.toISOString().split("T")[0]
  ];

  refreshData();
};

// 刷新数据
const refreshData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await Swal.fire({
      title: "数据已更新",
      text: `已加载 ${dateRange.value[0]} 至 ${dateRange.value[1]} 的数据`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Failed to refresh data:", error);
    await Swal.fire({
      title: "刷新失败",
      text: "数据刷新失败，请重试",
      icon: "error",
    });
  }
};

// 跳转到财务管理
const goToFinance = () => {
  router.push('/admin/finance');
};

// 跳转到详细报表
const goToReports = () => {
  // 可以跳转到更详细的报表页面，或者显示更多数据
  Swal.fire({
    title: "详细报表",
    text: "详细报表功能开发中...",
    icon: "info",
  });
};
</script>
