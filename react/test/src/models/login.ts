import { Effect, useIntl,ImmerReducer, Reducer, Subscription } from 'umi';
import { login } from '../services/ant-design-pro/api'

// import { message } from 'antd';


// const intl = useIntl();

export type LoginStateType = {
    isLogin: boolean;
    loginDevice: string;
    loginId: string;
    loginType: string;
    loginIp:string;
    sessionTimeout: number;
    tokenActivityTimeout: number;
    tokenSessionTimeout: number;
    tokenTimeout: number;
    tokenName: string;
    tokenValue: string;
}

export type LoginModelType = {
    namespace:'login';
    state:Partial<LoginStateType>;
    effects:{
      signIn: Effect,
      signOut: Effect
    };
    reducers:{
      saveToken:Reducer<LoginStateType>,
      clearToken: Reducer<LoginStateType>;

      // saveToken:ImmerReducer<LoginStateType>,
      // clearToken: ImmerReducer<LoginStateType>;
    }
}

const LoginModel: LoginModelType={
  namespace: 'login',
  state: {
    isLogin: false,
  loginDevice: 'string',
  loginId: 'string',
  loginType: 'string',
  loginIp:'string',
  sessionTimeout: 2,
  tokenActivityTimeout: 3,
  tokenSessionTimeout: 4,
  tokenTimeout: 435,
  tokenName: 'string',
  tokenValue: 'string'
  },
  reducers: {
    saveToken(state,payload){
      // console.log(payload)

      // state = payload.payload
      console.log('okkkkk')
      // console.log(state)
      return {
        ...state,
        ...payload.payload,
      };
    },
    clearToken(state,action){
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects:{
    *signIn({ payload },{ call, put,select,take }){
     const res =  yield call(login,payload)
     console.log(res)
     if(res.status !== 'ok'){
      yield put({
          type:'saveToken',
          payload:{
            isLogin: true,
            loginDevice: 'string',
            loginId: 'loginId',
            loginType: 'string',
            loginIp:'string',
            sessionTimeout: 2,
            tokenActivityTimeout: 3,
            tokenSessionTimeout: 4,
            tokenTimeout: 435,
            tokenName: 'string',
            tokenValue: 'string'
          }
      })
      // const action = yield take('signIn');
      // console.log(action)
      // const defaultloginSuccessMessage = intl.formatMessage({
      //   id: 'pages.login.success',
      //   defaultMessage: '登录成功！',
      // });
      // message.success(defaultloginSuccessMessage);
    
     }
     const num = yield select((state: any) => state)
     console.log(num)
     return res
    },
    *signOut({ payload },{ call, put,select,take,takeEvery }){
      const res =  yield call(login,payload)
      // const num2 = yield select((state: any) => state)
      // console.log(num2)
      // const num2=yield take('signOut/@@start');
      // console.log(num2)
      if(res.status !== 'ok'){
        console.log('signOut')

        yield put({
            type:'signIn',
            payload:{
              isLogin: true,
              loginDevice: 'string',
              loginId: 'loginId',
              loginType: 'string',
              loginIp:'string',
              sessionTimeout: 2,
              tokenActivityTimeout: 3,
              tokenSessionTimeout: 4,
              tokenTimeout: 435,
              tokenName: 'string',
              tokenValue: 'string'
            }
        })
        // 再一个action中触发另一个action时候，等待第二个action执行完毕之后才会执行下面的
      yield take('signIn/@@end');
        console.log('23')
      }
        // const num = yield select((state: any) => state)
        // console.log(num)
        return res
     }
  } 
}


export default LoginModel;