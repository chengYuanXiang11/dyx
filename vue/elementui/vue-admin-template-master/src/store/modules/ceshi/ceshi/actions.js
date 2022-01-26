import types from './types'
const actions = {
  ceshi2({ state, commit, rootState }, ploay) {
    setTimeout(() => {
      commit(types.INTHETS, ploay)
      console.log(state)
      console.log(rootState)

    }, 500)
  }
}
export default actions
