import { createApp } from 'vue'

describe('index.ts', () => {
  it('should globally register the Chart component when install', async () => {
    const app = createApp({})
      .use((await import('../../src')).default)

    expect(app.component('Chart')).toBeDefined()
  })

  it('should export Chart component', async () => {
    expect((await import('../../src')).Chart).toBeDefined()
  })
})
