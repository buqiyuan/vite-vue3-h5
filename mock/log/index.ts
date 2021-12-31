import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

import data from './_cateList.json';

export default [
  {
    url: '/mock-api/category/list',
    timeout: 0,
    method: 'get',
    response: ({ query }) => {
      console.log('query', query);

      return resultSuccess(data);
    },
  },
] as MockMethod[];
