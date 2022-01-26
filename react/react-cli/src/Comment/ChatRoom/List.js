import React, {  useEffect } from 'react';
import Footer from './footer'
import Header from './header'
import {apd} from '../socket.js'
export default function ChatRoom(props) {
    useEffect(()=>{
    return apd(props.name)
    },[props.name])
        return (
            <div style={{ flex: "1" }}>
                <Header name={props.name} ></Header>
                <Footer name={props.name}  ></Footer>
            </div>
        )

};