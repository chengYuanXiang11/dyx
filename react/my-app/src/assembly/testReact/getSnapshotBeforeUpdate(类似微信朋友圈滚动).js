// import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
// 正常更新 会触发 shouldComponentUpdate的阀门控制
// 强制更新 会跳过shouldComponentUpdate的阀门控制
// 使用新组件API的组件将不会调用不安全的遗留生命周期。UNSAFE_componentWillReceiveProps等
import './index.css'
class EventAPI extends React.Component {
  constructor(props) {
    console.log('父级-------------constructor')
    super(props)
    this.myRef = React.createRef()

    this.state = {
      newArr:[],
      length:0
    }
  }
 
// 派生的状态,return 一个对象或者null,如此时,name不会被更新,子组件返回praops,则此时props不会被更新
// 此方法场景在 state的值在任何时候都取决于props
//  static getDerivedStateFromProps(props,state){
//   console.log('父级------------父级getDerivedStateFromProps',props,state)
//   // return {name:'getfater'}
//   return null
//   }

  getSnapshotBeforeUpdate(){
    return this.myRef.current.scrollHeight
  }

  // 将要挂载 
  // 警告 componentWillMount has been renamed,
  //  and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
  // componentWillMount已重命名，不建议使用。看到了吗https://reactjs.org/link/unsafe-component-lifecycles 详情。

  // 挂载完毕
  componentDidMount() {
   const timer=setInterval(()=>{
     const {newArr} = this.state;
     const news="初始化"+(newArr.length+1)
     this.setState({newArr:[news,...newArr]})
     console.log(newArr.length)
     if(newArr.length>200){
       clearTimeout(timer)
     }
   },1000)
  }
componentDidUpdate(propos,state,height){
  console.log(this.myRef.current.scrollHeight,height)
  this.myRef.current.scrollTop += this.myRef.current.scrollHeight - height
}
  render() {
    console.log('父级reder')
    return (
      <div>
        <ul  ref={this.myRef} className="of">
            {
              this.state.newArr.map((value,index)=>{
                return<li key={index}>{value}</li>
              })
            }      
        </ul>
      </div>
    )
  }
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

