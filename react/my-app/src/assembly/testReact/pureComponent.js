//优化
import React, {useState,useEffect, Component,PureComponent } from 'react'
import ReactDOM from 'react-dom';

// class PureComponents extends Component {
//   constructor(props){
//     super(props)
//     this.state= {
//       name:'c63'
//     }
//   }
//   render() {
//     console.log('p')
//     return (
//       <div>
//         这是pure组件{this.state.name}
//         <Child name={this.state.name}/>
//         <button onClick={()=>{
//           this.setState({
//             name:'a90'
//           })
//         }}>该</button>
//       </div>
//     )
//   }
// }

// class Child extends PureComponent {
//   constructor(props){
//     super(props)
//     this.state= {
//     }
//   }
//   render() {
//     console.log('c')

//     return (
//       <div>
//         这是Child组件{this.props.name}
//       </div>
//     )
//   }
// }
function  PureComponents(){
  const [a,ca]=useState({name:'c63'})
  console.log('ac')

  const myPromise=Promise.resolve(Promise.resolve("Promise!"))
  function funcOne(){
    myPromise.then(res=>res).then(res=>console.log(res))
    setTimeout(()=>
      console.log('Timeout0!')
    )
    console.log('Last line0')
  }
  async function funcTwo(){
   const res =await myPromise;
   console.log(await res,'1');
   setTimeout(() => 
    console.log('Timeout1!')
   );
   console.log('Last line1')

  }
  funcOne()
  funcTwo()
    return (
      <div>
        这是pure组件{a.name}
        <Child name={a.name}/>
        <button onClick={()=>{
         ca({
            name:'a90'
          })
        }}>该</button>
      </div>
    )
}

function Child(props){
  console.log('ac2')

    return (
      <div>
        这是Child组件{props.name}
      </div>
    )
}

ReactDOM.render(
  <PureComponents />,
  document.getElementById('root')
)