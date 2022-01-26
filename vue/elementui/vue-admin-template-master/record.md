# normalize.css

#安装 normalize.css
npm install --save normalize.css

#main.js 引入
import 'normalize.css/normalize.css'

#如果引入报错，可能没有安装 css-loader 和 style-loader
npm install css-loader style-loader


vue动态路由
    * 404匹配需要最后传入,不然把所有都是404
    更新路由表之后,需要next(to) 代表终端当前路由,执行新的路由
