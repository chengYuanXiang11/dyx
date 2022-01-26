const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server, {
  serveClient: true,
  connectTimeout: 45000, //断开未成功加入命名空间的客户端之前的毫秒数
  pingInterval: 10000,
  pingTimeout: 50000, //心跳机制,定期检查服务器和客户端之间的连接是否仍然有效。
  // 服务器发送ping，如果客户端在pingTimeoutms内没有回复pong ，则服务器认为连接已关闭。
  // 同样，如果客户端在pingInterval + pingTimeoutms内没有收到服务器的 ping ，则客户端也认为连接已关闭。
  cors: {
    origin: ["http://localhost", "http://127.0.0.1:5500"],
    allowedHeaders: ["my-custom-header"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  upgradeTimeout: 30000, //取消未完成的传输升级之前的延迟？
  maxHttpBufferSize: 1e8, //单个消息字节数量
  // allowRequest:( req, callback ) => { console.log(req);   },//req为接收给定握手或升级请求，用于判断是否可以继续
});
app.use("/build", express.static(__dirname + "/public"));
app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors({
//     origin:['http://localhost:3000'],  //指定接收的地址
//     methods:['GET','POST'],  //指定接收的请求类型
//     alloweHeaders:['Content-Type','Authorization']  //指定header
// }))

// const WebSocket = require('ws')
// const wss = new WebSocket.Server({port:8080});
// wss.on('connection',(ws)=>{
//         ws.on('message', function incoming(data) {
//           wss.clients.forEach(function each(client) {
//             console.log(client.readyState)
//             console.log(WebSocket.OPEN)

//             if (client.readyState === WebSocket.OPEN) {
//               client.send(data);
//             }
//           });
//       });
//     ws.send('欢迎进入聊天室')
// })
const group = io.of("/group"); //创建命名空间group

// // 主命名空间
// const mainAdapter = io.of( "/" ).adapter; // 警告！io.adapter() 将不起作用
// // group
// const adminAdapter = io.of( "/admin" ).adapter;

// socket.use//中间件无效?
const uuid = require("uuid"); //生成本次连接唯一id，每个客户端每次连接都不一样
io.engine.generateId = (req) => {
  return uuid.v4();
}; // 在所有 Socket.IO 服务器中必须是唯一的}

//将在写入会话的第一个 HTTP 请求（握手）的响应头之前发出，允许您自定义它们。
io.engine.on("initial_headers", (headers, req) => {
  headers["test"] = "123";
  headers["set-cookie"] = "mycookie=456";
});

//将在写入会话的每个 HTTP 请求的响应头之前发出（包括 WebSocket 升级），允许您自定义它们。
io.engine.on("headers", (headers, req) => {
  headers["test2"] = "789";
});

//   连接异常关闭时会发出，有时在连接前会出现3次错误1
io.engine.on("connection_error", (err) => {
  console.log("err.code");
  console.log(err.code);

  // 请求对象console .log(err.code);
  // 错误代码，例如 1 console . log(err.message);
  // 错误信息，例如“Session ID unknown” console .log(err.context);
  // 一些额外的错误上下文});
  //  0	“运输未知”
  //  1	“会话 ID 未知”
  //  2	“糟糕的握手方式”
  //  3	“错误的请求”
  //  4	“禁止”
  //  5	“不支持的协议版本”
});

// 匹配房间
// 在“room1”房间       in("room1")或to("room1")
// 除了“room2”中的那些    except("room2")
// 并且仅在当前的 Socket.IO 服务器上 local

// 加入房间
// // 使所有 Socket 实例加入“room1”房间
// io.socketsJoin( “room1” );
// //使在“房间1”房间里所有的Socket实例加入“房间2”和“ROOM3”房
// io.in（“房间1”）.socketsJoin（[ “房间2”，“ROOM3” ]）;
// // 使“admin”命名空间的“room1”房间中的所有Socket实例加入“ room2 ”房间
// io.of( “/admin” ). in ( “room1” ).socketsJoin( “ room2 ” );

//离开房间
// // 使所有 Socket 实例离开“room1”房间
// io.socketsLeave( "room1" );
// //使在“房间1”房间里所有的Socket实例离开“房间2”和“ROOM3”房
// io.in（“房间1”）.socketsLeave（[ “房间2”，“ROOM3” ]）;
// // 使“admin”命名空间的“room1”房间中的所有Socket实例离开“ room2 ”房间
// io.of( "/admin" ).in( "room1" ).socketsLeave( " room2 " );

//断开连接
// 使所有 Socket 实例断开连接
// io.disconnectSockets();
// // 使“room1”房间中的所有 Socket 实例断开连接（并丢弃低级连接）
//  io.in( "room1" ).disconnectSockets( true );
// // 使“admin”命名空间的“room1”房间中的所有Socket实例断开
// io.of( “/admin” ). in ( “room1” ).disconnectSockets();
// // 这也适用于单个套接字 ID
//  io.of( "/admin" ).in(theSocketId).disconnectSockets();

//匹配的 Socket 实例：
// // 返回所有 Socket 实例
// const sockets = await io.fetchSockets();
// // 返回主命名空间的“room1”房间中的所有 Socket 实例
// const sockets = await io.in( "room1" ).fetchSockets();
// // 返回 "admin" 命名空间的 "room1" 房间中的所有 Socket 实例
// const sockets = await io.of( "/admin" ).in( "room1" ).fetchSockets();
// // 这也适用于单个套接字 ID
// const sockets = await io.in(theSocketId).fetchSockets();
// sockets是一个对象数组，暴露了通常的 Socket 类的一个子集：
// for ( const socket of sockets) {
//     console.log(socket.id);
//      console.log(socket.handshake);
//     console.log(socket.rooms);
//      console.log(socket.data);
// socket.emit( /* ... */ );
// socket.join( /* ... */ );
//   socket.leave( /* ... */ );
//     socket.disconnect( /* ... */ );
//  }

//可以利用data在不同服务器共享信息
// 服务器 A
//  io.on( "connection" , ( socket ) => {
//     socket.data.username = "alice" ;
//   });

//   // 服务器 B
//   const sockets = await io.fetchSockets();
//   console.log(sockets[ 0 ].data.username); // “爱丽丝”

// serverSideEmit在多服务器设置中向集群的其他 Socket.IO 服务器发出事件。
// // 服务器 A
// io.serverSideEmit( "ping" , ( err, response ) => { console .log(responses[ 0 ]); // 打印 "pong" });
// // 服务器 B
//  io.on( "ping" , ( cb ) => {
//   cb( "pong" );
// });

// 分发事件 (客户端分发事件,服务端接收，反之亦然)
// 可以发送任意数量的参数，并且支持所有可序列化的数据结构，
// 包括二进制对象，如Buffer或TypedArray。
// 发送对象时也不需要进行序列化，内部会进行转换
// Map和Set不可序列化，必须手动序列化：
// const serializedMap = [...myMap.entries()];
// const serializedSet = [...mySet.keys()];

// socket.name("hello", "world"); //此时注册了事件hello
// socket.on("hello", (arg) => {//调用事件hello
//     console.log(arg);
//   });

group.on("connection", (socket) => {
  // console.log("socket.rooms"); // Set { <socket.id> }

  socket.join("someroom");
  socket.on("name", (data) => {
    console.log(socket.rooms);
    socket.emit("firstjoin2", `欢迎进入聊天群`); //给自己
    socket.to("someroom").emit("firstjoin1", `欢迎${data}进入聊天群`); //给其他人
  });
  socket.on("str", (data) => {
    socket.emit("strMy", `你发的${data.str}`); //给自己
    socket.to("someroom").emit("strThis", `${data.name}发的${data.str}`); //给其他人
  });
  socket.to("someroom").emit("someevent", { fang: { a: 2424 } });
  // socket.adapter.on("create-room", (room, id) => {//创建房间
  //     console.log("create-room")
  //   });
  //   socket.adapter.on("join-room", (room, id) => {//进入房间

  //   });  socket.adapter.on("delete-room", (room, id) => {//删除房间
  //     console.log("delete-room")
  //   });  socket.adapter.on("leave-room", (room, id) => {//退出房间
  //     console.log("leave-room")
  //   });

  //     console.log('成功连接到1')
  //     console.log(group.sockets.size)//获取该命名空间连接的客户端数量
  //     console.log(io.engine.clientsCount)//获取io所有客户端连接数
  //   console.log(io.engine.generateId())

  //   console.log(socket.rooms); // Set { <socket.id> }
  //   socket.join("room1");
  //   console.log(socket.rooms); // Set { <socket.id>, "room1" }

  // 添加一次性监听
  // socket.once('hi',()=>{})

  // 删除hi监听的事件
  // socket.off('hi',listenet)

  // 删除所有侦听器，或指定eventName 的侦听器。
  // 对于特定事件
  // socket.removeAllListeners( "details" );
  // 对于所有事件
  // socket.removeAllListeners();

  // socket.onAny（监听器）
  // 添加将在发出任何事件时触发的侦听器。
  // socket.onAny( ( eventName, ...args ) => { // ... });

  //   socket.prependAny（监听器）
  // 添加将在发出任何事件时触发的侦听器。侦听器被添加到侦听器数组的开头。

  // socket.prependAny( ( eventName, ...args ) => { // ... });

  // socket.offAny([listener])
  // 删除所有捕获所有侦听器或给定的侦听器。

  // const listener = (eventName, ...args) => {
  //   console.log(eventName, args);
  // }

  // socket.onAny(listener);

  // socket.offAny(listener);

  // // or all listeners
  // socket.offAny();

  // // 广播事件（仅仅适用于服务端）
  // io.emit( "hello" , "world" );

  // // 除了发件人之外的所有连接的客户端
  // socket.broadcast.emit( "hello" , "world" );

  // 只想向连接到当前服务器的客户端广播
  // io.local.emit( "hello" , "world" );

  //可以传递多个参数
  // socket.emit('news', { hello: 'word' })
  socket.on("hi", (data) => {
    console.log(data);
  });

  //断开回调
  socket.on("disconnect", (res, err) => {
    console.log(res);
    // res=>
    // erver namespace disconnect      被socket.disconnect()强行断开
    // client namespace disconnect	    客户端使用socket.disconnect()手动断开了套接字
    // server shutting down	        服务器正在关闭
    // ping timeout	                客户端没有在pingTimeout延迟中发送 PONG 数据包
    // transport close	                连接已关闭（例如：用户已失去连接，或网络已从 WiFi 更改为 4G）
    // transport error	                连接遇到错误
  });
  //断开之前的回调
  // socket.on("disconnecting", (reason) => {
  //     console.log("reason")

  //     console.log(reason)
  //     for (const room of socket.rooms) {
  //         if (room !== socket.id) {
  //             // socket.to(room).emit("user has left", socket.id);
  //         }
  //     }
  // });
  // console.log('断开连接')
  // group.in(io.engine.generateId()).disconnectSockets();?未成功断开
  // socket.clients((error, clients) => {
  //     if (error) throw error; console.log(clients);}) //
});
// io.of('/chat').on('connection',(socket)=>{
//     console.log('连接成功'+index)
//     index++;
//     socket.emit('news',{hello:'word'})
//     socket.on('my other event',(data)=>{
//         console.log(data)
//     })
// })

// const group2 = io.of('/group2')
// group2.on('connection', (socket) => {
//     console.log('成功连接到2')
//     console.log(group2.sockets.size)
// console.log(io.engine.clientsCount)

//     socket.emit('news', { hello: 'word' })
//     socket.on('my other event', (data) => {
//         console.log(data)
//     })
//     //段开回调
//     socket.on('disconnect',(res,err)=>{
//         console.log(res)
//     })
//     // socket.clients((error, clients) => {
//     //     if (error) throw error; console.log(clients);}) //
// })

// app.listen(5000,(err=>{
//     if(!err){console.log('服务器启动成功,地址为http://localhost:5000/getjson')}else{
//     console.log('服务器启动失败')}
server.listen(8081);
// }))
// // 基本发射
// socket.emit( /* ... */ );

// // 发送到当前命名空间中除发送者之外的所有客户端
// socket.broadcast.emit( /* ... */ );

// // 除了发送方socket.to
//  ( "room1" ).emit( /* ... */ );

// // 除了发送方socket.to
//  ([ "room1" , " room2 " ]).emit( /* ... */ );

// // 发送到 room1 中的所有客户端
// io.in( "room1" ).emit( /* ... */ );

// // 除了room3
//  io.to([ "room1" , " room2 " ]).except( "room3" ).emit( /* ... */ );

// // 到命名空间 "myNamespace" 中的所有客户端
// io.of( "myNamespace" ).emit( /* ... */ );

// // 到命名空间 "myNamespace" 中 room1 中的所有客户端
// io.of( "myNamespace" ) .to ( "room1" ).emit( /* ... */ );

// // 到单独的 socketid（私人消息）
//  io.to(socketId).emit( /* ... */ );

// // 此节点上的所有客户端（使用多个节点时）
//  io.local.emit( /* ... */ );

// // 所有连接的客户端
// io.emit( /* ... */ );

// // 警告：`socket.to(socket.id).emit()` 将不起作用，因为它会发送给房间中的每个人// 名为 `socket.id` 但发送者。请改用经典的`socket.emit()`。

// // 带有确认
// socket.emit( "question" , ( answer ) => { // ...   });

// // 无压缩
// socket.compress( false ).emit( /* ... */ );

// // 如果低级传输不可写，则可能会丢弃一条消息
// socket.volatile.emit( /* ... */ );
