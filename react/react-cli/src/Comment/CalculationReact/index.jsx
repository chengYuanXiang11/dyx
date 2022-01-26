
import React, { 
    // useState, 
    useEffect } from 'react';
// 引入connect用于连接ui组件和redux
import { connect } from 'react-redux'
// 引入action,用于创建action对象
import { createIncrementAction, asyncCreateIncrementAction } from '../../redux/count_action'
import {preadd} from '../../redux/pre_action'
//引入ui组件
 function Count(props) {
    // const [valueState, changvalueState] = useState({})
    const mySelect = React.createRef()
    useEffect(() => {
        //p上的方法
        props.preadd1({"a":12})
        // // store.subscribe(()=>{
        // //     changvalueState({})
        // // })
        // console.log(props)
   
    }, [])
    // changeChatName(name)
    const increment = () => {
        //c上的方法
     props.jia(mySelect.current.value*1)
    }
    const decement = () => {
 

    }
    const incrementIfod = () => {
  
    }
    const incrementAsync = () => {
        props.jiaAsync(mySelect.current.value*1,1000)

    }
    return (
        <div style={{ width: "300px" }}>
            {props.loading}
            {props.pre.a}
            <select ref={mySelect}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <br />
            <button onClick={() => { increment() }}>+</button>&nbsp;
            <button onClick={() => { decement() }}>-</button> &nbsp;
            <button onClick={() => { incrementIfod() }}>奇数加</button> &nbsp;
            <button onClick={() => { incrementAsync() }}>异步</button>

        </div>
    )
}

//该函数返回的对象中的key作为传递给ui组件props的key，value作为传递给ui组件props的value,用于传递状态
const mapStateToProps = (state) => {
 console.log(state)
    return ({
      //c数据
    loading: state.countreducer,
    //p数据
    pre:state.prereducer
})
}

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
    //c方法
    jia: createIncrementAction,//将action发送过去,react-redux会自动dispatch(action)
    jiaAsync:asyncCreateIncrementAction,
    //p方法
    preadd1:preadd
}

// const  mergeProps=()=>{

// }

//状态映射          //操作状态的方法
export default connect(mapStateToProps, mapDispatchToProps)(Count)