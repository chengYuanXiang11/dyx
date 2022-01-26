import React,{ Suspense,useState, useCallback } from 'react';
import Err from './err'
//组件懒加载
const List = React.lazy(() => import('./List'));
export default function ChatRoom() {
    const [Name, changeChatName] = useState({ name: "小花花" })
    const changeName = useCallback((e) => {
        if (e.key === "Enter")
            changeChatName({ "name": e.target.value })
    },[])
    if (Name.name === '小花花') {
        console.log('hua')
        return (
            <div style={{ flex: "1" }}>
                <Err changeName={changeName}></Err>
            </div>
        )
    } else {
        return (
            <div style={{ flex: "1" }}>
        <Suspense fallback={<div>Loading...</div>}>

                <List name={Name.name} changeName={(e)=>{changeName(e)}}></List>
        </Suspense>
            </div>
        )
    }

};