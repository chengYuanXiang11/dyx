
import { InjectionKey } from 'vue'
import { createStore,useStore as baseUseStore,  Store } from 'vuex'
// 为 store state 声明类型
export interface State {
    title: string,
    name: string
}
export const key: InjectionKey<Store<State>> = Symbol()

import moduleA from './module/moduleA'
import state from './state'
import { MODIFY_TITLE } from './mutation-type'

const timer = () => {
    return new Promise(res => {
        setTimeout(() => { console.log('2'); res(''); }, 2000);

    })
}
const store = createStore<State>({
    state,
    mutations: {
        // stateTiele(state,playload){
        // state.title = playload
        // }
        [MODIFY_TITLE](state, payload) {
            console.log('setTitle')
            state.title += 1
        }
    },
    actions: {
        async setTimeTitle({ commit }) {
            await timer()
            commit(MODIFY_TITLE)
            console.log('1')

        }
    },
    modules: {
        a: moduleA
    }
})
export default store
export function useStore () {
    return baseUseStore(key)
  }