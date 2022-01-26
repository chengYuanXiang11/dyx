import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientHeight: 0,//屏幕高度
    clientWidth: 0,//屏幕宽度
    asideMleft: 200,//左边框左边距
    isCollapse: false,//左侧是否
    asideMleftB: 0,
    asideMleftc: 20,
    menushow: true,
    
    breadcreate: [
      {
        id: 1,
        name: "首页",
        path: '/'
      }
    ], bread: [{
      id: 1,
      name: "首页",
      path: '/'
    },
    ],
    breadshow:true
  },
  mutations: {
    DOCHEIGHT(state, ploay) {
      state.clientHeight = ploay
    },
    DOCWIDTH(state, ploay) {
      state.clientWidth = ploay
    },
    MODIFR_AML71(state, ploay) {

      state.asideMleft = 40
      state.asideMleftB = 20
      state.asideMleftc = 0

    },
    MODIFR_AML200(state, ploay) {

      state.asideMleft = 200
      state.asideMleftB = 0
      state.asideMleftc = 20

    },
    MODIFR_ISCOLLAPSE(state) {
      state.isCollapse = !state.isCollapse
    }, MODIFR_ISCOLLAPSE_FALSE(state) {
      state.isCollapse = true
    },
    MODIFR_ISCOLLAPSE_TRUE(state) {
      state.isCollapse = false
    },
    //面包靴
    PUSH_BREAD(state, ploay) {
      state.bread = []
      state.bread = state.bread.concat(state.breadcreate)
      if (ploay[0] == undefined) {
      } else {
        state.bread = state.bread.concat(ploay)
      }

    },

    MENUSHOWTRUE(state) {
      state.menushow = true
    },
    MENUSHOW(state) {
      state.menushow = false
    },
  },
  actions: {
    //窗口<700 时候
    MENUSHOW({ commit }) {
      commit("MENUSHOW")
      commit("MODIFR_ISCOLLAPSE_FALSE")
      commit("MODIFR_AML71")
    },
     //窗口>700 时候
     MENUNONE({ commit }) {
      commit("MENUSHOWTRUE")
      commit("MODIFR_ISCOLLAPSE_TRUE")
    },
    SIDERBAR({ commit }) {
      commit('MODIFR_AML')

      setTimeout(() => {
        commit('MODIFR_ISCOLLAPSE')

      }, 1500)
    }
  },
  modules: {
  }
})
