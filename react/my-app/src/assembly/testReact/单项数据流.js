import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import axios from 'axios'
// // 本地json
// axios.get('./data.json').then((res) => {
//   var data = res.data
//   console.log(JSON.parse(JSON.stringify(data)))
// })
class UserClock extends React.Component {
  render() {
    return (
      <div>无权访问</div>
    )
  }
}
class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.a = 'd'
    this.state = { date: new Date() }
    // 为了在回调中使用 `this`，这个绑定是必不可少的 
    // 默认React是有this自动绑定的，当然限于使用React.createClass创建的类组件，
    // 其他使用ES6类语法并不会绑定this环境，
    // this.dist = this.dist.bind(this)
  }
  tick() {
    this.setState({
      date: new Date()
    })
    // 修改state中的某个属性为对象时 
    // 如 下面要修改dis的值
    // this.state = {
    //   dis:{color: 'red',fontSize:'20px',transition:"all 2s"}
    // }
    // let newTestData=Object.assign({},this.state.dis,{opacity:'0'})
    // this.setState({
    //   dis:newTestData
    // })
  }
  // 实验性语法 但是建议使用
  dist = (e) => {
    // console.log(e);
    // console.log('dist');
    // console.log(this);
  }

  // 注意 此时必须使用bind重新绑定this
  // dist(){
  //   (()=>{
  //     console.log('dist');
  //     console.log(this);

  //   })()
  // }
  componentDidMount() {
    this.tierID = setInterval(() => this.tick(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.tierID)
  }
  render() {
    return (
      <div onClick={this.props.onClick}>
        <h1 onClick={() => this.dist(this.state)}> Hello, world!</h1>
        <h1 onClick={this.dist}> Hello, world!</h1>

        <h2> It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    )
  }
}
class GreetingFrom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const user = this.props.name
    return (
      <div onClick={()=>{this.props.onClick()}}>
        {/* {user === 'admin' ? <Clock /> : <UserClock />} */}
        {user === 'admin' ? <Clock /> :<UserClock />}

      </div>
    )
  }
}
function Admin(props) {
  return (
    <button onClick={props.onClick}>logout</button>
  )
}
function User(props) {
  return (
    <button onClick={props.onClick}>login</button>
  )
}
class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.state = { names: props.names }
  }
  handleAdmin() {
    this.setState({ names: 'admin' })
    console.log('handleAdmin')
  }
  handleUser() {
    this.setState({ names: 'user' })
  }
  render() {
    const users = this.state.names;

    let button;
     
      users === 'admin'? button = <Admin  onClick={() => { this.handleUser() } }/>
      :    button = <User onClick={() => { this.handleAdmin() } }/>
    return (
      <div>
        <GreetingFrom name={users} onClick={() => { this.handleAdmin() } }/>
        {button}</div>

    )
  }
}

ReactDOM.render(
  <Greeting />,
  document.getElementById('root')
)
// function Greeting(props){
          // const userName = props.name;
          // if(userName === 'admin'){
          //   return <Clock/>
          // }
          // return <UserClock />

          // }
      
// function Square(props) {
//   return (
//     <button className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   )
// }
// class Board extends React.Component {
//   // constructor(props) {
//   //   super(props);
//   //   this.state = {
//   //     squares: Array(9).fill(null),
//   //     xIsNext: true
//   //   };
//   // }
//   // handleClick(i) {
//   //   const squares = this.state.squares.slice();
//   //   console.log(squares)
//   //   if (calculateWinner(squares) || squares[i]) {
//   //     return;
//   //   }
//   //   squares[i] = this.state.xIsNext ? 'X' : 'O';
//   //   this.setState({
//   //     squares: squares,
//   //     xIsNext: !this.state.xIsNext
//   //   });
//   // }
//   renderSquare(i) {
//     return <Square value={this.props.squares[i]}
//       onClick={() => this.props.onClick(i)} />;
//   }

//   render() {
//     // const status = 'Next plhis.ayer:' + (this.state.xIsNext ? 'X' : 'O');

//     return (
//       <div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       history: [{
//         squares: Array(9).fill(null),
//       }],
//       stepNumber:0,
//       xIsNext: true,
//     }
//   }
//   jumpTo(step){
//     this.setState({
//       stepNumber: step,
//       xIsNext:(step % 2) ===0
//     })
//   }
//   handleClick(i) {
//     const history = this.state.history.slice(0, this.state.stepNumber + 1);
//     const current = history[history.length - 1];
//     const squares = current.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       history: history.concat([{
//         squares: squares,
//       }]),
//       stepNumber: history.length,
//       xIsNext: !this.state.xIsNext,
//     });
//   }
//   render() {
//     const history = this.state.history;
//     const current = history[this.state.stepNumber];
//     const winner = calculateWinner(current.squares);
//     const movers = history.map((step, move)=>{
//       const desc = move? 'Go to move #' + move:'Go to game start';
//       return (
//         <li key={move}>
//           <button onClick={()=>this.jumpTo(move)}>{desc}</button>
//         </li>
//       )
//     })
//     let status;
//     if (winner) {
//       status = 'winner' + winner
//     } else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board squares={current.squares}
//             onClick={(i) => this.handleClick(i)} />
//         </div>
//         <div className="game-info">
//           <div>{ status }</div>
//           <ol>{ movers }</ol>
//         </div>
//       </div>
//     );
//   }
// }

// // ========================================

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }