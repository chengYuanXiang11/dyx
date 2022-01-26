import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import ceshi from './modules/ceshi/index'

Vue.use(Vuex)
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    console.log(mutation)
    console.log(state)

    // 每次 mutation 之后调用
    //  在actions 之前调用
    // mutation 的格式为 { type, payload }
  })
}
const store = new Vuex.Store({
  // 启用严格模式 发布时删除
  strict: true,
  modules: {
    app,
    settings,
    user,
    ceshi
  },
  plugins: [myPlugin],
  getters
})

export default store
