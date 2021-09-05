// 用户登录参数
export interface LoginParams {
  account: string
  password: string
}

/**
 * @description 登录成功返回结果
 */
export interface LoginResult {
  username: string
  avatar: string
  token: string
}
