import React from 'react'

export default function err(props) {
    return (
        <div>
              <input type="text" placeholder="填写用户名" onKeyDown={(e) => { props.changeName(e) }} />
        </div>
    )
}
