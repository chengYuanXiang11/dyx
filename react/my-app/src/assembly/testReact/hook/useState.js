import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './assembly/testReact/index.css'
import './index.css';
import './assembly/testReact/CheckerBoard/index.css'

function ChatAPI(){
  console.log('demo')
  // 会再次调用,但不会覆盖为0
// useState,第一个参数是值,第二个参数是改变该值的方法?

  const [isOnline, setIsOnline] = useState(0);
  const [aisOnline, asetIsOnline] = useState(18);

 function add(){
  setIsOnline(isOnline+1)
}
function sup(){
    ReactDOM.unmountComponentAtNode( document.getElementById('root'))
}
// Effect的两个参数,第一个参数是一个改变的方法,第二个参数是改变的范围?
  useEffect(()=>{
    // 不传第二参数或者空参数相当于
    //  componentDidMount

    // 传第二参数并且有范围且正确范围相当于
    //  componentDidUpdate 


      // const timer=setTimeout(
      //   add,1000)

    // 卸载组件时候触发
    // componentWillunmount
        // return ()=>{
        //   clearTimeout(timer)
        // }
  },[isOnline,aisOnline])
    return(
      <>
        {isOnline}
        <button onClick={add}>click</button>
        <button onClick={sup}>卸载</button>
        
      </>
    )
}

ReactDOM.render(
  <ChatAPI />,
  document.getElementById('root')
)