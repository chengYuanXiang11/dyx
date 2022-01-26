import axios from 'axios'
import React, { useState } from 'react';

export default function SearchHader(props) {
    const [condition, changeCondition] = useState(1)//输入框
    console.log('子组件更新')
    const changeInput = (e) => {
        changeCondition(e.target.value)
    }
    const key = (e) => {
        if (e.keyCode === 13) {
            changeCondition("");
            // fetch发请求
            // fetch("http://localhost:5000/getjson").then(
            //     (res) => { console.log(res); 
            //         return res.json() }).then(
            //             (data) => { 
            //                 console.log(data) })
            //                 .catch((err) => {
            //                      console.log(err) })

            // axios.get('http://localhost:3000/a.jswon').then((res) => {
                setTimeout(() => {
                    props.changeImg('res.data')
                },1000);
            // }).catch(err => {
                // changeImg(`${err.message}:请求失败`)
            // })
        }
    }
    return (
        <>
            <h1>Search HUB Name{condition}</h1>
            <div>
                <input type="text" placeholder="enter the name"
                    onChange={(e) => { changeInput(e) }}
                    value={condition}
                    onKeyDown={(e) => { key(e) }}
                />
                <button onClick={() => { }}>Search</button>
            </div>
        </>
    )
}
