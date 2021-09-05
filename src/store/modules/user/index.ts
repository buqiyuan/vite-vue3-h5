/**
 * 用户信息模块
 */
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
