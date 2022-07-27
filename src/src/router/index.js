import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path(.*)",
            component: (resolve) => require(["@/views/redirect"], resolve)
        }]
    },
    {
        path: "/login",
        component: (resolve) => require(["@/views/login/index"], resolve),
        hidden: true
    },
    {
        path: "/404",
        component: (resolve) => require(["@/views/error/404"], resolve),
        hidden: true
    },
    {
        path: "/401",
        component: (resolve) => require(["@/views/error/401"], resolve),
        hidden: true
    },
    {
        path: "",
        component: Layout,
        redirect: "/index",
        children: [{
                path: 'index',
                component: (resolve) => require(['@/views/index'], resolve),
                name: '首页',
                meta: {
                    title: '首页',
                    icon: 'Home',
                    noCache: true,
                    affix: true
                }
            },
            {
                path: "building",
                hidden: true,
                component: (resolve) => require(["@/views/market/area/building/index"], resolve),
                name: "Building",
                meta: {
                    title: "建筑管理"
                }
            },
            {
                path: "floor",
                hidden: true,
                component: (resolve) => require(["@/views/market/area/floor/index"], resolve),
                name: "Floor",
                meta: {
                    title: "楼层管理"
                }
            },
            {
                path: "repairsOrderDetails/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/malfunctionRepair/maintenanceTask/orderDetails/index"], resolve),
                name: "repairsOrderDetails",
                meta: {
                    title: "维修详情"
                }
            },
            {
                path: "taskcheck",
                hidden: true,
                component: (resolve) => require(["@/views/market/cleaning/task/check"], resolve),
                name: "Taskcheck",
                meta: {
                    title: "查看"
                }
            },
			{
					path: "check",
					hidden: true,
					component: (resolve) => require(["@/views/market/cleaning/check/check"], resolve),
					name: "Check",
					meta: {
							title: "检查"
					}
			},
			{
					path: "detail",
					hidden: true,
					component: (resolve) => require(["@/views/market/cleaning/check/detail"], resolve),
					name: "Detail",
					meta: {
							title: "查看"
					}
			},
			{
					path: "holidayquerylog",
					hidden: true,
					component: (resolve) => require(["@/views/personnel/checking/holidayQuery/holidayquerylog"], resolve),
					name: "HolidayQueryLog",
					meta: {
							title: "使用记录"
					}
			},
            {
                path: "seat",
                hidden: true,
                component: (resolve) => require(["@/views/market/warehouse/seat/index"], resolve),
                name: "Seat",
                meta: {
                    title: "库位管理"
                }
            },

            {
                path: "repairsDetails/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/malfunctionRepair/repairs/orderDetails/index"], resolve),
                name: "repairsDetails",
                meta: {
                    title: "报修详情"
                }
            },
            {
                path: "merchantManagement",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/merchantManagement/index"], resolve),
                name: "merchantManagement",
                meta: {
                    title: "商户管理"
                }
            },
            {//招商管理-商户管理-租赁管理
                path: "leaseManage",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/leaseManage/index"], resolve),
                name: "leaseManage",
                meta: {
                    title: "租赁管理"
                }
            },
            {//招商管理-商户管理-租赁管理-新建
                path: "leaseManageAdd",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantsMgmt/chinaMerchants/leaseManage/add"], resolve),
                name: "leaseManageAdd",
                meta: {
                    title: "新建"
                }
            },
            {
                path: "checkingGroup-operation/:type",
                hidden: true,
                component: (resolve) => require(["@/views/personnel/checking/checkingGroup/operation"], resolve),
                name: "checkingGroup-operation",
                meta: {
                    title: "新建/编辑考勤组"
                }
            },
            {
                path: "scheduling",
                hidden: true,
                component: (resolve) => require(["@/views/personnel/Scheduling"], resolve),
                name: "scheduling",
                meta: {
                    title: "排班管理"
                }
            },
            {
                path: "formDetails",
                hidden: true,
                component: (resolve) => require(["@/views/system/form/details"], resolve),
                name: "formDetails",
                meta: {
                    title: "流程详情"
                }
            },
            { //装修管理
                path: "decorationView/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/decorate/mgmt/decorationView/index"], resolve),
                name: "decorationView",
                meta: {
                    title: "查看"
                }
            },
            {//服务费用
                path: "serviceDetails",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantServices/serviceCharge/details/index"], resolve),
                name: "serviceDetails",
                meta: {
                    title: "详情"
                }
            },
            {//服务订单
                path: "serviceOrder",
                hidden: true,
                component: (resolve) => require(["@/views/market/merchantServices/serviceOrder/details/index"], resolve),
                name: "serviceOrder",
                meta: {
                    title: "详情"
                }
            },
            { //巡检管理-巡检项
                path: "inspectionEdit/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/inspection/item/details/index"], resolve),
                name: "inspectionEdit",
                meta: {
                    title: "编辑"
                }
            },
            { //巡检管理-巡检任务-任务管理
                path: "taskManage",
                hidden: true,
                component: (resolve) => require(["@/views/market/inspection/task/manage/index"], resolve),
                name: "taskManage",
                meta: {
                    title: "任务管理"
                }
            },
            { //巡检管理-巡检任务-审核查看
                path: "examine/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/inspection/task/manage/examine"], resolve),
                name: "examine",
                meta: {
                    title: "审核"
                }
            },
						{ //巡检项-设置区域与实际负责人
								path: "setArea",
								hidden: true,
								component: (resolve) => require(["@/views/market/inspection/item/details/index"], resolve),
								name: "setArea",
								meta: {
										title: "设置区域与负责人"
								}
						},
            { //巡检管理-整改任务-查看完成
                path: "complete/:type",
                hidden: true,
                component: (resolve) => require(["@/views/market/inspection/rectification/complete/index"], resolve),
                name: "complete",
                meta: {
                    title: "完成"
                }
            },
               // 流程申请
               {
                path: "ApplyFor",
                hidden: true,
                component: (resolve) => require(["@/views/workbench/processApply/components/Apply"], resolve),
                name: "ApplyFor",
                meta: {
                    title: "审批"
                }
            },
            // 流程详情
            {
                path: "TabaleApply",
                hidden: true,
                component: (resolve) => require(["@/views/workbench/processApply/components/TabaleApply"], resolve),
                name: "TabaleApply",
                meta: {
                    // title: params=>{console.log(params) ;return params.flow_name?params.flow_name:'申请审查'}
                    title:'42325'
                }
            }

        ]
    },
    {
        path: "/common",
        component: Layout,
        hidden: true,
        children: [{
            path: "icon",
            component: (resolve) => require(["@/views/system/icon/index"], resolve),
            name: "IconList",
            meta: {
                title: "图标库"
            }
        }]
    },
    //   {
    //     path: "/user",
    //     component: Layout,
    //     hidden: true,
    //     redirect: "noredirect",
    //     children: [
    //       {
    //         path: "profile",
    //         component: (resolve) => require(["@/views/permission/user/profile/index"], resolve),
    //         name: "Profile",
    //         meta: { title: "个人中心", icon: "user" }
    //       },
    //   {
    //     path: "msg",
    //     component: (resolve) => require(["@/views/system/message/Mymessage"], resolve),
    //     name: "msg",
    //     meta: { title: "消息通知", icon: "user" }
    //   }
    //     ]
    //   },
    //   {
    //     path: "/dict",
    //     component: Layout,
    //     hidden: true,
    //     children: [
    //       {
    //         path: "type/data/:dictId(\\d+)",
    //         component: (resolve) => require(["@/views/system/dict/data"], resolve),
    //         name: "Data",
    //         meta: { title: "字典数据", icon: "" }
    //       }
    //     ]
    //   }
];

export default new Router({
    mode: "history", // 去掉url中的#
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRoutes
});
