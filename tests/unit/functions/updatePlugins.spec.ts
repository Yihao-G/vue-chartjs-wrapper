import updatePlugins from '@/functions/updatePlugins'

describe('updatePlugins', () => {
  it('should add new plugins', () => {
    const plugin1 = { [Symbol('plugin1')]: null }
    const plugin2 = { [Symbol('plugin2')]: null }
    const plugin3 = { [Symbol('plugin3')]: null }
    const plugin4 = { [Symbol('plugin4')]: null }
    const plugin5 = { [Symbol('plugin5')]: null }
    const plugin6 = { [Symbol('plugin6')]: null }

    const initialPlugins = [plugin1, plugin2, plugin3]
    const updatedPlugins = [plugin1, plugin2, plugin3, plugin4, plugin5, plugin6]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
  })

  it('should remove plugins', () => {
    const plugin1 = { [Symbol('plugin1')]: null }
    const plugin2 = { [Symbol('plugin2')]: null }
    const plugin3 = { [Symbol('plugin3')]: null }
    const plugin4 = { [Symbol('plugin4')]: null }
    const plugin5 = { [Symbol('plugin5')]: null }
    const plugin6 = { [Symbol('plugin6')]: null }

    const initialPlugins = [plugin1, plugin2, plugin3, plugin4, plugin5, plugin6]
    const updatedPlugins = [plugin1, plugin2, plugin3]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
    expect(initialPlugins).toEqual(expect.not.arrayContaining([plugin4, plugin5, plugin6]))
  })

  it('should add and remove plugins', () => {
    const plugin1 = { [Symbol('plugin1')]: null }
    const plugin2 = { [Symbol('plugin2')]: null }
    const plugin3 = { [Symbol('plugin3')]: null }
    const plugin4 = { [Symbol('plugin4')]: null }
    const plugin5 = { [Symbol('plugin5')]: null }
    const plugin6 = { [Symbol('plugin6')]: null }

    const initialPlugins = [plugin1, plugin2, plugin3, plugin4]
    const updatedPlugins = [plugin1, plugin3, plugin5, plugin6]

    updatePlugins(updatedPlugins, initialPlugins)

    expect(initialPlugins).toEqual(expect.arrayContaining(updatedPlugins))
    expect(initialPlugins).toEqual(expect.not.arrayContaining([plugin2, plugin4]))
  })

  it('should not mutate pluginsProp', () => {
    const plugin1 = { [Symbol('plugin1')]: null }
    const plugin2 = { [Symbol('plugin2')]: null }
    const plugin3 = { [Symbol('plugin3')]: null }
    const plugin4 = { [Symbol('plugin4')]: null }
    const plugin5 = { [Symbol('plugin5')]: null }
    const plugin6 = { [Symbol('plugin6')]: null }

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
