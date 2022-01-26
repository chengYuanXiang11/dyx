import React,{memo
    // ,useMemo
} from 'react'

  function ExpensiveTree(props) {
    console.log('ExpensiveTree')
    const SetE =(e) => {
        console.log('SetE2')
        props.setE({...props.E,name:e.target.value})
    }
 
    return (
        
        <div>
            state:{props.A}
            <input type="text" value={props.E.name} onChange={(e) => SetE(e)} />

        </div>
    )
}
export default memo(ExpensiveTree)
