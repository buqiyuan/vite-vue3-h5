import request from '@/utils/request';

// 获取商品分类
export function getCateList() {
  return request({
    url: '/mock-api/category/list',
    method: 'get',
  });
}
