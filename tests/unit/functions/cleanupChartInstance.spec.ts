import { ref } from 'vue'
import { mocked } from 'ts-jest/utils'

jest.mock('chart.js')
// eslint-disable-next-line import/first
import cleanupChartInstance from '@/functions/cleanupChartInstance'
// eslint-disable-next-line import/first
import Chart from 'chart.js'

describe('cleanupChartInstance', () => {
  const mockedChart = mocked(Chart, true)

  beforeEach(() => {
    mockedChart.mockClear()
  })

  it('should invoke destroy on the chart instance', () => {
    const chartInstance = ref(new (mockedChart as any)() as Chart)
    const emitFn = jest.fn()

    cleanupChartInstance(chartInstance, emitFn)

    expect(mockedChart.mock.instances[0].destroy).toBeCalledTimes(1)
  })

  it('should set ref to null', () => {
    const chartInstance = ref(new (mockedChart as any)() as Chart)
    const emitFn = jest.fn()

    cleanupChartInstance(chartInstance, emitFn)

    expect(chartInstance.value).toBeNull()
  })

  it('should emit chart:destroy event with empty payload', () => {
    const chartInstance = ref(new (mockedChart as any)() as Chart)
    const emitFn = jest.fn()

    cleanupChartInstance(chartInstance, emitFn)

    expect(emitFn).toBeCalledTimes(1)
    expect(emitFn).toBeCalledWith('chart:destroy')
  })

  it('should not emit `chart:destroy` event with null chart instance', () => {
    const chartInstance = ref(null)
    const emitFn = jest.fn()

    cleanupChartInstance(chartInstance, emitFn)

    expect(emitFn).not.toBeCalled()
  })
})
