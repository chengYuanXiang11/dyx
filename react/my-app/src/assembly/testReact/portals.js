import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './assembly/testReact/index.css'
import './index.css';
import './assembly/testReact/CheckerBoard/index.css'
const moRoot = document.getElementById('moroot');

const ThemeContext = React.createContext('light');

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
// 弹窗组件
class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }
  // 注意需要新建div加入到新的div中
  componentDidMount() {
    moRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    moRoot.removeChild(this.el);
  }
  
  render() {
    const model = (
      <ThemeContext.Consumer >
        {({ focur, toggleTheme }) => (
              focur?
            <div className="modal">
              <div>
                With a portal, we can render content into a different
                part of the DOM, as if it were any other React child.
              </div>
              This is being rendered inside the #modal-container div.
              <button onClick={toggleTheme}>{String(focur)}</button>
            </div> : null
        )
        }
      </ThemeContext.Consumer>
    )
    return (
        // model加入到div中
      ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      model ,
      // A DOM element
      this.el,
    )
    )
    // return ReactDOM.createPortal(
    //   // Any valid React child: JSX, strings, arrays, etc.
    //   model,
    //   // A DOM element
    //   this.el,
    // );
  }
}
function Child() {
    // 这个按钮的点击事件会冒泡到父元素
    // 因为这里没有定义 'onClick' 属性
    return (
      <div >
        <button>Click</button>
      </div>
    );
  }
  
// 孙组件
class CustomTextInput extends React.Component {
  handleValue() {
    console.log('class');
  }
  render() {
    return (

      <ThemeContext.Consumer>
        {(
          { focur, toggleTheme }) => (
            <div>
              <div onClick={toggleTheme} >{String(focur)}</div>
            </div> 
        )}
      </ThemeContext.Consumer>
    )
  }
}
class CustomTextInputParent extends React.Component {
  render() {
    return (
      <div>
        <CustomTextInput></CustomTextInput>
        <Modal> <Child></Child></Modal>
        {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
      </div>
    )
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.handleValue = () => {
      this.setState({
        focur: !this.state.focur
      })
    }
    this.state = {
      focur: true,
      toggleTheme: this.handleValue
    }
  }
  render() {
    // 直接对孙组件传值
    return (
      <>
        {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
        {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* 异常捕获边界（Error boundaries） */}
          <ErrorBoundary>

            {/* -------------------------- */}
            <ThemeContext.Provider value={this.state}>
              <CustomTextInputParent></CustomTextInputParent>
            </ThemeContext.Provider>
            {/* ------------------------- */}

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