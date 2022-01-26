import React from 'react'

// search参数专用
// import qs from 'querystring'
export default function Todo1(props) {
    // params参数
    // const {match:{params:{id,title}}}=props
    
    // search参数
    // const  {location:{search}}=props
    // const{id,title}=qs.parse(search.slice(1))

    // state参数
    const  {location:{state}}=props
    const{id,title}=state ||{}
    console.log(props.history)
    // const replaceShow =()=>{
    //     props.history.replace('/home')
    // }
    const go=()=>{
        props.history.go(1)
    }
    const goback=()=>{
        props.history.goBack()
    }
    const goforward=()=>{
        props.history.goForward()
    }
    // setTimeout(() => {
    //     replaceShow()
    // }, 2000)
    return (
    
        <div>
            this is todo{id},{title}
            <button onClick={()=>{go(1)}}>go</button>
            <button onClick={()=>{goback()}}>goback</button>
            <button onClick={()=>{goforward()}}>goforward</button>

        </div>
    )
}
