import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import app from './modules/app'
import getters from './getters'

import Menu from './modules/system_manage/menu/index'
import Role from './modules/system_manage/role/index'
import Organization from './modules/system_manage/org/index'
import Log from './modules/system_manage/log/index'
import User from './modules/system_manage/user/index'


import Stock from './modules/stock_manage/stock/index'
import Fund from './modules/stock_manage/fund/index'
import Order from './modules/stock_manage/order/index'



Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {}, //用户信息
    menuParent: [], // 菜单信息
    menuChildren: [],
    current: 1,  // 分页信息
    size: 20,
    total: 0,

    listTableHeight: 200,  // 表格动态高度

    dialogBottomShake: false,  //按钮去抖动

  },
  getters,
  modules: {
    app, Menu, Role, Organization,Log,User,Stock,Fund,Order
  },
  actions,
  mutations
})

export default store
