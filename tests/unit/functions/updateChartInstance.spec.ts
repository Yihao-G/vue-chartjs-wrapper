import { mocked } from 'ts-jest/utils'
import { nextTick, Ref, ref } from 'vue'

jest.mock('chart.js')
// eslint-disable-next-line import/first
import Chart from 'chart.js'
// eslint-disable-next-line import/first
import updateChartInstance from '@/functions/updateChartInstance'

describe('updateChartInstance', () => {
  const mockedChart = mocked(Chart, true)

  let chartInstance: Ref<Chart | null>
  let emitFn: jest.Mock
  let dummyValue: Record<PropertyKey, unknown>

  const cases = (field: 'data' | 'options') => describe(`update ${field}`, () => {
    beforeEach(() => {
      mockedChart.mockClear()

      chartInstance = ref(new (mockedChart as any)() as Chart)
      emitFn = jest.fn()
      dummyValue = {}
    })

    it('should correctly update the field', () => {
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      expect(mockedChart.mock.instances[0][field]).toBe(dummyValue)
    })

    it('should invoke update in the next tick when needsUpdate is false', async () => {
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      await nextTick()

      expect(mockedChart.mock.instances[0].update).toBeCalledTimes(1)
    })

    it('should emit chart:update with empty payload in the next tick when needsUpdate is false', async () => {
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      await nextTick()

      expect(emitFn).toBeCalledTimes(1)
      expect(emitFn).toBeCalledWith('chart:update')
    })

    it('should immediately set needsUpdate to true', () => {
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      expect(needsUpdate.value).toBe(true)
    })

    it('should set needsUpdate to false in the next tick when needsUpdate is initially false', async () => {
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      expect(needsUpdate.value).toBe(true)

      await nextTick()

      expect(needsUpdate.value).toBe(false)
    })

    it('should still correctly update the field when needsUpdate is true', () => {
      const rendering = ref(false)
      const needsUpdate = ref(true)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      expect(mockedChart.mock.instances[0][field]).toBe(dummyValue)
    })

    it('should not invoke update, emit or change needsUpdate when needsUpdate become false after update', async () => {
      const rendering = ref(false)
      const needsUpdate = ref(true)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)
      expect(needsUpdate.value).toBe(true)

      needsUpdate.value = false
      await nextTick()
      expect(mockedChart.mock.instances[0].update).not.toBeCalled()
      expect(emitFn).not.toBeCalled()
      expect(needsUpdate.value).toBe(false)
    })

    it('should do nothing when both rendering and needsUpdate are true', async () => {
      const rendering = ref(true)
      const needsUpdate = ref(true)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)
      expect(needsUpdate.value).toBe(true)
      expect(mockedChart.mock.instances[0][field]).not.toBe(dummyValue)

      await nextTick()
      expect(mockedChart.mock.instances[0].update).not.toBeCalled()
      expect(emitFn).not.toBeCalled()
      expect(needsUpdate.value).toBe(true)
      expect(mockedChart.mock.instances[0][field]).not.toBe(dummyValue)
    })

    it('should do nothing when rendering is true but needsUpdate is false', async () => {
      const rendering = ref(true)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)
      expect(needsUpdate.value).toBe(false)
      expect(mockedChart.mock.instances[0][field]).not.toBe(dummyValue)

      await nextTick()
      expect(mockedChart.mock.instances[0].update).not.toBeCalled()
      expect(emitFn).not.toBeCalled()
      expect(needsUpdate.value).toBe(false)
      expect(mockedChart.mock.instances[0][field]).not.toBe(dummyValue)
    })

    it('should do nothing when the chart instance is null', async () => {
      mockedChart.mockClear()

      chartInstance = ref(null)
      const rendering = ref(false)
      const needsUpdate = ref(false)

      updateChartInstance(chartInstance, rendering, needsUpdate, field, dummyValue, emitFn)

      expect(needsUpdate.value).toBe(false)
      expect(mockedChart).not.toBeCalled()

      await nextTick()
      expect(emitFn).not.toBeCalled()
      expect(needsUpdate.value).toBe(false)
      expect(mockedChart).not.toBeCalled()
    })
  })

  cases('data')
  cases('options')
})
