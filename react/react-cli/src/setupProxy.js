// const {
//     createProxyMiddleware
// } = require('http-proxy-middleware');
//此文件是代理文件
const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    // app.use(createProxyMiddleware('/api', {
    //     target: 'http://m.kugou.com?json=true',/*这里写自己的代理地址*/
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //         '^/api': ''
    //     },
    // }));
    app.use(
        proxy(
            '/api1',//加api1触发转发
            {
              target: 'http://localhost:5000',
              changeOrigin: true,       // 控制服务器收到的响应后中host字段的值(请求发出的地址)
              pathRewrite:{'^/api1':''}//把url的/api1改为''(重写请求路径)
            }
        ),
        proxy(
            '/api2',
            {
              target: 'http://localhost:5001',
              changeOrigin: true,
              pathRewrite:{'^/api2':''}
            }
        )
        
        )
};