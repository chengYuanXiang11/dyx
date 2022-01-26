import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './assembly/CheckerBoard/index.css'
function Columns(props){
    return (
      <>
        {
          props.item.map((item, index) => (
            <React.Fragment key={index}>
              <td>{item}</td>
            </React.Fragment>

          )
          )
        }

      </>
    )
}
class Glossary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item1: {
        term: 'name is C',
        description: 'v 1.1'
      },
      item2: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  }
  render() {
    return (
      <table>
        <tbody>
          <tr><Columns item={this.state.item2} /></tr>
        </tbody>
      </table>
    );
  }
}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  handleValue() {
    console.log('class'); this.props.input.current.focus();
  }
  render() {
    return (
      <div>
        <Glossary ></Glossary>
        <div onClick={() => { this.handleValue() }} >dianji</div>
        <input type="text" ref={this.props.input} />
      </div>
    )
  }
}
class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    return (
      <CustomTextInput input={this.textInput}></CustomTextInput>
    )
  }
}
ReactDOM.render(
  <Parent />,
  document.getElementById('root')
)