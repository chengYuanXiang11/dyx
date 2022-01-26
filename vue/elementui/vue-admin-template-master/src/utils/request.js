import axios from 'axios'
// 弹窗和消息提示
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
// cookie
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookies
  timeout: 5000 // 请求时间限制
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 发送前做的事情

    if (store.getters.token) {
      // 每个请求都会携带token
      // ['X-Token']是一个自定义的密钥头
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 用于调试
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  //   如果您想获取http信息，如标头或状态
  //  *请return  response => response

  /**
   *通过自定义代码确定请求状态
   *这里只是一个例子
   *您还可以通过HTTP状态码来判断状态
   */
  response => {
    const res = response.data

    // 如果自定义代码不是20000，则判断为错误。
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法令牌；50012:其他客户端登录；50014:令牌过期；
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // 刷新当前文档
            location.reload()
          })
        })
      }
      // 返回错误
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // 用于调试
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
