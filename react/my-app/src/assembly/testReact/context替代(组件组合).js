import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assembly/testReact/CheckerBoard/index.css'

// 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
// 子组件
class CustomTextInputParent extends React.Component {
  render() {
    return (
      <div style={{    'userSelect':'none',
        'cursor': 'pointer'}}>
        {this.props.userLink}
        {/* <CustomTextInput onClick={(e) => { this.props.onClick(e);}} ></CustomTextInput> */}
        {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
      </div>
    )
  }
}
// 孙组件
class CustomTextInput extends React.Component {
  handleValue() {
    console.log('class');
  }
  render() {
    return (
      <div onClick={ () => { this.props.onClick()}}>
        {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
        {String(this.props.item)}
      </div>
    )
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      focur: true
    }
  }
  handleValue() {
    this.setState({
      focur: !this.state.focur
    })
  }
  render() {
    // 直接对孙组件传值
    const userLink = (<CustomTextInput item={this.state.focur}  onClick={(e) => { this.handleValue()}}/>)
    return (
      <>
        {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
        {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* 异常捕获边界（Error boundaries） */}
          <ErrorBoundary>
            <CustomTextInputParent userLink={userLink} ></CustomTextInputParent>
          </ErrorBoundary>
        </Suspense>
      </>
    )
  }
}
ReactDOM.render(
  <Parent />,
  document.getElementById('root')
)