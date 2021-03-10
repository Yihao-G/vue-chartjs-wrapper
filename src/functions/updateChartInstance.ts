import { nextTick, Ref } from 'vue'
import Chart from 'chart.js'
import { ChartEmitFn } from '@/types/emitFn'

export default function updateChartInstance<T extends 'data' | 'options'> (
  chartInstance: Ref<Chart | null>,
  rendering: Ref<boolean>,
  needsUpdate: Ref<boolean>,
  field: T,
  value: Chart[T],
  emit: ChartEmitFn
): void {
  if (chartInstance.value !== null && !rendering.value) {
    chartInstance.value[field] = value
    needsUpdate.value = true
    nextTick(() => {
      if (needsUpdate.value && !rendering.value) {
        chartInstance.value?.update()
        emit('chart:update')
        needsUpdate.value = false
      }
    })
  }
}
