import { createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/xinMne',
            // redirect:{name:'users',params:{users:['users'],id:"13"},query:{users:['users'],id:'12324'}}

        }, {
            path: '/home',
            name: 'home',
            beforeEnter: () => {
                // reject the navigation
                console.log('beforeEnter')
                return true || undefined
            },
            // component:()=>import('../components/CoreKnowledge/HelloWorld.vue')
            components: {
                // 命名视图
                default: () => import('../components/CoreKnowledge/HelloWorld.vue'),
                Left: () => import('../components/ToDo/ToDo.vue')
            },
            alias: '/xinMne'
        },{
            path:'/tslist',
            name:'tslint',
            component:()=>import('../components/TsCom/TsCom.vue')
        },
        {
            path: '/todo',
            name: 'todo',
            component: () => import('../components/ToDo/ToDo.vue')
        },
        {
            //+是>1,*>0,?>=0(可选参数但不能重复)
            // 匹配0个多个/匹配数字
            path: '/:users*/:id(\\d+)',
            name: 'users',
            component: () => import('../components/users/users.vue'),
            children: [
                {
                    path: 'userstodo',
                    name: 'userstodo',
                    components: {
                        default: () => import('../components/ToDo/ToDo.vue'),
                        Left: () => import('../components/ToDo/ToDo.vue')

                    }
                },
            ]
        },{
            path:'/longlist',
            name:'/longlist',
            component:()=>import('../components/Longlist/longlist.vue')
        }
        //定义匹配所有
        // { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' }
    ],
    // scrollBehavior(to,from,savedPosition){
    //     console.log(to,from)
    //     // savedPosition//只有当这是一个 popstate 导航时才可用（由浏览器的后退/前进按钮触发,及浏览器前进后退不触发top）。
    //     if (savedPosition) {
    //         return savedPosition
    //       } else {
    //         return { top: 100 }
    //       }
    // }
    scrollBehavior(to) {
        console.log(to)
        if (to.hash) {
            return {
                el: to.hash,
            }
        }
    }
})
// var a = 1;
router.beforeEach(() => {
    // return new Error('234')
    // throw('234324')
    // if(a ===1 ){
    //     router.addRoute({ path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' })
    //     // console.log(hasNecessaryRoute())
    //     console.log(to.fullPath)
    //     console.log(router.getRoutes())
    //     a+=1
    //     //添加路由时必须用这个触发重定向
    //     return to.fullPath
    // }
        console.log(router.getRoutes())
        // router.hasRoute()：检查路由是否存在。
        // router.getRoutes()：获取一个包含所有路由记录的数组。
    return

})
router.beforeResolve(() => {
    console.log('beforeResolve')
    return true || undefined
})
router.afterEach(() => {
    // return new Error('234')
    // throw('234324')
    console.log('afterEach')
    return true || undefined
})
router.onError(() => {
    console.log('onError')
})
//添加路由
// router.addRoute( { path: '/name', name: 'not', redirect:'/' })

export default router