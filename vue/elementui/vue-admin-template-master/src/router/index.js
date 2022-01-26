import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/views/layout/index.vue'

/**
 * 子菜单仅在 children.length >= 1 时出现

 *hidden:true如果设置为true，项目将不会显示在侧边栏中（默认为false）

 *alwaysShow:true如果设置为true，将始终显示根菜单

 * 如果未设置alwaysShow，则当项目有多个子路由时，它将变成嵌套模式，否则不显示根菜单

 *重定向：noRedirect如果设置noRedirect将不会在breadcrumb中重定向

 * name:'router-name'         名称：'router-name'名称由<keep alive>使用（必须设置！！！）

 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'              侧边栏和面包屑中显示的名称（推荐设置）
    icon: 'svg-name'/'el-icon-x' 侧边栏中显示的图标
    breadcrumb: false           如果设置为false，则项目将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list' 如果设置路径，侧边栏将突出显示您设置的路径
 }
 */

/**
 * constantRoutes
  没有权限要求的基页
  可以访问所有角色
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
  // 404页必须放在最后！！！ 否则访问所有均为404
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // 需要服务支持 vue官网有写

  // savedPosition 会在你使用浏览器前进或后退按钮时候生效
  // 这个跟你使用 router.go() 或 router.back() 效果一致
  // 这也是为什么我在 tab 栏结构中放入了一个 点击回退 的按钮
  // 这个功能只在支持 history.pushState 的浏览器中可用。
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 500)
    })
  },
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// 因为路由表是引用类型,所以当用户退出或者切换的时候需要清除路由表
export function resetRouter() {
  const newRouter = createRouter()
  console.log(newRouter)
  router.options.routes = newRouter.options.routes
  router.matcher = newRouter.matcher // 重置路由
}

export default router
