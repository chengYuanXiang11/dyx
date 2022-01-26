import React, { useState, useRef, useEffect,useLayoutEffect } from 'react';
// import { EllipsisOutlined } from '@ant-design/icons';
import { Statistic, Button, message,Space  } from 'antd';
import { connect } from 'umi';
import type { ConnectState } from '@/models/content'
import { PageContainer } from '@ant-design/pro-layout';
import { RightOutlined, EllipsisOutlined } from '@ant-design/icons';
import ProCard,{StatisticCard} from '@ant-design/pro-card';
import * as echarts from 'echarts/core';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  ScatterChart,
  CustomChart,
  EffectScatterChart,
  LineChart,
  LinesChart,
  MapChart,
  PieChart,
  LineSeriesOption
} from 'echarts/charts'
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  GridComponent,
  GridComponentOption,
  VisualMapComponent
} from 'echarts/components';
// import type {GeoJSONSourceInput} from 'echarts/types/dist/shared'
import {
  CanvasRenderer
} from 'echarts/renderers';
import chartClass from './chart.less'
import beijingJson from './beijing.json'
import {
   Decoration9,
   BorderBox6,
   BorderBox8,
  Decoration6, Decoration7, Decoration8, BorderBox9, Decoration5, FullScreenContainer
} from '@jiaminghi/data-view-react'
import FullScrenn from '../../utils/fullScreen';
import CountUp from 'react-countup';
// import { transform } from 'lodash';
import '@/utils/rem'

// import 'mars3d/dist/mars3d.css'
// import * as mars3d from 'mars3d'
//  import configUrl from './map.json'

window.CESIUM_BASE_URL = '/';

import * as Cesium from 'cesium';
import "../../../node_modules/cesium/Build/Cesium/Widgets/widgets.css";


Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDViNDI3YS0wZmI4LTQ5MWMtYWM1MC01YmNlZjc0ZmFhOTYiLCJpZCI6NjQ4NDYsInNjb3BlcyI6WyJsZ24iLCJwciIsImFjdyIsImFzbCIsImFzciIsImFzdyIsImFzcyIsImdjIiwibHIiLCJsdyIsInRyIiwidHciLCJ1c2ciXSwiaWF0IjoxNjI5NjUxMzMzLCJleHAiOjE2MzAyNTYxMzN9.WPeFEsnJlYBMwJPqiZ0c6PAO6YGAkz5onI-alYZbUFo';
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = echarts.ComposeOption<
  BarSeriesOption | LineSeriesOption | TitleComponentOption | GridComponentOption
>;


// 注册必须的组件
echarts.use(
  [TitleComponent, VisualMapComponent, PieChart, TooltipComponent, MapChart, GridComponent, CustomChart, LinesChart, LineChart, ScatterChart, BarChart, CanvasRenderer, EffectScatterChart]
);
const Charts = ({ dispatch, charts }) => {


const { Statistic } = StatisticCard;
const chartsRef2 = useRef(null)
const [  mapOptions,setMapOptions] = useState({})

  // const { Countdown } = Statistic;
  // const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30; // Moment is also OK
  // const myChart = echarts.init(charts.current);
  const [opation, setOpation] = useState(charts.option);
  const [loadingOk, setLoadingOk] = useState(true)
  const [isScreenFull, setIsScreenFull] = useState(false); //是否全屏
  const [f11State, setf11State] = useState('fixed');
  const [time, setTime] = useState(new Date().toLocaleString());
  const [num, setNum] = useState(1023);
  // 屏幕变化
  const screenChange = (isFull: any) => {
    // console.log('是否全屏', isFull);
    setIsScreenFull(isFull);
  };
  // myChart.setOption(option);
  const info = () => {
    message.info('为保证大屏正常显示,点击标题-->大屏监控页面<--即可进入退出全屏模式');
  };
  const gotoIcon = () => {
    if (isScreenFull) {
      //退出全屏
      FullScrenn.exitFullScreen();
      setf11State('absolute')
    } else {
      //进入全屏
      FullScrenn.enterFullScreen();
      setf11State('fixed')

    }
  };
  useEffect(() => {
    info()
console.log(chartsRef2.current)

    FullScrenn.init(screenChange)
    dispatch({
      type: 'charts/signPie'
    })

  // const initMars3d=(mapOptions)=>{
  //   // 创建三维地球场景
  //   const map = new mars3d.Map(chartsRef2, mapOptions)
  //   console.log('>>>>> 地图创建成功 >>>>', map)

  //   // this.onMapload(map)
  // }
  // mars3d.Resource.fetchJson({ url: configUrl }).then((data) => {
  // initMars3d(data.map3d)// 构建地图
  // })

  }, [])
  useEffect(() => {

    const timer = setTimeout(() => {
      setNum(num => num + 1)
      setTime(new Date().toLocaleString())
      setLoadingOk(false)
    }, 1000);
    return () => {
      clearInterval(timer)
    }
  }, [num])
  echarts.registerMap('beijing', beijingJson as unknown as 'string');
  // const myChart = echarts.init(chartsRef.current!, 'dark');
  useLayoutEffect(()=>{

if(chartsRef2.current !== null){
    const viewer = new Cesium.Viewer(chartsRef2.current!, {
      terrainProvider: Cesium.createWorldTerrain(),
    });

    viewer.scene.primitives.add(Cesium.createOsmBuildings());

    viewer.scene.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-74.019, 40.6912, 750),
      orientation: {
        heading: Cesium.Math.toRadians(20),
        pitch: Cesium.Math.toRadians(-20),
      },
    });

}
  },[chartsRef2.current])
  let option = {
    backgroundColor: '',
    series: [
      {
        name: '济南地图',
        type: 'map',
        mapType: 'beijing',//#3
        itemStyle: {
          normal: {
            label: { show: true },
            areaStyle: {
              color: '#CCFFFF',
            },
          },
          emphasis: {
            label: { show: true },
            areaStyle: {
              color: '#CCFFFF',
            },
          },
        },
        data: [{ name: '历下区', value: 100, selected: true }],//地图数据。name对应geo.json中的name,
        nameMap: { '历下区': '历下区' }//更改地图中的name 名称
      }
    ]
  }
  // useEffect(() => {

  //     // myChart.setOption(option);
  //   // console.log(chartsRef.current!)
  //   // myChart.on('finished', function () {
  //     // myChart.resize();
  //   // });
  //   //   window.onresize = function () {
  //   //     myChart.resize();
  //   //   }
  // }, [opation]);


  // console.log('重新渲染')
  return (
    <FullScreenContainer style={{ position: `${f11State}`, width: '1920px', height: '1080px ' }}>
      <div
        className={chartClass.bg}
      >
        <BorderBox6 style={{ width: '100%', height: '100%' }}>
        <BorderBox8>
          <div
            style={{
              color: '#fff',
              margin: '0px',

            }}
            className={chartClass.bgcol}
          // header={{
          //   title: (
          //     <div className={chartClass.titleH3}>
          //       <div className={chartClass.title} onClick={() => gotoIcon()}>
          //         <Decoration7 style={{ width: '180px', height: '2rem', fontSize: '1rem' }}>大屏监控页面</Decoration7>
          //       </div>
          //       <div className={chartClass.pagecont_header}>
          //         <Decoration8 className={chartClass.decora1} />
          //         <Decoration5 className={chartClass.decora2} />
          //         <Decoration6 className={chartClass.decora6} />
          //         <Decoration8 reverse={true} className={chartClass.decora3} />
          //       </div>
          //     </div>
          //   ),
          //   ghost: true,
          //   breadcrumb: {},
          // }}
          // footer={[
          //   false
          // ]}
          >
            <div className={chartClass.proCardContent}>
              <div className={chartClass.headerBar}>
                <div className={chartClass.head_attachment}>
                  <div className={chartClass.data}>{time}</div>
                  <div className={chartClass.title} onClick={() => gotoIcon()}>
                    <Decoration7>大屏监控页面</Decoration7>
                    <Decoration6 className={chartClass.decora6} />
                  </div>
                  <div className={chartClass.headerRight}>
                    <CountUp
                      start={0}
                      end={num}
                      duration={0.75}
                      useEasing={true}
                    />
                  </div>

                </div>
                <div className={chartClass.titleH3}>

                  <div className={chartClass.pagecont_header}>
                    <Decoration8 className={chartClass.decora1} />
                    <Decoration5 className={chartClass.decora2} />
                    <Decoration8 reverse={true} className={chartClass.decora3} />
                  </div>
                </div>

              </div>

              <div className={chartClass.warper} >
                <ProCard  ghost style={{ height: '100%'}}>
                  {/* --1-- */}
                  <ProCard ghost colSpan={5} className={chartClass.card1} direction='column'>

                    <ProCard ghost loading={loadingOk} layout="center" >
                      <BorderBox9>
                        <ReactEChartsCore
                          style={{
                            width: '100%',
                            height:'20vh'
                          }}
                          echarts={echarts}
                          option={charts.pieOption1}
                          notMerge={true}
                        // lazyUpdate={true} //在设置完 option 后是否不立即更新图表,会在下一个 animation frame 中，才更新图表。
                        // theme={"dark"}
                        />
                      </BorderBox9>

                    </ProCard>
                  <ProCard ghost  layout="center" loading={loadingOk} style={{marginTop:'5vh'}}  >
                    <BorderBox9>
                      <ReactEChartsCore
                        echarts={echarts}
                        option={opation}
                        style={{
                          width: '100%',
                          height:'40vh'
                        }}
                      />
                    </BorderBox9>
                  </ProCard>
                  <StatisticCard
      title={
        <Space>
          <span>部门一</span>
          <RightOutlined style={{ color: 'rgba(0,0,0,0.65)' }} />
        </Space>
      }
      extra={<EllipsisOutlined />}
      statistic={{
        value: 1102893,
        prefix: '¥',
        description: (
          <Space>
            <Statistic title="实际完成度" value="82.3%" />
            <Statistic title="当前目标" value="¥6000" />
          </Space>
        ),
      }}
      chart={
        <>
          <img
            src="https://gw.alipayobjects.com/zos/alicdn/BA_R9SIAV/charts.svg"
            alt="chart"
            width="100%"
          />
        </>
      }
      style={{ width: 268 }}
    />
                  </ProCard>
                 {/* --2-- */}
                  <ProCard ghost colSpan={14} loading={loadingOk}
                  id="cesiumContainer"
                    style={{
                      width: '100%',
                      height: '100vh'
                    }}
                    layout="center" >
                      <BorderBox9>
                      {/* <ReactEChartsCore
                        style={{
                          width: '100%',
                          height: '60vh'
                        }}
                        echarts={echarts}
                        option={option}
                        theme={"dark"}
                      /> */}
                      <div  className="cesiumContainer" ref={chartsRef2}></div>
                      </BorderBox9>
                  </ProCard>
                {/* --3-- */}
                <ProCard  ghost colSpan={5} direction='column'>
                    <ProCard ghost  loading={loadingOk} layout="center"  >
                      <BorderBox9>

                        <ReactEChartsCore
                          style={{
                            width: '100%',
                            height:'20vh'
                          }}
                          echarts={echarts}
                          option={charts.pieOption2}
                          // showLoading={true}
                          notMerge={false}
                          lazyUpdate={true}
                        // theme={"dark"}
                        // onChartReady={this.onChartReadyCallback}
                        // onEvents={EventsDict}
                        // opts={}
                        />
                      </BorderBox9>
                    </ProCard>
                    <ProCard ghost  layout="center" loading={loadingOk}  style={{marginTop:'5vh'}}>
                    <BorderBox9>
                          <div className={chartClass.memory}>
                            <div>
                          内存使用

                            </div>

                      <Decoration9 style={{ width: '150px', height: '150px' }}>{charts.memory}%</Decoration9>
                          </div>
                          <div className={chartClass.memory}>
                            <div>
                            cpu占用

                            </div>
                            <Decoration9 style={{ width: '150px', height: '150px' }}>{charts.cpu}%</Decoration9>
                          </div>


                    </BorderBox9>
                  </ProCard>

                </ProCard>

                </ProCard>


              </div>

            </div>

          </div>
        </BorderBox8>
        </BorderBox6>

      </div>
    </FullScreenContainer>

  )
}

export default connect(({ login, charts }: ConnectState) => ({
  login, charts
}))(Charts);
