//引入ui组件
import Count from './count'

// 引入connect用于连接ui组件和redux
import { connect } from 'react-redux'

import { createIncrementAction, asyncCreateIncrementAction } from '../../redux/count_action'

//该函数返回的对象中的key作为传递给ui组件props的key，value作为传递给ui组件props的value,用于传递状态
const mapStateToProps = (state, ownProps) => ({
    loading: state.c,
    data: ['APP', 'data']
})

//用于传递操作状态的方法
// const mapDispatchToProps =(dispatch)=>
//    ({
//         jia: (data) => {
//             //通知redux执行
//             dispatch(createIncrementAction(data))
//         },
//         jiaAsync:(data,time)=>{
//             dispatch(asyncCreateIncrementAction(data,time))
//         }
//     })

//可以简写为(react-redux会自动监测)
const mapDispatchToProps ={
    jia: createIncrementAction,//将action发送过去,react-redux会自动dispatch(action)
    jiaAsync:asyncCreateIncrementAction
}

// const  mergeProps=()=>{

// }

//状态映射          //操作状态的方法
export default connect(mapStateToProps, mapDispatchToProps)(Count)