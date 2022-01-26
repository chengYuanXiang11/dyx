import React, { Component } from 'react'
import axios from 'axios'
export default class index extends Component {
    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://localhost:3000/api1/getjson'
          }).then((res)=>{
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }
    render() {
        return (
            <div style={{}}>
                
            </div>
        )
    }
}
