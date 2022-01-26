import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/layout/Layout2.vue'
import store from '../store/index'

Vue.use(VueRouter)



const routes = [
  //首页路由
  {
    path: '/',
    component: Layout,
    redirect: '/table',

  },
  //table路由
  {
    path: '/table',
    component: Layout,
    redirect: '/table/table1',
    meta: { title: '表', icon: 'engineering' },
    children: [{
      path: 'table1',
      name: 'table1',
      component: () => import('@/views/table/table1'),
      meta: { title: '表1', icon: 'engineering' }
    }, {
      path: 'table2',
      // name: 'table',
      component: () => import('@/views/table/table2'),
      meta: {  title: '表2', icon: 'engineering' }
    }, {
      path: 'table3',
      name: 'table3',
      meta: { title: '表3', icon: 'engineering' },
      redirect: '/table/table3/1',
      component: () => import('@/views/table/table3/index'),
      children: [{
        path: '1',
        name: 'table3-1',
        component: () => import('@/views/table/table3/table3_1'),
        meta: { title: '表3-1', icon: 'engineering' }
      }, {
        path: '2',
        name: 'table3-2',
        component: () => import('@/views/table/table3/table3_2'),
        meta: { title: '表3-2', icon: 'engineering' }

      }, {
        path: '3',
        name: 'table3-3',
        component: () => import('@/views/table/table3/table3_3'),
        meta: { title: '表3-3', icon: 'engineering' }


      },
      ]
    }, {
      path: 'table4',
      name: 'table4',
      component: () => import('@/views/table/table3/index'),
      children: [{
        path: '1',
        name: 'table4-1',
        component: () => import('@/views/table/table4/table4_1'),
      }, {
        path: '2',
        name: 'table4-2',
        component: () => import('@/views/table/table4/table4_2'),

      }, {
        path: '3',
        name: 'table4-3',
        component: () => import('@/views/table/table4/table4_3'),

      },
      ]
    }, {
      path: 'table5',
      name: 'table5',
      component: () => import('@/views/table/table5'),
    }
    ]
  },
  //sore路由
  {
    path: '/sore',
    component: Layout,
    redirect: '/sore/soreItem',
    meta: { title: 'm表', icon: 'engineering' },
    children: [{
      path: 'soreItem',
      name: 'soreItem',
      component: () => import('@/views/sore/index'),
      meta: { title: 'm表-1', icon: 'engineering' }
    },]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  let arr = [];
      to.matched.forEach((v, k, a) => {
        let obj = {
          id: store.state.bread.length,
          name: v.meta.title,
          path: v.path
        };
        arr.push(obj);
      });
      store.state.breadshow=false;
      store.commit("PUSH_BREAD", arr);
      store.state.breadshow=true;
  next()
})
export default router