import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class CustomTextInput extends React.Component {
    // handleValue() {
    //   console.log('class');
    // }
    render() {
      console.log(this)
      const item  = this.props.item
      return (
        <div>
             <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div>
          <div onClick={(e) => { this.props.onClick(e);this.handleValue() }} >{String(item)}</div>
        </div>
      )
    }
  }
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
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary>
          <CustomTextInput item={this.state.focur} onClick={(e) => { this.handleValue() }}></CustomTextInput>
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