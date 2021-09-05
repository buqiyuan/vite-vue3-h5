import { createStore, useStore as baseUseStore, createLogger, Store } from 'vuex'
// import createPersistedState from 'vuex-persistedstate';
import { App, InjectionKey } from 'vue'
import modules from '@/store/modules'
import { IStore } from './types'

export const key: InjectionKey<Store<IStore>> = Symbol()

// 在开发环境中开启logger
const debug = process.env.NODE_ENV !== 'production'

const plugins = debug
  ? [
      createLogger({
        filter(mutation, stateBefore, stateAfter) {
          // 若 mutation 需要被记录，就让它返回 true 即可
          // 顺便，`mutation` 是个 { type, payload } 对象
          const notNeedDebugs: string[] = ['lockscreen/setLockTime', 'lockscreen/setLock']
          return !notNeedDebugs.includes(mutation.type)
        }
      })
    ]
  : []
// 可以根据自己需要添加其他插件，例如：vuex持久化插件
// plugins.push(createPersistedState({ storage: window.sessionStorage }));

const store = createStore<IStore>({
  plugins,
  modules
})

// 定义你自己的“useStore”组合函数
export function useStore() {
  return baseUseStore(key)
}

export function setupStore(app: App) {
  app.use(store, key)
  console.log(store, 'vuex')
}

export default store
