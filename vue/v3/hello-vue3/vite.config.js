import { defineConfig, DEFAULT_ASSETS_RE, DEFAULT_EXTENSIONS } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'

import proxys from './config/proxy'

var path = require('path')
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // if( command === 'serve'){
  //   return{
  //     plugins: [
  //       vue(),
  //       legacy({
  //         targets:['defaults','not IE 11']
  //       }),
  //     ]
  //   }
  // }else{
  // const baseUrl = mode === 'development'?'/':path.resolve(__dirname,'dist')

  console.log(command, mode, __filename)
  return {
    // root:'' //index.html文件所在的位置
    // base:`/${baseUrl}/`,//公共基础路径
    base: './',
    mode, //工作模式
    // define: // 全局常量替换
    // publicDir:'./',//静态资源文件夹
    // cacheDir://存储缓存的文件目录
    resolve: {
      alias: {
        "/com/": path.resolve(__dirname, 'src/components')
      }
    },
    css: {
      // modules: //css modules行为
      postcss: {//postcss
        plugins: [require("autoprefixer")({
          "overrideBrowserslist": [
            "last 2 versions",
            "> 5%",
            "ie >= 6",  //ie6以上
            "firefox >= 8",
            "chrome >= 24",
            "Opera>=10"
          ]
        })
        ]
      },
      // 全局less变量
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${path.resolve(__dirname, 'src/assets/styles/base.less')}";`
        }
      }
    },
    json: {
      namedExports: true, //是否支持从 .json 文件中进行按名导入。
      stringify: true //若设置为 true，导入的 JSON 会被转换为 export default JSON.parse("...")，这样会比转译成对象字面量性能更好，尤其是当 JSON 文件较大的时候。 开启此项，则会禁用按名导入。
    },
    //   esbuild: {// 底层?
    //   jsxFactory: 'h',
    //   jsxFragment: 'Fragment',
    //   jsxInject: `import React from 'react'`
    // },
    // assetsInclude:DEFAULT_EXTENSIONS , //???什么作用
    logLevel: 'warn', //调整控制台输出的级别，默认为 'info'。info' | 'warn' | 'error' | 'silent'
    clearScreen: false,//设为 false 可以避免 Vite 清屏而错过在终端中打印某些关键信息。命令行模式下可以通过 --clearScreen false 设置。
    envDir: path.resolve(__dirname, 'envDir'), //用于加载 .env 文件的目录。可以是一个绝对路径，也可以是相对于项目根的路径。
    server: {
      host: '127.0.0.1',//应该监听哪个 IP 地址
      port: '4000',      //应该监听哪个 端口
      strictPort: false,//端口被占用时，是否自动尝试下一个可用的端口
      // open:'/',//在开发服务器启动时自动在浏览器中打开应用程序。
      proxy: proxys,
      //   cors:({
      //     origin:['http://localhst:8'],  //指定接收的地址
      //     methods:['GET','POST'],  //指定接收的请求类型
      //     alloweHeaders:['Content-Type','Authorization']  //指定header
      // })
      force: true,//  强制使依赖预构建
      hmr: false, //禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）
    },
    build: {
      target: 'es2015',//兼容性设置，最低支持es2015
      // outDir:'./outDist',// 输出路径(dist)
      // assetsDir:'ass', //静态资源路径(assets)
      // cssCodeSplit:false,//??? css变成js无效了 ,禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
      // assetsInlineLimit:40960, //(40k)) 小于该资源大小的转换为base64(在css渲染阶段就可以直接拿到，不需要额外请求)
      // assetsDir:'./dist',
      // sourcemap:true,//是否生成map文件，默认false
      // brotliSize:false,//是否压缩，禁止会提高自构建性能
    },
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11']
      }),
    ]
  }
  // }

})
