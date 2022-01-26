const moduleA = {
    namespaced:true,
    state: {
        modulea: '111'
    },
    mutations: {
        // stateTiele(state,playload){
        // state.title = playload
        // }
        setModule(state: { modulea: number },) {
            state.modulea += 1
        }
    },
    actions: {
        async setTimeTitle({ commit } :any) {
            commit('setModule')
            console.log('1')

        }
    },
}
export default moduleA