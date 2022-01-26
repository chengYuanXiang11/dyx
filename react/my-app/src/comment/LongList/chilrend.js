import './index.css'
import { useContext,memo } from 'react'
import {counterContext} from './index'

const Chilren = memo(function Chilren(){
    console.log('Chilrenrender')
    const context = useContext(counterContext)
    console.log(context)
    return(
        <div className="warper">
                {
                    context.map(
                        (v, k) => (
                            <div className="box" key={k}>
                                <hr />

                                <div  className="list-cell">
                                    This is {v + 1}
                                </div>
                                <hr />

                            </div>

                        )
                    )
                }
            </div>
    )
})
export default Chilren