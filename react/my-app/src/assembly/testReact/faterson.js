import React from 'react'
import  ReactDom from 'react-dom'
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

// 组件数据传递只看父组件传的的数据
  function Avatar(props) {
    return (
      <img className="avatar"
        src={props.user.avatarUrl}
        alt={props.user.name}
      />
      
    )
  }

  function UserInfo(props) {
    return (
      <div className="UserInfo">
          <Avatar user={props.user} />
        <div className="UserInfo-name">
          {props.user.name}
        </div>
      </div>
    )
  }
  function Comment(props) {
    return (
      <div className="Comment">
        <UserInfo user={props.author} />

        <div className="Comment-text">
          {props.text}
        </div>
        <div className="Comment-date">
          {formatDate(props.date)}
        </div>
      </div>
    );
  }
  function formatDate(date) {
    return date.toLocaleDateString();
  }
  const comment = {
    date: new Date(),
    text: 'I hope you enjoy learning React!',
    author: {
      name: 'Hello Kitty',
      avatarUrl: 'https://placekitten.com/g/64/64',
    },
  };
  ReactDOM.render(
    <Comment
    date={comment.date}
    text={comment.text}
    author={comment.author}
  />,
    document.getElementById('root')
  )