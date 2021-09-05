import { IUserState } from './state'

export const mutations = {
  setToken: (state: IUserState, token: string) => {
    state.token = token
  },
  setAvatar: (state: IUserState, avatar: string) => {
    state.avatar = avatar
  },
  setRoles: (state: IUserState, roles) => {
    state.roles = roles
  },
  setUserInfo: (state: IUserState, info) => {
    state.info = info
  }
}
