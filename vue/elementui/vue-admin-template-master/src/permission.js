import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie获取令牌
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// // 根据后台路由信息建立路由表
// const routerList = Routingprocessing(menuList)
// console.log(routerList)
// router.options.routes = router.options.routes.concat(routerList)
// // 添加路由表到Router
// router.addRoutes(routerList)

// router.options.routes = router.options.routes.concat(routerList)
const whiteList = ['/login'] // 白名单重定向
router.beforeEach(async (to, from, next) => {
  console.log(to)
  console.log(from)

  // 开启进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // router.addRoutes([...menuList])
  // 确定用户是否已登录 拿取token
  const hasToken = getToken()

  if (hasToken) {
    // 如果token存在，不进入登陆界面,直接进入主页
    if (to.path === '/login') {
      next({ path: '/' })
      // 进度条关闭
      NProgress.done()
    }
    else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          // 刷新重建路由表
          if (to.path !== '/login' && store.state.user.statu === 0) {
            await store.dispatch('user/refresh')
            next(to)
          }
        } catch (error) {
          // 删除令牌并转到登录页以重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有令牌

    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单
      next()
    } else {
      // 其他没有访问权限的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }

}
)
router.afterEach(() => {
  // 完成进度条
  NProgress.done()
})
