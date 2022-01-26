import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function EventAPI() {
  // eslint-disable-next-line no-unused-vars
  const [arr, setarr] = useState([1, 2, 3, 4, 5, 6, 7, 8])
  const [dis, setdis] = useState({ color: 'red', fontSize: '20px', transition: "all 2s" })
  useEffect(() => {
    // 复杂数据类型进行更新时，不可直接修改原数据，需要浅拷贝复制一份该数据,
    // 修改拷贝后的数据，在将修改后的数据赋值给原数据.
    // 浅拷贝生成新的虚拟DOM,与老的虚拟dom diff对比,因为react的更新是基于dom树的，
    // 数据变更映射的最终也是要进行到dom树上，如果直接修改原来dom数据，在dom树中是不会做到变更，因为两者指向同一个dom树，
    // 没有新老dom，不会产生差异，也不会进行更新



        //  直接修改state，react不会重新render。这个就不用多说了。
    // 另外一点是，setState的更新是异步的，而且，react会将要修改的状态放到一个更新队列，并考虑到render次数，
    // 会将多个值一起改变并一次render。其实react官方还是推荐immutable的state，也就是说，我们在改变state的时候，
    // 需要重新生成一个对象去代替原来的state，而不是直接改原来的。

    const list = { ...dis }
    console.log('list删除前')
    console.log(list)  //{color: "red", fontSize: "20px", transition: "all 2s"}
    console.log('list删除')
    console.log(Reflect.deleteProperty(list, "color"))  //false
    Reflect.deleteProperty(list, 'color')

    console.log('list删除后')
    console.log({ ...list })    //{color: "red", fontSize: "20px", transition: "all 2s"}
    setdis(list)
    return () => {
      console.log('out')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // setTimeout(() => {
    //   const o = { ...dis }
    //   console.log(Reflect.deleteProperty(o, 'color'))
    //   setdis(o)
    // }, 20)
  }, [])

  function changeDis() {
    setdis({ color: '1' }) // 输入框值变化，但颜色仍是red
    // setdis({color:undefined})//报错，颜色变黑，输入框值仍是red
  }
  function setChang(e) {
    setdis({ color: e.target.value })
  }

  const setRed = () => {
    setdis({
      ...dis,
      color: 'red'
    })
  }
  const setBlack = () => {
    setdis({
      ...dis,
      color: 'black'
    })
  }
  const setUndefined = () => {
    setdis({
      ...dis,
      color: undefined
    })
  }
  const setNull = () => {
    setdis({
      ...dis,
      color: null
    })
  }
  const delColor = () => {
    const o = { ...dis }
    Reflect.deleteProperty(o, 'color')
    setdis(o)
  }

  console.log(dis)
  return (
    <div style={dis}>
      <ul>
        {
          arr.map((item, index) => (
            <React.Fragment key={index}>
              <li>{item}</li>
            </React.Fragment>
          )
          )
        }
      </ul>
      <input value={dis.color} onChange={setChang} onClick={changeDis} />
      <button onClick={setRed}>setRed</button>
      <button onClick={setBlack}>setBlack</button>
      <button onClick={setUndefined}>setUndefined</button>
      <button onClick={setNull}>setNull</button>
      <button onClick={delColor}>delColor</button>

    </div>
  )
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

