import {INCREMENT,DECEMENT} from '../constant'

const nameInitialState = 0 // 初始化
console.log('count')
const reducer = (state = nameInitialState, action) => {
    const { type, data } = action
    switch (type) {
        case INCREMENT:
            console.log('s')
            return state + data*1
        case DECEMENT:
            return  state - data*1
        case "incrementIfod":
            return state + data*1
        default:
            return state
    }
}
export default reducer