import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assembly/CheckerBoard/index.css'
class CheckerBoard extends React.Component {
  render() {
    return (
      <div className="board">
        {this.props.history.map((v, i) => {
          return (
            <div key={i} onClick={(e) => { this.props.onClick(e, i) }}>{v}</div>
          )
        })}
      </div>
    )
  }
}
// const status = ['X', 'O']
class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 0 1 代表两个角色
      status: 0,
      arrayToA: [],
      arrayToB: [],
      arraySummary: {},
      history:Array(9).fill(null)
    }
  }
  handleValue(e, i) {
    console.log(e)
    console.log(i)
    this.setState({
      history:this.state.history[i]
    })
    // this.setState({
    //   arrayToA:
    //     this.state.arrayToA.push(i)
    // })
  }
  render() {
    return (
      <div>
        <div><CheckerBoard history={this.state.history} onClick={(e, i) => { this.handleValue(e, i) }}></CheckerBoard></div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)