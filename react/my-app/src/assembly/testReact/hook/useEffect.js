import React,{useEffect,useState,useRef} from 'react';
import ReactDOM from 'react-dom';
// useEffect 中为什么会出现无限执行的情况
// 没有为 useEffect 设置依赖项，并且在 useEffect 中更新 state，会导致界面无限重复渲染
// 此时修改 page 时改成函数的方式，并从依赖性中移除 page 即可
function EventAPI() {
  //RefHook
  const myRef = useRef()
  const [condition,changeCondition] = useState({color:'red',opacity:1})
  useEffect(()=>{
    //  const timer=setTimeout(() => {
      // a即是上一次的状态
      changeCondition(prestate=>{
        console.log(prestate)
        if(prestate.opacity<=0){return{ ...prestate,
          opacity:1}}
        return{
        ...prestate,
        opacity:((prestate.opacity-0.1).toFixed(1))}
      })
    // }, 1000);
    return()=>{
      console.log('timer')
      // clearTimeout(timer)
    }
  },[])
  useEffect(()=>{
    console.log(myRef.current.value )
    return()=>{
      console.log('222')
    }
  },[])
  return (
    <div>
      <ul style={condition}>
        <li >1</li>
        <li>2</li>
        <li ref={myRef} >3</li>
        <li>4</li>
        <li>5</li>
      </ul>
    </div>
  )
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

