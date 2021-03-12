import { App } from 'vue'
import Chart from './Chart.vue'

/**
 * Install this plugin by registering the Chart component as a global component.
 */
function install (app: App): void {
  app.component('Chart', Chart)
}

export default install
export { Chart }
