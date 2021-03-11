<template>
    <div v-if="wrapped" style="position: relative;">
        <canvas ref="canvas" />
    </div>
    <canvas v-else ref="canvas" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, toRefs, PropType } from 'vue'
import Chart, { ChartData, ChartOptions, ChartType, PluginServiceRegistrationOptions } from 'chart.js'
import rerenderChartInstance from './functions/rerenderChartInstance'
import cleanupChartInstance from './functions/cleanupChartInstance'
import updatePlugins from './functions/updatePlugins'
import cloneDeep from 'clone-deep'
import updateChartInstance from '@/functions/updateChartInstance'

export default defineComponent({
  name: 'Chart',
  props: {
    type: {
      type: String as PropType<ChartType | string>,
      required: true
    },
    data: {
      type: Object as PropType<ChartData>,
      default: () => ({})
    },
    options: {
      type: Object as PropType<ChartOptions>,
      default: () => ({})
    },
    plugins: {
      type: Array as PropType<PluginServiceRegistrationOptions[]>,
      default: () => []
    },
    /**
     * Wrap the canvas element in a relatively positioned div.
     *
     * This is especially usefully when Chart.js is set to be responsive (default behaviour). This is because Chart.js
     * needs a dedicated parent element to detect size changes.
     * See https://www.chartjs.org/docs/latest/general/responsive.html#important-note for more information.
     */
    wrapped: {
      type: Boolean,
      default: () => true
    }
  },
  emits: {
    'chart:render': (payload: Chart) => (payload as unknown) instanceof Chart,
    'chart:destroy': (payload: void) => payload === undefined,
    'chart:update': (payload: void) => payload === undefined
  },
  setup (props, { emit }) {
    const {
      type,
      data,
      options,
      plugins,
      wrapped
    } = toRefs(props)

    const canvas = ref<HTMLCanvasElement>(null as never) // will be populated after mounting

    const chartInstance = ref<Chart | null>(null)
    const internalPlugins = [...plugins.value]

    /**
     * Indicates the Chart instance's `data` or `options` has been updated but `update()` is not invoked yet
     */
    const rendering = ref(false)
    /**
     * Indicates Chart instance has its first render or subsequent rerender due to the update of `type`
     * in or immediate after the update cycle
     */
    const needsUpdate = ref(false)

    const renderChart = () => {
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas.value,
        type.value,
        cloneDeep(data.value),
        options.value,
        internalPlugins,
        emit
      )
    }
    onMounted(renderChart)
    watch([type, wrapped], renderChart)

    onBeforeUnmount(() => {
      cleanupChartInstance(chartInstance, emit)
    })

    watch(data, () => {
      updateChartInstance(chartInstance, rendering, needsUpdate, 'data', cloneDeep(data.value), emit)
    }, { deep: true })
    watch(options, () => {
      updateChartInstance(chartInstance, rendering, needsUpdate, 'options', options.value, emit)
    }, { deep: true })

    watch(plugins, () => {
      updatePlugins(plugins.value, internalPlugins)
    }, { deep: true })

    return {
      canvas,
      chartInstance,
      renderChart
    }
  }
})
</script>
