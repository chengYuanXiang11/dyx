import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js'

// import { Provider } from "react-redux";
// import store from "./store";

import './index.css'
import reportWebVitals from './reportWebVitals'
ReactDOM.render(
  //检查代码里不合理的地方(例如:过时的api)   
  <React.StrictMode>
    {/* <Provider store={store}> */}
      <App></App>
    {/* </Provider> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// 在你的应用程序中测量性能，传递一个函数记录结果（例如：reportWebVitals（console.log））
reportWebVitals(console.log);
  // FP：First Paint，第一次绘制。
  // FCP：First Contentful Paint，第一次内容绘制。
  // LCP：Largest Contentful Paint，最大内容绘制。
  // DCL：Document Content Loaded，DOM 内容加载完毕。