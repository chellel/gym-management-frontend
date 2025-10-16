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
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
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
      text: '收入统计',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.name + '<br/>' +
               params.marker + '金额: ¥' + params.value.toLocaleString() + '<br/>' +
               '占比: ' + params.percent + '%'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      formatter: function(name) {
        const item = props.data.find(d => d.name === name)
        return item ? name + ' (¥' + item.value.toLocaleString() + ')' : name
      }
    },
    series: [
      {
        name: '收入来源',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            formatter: function(params) {
              return params.name + '\n' + params.percent + '%'
            }
          }
        },
        labelLine: {
          show: false
        },
        data: props.data.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }))
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
