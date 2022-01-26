//后端接口
const express = require('express')
//定义express实例
const path =require('path')
const app = express()
// const assert = require('http-assert')
// const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')


// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// const MongoStore = require('connect-mongo')(session);

// const SECRET = 'tokqianmingjiaoyan'


// app.use(session({
// 	name: 'session-name', // 这里是cookie的name，默认是connect.sid
// 	secret: 'my_session_secret', // 建议使用 128 个字符的随机字符串
// 	resave: false,
//   saveUninitialized: false,
// //   store: new MongoStore({   
// //     //创建新的mongodb数据库存储session
// //     host: 'localhost',    //数据库的地址，本机的话就是127.0.0.1，也可以是网络主机
// //     port: 3001,          //数据库的端口号
// //     db: 'houtai'        //数据库的名称。
// // }),
// 	cookie: { maxAge: 60000 * 1000, httpOnly: true },

// }));


// app.use()
//全局设置响应头
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8080'); //先允许跨域请求才能进来
  res.header("Access-Control-Allow-Credentials", "true");//处理cookie信息，如果有，并且不对每次请求都新开一个session
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.header('Access-Control-Allow-Headers', 'x-requested-with,content-type');
  next();
});




// app.use('/api/data', function (req, res, next) {
//   var shop_url = "http://127.0.0.1/api/data/";
//   request(shop_url, function (err, resonse, body) {
//       res.locals.info = body;   //异步赋值失败
//   })
//   console.log(res.locals.info); // undefined
//   next();
// });


app.use(require('cors')())
app.use(express.json())
//图片等静态文件需要静态托管 
// app.use('/admin',express.static(__dirname +'/public'))
// app.use('/uploads',express.static(__dirname +'/uploads'))
// require('./plugins/db/db')(app)//连接数据库

app.use(express.static(path.join(__dirname+'/../build')));
app.use('/2',express.static(path.join(__dirname+'/../build')));

// app.use(express.static(__dirname+'./build'));

// const auth = async(req,res,next)=>{
//   //前端传入    接收token
// var router = express.Router();
// 当访问/时 路径指向index.html
// router.get('/', function (req, res, next) {
//   req.url = '/index.html';
//   next();
// });
// app.use(router);
// const raw = String(req.headers.authorization || '').split(' ').pop()
//   try {
//     const tokenDate = jwt.verify(raw,SECRET)
//     // assert(tokenDate,401,'无效的jwt token')
   
// req.user = await Login.findById(tokenDate._id)
// // assert(req.user,401,'先登录')
//     // 找到用户相关信息，并返回
//     // 继续执行接口
//     next()
// }
// catch(err) {
//     res.status(401).send({message:'token不存在 请提供jwt token'})
// }

// }



// const router = require('./routes/adminhou/category')  //  引入路由
// const login = require('./routes/adminhou/longin/login')  //  引入路由
// const lo = require('./routes/adminhou/in')
// const notice = require('./routes/adminhou/notice')
// const comments= require('./routes/adminhou/comment')
// const Reply= require('./routes/adminhou/reply')
// //  使用路由 /index 是路由指向名称
// app.use(`/api/data`,router)
// app.use(`/api/denglu`,login)
// app.use(`/api/section`,notice)
// app.use(`/api/comment`,comments)
// app.use(`/api/reply`,Reply)


// const multer = require('multer')
// const upload = multer({ dest:__dirname +'/uploads'})

// //上传图片
// app.post('/api/upload',upload.single('file'),async(req,res)=>{
  
//     const file =req.file
//     file.url = `http://localhost:3001/uploads/${file.filename}`
    
//     res.send(file)
// })


// app.post('/api/uploads/:image',upload.single('file'),async(req,res)=>{
//   const file =req.file
//       file.url = `http://localhost:3001/uploads/${file.filename}`
//         res.send(file)
  
// })








// app.use(`/api/in`,lo)

//错误处理函数
app.use(async(err,req,res,next)=>{
  res.status(err.statusCode||500).send({
    message:err.message
  })
})




app.listen(3002,()=>{
    console.log('http://localhost:3001/')
})
