import { RequestConfig } from 'umi';

export const request: RequestConfig = {
  requestInterceptors: [],
  responseInterceptors: [],
  errorConfig: {
    adaptor: (res) => {
      return {
        success: res.success,
        errorMessage: res.msg,
        code: res.code,
        data: res.data
      }
    }
  }
};