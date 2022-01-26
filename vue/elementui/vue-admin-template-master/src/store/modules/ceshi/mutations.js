import types from './types'
const mutation = {
  [types.INTHETS](state, ployad) {
    state.name = ployad
    console.log('ceshi mutation')
  }
}
export default mutation
