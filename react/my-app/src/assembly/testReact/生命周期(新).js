// import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
// 正常更新 会触发 shouldComponentUpdate的阀门控制
// 强制更新 会跳过shouldComponentUpdate的阀门控制
// 使用新组件API的组件将不会调用不安全的遗留生命周期。UNSAFE_componentWillReceiveProps等

class EventAPI extends React.Component {
  constructor(props) {
    console.log('父级-------------constructor')
    super(props)
    this.state = {
      name: "fater",
      opacity: 1
    }
  }
 
  force = () => {
     // 强制更新 不修改状态直接更新状态 会跳过shouldComponentUpdate的阀门控制
    this.forceUpdate()
  }
// 派生的状态,return 一个对象或者null,如此时,name不会被更新,子组件返回praops,则此时props不会被更新
// 此方法场景  如果state的值在任何时候都取决于props则使用该方法 return props
 static getDerivedStateFromProps(props,state){
  console.log('父级------------父级getDerivedStateFromProps',props,state)
  // 返回一个和状态state同key的对象,替换掉state,并且不会被更新
  // return {name:'getfater'}
  return null
  }

  getSnapshotBeforeUpdate(){
    console.log('父级------------父级getSnapshotBeforeUpdate')
    return {heigh:window.innerHeight}
  }

  // 将要挂载 
  // 警告 componentWillMount has been renamed,
  //  and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
  // componentWillMount已重命名，不建议使用。看到了吗https://reactjs.org/link/unsafe-component-lifecycles 详情。

  // 挂载完毕
  componentDidMount() {
    console.log('父级挂载完毕-------------父级componentDidMount')
    // this.timer()
  }
  // 即将更新

  // 是否应该更新 默认返回真 如果不写return默认返回undefined 
  shouldComponentUpdate() {
    console.log('父级是否应该更新-------------父级shouldComponentUpdate')
    return true
  }
  //之前的props,之前的state,快照值
  componentDidUpdate(prepropos,prestate,snapshot) {

    console.log('父级更新完毕-------------父级componentDidUpdate',prepropos,prestate,snapshot)
  }
  // 即将卸载
  componentWillUnmount() {
    console.log('父级即将卸载-------------父级componentWillUnmount')
    // clearInterval(this.time)
  }
  timer = () => {
    this.time = setInterval(() => {
      let { opacity } = this.state
      opacity = (opacity - 0.1).toFixed(1)
      if (opacity <= 0) opacity = 1
      this.setState({
        opacity
      })
    }, 200)
  }
  changInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  deleteNode = () => {
    //卸载组件
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  }

  render() {
    console.log('父级reder')
    return (
      <div>
        <ul style={{ opacity: this.state.opacity }}>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
        <input type="text" value={this.state.name}
          placeholder="点击卸载" name="name"
          onClick={() => { this.deleteNode() }}
          onChange={(e) => { this.changInput(e) }}
          autoFocus />
        <EventAPIChildren msg={this.state.name} onChange={(e) => { this.changInput(e) }} />
        <button onClick={() => { this.force() }}>强制更新</button>
      </div>
    )
  }
}
class EventAPIChildren extends React.Component {
  constructor(props) {
    super(props)
    console.log('子级-------------constructor')
    this.state={
      a:'1'
    }
  }
  static getDerivedStateFromProps(props,state){
    console.log('子级------------子级getDerivedStateFromProps',props,state)
    return null
    }
    getSnapshotBeforeUpdate(){
    console.log('子级------------子级getSnapshotBeforeUpdate');
    return true
  }
  // 挂载完毕
  componentDidMount() {
    console.log('子级挂载完毕-------------子级componentDidMount')
  }
  // 即将更新

  // 是否更新
  shouldComponentUpdate() {
    console.log('子级是否应该更新-------------子级shouldComponentUpdate')
    return true
  }
  //更新完毕
  componentDidUpdate() {
    console.log('子级更新完毕-------------子级componentDidUpdate')
  }
  // 即将卸载
  componentWillUnmount() {
    console.log('子级即将卸载-------------子级componentWillUnmount')
  }

  deleteNode = () => {
    //卸载组件
    ReactDOM.unmountComponentAtNode(document.getElementById('root'))
  }

  render() {
    console.log('子级reder')
    return (
      <div>
        <button onClick={() => { this.deleteNode() }}>卸载</button>
        我是子组件{this.props.msg}
        <input name="name" onChange={(e) => { this.props.onChange(e) }}></input>
      </div>
    )
  }
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

