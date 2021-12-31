import { defineStore } from 'pinia';
import { Storage } from '@/utils/Storage';

interface UserState {
  token: string;
  name: string;
  avatar: string;
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: Storage.get('ACCESS_TOKEN_KEY', null),
    name: 'amdin',
    avatar: '',
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
  },
  actions: {
    // 清空token及用户信息
    resetToken() {
      this.avatar = this.token = this.name = '';
    },
    // 登录成功保存token
    setToken(token: string) {
      this.token = token ?? '';
      // const ex = 7 * 24 * 60 * 60 * 1000;
      // Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
    },
    // 登录
    // async login(params: API.LoginParams) {
    //   try {
    //     const { data } = await login(params);
    //     this.setToken(data.token);
    //     return this.afterLogin();
    //   } catch (error) {
    //     return Promise.reject(error);
    //   }
    // },
    // 登录成功之后, 获取用户信息以及生成权限路由
    async afterLogin() {
      try {
        // const wsStore = useWsStore();
        // const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()]);
        // this.perms = perms;
        // this.name = userInfo.name;
        // this.avatar = userInfo.headImg;
        // this.userInfo = userInfo;
        // // 生成路由
        // const generatorResult = generatorDynamicRouter(menus);
        // this.menus = generatorResult.menus;
        // wsStore.initSocket();
        // return { menus, perms, userInfo };
      } catch (error) {
        // return this.logout();
      }
    },
    // 登出
    async logout() {
      // await logout();
      // const wsStore = useWsStore();
      // wsStore.closeSocket();
      // this.resetToken();
      // resetRouter();
    },
  },
});
