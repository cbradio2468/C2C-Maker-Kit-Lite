/**
 * PLUGIN CONFIGURATION
 * 
 * This file defines the plugin configuration and registry.
 * It manages plugin discovery, loading, and execution.
 * 
 * LEARNING GOALS:
 * - Understand plugin architecture patterns
 * - Learn configuration management
 * - See dependency injection patterns
 * - Understand plugin lifecycle
 */

export interface PluginConfig {
  name: string
  path: string
  enabled: boolean
  config?: Record<string, any>
  dependencies?: string[]
}

export interface Plugin {
  name: string
  version: string
  description: string
  initialize(): Promise<void>
  execute(data: any): Promise<any>
  cleanup(): Promise<void>
}

export interface PluginManager {
  loadPlugin(config: PluginConfig): Promise<Plugin>
  unloadPlugin(name: string): Promise<void>
  executePlugin(name: string, data: any): Promise<any>
  getPlugin(name: string): Plugin | undefined
  listPlugins(): Plugin[]
}

/**
 * Plugin Configuration
 * 
 * This defines which plugins are available and how they're configured.
 * In a real application, this might be loaded from a database or file.
 */
export const pluginConfig: PluginConfig[] = [
  {
    name: 'HelloPlugin',
    path: './plugins/HelloPlugin',
    enabled: true,
    config: {
      greeting: 'Hello',
      language: 'en'
    }
  },
  {
    name: 'DataPlugin',
    path: './plugins/DataPlugin',
    enabled: true,
    config: {
      processingMode: 'async',
      timeout: 5000
    }
  },
  {
    name: 'UIPlugin',
    path: './plugins/UIPlugin',
    enabled: true,
    config: {
      theme: 'light',
      animations: true
    }
  }
]

/**
 * Plugin Registry
 * 
 * This manages the loaded plugins and provides access to them.
 */
class PluginRegistry implements PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private configs: Map<string, PluginConfig> = new Map()

  constructor() {
    // Initialize with configuration
    pluginConfig.forEach(config => {
      this.configs.set(config.name, config)
    })
  }

  async loadPlugin(config: PluginConfig): Promise<Plugin> {
    try {
      // In a real application, you would dynamically import the plugin
      // For this example, we'll use a simple factory pattern
      const plugin = this.createPlugin(config)
      
      // Initialize the plugin
      await plugin.initialize()
      
      // Register the plugin
      this.plugins.set(config.name, plugin)
      
      console.log(`Plugin ${config.name} loaded successfully`)
      return plugin
    } catch (error) {
      console.error(`Failed to load plugin ${config.name}:`, error)
      throw error
    }
  }

  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name)
    if (plugin) {
      try {
        await plugin.cleanup()
        this.plugins.delete(name)
        console.log(`Plugin ${name} unloaded successfully`)
      } catch (error) {
        console.error(`Failed to unload plugin ${name}:`, error)
        throw error
      }
    }
  }

  async executePlugin(name: string, data: any): Promise<any> {
    const plugin = this.plugins.get(name)
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`)
    }

    try {
      return await plugin.execute(data)
    } catch (error) {
      console.error(`Failed to execute plugin ${name}:`, error)
      throw error
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name)
  }

  listPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  private createPlugin(config: PluginConfig): Plugin {
    // This is a simplified factory pattern
    // In a real application, you would dynamically import the plugin module
    switch (config.name) {
      case 'HelloPlugin':
        return new HelloPlugin(config.config)
      case 'DataPlugin':
        return new DataPlugin(config.config)
      case 'UIPlugin':
        return new UIPlugin(config.config)
      default:
        throw new Error(`Unknown plugin: ${config.name}`)
    }
  }
}

// Export singleton instance
export const pluginRegistry = new PluginRegistry()

/**
 * Example Plugin Implementations
 * 
 * These are simple examples of how plugins might be implemented.
 * In a real application, these would be in separate files.
 */

class HelloPlugin implements Plugin {
  name = 'HelloPlugin'
  version = '1.0.0'
  description = 'A simple greeting plugin'
  
  private config: Record<string, any>

  constructor(config: Record<string, any> = {}) {
    this.config = config
  }

  async initialize(): Promise<void> {
    console.log('HelloPlugin initialized')
  }

  async execute(data: any): Promise<any> {
    const greeting = this.config.greeting || 'Hello'
    const name = data.name || 'World'
    return { message: `${greeting}, ${name}!` }
  }

  async cleanup(): Promise<void> {
    console.log('HelloPlugin cleaned up')
  }
}

class DataPlugin implements Plugin {
  name = 'DataPlugin'
  version = '1.0.0'
  description = 'A data processing plugin'
  
  private config: Record<string, any>

  constructor(config: Record<string, any> = {}) {
    this.config = config
  }

  async initialize(): Promise<void> {
    console.log('DataPlugin initialized')
  }

  async execute(data: any): Promise<any> {
    // Simulate data processing
    const processed = {
      ...data,
      processed: true,
      timestamp: new Date().toISOString(),
      plugin: this.name
    }
    
    return processed
  }

  async cleanup(): Promise<void> {
    console.log('DataPlugin cleaned up')
  }
}

class UIPlugin implements Plugin {
  name = 'UIPlugin'
  version = '1.0.0'
  description = 'A UI component plugin'
  
  private config: Record<string, any>

  constructor(config: Record<string, any> = {}) {
    this.config = config
  }

  async initialize(): Promise<void> {
    console.log('UIPlugin initialized')
  }

  async execute(data: any): Promise<any> {
    // Simulate UI rendering
    return {
      component: 'Button',
      props: {
        text: data.text || 'Click me',
        theme: this.config.theme || 'light',
        animated: this.config.animations || false
      }
    }
  }

  async cleanup(): Promise<void> {
    console.log('UIPlugin cleaned up')
  }
}
