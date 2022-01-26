import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios'
// // 本地json
// axios.get('./data.json').then((res) => {
//   var data = res.data
//   console.log(JSON.parse(JSON.stringify(data)))
// })
// const numbers = [1, 2, 3, 4, 5];
// const listItems = numbers.map((numbers)=>{
//   return  <li> {numbers} </li>
// });

function tick() {
  const element = (
    <div>
      <h1>hello,world</h1>
      <h2>It is {new Date().toLocaleTimeString()}</h2>
    </div>
  )
  ReactDOM.render(element, document.getElementById('root'))
}
setInterval(tick, 1000)