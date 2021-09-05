import request from '@/utils/request'
import { LoginParams, LoginResult } from './models/userModel'

enum Api {
  getUserId = '/base/appLogin' // 获取用户userid
}

// 根据code获取userid / token
export function getUserId(data: LoginParams) {
  return request<LoginResult>({
    url: Api.getUserId,
    method: 'post',
    data
  })
}
