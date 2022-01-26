import axios from 'axios'
// axios封装
const ajax=axios.create({
    method:'post',
    baseURL:"http://localhost:3000/api/",
    timeout:20000,
    //对请求的参数做处理
    transformRequest:[function(data,headers){
        return  JSON.stringify(data)
    }],
    //对响应的结果做处理
    transformResponse:[function (data){
        return data
      }],
      //设定请求头信息
      headers:{'Content-Type':'application/json;charset=utf8'},
    // url(get)参数
    // params:{},
     // `withCredentials` 表示跨域请求时是否需要使用凭证
//   withCredentials: false, // default

  // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: 'json', // default
  
  //响应结果字符集
  responseEncoding: 'utf8', // default

   // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
   xsrfCookieName: 'XSRF-TOKEN', // default安全设置s
   proxy: {
    host: '127.0.0.1',
    port: 7001,
  },
})
// 添加请求拦截器
ajax.interceptors.request.use(config =>{
    // 在发送请求之前做些什么
    return config;
  },error=> {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
ajax.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
  }, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
export default ajax