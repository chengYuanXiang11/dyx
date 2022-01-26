# axios流程
            AXIOS

        创建AXIOS实例intance,并且拷贝AXIOS原型和实例上的属性和方法
                    intance的this指向 AXIOS.prototype.request
    axios       axios.create
            ||
        createInstance() axios = intance，但axios有独特属性CancelToken,all等
            ||
config  => 执行方法axios({...})
(配置对象)  
            ||
        AXIOS.prototype.request
            ||
        mergeConfig合并config
            ||
        连接拦截器中间件chain        // 最后chain为
                                    // [
                                    //   res[1].fulfilled,//请求拦截
                                    //   res[1].rejected,
                                    //   res[0].fulfilled,
                                    //   res[0].rejected,
                                    //   dispatchRequest,//处理数据transformData，
                                    //   undefined,
                                    //   rej[0].fulfilled,//响应拦截
                                    //   rej[0].rejected,
                                    //   rej[1].fulfilled,
                                    //   rej[1].rejected
                                     // ]
             ||
        判断环境adapter,发请求
             ||
        promise = promise.then(chain.shift(), chain.shift());
        拦截器两个一组执行添加到.then
             ||
        自己制定的回调



        配置cancelToken对象是,保存cancel函数
         此函数 创建了一个用于中断请求的cancelPromise
                定义了一个用于取消请求的cancel函数
        cancel函数，执行会传入错误信息给token.reason
                        中断请求并且使得cancelPomise变为成功,
                        然后执行.then返回失败promise，失败信息(参数)为token.reason