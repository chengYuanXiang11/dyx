import React from 'react';
import ReactDOM from 'react-dom';
import './assembly/testReact/index.css'
import './index.css';
import './assembly/testReact/CheckerBoard/ref.css'

// react 使用的是自定义（合成）事件，而不是原生dom事件
//  是为了更好的兼容性

// react 中的事件是通过事件委托的方式处理的（委托给组件最外层的元素:事件冒泡）
// event.targe 同样可获得发生事件的dom 

class EventAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }
  // 高阶函数 promise setTimeout arr.map filter....
  //       符合下面两条中的任意一条
  //        1.函数A接受的参数是一个函数
  //        2.函数A调用返回的值依旧是一个函数
  
  // 函数柯里化
        // 通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式
        // function name(a) {
        //   return function(b){
        //     return function(c){
        //       return a+b+c
        //     }
        //   }
        // }
        // name(1)(2)(3)

        
  inputCollection(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  saveInput2 = () => {
    console.log(`帐号是${this.state.username},密码是${this.state.password}`)
  }
  render() {
    return (
      <div onClick={(e) => { console.log(e.target.value) }}>
        <form onSubmit={(e) => { this.saveInput2(e) }}>
          <input placeholder="帐号" value={this.state.username} name="username" onChange={(e) => { this.inputCollection(e) }} />
          <input name="password" value={this.state.password} onChange={(e) => { this.inputCollection(e) }} />
          <button>点击提交</button>
        </form>
      </div>
    )
  }
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

