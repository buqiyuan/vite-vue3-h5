import { ActionContext } from 'vuex'
import { IUserState } from './state'
import { IStore } from '@/store/types'

export const actions = {
  // 登录
  async login({ commit }: ActionContext<IUserState, IStore>, userInfo) {
    // TODO 根据自己需要写
  },
  // 登出
  async logout({ commit }: ActionContext<IUserState, IStore>) {
    return Promise.resolve()
  }
}
