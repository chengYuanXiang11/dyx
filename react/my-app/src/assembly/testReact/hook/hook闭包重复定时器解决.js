import React, { useEffect, useState,useRef } from 'react';
import ReactDOM from 'react-dom';

function EventAPI() {
  const [arr, setarr] = useState([])
  const [dis, setdis] = useState({ color: 'red', fontSize: '20px',opacity:1 })
  const saveCallBack = useRef();
  useEffect(() => {
    saveCallBack.current = a1;
    return () => {};
      //  a1()
    // {opacity: 0.9, transition: "all 2s"}
    // index.js:46 {fontSize: "20px", transition: "all 2s", opacity: 1}
    // index.js:49 {color: "red", fontSize: "20px", transition: "all 2s", opacity: 1}
  }, )
   useEffect(() => {
        const tick = () => {
          saveCallBack.current();
        };
        const test= setInterval(tick, 200);
         arr.push(test);
        setarr(arr);
    console.log(arr);
    return () => {
      clearInterval(test)
    }
    },[])
  const  a1=() =>{
    let list = {...dis}
      Reflect.deleteProperty(list, 'color')
    console.log(list)

      setdis({ ...list })
    let a = { 'opacity': list.opacity-0.1}
    console.log(a)

      setdis({ ...list, ...a })

      if(dis.opacity <=0){
        let list = {...dis}
      let ac = { 'opacity': '1'}

      setdis({ ...list, ...ac })
        console.log(dis)
      }
  }
  function changeDis() {
    setdis({ color: '1' }) // 输入框值变化，但颜色仍是red
    // setdis({color:undefined})//报错，颜色变黑，输入框值仍是red
  }
  function setChang(e) {
    setdis({ color: e.target.value })
  }
  return (
    <div style={dis}>
      <ul>
      </ul>
      <input value={dis.color} onChange={setChang} onClick={changeDis} />

    </div>
  )
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

