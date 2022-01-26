// import { createApp , createRenderer, h } from 'vue'
import { createApp,h } from 'vue'

import App from './App.vue'
// import CanvasApp from './components/CoreKnowledge/Canvsapp/CanvsApp.vue'
import router from './router/index'
import store,{ key } from './store'
const Vue = createApp(App)

//注册全局api
Vue.component('comp',{
  render(){
    return h('div','I an copm')
  }//全局自定义指令
})
Vue.directive('gloablHig',{
  beforeMount(el: { style: { background: any } },binding: { value: any }){
    el.style.background = binding.value
  }
})
// 全局,对应于2x vue.protptype.$http
Vue.config.globalProperties.$http =()=>{}
// vue-router
Vue.use(router)
Vue.use(store, key)
//挂载
Vue.mount('#app')
//卸载
// Vue.unmount()

// createApp(App) 的、相当于vm，但是app比vm更加"轻"
// Vue.config.devtools = true;

// 自定义渲染器
// const nodeOps = {
//   insert: (child, parent, ) => {
//     child.parent = parent;
//     if (!parent.childs) { // 格式化父子关系
//       parent.childs = [child]
//     } else {
//       parent.childs.push(child);
//     }
//     if (parent.nodeType == 1) {
//       draw(child); // 开始绘图
//       if (child.onClick) {
//         ctx.canvas.addEventListener('click', () => {
//           child.onClick();
//           setTimeout(() => {
//             draw(child)
//           }, 0);
//         }, false)
//       }
//     }
//   },
//   createElement: (tag) => {
//     return { tag }
//   },
//   patchProp(el, key, _prevValue, nextValue) {
//     el[key] = nextValue;
//   },
// };

// const draw = (el, noClear) => {
//   if (!noClear) {
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//   }
//   if (el.tag == 'piechart') {
//     const { data, r, x, y } = el;
//     const total = data.reduce((memo, current) => memo + current.count, 0);
//     let start = 0,
//       end = 0;
//     data.forEach(item => {
//       end += item.count / total * 360;
//       drawPieChart(start, end, item.color, x, y, r);
//       drawPieChartText(item.name, (start + end) / 2, x, y, r);
//       start = end;
//     });
//   }
//   el.childs && el.childs.forEach(child => draw(child, true));
// }

// const d2a = (n) => {
//   return n * Math.PI / 180;
// }
// const drawPieChart = (start, end, color, cx, cy, r) => {
//   const x = cx + Math.cos(d2a(start)) * r;
//   const y = cy + Math.sin(d2a(start)) * r;
//   ctx.beginPath();
//   ctx.moveTo(cx, cy);
//   ctx.lineTo(x, y);
//   ctx.arc(cx, cy, r, d2a(start), d2a(end), false);
//   ctx.fillStyle = color;
//   ctx.fill();
//   ctx.stroke();
//   ctx.closePath();
// }
// const drawPieChartText = (val, position, cx, cy, r) => {
//   ctx.beginPath();
//   const x = cx + Math.cos(d2a(position)) * r / 1.25 - 20;
//   const y = cy + Math.sin(d2a(position)) * r / 1.25;
//   ctx.fillStyle = '#000';
//   ctx.font = '20px 微软雅黑';
//   ctx.fillText(val, x, y);
//   ctx.closePath();
// }

// const renderer = createRenderer(nodeOps);
// let ctx;
// let canvas;
// // 扩展mount，首先创建一个画布元素
// function createCanvasApp(App) {
//   const app = renderer.createApp(App);

//   const mount = app.mount
//   app.mount = function(selector) {
//     canvas = document.createElement('canvas');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     document.querySelector(selector).appendChild(canvas);
//     ctx = canvas.getContext('2d');
//     mount(canvas);
//   }
//   return app
// }

// createCanvasApp(CanvasApp).mount('#demo')