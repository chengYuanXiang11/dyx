const reqRouter = require.context("./", true, /\.(js||vue)$/);
// reqRouter.keys()
// 主动注册组件
// reqRouter.keys().forEach((v) => {
//     let nodeName = v.replace(
//       /^\.\/((.*)\/.*||(.*))\.(js||vue)$/gi,
//       (a, b, c, d) => {
//           return c ? c : b;
//       }
//     );
//     Array.push({
//         nodeName:reqRouter(v).default || reqRouter(element)
//     })
//     app.component(nodeName, reqRouter(v).default || reqRouter(element));
//     app.config.globalProperties[`\$${nodeName.toLocaleLowerCase()}`]=nodeName
//   });
export default {
  install(app) {
    reqRouter.keys().forEach((v) => {
      let nodeName = v.replace(
        /^\.\/((.*)\/.*||(.*))\.(js||vue)$/gi,
        (a, b, c, d) => {
            return c ? c : b;
        }
      );
      console.log(`\$${nodeName.toLocaleLowerCase()}`)
      app.component(nodeName, reqRouter(v).default || reqRouter(element));
      app.config.globalProperties[`\$${nodeName.toLocaleLowerCase()}`]= reqRouter(v).default || reqRouter(element)
    });

  },
};

