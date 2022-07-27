import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import {
    login,
    getInfo
} from '@/request/api/login'
import {
    resetRouter
} from '@/router'
const state = {
    token: getToken(),
    userInfo: {},
    roles: [],
    permissions: [],
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
        setToken(token)
    },
    SET_USERINFO: (state, userInfo) => {
        let {
            id,
            username,
            avatar
        } = userInfo;
        state.userInfo = {
            id,
            username,
            avatar:avatar ? avatar : "https://demo.django-vue-admin.com/static/img/profile.473f5971.jpg"
        };
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions;
    },
}

const actions = {
    // 登录
    login({
        commit
    }, userInfo) {
        const {
            account,
            password,
            code,
            uuid
        } = userInfo
        return new Promise((resolve, reject) => {
            login({
                username: account,
                password: password,
                idValueC: code,
                idKeyC: uuid
            }).then(response => {
                const {
                    data
                } = response
                commit('SET_TOKEN', data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    getInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                commit('SET_USERINFO', response.data.user)
                if (response.data.roles && response.data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                    commit("SET_ROLES", response.data.roles);
                    commit("SET_PERMISSIONS", response.data.permissions);
                } else {
                    commit("SET_ROLES", ["ROLE_DEFAULT"]);
                }
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 退出登录
    logout({
        commit,
        state,
        dispatch
    }) {
        return new Promise((resolve, reject) => {
            removeToken()
            resetRouter()
            dispatch('tagsView/delAllViews', null, {
                root: true
            })
            dispatch('permission/clearRouter', null, {
                root: true
            })
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}