import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assembly/testReact/CheckerBoard/index.css'

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
 // 子组件
  class CustomTextInputParent extends React.Component {
    render() {
      console.log(this)
      return (
        <div>
            <CustomTextInput onClick={(e) => { this.props.onClick(e);}} ></CustomTextInput>
             {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
        </div>
      )
    }
  }
// 孙组件
class CustomTextInput extends React.Component {
  // 声明使用ThemeContext
    static contextType = ThemeContext;
    handleValue() {
      console.log('class');
    }
    render() {
      //接收Context
      console.log(this.context)
      const item  = this.context
      return (
        <div>
             {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
          <div onClick={(e) => { this.props.onClick(e);this.handleValue() }} >{String(item)}</div>
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
    return (
      <>
       {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
       {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
        <Suspense fallback={<div>Loading...</div>}>
        {/* 异常捕获边界（Error boundaries） */}
          <ErrorBoundary>
            <ThemeContext.Provider value={this.state.focur}>
             <CustomTextInputParent  onClick={(e) => { this.handleValue() }}></CustomTextInputParent>
            </ThemeContext.Provider>
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



// import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import './assembly/testReact/CheckerBoard/index.css'

// import ThemeContext from './comment/ThemeContext'
// const CustomTextInput = React.lazy(() => import('./comment/Custom'))
// const Errorboundary = React.lazy(() => import('./comment/ErrorBoundary'))
// // const ThemeContext = React.lazy(() => import('./comment/ThemeContext'))
// // React.lazy 目前只支持默认导出（default exports）。如果你想被引入的模块使用命名导出（named exports），
// // 你可以创建一个中间模块，来重新导出为默认模块。这能保证 tree shaking 不会出错，并且不必引入不需要的组件。
// // export { MyComponent as default } from "./ManyComponents.js";
// class Parent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       focur: true
//     }
//   }
//   handleValue() {
//     this.setState({
//       focur: !this.state.focur
//     })
//   }
//   render() {
//     return (
//       <>
//         <Suspense fallback={<div>Loading...</div>}>
//           <Errorboundary>
//             <ThemeContext.Provider value={this.state.focur}>
//              <CustomTextInput  onClick={(e) => { this.handleValue() }}></CustomTextInput>
//             </ThemeContext.Provider>
//           </Errorboundary>
//         </Suspense>
//       </>
//     )
//   }
// }
// ReactDOM.render(
//   <Parent />,
//   document.getElementById('root')
// )











//动态context  
// 在 ThemeProvider 内部的 ThemedButton 按钮组件使用 state 中的 theme 值，
//     // 而外部的组件使用默认的 theme 值

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import './assembly/testReact/CheckerBoard/index.css'
// const themes = {
//   light: {
//     foreground: '#000000',
//     background: '#eeeeee',
//   },
//   dark: {
//     foreground: '#ffffff',
//     background: '#222222',
//   },
// };

// const ThemeContext = React.createContext(
//   themes.dark // 默认值
// );

// class ThemedButton extends React.Component {
//   static contextType = ThemeContext;
//   render() {
//     let props = this.props;
//     let theme = this.context;
//     return (
//       <button
//         {...props}
//         style={{backgroundColor: theme.background}}
//       />
//     );
//   }
// }

// function Toolbar(props) {
//   return (
//     <ThemedButton onClick={props.changeTheme}>
//       Change Theme
//     </ThemedButton>
//   );
// }

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       theme: themes.light,
//     };

//     this.toggleTheme = () => {
//       this.setState(state => ({
//         theme:
//           state.theme === themes.dark
//             ? themes.light
//             : themes.dark,
//       }));
//     };
//   }

//   render() {
//     // 在 ThemeProvider 内部的 ThemedButton 按钮组件使用 state 中的 theme 值，
//     // 而外部的组件使用默认的 theme 值
//     return (
//       <>
//         <ThemeContext.Provider value={this.state.theme}>
//           <Toolbar changeTheme={this.toggleTheme} />
//           <ThemedButton>11111111111111</ThemedButton>

//         </ThemeContext.Provider>
//         <ThemedButton>22222222222</ThemedButton>

//           </>
//     );
//   }
// }

// ReactDOM.render
//   (<App />,
//   document.getElementById('root')
// )import React, { Suspense } from 'react';




// 去除contenttype 使用Consumer
// import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import './assembly/testReact/CheckerBoard/index.css'

// const ThemeContext = React.createContext('light');
// // 错误边界
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { error: null, errorInfo: null };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Catch errors in any components below and re-render with error message
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     })
//     // You can also log error messages to an error reporting service here
//   }

//   render() {
//     if (this.state.errorInfo) {
//       // Error path
//       return (
//         <div>
//           <h2>Something went wrong.</h2>
//           <details style={{ whiteSpace: 'pre-wrap' }}>
//             {this.state.error && this.state.error.toString()}
//             <br />
//             {this.state.errorInfo.componentStack}
//           </details>
//         </div>
//       );
//     }
//     // Normally, just render children
//     return this.props.children;
//   }
// }
// // 子组件
// class CustomTextInputParent extends React.Component {
//   render() {
//     return (
//       <div>
//         <CustomTextInput></CustomTextInput>
//         {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
//       </div>
//     )
//   }
// }
// // 孙组件
// class CustomTextInput extends React.Component {
//   handleValue() {
//     console.log('class');
//   }
//   render() {
//     return (
//       <ThemeContext.Consumer>
//         {/* 多个参数记得名称相同 */}
//         {({focur,toggleTheme}) => (
//           <div>
//             {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
//             <div onClick={toggleTheme} >{String(focur)}</div>
//           </div>
//         )}

//       </ThemeContext.Consumer>

//     )
//   }
// }

// class Parent extends React.Component {
//   constructor(props) {
//     super(props) 
//     this.handleValue=()=> {
//     this.setState({
//       focur: !this.state.focur
//     })
//   }
//     this.state = {
//       focur: true,
//       toggleTheme:this.handleValue
//     }
//   }
 
//   render() {
//     return (
//       <>
//         {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
//         {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
//         <Suspense fallback={<div>Loading...</div>}>
//           {/* 异常捕获边界（Error boundaries） */}
//           <ErrorBoundary>
//             <ThemeContext.Provider value={this.state}>
//               <CustomTextInputParent></CustomTextInputParent>
//             </ThemeContext.Provider>
//           </ErrorBoundary>
//         </Suspense>
//       </>
//     )
//   }
// }
// ReactDOM.render(
//   <Parent />,
//   document.getElementById('root')
// )













//多个context 一起使用
// import React, { Suspense } from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import './assembly/testReact/CheckerBoard/index.css'

// const ThemeContext = React.createContext('light');
// const UserContext = React.createContext({
//   name: 'Guest',
// });
// // 错误边界
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { error: null, errorInfo: null };
//   }

//   componentDidCatch(error, errorInfo) {
//     // Catch errors in any components below and re-render with error message
//     this.setState({
//       error: error,
//       errorInfo: errorInfo
//     })
//     // You can also log error messages to an error reporting service here
//   }

//   render() {
//     if (this.state.errorInfo) {
//       // Error path
//       return (
//         <div>
//           <h2>Something went wrong.</h2>
//           <details style={{ whiteSpace: 'pre-wrap' }}>
//             {this.state.error && this.state.error.toString()}
//             <br />
//             {this.state.errorInfo.componentStack}
//           </details>
//         </div>
//       );
//     }
//     // Normally, just render children
//     return this.props.children;
//   }
// }
// // 子组件
// class CustomTextInputParent extends React.Component {
//   render() {
//     return (
//       <div>
//         <CustomTextInput></CustomTextInput>
//         {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
//       </div>
//     )
//   }
// }
// // 孙组件
// class CustomTextInput extends React.Component {
//   handleValue() {
//     console.log('class');
//   }
//   render() {
//     return (
//       <ThemeContext.Consumer>
//         {/* 多个参数记得名称相同 */}
//         {({ focur, toggleTheme }) => (
//           <UserContext.Consumer>
//             {/* 多个参数记得名称相同 */}
//             {(item) => (
//               <div>
//                 {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
//                 <div >{String(item)}</div>  
//                 <div>
//                   {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
//                   <div onClick={toggleTheme} >{String(focur)}</div>
//                 </div>
//               </div>
//             )}

//           </UserContext.Consumer>

//         )}

//       </ThemeContext.Consumer>

//     )
//   }
// }

// class Parent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.handleValue = () => {
//       this.setState({
//         focur: !this.state.focur
//       })
//     }
//     this.state = {
//       focur: true,
//       toggleTheme: this.handleValue
//     }
//   }

//   render() {
//     return (
//       <>
//         {/* Suspense 组件中渲染 lazy 组件，如此使得我们可以使用在等待加载 lazy 组件时做优雅降级（如 loading 指示器等）。 */}
//         {/* fallback 属性接受任何在组件加载过程中你想展示的 React 元素。你可以将 Suspense 组件置于懒加载组件之上的任何位置。你甚至可以用一个 Suspense 组件包裹多个懒加载组件 */}
//         <Suspense fallback={<div>Loading...</div>}>
//           {/* 异常捕获边界（Error boundaries） */}
//           <ErrorBoundary>
//             <ThemeContext.Provider value={this.state}>
//               <UserContext.Provider value='user'>
//                 <CustomTextInputParent></CustomTextInputParent>
//               </UserContext.Provider>
//             </ThemeContext.Provider>
//           </ErrorBoundary>
//         </Suspense>
//       </>
//     )
//   }
// }
// ReactDOM.render(
//   <Parent />,
//   document.getElementById('root')
// )
