import React from 'react';
import ReactDOM from 'react-dom';
import './assembly/testReact/index.css'
import './index.css';
import './assembly/testReact/CheckerBoard/ref.css'

class ChatAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    // React.createRef 调用后可以返回一个容器,该容器可以存储ref所标识的节点,this.xxx.current即是该dom节点
    // 该容器只能存储一个,专人专用,再次存储会覆盖
    this.myRef = React.createRef()
    this.myRef2 = React.createRef()
  }
  inputCollection(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  saveInput2 = () => {
    console.log(`帐号是${this.myRef.current.value},密码是${this.myRef2.current.value}`)
  }

  // saveInput = (currentNode)=>{
  //  this.input1 = currentNode;  console.log(this.input1)
  // }
  // onput = () => {

  //   // {/* <input placeholder="点击提示" name="input1" value="ddfsafasdafa"> */}?????????
  //   console.log(this.input1.value)
  // }
  // onblur = () => {

  // }
  render() {
    // 字符串类型ref 有效率问题
    // console.log(this.refs.input1) 
    return (
      <>
        {/*缺点： 字符串类型ref 有效率问题但还可以接受 */}
        {/* <input placeholder="点击提示" ref="input1" value={this.state.input1} name="input1"  onChange={(e) => { this.inputCollection(e) }}/> */}



        {/* 回调ref currentNode是一个参数,就是ref当前所在的节点  */}
        {/* this.input1 = currentNode  this就是组件实例 this.input1就是curreNode 即当前dom节点*/}
        {/* <input placeholder="提示信息" ref={this.saveInput} value={this.state.input1} name="input1" onChange={(e) => { this.inputCollection(e) }} />
        <button onClick={() => { this.onput() }}>点击提示</button>
      {/* 回调ref在内联函数，更新时会触发两次，第一次null，第二次才是dom元素 ，
            定义成类绑定可以避免，但是该缺点无关紧要*/}
        {/* <input onBlur={() => { this.onblur() }} name="input2" ref={(currentNode) => {this.input2=currentNode;console.log(this.input2)}} onChange={(e) => { this.inputCollection(e) }} placeholder="失去焦点提示" /> */}
       



       {/* ref createRef */}
        <form onSubmit={(e) => { this.saveInput2(e) }}>
          <input placeholder="帐号" ref={this.myRef} value={this.state.username} name="username" onChange={(e) => { this.inputCollection(e) }} />
          <input name="password" ref={this.myRef2} value={this.state.password} onChange={(e) => { this.inputCollection(e) }} />
          <button>点击提交</button>
          <button onClick={() => { this.saveInput2() }}>点击提示</button>
        </form>
        {/* <input onBlur={() => { this.onblur() }} name="input2" ref={(currentNode) => {this.input2=currentNode;console.log(this.input2)}} onChange={(e) => { this.inputCollection(e) }} placeholder="失去焦点提示" /> */}
      </>
    )
  }
}
ReactDOM.render(
  <ChatAPI />,
  document.getElementById('root')
)

