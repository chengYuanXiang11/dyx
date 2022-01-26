import React, { useState, useEffect } from 'react';
import { str } from '../socket.js'

export default function Footer(props) {
    const [news, changeChatnews] = useState('')
    const myref = React.createRef()
    useEffect(() => {
        if(myref.current.value!=='') // userEffect首次不加载
        return str(props.name, news)
    }, [myref, news, props.name])
    // changeChatName("name")
    const sendMessage = (e) => {
        if (e.key === "Enter") {
            changeChatnews(e.target.value)
        }
    }
    return (
        <div >
            <input type="text" ref={myref} value={props.news}
                onKeyDown={(e) => { sendMessage(e) }}
            />
        </div>
    )

};