import { mocked } from 'ts-jest/utils'
import { nextTick, Ref, ref } from 'vue'

jest.mock('@/functions/cleanupChartInstance')
jest.mock('chart.js')
// eslint-disable-next-line import/first
import cleanupChartInstance from '@/functions/cleanupChartInstance'
// eslint-disable-next-line import/first
import rerenderChartInstance from '@/functions/rerenderChartInstance'
// eslint-disable-next-line import/first
import Chart, { ChartData, ChartOptions, PluginServiceRegistrationOptions } from 'chart.js'

describe('renderChartInstance', () => {
  const mockedChart = mocked(Chart, true)
  const mockedCleanupChartInstance = mocked(cleanupChartInstance)

  let chart: Chart
  let chartInstance: Ref<Chart | null>
  let emitFn: jest.Mock
  let chartData: ChartData
  let chartOptions: ChartOptions
  let chartPlugins: PluginServiceRegistrationOptions[]
  let canvas: HTMLCanvasElement
  let needsUpdate: Ref<boolean>

  const cases = (needsUpdateValue: boolean) => describe(`when needsUpdate is ${needsUpdateValue}`, () => {
    beforeEach(() => {
      mockedChart.mockClear()
      mockedCleanupChartInstance.mockClear()

      chart = new (mockedChart as any)() as Chart
      chartInstance = ref(chart)
      emitFn = jest.fn()
      chartData = {}
      chartOptions = {}
      chartPlugins = []
      canvas = document.createElement('canvas')
      needsUpdate = ref(needsUpdateValue)
    })

    it('should create new chart instance when the instance is null', () => {
      chartInstance = ref(null)
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(mockedChart).toBeCalledTimes(2) // the first time was invoked in beforeEach
      expect(chartInstance.value).toStrictEqual(mockedChart.mock.instances[1])
    })

    it('should recreate new chart instance when the instance is not null', () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(mockedChart).toBeCalledTimes(2) // the first time was invoked in beforeEach
      expect(chartInstance.value).toStrictEqual(mockedChart.mock.instances[1])
    })

    it('should invoke cleanupChartInstance when the chart instance is not null', () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(mockedCleanupChartInstance).toBeCalledTimes(1)
      expect(mockedCleanupChartInstance).toBeCalledWith(chartInstance, emitFn)
    })

    it('should do nothing if rendering is already true', () => {
      const rendering = ref(true)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(mockedChart).toBeCalledTimes(1) // only invoked in the beforeEach
      expect(mockedCleanupChartInstance).not.toBeCalled()
      expect(chartInstance.value).toStrictEqual(chart)
      expect(emitFn).not.toBeCalled()
    })

    it('should immediately set rendering to true', () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(rendering.value).toBe(true)
    })

    it('should set rendering to false in the next tick', async () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(rendering.value).toBe(true)
      await nextTick()
      expect(rendering.value).toBe(false)
    })

    it('should set needsUpdate to false in the next tick', async () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      await nextTick()
      expect(needsUpdate.value).toBe(false)
    })

    it('should emit chart:render with the instance as the payload', () => {
      const rendering = ref(false)
      const chartType = 'bar'
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(emitFn).toBeCalledTimes(1)
      expect(emitFn).toBeCalledWith('chart:render', chartInstance.value)
    })

    it('should create the chart instance correctly', () => {
      const rendering = ref(false)
      const chartType = 'bar'
      const chartData = {
        labels: ['foo', 'bar', 'baz'],
        datasets: [{
          data: [1, 2, 3, 4, 5]
        }]
      }
      const chartOptions = {
        aspectRatio: 1,
        title: {
          display: true,
          text: 'My Chart'
        }
      }
      rerenderChartInstance(
        chartInstance,
        rendering,
        needsUpdate,
        canvas,
        chartType,
        chartData,
        chartOptions,
        chartPlugins,
        emitFn
      )

      expect(mockedChart).toBeCalledTimes(2) // the first time was invoked in beforeEach
      expect(mockedChart).toBeCalledWith(canvas, {
        type: chartType,
        data: chartData,
        options: chartOptions,
        plugins: chartPlugins
      })
    })
  })

  cases(true)
  cases(false)
})
