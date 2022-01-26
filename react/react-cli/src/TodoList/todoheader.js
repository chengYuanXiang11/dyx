import React, { Component } from 'react'

export default class TodoHeader extends Component {
    constructor(props){
        super(props)
        this.state={
            value:""
        }
    }
    changeInput=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    key=(e)=>{
        if(e.keyCode === 13){
            this.props.onClick(this.state.value)
              this.setState({
            [e.target.name]:""
        })
        }
      
    }
    render() {
        return (
            <>
             <input type="text"
             name="value"
             value={this.state.value}
              onChange={(e)=>{this.changeInput(e)}} 
             onKeyDown={(e)=>{this.key(e)}}/>   
            </>
        )
    }
}
