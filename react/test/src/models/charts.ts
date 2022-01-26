import { Effect, useIntl, ImmerReducer, Reducer, Subscription } from 'umi';
import { io } from 'socket.io-client'
import { bjCharts, pieCharts } from '@/services/ant-design-pro/api'
import { cMdate } from '@/utils/dataProcessing'
import * as echarts from 'echarts/core';
import {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption
} from 'echarts/charts';
// import {
//     // 组件类型的定义后缀都为 ComponentOption
//     TitleComponentOption,
//     GridComponentOption
// } from 'echarts/components';
export type ECOption = echarts.ComposeOption<
  BarSeriesOption | LineSeriesOption | PieSeriesOption | ScatterSeriesOption
>;

// const intl = useIntl();

export type ChartsStateType = {
  ws: object,
  option: ECOption,
  pieOption1: ECOption,
  pieOption2: ECOption,
  memory: number,
  cpu: number
  data: number[]
}

export type ChartsModelType = {
  namespace: 'charts';
  state: Partial<ChartsStateType>;
  effects: {
    signIn: Effect,
    signOut: Effect,
    signPie: Effect,
    signShu: Effect,

  };
  reducers: {
    updateWS: Reducer<ChartsStateType>,
    updateWS2: Reducer<ChartsStateType>;

    // saveToken:ImmerReducer<LoginStateType>,
    // clearToken: ImmerReducer<LoginStateType>;
  }
  subscriptions: { setup: Subscription };
}

const ChartsModel: ChartsModelType = {
  namespace: 'charts',
  state: {
    ws: {},
    option: {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }]
    },
    memory: 0,
    cpu: 0,
    pieOption1: {},
    pieOption2: {
    },

    data: []
  },
  reducers: {
    updateWS(state, payload) {
      // state = payload.payload
      return {
        ...state,
        ...payload.payload,
      };
    },
    updateWS2(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  effects: {
    *signIn({ payload }, { call, put, select, take }) {
      const num = yield select((state: any) => state)
      const socket = num.charts.ws;
      console.log(socket)
      // socket.on('connect', () => {
      if (socket.connected) {
        socket.emit('name', payload)
        socket.on('someevent', (data: any) => {
          console.log(data)
          // dispatch({
          //     type:'updateWS2',
          //     payload:{
          //         xAxis: {
          //             type: 'category',
          //             data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          //         },
          //         yAxis: {
          //             type: 'value'
          //         },
          //         series: [{
          //             data: [15, 23, 224, 218, 135, 147, 260],
          //             type: 'line'
          //         }]
          //     },
          // })
        })
      }

      // })
    },
    *signOut({ payload }, { call, put, select, take, takeEvery }) {
      // const num = yield select((state: any) => state)
      // console.log(num)
      const res = yield call(bjCharts);
      yield put({
        type: 'updateWS2',
        payload: { data: res }
      })
    },
    *signShu({ payload }, { call, put, select, take }) {
      for (const key in payload) {
        switch (key) {
          case 'cpu':
            yield put({
              type: 'updateWS2',
              payload: { pieOption1: cMdate(payload[key], 'CPU') }
            })

            break;
          case 'memory':
            yield put({
              type: 'updateWS2',
              payload: { pieOption2: cMdate(payload[key], '内存') }
            })

            break;
          default:
            break;
        }
        // const num = yield select((state: any) => state)
        // console.log(num)
      }

    },
    *signPie({ payload }, { call, put, select, take }) {
      // const num2 = yield select((state: any) => state)
      // console.log(num2)
      const { data: { resources: res } } = yield call(pieCharts);
      const { memory, cpu } = res
      yield put({
        type: 'updateWS2',
        payload: { memory: memory.Occupied }
      })
      yield put({
        type: 'updateWS2',
        payload: { cpu: cpu.Occupied }
      })
      yield put({
        type: 'signShu',
        payload: res
      })
      yield take('signShu/@@end')
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname.indexOf('Charts') > 0) {
          console.log('2')
          const ws = io('ws://127.0.0.1:7001', {
            transports: ["websocket"],// 禁用长轮询
            rememberUpgrade: true, // 如果为 true 并且先前与服务器的 WebSocket 连接成功，则连接尝试将绕过正常的升级过程并最初尝试 WebSocket。传输错误后的连接尝试将使用正常的升级过程。建议您仅在使用 SSL/TLS 连接时打开此选项，或者您知道您的网络不会阻止 websockets。
            reconnectionAttempts: 5, // 重连次数
            reconnectionDelay: 2000, // 重连延迟
            reconnectionDelayMax: 5000, // 重连最大延迟，每次尝试都会将重新连接延迟增加 2 倍。
            randomizationFactor: 0.5, // 随机因子           ,
            timeout: 50000 // 连接超时限制
          });
          ws.on('connect', () => {
            // 不应在connect处理程序本身中注册事件处理程序，因为每次 Socket 重新连接时都会注册一个新的处理程序
            // console.log(socket.id)每个新连接都分配有一个随机的 20 个字符的标识符，此标识符与服务器端的值同步 。
            console.log(ws.connected); // true 是否已经连接到服务器
            console.log('ws连接成功');
          }

          );
          ws.emit('hi', '发送的第二次');

          // 改变图标数据
          ws.on('hello', data => {
            dispatch({
              type: 'signShu',
              payload: data.resources,
            });
            dispatch({
              type: 'updateWS',
              payload: { cpu: data.resources.cpu.Occupied },
            });
            dispatch({
              type: 'updateWS',
              payload: { memory: data.resources.memory.Occupied },
            });
          })
          dispatch({
            type: 'updateWS',
            payload: { ws },
          });

          // dispatch({
          //   type: 'signOut'
          // });
        }
      })
    },
  },
}


export default ChartsModel;
