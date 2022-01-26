import React, { Component } from 'react'
import TLCSS from './todolist.module.css'
import PropTypes from 'prop-types'


export default class TodoList extends Component {
    static propTypes={
        data:PropTypes.array.isRequired
    }
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <>
                {
                    this.props.data.map((value, key) => {
                        return (
                            <div key={value.id} className={TLCSS.tr}>
                                <span >
                                    <input type="checkbox"  checked={value.checked}
                                        onChange={(e) => { this.props.onClick(e, key) }} />
                                    {value.name}{key}
                                </span>
                                <input type="button" value="删除" className={TLCSS.button}
                                    onClick={() => { this.props.onClick2(key) }} />
                            </div>
                        )
                    })
                }
            </>
        )
    }
}
