import { nextTick, Ref } from 'vue'
import Chart, { ChartData, ChartOptions, ChartType, PluginServiceRegistrationOptions } from 'chart.js'
import cleanupChartInstance from '@/functions/cleanupChartInstance'
import { ChartEmitFn } from '@/types/emitFn'

export default function rerenderChartInstance (
  chartInstance: Ref<Chart | null>,
  rendering: Ref<boolean>,
  needsUpdate: Ref<boolean>,
  canvas: HTMLCanvasElement,
  type: ChartType | string,
  data: ChartData,
  options: ChartOptions,
  plugins: PluginServiceRegistrationOptions[],
  emit: ChartEmitFn
): void {
  if (rendering.value) return
  rendering.value = true
  cleanupChartInstance(chartInstance, emit)
  chartInstance.value = new Chart(canvas, {
    type,
    data,
    options,
    plugins
  })
  emit('chart:render', chartInstance.value)
  nextTick(() => {
    rendering.value = false
    needsUpdate.value = false
  })
}
