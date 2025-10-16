<template>
  <div class="w-full h-full">
    <!-- 时间段选择器 -->
    <div class="mb-4 flex justify-center space-x-2">
      <el-button 
        v-for="period in timePeriods" 
        :key="period.key"
        @click="selectedPeriod = period.key"
        :type="selectedPeriod === period.key ? 'primary' : 'default'"
        size="small"
      >
        {{ period.name }}
      </el-button>
    </div>
    
    <v-chart 
      class="chart" 
      :option="chartOption" 
      autoresize
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent
])

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

// 时间段选择
const selectedPeriod = ref('weekday')

// 时间段配置
const timePeriods = [
  { key: 'weekday', name: '工作日' },
  { key: 'weekend', name: '周末' },
  { key: 'morning', name: '上午时段' },
  { key: 'evening', name: '晚间时段' }
]

const chartOption = computed(() => {
  const currentData = props.data[selectedPeriod.value] || []
  const periodName = timePeriods.find(p => p.key === selectedPeriod.value)?.name || '训练高峰期'
  
  return {
    title: {
      text: `${periodName}训练高峰期`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        return params[0].name + '<br/>' + 
               params[0].marker + '活跃人数: ' + params[0].value + '人'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: currentData.map(item => item.time),
      axisLabel: {
        interval: 1,
        fontSize: 10,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '活跃人数',
      axisLabel: {
        formatter: '{value}人',
        fontSize: 12
      }
    },
    series: [
      {
        name: '活跃人数',
        type: 'bar',
        data: currentData.map(item => item.activeUsers),
        itemStyle: {
          color: function(params) {
            // 根据数值大小设置不同颜色
            const value = params.value
            if (value >= 80) return '#ef4444' // 高峰期 - 红色
            if (value >= 60) return '#f59e0b' // 中高峰期 - 橙色
            if (value >= 40) return '#10b981' // 正常期 - 绿色
            return '#6b7280' // 低峰期 - 灰色
          }
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}人'
        }
      }
    ]
  }
})
</script>

<style scoped>
.chart {
  height: calc(100% - 40px);
  width: 100%;
}
</style>
