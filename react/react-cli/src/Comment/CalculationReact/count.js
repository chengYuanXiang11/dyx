import React, { useState, useEffect } from 'react';
// 引入action,用于创建action对象
import store from '../../redux/store'
export default function Count(props) {
    const [valueState, changvalueState] = useState({})
    const mySelect = React.createRef()
    useEffect(() => {
        // // store.subscribe(()=>{
        // //     changvalueState({})
        // // })
        // console.log(props)
   
    }, [])
    // changeChatName(name)
    const increment = () => {
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
