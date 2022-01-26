# 收获

    1.父对子传值可直接 {...this.state}  子{a,b,c}=this.props
    2.uuid nanoid唯一id包nanoid()
    3.对props类型限制 yarn add prop-types
    4.window.confirm('确定删除吗')
    5.axios取消请求
        {
            ## axios取消示例
                let CancelToken = axios.CancelToken
                    let self = this
                    axios.get('http://jsonplaceholder.typicode.com/comments', {
                    cancelToken: new CancelToken(function executor(c) {
                        self.cancel = c
                        console.log(c)
                        // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
                    })
                    }).then(res => {
                    this.items = res.data
                    }).catch(err => {
                    console.log(err)
                    })
                    //手速够快就不用写这个定时器了，点击取消获取就可以看到效果了
                    setTimeout(function () {
                    //只要我们去调用了这个cancel()方法，没有完成请求的接口便会停止请求
                    self.cancel()
                    }, 100)
                },
                //cancelGetMsg 方法跟上面的setTimeout函数是一样的效果，因为手速不够快，哦不，是因为网速太快，导致我来不及点取消获取按钮，数据就获取成功了
                cancelGetMsg () {
                    // 在这里去判断你的id 1 2 3，你默认是展示的tab1，点击的时候不管你上一个请求有没有执行完都去调用这个cancel()，
                    this.cancel()
                    }
        }
    6.本地请求json,直接把json放在本地静态资源文件夹,get请求(url:'xxx.json')即可

# 代理配置

1. "proxy":"http://localhost:5000" package.json 中最后一行,此时代表脚手架开启了一个静态服务器 (即 public 文件夹),用于转发代理,先看 3000 下的，3000 没有再转发给 5000;此方法只能配置一个代理
2. 在 src 下新建文件 setupProxy.js(建立代理)

## 2.例子

        const proxy = require('http-proxy-middleware');
        module.exports = function (app) {
            app.use(
                proxy(
                    '/api1',//加api1触发转发
                    {
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                    pathRewrite:{'^/api1':''}//把url的/api1改为''
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

# 小提示

a 标签 必须加 rel="noreferrer"
连续解构赋值 const {data:{ name, url }} = props
连续解构赋值+重命名 const {data:{ name:names, url:urls }} = props

# fetch 发请求(关注分离思想)

            // fetch("http://localhost:5000/getjson")
            .then(
            //     (res) => { console.log(res);
            //         return res.json() })
            .then(
            //             (data) => {
            //                 console.log(data) })
           .catch(
               (err) => {
            //                      console.log(err) })

# 路由

 SPA（单页面应用）(多组件)

## 路由理解

    1.路由是一个映射关系
    2.key路径,value可能是function或者component
    3. 路由分为前端路由和后端路由

## 路由原理

    前端路由靠的是历史记录 history
        History.creatrHashHistory()可以直接使用h5推出的history上的api
        即BrowserRouter使用的是H5的history Api，不兼容ie9以及以下版本,刷新无影响,state保存在history
        hash #兼容性好使用的是URL的哈希值,刷新会丢失state参数

## react-router(react 插件库)

        分为
        1.reac-router-dom(web)
        2.native
        3.



         BrowserRouter(History) 每个BroserRouter是独立的
         HashRouter(hash)
         Link   路由跳转
         Router 路由匹配
         路由组件会使得子组件收到默认props(包含history,location,match)
         普通组件会使得子组件收到空的props
       history:
            go: ƒ go(n)
            goBack: ƒ goBack()
            goForward: ƒ goForward()
            push: ƒ push(path, state)
            replace: ƒ replace(path, state)
        location:
            pathname: "/"
            search: ""
            state: undefined
        match:
            isExact: true(模糊匹配精准匹配)
            params: {}
            path: "/"
            url: "/"





    NavLink对比Link 点击时默认添加样式active activeClassName='class' 可以修改默认添加的样式名
    可将active放到index中
    多次NavLink封装
    react-router如果不再swich中则匹配之后则不会继续向下匹配,swich注意只包裹注册的路由

    如果请求http://localhost:3000/api/favicon.ico 此时不存在则返回pulic下的index.html


    exact严格匹配只要不出现问题，就不开（嵌套页面时开启，如/home/about,则/home会匹配失败）
    Redirect/匹配不上路由时，重定向

## 嵌套路由|路由传参

### 携带 params 参数

<MyNavLink to={`/api/home/todo/${value.id}`}>{value.title}</MyNavLink>
<Route path="/api/home/todo/:id" component={Todo1} />
const {match:{params:{id,title}}}=props {id}使用即可

### 携带 search 参数(会导致样式出现问题？，二级路由点击一个，其他的也会出现样式)

<MyNavLink to={`/api/home/todo?id=${value.id}&${value.title}`}>{value.title}</MyNavLink>
<Route path="/api/home/todo" component={Todo1} />
const {location:{search}}=props  
search 为?id=03&消息 3 (即 urlencoded 编码格式)
需要使用 queryString(qs)库
const {location:{search}}=props
const{id,title}=qs.parse(search.slice(1))

### 携带 state 参数（刷新不丢失，因为 location 在 history 中，其一直在维护 history,但是清理数据会导致 history 丢失，所以要加上||{}防止报错）

<MyNavLink to={{
                 pathname: "/api/home/todo",
                  state: value
              }}>{value.title}</MyNavLink>
<Route path="/api/home/todo" component={Todo1} />
const {location:{state}}=props
const{id,title}=state||{}

## 路由跳转

push/replace(默认为 push,会形成历史记录,replace 会替换历史记录栈顶的记录)
<MyNavLink replace></MyNavLink>//此时就会开启 replace

## 编程样式路由
  ### 基础跳转
  props.history.push(`/home${id}`);
  props.history.replace(`/home?id=${id}`);
  props.history.push({
    pathname:'/home',// 跳转地址
    state:{// 传参对象
      id,
      name: '车型分类'
    },
  })

  获取路由参数（同传参）

  前进x步
  props.history.go(Number)
   前进
  props.history.goForward()
   前进x步
  props.history.goBack()
 ### 监听路由参数变化
componentWillReceiveProps(nextProps) {
  console.log(nextProps.history.location.state,'nextProps');
}
### withRouter
withRouter, 将一个组件包裹进Route里面, 
然后react-router的三个对象history, location, match就会被放进这个组件的props属性中,
就可以使得普通组件调用路由的方法
import {withRouter} from 'react-router-dom'
export default withRouter(组件)


 该库配合redux开发者工具
 //yarn add redux-devtools-extension
 在sotre.js中
    import { composeWithDevTools } from 'redux-devtools-extension'
    export default createStore(allReducer,composeWithDevTools(applyMiddleware(thunk)));
