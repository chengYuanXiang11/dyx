import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class NameForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '', password: '', text: '', org: '' }
  }
  submitValue(e) {
    e.preventDefault()
  }
  inputName(e) {
    this.setState({ name: e.target.value })
  }
  inputPassword(e) {
    this.setState({ password: e.target.value })
  }
  inputText(e) {
    this.setState({ text: e.target.value })
  }
  inputOrg(e) {
    this.setState({ org: e.target.value })
  }
  // 方法合辑
  inputCollection(e) {
    // this.setState({
    //   [e.target.name]:e.target.value
    // },(()=>{
    //   console.log(this.state)
    // }))
    this.setState((state,props)=>{
      return {
          [e.target.name]:e.target.value
        }
    },()=>{
      console.log(this.state)
    })
  }
  render() {
    return (
      <form onSubmit={(e) => { this.submitValue(e) }}>
        <label>
          帐号:
          <input type="text" name="name"
            value={this.state.name}
            // onChange={(e) => { this.inputName(e) }
            onChange={(e) => { this.inputCollection(e) }}></input>
        </label>
        <label>
          文本:
          <textarea name="text"
            value={this.state.text}
            // onChange={(e) => { this.inputText(e) }}
            onChange={(e) => { this.inputCollection(e) }}></textarea>
        </label>
        <label>
          密码:
          {/* onChange={(e) => { this.inputPassword(e) }} */}
          <input type="text" name='password' value={this.state.password} onChange={(e) => { this.inputCollection(e) }}></input>
        </label>
        <input type="submit" value="提交"></input>
        <label>
          {/* onChange={(e)=>{this.inputOrg(e)}} */}
          <select value={this.state.org} name="org" onChange={(e) => { this.inputCollection(e) }}>
            <option value="grapefruit">葡萄柚</option>
            <option value="lime">酸橙</option>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
        </label>
      </form>
    )
  }
}
ReactDOM.render(
  <NameForm />,
  document.getElementById('root')
)

// 222222.
// // 此时不可编辑
// ReactDOM.render(<input value="hi" />,document.getElementById('root'));
// // 2s后可编辑
// setTimeout(function() {
//   ReactDOM.render(<input value={null} />, document.getElementById('root'));
// }, 2000);
