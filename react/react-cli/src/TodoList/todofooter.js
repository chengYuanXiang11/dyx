import React, { Component } from 'react'

export default class TodoFooter extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
        return (
            <div>
             <input type="radio" checked={this.props.selectAll}  onChange={()=>{}} onClick={()=>{this.props.onClick()}}/>
             <span>已选中{this.props.Selected}/全部{this.props.length}</span>
              {/* 插槽 */}
             {this.props.children}
            </div>
        )
    }
}
