import axios, { InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import { closeToast, showFailToast, showLoadingToast, showToast } from 'vant';
import { ContentTypeEnum } from './httpEnum';
import { useUserStore } from '@/store/modules/user';
import router from '@/router';

// create an axios instance
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // url = base api url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
});
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  hideLoading?: boolean;
}

interface BaseResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// request拦截器 request interceptor
service.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // 不传递默认开启loading
    if (!config.hideLoading) {
      // loading
      showLoadingToast({
        forbidClick: true,
      });
    }
    const userStore = useUserStore();
    console.log(userStore, "store.getters['user']");
    if (userStore.token && config.headers) {
      config.headers['X-Token'] = userStore.token;
    }
    const contentType = config.headers?.['content-type'] || config.headers?.['Content-Type'];
    const data = config.data;
    if (config.method?.toLocaleUpperCase() == 'POST' && data) {
      if (ContentTypeEnum.FORM_DATA == contentType) {
        const fd = new FormData();
        Object.keys(data).forEach((key) => fd.append(key, data[key]));
        config.data = fd;
      } else if (ContentTypeEnum.FORM_URLENCODED == contentType) {
        config.data = qs.stringify(config.data);
      }
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  },
);
// respone拦截器
service.interceptors.response.use(
  (response) => {
    closeToast(true);
    const res = response.data;
    if (res.code && res.code !== 200) {
      // 登录超时,重新登录
      if (res.code === 401) {
        // store.dispatch('FedLogOut').then(() => {
        //   location.reload()
        // })
        router.replace('/error');
      } else {
        showToast(res.msg || '服务器访问出错了~');
      }
      return Promise.reject(res || 'error');
    } else {
      return Promise.resolve(response);
    }
  },
  (error: Error) => {
    if (error.message?.includes('timeout')) {
      showFailToast('请求超时!');
    }
    console.log(`err${error}`); // for debug
    return Promise.reject(error);
  },
);

const request = <T = any>(config: Partial<CustomAxiosRequestConfig>): Promise<BaseResponse<T>> => {
  return new Promise((resolve, reject) => {
    service
      .request<BaseResponse<T>>(config)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

export default request;
