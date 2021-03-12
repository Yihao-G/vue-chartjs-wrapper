import { mount } from '@vue/test-utils'
import { mocked } from 'ts-jest/utils'
import { nextTick } from 'vue'

jest.mock('chart.js')
// eslint-disable-next-line import/first
import Chart, { ChartData, ChartOptions, ChartType, PluginServiceRegistrationOptions } from 'chart.js'
// eslint-disable-next-line import/first
import ChartComponent from '@/Chart.vue'

describe('Chart component', () => {
  const mockedChart = mocked(Chart, true)
  let type: ChartType | string
  let data: ChartData
  let options: ChartOptions
  let plugins: PluginServiceRegistrationOptions[]
  let wrapper = mount(ChartComponent, { props: { type: 'bar' } }) // initial value is only for getting the type of mount

  const expectChartInstanceDestroyAndRecreate = () => {
    expect(mockedChart.mock.instances[0].destroy).toBeCalledTimes(1)
    expect(wrapper.emitted()['chart:destroy']).toHaveLength(1)
    expect(wrapper.emitted()['chart:destroy'][0]).toStrictEqual([])
    expect(mockedChart).toBeCalledTimes(2)
    expect(wrapper.emitted()['chart:render']).toHaveLength(2)
    expect(wrapper.emitted()['chart:render'][1]).toStrictEqual([wrapper.vm.chartInstance])
  }

  const expectChartInstanceNotRecreated = () => {
    expect(mockedChart.mock.instances[0].destroy).not.toBeCalled()
    expect(mockedChart).toBeCalledTimes(1)
  }

  beforeEach(async () => {
    mockedChart.mockClear()

    // prepare Chart component
    type = 'bar'
    data = { labels: ['foo', 'bar', 'baz'] }
    options = { aspectRatio: 1 }
    plugins = [{ [Symbol('plugin1')]: null }]
    wrapper = mount(ChartComponent, {
      props: {
        type,
        data,
        options,
        plugins
      }
    })
    await nextTick()
  })

  it('should render div and canvas elements if wrapped (default)', () => {
    expect((wrapper.vm.$el as Element).tagName.toLowerCase()).toBe('div')
    expect(wrapper.find('div > canvas').exists()).toBe(true)
  })

  it('should render canvas element only if not wrapped', async () => {
    await wrapper.setProps({ wrapped: false })

    expect((wrapper.vm.$el as Element).tagName.toLowerCase()).toBe('canvas')
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('should do initial render with configuration correctly set up', async () => {
    await nextTick()

    expect(mockedChart).toBeCalledTimes(1)
    expect(mockedChart).toBeCalledWith(wrapper.get('div > canvas').element, {
      type,
      data,
      options,
      plugins
    })
    expect(wrapper.emitted()['chart:render']).toHaveLength(1)
    expect(wrapper.emitted()['chart:render'][0]).toStrictEqual([wrapper.vm.chartInstance])
  })

  it('should rerender when type changes', async () => {
    await wrapper.setProps({ type: 'line' })

    expectChartInstanceDestroyAndRecreate()
    expect(mockedChart).toBeCalledWith(wrapper.get('div > canvas').element, {
      type: 'line',
      data,
      options,
      plugins
    })
  })

  it('should rerender when wrapped changes', async () => {
    await wrapper.setProps({ wrapped: false })

    expectChartInstanceDestroyAndRecreate()
    expect(mockedChart).toBeCalledWith(wrapper.vm.$el, {
      type: 'bar',
      data,
      options,
      plugins
    })
  })

  it('should update options', async () => {
    const newOptions = { aspectRatio: 3 }
    await wrapper.setProps({ options: newOptions })

    expectChartInstanceNotRecreated()
    expect(mockedChart.mock.instances[0].options).toBe(newOptions)
    await nextTick()

    expect(mockedChart.mock.instances[0].update).toBeCalledTimes(1)
    expect(wrapper.emitted()['chart:update']).toHaveLength(1)
    expect(wrapper.emitted()['chart:update'][0]).toStrictEqual([])
  })

  it('should update data', async () => {
    const newData = { labels: ['a', 'b', 'c'] }
    await wrapper.setProps({ data: newData })

    expectChartInstanceNotRecreated()
    expect(mockedChart.mock.instances[0].data).not.toBe(data) // data should always be deep cloned
    expect(mockedChart.mock.instances[0].data).toStrictEqual(newData)
    await nextTick()

    expect(mockedChart.mock.instances[0].update).toBeCalledTimes(1)
    expect(wrapper.emitted()['chart:update']).toHaveLength(1)
    expect(wrapper.emitted()['chart:update'][0]).toStrictEqual([])
  })

  it('should update plugins', () => {
    plugins.push({ [Symbol('new plugin')]: null })

    expectChartInstanceNotRecreated()
    expect(mockedChart.mock.instances[0].update).not.toBeCalled()
    expect(wrapper.emitted()['chart:update']).not.toBeDefined()
  })

  it('should destroy the chart instance when component unmounts', function () {
    wrapper.unmount()

    expect(mockedChart.mock.instances[0].destroy).toBeCalledTimes(1)
    expect(wrapper.emitted()['chart:destroy']).toHaveLength(1)
    expect(wrapper.emitted()['chart:destroy'][0]).toStrictEqual([])
  })

  it('should expose the chart instance', () => {
    expect(wrapper.vm.chartInstance).toBeDefined()
  })

  it('should expose the canvas element', () => {
    expect(wrapper.vm.canvas).toBe(wrapper.find('div > canvas').element)
  })

  it('should expose renderChart function and works', () => {
    expect(wrapper.vm.renderChart).toBeDefined()

    wrapper.vm.renderChart()

    expectChartInstanceDestroyAndRecreate()
  })
})
