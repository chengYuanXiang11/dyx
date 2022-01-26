import React,{useState} from 'react';
import './index.css'
// import sockets from '../socket.js'

export default function ChatRoom(props) {  
    const [chatName] = useState({name:"默认群名"})
    const [chatSize] = useState({size:1})
    return (
        <div className="haeder">
            <div> <img src="./logo192.png" alt=""/></div>
            <div>{chatName.name}({chatSize.size})</div>
            <div> <img src="./logo192.png" alt=""/></div>
        </div>
    )
}
