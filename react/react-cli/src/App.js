import React, { Suspense, lazy } from 'react'
//Suspense是页面加载完成之前做的事
// import style from './App.module.css' 
import Todo from './TodoList/Todo'
// import AXIOS from './axios'
// import Hook from './hooks/hook'
// import Sear from './Sear'
// import Chat from './Comment/ChatRoom'
import Calculation from './Comment/Calculation'
// import CalculationReact from './Comment/CalculationReact/index'
// import ReactHooks from './Comment/reactHooks'
import store from './redux/store'
import { Provider } from 'react-redux'
//网络路由    //本地路由
import {
    BrowserRouter,
    // HashRouter ,
    Route, Switch, Redirect
} from 'react-router-dom';
import './index.css'
import MyNavLink from './pages/MyNavLink'
const Chat = lazy(() => import('./Comment/ChatRoom'))
const Sear = lazy(() => import('./Sear/index'))
const CalculationReact = lazy(() => import('./Comment/CalculationReact/index'))
const Video = lazy(() => import('./Comment/Vedio'))

const ReactHooks = React.lazy(() => import('./Comment/reactHooks'))

// export default class App extends Component {
export default function App() {
    return (
        <div className="waper">
            <BrowserRouter>
                <div>
                    <ul>
                        <li>
                            <MyNavLink to="/api/home">Home</MyNavLink>|
                        </li>
                        <li>
                            <MyNavLink to="/api/1/1238">Sear</MyNavLink>|
                        </li>
                        <li>
                            <MyNavLink to="/chat">Chat</MyNavLink>|
                        </li>
                        <li>
                            <MyNavLink to="/calculation">redux</MyNavLink>
                        </li>
                        <li>
                            <MyNavLink to="/calculationreact">react-redux</MyNavLink>|
                        </li>
                        <li>
                            <MyNavLink to="/reacthooks">react-hooks</MyNavLink>|
                        </li>
                        <li>
                            <MyNavLink to="/video">视频帧截取</MyNavLink>|
                        </li>
                    </ul>
                </div>
                <div>
                    <Provider store={store}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>

                                <Route path='/api/home' component={Todo} />
                                <Route path='/api/1/:id' component={Sear} />
                                <Route path='/chat' component={Chat} />
                                <Route path='/calculation' component={Calculation} />
                                <Route path='/calculationreact' component={CalculationReact} />
                                <Route path='/reacthooks' component={ReactHooks} />
                                <Route path='/video' component={Video} />

                            </Switch>
                            <Redirect to="/reacthooks" />
                        </Suspense>
                    </Provider>
                </div>

                {/* ，就是a标签target为_blank时，要加上rel="noopener noreferrer"。来防止钓鱼网站，因为它获取的window.opener的值为null */}
                {/* <a
                className={style.title}
                href="https://reactjs.org"
                   target="_blank"
                rel="noopener noreferrer"
                >
                Learn Reactgt
                </a> */}
                {/* <Todo></Todo> */}
                {/* <Hook/> */}
                {/* <AXIOS/> */}
                {/* <SearchList></SearchList> */}
            </BrowserRouter>
        </div>
    )
}
