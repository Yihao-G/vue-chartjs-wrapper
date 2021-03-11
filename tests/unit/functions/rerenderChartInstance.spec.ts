import { mocked } from 'ts-jest/utils'
import { nextTick, ref } from 'vue'

jest.mock('@/functions/cleanupChartInstance')
jest.mock('chart.js')
// eslint-disable-next-line import/first
import cleanupChartInstance from '@/functions/cleanupChartInstance'
// eslint-disable-next-line import/first
import rerenderChartInstance from '@/functions/rerenderChartInstance'
// eslint-disable-next-line import/first
import Chart, { PluginServiceRegistrationOptions } from 'chart.js'

describe('renderChartInstance', () => {
  const mockedChart = mocked(Chart, true)
  const mockedCleanupChartInstance = mocked(cleanupChartInstance)

  const cases = (needsUpdateValue: boolean) => describe(`when needsUpdate is ${needsUpdateValue}`, () => {
    beforeEach(() => {
      mockedChart.mockClear()
      mockedCleanupChartInstance.mockClear()
    })

    it('should create new chart instance when the instance is null', () => {
      const chartInstance = ref(null)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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

      expect(Chart).toBeCalledTimes(1)
      expect(chartInstance.value).toStrictEqual(mockedChart.mock.instances[0])
    })

    it('should recreate new chart instance when the instance is not null', () => {
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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

      expect(Chart).toBeCalledTimes(2) // the first time was invoked in the test
      expect(chartInstance.value).toStrictEqual(mockedChart.mock.instances[1])
    })

    it('should invoke cleanupChartInstance when the chart instance is not null', () => {
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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

      expect(cleanupChartInstance).toBeCalledTimes(1)
      expect(cleanupChartInstance).toBeCalledWith(chartInstance, emitFn)
    })

    it('should do nothing if rendering is already true', () => {
      const chart = new (mockedChart as any)() as Chart
      const chartInstance = ref(chart)
      const rendering = ref(true)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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

      expect(Chart).toBeCalledTimes(1) // only invoked in the test
      expect(cleanupChartInstance).not.toBeCalled()
      expect(chartInstance.value).toStrictEqual(chart)
      expect(emitFn).not.toBeCalled()
    })

    it('should immediately set rendering to true', () => {
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
      const chartType = 'bar'
      const chartData = {}
      const chartOptions = {}
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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
      const chartInstance = ref(new (mockedChart as any)() as Chart)
      const rendering = ref(false)
      const needsUpdate = ref(needsUpdateValue)
      const canvas = document.createElement('canvas')
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
      const chartPlugins: PluginServiceRegistrationOptions[] = []
      const emitFn = jest.fn()
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

      expect(Chart).toBeCalledTimes(2) // the first time was invoked in the test
      expect(Chart).toBeCalledWith(canvas, {
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
