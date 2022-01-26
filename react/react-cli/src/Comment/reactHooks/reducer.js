import { WAREHOUSE, INCREMENT, DECEMENT } from './constant'
function reducer(state, action) {
    const { type, data } = action
    console.log(state,action,data)
    switch (type) {
        case WAREHOUSE:
            return { ...state,name: "warehouse",age:state.age+10}
        case INCREMENT:
            return { ...state, name: "increment",age:state.age+1 }
        case DECEMENT:
            return { ...state, name: "decement",age:state.age-1 }
        default:
            break;
    }
}
export default reducer