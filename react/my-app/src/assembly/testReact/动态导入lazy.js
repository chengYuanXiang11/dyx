import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assembly/testReact/CheckerBoard/index.css'
//懒加载一般用于路由懒加载
const CustomTextInput = React.lazy(() => import('./comment/Custom'))
const Errorboundary = React.lazy(() => import('./comment/ErrorBoundary'))
const ThemeContext = React.lazy(() => import('./comment/ThemeContext'))
// React.lazy 目前只支持默认导出（default exports）。如果你想被引入的模块使用命名导出（named exports），
// 你可以创建一个中间模块，来重新导出为默认模块。这能保证 tree shaking 不会出错，并且不必引入不需要的组件。
// export { MyComponent as default } from "./ManyComponents.js";
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
    return (
      <>
       {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
       {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
        <Suspense fallback={<div>Loading...</div>}>
        {/* 异常捕获边界（Error boundaries） */}
          <Errorboundary>
            
          {/* Context */}
            <ThemeContext.Provider item={this.state.focur}>
             <CustomTextInput  onClick={(e) => { this.handleValue() }}></CustomTextInput>
            </ThemeContext.Provider>
          </Errorboundary>
        </Suspense>
      </>
    )
  }
}
ReactDOM.render(
  <Parent />,
  document.getElementById('root')
)