
import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/home',
    children: [
      { path: '/home', component: _import('home'), hidden: true },
      { path: '/stock', component: _import('stock_manage/stock/index'), hidden: true },
      { path: '/stockOrder', component: _import('stock_manage/order/index'), hidden: true },
      { path: '/fund', component: _import('stock_manage/fund/index'), hidden: true }

    ]
  },
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
]
export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
