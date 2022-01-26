# 模块

    向外提供特定功能的js程序
    复用js

# 组件

    用于实现局部功能效果的代码和资源的集合(html/css/js/image等)
    复用编码,简化项目,提高效率

# React

    组件首字母大写,小写则视为html标签

    function ListItem(props){
    return (
      <Fragment>//可以在不多创建dom的情况下包裹,只可添加属性key,可简写为<></>,但是<>不可以传key
        <dt>{props.item.term}</dt>
        <dt>{props.item.description}</dt>
      </Fragment>
    )

}
编译为
"use strict";

function ListItem(props) {
return /_#**PURE**_/React.createElement(Fragment, null,

/_#**PURE**_/React.createElement("dt", null, props.item.term),
/_#**PURE**_/React.createElement("dt", null, props.item.description));
}
虚拟 DOM => 真实 DOM

# ReactDOM.render()

    function组件会找到组件,将虚拟DOM转为真实DOM
    class组件会先找到组件，随后new出该类的实例，并且通过实例调用到原型上的render方法,最后将render返回的虚拟dom转为真实dom

# 简单组件&&复杂组件(有无状态 state)

# setState 写法(如果要修改的依赖原状态则使用函数,否则使用对象)

## 对象式

1.setState({})
2.setState 是一个异步更新的,想要在 setState 之后需要回调
setState({},()=>{//回调})

## 函数式

setState((state,props)=>{
return{count:state.count+1}
},()=>{
//回调
})

# RefHook

const myRef = useRef()
myRef.current.value

## content 在 function 中使用 Consumer

# PureComponent(在组件 render 之前对 state 和 props 进行浅比较,无变化则不进行重新渲染)
  在生命周期
    shouldComponentUpdate(nextProps,nextState) {
                        //下一个props，下一个state
                        // this.props,this.state
                        //当前的props 当前的state
                        通过对比state和nextState返回true或者false
    return true
  }

# react render 渲染是主进程,宏任务微任务都得让道儿
