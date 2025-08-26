<template>
  <Layout>
    <div class="space-y-6">
      <!-- 页面标题 -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">数据报表</h1>
        <p class="mt-1 text-sm text-gray-600">查看健身房运营数据和业务分析报告。</p>
      </div>

      <!-- 时间范围选择 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex-1">
            <label for="start-date" class="block text-sm font-medium text-gray-700 mb-2">
              开始日期
            </label>
            <input
              id="start-date"
              v-model="dateRange.start"
              type="date"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div class="flex-1">
            <label for="end-date" class="block text-sm font-medium text-gray-700 mb-2">
              结束日期
            </label>
            <input
              id="end-date"
              v-model="dateRange.end"
              type="date"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div class="flex items-end space-x-2">
            <button
              @click="setQuickRange('week')"
              class="btn-secondary text-sm"
            >
              本周
            </button>
            <button
              @click="setQuickRange('month')"
              class="btn-secondary text-sm"
            >
              本月
            </button>
            <button
              @click="refreshData"
              class="btn-primary text-sm"
            >
              刷新数据
            </button>
          </div>
        </div>
      </div>

      <!-- 关键指标卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <el-icon class="h-6 w-6 text-gray-400">
                  <User />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">总会员数</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ kpis.totalMembers }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                      <span class="sr-only">Increased by</span>
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
                <el-icon class="h-6 w-6 text-gray-400">
                  <Money />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">营业收入</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">¥{{ kpis.totalRevenue.toLocaleString() }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                      <span class="sr-only">Increased by</span>
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
                <el-icon class="h-6 w-6 text-gray-400">
                  <Calendar />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">课程签到</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ kpis.totalCheckIns }}</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-blue-600">
                      <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                      <span class="sr-only">Increased by</span>
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
                <el-icon class="h-6 w-6 text-gray-400">
                  <Clock />
                </el-icon>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">活跃率</dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">{{ kpis.activityRate }}%</div>
                    <div class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <el-icon class="self-center flex-shrink-0 h-4 w-4">
                      <ArrowUp />
                    </el-icon>
                      <span class="sr-only">Increased by</span>
                      {{ kpis.activityGrowth }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 会员增长趋势 -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">会员增长趋势</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div class="text-center">
                <el-icon class="mx-auto h-12 w-12 text-gray-400">
                  <DataAnalysis />
                </el-icon>
                <p class="mt-2 text-sm text-gray-500">图表功能开发中</p>
                <p class="text-xs text-gray-400">可集成 Chart.js 或 ECharts</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 收入分析 -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">收入分析</h3>
          </div>
          <div class="p-6">
            <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div class="text-center">
                <el-icon class="mx-auto h-12 w-12 text-gray-400">
                  <PieChart />
                </el-icon>
                <p class="mt-2 text-sm text-gray-500">图表功能开发中</p>
                <p class="text-xs text-gray-400">可集成 Chart.js 或 ECharts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg leading-6 font-medium text-gray-900">详细数据</h3>
        </div>
        
        <!-- 标签切换 -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="currentTab = tab.key"
              class="py-2 px-1 border-b-2 font-medium text-sm"
              :class="currentTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 会员数据表格 -->
        <div v-if="currentTab === 'members'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会员类型
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  占比
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平均收入
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in memberData" :key="item.type">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.percentage }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{{ item.avgRevenue.toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 课程数据表格 -->
        <div v-if="currentTab === 'classes'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  课程名称
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  预约次数
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  签到率
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  满意度
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in classData" :key="item.name">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.bookings }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.attendanceRate }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div
                          class="bg-yellow-400 h-2 rounded-full"
                          :style="{ width: item.satisfaction + '%' }"
                        ></div>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm text-gray-900">{{ item.satisfaction }}%</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 财务数据表格 -->
        <div v-if="currentTab === 'finance'" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  收入来源
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  占比
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  同比
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in financeData" :key="item.source">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.source }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ¥{{ item.amount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.percentage }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="item.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ item.growth >= 0 ? '+' : '' }}{{ item.growth }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 导出功能 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 class="text-lg font-medium text-gray-900">数据导出</h3>
            <p class="mt-1 text-sm text-gray-600">导出报表数据，支持多种格式。</p>
          </div>
          <div class="flex space-x-3">
            <button
              @click="exportData('excel')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <el-icon class="w-4 h-4 mr-2">
                <Document />
              </el-icon>
              导出 Excel
            </button>
            <button
              @click="exportData('pdf')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <el-icon class="w-4 h-4 mr-2">
                <Document />
              </el-icon>
              导出 PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import Swal from 'sweetalert2'
// Element Plus 图标已全局注册，无需导入

// 响应式数据
const currentTab = ref('members')
const dateRange = reactive({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

// KPI数据
const kpis = reactive({
  totalMembers: 1256,
  memberGrowth: 12.5,
  totalRevenue: 158600,
  revenueGrowth: 8.3,
  totalCheckIns: 3420,
  checkInGrowth: 15.2,
  activityRate: 68.5,
  activityGrowth: 5.1
})

// 标签页
const tabs = [
  { key: 'members', name: '会员数据' },
  { key: 'classes', name: '课程数据' },
  { key: 'finance', name: '财务数据' }
]

// 会员数据
const memberData = ref([
  { type: '年度会员', count: 456, percentage: 36.3, avgRevenue: 2400 },
  { type: '半年会员', count: 324, percentage: 25.8, avgRevenue: 1300 },
  { type: '季度会员', count: 278, percentage: 22.1, avgRevenue: 720 },
  { type: '月度会员', count: 198, percentage: 15.8, avgRevenue: 280 }
])

// 课程数据
const classData = ref([
  { name: '瑜伽课程', bookings: 456, attendanceRate: 92, satisfaction: 95 },
  { name: '动感单车', bookings: 378, attendanceRate: 88, satisfaction: 89 },
  { name: '力量训练', bookings: 234, attendanceRate: 85, satisfaction: 91 },
  { name: '有氧运动', bookings: 189, attendanceRate: 90, satisfaction: 87 }
])

// 财务数据
const financeData = ref([
  { source: '会员费', amount: 126800, percentage: 79.9, growth: 8.5 },
  { source: '私教费', amount: 18600, percentage: 11.7, growth: 12.3 },
  { source: '商品销售', amount: 8900, percentage: 5.6, growth: -2.1 },
  { source: '其他收入', amount: 4300, percentage: 2.7, growth: 15.6 }
])

// 初始化
onMounted(() => {
  refreshData()
})

// 设置快速时间范围
const setQuickRange = (range) => {
  const today = new Date()
  const start = new Date()
  
  switch (range) {
    case 'week':
      start.setDate(today.getDate() - 7)
      break
    case 'month':
      start.setMonth(today.getMonth() - 1)
      break
    default:
      start.setDate(today.getDate() - 30)
  }
  
  dateRange.start = start.toISOString().split('T')[0]
  dateRange.end = today.toISOString().split('T')[0]
  
  refreshData()
}

// 刷新数据
const refreshData = async () => {
  try {
    // 这里可以调用API获取实际数据
    await Swal.fire({
      title: '数据已更新',
      text: `已加载 ${dateRange.start} 至 ${dateRange.end} 的数据`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Failed to refresh data:', error)
    await Swal.fire({
      title: '刷新失败',
      text: '数据刷新失败，请重试',
      icon: 'error'
    })
  }
}

// 导出数据
const exportData = async (format) => {
  try {
    await Swal.fire({
      title: '导出中',
      text: `正在生成 ${format.toUpperCase()} 文件...`,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    })
    
    // 这里实现实际的导出逻辑
    // 可以使用库如 xlsx、jspdf 等
    
    await Swal.fire({
      title: '导出成功',
      text: `${format.toUpperCase()} 文件已生成`,
      icon: 'success'
    })
  } catch (error) {
    console.error('Failed to export data:', error)
    await Swal.fire({
      title: '导出失败',
      text: '数据导出失败，请重试',
      icon: 'error'
    })
  }
}
</script>
