// import { render } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
// 正常更新 会触发 shouldComponentUpdate的阀门控制
// 强制更新 会跳过shouldComponentUpdate的阀门控制
class EventAPI extends React.Component {
  constructor(props) {
    console.log('父级-------------constructor')
    super(props)
    this.state = {
      name: "fater",
      opacity: 1
    }
  }
  // 强制更新 不修改状态直接更新状态 会跳过shouldComponentUpdate的阀门控制
  force = () => {
    this.forceUpdate()
  }
  // 即将接收props 首次挂载时接收props不执行(此时父级不会执行，因为父级没有更高级的父,不会接收新的props)
  UNSAFE_componentWillReceiveProps() {
    console.log('父级即将接收props-------------父级componentWillReceiveProps')
  }
  // 将要挂载 
  // 警告 componentWillMount has been renamed,
  //  and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.
  // componentWillMount已重命名，不建议使用。看到了吗https://reactjs.org/link/unsafe-component-lifecycles 详情。

  UNSAFE_componentWillMount() {
    console.log('父级将要挂载-------------父级componentWillMount')
  }
  // 挂载完毕
  componentDidMount() {
    console.log('父级挂载完毕-------------父级componentDidMount')
    // this.timer()
  }
  // 即将更新
  UNSAFE_componentWillUpdate() {
    console.log('父级即将更新-------------父级componentWillUpdate')
  }
  // 是否应该更新 默认返回真 如果不写return默认返回undefined 
  shouldComponentUpdate(nextProps,nextState) {
                        //下一个props，下一个state
                        // this.props,this.state
                        //当前的props 当前的state
    console.log('父级是否应该更新-------------父级shouldComponentUpdate')
    return true
  }
  //更新完毕
  componentDidUpdate() {
    console.log('父级更新完毕-------------父级componentDidUpdate')
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
        <EventAPIChildren msg={this.state.name} onClick={(e) => { this.changInput(e) }} />
        <button onClick={() => { this.force() }}>强制更新</button>
      </div>
    )
  }
}
class EventAPIChildren extends React.Component {
  constructor(props) {
    super(props)
    console.log('子级-------------constructor')
  }
  // 即将接收props 首次挂载时接收props不执行 改变时接收新的props才会执行
  UNSAFE_componentWillReceiveProps() {
    console.log('子级即将接收props-------------子级componentWillReceiveProps')
  }
  // 即将挂载
  UNSAFE_componentWillMount() {
    console.log('子级将要挂载-------------子级componentWillMount')
  }
  // 挂载完毕
  componentDidMount() {
    console.log('子级挂载完毕-------------子级componentDidMount')
  }
  // 即将更新
  UNSAFE_componentWillUpdate() {
    console.log('子级即将更新-------------子级componentWillUpdate')
  }
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
        <input name="name" onChange={(e) => { this.props.onClick(e) }}></input>
      </div>
    )
  }
}
ReactDOM.render(
  <EventAPI />,
  document.getElementById('root')
)

