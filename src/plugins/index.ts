import { App } from 'vue'
import { vantPlugins } from './vant'

export const setupPlugins = (app: App) => {
  app.use(vantPlugins)
}
