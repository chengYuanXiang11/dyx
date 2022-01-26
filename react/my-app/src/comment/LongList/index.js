
import { useState , useMemo,createContext,memo,useCallback } from 'react'
import './index.css'
import Chilren from './chilrend'
export const counterContext = createContext()
export default function LongList() {
    console.log('render')
    const stateArray = () => {
        ""
        return Array.from(Array(100).keys())
    }
    const [arr, setArr] = useState(stateArray);
    const [ ar , setArs ] = useState([1,2,3,4,5,6])
    const setAr = ()=>{
        setArr( Array.from(Array(100).keys()) )
    }

    const data = useMemo(() => {
        return ar
    }, [])
    return (
        <>
        <counterContext.Provider value={data}>
              <Chilren></Chilren>
        </counterContext.Provider>
        <button onClick={()=>{setAr()}}>setAr</button>
          

        </>
    )
}