import types from './types'
const actions = {
  ceshi({ state, commit, rootState }) {
    setTimeout(() => {
      commit([types.INTHETS])
    }, 500)
  }
}
export default actions
