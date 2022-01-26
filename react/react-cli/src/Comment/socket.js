import { io } from 'socket.io-client'
const socket = io(`ws://localhost:8081/group`, {
    transports: ["websocket"],//禁用长轮询
    rememberUpgrade: true, //如果为 true 并且先前与服务器的 WebSocket 连接成功，则连接尝试将绕过正常的升级过程并最初尝试 WebSocket。传输错误后的连接尝试将使用正常的升级过程。建议您仅在使用 SSL/TLS 连接时打开此选项，或者您知道您的网络不会阻止 websockets。
    reconnectionAttempts: 5, //重连次数
    reconnectionDelay: 2000, //重连延迟
    reconnectionDelayMax: 5000, //重连最大延迟，每次尝试都会将重新连接延迟增加 2 倍。
    randomizationFactor: 0.5, //随机因子           ,
    timeout: 50000 //连接超时限制
});
// socket 模块化
export function apd(a){
        socket.on('connect', () => {
            if (socket.connected) {
                socket.emit('name',a)
                socket.on('someevent', (data) => {
                    console.log(data)
                })
            }
        
        })
}
export function str(name,str){
    socket.emit('str',{"name":name,"str":str})
}
socket.on('strMy', data => {
    console.log(data)
})
socket.on('strThis', data => {
    console.log(data)
})

socket.on('firstjoin1', data => {
    console.log(data)
})
socket.on('firstjoin2', data => {
    console.log(data)
})
export {socket}