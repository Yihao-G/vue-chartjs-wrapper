import { PluginServiceRegistrationOptions } from 'chart.js'

export default function updatePlugins (
  pluginsProp: PluginServiceRegistrationOptions[],
  plugins: PluginServiceRegistrationOptions[]
): void {
  // remove plugins that no longer exist
  const pluginsPropSet = new Set(pluginsProp)
  let i = plugins.length
  while (i--) {
    if (!pluginsPropSet.has(plugins[i])) {
      plugins.splice(i, 1)
    }
  }

  // add newly added plugins
  const newPlugins = new Set(pluginsProp)
  for (let j = 0; j < plugins.length; j++) {
    newPlugins.delete(plugins[j])
  }
  plugins.push(...newPlugins)
}
