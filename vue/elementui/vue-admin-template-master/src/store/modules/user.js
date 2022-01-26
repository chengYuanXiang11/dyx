import { login, logout, getInfo, muis } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Routingprocessing } from '@/utils/index'
import { menuList, adminmenuList } from '@/data'
import router from '@/router'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routerList: [],
    statu: 0
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  PARENT_ROUTE: (state, route) => {
    // 根据后台路由信息建立路由表
    state.routerList = Routingprocessing(route)
    console.log(state.routerList)
    router.options.routes = router.options.routes.concat(state.routerList)
    router.addRoutes(state.routerList)
    router.options.routes = router.options.routes.concat([{ path: '*', redirect: '/404', hidden: true }])
    router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
    state.statu = 1
    console.log(state.statu)
    console.log(JSON.parse(JSON.stringify(router.options)))

  }
}

const actions = {
  // user router

  // user login

  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    try {
      const res = await login({ username: username.trim(), password: password })
      const { data } = res
      await commit('SET_TOKEN', data.token)
      await commit('SET_NAME', username)
      await setToken(data.token)
      state.name === 'admin' ? await commit('PARENT_ROUTE', adminmenuList) : await commit('PARENT_ROUTE', menuList)
    } catch (error) {
      console.log(error)
      return error
    }
  },
  // get user info
  getInfo({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  refresh({ commit, state }) {
    console.log(state)
    state.name === 'Super Admin' ? commit('PARENT_ROUTE', adminmenuList) : commit('PARENT_ROUTE', menuList)

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

