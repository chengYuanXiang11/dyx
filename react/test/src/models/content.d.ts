import {LoginStateType} from './login'
import {ChartsStateType} from './charts'

export {LoginStateType}

export type ConnectState = {
    login: LoginStateType;
    charts: ChartsStateType;
  };