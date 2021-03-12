import updatePlugins from '@/functions/updatePlugins'

describe('updatePlugins', () => {
  let plugin1: Record<PropertyKey, unknown>
  let plugin2: Record<PropertyKey, unknown>
  let plugin3: Record<PropertyKey, unknown>
  let plugin4: Record<PropertyKey, unknown>
  let plugin5: Record<PropertyKey, unknown>
  let plugin6: Record<PropertyKey, unknown>

  beforeEach(() => {
    plugin1 = { [Symbol('plugin1')]: null }
    plugin2 = { [Symbol('plugin2')]: null }
    plugin3 = { [Symbol('plugin3')]: null }
    plugin4 = { [Symbol('plugin4')]: null }
    plugin5 = { [Symbol('plugin5')]: null }
    plugin6 = { [Symbol('plugin6')]: null }
  })

  it('should add new plugins', () => {
    const initialPlugins = [plugin1, plugin2, plugin3]
    const updatedPlugins = [plugin1, plugin2, plugin3, plugin4, plugin5, plugin6]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
  })

  it('should remove plugins', () => {
    const initialPlugins = [plugin1, plugin2, plugin3, plugin4, plugin5, plugin6]
    const updatedPlugins = [plugin1, plugin2, plugin3]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
    expect(initialPlugins).toEqual(expect.not.arrayContaining([plugin4, plugin5, plugin6]))
  })

  it('should add and remove plugins', () => {
    const initialPlugins = [plugin1, plugin2, plugin3, plugin4]
    const updatedPlugins = [plugin1, plugin3, plugin5, plugin6]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
    expect(initialPlugins).toEqual(expect.not.arrayContaining([plugin2, plugin4]))
  })

  it('should not mutate pluginsProp', () => {
    const initialPlugins = [plugin1, plugin2, plugin3]
    const updatedPlugins = [plugin1, plugin2, plugin4, plugin5, plugin6]
    const updatedPluginsCopy = updatedPlugins.slice()

    updatePlugins(updatedPlugins, initialPlugins)

    expect(updatedPlugins).toStrictEqual(updatedPluginsCopy)
    for (let i = 0; i < updatedPluginsCopy.length; i++) {
      expect(updatedPlugins[i]).toBe(updatedPluginsCopy[i])
    }
  })
})
