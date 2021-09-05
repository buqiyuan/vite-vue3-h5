import { IUserState } from './state'

export const getters = {
  token: (state: IUserState) => state.token,
  avatar: (state: IUserState) => state.avatar,
  nickname: (state: IUserState) => state.name,
  roles: (state: IUserState) => state.roles,
  userInfo: (state: IUserState) => state.info
}
