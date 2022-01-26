
const nameInitialState = { 'a': '这是a', 'b': 2 } // 初始化
const reducer = (state = nameInitialState, action) => {
    console.log('pre')
    const { type, data } = action
    switch (type) {
        case "INCREMENT":
            return { ...state, ...data }
        case "DECEMENT":
            return state - data * 1
        case "incrementIfod":
            return state + data * 1
        default:
            return state
    }
}
export default reducer