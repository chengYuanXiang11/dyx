import { createStore,combineReducers,applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'

import { name as nameReducer,name2 as nameReducer3   } from './reducer'
import { name2 as nameReducer2   } from './reducer2'

import thunk from 'redux-thunk'
//两个reducer有
const allReducer = combineReducers({
    nameReducer,
    nameReducer2,
    nameReducer3
})

export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)))