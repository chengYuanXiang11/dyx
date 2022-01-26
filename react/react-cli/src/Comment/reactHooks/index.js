import React,{ useState,
    // useEffect,useLayoutEffect, 
    useCallback, useMemo,useReducer ,useRef} from 'react'

import ExpensiveTree from './ExpensiveTree'

import UseC from './useCallba'

import reducer from './reducer'

import { WAREHOUSE, 
    // INCREMENT, DECEMENT 
} from './constant'

import { useNumber } from './customHooks'

const themes = {
    light: {
      foreground: "#000000",
      background: "#eeeeee"
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222"
    }
  };
  
const initialState = 0;
function init(initialState){
    return {name:"init",age:initialState}
}
const ThemeContext = React.createContext()
export default function Counter2() {
    console.log('总组件更新')
    const [exp, setPxp] = useState({ name: '1', age: "2" })
    const [usc, setUsc] = useState({ name: '5', age: "25" })
    //自定义hooks
    const [state, setstate] = useNumber(2);
    //useReducer                                                //初始值      //惰性state
    const [stateReducer, dispatchReducer] = useReducer(reducer, initialState, init)

    //useRef             //初始值 myRef.current的初始值
    const myRef = useRef(null) //useRef可以保存其他类的值,不是只能保存dom节点
    // useRef 返回的 ref 对象在组件的整个生命周期内保持不变，也就是说每次重新渲染函数组件时，
    // 返回的ref 对象都是同一个（使用 React.createRef ，每次重新渲染组件都会重新创建 ref）
    const parentRef  = useRef(null)




// useEffect 在全部渲染完毕后才会执行
// useLayoutEffect 会在 浏览器 layout 之后，painting 之前执行
// 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
// 可以使用它来读取 DOM 布局并同步触发重渲染
    // useLayoutEffect(()=>{
    //     console.log(`执行useLayoutEffectt`)

    // },[exp,usc])


    // useEffect(()=>{
    //     console.log(`执行useEffect`)
    //     return{
    //         //卸载时操作
    //     }
    // },[exp,usc]) //只有exp,usc改变时触发useEffect
    // 只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。
    // 这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行




    // const hanlSetPxp = useCallback(() => {
    //     console.log('SetE')
    //     setPxp({...exp,name:'19'})
    // },[exp])

    //等同于
    const hanlSetPxp = 
    useMemo(
        () => {
        return () => {
            //useRef             //取值
            console.log('SetE')
            setPxp({ ...exp, name: '19' })
        }
    }, [exp])

    const hanlSetUsc = useCallback((e) => {
        console.log('SetU')
        console.log(myRef.current)
        console.log(parentRef)
        console.log(parentRef.current.inputRef2.current)
        parentRef.current.changeText(999)
        console.log(e)
        setUsc({ ...usc, name: e.name })
    }
    , [usc])

    const ad = useMemo(()=>state,[state])

    return (
        <>
            <button onClick={()=>{setstate(state+1)}} value={10} ref={myRef}>setstate</button>
            <button onClick={() => { hanlSetPxp() }}>setPxp</button>
            <button onClick={() => { hanlSetUsc() }}>setUsc</button>
            exp{exp.name}-----usc{usc.name}
            <hr></hr>
            <ThemeContext.Provider value={themes.light.foreground}> 
            
            {/* ref={myRef2}  在函数组件中直接对子组件ref获取会报错,所以要使用forwardRef,useImperativeHandle */}
            <ExpensiveTree E={exp}  A={ad} setE={hanlSetPxp} />
            {/* 如果直接把函数传递给子函数，则父元素render，则子元素也会被重新渲染，所以使用useCallback */}
            <hr></hr>
            <UseC U={usc} SetU={hanlSetUsc} ref={parentRef}></UseC>
            </ThemeContext.Provider>
            <hr></hr>
            {stateReducer.name}|{stateReducer.age}
            <button onClick={()=>{dispatchReducer({type:WAREHOUSE})}}>WAREHOUSE+10</button>
        </>
    )
}
// \/正常下的useState，每次渲染时它们的调用顺序是不变的，，React会 在重复渲染时保留这个 state
// function alertNumber() {
//     setTimeout(() => {
//         // alert 只能获取到点击按钮时的那个状态
//         alert("number", number);
//     }, 3000);
// }
// //函数式useState，函数组件会重新被调用，那么每次渲染都是独立的，取到的值不会受后面操作的影响
// function alertNumber2() { 
//     setTimeout(() => {
//         // alert 会获取最新的状态
//         setNumber(number => { alert(number); return number + 1 });
//     }, 1000);
// }
export { ThemeContext }
