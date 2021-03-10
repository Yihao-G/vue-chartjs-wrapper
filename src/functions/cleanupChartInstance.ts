import { Ref } from 'vue'
import Chart from 'chart.js'
import { ChartEmitFn } from '@/types/emitFn'

export default function cleanupChartInstance (chartInstance: Ref<Chart | null>, emit: ChartEmitFn): void {
  chartInstance.value?.destroy()
  chartInstance.value = null
  emit('chart:destroy')
}
