import variables from '@/assets/style/element-variables.scss'
import defaultSettings from '@/settings'

const {
    showSettings,
    tagsView,
    sidebarLogo,
    showCrumbs,
    showFullScreen,
    showRefresh,
    uniqueOpened
} = defaultSettings
const state = {
    theme: variables.theme,
    showSettings: showSettings,
    tagsView: tagsView,
    sidebarLogo: sidebarLogo,
    showCrumbs: showCrumbs,
    showFullScreen: showFullScreen,
    showRefresh: showRefresh,
    uniqueOpened: uniqueOpened
}

const mutations = {
    CHANGE_SETTING: (state, {
        key,
        value
    }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({
        commit
    }, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}