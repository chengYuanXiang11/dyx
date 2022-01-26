import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ListItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return (<ul>
      {this.props.list.map((numbers, index) => {
        return <li key={index}> {numbers} </li>
      })}</ul>
    )
  }
}
ReactDOM.render(
  <ListItems list={[1, 2, 3, 4, 5]} />,
  document.getElementById('root')
)