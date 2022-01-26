import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class FancyBorder extends React.Component {
  render() {
    return (
      <div className={'FancyBorder FancyBorder-' + this.props.color}>
        {this.props.top}
        {this.props.left}
      </div>
    )
  }
}
class NarBar extends React.Component {
  render() {
    return(
      <div> WelcomeDialog</div>
    )
  }
}
class SideBar extends React.Component {
  render() {
    return(
      <div> Thank you for visiting our spaceraft!</div>
    )
  }
}
class WelcomeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { color: 'blue' }
  }
  render() {
    return (
      <FancyBorder color={this.state.color} top={<NarBar/>} left={<SideBar/>}>
      </FancyBorder>
    )
  }
}

ReactDOM.render(
  <WelcomeDialog />,
  document.getElementById('root')
)