import data from './state'

export const name2 = (state = data, action) => {
    const { type, data } = action

    switch (type) {
        case 'ACTION_TYPE_1':
            return {...state,name:state.title+data}
        case 'setName':
            return {...state,name:state.name+'name'}

        default:
            return state
    }
}