import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const scaleName={
  'c':'摄氏度',
  'f':'华氏度'
}
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
// 数据转换集中
function tryConvert(value,convert){
  const input = parseFloat(value)
  console.log('tryConvert')
  if(Number.isNaN(input)){
    return ''
  }
  const count = convert(input)
  const rounded = Math.round(count *1000) /1000
  return rounded.toString()
}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    const scale = this.props.scale
    const cesisu = this.props.celsius
    console.log(cesisu)
    return (
      <div>
        {scaleName[scale]}
        {/* {tryConvert(cesisu,scale==='c'?toFahrenheit:toCelsius)} */}
        <input value={cesisu} onChange={(e) => { this.props.onChange(e) }} />
      </div>

    )
  }
}
class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {scale:'c',celsius: 10}
  }
  handleInputC(e) {
    console.log('c')

    this.setState({scale:'c', celsius: e.target.value })
  }
  handleInputF(e) {
    console.log('f')

    this.setState({scale:'f', celsius: e.target.value })
  }
  render() {
    const value = this.state.celsius 
    const scale = this.state.scale;
    console.log(value)

    console.log(scale)
    const celsius = scale === 'f' ? tryConvert(value, toCelsius) : value;
    const fahrenheit = scale === 'c' ? tryConvert(value, toFahrenheit) : value;
    console.log(fahrenheit)
    return (<div>
      <input value={value} />
      <TemperatureInput
        celsius={fahrenheit}
        onChange={(e) => { this.handleInputF(e) }}
        scale='f'
      />
      <TemperatureInput
        celsius={celsius}
        onChange={(e) => { this.handleInputC(e) }}
        scale='c'
      />
    </div>
    )
  }
}
ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
)