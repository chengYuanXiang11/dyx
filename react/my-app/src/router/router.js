import React,{Suspense,lazy} from 'react'
import { BrowserRouter, Route, NavLink,Switch,Redirect } from "react-router-dom";
import { Provider } from 'react-redux'
import store from '../store/store'
const Dowload = lazy(()=>import('../comment/Dowload'));
const LongList = lazy(()=>import('../comment/LongList'));
const Example = lazy(()=>import('../comment/ac'));

export default function RouterApp() {
    return (
        <>
            <BrowserRouter>
                <div>
                    <ul>
                        <li>
                             <NavLink to="/Dowload">Dowload</NavLink>
                        </li>
                        <li>
                             <NavLink to="/reacthooks">reacthooks</NavLink>
                        </li>
                        <li>
                             <NavLink to="/LongList">LongList</NavLink>
                        </li>
                        <li>
                             <NavLink to="/example">example</NavLink>
                        </li>
                    </ul>
                </div>
            <Provider store={store}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Switch>
                                <Route path='/Dowload' component={Dowload} />
                                <Route path='/LongList' component={LongList} />
                                <Route path='/example' component={Example} />
                                {/* <Route path='/reacthooks' component={ReactHooks} /> */}

                            </Switch>
                            <Redirect to="/" />
                        </Suspense>
                    </Provider>
            </BrowserRouter>

        </>
    )

}