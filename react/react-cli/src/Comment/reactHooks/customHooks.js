import { useLayoutEffect, useEffect, useState } from 'react';

export const useNumber =(code)=>{
    const [ state,setstate ] = useState(code)
    // 可以使用它来读取 DOM 布局并同步触发重渲染
    useLayoutEffect(()=>{
        console.log(`执行useLayoutEffectt`)

    },[])
    useEffect(()=>{
        console.log(`执行useEffect`)
        return{
            //卸载时操作
        }
    },[]) 
    return [state,setstate ]
}