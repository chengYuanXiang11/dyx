// count的action对象
import {INCREMENT,DECEMENT} from './constant'
// import axios from 'axios'
// 同步action直接返回object
export const createIncrementAction = (data) => {
    return {
        type:INCREMENT,
        data: data
    }
 }
 export const createDecrementAction = (data) => {
    return {
        type: DECEMENT,
        data: data
    }
 }
 //异步action,返回函数
 export const asyncCreateIncrementAction = (data,time) => {
    return (dispatch)=>{
        setTimeout(() => {
            dispatch(createIncrementAction(data))
        }, time);
    }

 }