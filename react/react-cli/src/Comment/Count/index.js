import React from 'react'
import store from '../../redux/store'
export default function Count() {
    return (
        <div>
            {store.getState()}
        </div>
    )
}
