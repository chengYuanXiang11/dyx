import React, { useState, useEffect } from 'react';
import store from '../../redux/store'
// 引入action,用于创建action对象
import {
    createIncrementAction as add,
    createDecrementAction as aqq,
    asyncCreateIncrementAction as asyncadd
} from '../../redux/count_action'

export default function Chat() {
    const [valueState, changvalueState] = useState({})
    const mySelect = React.createRef()
    useEffect(() => {

        // 监控redux的变化，因为redux只是管理状态，不更新视图
        store.subscribe(( ) => {
            console.log('gengxin',valueState)
            changvalueState({})//同setState({}),即redux状态更新，重新渲染视图
        })
    }, [ ])
    // changeChatName(name)

    const increment = () => {
        store.dispatch(
            add(mySelect.current.value)
        )
    }
    const decement = () => {
        store.dispatch(
            aqq(mySelect.current.value)
        )

    }
    const incrementIfod = () => {
        const count = store.getState()
        console.log('count',count)
        if (count % 2 === 1) {
            store.dispatch({
                type: "incrementIfod",
                data: mySelect.current.value
            })
        }
    }
    const incrementAsync = () => {
        console.log('1')
        store.dispatch(
            asyncadd(mySelect.current.value, 1000)
        ) 
        // asyncadd(mySelect.current.value, 1000)()
        console.log('2')

    }
    return (
        <div style={{ width: "300px" }}>
            {/* 当前求和为:{store.getState()} */}
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
