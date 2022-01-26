import axios from 'axios'
import { requestInterceptor, responseInterceptor } from './modules/huncun'
// 用一个变量存储目前处于pending状态的请求，用一个标识表明。
// 拦截发送请求，判断这个api请求之前是否已经有还在pending的同类，
// 即是否存在上述变量中，如果存在，则取消处理，不存在就正常发送，
// 等请求完结后删除这个api请求在上述变量中的标识，这是一个完整的处理取消重复请求的流程。

// Accept:text/xml； 本次请求希望接收的数据类型
// Content-Type:text/html 本次请求发送的数据类型

//请求的loading过渡
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式

// import qs from "qs"
// 用于存储目前状态为pending的请求标识信息
let pendingRequest = [];

const isProduction = process.env.NODE_ENV === "production";
const ajax = axios.create({
  method: 'post',
  baseURL: !isProduction ? "http://localhost:3000" : "http://localhost:3000",

  // baseURL: !isProduction ? "http://localhost:3000/api/" : "http://localhost:3000/api/",
  withCredentials: true,
  timeout: 20000,
  adapter: retryAdapterEnhancer(axios.defaults.adapter, {
    retryDelay: 1000,
  }),
  // //对请求的参数做处理
  // transformRequest:[function(data,headers){
  //     return  JSON.stringify(data)
  // }],

  // //对响应的结果做处理
  // transformResponse:[function (data){
  //     return data
  //   }],
  //设定请求头信息
  headers: { 'Content-Type': 'application/json;charset=utf8' },
  // url(get)参数
  // params:{},
  // `withCredentials` 表示跨域请求时是否需要使用凭证
  //   withCredentials: false, // default

  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default

  //响应结果字符集
  responseEncoding: 'utf8', // default

  // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
  xsrfCookieName: 'XSRF-TOKEN', // default安全设置

})
// 添加请求拦截器
ajax.interceptors.request.use(config => {
  // 在发送请求之前做些什么

  NProgress.start()

  // json转urlencoded格式
  // if(config.data instanceof Object){
  //  config.data= qs.stringify(config.data)
  // }
  // config.headers['Content-Type']='application/x-www-form-urlencoded'



  //获取token
  // const hasToken = store.getters.Token
  // if (hasToken) {
  //     config.headers['token'] = hasToken
  //   }

  //用于判断请求是否重复
  const requestMark = `${config.method} ${config.url}`;
  //finde查询重复
  const markIndex = pendingRequest.findIndex(item => {
    return item.name === requestMark;
  });
  // 存在，即重复了
  if (markIndex > -1) {
    // 取消上个重复的请求
    pendingRequest[markIndex].cancel({
      type: "repeat",
      data: '重复请求已经取消'
    });
    // 删掉在pendingRequest中的请求标识
    pendingRequest.splice(markIndex, 1);
  }
  //axios取消
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source()
  config.cancelToken = source.token;
  // 设置自定义配置requestMark项，主要用于响应拦截中
  config.requestMark = requestMark;

  config.retry = 5;//最大重新连接次数
  config.retryDelay = 1000 // 重连间隔
  config.cache = true
  pendingRequest.push({
    name: requestMark,
    cancel: source.cancel,
  });

  requestInterceptor(config, axios);
  return config;
}, error => {
  console.log(error.response)

  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
ajax.interceptors.response.use(response => {
  // 对响应数据做点什么a
  const requestMark = `${response.config.method} ${response.config.url}`;
  const markIndex = pendingRequest.findIndex(item => {
    return item.name === requestMark;
  });
  markIndex > -1 && pendingRequest.splice(markIndex, 1);
  // const res = response.data;
  // const { error } = res
  // if (error) {
  //   //如果存在报错
  //   // 弹出请求报错信息
  //   // switch (error.code) {
  //   //     case '1000':
  //   //     case '1001':
  //   //     case '1002':
  //   //     case '1003':
  //   //       router.replace({ path: '/error', query: { code: error.code, msg: error.msg } })
  //   //       break;
  //   //     case '6000':
  //   //     case '6100':
  //   //       // 清空Token 重新登录
  //   //       store.dispatch('user/resetToken')
  //   //       return Promise.reject(new Error(error.msg));
  //   //     case '6200':
  //   //     case '7000':
  //   //     case '19000':
  //   //     default:
  //   //       // 如果状态码不是 则判断为报错信息
  //   //       return Promise.reject(new Error(error.msg))
  //   //   }
  // } else {
  // return res
  // }
  responseInterceptor(response)

  NProgress.done()
  return response;
}, error => {
  const { config } = error;
  //取消请求时处理
  if (axios.isCancel(error)) {
    const { message: { type, data } } = error
    if (type === "repeat") {
      console.log(data)
    } else {
      console.log('使用缓存')

    }
    NProgress.done()
    //取消则中断promise
    return new Promise((() => { }))
  }
  if (!config || !config.retry) {
    return Promise.reject(error);
  }
  NProgress.done()
  // againRequest(error,axios)
  // 对响应错误做点什么
  // 弹出请求报错信息
  return Promise.reject(error);
});

//请求重发
function retryAdapterEnhancer(adapter, options) {
  return async (config) => {
    const { retry, retryDelay } = config;
    let __retryCount = 0;
    const request = async () => {
      try {
        return await adapter(config);
      } catch (err) {
        // 判断是否进行重试
        if (!retry || __retryCount >= retry) {
          return Promise.reject(err);
        }
        __retryCount++; // 增加重试次数
        // 延时处理
        const delay = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, retryDelay);
        });
        // 重新发起请求
        return delay.then(() => {
          return request();
        });
      }
    };
    return request();
  };
}





export default ajax