import router from '../router/index'
import { constantRouterMap } from '../router/index'
const _import = require("../router/_import_" + process.env.NODE_ENV);
var dynamicRoute, routers;
function menuToRouter(menu){    
    if(!menu || menu.length==0 || menu[0].resType == 'button') return [];
    for(var i=0;i<menu.length;i++){
        menu[i].component = (!['#', '/'].includes(menu[i].menuRoute)?_import(menu[i].menuRoute):_import("layout/Layout"));  //设置对应的资源路径
        menu[i].path = menu[i].url;
        menu[i].meta = {title: menu[i].name}; // 设置路由参数
        if(menu[i].children) {
            menu[i].children = menuToRouter(menu[i].children)
        }
    }
    return menu;
}

export default {
    // 保存本地路由和菜单
    ["ROOT_SET_MENU_ROUTER"](state, {menuList}){
        return new Promise((res,rej)=>{
            routers = menuToRouter(menuList);  //树形路由
            if(routers){
                // constantRouterMap.push(routers);
                router.addRoutes(routers);  //添加动态路由
                state.menuParent = routers;
                sessionStorage.setItem("menuList", JSON.stringify(menuList));
            }
            res();
         })
    },
    // 刷新页面后根据路由展开菜单
    ["ROOT_AUOT_SELECT_ROUTER"](state, {that}){
        var menuList = JSON.parse(sessionStorage.getItem("menuList")), route = that.$route;
        that.$store.commit("ROOT_SET_MENU_ROUTER", {menuList});
    }
}