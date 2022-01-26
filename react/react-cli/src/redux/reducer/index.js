//reducer合并文件
import countreducer from './count_reducer'
import { combineReducers } from 'redux'
import prereducer from './pre_reducer'
// 多个reducer合并
const allReducer=combineReducers({
    countreducer,
    prereducer
})
export default allReducer