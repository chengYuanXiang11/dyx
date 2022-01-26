import React from 'react';
// 子组件
import ThemeContext from './ThemeContext'
import { useSelector,useDispatch} from 'react-redux'
class CustomTextInput extends React.Component {
    static contextType = ThemeContext;
    handleValue() {
      console.log('class');
    }
    render() {
      const item  = this.context
      return (
        <div>
             {/* <div>{ Math.random() > 0.2 ? new Error('自定义错误！！！') : '没有错误'}</div> */}
          <div onClick={(e) => { this.props.onClick(e);this.handleValue() }} >{String(item)}</div>
        </div>
      )
    }
  }
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
  export default CustomTextInputParent