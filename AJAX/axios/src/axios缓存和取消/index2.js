import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

const isProduction = process.env.NODE_ENV === "production";
const ajax = axios.create({
  method: 'get',
  baseURL: !isProduction ? "https://api.wrdan.com/" : "https://api.wrdan.com/",
  timeout: 20000,
})
// 添加请求拦截器
ajax.interceptors.request.use(config => {
  NProgress.start()

return config;

}, error => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
ajax.interceptors.response.use(response => {
    return response
}, error => {
  return Promise.reject(error);
});
export default ajax