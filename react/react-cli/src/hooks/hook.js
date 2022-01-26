import React,{useState} from 'react';

export default function Hook() {
  const [condition,changeCondition] = useState({state:12})

    return (
        <>
        <div onClick={()=>{changeCondition(a=>{return {state:a.state+1}})}}>
           {condition.state}
        </div>
        </>
    )
}
