<template>
  <div class="w-full h-full">
    <v-chart 
      class="chart" 
      :option="chartOption" 
      autoresize
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
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
    type: Array,
    default: () => []
  }
})

const chartOption = computed(() => {
  return {
    title: {
      text: '课程预约 Top 5',
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
               params[0].marker + '预约次数: ' + params[0].value + '次'
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
      data: props.data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '预约次数',
      axisLabel: {
        formatter: '{value}次',
        fontSize: 12
      }
    },
    series: [
      {
        name: '预约次数',
        type: 'bar',
        data: props.data.map(item => item.bookings),
        itemStyle: {
          color: function(params) {
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
            return colors[params.dataIndex] || '#6b7280'
          }
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}次'
        }
      }
    ]
  }
})
</script>

<style scoped>
.chart {
  height: 100%;
  width: 100%;
}
</style>