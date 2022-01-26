
import { createStore ,applyMiddleware } from 'redux'

//引入为单一组件服务的reducer
import allReducer from './reducer'

import { composeWithDevTools } from 'redux-devtools-extension'


import thunk from 'redux-thunk'
//合并redures

// applyMiddleware执行中间件
export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)));


// const state = store.getState();
