import Chart from 'chart.js'

export type ChartEmitFn =
  ((event: 'chart:render', payload: Chart) => void)
  & ((event: 'chart:destroy', payload: void) => void)
  & ((event: 'chart:update', payload: void) => void)
