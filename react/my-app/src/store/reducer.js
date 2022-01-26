import data from './state'

export const name = (state = data, action) => {
    const { type, data } = action

    switch (type) {
        case 'ACTION_TYPE_1':
            return {...state,title:state.title+data}
        case 'setTitle':
            return {...state,title:state.title+'data'}

        default:
            return state
    }
}
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