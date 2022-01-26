import React, { Component } from 'react'
import { nanoid } from 'nanoid' //唯一id

import dataList from './list.json'

import TodoHeader from './todoheader'
import TodoList from './todolist'
import TodoFooter from './todofooter'
import './todo1.css'

import Todo1 from './Todo1'
import { Route } from 'react-router-dom'

import MyNavLink from '../pages/MyNavLink'
// import style from './App.module.css' 

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // 元数据
            data: dataList,
            //已选中
            Selected: 0,
            //是否全部选中
            selectAll: false,
            messageArr: [
                {
                    id: '01', title: '消息1'
                },
                {
                    id: '02', title: '消息2'
                },
                {
                    id: '03', title: '消息3'

                }
            ],

        }
    }
    componentDidMount() {
        const newState = this.state
        this.selectIndex(newState)
    }
    //输入框添加
    addClick = (value) => {
        const newState = this.state
        let data = {
            "id": nanoid(),
            "name": value,
            "checked": false
        }
        newState.data = [data, ...newState.data]
        this.selectIndex(newState)
    }
    //点击删除
    deleteClick = (key) => {
        if (window.confirm('确定删除吗')) {
            const newState = this.state
            newState.data.splice(key, 1)
            this.selectIndex(newState)
        }

    }
    // 点击按钮选中
    selectClick = (e, key) => {
        const newState = this.state
        newState.data[key].checked = !newState.data[key].checked
        this.selectIndex(newState)
    }
    // 计算已选中
    selectIndex = (newState) => {
        let index = newState.data.reduce((index, value) => {
            if (value.checked === true) {
                index += 1
            }
            return index
        }, 0)
        if (index >= newState.data.length) {
            newState.selectAll = true
        } else {
            newState.selectAll = false
        }
        newState.Selected = index
        this.setState(newState)
    }
    // 全选或者全部不选
    selectAll = () => {
        const newState = this.state
        newState.data.map((value) => {
            value.checked = !newState.selectAll
            return value.checked
        })
        newState.selectAll = !newState.selectAll
        this.selectIndex(newState)
    }
    render() {
        const { messageArr } = this.state
        return (
            <div>
                <TodoHeader onClick={(value) => { this.addClick(value) }}></TodoHeader>
                <TodoList st data={this.state.data}
                    onClick={(e, key) => { this.selectClick(e, key) }}
                    onClick2={(key) => { this.deleteClick(key) }}
                >
                </TodoList>
                <TodoFooter
                    length={this.state.data.length}
                    {...this.state}
                    onClick={() => { this.selectAll() }}
                >122233</TodoFooter>
                <ul>
                    {
                        messageArr.map((value) => {
                            return (
                                <li key={value.id}>
                                    {/* params参数 */}
                                    {/* <MyNavLink  to={`/api/home/todo/${value.id}/${value.title}`}>{value.title}</MyNavLink> */}

                                    {/* search参数 */}
                                    {/* <MyNavLink to={`/api/home/todo?id=${value.id}&${value.title}`}>{value.title}</MyNavLink> */}

                                    {/* state参数 */}
                                    <MyNavLink 
                                    // replace
                                    to={{
                                        pathname: "/api/home/todo",
                                        state: value
                                    }}>{value.title}</MyNavLink>
                                </li>
                            )
                        })
                    }

                </ul>
                {/* params参数 */}
                {/* <Route path="/api/home/todo/:id/:title" component={Todo1} /> */}

                {/* search参数/state参数 */}

                <Route path="/api/home/todo" component={Todo1} />
            </div>
        )
    }
}
