// cpu数据处理
import type { ECOption } from '@/models/charts'

type cpuDate = {
  Occupied: Record<string,unknown>,
  idle: Record<string,unknown>,
  total: Record<string,unknown>,

}
const cMdate = (data: cpuDate, name: string): ECOption => {
  const arr: Array<object>= []
  for (let key in data) {
    switch (key) {
      case 'Occupied':
        arr.push({ name: `${name}已占用`, value: data[key] })
        break;
      case 'idle':
        arr.push({ name: `${name}剩余`, value: data[key] })

        break;
      case 'total':
        arr.push({ name: `${name}总额`, value: data[key] })
        break;
    }
  }
  // console.log(arr.sort(function (a, b) { return a.value - b.value; }))
  return {
    title: {
      text: 'Customized Pie',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#ccc'
      }
    },

    tooltip: {
      trigger: 'item'
    },

    visualMap: {
      show: false,
      min: 1,
      max: 100,
      inRange: {
      }
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: arr,
        roseType: 'radius',
        stillShowZeroSum: true,
        label: {
          formatter: '{a}_{b}:{d}%',
          rotate: 15,
          color: 'rgba(255, 255, 255, 0.3)'
        },
        selectedMode: 'multiple',
        selectedOffset: 30,
        clockwise: true,
        startAngle: 90,
        minShowLabelAngle: 30,
        tooltip: {
          formatter: '{b}:{c}'
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        avoidLabelOverlap: true,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function (idx) {
          return Math.random() * 200;
        }
      },
    ]
  };
}
export { cMdate }
