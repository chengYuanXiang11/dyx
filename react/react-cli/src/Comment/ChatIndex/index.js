import React from 'react';
import ChatLeft from '../Chat'
import ChatRight from '../ChatRoom'
import './index.css'
export default function ChatRoom() {
    return (
        <div className="layth">
            <ChatLeft/>
            <ChatRight/>
        </div>
    )
}
