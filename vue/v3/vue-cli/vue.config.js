const TITLE = process.env.VUE_APP_TITLE;
module.exports = {
  // 文件路径
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/v3-vue-cli-dev",
  // 打包文件目录
  outputDir: process.env.NODE_ENV === "production" ? "pro" : "dev",

  // 静态文件目录
  assetsDir: process.env.NODE_ENV === "production" ? "proState" : "devState",
  // 生产构建时禁用 eslint-loader
  lintOnSave: false,
  // 仅用map日志
  productionSourceMap: false,
  //  文件跨域
  crossorigin: "use-credentials",
  // 资源完整性校验
  // integrity: true,
  devServer: {
    compress: true,
    host: "0.0.0.0",
    //   client:{
    //     // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖。
    //     overlay:true,
    //     progress: true,
    //     reconnect: 5,
    //   },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
      "/foo": {
        target: "http://localhost:3000",
      },
    },
  },
  pwa: {
      name:'PWA测试',
      // workboxPluginMode: 'GenerateSW',
      workboxPluginMode: 'InjectManifest',
      workboxOptions: {
        // InjectManifest 模式下 swSrc 是必填的。
        swSrc: './public/sw.js',
        // ...其它 Workbox 选项...
      }
  },
  //   configureWebpack: (config) => {
  //     if (process.env.NODE_ENV === "production") {
  //       // 为生产环境修改配置...
  //     } else {
  //       // 为开发环境修改配置...
  //     }
  //   },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = TITLE;
      return args;
    });
    // 调整内联文件的大小限制
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 10240 }));
  },
  // 向 CSS 相关的 loader 传递选项
  // css: {
  //     loaderOptions: {
  //       css: {
  //         // 这里的选项会传递给 css-loader
  //       },
  //       postcss: {
  //         // 这里的选项会传递给 postcss-loader
  //       }
  //     }
  //   }
};
